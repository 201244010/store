import React, { Component } from 'react';
import { connect } from 'dva';
import { displayNotification } from '@/components/Notification';
import { REGISTER_PUB_MSG } from '@/constants/mqttStore';

// import { ERROR_OK } from '@/constants/errorCode';

function MQTTWrapper(WrapperedComponent) {
    @connect(
        null,
        dispatch => ({
            initializeClient: () => dispatch({ type: 'mqttStore/initializeClient' }),
            generateTopic: payload => dispatch({ type: 'mqttStore/generateTopic', payload }),
            subscribe: payload => dispatch({ type: 'mqttStore/subscribe', payload }),
            publish: payload => dispatch({ type: 'mqttStore/publish', payload }),
            setTopicListener: payload => dispatch({ type: 'mqttStore/setTopicListener', payload }),
            setMessageHandler: payload =>
                dispatch({ type: 'mqttStore/setMessageHandler', payload }),
        })
    )
    class Wrapper extends Component {
        componentDidMount() {
            this.initClient();
        }

        showNotification = (topic, data) => {
            const messageData = JSON.parse(data.toString()) || {};
            const { params = [] } = messageData;
            const { param = {} } = params[0] || {};
            displayNotification({ data: param });
        };

        initClient = async () => {
            const {
                initializeClient,
                generateTopic,
                setTopicListener,
                subscribe,
                publish,
            } = this.props;

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
