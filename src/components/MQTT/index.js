import React, { Component } from 'react';
import { connect } from 'dva';

function MQTTWrapper(WrapperedComponent) {
    @connect(
        state => ({
            mqtt: state.mqttStore,
        }),
        dispatch => ({
            connectClient: () => dispatch({ type: 'mqttStore/connectClient' }),
            subscribe: payload => dispatch({ type: 'mqttStore/subscribe', payload }),
            publish: payload => dispatch({ type: 'mqttStore/publish', payload }),
            setMessageHandler: payload =>
                dispatch({ type: 'mqttStore/setMessageHandler', payload }),
            setErrorHandler: payload => dispatch({ type: 'mqttStore/setErrorHandler', payload }),
        })
    )
    class Wrapper extends Component {
        componentDidMount() {
            // TODO 在这里进行 mqtt client 的初始化工作
            this.initClient();
        }

        initClient = async () => {
            const {
                connectClient,
                subscribe,
                publish,
                setMessageHandler,
                setErrorHandler,
            } = this.props;
            await connectClient();
            await setErrorHandler({
                handler: err => console.log('socket error:', err),
            });
            await setMessageHandler({
                handler: (topic, message) =>
                    console.log('topic is ', topic, 'message is ', message),
            });
            await subscribe({ topic: '/World' });
            await publish({ topic: '/World', message: 'hello' });
        };

        render() {
            const { mqtt } = this.props;

            return <WrapperedComponent {...{ ...this.props, mqtt }} />;
        }
    }

    return Wrapper;
}

export default MQTTWrapper;
