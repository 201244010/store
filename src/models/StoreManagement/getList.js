import * as Action from '@/services/storeManagement/storeList';
import { ERROR_OK } from '@/constants/errorCode';
import { formatMessage } from 'umi/locale';
import { message } from 'antd';
import router from 'umi/router';
import typecheck from '@konata9/typecheck.js';
import Storage from '@konata9/storage.js';
import { MENU_PREFIX } from '@/constants';

const cascaderDataWash = (data, mapping) => {
    const formatData = [...data];
    return formatData.map(item => {
        const temp = { ...item };
        mapping.forEach(map => {
            if (temp[map.from]) {
                if (typecheck(temp[map.from]) === 'array') {
                    temp[map.to] = cascaderDataWash(temp[map.from], mapping);
                } else {
                    temp[map.to] = temp[map.from];
                }
            }
        });

        return temp;
    });
};

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
        shopType_list: Storage.get('__shopTypeList__', 'local') || [],
        regionList: Storage.get('__regionList__', 'local') || [],
        storeInfo: {},
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
                const shopList = data.shop_list || [];
                Storage.set({ __shop_list__: shopList });
                yield put({
                    type: 'updateState',
                    payload: {
                        loading: false,
                        storeList: shopList,
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

        *createNewStore({ payload }, { call }) {
            const { options } = payload;
            const response = yield call(Action.createStore, options);
            if (response && response.code === ERROR_OK) {
                message.success(formatMessage({ id: 'storeManagement.message.createSuccess' }));
                const data = response.data || {};
                if (!Storage.get('__shop_id__')) {
                    Storage.set({ __shop_id__: data.shop_id });
                }
                router.push(`${MENU_PREFIX.STORE}/list`);
            }
            return response;
        },

        *updateStore({ payload }, { call }) {
            const { options } = payload;
            const response = yield call(Action.alterStore, options);
            if (response && response.code === ERROR_OK) {
                message.success(formatMessage({ id: 'storeManagement.message.alterSuccess' }));
                router.push(`${MENU_PREFIX.STORE}/list`);
            }
            return response;
        },

        *getStoreDetail({ payload }, { call, put }) {
            const { options } = payload;
            const response = yield call(Action.storeInformation, options);
            if (response && response.code === ERROR_OK) {
                const data = response.data || {};
                yield put({
                    type: 'updateState',
                    payload: {
                        storeInfo: data,
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
                message.success(formatMessage({ id: 'storeManagement.message.alterSuccess' }));
                yield put({
                    type: 'alterStore',
                    payload: {
                        data: response,
                    },
                });
            }
        },

        *getShopTypeList(_, { call, put }) {
            const response = yield call(Action.getShopTypeList);
            if (response && response.code === ERROR_OK) {
                const data = response.data || {};
                const shopType_list = data.shopType_list || [];
                const formattedShopType = cascaderDataWash(shopType_list, [
                    { from: 'id', to: 'value' },
                    { from: 'name', to: 'label' },
                    { from: 'child', to: 'children' },
                ]);
                Storage.set({ __shopTypeList__: formattedShopType }, 'local');
                yield put({
                    type: 'updateState',
                    payload: {
                        shopType_list: formattedShopType,
                    },
                });
            }
        },

        *getRegionList(_, { call, put }) {
            const response = yield call(Action.getRegionList);
            if (response && response.code === ERROR_OK) {
                const data = response.data || {};
                const region_list = data.region_list || [];
                const formattedRegionList = cascaderDataWash(region_list, [
                    { from: 'name', to: 'label' },
                    { from: 'children', to: 'children' },
                    { from: 'province', to: 'value' },
                    { from: 'city', to: 'value' },
                    { from: 'county', to: 'value' },
                ]);
                Storage.set({ __regionList__: formattedRegionList }, 'local');
                yield put({
                    type: 'updateState',
                    payload: {
                        regionList: formattedRegionList,
                    },
                });
            }
        },

        *clearState(_, { put }) {
            yield put({
                type: 'updateState',
                payload: {
                    storeInfo: {},
                },
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