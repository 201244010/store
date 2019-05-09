import * as Actions from '@/services/BasicData/product';
import { message } from 'antd';
import router from 'umi/router';
import { formatMessage } from 'umi/locale';
import { ERROR_OK } from '@/constants/errorCode';
import { DEFAULT_PAGE_LIST_SIZE, DEFAULT_PAGE_SIZE, DURATION_TIME, MENU_PREFIX } from '@/constants';
import { hideSinglePageCheck, idEncode } from '@/utils/utils';
import * as CookieUtil from '@/utils/cookies';

const goNext = (fromPage = 'list', options) => {
    const { product_id: id } = options;
    const path = {
        list: `${MENU_PREFIX.PRODUCT}`,
        detail: `${MENU_PREFIX.PRODUCT}/productInfo?id=${idEncode(id)}`,
    };

    router.push(path[fromPage]);
};

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
        erpEnable: false,
        productInfo: {},
        sassInfoList: [],
        bindEsl: [],
        bindEslInfo: {},
        filePath: null,
        importResult: {},
        pagination: {
            current: 1,
            pageSize:
                CookieUtil.getCookieByKey(CookieUtil.GOODS_PAGE_SIZE_KEY) || DEFAULT_PAGE_SIZE,
            total: 0,
            pageSizeOptions: DEFAULT_PAGE_LIST_SIZE,
            showSizeChanger: true,
            showQuickJumper: true,
        },
        overview: {},
    },
    effects: {
        *changeSearchFormValue({ payload = {} }, { put }) {
            const { options = {} } = payload;
            yield put({
                type: 'setSearchFormValue',
                payload: {
                    ...options,
                },
            });
        },
        *clearSearch(_, { put }) {
            yield put({
                type: 'updateState',
                payload: {
                    searchFormValues: {
                        keyword: '',
                        status: -1,
                    },
                },
            });
        },
        *fetchProductOverview(_, { call, put }) {
            yield put({
                type: 'updateState',
                payload: { loading: true },
            });
            const response = yield call(Actions.fetchProductOverview);
            if (response && response.code === ERROR_OK) {
                yield put({
                    type: 'updateState',
                    payload: {
                        loading: false,
                        overview: response.data,
                    },
                });
            }

            yield put({
                type: 'updateState',
                payload: { loading: false },
            });
        },
        *getERPPlatformList(_, { call, put }) {
            yield put({
                type: 'updateState',
                payload: { loading: true, erpEnable: false },
            });
            const response = yield call(Actions.getERPPlatformList);
            if (response && response.code === ERROR_OK) {
                const result = response.data || {};
                yield put({
                    type: 'updateState',
                    payload: {
                        loading: false,
                        sassInfoList: result.saas_info_list || [],
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
        *fetchProductList({ payload = {} }, { call, put, select }) {
            const { options = {} } = payload;
            const { pagination, searchFormValues } = yield select(state => state.basicDataProduct);
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
                        ...pagination,
                        pageSize: opts.pageSize,
                        current: opts.current,
                        total: Number(result.total_count) || 0,
                        hideOnSinglePage: hideSinglePageCheck(result.total_count) || true,
                    },
                },
            });
        },
        *getProductDetail({ payload = {} }, { call, put }) {
            const { options = {} } = payload;
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
        *createProduct({ payload = {} }, { call, put }) {
            const { options = {} } = payload;
            const opts = {
                ...options,
                expire_time: options.expire_time || -1,
                price: options.price || -1,
                promote_price: options.promote_price || -1,
                member_price: options.member_price || -1,
            };
            yield put({
                type: 'updateState',
                payload: { loading: true },
            });
            const response = yield call(Actions.createProduct, opts);
            if (response && response.code === ERROR_OK) {
                yield put({
                    type: 'updateState',
                    payload: { loading: false },
                });
                router.push(`${MENU_PREFIX.PRODUCT}`);
            } else {
                message.error(formatMessage({ id: 'product.create.error' }));
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
        *updateProduct({ payload = {} }, { call, put }) {
            const { options = {} } = payload;
            const opts = {
                ...options,
                expire_time: options.expire_time || -1,
                price: options.price || -1,
                promote_price: options.promote_price || -1,
                member_price: options.member_price || -1,
            };
            yield put({
                type: 'updateState',
                payload: { loading: true },
            });
            const response = yield call(Actions.updateProduct, opts);
            if (response && response.code === ERROR_OK) {
                yield put({
                    type: 'updateState',
                    payload: {
                        loading: false,
                        productInfo: response.data || {},
                    },
                });
                const { fromPage, product_id } = options;
                goNext(fromPage, { product_id });
            } else {
                message.error(formatMessage({ id: 'product.update.error' }));
                yield put({
                    type: 'updateState',
                    payload: { loading: false },
                });
            }
            return response;
        },
        *deleteProduct({ payload = {} }, { call, put }) {
            const { options = {} } = payload;
            yield put({
                type: 'updateState',
                payload: { loading: true },
            });

            const response = yield call(Actions.deleteProduct, options);
            if (response && response.code === ERROR_OK) {
                message.success(
                    formatMessage({ id: 'basicData.product.delete.success' }),
                    DURATION_TIME
                );
                yield put({
                    type: 'updateState',
                    payload: { loading: false },
                });

                yield put({
                    type: 'fetchProductList',
                    payload: {
                        current: 1,
                    },
                });
            } else {
                message.error(
                    formatMessage({ id: 'basicData.product.delete.fail' }),
                    DURATION_TIME
                );
                yield put({
                    type: 'updateState',
                    payload: { loading: false },
                });
            }
        },
        *clearState(_, { put }) {
            yield put({
                type: 'updateState',
                payload: {
                    productInfo: {},
                },
            });
        },
        *erpAuthCheck({ payload = {} }, { call, put }) {
            const { options = {} } = payload;
            yield put({
                type: 'updateState',
                payload: { loading: true },
            });

            const response = yield call(Actions.checkSaasInfo, options);
            if (response && response.code !== ERROR_OK) {
                yield put({
                    type: 'updateState',
                    payload: { loading: false },
                });
            }

            return response;
        },
        *erpImport({ payload = {} }, { call, put }) {
            const { options = {} } = payload;
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
