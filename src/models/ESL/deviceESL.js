import { handleESLAction } from '@/services/ESL/deviceUpgrade';
import { message } from 'antd';
import { formatMessage } from 'umi/locale';
import { ERROR_OK } from '@/constants/errorCode';
import { DEFAULT_PAGE_LIST_SIZE, DEFAULT_PAGE_SIZE } from '@/constants';

function* switchLoadingStatus(status, put) {
    yield put({
        type: 'updateState',
        payload: { loading: status },
    });
}

export default {
    namespace: 'deviceESL',
    state: {
        loading: false,
        searchFormValues: {
            elsId: null,
            status: -1,
        },
        states: [],
        eslGroupList: [],
        eslInfoList: [],
        pagination: {
            current: 1,
            pageSize: DEFAULT_PAGE_SIZE,
            total: 0,
            pageSizeOptions: DEFAULT_PAGE_LIST_SIZE,
            showSizeChanger: true,
            showQuickJumper: true,
        },
    },
    effects: {
        *getESLGroupList(_, { call, put }) {
            yield switchLoadingStatus(true, put);
            const response = yield call(handleESLAction, 'getList');
            if (response && response.code === ERROR_OK) {
                const { data = {} } = response;
                yield put({
                    type: 'updateState',
                    payload: {
                        eslGroupList: data.firmware_group_list || [],
                    },
                });
            }
            yield switchLoadingStatus(false, put);
        },

        *updateSearchValue({ payload }, { put }) {
            const { elsId = null, status = -1 } = payload;
            yield put({
                type: 'updateState',
                payload: {
                    searchFormValues: {
                        elsId,
                        status,
                    },
                },
            });
        },

        *getESLGroupInfo({ payload }, { call, put, select }) {
            console.log(payload);
            yield switchLoadingStatus(true, put);
            const { pagination, searchFormValues } = yield select(state => state.deviceESL);
            const options = {
                ...pagination,
                ...searchFormValues,
                ...payload,
            };

            const response = yield call(handleESLAction, 'getInfo', options);
            if (response && response.code === ERROR_OK) {
                const { data = {} } = response;
                yield put({
                    type: 'updateState',
                    payload: {
                        eslInfoList: data.esl_firmware_group_info_list || [],
                        pagination: {
                            ...pagination,
                            total: data.total_count || 0,
                        },
                    },
                });
            }
            yield switchLoadingStatus(false, put);
        },

        *updateESLAutoUpgradeStatus({ payload }, { put, call }) {
            yield switchLoadingStatus(true, put);
            const response = yield call(handleESLAction, 'updateAutoUpgradeStatus', payload);
            if (response.code === ERROR_OK) {
                yield put({
                    type: 'getESLGroupList',
                });
            } else {
                message.error(formatMessage({ id: 'esl.device.upgrade.auto.fail' }));
            }
            yield switchLoadingStatus(false, put);
        },

        *uploadESLFirmware({ paylaod }, { put, call }) {
            yield switchLoadingStatus(true, put);
            const response = yield call(handleESLAction, 'upload', paylaod);
            if (response.code === ERROR_OK) {
                yield put({
                    type: 'getESLGroupList',
                });
            }
            yield switchLoadingStatus(false, put);
            return response;
        },

        *clearSearchValue(_, { put }) {
            yield put({
                type: 'updateState',
                payload: {
                    searchFormValues: {
                        elsId: null,
                        status: -1,
                    },
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
    },
};
