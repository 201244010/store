import * as Actions from '@/services/Merchant/merchant';
import { ERROR_OK } from '@/constants/errorCode';
import { message } from 'antd';
import { formatMessage } from 'umi/locale';
import router from 'umi/router';

export default {
    namespace: 'merchant',
    state: {
        companyList: [],
        companyInfo: {},
    },

    effects: {
        *companyCreate({ payload }, { call }) {
            const response = yield call(Actions.companyCreate, payload);
            if (response && response.code === ERROR_OK) {
                message.success(formatMessage({ id: 'create.success' }));
            }
        },

        *getCompanyList(_, { call, put }) {
            const response = yield call(Actions.getCompanyList);
            if (response && response.code === ERROR_OK) {
                const result = response.data || {};
                yield put({
                    type: 'updateState',
                    payload: {
                        companyList: result.company_list || [],
                    },
                });
            } else {
                router.push('/user/login');
            }
            return response;
        },

        *companyGetInfo({ payload }, { call, put }) {
            const { options } = payload;
            const response = yield call(Actions.companyGetInfo, options);
            if (response && response.code === ERROR_OK) {
                const result = response.data || {};
                yield put({
                    type: 'saveCompanyInfo',
                    payload: result,
                });
            }
        },

        *companyUpdate({ payload }, { call, put }) {
            const { options } = payload;
            const response = yield call(Actions.companyUpdate, options);
            if (response && response.code === ERROR_OK) {
                yield put({
                    type: 'saveCompanyInfo',
                    payload: options,
                });
                message.success(formatMessage({ id: 'modify.success' }));
                router.push('/basicData/merchantManagement/view');
            } else {
                message.error(formatMessage({ id: 'modify.fail' }));
            }
        },
    },

    reducers: {
        saveCompanyInfo(state, action) {
            return {
                ...state,
                companyInfo: {
                    ...action.payload,
                },
            };
        },
    },
};
