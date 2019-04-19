import * as Services from '@/services/ESL/electricLabel';
import { hideSinglePageCheck } from '@/utils/utils';
import Storage from '@konata9/storage.js';
import { DEFAULT_PAGE_LIST_SIZE, DEFAULT_PAGE_SIZE } from '@/constants';
import { ERROR_OK } from "@/constants/errorCode";

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
        detailInfo: {}
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
            const response = yield call(Services.fetchElectricLabels, opts);
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

            const response = yield call(Services.fetchESLDetails, options);
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
