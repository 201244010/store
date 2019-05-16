import moment from 'moment';

import MqttModel from '@/services/Mqtt/MqttModel';
import { createEmqToken } from '@/services/user';
import { ERROR_OK } from '@/constants/errorCode';

const namespace = 'mqttStore';
const model = new MqttModel(namespace);

export default {
    namespace,
    state: {
        emit: false,
    },
    reducers: {
        ...model.reducers(),
    },
    effects: {
        ...model.effects(),
        *createEmqToken(_, { call }) {
            const response = yield call(createEmqToken);
            if (response && response.code === ERROR_OK) {
                const { data = {} } = response;
                return data;
            }
            return null;
        },

        *initializeClient(_, { put, select }) {
            const token = yield put.resolve({
                type: 'createEmqToken',
            });

            const { currentUser } = yield select(state => state.user);
            const { currentCompanyId } = yield select(state => state.merchant);
            const { id } = currentUser;
            const { server_address: address } = token;
            const clientId = `${currentCompanyId}_${id}_${moment().format('X')}`;

            console.log(token);

            yield put({
                type: 'updateInfo',
                payload: {
                    clientId,
                    ...token,
                    address,
                },
            });

            yield put({
                type: 'connect',
            });
        },

        *generateTopic({ payload }, { select }) {
            const { service, action = 'pub', prefix = 'WEB' } = payload;
            const { currentUser, clientId } = yield select(state => ({
                currentUser: state.user.currentUser,
                clientId: state.mqttStore.clientId,
            }));

            const { id } = currentUser;
            return `/${prefix}/${id}/${clientId}/${service}/${action}`;
        },

        *setMessageHandler({ payload }, { put }) {
            const { handler } = payload;

            yield put({
                type: 'registerMessageHandler',
                payload: {
                    handler: (topic, message) => {
                        const messageData = JSON.parse(message.toString());
                        const { data = [] } = messageData;
                        // console.log('data in handler: ', data);
                        handler(topic, data);
                    },
                },
            });
        },

        *setTopicListener({ payload }, { put }) {
            const { service, action = 'sub', handler } = payload;
            const topic = yield put.resolve({
                type: 'generateTopic',
                payload: { service, action },
            });

            yield put({
                type: 'registerTopicHandler',
                payload: {
                    topic,
                    handler,
                },
            });
        },

        *setErrorHandler({ payload }, { put }) {
            const { handler } = payload;

            yield put({
                type: 'registerErrorHandler',
                payload: {
                    handler,
                },
            });
        },

        *destroyClient(_, { put }) {
            yield put({
                type: 'destroy',
            });
        },
    },
};
