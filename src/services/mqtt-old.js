import MQTT from 'mqtt';
import { RECONNECT_LIMIT, MESSAGE_TYPE } from '@/constants';
import { ERROR_OK } from '@/constants/errorCode';
import moment from 'moment';
// import { getMqttToken as getStoreMqttToken } from './user';

const config = {
    qos: 0,
};
const messages = {
    id: 0,
};

const CLIENT_INFO_TEMPLATE = {
    clientInfo: {
        clientId: null,
        username: null,
        password: null,
        address: null,
    },
    listenerStack: [],
    subscribeStack: [],
    publishStack: [],
};

const CLIENT_TEMPLATE = {
    category: null,
    msgId: 0,
    client: null,
    reconnectTimes: 0,
};

const clientMap = new Map();
const clientInfoMap = new Map();

// TODO 临时测试用
const mqttToken = {
    clientId: 'mqttjs_9469ba8e65',
    username: 'WEB_6666',
    password: '123456',
    address: 'ws://47.96.240.44:30214',
};

const createClient = (category = 'store') => {
    const token = clientInfoMap.get(category);

    if (token) {
        // const { address, username, password, clientId } = token;
        // TODO 临时测试用
        const { address, username, password, clientId } = mqttToken;
        const client = MQTT.connect(
            address,
            {
                clientId,
                username,
                password,
                clean: true,
                path: '/mqtt',
            }
        );
        return clientMap.set(category, { ...CLIENT_TEMPLATE, category, client });
    }

    return clientMap.set(category, { ...CLIENT_TEMPLATE });
};

const initializeClientInfo = async (category = 'store') => {
    // let fetchHandler = '';
    // TODO 为获取不同类别的 client 做预留
    // if (category === 'store') {
    //     fetchHandler = getStoreMqttToken;
    // }

    // const response = await fetchHandler();
    const response = { code: ERROR_OK };
    if (response && response.code === ERROR_OK) {
        const { data = {} } = response;
        const { username, password, address } = data;
        const clientId = `${username}_${moment().format('X')}`;
        return clientInfoMap.set(category, {
            ...CLIENT_INFO_TEMPLATE,
            clientId,
            username,
            password,
            address,
        });
    }

    return clientInfoMap.set(category, { ...CLIENT_INFO_TEMPLATE });
};

export const initializeMqttClients = async (categorys = ['store']) => {
    await Promise.all([...categorys.map(category => initializeClientInfo(category))]);
    await Promise.all([...categorys.map(category => createClient(category))]);
};

export const getClient = (category = 'store') => clientMap.get(category);

export const subscribe = (topic, category = 'store') => {
    const [clientInfo, clientData] = [clientInfoMap.get(category), clientMap.get(category)];
    const { client } = clientData;
    const { subscribeStack } = clientInfo;
    if (client.connected) {
        console.log('before subscribe, topic: ', topic);
        client.subscribe(topic, config, () => {
            console.log('subscribe', topic);
        });
    } else {
        clientInfoMap.set(category, {
            ...clientInfo,
            subscribeStack: [...new Set(subscribeStack.push(JSON.stringify(topic)))],
        });
    }
};

export const publish = (topic, message, category = 'store') => {
    const [clientInfo, clientData] = [clientInfoMap.get(category), clientMap.get(category)];
    const { client } = clientData;
    const { publishStack } = clientInfo;
    messages.id += 1;

    const msg = JSON.stringify({
        msg_id: messages.id,
        params: Array.isArray(message) ? [...message] : [message],
    });
    if (client.connected) {
        client.publish(topic, msg, config, () => {
            console.log('publish', topic, msg);
        });
    } else {
        clientInfoMap.set(category, {
            ...clientInfo,
            publishStack: [...new Set(publishStack.push(JSON.stringify({ topic, message })))],
        });
    }
};

