import MqttModel from '@/services/Mqtt/MqttModel';
import moment from 'moment';
import { customizeFetch } from '@/utils/fetch';
import { IPC_SERVER } from '@/config';

export const MESSAGE_TYPE = {
    EVENT: 'event',
    REQUEST: 'request',
    RESPONSE: 'response',
};

const fetchApi = customizeFetch('ipc/api/mqtt/token', IPC_SERVER);

const namespace = 'mqttIpc';
const model = new MqttModel(namespace);

const createApi = async () => {
    const response = await fetchApi('create', {
        body: {
            source: 'WEB',
        },
    });

    const result = response.json();

    return result.then(d => {
        if (d.code === 1) {
            const { data } = d;
            return {
                username: data.username,
                address: data.server_address,
                password: data.password,
                clientId: `${data.username}_${moment().format('X')}`,
            };
        }
        return {};
    });
};

export default {
    namespace,
    state: {},
    reducers: {
        ...model.reducers(),
    },
    effects: {
        ...model.effects(),
        *create(_, { call, put }) {
            const response = yield call(createApi);
            // console.log(response);
            yield put({
                type: 'updateInfo',
                payload: response,
            });
        },
        *getClientId(_, { select, take }) {
            const { clientId, created } = yield select(state => ({
                created: state[namespace].created,
                clientId: state[namespace].clientId,
            }));
            let id = '';
            if (created) {
                id = clientId;
            } else {
                const { payload } = yield take('updateInfo');
                id = payload.clientId;
            }
            return id;
        },
        *generateTopic(
            {
                payload: { deviceType, messageType, method },
            },
            { select, take, put }
        ) {
            const userInfo = yield put.resolve({
                type: 'user/getUserInfoFromStorage',
            });

            const { id } = userInfo;

            const { userId, clientId, created } = yield select(state => ({
                // userId: state.user.id,
                userId: id,
                created: state[namespace].created,
                clientId: state[namespace].clientId,
            }));
            // console.log(userId, created, clientId);
            if (!created) {
                const { payload } = yield take('updateInfo');
                return `/WEB/${userId}/${payload.clientId}/${deviceType}/${messageType}/${method}`;
            }
            return `/WEB/${userId}/${clientId}/${deviceType}/${messageType}/${method}`;
        },

        registerMessageHandler() {
            model.client.registerMessageHandler((topic, message, listenerStack) => {
                const msg = JSON.parse(message.toString());

                const messageType = topic.split('/')[5];
                const deviceType = topic.split('/')[4];

                const handler = (data, opcode, errcode, msgType, dvcType) => {
                    const listeners = listenerStack.filter(item => {
                        const models = Array.isArray(item.models) ? item.models : [item.models];
                        return (
                            item.type === msgType &&
                            item.opcode === opcode &&
                            models.indexOf(dvcType) >= 0
                        );
                    });

                    listeners.forEach(listener => {
                        listener.handler(topic, {
                            errcode,
                            data,
                        });
                    });
                };

                switch (messageType) {
                    case MESSAGE_TYPE.EVENT:
                    case MESSAGE_TYPE.REQUEST:
                        // const { params } = msg;
                        msg.params.forEach(({ param, opcode, errcode }) => {
                            handler(param, opcode, errcode, messageType, deviceType);
                        });

                        break;
                    case MESSAGE_TYPE.RESPONSE:
                        // const { data } = msg;
                        msg.data.forEach(({ result, opcode, errcode }) => {
                            handler(result, opcode, errcode, messageType, deviceType);
                        });
                        break;
                    default:
                }
            });
        },

        addListener({ payload }) {
            const listeners = payload;

            const { listenerStack } = model.client;
            listeners.forEach(({ opcode, handler, models, type }) => {
                // const messageType = type === undefined ? [] : Array.isArray(type) ? type : [type];
                // const deviceType = models === undefined ? [] : Array.isArray(models) ? models : [models];
                // console.log(messageType);
                let deviceType = [];
                if (models === undefined) {
                    deviceType = [];
                } else {
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
        },
    },
};