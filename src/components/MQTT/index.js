import React, { Component } from 'react';
import { connect } from 'dva';
import { ShadowNotification } from '@/components/Notification';
import { RESISTER_PUB_MSG } from '@/constants/mqttStore';
import { ERROR_OK } from '@/constants/errorCode';

function MQTTWrapper(WrapperedComponent) {
    @connect(
        state => ({
            mqtt: state.mqttStore,
        }),
        dispatch => ({
            generateTopic: payload => dispatch({ type: 'mqttStore/generateTopic', payload }),
            subscribe: payload => dispatch({ type: 'mqttStore/subscribe', payload }),
            publish: payload => dispatch({ type: 'mqttStore/publish', payload }),
            setMessageHandler: payload =>
                dispatch({ type: 'mqttStore/setMessageHandler', payload }),
        })
    )
    class Wrapper extends Component {
        constructor(props) {
            super(props);
            this.state = { emit: false };
        }

        componentDidMount() {
            // TODO 在这里进行 mqtt client 的初始化工作
            this.initClient();
        }

        initClient = async () => {
            const { setMessageHandler, subscribe, publish } = this.props;

            await setMessageHandler({
                handler: (topic, data) => {
                    console.log(data);
                    if (data[0].errcode === ERROR_OK) {
                        this.setState({ emit: true });
                    }
                },
            });

            await subscribe({ service: 'register', action: 'sub' });
            await publish({ service: 'register', action: 'pub', message: RESISTER_PUB_MSG });
        };

        render() {
            const { emit } = this.state;
            return (
                <>
                    <WrapperedComponent {...this.props} />;
                    <ShadowNotification {...{ emit }} />
                </>
            );
        }
    }

    return Wrapper;
}

export default MQTTWrapper;
