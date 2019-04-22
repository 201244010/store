import * as Action from '@/services/storeManagement/storeList';
import { ERROR_OK } from '@/constants/errorCode';
import { message } from 'antd';

export default {
    namespace: 'store',
    state: {
        getList: {
            data: [],
        },
        getOption: {},
        alter: {
            name: '',
            type: '',
            status: 1,
            address: '',
            time: '',
            contactPerson: '',
            contactPhone: '',
            shopId: '',
            createdTime: '',
            modifiedTime: '',
        },
    },

    effects: {
        *getArray({ payload }, { call, put }) {
            const { options } = payload;
            const response = yield call(Action.getList, options);
            if (response && response.code === ERROR_OK) {
                yield put({
                    type: 'getStoreList',
                    payload: {
                        data: response,
                        request: options,
                    },
                });
            }
        },

        *createNewStore({ payload }, { call, put }) {
            const { options } = payload;
            const response = yield call(Action.createStore, options);
            if (response && response.code === ERROR_OK) {
                message.success('创建成功');
                yield put({
                    type: 'alterNewStore',
                    payload: {
                        data: options,
                    },
                });
            }
        },

        *getStoreInformation({ payload }, { call, put }) {
            const { options } = payload;
            const response = yield call(Action.storeInformation, options);
            if (response && response.code === ERROR_OK) {
                yield put({
                    type: 'saveNewStore',
                    payload: {
                        data: response,
                    },
                });
            }
        },

        *alterStoreInformation({ payload }, { call, put }) {
            const { options } = payload;
            const response = yield call(Action.alterStore, options);
            if (response && response.code === ERROR_OK) {
                message.success('修改成功');
                yield put({
                    type: 'alterStore',
                    payload: {
                        data: response,
                    },
                });
            }
        },
    },

    reducers: {
        getStoreList(state, action) {
            const {
                payload: { data },
            } = action;
            const arrayList = data.data.shop_list;
            let array = [];
            array = arrayList.map(value => ({
                address: value.address,
                status: value.status,
                shopId: value.id,
                name: value.name,
                type: value.type_name,
                contactPerson: value.contact_person,
                key: value.id,
            }));
            return {
                ...state,
                getList: {
                    data: array,
                },
            };
        },
        saveNewStore(state, action) {
            const store = action.payload.data.data;
            return {
                ...state,
                alter: {
                    name: store.shop_name,
                    type: store.type_name,
                    status: store.business_status,
                    address: store.address,
                    time: store.business_hours,
                    contactPerson: store.contact_person,
                    contactPhone: store.contact_tel,
                    shopId: store.shop_id,
                    createdTime: store.created_time,
                    modifiedTime: store.modified_time,
                },
            };
        },
        alterStore(state) {
            return {
                ...state,
            };
        },
    },
};
