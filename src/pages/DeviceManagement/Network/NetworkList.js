import React from 'react';
import { Card, Divider, Badge, Icon, Input } from 'antd';
import { formatMessage } from 'umi/locale';
import { IconLink, IconEquipment, IconNetwork } from '@/components/IconSvg';
import { OPCODE } from '@/constants/mqttStore';
import styles from './Network.less';

class NetworkList extends React.PureComponent {
	constructor(props) {
		super(props);
		this.intervalTimer = null;
		this.checkTimer = null;
	}

	async componentDidMount() {
		const { getList } = this.props;
		await getList();
		await this.fetchApMessage();
		// await this.checkMQTTClient();
	}

	fetchApMessage = () => {
		const { getAPMessage, networkList } = this.props;
		this.checkTimer = setInterval(async () => {
			await Promise.all(
				networkList.map(async item => {
					const { networkId, masterDeviceSn: sn } = item;
					// console.log(masterDeviceSn);
					// let sn = masterDeviceSn;
					await getAPMessage({
						message: {
							opcode: OPCODE.CLIENT_LIST_GET,
							param: {
								network_id: networkId,
								sn,
							},
						},
					});
					await getAPMessage({
						message: {
							opcode: OPCODE.TRAFFIC_STATS_GET,
							param: {
								network_id: networkId,
								sn,
							},
						},
					});
				})
			);
		}, 5000);
	};

	editName = payload => {
		const { refreshNetworkList } = this.props;
		console.log(payload);
		refreshNetworkList(payload);
	};

	render() {
		const {
			networkList,
			deviceList: { networkDeviceList },
			goToPath,
		} = this.props;
		console.log(networkList);
		const TopologyList = networkList.map(item => (
			<Topology
				key={item.networkId}
				editName={this.editName}
				goToPath={goToPath}
				networkDeviceList={networkDeviceList}
				{...item}
			/>
		));
		return (
			<Card bordered={false}>
				<h1>{formatMessage({ id: 'network.shopNetwork' })}</h1>
				{networkList.length > 0 ? (
					TopologyList
				) : (
					<div className={styles['network-no-device']}>暂无网络</div>
				)}
			</Card>
		);
	}
}

const Topology = props => {
	const {
		networkId,
		networkDeviceList,
		masterDeviceSn,
		networkAlias,
		online,
		clientNumber,
		guestNumber,
		upSpeed,
		downSpeed,
		upUnit,
		downUnit,
		edit,
		goToPath,
		editName,
	} = props || {};

	const routerNumber = networkDeviceList.filter(item => item.networkId === networkId).length;
	return (
		<div className={styles['network-shop']}>
			<div className={styles['network-title']}>
				<div className={styles['network-Id']}>
					<span className={styles['network-name']}>
						{`${formatMessage({
							id: 'network.networkId',
						})}:`}
					</span>
					{!edit ? (
						<>
							<span> {networkAlias || networkId}</span>
							<div
								onClick={() => editName({ sn: masterDeviceSn, edit: 1 })}
								className={styles['network-edit']}
							/>
						</>
					) : (
						<>
							<Input
								style={{ width: '70%' }}
								autoFocus
								onBlur={e =>
									editName({
										sn: masterDeviceSn,
										edit: 0,
										networkAlias: e.target.value,
									})
								}
								defaultValue={networkAlias || networkId}
								maxLength={32}
								// onChange={() => {}}
								// value={networkAlias}
							/>
							{/* <span className={styles['network-errtip']}>{errorTip}</span> */}
						</>
					)}
				</div>
				<div className={styles['network-speed']}>
					<div className={styles['network-upspeed']} />
					{`${formatMessage({ id: 'network.upSpeed' })}：`}
					<span>{online ? upSpeed || 0 : '--'}</span>
					{upUnit || 'KB/s'}
					<Divider type="vertical" />
					<div className={styles['network-downspeed']} />
					{`${formatMessage({ id: 'network.downSpeed' })}：`}
					<span>{online ? downSpeed || 0 : '--'}</span>
					{downUnit || 'KB/s'}
				</div>
			</div>
			<div className={styles[online ? 'network-topology' : 'network-topology-offline']}>
				<div className={styles['network-map']}>
					<ul>
						<li>
							{online ? (
								<>
									<Icon component={() => <IconNetwork color="#303540" />} />
									<Badge
										count={routerNumber}
										offset={[0, -2]}
										overflowCount={9999}
										style={{ backgroundColor: '#4B7AFA', fontSize: 14 }}
									>
										<Icon component={() => <IconLink color="#303540" />} />
									</Badge>
									<Badge
										count={clientNumber || 0}
										offset={[0, -2]}
										overflowCount={9999}
										style={{ backgroundColor: '#4B7AFA', fontSize: 14 }}
									>
										<Icon component={() => <IconEquipment color="#303540" />} />
									</Badge>
								</>
							) : (
								<>
									<Icon component={() => <IconNetwork color="#A1A7B3" />} />
									<Icon component={() => <IconLink color="#A1A7B3" />} />
									<Icon component={() => <IconEquipment color="#A1A7B3" />} />
								</>
							)}
						</li>
						<li>
							{online ? (
								<>
									<div className={styles['network-cicle-first']} />
									<div className={styles['network-line']} />
									<div className={styles['network-cicle']} />
									<div className={styles['network-line']} />
									<div className={styles['network-cicle-third']} />
								</>
							) : (
								<>
									<div
										className={`${styles['network-cicle-first']} ${
											styles.offline
										}`}
									/>
									<div className={styles['network-line-dash']} />
									<div className={styles['network-cross']} />
									<div className={styles['network-line-dash']} />
									<div
										className={`${styles['network-cicle']} ${styles.offline}`}
									/>
									<div className={`${styles['network-line-offline']}`} />
									<div
										className={`${styles['network-cicle-third']} ${
											styles.offline
										}`}
									/>
								</>
							)}
						</li>
						<li>
							<div>{`${formatMessage({ id: 'network.Internet' })}`}</div>
							<div>
								{formatMessage({ id: 'network.router' })}
								{online ? (
									<a
										href="javascript:void(0);"
										onClick={() =>
											goToPath('networkDetail', {
												sn: masterDeviceSn,
												networkId,
											})
										}
									>
										（{formatMessage({ id: 'network.viewMore' })}）
									</a>
								) : (
									''
								)}
							</div>
							<div>{formatMessage({ id: 'network.client' })}</div>
						</li>
					</ul>
					<ul>
						<li />
					</ul>
				</div>
				<div className={styles['network-guest-wrapper']}>
					<Divider style={{ height: 80 }} type="vertical" />
					<div className={styles['network-guest']}>
						{formatMessage({ id: 'network.guestNumber' })}
						{online ? (
							<div>
								<span className={styles['network-guest-number']}>
									{guestNumber || 0}
								</span>
								{formatMessage({ id: 'network.unit' })}
							</div>
						) : (
							<div className={styles['network-guest-number']}>--</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default NetworkList;
