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
        connectClient() {
            if (mqttClient) {
                mqttClient.connect();
                console.log(mqttClient);
            }
        },

        subscribe({ payload }) {
            const { topic } = payload;
            if (mqttClient) {
                mqttClient.subscribe(topic);
            }
        },

        publish({ payload }) {
            const { topic, message } = payload;
            if (mqttClient) {
                mqttClient.publish(topic, message);
            }
        },

        setMessageHandler({ payload }) {
            const { handler } = payload;
            if (mqttClient) {
                mqttClient.setMessageHandler(handler);
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

            console.log(token);
            const { username, server_address: address } = token;
            const clientId = `${username}_${moment().format('X')}`;
            mqttClient = new MqttClient({
                clientId,
                ...token,
                address: address || 'ws://47.96.240.44:30214',
            });
        },
    },
};
