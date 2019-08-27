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
	})
)
class NetworkConfig extends React.PureComponent {
	constructor(props) {
		super(props);
		const { changeTabType, network } = this.props;
		this.tabType = {
			qos: {
				init: <QosConfig {...{ changeTabType }} />,
				create: <QosCreate {...{ changeTabType, network }} />,
				update: <QosCreate {...{ changeTabType, network }} />,
			},
		};
	}

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
						{this.tabType.qos[qos]}
					</TabPane>
				</Tabs>
			</Card>
		);
	}
}

export default NetworkConfig;
