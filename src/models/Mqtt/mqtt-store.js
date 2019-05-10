// import * as Actions from '@/services/mqtt';
import moment from 'moment';
import MqttClient from '@/services/Mqtt/MqttClient';
// import { notification } from 'antd';
// import { ERROR_OK, SHOW_VCODE, VCODE_ERROR } from '@/constants/errorCode';

let mqttClient = null;

export default {
    namespace: 'mqttStore',
    state: {
        emit: false,
    },
    effects: {
        *generateTopic({ payload }, { select }) {
            const { service, action } = payload;
            const { currentUser } = yield select(state => state.user);
            const { id } = currentUser;
            if (mqttClient) {
                const { info } = mqttClient.getClient();
                const { clientId } = info;
                return `/USER/${id}/${clientId}/${service}/${action}`;
            }
            return '';
        },

        *subscribe({ payload }, { put }) {
            const topicPromise = yield put({
                type: 'generateTopic',
                payload,
            });

            topicPromise.then(async topic => {
                console.log(topic);
                if (mqttClient && topic) {
                    await mqttClient.subscribe(topic);
                }
            });
        },

        *publish({ payload }, { put }) {
            const { message, ...rest } = payload;
            const topicPromise = yield put({
                type: 'generateTopic',
                payload: { ...rest },
            });

            topicPromise.then(async topic => {
                if (mqttClient && topic) {
                    await mqttClient.publish(topic, message);
                }
            });
        },

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

        setErrorHandler({ payload }) {
            const { handler } = payload;
            if (mqttClient) {
                mqttClient.setErrorHandler(handler);
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

    subscriptions: {
        async initialize({ dispatch }) {
            const token = await dispatch({
                type: 'user/createEmqToken',
            });

            const { username, server_address: address } = token;
            const clientId = `${username}_${moment().format('X')}`;
            mqttClient = new MqttClient({
                clientId,
                ...token,
                address,
            });

            mqttClient.connect();
            mqttClient.setErrorHandler(err => console.log(err));
        },
    },
};
