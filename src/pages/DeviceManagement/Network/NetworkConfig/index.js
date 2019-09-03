import React from 'react';
import { Card, Tabs, Icon } from 'antd';
import { connect } from 'dva';
import { IconBandwidth } from '@/components/IconSvg';
import { formatMessage } from 'umi/locale';
import QosConfig from './QosConfig';
import QosCreate from './QosConfig/QosCreate';

const { TabPane } = Tabs;
@connect(
	state => ({
		network: state.network,
	}),
	dispatch => ({
		changeTabType: ({ type, value }) =>
			dispatch({ type: 'network/changeTabType', payload: { type, value } }),
		updateQos: payload => dispatch({ type: 'network/updateQos', payload }),
		createQos: payload => dispatch({ type: 'network/createQos', payload }),
		deleteQos: payload => dispatch({ type: 'network/deleteQos', payload }),
		getQosInfo: payload => dispatch({ type: 'network/getQosInfo', payload }),
		getQosList: payload => dispatch({ type: 'network/getQosList', payload }),
		getListWithStatus: () => dispatch({ type: 'network/getListWithStatus' }),
		unsubscribeTopic: () => dispatch({ type: 'network/unsubscribeTopic' }),
		checkClientExist: () => dispatch({ type: 'mqttStore/checkClientExist' }),
		generateTopic: payload => dispatch({ type: 'mqttStore/generateTopic', payload }),
		subscribe: payload => dispatch({ type: 'mqttStore/subscribe', payload }),
		clearMsg: payload => dispatch({ type: 'mqttStore/clearMsg', payload }),
		setAPHandler: payload => dispatch({ type: 'network/setAPHandler', payload }),
		getAPMessage: payload => dispatch({ type: 'network/getAPMessage', payload }),
	})
)
class NetworkConfig extends React.PureComponent {
	render() {
		const {
			network: {
				tabType: { qos },
			},
		} = this.props;
		return (
			<Card bordered={false}>
				<Tabs defaultActiveKey="1">
					<TabPane
						tab={
							<span>
								<Icon component={() => <IconBandwidth />} />
								{formatMessage({ id: 'network.qos.QoS' })}
							</span>
						}
						key="1"
					>
						{qos === 'init' && (
							<QosConfig
								{...this.props}
							/>
						)}
						{(qos === 'update' || qos === 'create') && (
							<QosCreate
								{...this.props}
							/>
						)}
					</TabPane>
				</Tabs>
			</Card>
		);
	}
}

export default NetworkConfig;
