import React from 'react';
import { Card, Divider, Badge, Icon, Input, message } from 'antd';
import { formatMessage } from 'umi/locale';
import { IconLink, IconEquipment, IconNetwork } from '@/components/IconSvg';
import { ERROR_OK } from '@/constants/errorCode';
import { OPCODE } from '@/constants/mqttStore';
import styles from './Network.less';

class NetworkList extends React.PureComponent {
	constructor(props) {
		super(props);
		this.intervalTimer = null;
	}

	async componentDidMount() {
		const { getList } = this.props;
		this.fetchApMessage();
		await getList();
	}

	componentWillUnmount() {
		clearInterval(this.intervalTimer);
	}

	fetchApMessage = () => {
		const { getList } = this.props;
		this.intervalTimer = setInterval(async () => {
			await getList();
			await this.fetchMqtt();
		}, 5000);
	};

	fetchMqtt = () => {
		const { getAPMessage, networkList } = this.props;
		networkList.map(async item => {
			const { networkId, masterDeviceSn: sn, activeStatus } = item;
			console.log(activeStatus);
			if (activeStatus) {
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
			}
		});
	};

	editName = payload => {
		const { refreshNetworkList } = this.props;
		clearInterval(this.intervalTimer);
		refreshNetworkList(payload);
	};

	upgradeName = async payload => {
		const { networkId, networkAlias, initNetworkAlias } = payload;
		const { updateAlias, refreshNetworkList, getList } = this.props;
		if (initNetworkAlias !== networkAlias) {
			const response = await updateAlias({ networkId, networkAlias });
			if (response && response.code === ERROR_OK) {
				message.success(formatMessage({ id: 'network.changeSuccess' }));
				this.fetchApMessage();
			}
		}
		await getList();
		await refreshNetworkList(payload);
	};

	render() {
		const {
			networkList,
			deviceList: { networkDeviceList },
			goToPath,
		} = this.props;
		const TopologyList = networkList.map(item => (
			<Topology
				key={item.networkId}
				editName={this.editName}
				upgradeName={this.upgradeName}
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
					<div className={styles['network-no-device']}>
						{formatMessage({ id: 'network.noNetwork' })}
					</div>
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
		activeStatus,
		clientNumber,
		guestNumber,
		upSpeed,
		downSpeed,
		upUnit,
		downUnit,
		edit,
		upgradeName,
		editName,
		goToPath,
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
									upgradeName({
										networkAlias: e.target.value,
										networkId,
										sn: masterDeviceSn,
										edit: 0,
										initNetworkAlias: networkAlias,
									})
								}
								onPressEnter={e =>
									upgradeName({
										networkAlias: e.target.value,
										networkId,
										sn: masterDeviceSn,
										edit: 0,
										initNetworkAlias: networkAlias,
									})
								}
								defaultValue={networkAlias || networkId}
								maxLength={32}
							/>
							{/* <span className={styles['network-errtip']}>{errorTip}</span> */}
						</>
					)}
				</div>
				<div className={styles['network-speed']}>
					<div className={styles['network-upspeed']} />
					{`${formatMessage({ id: 'network.upSpeed' })}：`}
					<span>{activeStatus ? upSpeed || 0 : '--'}</span>
					{upUnit || 'KB/s'}
					<Divider type="vertical" />
					<div className={styles['network-downspeed']} />
					{`${formatMessage({ id: 'network.downSpeed' })}：`}
					<span>{activeStatus ? downSpeed || 0 : '--'}</span>
					{downUnit || 'KB/s'}
				</div>
			</div>
			<div className={styles[activeStatus ? 'network-topology' : 'network-topology-offline']}>
				<div className={styles['network-map']}>
					<ul>
						<li>
							{activeStatus ? (
								<>
									<Icon component={() => <IconNetwork color="#303540" />} />
									<Badge
										count={routerNumber}
										showZero
										offset={[0, -2]}
										overflowCount={9999}
										style={{ backgroundColor: '#4B7AFA', fontSize: 14 }}
									>
										<Icon component={() => <IconLink color="#303540" />} />
									</Badge>
									<Badge
										count={clientNumber || 0}
										showZero
										offset={[-32, -2]}
										overflowCount={9999}
										style={{ backgroundColor: '#4B7AFA', fontSize: 14 }}
									>
										<Icon className={styles['network-client']} component={() => <IconEquipment color="#303540" />} />
									</Badge>
								</>
							) : (
								<>
									<Icon component={() => <IconNetwork color="#A1A7B3" />} />
									<Icon component={() => <IconLink color="#A1A7B3" />} />
									<Icon className={styles['network-client']} component={() => <IconEquipment color="#A1A7B3" />} />
								</>
							)}
						</li>
						<li>
							{activeStatus ? (
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
							<div className={activeStatus ? styles['network-router'] : ''}>
								{formatMessage({ id: 'network.router' })}
								{activeStatus ? (
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
							<div className={!activeStatus ? styles['network-client-offline'] : ''}>
								{formatMessage({ id: 'network.client' })}
								{activeStatus ? (
									<a
										href="javascript:void(0);"
										onClick={() =>
											goToPath('clientList', {
												sn: masterDeviceSn,
												networkId,
												type: 'client'
											})
										}
									>
										（{formatMessage({ id: 'network.viewMore' })}）
									</a>
								) : (
									''
								)}
							</div>
						</li>
					</ul>
				</div>
				<div className={styles['network-guest-wrapper']}>
					<Divider style={{ height: 80 }} type="vertical" />
					<div className={styles['network-guest']}>
						{formatMessage({ id: 'network.guestNumber' })}
						{activeStatus ? (
							<div>
								<span className={styles['network-guest-number']}>
									{guestNumber || 0}
								</span>
								{formatMessage({ id: 'network.unit' })}
							</div>
						) : (
							<div className={styles['network-guest-number']}>--</div>
						)}
						{activeStatus ? (
							<a
								href="javascript:void(0);"
								onClick={() =>
									goToPath('clientList', {
										sn: masterDeviceSn,
										networkId,
										type: 'guest'
									})
								}
							>
								（{formatMessage({ id: 'network.viewMore' })}）
							</a>
						) : (
							''
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default NetworkList;
