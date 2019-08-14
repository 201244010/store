import React from 'react';
import { Card, Table, Popconfirm } from 'antd';
import { formatMessage } from 'umi/locale';
import { OPCODE } from '@/constants/mqttStore';
import styles from './Network.less';

class DeviceList extends React.PureComponent {
	constructor(props) {
		super(props);
		this.timer = null;
		this.columns = [
			{
				title: formatMessage({ id: 'network.networkId' }),
				dataIndex: 'networkAlias',
				render: (_, record) => record.networkAlias || record.networkId
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
				render: record => (record ? `${record}%` : '--'),
			},
			{
				title: formatMessage({ id: 'network.memoryUsage' }),
				dataIndex: 'memPercent',
				render: record => (record ? `${record}%` : '--'),
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
				render: (_, record) => {
					const { clientCount, activeStatus } = record;
					return <span>{activeStatus ? clientCount || '--' : '--'}</span>;
				},
			},
			{
				title: formatMessage({ id: 'network.operation' }),
				render: (_, record) => {
					const {
						isLatestVersion,
						activeStatus,
						sn,
						networkId,
						reboot = 0,
						upgrade = 0,
					} = record;
					return (
						<div>
							{upgrade ? (
								<span>{formatMessage({ id: 'network.readyUpgrade' })}</span>
							) : (
								<Popconfirm
									title={formatMessage({ id: 'network.upgradeTitle' })}
									onConfirm={() => this.upgradeRouter({ sn, networkId })}
								>
									<a disabled={isLatestVersion || !activeStatus}>
										{formatMessage({ id: 'network.upgrade' })}
									</a>
								</Popconfirm>
							)}
							{reboot ? (
								<span className={styles['network-ready-reboot']}>
									{formatMessage({ id: 'network.readyReboot' })}
								</span>
							) : (
								<Popconfirm
									title={formatMessage({ id: 'network.rebootTitle' })}
									onConfirm={() => this.rebootRouter({ sn, networkId })}
								>
									<a
										disabled={!activeStatus}
										className={styles['network-operation']}
									>
										{formatMessage({ id: 'network.reboot' })}
									</a>
								</Popconfirm>
							)}
						</div>
					);
				},
			},
		];
	}

	componentDidMount() {
		const { getListWithStatus } = this.props;
		getListWithStatus();
		this.timer = setInterval(() => {
			getListWithStatus();
		}, 5000);
	}

	componentWillUnmount() {
		clearInterval(this.timer);
	}

	upgradeRouter = async ({ sn, networkId }) => {
		const { getAPMessage, refreshNetworkList } = this.props;
		await refreshNetworkList({ opcode: OPCODE.MESH_UPGRADE_STATE, sn, networkId });
		await getAPMessage({
			message: {
				opcode: OPCODE.MESH_UPGRADE_START,
				param: {
					network_id: networkId,
					sn,
				},
			},
		}).then(async () => {
			await getAPMessage({
				message: {
					opcode: OPCODE.MESH_UPGRADE_STATE,
					param: {
						network_id: networkId,
						sn,
					},
				},
			});
		});
	};

	rebootRouter = async ({ sn, networkId }) => {
		const { getAPMessage, refreshNetworkList } = this.props;
		await refreshNetworkList({ opcode: OPCODE.SYSTEMTOOLS_RESTART, sn, networkId });
		await getAPMessage({
			message: {
				opcode: OPCODE.SYSTEMTOOLS_RESTART,
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
					rowKey="id"
					columns={this.columns}
					dataSource={networkDeviceList}
					onChange={this.onTableChange}
				/>
			</Card>
		);
	}
}

export default DeviceList;