export const connectClient = async (category = 'store') => {
    console.log('in connect');
    const [clientInfo, clientData] = [clientInfoMap.get(category), clientMap.get(category)];
    const { subscribeStack, publishStack } = clientInfo;
    const { client } = clientData;

    return new Promise(resolve => {
        console.log('before connect');
        client.on('connect', () => {
            console.log('mqtt connect');
            clientInfoMap.set(category, {
                ...clientInfo,
                reconnectTimes: 0,
            });

            if (subscribeStack.length > 0) {
                subscribeStack.forEach(itemStr => {
                    const item = JSON.parse(itemStr);
                    subscribe(category, item.topic);
                });
                subscribeStack.splice(0, subscribeStack.length);
            }

            if (publishStack.length > 0) {
                publishStack.forEach(itemStr => {
                    const item = JSON.parse(itemStr);
                    publish(category, item.topic, item.message);
                });
                publishStack.splice(0, publishStack.length);
            }

            resolve(true);
        });

        client.on('reconnect', () => {
            const currentClientData = clientMap.get(category);
            const { reconnectTimes: currentReconnectTimes } = currentClientData;
            console.log('mqtt reconnect');
            clientMap.set(category, {
                ...clientData,
                reconnectTimes: currentReconnectTimes + 1,
            });
        });

        client.on('close', () => {
            const currentClientData = clientMap.get(category);
            const { reconnectTimes: currentReconnectTimes } = currentClientData;
            console.log('mqtt connection close. times: ', currentReconnectTimes);
            if (currentReconnectTimes > RECONNECT_LIMIT) {
                // 重连10次终止
                client.end(true);
                clientMap.set(category, {
                    ...currentClientData,
                    reconnectTimes: 0,
                });
            }
        });

        client.on('end', () => {
            console.log('mqtt connection end');
            resolve(false);
        });

        client.on('message', (topic, message) => {
            console.log(
                'mqtt message received: topic: ',
                topic,
                ' - message: ',
                message.toString()
            );
        });
    });
};

export const registErrorHandler = (action, category = 'store') => {
    const clientData = clientMap.get(category);
    const { client } = clientData;

    console.log('regist error handler');
    if (client && client.on) {
        client.on('error', error => {
            action(error);
        });
    }
};

const handleMessage = (
    data,
    opcode,
    errcode,
    messageType,
    deviceType,
    topic,
    category = 'store'
) => {
    const clientInfo = clientInfoMap.get(category);
    const { listenerStack } = clientInfo;

    const listeners = listenerStack.filter(item => {
        const models = Array.isArray(item.models) ? item.models : [item.models];
        return (
            item.type === messageType && item.opcode === opcode && models.indexOf(deviceType) >= 0
        );
    });

    listeners.forEach(listener => {
        listener.handler(topic, {
            errcode,
            data,
        });
    });
};

export const registMessageHandler = (category = 'store') => {
    const clientData = clientMap.get(category);
    const { client } = clientData;
    // 被model监听入口
    console.log('regist message handler');
    if (client.on) {
        // 若init请求失败，则无法被初始化client
        client.on('message', (topic, message) => {
            const msg = JSON.parse(message.toString());
            console.log('in message read handler', msg);
            // TODO 等待实际返回结果来修改
            const messageType = topic.split('/')[5];
            const deviceType = topic.split('/')[4];
            const { params, data } = msg;

            switch (messageType) {
                case MESSAGE_TYPE.EVENT:
                case MESSAGE_TYPE.REQUEST:
                    params.forEach(({ param, opcode, errcode }) => {
                        handleMessage(
                            param,
                            opcode,
                            errcode,
                            messageType,
                            deviceType,
                            topic,
                            category
                        );
                    });
                    break;
                case MESSAGE_TYPE.RESPONSE:
                    data.forEach(({ result, opcode, errcode }) => {
                        handleMessage(
                            result,
                            opcode,
                            errcode,
                            messageType,
                            deviceType,
                            topic,
                            category
                        );
                    });
                    break;
                default:
            }
            console.log('in promise ready to model');
        });
    }

    return client;
};

export const listen = (listeners, category = 'store') => {
    const clientInfo = clientInfoMap.get(category);
    const { listenerStack } = clientInfo;

    listeners.forEach(({ opcode, handler, models, type }) => {
        let deviceType = [];

        if (models) {
            deviceType = Array.isArray(models) ? models : [models];
        }

        const hasNotAdded = listenerStack.every(listener => {
            listener.models.sort();
            deviceType.sort();
            if (
                listener.opcode === opcode &&
                listener.type === type &&
                JSON.stringify(listener.models) === JSON.stringify(deviceType)
            ) {
                listener.handler = handler;
                return false;
            }
            return true;
        });

        if (hasNotAdded) {
            listenerStack.push({
                models: deviceType,
                type,
                opcode,
                handler,
            });

            clientInfoMap.set(category, {
                ...clientInfo,
                listenerStack,
            });
        }
    });
};
