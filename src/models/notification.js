import * as Actions from '@/services/notification';
import { ERROR_OK } from '@/constants/errorCode';
import { DEFAULT_PAGE_LIST_SIZE, DEFAULT_PAGE_SIZE } from '@/constants';

function* switchLoadingStatus(status, put) {
    yield put({
        type: 'updateState',
        payload: { loading: status },
    });
}

export default {
    namespace: 'notification',
    state: {
        searchFormValues: {
            modleId: null,
            statusCode: -1,
        },
        loading: false,
        count: {
            total: 0,
            unread: 0,
        },
        notificationList: [],
        notificationInfo: {
            msgId: '',
            companyId: '',
            shopId: '',
            level: '',
            modelName: '',
            title: '',
            description: '',
            content: '',
            receiveTime: '',
            receiveStatus: '',
        },
        modelList: [],
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
        *getNotificationModels(_, { put, call }) {
            yield switchLoadingStatus(true, put);

            const response = yield call(Actions.handleNotifiCation, 'getModelList');
            if (response && response.code === ERROR_OK) {
                const { data = {} } = response;
                const { model_list: modelList } = data;
                yield put({
                    type: 'updateState',
                    payload: {
                        modelList,
                        loading: false,
                    },
                });
            } else {
                yield switchLoadingStatus(false, put);
            }
        },

        // *getNotificationList(payload = {}, { put, call }) {},

        *getNotificationCount(_, { put, call }) {
            yield switchLoadingStatus(true, put);

            const response = yield call(Actions.handleNotifiCation, 'getMessageCount');
            if (response && response.code === ERROR_OK) {
                const { data = {} } = response;
                const { total_count: total = 0, unread_count: unread = 0 } = data;
                yield put({
                    type: 'updateState',
                    payload: {
                        count: { total, unread },
                        loading: false,
                    },
                });
            } else {
                yield switchLoadingStatus(false, put);
            }
        },

        *getNotificationInfo(payload = {}, { put, call }) {
            const { msgId: msg_id } = payload;
            const opts = {
                msg_id,
            };
            yield switchLoadingStatus(true, put);

            const response = yield call(Actions.handleNotifiCation, 'getMessageInfo', opts);
            if (response && response.code === ERROR_OK) {
                const { data = {} } = response;
                const {
                    msg_id: msgId,
                    company_id: companyId,
                    shop_id: shopId,
                    level,
                    model_name: modelName,
                    title,
                    description,
                    content,
                    receive_time: receiveTime,
                    receive_status: receiveStatus,
                } = data;
                yield put({
                    type: 'updateState',
                    payload: {
                        notificationInfo: {
                            msgId,
                            companyId,
                            shopId,
                            level,
                            modelName,
                            title,
                            description,
                            content,
                            receiveTime,
                            receiveStatus,
                        },
                        loading: false,
                    },
                });
            } else {
                yield switchLoadingStatus(false, put);
            }
        },

        // *createNotification(payload = {}, { put, call }) {
        //     yield switchLoadingStatus(true, put);
        // },
        //
        // *deleteNotification(payload = {}, { put, call }) {},
        //
        // *updateNotificationStatus(payload = {}, { put, call }) {},

        *clearSearchValue(_, { put }) {
            yield put({
                type: 'updateState',
                payload: {
                    searchFormValues: {
                        modleId: null,
                        statusCode: -1,
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
