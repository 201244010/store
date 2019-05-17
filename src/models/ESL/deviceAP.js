import { handleAPAction } from '@/services/ESL/deviceUpgrade';
import { ERROR_OK } from '@/constants/errorCode';
import { DEFAULT_PAGE_LIST_SIZE, DEFAULT_PAGE_SIZE } from '@/constants';

function* switchLoadingStatus(status, put) {
    yield put({
        type: 'updateState',
        payload: { loading: status },
    });
}

export default {
    namespace: 'deviceAP',
    state: {
        loading: false,
        searchFormValues: {
            baseStationID: null,
            status: -1,
        },
        states: [],
        apGroupList: [],
        apInfoList: [],
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
        *getAPGroupList(_, { call, put }) {
            yield switchLoadingStatus(true, put);
            const response = yield call(handleAPAction('getList'));
            if (response && response.code === ERROR_OK) {
                const { data = {} } = response;
                yield put({
                    type: 'updateState',
                    payload: {
                        apGroupList: data.firmware_group_list || [],
                    },
                });
            }
            yield switchLoadingStatus(false, put);
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
