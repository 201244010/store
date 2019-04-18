import * as Actions from '@/services/BasicData/product';
import { message } from 'antd';
import { formatMessage } from 'umi/locale';
import { ERROR_OK } from '@/constants/errorCode';
import { DEFAULT_PAGE_LIST_SIZE, DEFAULT_PAGE_SIZE, DURATION_TIME } from '@/constants';
import { hideSinglePageCheck } from '@/utils/utils';
import Storage from '@konata9/storage.js';

export default {
    namespace: 'basicDataProduct',
    state: {
        loading: false,
        searchFormValues: {
            keyword: '',
            status: -1,
        },
        states: [],
        data: [],
        productInfo: {},
        erpPlatformList: [{ id: 0, name: '康明泰克' }, { id: 1, name: '客无忧' }],
        bindEsl: [],
        bindEslInfo: {},
        filePath: null,
        importResult: {},
        pagination: {
            current: 1,
            pageSize: Storage.get('goodsPageSize') || DEFAULT_PAGE_SIZE,
            total: 0,
            pageSizeOptions: DEFAULT_PAGE_LIST_SIZE,
            showSizeChanger: true,
            showQuickJumper: true,
        },
    },
    effects: {
        *getERPPlatformList(_, { call, put }) {
            yield put({
                type: 'updateState',
                payload: { loading: true },
            });
            const response = yield call(Actions.getERPPlatformList);
            if (response && response.code === ERROR_OK) {
                const result = response.data || {};
                yield put({
                    type: 'updateState',
                    payload: {
                        loading: false,
                        erpPlatformList: result.platformList || [],
                    },
                });
            } else {
                yield put({
                    type: 'updateState',
                    payload: { loading: false },
                });
            }
        },

        *fetchProductList({ payload }, { call, put, select }) {
            const { options } = payload;
            const { pagination, searchFormValues } = yield select(state => state.eslBaseStation);

            yield put({
                type: 'updateState',
                payload: { loading: true },
            });

            const opts = Object.assign({}, pagination, searchFormValues, options);
            const response = yield call(Actions.fetchProductList, opts);
            const result = response.data || {};
            yield put({
                type: 'updateState',
                payload: {
                    loading: false,
                    data: result.product_list || [],
                    pagination: {
                        current: options.current,
                        total: Number(result.total_count) || 0,
                        hideOnSinglePage: hideSinglePageCheck(result.total_count),
                    },
                },
            });
        },

        *changeSearchFormValue({ payload }, { put }) {
            const { options } = payload;
            yield put({
                type: 'setSearchFormValue',
                payload: {
                    ...options,
                },
            });
        },

        *getProductDetail({ payload }, { call, put }) {
            const { options } = payload;
            yield put({
                type: 'updateState',
                payload: { loading: true },
            });

            const response = yield call(Actions.getProductDetail, options);
            if (response && response.code === ERROR_OK) {
                yield put({
                    type: 'updateState',
                    payload: {
                        loading: false,
                        productInfo: response.data || {},
                    },
                });
            } else {
                yield put({
                    type: 'updateState',
                    payload: { loading: false },
                });
            }
            return response;
        },

        *createProduct({ payload }, { call, put }) {
            const { options } = payload;
            yield put({
                type: 'updateState',
                payload: { loading: true },
            });
            const response = yield call(Actions.createProduct, options);
            if (response && response.code === ERROR_OK) {
                yield put({
                    type: 'updateState',
                    payload: { loading: false },
                });
            } else {
                yield put({
                    type: 'updateState',
                    payload: {
                        loading: false,
                        productInfo: { ...options },
                    },
                });
            }
            return response;
        },

        *updateProduct({ payload }, { call, put }) {
            const { options } = payload;
            yield put({
                type: 'updateState',
                payload: { loading: true },
            });
            const response = yield call(Actions.updateProduct, options);
            if (response && response.code === ERROR_OK) {
                yield put({
                    type: 'updateState',
                    payload: {
                        loading: false,
                        productInfo: response.data || {},
                    },
                });
            } else {
                yield put({
                    type: 'updateState',
                    payload: { loading: false },
                });
            }
            return response;
        },

        *deleteProduct({ payload }, { call, put, select }) {
            const { options } = payload;
            const {
                pagination: { current },
                data,
            } = yield select(state => state.basicDataProduct);
            yield put({
                type: 'updateState',
                payload: { loading: true },
            });

            const targetPage = data.length === 1 ? 1 : current;
            const response = yield call(Actions.deleteProduct, options);
            if (response && response.code === ERROR_OK) {
                message.success(formatMessage('basicData.product.delete'), DURATION_TIME);
                yield put({
                    type: 'updateState',
                    payload: { loading: false },
                });

                yield put({
                    type: 'fetchProductList',
                    payload: {
                        current: targetPage,
                    },
                });
            } else {
                yield put({
                    type: 'updateState',
                    payload: { loading: false },
                });
            }
        },

        *erpImport({ payload }, { call, put }) {
            const { options } = payload;
            yield put({
                type: 'updateState',
                payload: { loading: true },
            });

            const response = yield call(Actions.erpImport, options);
            if (response && response.code === ERROR_OK) {
                message.success(formatMessage({ id: 'basicData.erp.import.success' }));
                yield put({
                    type: 'updateState',
                    payload: { loading: false },
                });
            } else {
                yield put({
                    type: 'updateState',
                    payload: { loading: false },
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
        setSearchFormValue(state, action) {
            return {
                ...state,
                searchFormValues: {
                    ...state.searchFormValues,
                    ...action.payload,
                },
            };
        },
    },
};
