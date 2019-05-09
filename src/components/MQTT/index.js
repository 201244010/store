import React, { Component } from 'react';
import { connect } from 'dva';

import {
    initializeMqttClients,
    connectClient,
    registMessageHandler,
    subscribe,
    publish,
} from '@/services/mqtt';

function MQTTWrapper(WrapperedComponent) {
    @connect(state => ({
        mqtt: state.mqtt,
    }))
    class Wrapper extends Component {
        componentDidMount() {
            // TODO 在这里进行 mqtt client 的初始化工作
            this.initClient();
        }

        initClient = async () => {
            await initializeMqttClients(['store']);
            await connectClient('store');
            await registMessageHandler('store');
            await subscribe('/World', 'store');
            await publish('/World', 'helllo', 'store');
        };

        render() {
            const { mqtt } = this.props;

            return <WrapperedComponent {...{ ...this.props, mqtt }} />;
        }
    }

    return Wrapper;
}

export default MQTTWrapper;
