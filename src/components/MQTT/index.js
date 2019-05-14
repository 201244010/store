import React, { Component } from 'react';
import { connect } from 'dva';
import { displayNotification } from '@/components/Notification';
import { REGISTER_PUB_MSG } from '@/constants/mqttStore';
import { ACTION_MAP } from '@/constants/mqttActionMap';

function MQTTWrapper(WrapperedComponent) {
    @connect(
        null,
        dispatch => ({
            getUserInfo: () => dispatch({ type: 'user/getUserInfo' }),
            initializeClient: () => dispatch({ type: 'mqttStore/initializeClient' }),
            generateTopic: payload => dispatch({ type: 'mqttStore/generateTopic', payload }),
            subscribe: payload => dispatch({ type: 'mqttStore/subscribe', payload }),
            publish: payload => dispatch({ type: 'mqttStore/publish', payload }),
            setTopicListener: payload => dispatch({ type: 'mqttStore/setTopicListener', payload }),
            setMessageHandler: payload =>
                dispatch({ type: 'mqttStore/setMessageHandler', payload }),
            destroyClient: () => dispatch({ type: 'mqttStore/destroyClient' }),
            getNotificationCount: () => dispatch({ type: 'notification/getNotificationCount' }),
        })
    )
    class Wrapper extends Component {
        componentDidMount() {
            this.initClient();
        }

        componentWillUnmount() {
            const { destroyClient } = this.props;
            destroyClient();
        }

        handleAction = action => {
            if (action) {
                const handler = ACTION_MAP[action] || (() => null);
                handler();
            }
        };

        showNotification = (topic, data) => {
            const { getNotificationCount } = this.props;
            const messageData = JSON.parse(data.toString()) || {};
            const { params = [] } = messageData;
            params.forEach(item => {
                const { param = {} } = item;
                displayNotification({
                    data: param,
                    mainAction: this.handleAction,
                    subAction: this.handleAction,
                });
            });
            getNotificationCount();
        };

        initClient = async () => {
            const {
                getUserInfo,
                initializeClient,
                generateTopic,
                setTopicListener,
                subscribe,
                publish,
            } = this.props;

            await getUserInfo();
            await initializeClient();
            const registerTopic = await generateTopic({ service: 'register', action: 'sub' });
            const notificationTopic = await generateTopic({
                service: 'notification',
                action: 'sub',
            });

            await setTopicListener({ service: 'notification', handler: this.showNotification });

            subscribe({ topic: [registerTopic, notificationTopic] });
            await publish({ service: 'register', message: REGISTER_PUB_MSG });
        };

        render() {
            return <WrapperedComponent {...this.props} />;
        }
    }

    return Wrapper;
}

export default MQTTWrapper;
