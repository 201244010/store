// import * as Actions from '@/services/mqtt';
import moment from 'moment';
import MqttClient from '@/services/Mqtt/MqttClient';
import { createEmqToken } from '@/services/user';
import { ERROR_OK } from '@/constants/errorCode';
// import { notification } from 'antd';
// import { ERROR_OK, SHOW_VCODE, VCODE_ERROR } from '@/constants/errorCode';

let mqttClient = null;

export default {
    namespace: 'mqttStore',
    state: {
        emit: false,
    },
    effects: {
        *createEmqToken(_, { call }) {
            const response = yield call(createEmqToken);
            if (response && response.code === ERROR_OK) {
                const { data = {} } = response;
                return data;
            }
            return null;
        },

        *initializeClient(_, { put, select }) {
            const tokenPromise = yield put({
                type: 'createEmqToken',
            });
            const { currentUser } = yield select(state => state.user);
            const { id } = currentUser;
            const { currentCompanyId } = yield select(state => state.merchant);
            // console.log('mqtt init', currentCompanyId);

            return tokenPromise.then(token => {
                console.log(token);
                const { server_address: address } = token;
                const clientId = `${currentCompanyId}_${id}_${moment().format('X')}`;
                mqttClient = new MqttClient({
                    clientId,
                    ...token,
                    address,
                });

                mqttClient.connect();
                mqttClient.setErrorHandler(err => console.log(err));
            });
        },

        *generateTopic({ payload }, { select }) {
            const { service, action, prefix = 'WEB' } = payload;
            const { currentUser } = yield select(state => state.user);

            const { id } = currentUser;
            if (mqttClient) {
                const { info } = mqttClient.getClient();
                const { clientId } = info;

                return `/${prefix}/${id}/${clientId}/${service}/${action}`;
            }
            return '';
        },

        subscribe({ payload }) {
            const { topic } = payload;

            if (mqttClient && topic) {
                mqttClient.subscribe(topic);
            }
        },

        *publish({ payload }, { put, select }) {
            const { message, ...rest } = payload;
            const { service, action = 'pub' } = rest;
            const { currentCompanyId } = yield select(state => state.merchant);

            const topicPromise = yield put({
                type: 'generateTopic',
                payload: { service, action },
            });

            topicPromise.then(async topic => {
                if (mqttClient && topic) {
                    const { info } = mqttClient.getClient();
                    const publishMessage = {
                        ...message,
                        param: {
                            ...message.param,
                            company_id: currentCompanyId,
                            client_id: info.clientId,
                        },
                    };

                    mqttClient.publish(topic, publishMessage);
                }
            });
        },

        // 全局 message handler
        setMessageHandler({ payload }) {
            const { handler } = payload;
            if (mqttClient) {
                mqttClient.setMessageHandler((topic, message) => {
                    const messageData = JSON.parse(message.toString());
                    const { data = [] } = messageData;
                    console.log('data in handler: ', data);
                    handler(topic, data);
                });
            }
        },

        *setTopicListener({ payload }, { put }) {
            const { service, action = 'sub', prefix = 'WEB', handler } = payload;
            const topicPromise = yield put({
                type: 'generateTopic',
                payload: { service, action, prefix },
            });

            topicPromise.then(topic => {
                if (mqttClient) {
                    mqttClient.setTopicListener(topic, handler);
                    console.log('topic: ', topic, ' listener is ready');
                }
            });
        },

        setErrorHandler({ payload }) {
            const { handler } = payload;
            if (mqttClient) {
                mqttClient.setErrorHandler(handler);
            }
        },

        destroyClient() {
            if (mqttClient) {
                mqttClient.destroyClient();
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
    },

    subscriptions: {},
};
