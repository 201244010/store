import * as Actions from '@/services/mqtt';
// import moment from 'moment';
import { ERROR_OK, SHOW_VCODE, VCODE_ERROR } from '@/constants/errorCode';

export default {
    namespace: 'mqtt',
    state: {
        connectStatus: {
            connecting: false,
            connected: true,
        },
        messages: {
            id: 0,
        },
        clientOpts: {
            username: '',
            password: '',
            address: '',
            clientId: '',
            created: false,
            connected: false,
        },
    },
    effects: {
        *sendCode({ payload }, { call, put }) {
            const { options } = payload;
            const response = yield call(Actions.sendCode, options);
            if (response && response.code === ERROR_OK) {
                yield put({
                    type: 'setImgCode',
                    payload: {
                        needImgCaptcha: false,
                        imgCaptcha: {},
                    },
                });
            } else if (response && [SHOW_VCODE, VCODE_ERROR].includes(response.code)) {
                const result = response.data || {};
                yield put({
                    type: 'setImgCode',
                    payload: {
                        needImgCaptcha: true,
                        imgCaptcha: {
                            key: result.key || '',
                            url: `data:image/png;base64,${result.url}` || '',
                        },
                    },
                });
            }
            return response;
        },

        *checkUser({ payload }, { call, put }) {
            const { options } = payload;
            const response = yield call(Actions.checkUser, options);
            yield put({
                type: 'checkUserStatus',
            });
            return response;
        },

        *getImageCode(_, { call, put }) {
            const response = yield call(Actions.getImageCode);
            if (response && response.code === ERROR_OK) {
                const result = response.data || {};
                yield put({
                    type: 'saveImageCode',
                    payload: {
                        key: result.key,
                        url: `data:image/png;base64,${result.url}` || '',
                    },
                });
            }
        },

        *verifyCode({ payload }, { call }) {
            const { options } = payload;
            const response = yield call(Actions.verifyCode, options);
            return response;
        },
    },

    reducers: {
        updateState(state, action) {
            return {
                ...state,
                ...action.payload,
            };
        },
        checkUserStatus(state) {
            return {
                ...state,
            };
        },
        setImgCode(state, action) {
            return {
                ...state,
                ...action.payload,
            };
        },
        saveImageCode(state, action) {
            return {
                ...state,
                imgCode: {
                    ...state.imgCode,
                    ...action.payload,
                },
            };
        },
    },
};
