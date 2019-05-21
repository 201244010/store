import * as Actions from '@/services/notification';
import { ERROR_OK } from '@/constants/errorCode';
import { message } from 'antd';
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
            modelIdList: [],
            statusCode: -1,
        },
        loading: false,
        count: {
            total: 0,
            unread: 0,
        },
        unreadList: [],
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

        *updateSearchValue({ payload }, { put }) {
            const { modelIdList = [], statusCode = -1 } = payload;
            yield put({
                type: 'updateState',
                payload: {
                    searchFormValues: {
                        modelIdList,
                        statusCode,
                    },
                },
            });
        },

        *getUnreadNotification(_, { put, call }) {
            yield switchLoadingStatus(true, put);
            const response = yield call(Actions.handleNotifiCation, 'mailbox/getMessageList', {
                model_id_list: [],
                status_code: 0,
                page_num: 1,
                page_size: 5,
            });
            if (response && response.code === ERROR_OK) {
                const { data = {} } = response;
                const { msg_list = [] } = data;
                yield put({
                    type: 'updateState',
                    payload: {
                        unreadList: msg_list,
                    },
                });
            }
            yield switchLoadingStatus(false, put);
        },

        *getNotificationList({ payload = {} }, { put, call, select }) {
            yield switchLoadingStatus(true, put);
            const { pagination, searchFormValues } = yield select(state => state.notification);
            const options = {
                ...searchFormValues,
                ...pagination,
                ...payload,
            };
            console.log(payload);
            const {
                modelIdList: model_id_list,
                statusCode: status_code,
                current: page_num,
                pageSize: page_size,
            } = options;
            const response = yield call(Actions.handleNotifiCation, 'mailbox/getMessageList', {
                model_id_list,
                status_code,
                page_num,
                page_size,
            });
            if (response && response.code === ERROR_OK) {
                const { data = {} } = response;
                const { msg_list = [], total_count } = data;
                yield put({
                    type: 'updateState',
                    payload: {
                        notificationList: msg_list,
                        pagination: {
                            ...pagination,
                            total: total_count,
                            current: page_num,
                            pageSize: page_size,
                        },
                    },
                });
                yield put({
                    type: 'getNotificationCount',
                    payload: {},
                });
            }
            yield switchLoadingStatus(true, put);
        },

        *getNotificationCount(_, { put, call }) {
            yield switchLoadingStatus(true, put);

            const response = yield call(Actions.handleNotifiCation, 'mailbox/getMessageCount');
            if (response && response.code === ERROR_OK) {
                const { data = {} } = response;
                const { total_count: total = 0, unread_count: unread = 0 } = data;
                yield put({
                    type: 'updateState',
                    payload: {
                        count: { total, unread },
                    },
                });
            }
            yield switchLoadingStatus(false, put);
        },

        *getNotificationInfo({ payload = {} }, { put, call }) {
            const { msgId: msg_id } = payload;
            const opts = {
                msg_id,
            };
            yield switchLoadingStatus(true, put);

            const response = yield call(Actions.handleNotifiCation, 'mailbox/getMessageInfo', opts);
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
                    },
                });
            }
            yield switchLoadingStatus(false, put);
        },

        *createNotification(payload = {}, { put, call }) {
            yield switchLoadingStatus(true, put);
            const { modelId: model_id, level, title, description, content } = payload;
            const opts = {
                model_id,
                level,
                title,
                description,
                content,
            };
            const response = yield call(Actions.handleNotifiCation, 'createMessage', opts);
            if (response && response.code === ERROR_OK) {
                // TODO 创建成功逻辑补充
            }
            yield switchLoadingStatus(false, put);
        },

        *deleteNotification({ payload = {} }, { put, call, select }) {
            yield switchLoadingStatus(true, put);
            const {
                notificationList,
                pagination: { current },
            } = yield select(state => state.notification);
            const { msgIdList: msg_id_list } = payload;
            const response = yield call(Actions.handleNotifiCation, 'mailbox/deleteMessage', {
                msg_id_list,
            });
            if (response && response.code === ERROR_OK) {
                message.success('删除成功');
                if (notificationList.length === msg_id_list.length) {
                    yield put({
                        type: 'getNotificationList',
                        payload: { current: current - 1 },
                    });
                } else {
                    yield put({
                        type: 'getNotificationList',
                        payload: {},
                    });
                }
            }
            yield switchLoadingStatus(false, put);
        },

        *updateNotificationStatus({ payload = {} }, { put, call }) {
            yield switchLoadingStatus(true, put);
            const { msgIdList: msg_id_list, statusCode: status_code } = payload;
            const response = yield call(Actions.handleNotifiCation, 'mailbox/updateReceiveStatus', {
                msg_id_list,
                status_code,
            });
            if (response && response.code === ERROR_OK) {
                yield put({
                    type: 'getNotificationList',
                    payload: {},
                });
            }
            yield switchLoadingStatus(false, put);
        },

        *clearSearchValue(_, { put }) {
            yield put({
                type: 'updateState',
                payload: {
                    searchFormValues: {
                        modelIdList: [],
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
