import React, { Component } from 'react';
import { connect } from 'dva';

function MQTTWrapper(WrapperedComponent) {
    @connect(
        state => ({
            mqtt: state.mqtt,
        }),
        dispatch => ({
            initializeMqttClients: () => dispatch({ type: 'mqtt/initializeMqttClients' }),
            connectClient: payload => dispatch({ type: 'mqtt/connectClient', payload }),
            initListener: payload => dispatch({ type: 'mqtt/initListener', payload }),
            subscribe: payload => dispatch({ type: 'mqtt/subscribe', payload }),
            publish: payload => dispatch({ type: 'mqtt/publish', payload }),
            dispatch,
        })
    )
    class Wrapper extends Component {
        componentDidMount() {
            // TODO 在这里进行 mqtt client 的初始化工作
            this.initClient();
        }

        initClient = async () => {
            const {
                initializeMqttClients,
                connectClient,
                initListener,
                subscribe,
                publish,
            } = this.props;

            await initializeMqttClients();
            await connectClient({ category: 'store' });
            await initListener({ category: 'store' });
            await subscribe({ topic: '/World', category: 'store' });
            await publish({ topic: '/World', message: 'helllo', category: 'store' });
        };

        render() {
            return <WrapperedComponent {...this.props} />;
        }
    }

    return Wrapper;
}

export default MQTTWrapper;
