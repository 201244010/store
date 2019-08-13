import React from 'react';
import { Card, Table } from 'antd';
import { formatMessage } from 'umi/locale';
import { OPCODE } from '@/constants/mqttStore';
import styles from './Network.less';

class DeviceList extends React.PureComponent {
	constructor(props) {
		super(props);
		this.timer = null;
		this.columns = [
			{
				title: formatMessage({ id: 'network.deviceId' }),
				dataIndex: 'networkId',
			},
			{
				title: formatMessage({ id: 'network.deviceSN' }),
				dataIndex: 'sn',
				render: (_, record) => (
					<span>
						{`${record.sn}${
							record.isMaster ? `（${formatMessage({ id: 'network.master' })}）` : ''
						}`}
					</span>
				),
			},
			{
				title: formatMessage({ id: 'network.softwareVersion' }),
				dataIndex: 'binVersion',
			},
			{
				title: formatMessage({ id: 'network.cpuUsage' }),
				dataIndex: 'cpuPercent',
				render: record => record || '--',
			},
			{
				title: formatMessage({ id: 'network.memoryUsage' }),
				dataIndex: 'memPercent',
				render: record => record || '--',
			},
			{
				title: formatMessage({ id: 'network.status' }),
				dataIndex: 'activeStatus',
				render: record =>
					parseInt(record, 10)
						? formatMessage({ id: 'network.online' })
						: formatMessage({ id: 'network.offline' }),
			},
			{
				title: formatMessage({ id: 'network.deviceNum' }),
				dataIndex: 'clientCount',
				render: record => record || '--',
			},
			{
				title: formatMessage({ id: 'network.operation' }),
				render: (_, record) => {
					const { isUpgrading, isLatestVersion, activeStatus, sn, networkId } = record;
					return (
						<div>
							{isUpgrading ? (
								<span>{formatMessage({ id: 'network.isUpgrading' })}</span>
							) : (
								<a
									onClick={() => this.upgradeRouter({ sn, networkId })}
									disabled={isLatestVersion || !activeStatus}
								>
									{formatMessage({ id: 'network.upgrade' })}
								</a>
							)}
							<a
								onClick={() => this.rebootRouter({ sn, networkId })}
								disabled={!activeStatus}
								className={styles['network-operation']}
							>
								{formatMessage({ id: 'network.reboot' })}
							</a>
						</div>
					);
				},
			},
		];
	}

	componentDidMount() {
		const { getListWithStatus } = this.props;
		getListWithStatus();
		// this.timer = setInterval(() => {
		// 	getListWithStatus();
		// }, 5000);
	}

	componentWillUnmount() {
		clearInterval(this.timer);
	}

	upgradeRouter = async ({sn, networkId}) => {
		const { getAPMessage } = this.props;
		await getAPMessage({
			message: {
				opcode: OPCODE.CLIENT_LIST_GET,
				param: {
					network_id: networkId,
					sn,
				},
			},
		});
	};

	rebootRouter = async ({sn, networkId}) => {
		const { getAPMessage } = this.props;
		await getAPMessage({
			message: {
				opcode: OPCODE.CLIENT_LIST_GET,
				param: {
					network_id: networkId,
					sn,
				},
			},
		});
	};


	render() {
		const {
			deviceList: { networkDeviceList },
		} = this.props;
		return (
			<Card title={formatMessage({ id: 'network.deviceList' })} bordered={false}>
				<Table
					rowKey="deviceSn"
					columns={this.columns}
					dataSource={networkDeviceList}
					onChange={this.onTableChange}
				/>
			</Card>
		);
	}
}

export default DeviceList;
