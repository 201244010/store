import * as Actions from '@/services/mqtt-old';
// import { notification } from 'antd';
// import { ERROR_OK, SHOW_VCODE, VCODE_ERROR } from '@/constants/errorCode';

export default {
    namespace: 'mqtt',
    state: {
        emit: false,
        connectStatus: {
            connecting: false,
            connected: true,
            reconnectTimes: 0,
        },
        messages: {
            id: 0,
        },
    },
    effects: {
        *initializeMqttClients(_, { call }) {
            yield call(Actions.initializeMqttClients);
        },

        *connectClient(payload, { call }) {
            const { category } = payload;
            yield call(Actions.connectClient, category);
        },

        *generateTopic(
            {
                payload: { deviceType, messageType, method },
            },
            { select, take }
        ) {
            const { userId, clientId, created } = yield select(state => ({
                userId: state.user.id,
                created: state.mqtt.created,
                clientId: state.mqtt.clientId,
            }));

            if (!created) {
                const {
                    payload: { clientId: newClientId },
                } = yield take('updateInfo');
                return `/WEB/${userId}/${newClientId}/${deviceType}/${messageType}/${method}`;
            }
            return `/WEB/${userId}/${clientId}/${deviceType}/${messageType}/${method}`;
        },

        *getClientId(_, { select, take }) {
            const { clientId, created } = yield select(state => ({
                created: state.mqtt.created,
                clientId: state.mqtt.clientId,
            }));

            if (created) {
                return clientId;
            }

            const {
                payload: { clientId: newClient },
            } = yield take('updateInfo');
            return newClient;
        },

        *subscribe({ payload }, { call }) {
            const { topic, category } = payload;
            console.log(payload);
            console.log('subscribe');
            yield call(Actions.subscribe, topic, category);
        },

        *publish({ payload }, { call }) {
            const { topic, message, category } = payload;
            yield call(Actions.publish, topic, message, category);
        },

        *initListener({ payload }, { call, put }) {
            const { category } = payload;
            const client = yield call(Actions.registMessageHandler, category);
            client.on('message', (topic, message) => {
                console.log('in model', topic, message.toString());

                put({
                    type: 'updateState',
                    payload: {
                        emit: true,
                    },
                });

                console.log('updated');
            });
        },
    },

    reducers: {
        updateState(state, action) {
            return {
                ...state,
                ...action.payload,
            };
        },
        updateInfo(state, { payload }) {
            return {
                ...state,
                ...payload,
            };
        },
    },

    subscriptions: {
        // handleError() {
        //     Actions.registErrorHandler(error => {
        //         console.log('do in error handler', error);
        //         // TODO 对于错误时的处理
        //     }, 'store');
        // },
    },
};
