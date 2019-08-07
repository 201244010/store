import React from 'react';
import { Card, Table } from 'antd';
import { formatMessage } from 'umi/locale';

// @connect(
// 	state => ({}),
// 	dispatch => ({})
// )
class DeviceList extends React.Component {
	constructor(props) {
		super(props);
		this.columns = [
			{
				title: formatMessage({ id: 'network.deviceId' }),
				dataIndex: 'networkId',
			},
			{
				title: formatMessage({ id: 'network.deviceSN' }),
				dataIndex: 'networkSn',
			},
			{
				title: formatMessage({ id: 'network.softwareVersion' }),
				dataIndex: 'binVersion',
			},
			{
				title: formatMessage({ id: 'network.cpuUsage' }),
				dataIndex: 'cpuPercent',
			},
			{
				title: formatMessage({ id: 'network.memoryUsage' }),
				dataIndex: 'memPercent',
			},
			{
				title: formatMessage({ id: 'network.status' }),
				dataIndex: 'activeStatus',
			},
			{
				title: formatMessage({ id: 'network.deviceNum' }),
				dataIndex: 'clientCount',
			},
			{
				title: formatMessage({ id: 'network.operation' }),
			},
		];
	}

	render() {
		return (
			<Card title={formatMessage({ id: 'network.deviceList' })} bordered={false}>
				<Table
					rowKey="name"
					columns={this.columns}
					dataSource={[]}
					onChange={this.onTableChange}
				/>
			</Card>
		);
	}
}

export default DeviceList;
