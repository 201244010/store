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

        *initializeClient(_, { put }) {
            const tokenPromise = yield put({
                type: 'createEmqToken',
            });

            return tokenPromise.then(token => {
                console.log(token);
                const { username, server_address: address } = token;
                const clientId = `${username}_${moment().format('X')}`;
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
            const { service, action, prefix = 'WEB', withCompany = false } = payload;
            const { currentUser } = yield select(state => state.user);
            const { currentCompanyId } = yield select(state => state.merchant);

            const { id } = currentUser;
            if (mqttClient) {
                const { info } = mqttClient.getClient();
                const { clientId } = info;

                if (withCompany) {
                    return `/${prefix}/${id}/${clientId}/${currentCompanyId}/${service}/${action}`;
                }
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

        *publish({ payload }, { put }) {
            const { message, ...rest } = payload;
            const { service, action = 'pub' } = rest;

            const topicPromise = yield put({
                type: 'generateTopic',
                payload: { service, action },
            });

            topicPromise.then(async topic => {
                if (mqttClient && topic) {
                    mqttClient.publish(topic, message);
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
            const {
                service,
                action = 'sub',
                prefix = 'WEB',
                withCompany = false,
                handler,
            } = payload;
            const topicPromise = yield put({
                type: 'generateTopic',
                payload: { service, action, prefix, withCompany },
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
