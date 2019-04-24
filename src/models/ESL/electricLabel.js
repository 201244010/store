import * as ESLServices from '@/services/ESL/electricLabel';
import * as TemplateServices from '@/services/ESL/template';
import * as ProductServices from '@/services/ESL/product';
import { hideSinglePageCheck } from '@/utils/utils';
import { formatMessage } from 'umi/locale';
import Storage from '@konata9/storage.js';
import { DEFAULT_PAGE_LIST_SIZE, DEFAULT_PAGE_SIZE, DURATION_TIME } from '@/constants';
import { ERROR_OK } from '@/constants/errorCode';
import { message } from 'antd';

export default {
    namespace: 'eslElectricLabel',
    state: {
        loading: false,
        data: [],
        searchFormValues: {
            keyword: '',
            status: -1,
        },
        pagination: {
            current: 1,
            pageSize: Storage.get('deviceStationPageSize') || DEFAULT_PAGE_SIZE,
            total: 0,
            pageSizeOptions: DEFAULT_PAGE_LIST_SIZE,
            showSizeChanger: true,
            showQuickJumper: true,
        },
        detailInfo: {},
        templates4ESL: [],
        flashModes: [],
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
        *fetchElectricLabels({ payload = {} }, { call, put, select }) {
            const { options = {} } = payload;
            const { pagination, searchFormValues } = yield select(state => state.eslElectricLabel);

            yield put({
                type: 'updateState',
                payload: { loading: true },
            });

            const opts = Object.assign({}, pagination, searchFormValues, options);
            const response = yield call(ESLServices.fetchElectricLabels, opts);
            const result = response.data || {};
            yield put({
                type: 'updateState',
                payload: {
                    loading: false,
                    data: result.esl_list || [],
                    pagination: {
                        current: options.current,
                        total: Number(result.total_count) || 0,
                        hideOnSinglePage: hideSinglePageCheck(result.total_count),
                    },
                },
            });
        },
        *fetchESLDetails({ payload = {} }, { call, put }) {
            const { options = {} } = payload;
            yield put({
                type: 'updateState',
                payload: { loading: true },
            });

            const response = yield call(ESLServices.fetchESLDetails, options);
            const result = response.data || {};
            if (response.code === ERROR_OK) {
                yield put({
                    type: 'updateState',
                    payload: {
                        loading: false,
                        detailInfo: result.esl_info || {},
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
        *fetchFlashModes({ payload = {} }, { call, put }) {
            const { options = {} } = payload;

            const response = yield call(ESLServices.fetchFlashModes, options);
            const result = response.data || {};
            if (response.code === ERROR_OK) {
                yield put({
                    type: 'updateState',
                    payload: {
                        flashModes: result.esl_flash_mode_list || [],
                    },
                });
            }
            return response;
        },
        *fetchTemplatesByESLCode({ payload = {} }, { call, put }) {
            const { options = {} } = payload;

            const response = yield call(TemplateServices.fetchTemplatesByESLCode, options);
            const result = response.data || {};
            if (response.code === ERROR_OK) {
                yield put({
                    type: 'updateState',
                    payload: {
                        templates4ESL: result.template_list || [],
                    },
                });
            }
            return response;
        },
        *fetchDeviceOverview(_, { call, put }) {
            yield put({
                type: 'updateState',
                payload: { loading: true },
            });
            const response = yield call(ESLServices.fetchDeviceOverview);
            if (response && response.code === ERROR_OK) {
                yield put({
                    type: 'updateState',
                    payload: {
                        loading: false,
                        overview: response.data
                    },
                });
            }
            yield put({
                type: 'updateState',
                payload: { loading: false },
            });
        },
        *flushESL({ payload = {} }, { call, put }) {
            const { options = {} } = payload;
            yield put({
                type: 'updateState',
                payload: { loading: true },
            });

            const response = yield call(ProductServices.flushESL, options);
            if (response.code === ERROR_OK) {
                message.success(
                    formatMessage({ id: 'esl.device.esl.flush.success' }),
                    DURATION_TIME
                );
                yield put({
                    type: 'updateState',
                    payload: { loading: false },
                });
                yield put({
                    type: 'fetchElectricLabels',
                });
            } else {
                message.error(formatMessage({ id: 'esl.device.esl.flush.fail' }), DURATION_TIME);
                yield put({
                    type: 'updateState',
                    payload: { loading: false },
                });
            }
        },
        *bindESL({ payload = {} }, { call, put }) {
            const { options = {} } = payload;
            yield put({
                type: 'updateState',
                payload: { loading: true },
            });

            const response = yield call(ProductServices.bindESL, options);
            if (response.code === ERROR_OK) {
                message.success(
                    formatMessage({ id: 'esl.device.esl.bind.success' }),
                    DURATION_TIME
                );
                yield put({
                    type: 'updateState',
                    payload: { loading: false },
                });
                yield put({
                    type: 'fetchElectricLabels',
                });
            } else {
                message.error(formatMessage({ id: 'esl.device.esl.bind.fail' }), DURATION_TIME);
                yield put({
                    type: 'updateState',
                    payload: { loading: false },
                });
            }
        },
        *unbindESL({ payload = {} }, { call, put }) {
            const { options = {} } = payload;
            yield put({
                type: 'updateState',
                payload: { loading: true },
            });

            const response = yield call(ProductServices.unbindESL, options);
            if (response.code === ERROR_OK) {
                message.success(
                    formatMessage({ id: 'esl.device.esl.unbind.success' }),
                    DURATION_TIME
                );
                yield put({
                    type: 'updateState',
                    payload: { loading: false },
                });
                yield put({
                    type: 'fetchElectricLabels',
                });
            } else {
                message.error(formatMessage({ id: 'esl.device.esl.unbind.fail' }), DURATION_TIME);
                yield put({
                    type: 'updateState',
                    payload: { loading: false },
                });
            }
        },
        *changeTemplate({ payload = {} }, { call, put }) {
            const { options = {} } = payload;
            yield put({
                type: 'updateState',
                payload: { loading: true },
            });

            const response = yield call(ESLServices.changeTemplate, options);
            if (response.code === ERROR_OK) {
                message.success(
                    formatMessage({ id: 'esl.device.esl.change.template.success' }),
                    DURATION_TIME
                );
                yield put({
                    type: 'updateState',
                    payload: { loading: false },
                });
                yield put({
                    type: 'fetchElectricLabels',
                });
            } else {
                message.error(
                    formatMessage({ id: 'esl.device.esl.change.template.fail' }),
                    DURATION_TIME
                );
                yield put({
                    type: 'updateState',
                    payload: { loading: false },
                });
            }
        },
        *flashLed({ payload = {} }, { call, put }) {
            const { options = {} } = payload;
            yield put({
                type: 'updateState',
                payload: { loading: true },
            });

            const response = yield call(ESLServices.flashLed, options);
            if (response.code === ERROR_OK) {
                message.success(
                    formatMessage({ id: 'esl.device.esl.flash.success' }),
                    DURATION_TIME
                );
                yield put({
                    type: 'updateState',
                    payload: { loading: false },
                });
            } else {
                message.error(formatMessage({ id: 'esl.device.esl.flash.fail' }), DURATION_TIME);
                yield put({
                    type: 'updateState',
                    payload: { loading: false },
                });
            }
        },
        *deleteESL({ payload = {} }, { call, put, select }) {
            const {
                pagination: { current },
                data,
            } = yield select(state => state.eslElectricLabel);
            const { options = {} } = payload;
            yield put({
                type: 'updateState',
                payload: { loading: true },
            });

            const targetPage = data.length === 1 ? 1 : current;
            const response = yield call(ESLServices.deleteESL, options);
            if (response.code === ERROR_OK) {
                message.success(
                    formatMessage({ id: 'esl.device.esl.delete.success' }),
                    DURATION_TIME
                );
                yield put({
                    type: 'updateState',
                    payload: { loading: false },
                });
                yield put({
                    type: 'fetchElectricLabels',
                    payload: {
                        options: {
                            current: targetPage,
                        },
                    },
                });
            } else {
                message.error(formatMessage({ id: 'esl.device.esl.delete.fail' }), DURATION_TIME);
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
