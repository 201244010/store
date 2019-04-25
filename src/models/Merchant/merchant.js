import * as Actions from '@/services/Merchant/merchant';
import { ERROR_OK } from '@/constants/errorCode';
import { message } from 'antd';
import { formatMessage } from 'umi/locale';
import router from 'umi/router';
import Storage from '@konata9/storage.js';
import { MENU_PREFIX } from '@/constants';

export default {
    namespace: 'merchant',
    state: {
        currentCompanyId: Storage.get('__company_id__'),
        companyList: Storage.get('__company_list__') || [],
        companyInfo: {},
        loading: false,
    },

    effects: {
        *initialCompany({ payload = {} }, { call }) {
            const { options = {} } = payload;
            yield call(Actions.initialCompany, options);
        },

        *companyCreate({ payload }, { call }) {
            const response = yield call(Actions.companyCreate, payload);
            if (response && response.code === ERROR_OK) {
                message.success(formatMessage({ id: 'create.success' }));
                const data = response.data || {};
                Storage.set({ __company_id__: data.company_id });
            }
            return response;
        },

        *getCompanyList(_, { call, put }) {
            const response = yield call(Actions.getCompanyList);
            if (response && response.code === ERROR_OK) {
                const result = response.data || {};
                const companyList = result.company_list || [];
                Storage.set({ __company_list__: companyList });
                yield put({
                    type: 'updateState',
                    payload: {
                        companyList,
                    },
                });
                yield put({
                    type: 'initialCompany',
                    payload: {
                        options: {
                            company_id_list: companyList.map(company => company.company_id),
                        },
                    },
                });
            } else {
                router.push('/user/login');
            }
            return response;
        },

        *companyGetInfo(_, { call, put }) {
            const response = yield call(Actions.companyGetInfo);
            yield put({
                type: 'updateState',
                payload: { loading: true },
            });
            if (response && response.code === ERROR_OK) {
                const result = response.data || {};
                yield put({
                    type: 'updateState',
                    payload: { companyInfo: result, loading: false },
                });
            } else {
                yield put({
                    type: 'updateState',
                    payload: { loading: false },
                });
            }
        },

        *companyUpdate({ payload }, { call, put }) {
            const { options } = payload;
            yield put({
                type: 'updateState',
                payload: { loading: true },
            });
            const response = yield call(Actions.companyUpdate, options);
            if (response && response.code === ERROR_OK) {
                yield put({
                    type: 'updateState',
                    payload: { companyInfo: options, loading: false },
                });
                message.success(formatMessage({ id: 'modify.success' }));
                router.push(`${MENU_PREFIX.MERCHANT}/view`);
            } else {
                yield put({
                    type: 'updateState',
                    payload: { loading: false },
                });
            }
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
    },
};
