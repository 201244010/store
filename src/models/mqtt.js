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
    },

    reducers: {
        updateState(state, action) {
            return {
                ...state,
                ...action.payload,
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
