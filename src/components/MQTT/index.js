import React, { Component } from 'react';
import { connect } from 'dva';
import { displayNotification } from '@/components/Notification';
import { REGISTER_PUB_MSG } from '@/constants/mqttStore';
import { ERROR_OK } from '@/constants/errorCode';

function MQTTWrapper(WrapperedComponent) {
    @connect(
        null,
        dispatch => ({
            initializeClient: () => dispatch({ type: 'mqttStore/initializeClient' }),
            generateTopic: payload => dispatch({ type: 'mqttStore/generateTopic', payload }),
            subscribe: payload => dispatch({ type: 'mqttStore/subscribe', payload }),
            publish: payload => dispatch({ type: 'mqttStore/publish', payload }),
            setMessageHandler: payload =>
                dispatch({ type: 'mqttStore/setMessageHandler', payload }),
        })
    )
    class Wrapper extends Component {
        componentDidMount() {
            this.initClient();
        }

        initClient = async () => {
            const { initializeClient, setMessageHandler, subscribe, publish } = this.props;

            await initializeClient();
            await setMessageHandler({
                handler: (topic, data) => {
                    console.log(data);
                    if (data[0].errcode === ERROR_OK) {
                        displayNotification();
                    }
                },
            });

            await subscribe({ service: 'register' });
            await subscribe({ service: 'notification' });
            await publish({ service: 'register', message: REGISTER_PUB_MSG });
        };

        render() {
            return <WrapperedComponent {...this.props} />;
        }
    }

    return Wrapper;
}

export default MQTTWrapper;
