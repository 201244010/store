import { handleESLAction } from '@/services/ESL/deviceUpgrade';
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
            const response = yield call(handleESLAction('getList'));
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
