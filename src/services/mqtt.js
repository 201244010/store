import MQTT from 'mqtt';
import { RECONNECT_LIMIT, MESSAGE_TYPE } from '@/constants';

const config = {
    qos: 0,
};
const messages = {
    id: 0,
};
const listenerStack = [];

let subscribeStack = [];
let publishStack = [];
let client = null;
let reconnectTimes = 0;

export const createClient = (mqttToken = {}) => {
    const { serverAddress, username, password, clientId } = mqttToken;
    client = MQTT.connect(
        serverAddress,
        {
            clientId,
            username,
            password,
            clean: true,
        }
    );
    return client;
};

export const subscribe = topic => {
    if (client.connected) {
        client.subscribe(topic, config, () => {
            console.log('subscribe', topic);
        });
    } else {
        subscribeStack = [...new Set(subscribeStack.push(JSON.stringify(topic)))];
    }
};

export const publish = (topic, message) => {
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
        publishStack = [...new Set(publishStack.push(JSON.stringify({ topic, message })))];
    }
};

export const connectClient = () =>
    new Promise(resolve => {
        client.on('connect', () => {
            console.log('mqtt connect');
            reconnectTimes = 0;

            if (subscribeStack.length > 0) {
                subscribeStack.forEach(itemStr => {
                    const item = JSON.parse(itemStr);
                    subscribe(item.topic);
                });
                subscribeStack.splice(0, subscribeStack.length);
            }

            if (publishStack.length > 0) {
                publishStack.forEach(itemStr => {
                    const item = JSON.parse(itemStr);
                    publish(item.topic, item.message);
                });
                publishStack.splice(0, publishStack.length);
            }

            resolve(true);
        });

        client.on('reconnect', () => {
            console.log('mqtt reconnect');
            reconnectTimes += 1;
        });

        client.on('close', () => {
            console.log('mqtt connection close');
            if (reconnectTimes > RECONNECT_LIMIT) {
                // 重连10次终止
                client.end(true);
                reconnectTimes = 0;
            }
        });

        client.on('end', () => {
            console.log('mqtt connection end');
            resolve(false);
        });

        client.on('message', (topic, message) => {
            console.log('mqtt message', topic, ':', message.toString());
        });
    });

export const registErrorHandler = action => {
    console.log('regist error handler');
    if (client && client.on) {
        client.on('error', error => {
            action(error);
        });
    }
};

const handleMessage = (data, opcode, errcode, messageType, deviceType, topic) => {
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

export const registerMessageHandler = () => {
    // 被model监听入口
    console.log('registerMessageHandler');
    if (client.on) {
        // 若init请求失败，则无法被初始化client
        client.on('message', (topic, message) => {
            const msg = JSON.parse(message.toString());

            // TODO 等待实际返回结果来修改
            const messageType = topic.split('/')[5];
            const deviceType = topic.split('/')[4];
            const { params, data } = msg;

            switch (messageType) {
                case MESSAGE_TYPE.EVENT:
                case MESSAGE_TYPE.REQUEST:
                    params.forEach(({ param, opcode, errcode }) => {
                        handleMessage(param, opcode, errcode, messageType, deviceType, topic);
                    });
                    break;
                case MESSAGE_TYPE.RESPONSE:
                    data.forEach(({ result, opcode, errcode }) => {
                        handleMessage(result, opcode, errcode, messageType, deviceType, topic);
                    });
                    break;
                default:
            }
        });
    }
};

export const listen = listeners => {
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
        }
    });
};
