import * as Action from '@/services/storeManagement/storeList';
import { ERROR_OK } from '@/constants/errorCode';
import { formatMessage } from 'umi/locale';
import { message } from 'antd';
import router from 'umi/router';
import Storage from '@konata9/storage.js';

export default {
    namespace: 'store',
    state: {
        storeList: Storage.get('__shop_list__') || [],
        // TODO 下一个准备修改
        getList: {
            data: [],
        },
        loading: false,
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
        *getStoreList({ payload }, { call, put }) {
            const { options } = payload;
            yield put({
                type: 'updateState',
                payload: { loading: true },
            });
            const response = yield call(Action.getList, options);
            if (response && response.code === ERROR_OK) {
                const data = response.data || {};
                Storage.set({ __shop_list__: data.shop_list || [] });
                console.log(response);
                yield put({
                    type: 'updateState',
                    payload: {
                        loading: false,
                        storeList: data.shop_list || [],
                    },
                });
            }
            return response;
        },

        *getArray({ payload }, { call, put }) {
            const { options } = payload;
            const response = yield call(Action.getList, options);
            if (response && response.code === ERROR_OK) {
                yield put({
                    type: 'saveStoreList',
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
                message.success(formatMessage({ id: 'storeManagement.message.createSuccess' }));
                const data = response.data || {};
                Storage.set({ __shop_id__: data.shop_id });
                yield put({
                    type: 'alterNewStore',
                    payload: {
                        data,
                    },
                });
                router.push('/');
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
                message.success(formatMessage({ id: 'storeManagement.message.alterSuccess' }));
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
        updateState(state, action) {
            return {
                ...state,
                ...action.payload,
            };
        },

        saveStoreList(state, action) {
            const {
                payload: { data },
            } = action;
            const arrayList = data.data.shop_list;
            let array = [];
            array = arrayList.map(value => ({
                address: value.address,
                status: value.business_status,
                shopId: value.shop_id,
                name: value.shop_name,
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
