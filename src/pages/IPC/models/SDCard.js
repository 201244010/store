import { MESSAGE_TYPE } from '@/constants';

const formatCode = '0x3058';
const changeStatusCode = '0x3057';

// const Status = {
// 	NO_SDCARD: 0,
// 	NEED_FORMAT: 1,
// 	FORMATED: 2,	//正常状态
// 	UNKNOWN: 3
// };

export default {
    namespace: 'sdcard',
    state: [],
    reducers: {
        init(state, action) {
            const { payload } = action;
            const sdcard = payload.map(item => ({
                sn: item.sn,
                deviceId: item.deviceId,
                isOnline: item.isOnline,
                status: -1,
                formatResponse: false,
            }));
            return sdcard;
        },
        changeStatus(state, action) {
            const { sn, status } = action;
            state.forEach(item => {
                if (item.sn === sn) {
                    item.status = status;
                }
            });
        },
        formatResponse(state, action) {
            const { sn, status } = action;
            state.forEach(item => {
                if (item.sn === sn) {
                    item.formatResponse = true;
                    item.status = status;
                }
            });
        },
        resetformatResponse(state, action) {
            const { sn } = action;
            state.forEach(item => {
                if (item.sn === sn) {
                    item.formatResponse = false;
                    item.status = -1;
                }
            });
        },
        resetStatus(state, action) {
            const { sn } = action;
            state.forEach(item => {
                if (item.sn === sn) {
                    item.status = -1;
                }
            });
        },
    },
    effects: {
        *read(_, { put, select }) {
            const ipcList = yield select(state => state.ipcList);
            yield put({
                type: 'init',
                payload: ipcList,
            });
        },
        *formatSdCard(action, { put }) {
            const { sn } = action;

            const topicPublish = yield put.resolve({
                type: 'mqttIpc/generateTopic',
                payload: {
                    deviceType: 'SS1',
                    messageType: 'request',
                    method: 'pub',
                },
            });

            yield put({
                type: 'mqttIpc/publish',
                payload: {
                    topic: topicPublish,
                    message: {
                        opcode: formatCode,
                        param: {
                            sn,
                        },
                    },
                },
            });
        },
    },
    subscriptions: {
        setup({ dispatch }) {
            const listeners = [
                {
                    opcode: changeStatusCode,
                    models: ['FS1', 'SS1'],
                    type: MESSAGE_TYPE.EVENT,
                    handler: (topic, message) => {
                        const { sn } = message.data;
                        const status = message.data.sd_status_code;
                        dispatch({
                            type: 'changeStatus',
                            sn,
                            status,
                        });
                    },
                },
                {
                    opcode: formatCode,
                    models: ['FS1', 'SS1'],
                    type: MESSAGE_TYPE.RESPONSE,
                    handler: (topic, message) => {
                        const { sn } = message.data;
                        const status = message.data.sd_status_code;
                        dispatch({
                            type: 'formatResponse',
                            sn,
                            status,
                        });
                    },
                },
            ];
            dispatch({
                type: 'mqttIpc/addListener',
                payload: listeners,
            });
        },
    },
};
