import * as Actions from '@/services/Merchant/merchant';
import { ERROR_OK } from '@/constants/errorCode';
import router from 'umi/router';

export default {
    namespace: 'merchant',
    state: {
        companyList: [],
        companyInfo: {
            company_no: '123456',
            company_name: '星巴克上海管理有限公司',
            contact_person: '叶宿',
            contact_tel: '021-68888888',
            contact_email: 'admin@Starbucks.com',
            created_time: 1542952913,
            modified_time: 1542952913,
        },
    },

    effects: {
        // *companyCreate({ payload }, { call}) {
        //   const { options } = payload;
        // //   const response = yield call(Actions.companyCreate, options);
        // //   if (response && response.code === ERROR_OK) {
        // //   }
        // },
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
                    payload: {
                        data: result,
                    },
                });
            }
        },

        *companyUpdate({ payload }, { call, put }) {
            const { options } = payload;
            const response = yield call(Actions.companyUpdate, options);
            if (response && response.code === ERROR_OK) {
                // const result = response.data || {};
                yield put({
                    type: 'saveCompanyInfo',
                    payload: {
                        data: options,
                    },
                });
            }
        },
    },

    reducers: {
        saveCompanyInfo(state) {
            return {
                ...state,
                // ...action.payload,
            };
        },
    },
};
