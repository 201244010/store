import * as Actions from '@/services/mqtt';
// import { ERROR_OK, SHOW_VCODE, VCODE_ERROR } from '@/constants/errorCode';

export default {
    namespace: 'mqtt',
    state: {
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
        *createClient(_, { call, select }) {
            const { mqttToken } = yield select(state => state.user);
            const client = yield call(Actions.createClient, mqttToken);

            console.log(client);
        },

        *connectClient(_, { call, select }) {
            const { connectStatus } = yield select(state => state.mqtt);
            yield call(Actions.connectClient, connectStatus);
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

        *subscribe(
            {
                payload: { topic },
            },
            { call }
        ) {
            console.log('subscribe');
            yield call(Actions.subscribe, topic);
        },
        *publish(
            {
                payload: { topic, message },
            },
            { call }
        ) {
            yield call(Actions.publish, topic, message);
        },
        *initListener(state, { call }) {
            yield call(Actions.registMessageHandler);
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
        handleError() {
            Actions.registErrorHandler(error => {
                console.log('do in error handler', error);
                // TODO 对于错误时的处理
            });
        },
    },
};
