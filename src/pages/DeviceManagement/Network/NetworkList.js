import React from 'react';
import { Card, Divider, Badge, Icon, Input } from 'antd';
import { formatMessage } from 'umi/locale';
import { IconLink, IconEquipment, IconNetwork } from '@/components/IconSvg';
import { ERROR_OK } from '@/constants/errorCode';
import { OPCODE } from '@/constants/mqttStore';
import styles from './Network.less';

class NetworkList extends React.PureComponent {
	constructor(props) {
		super(props);
		this.checkTimer = null;
	}

	async componentDidMount() {
		const { getList } = this.props;
		await getList();
		await this.fetchApMessage();
	}

	componentWillUnmount() {
		clearInterval(this.checkTimer);
	}

	fetchApMessage = () => {
		const { getAPMessage, networkList } = this.props;
		this.checkTimer = setInterval(async () => {
			await Promise.all(
				networkList.map(async item => {
					const { networkId, masterDeviceSn: sn } = item;
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
		clearInterval(this.checkTimer);
		refreshNetworkList(payload);
	};

	upgradeName = async payload => {
		const { networkId, networkAlias } = payload;
		const { updateAlias } = this.props;
		const response = await updateAlias({ networkId, networkAlias });
		if (response && response.code === ERROR_OK) {
			message.success('更改名称成功');
			this.fetchApMessage();
		}
	};

	render() {
		const {
			networkList,
			deviceList: { networkDeviceList },
		} = this.props;
		const TopologyList = networkList.map(item => (
			<Topology
				key={item.networkId}
				editName={this.editName}
				upgradeName={this.upgradeName}
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
		editName,
		upgradeName,
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
										sn: masterDeviceSn,
										edit: 0,
										networkAlias: e.target.value,
										networkId,
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
							<div>
								{formatMessage({ id: 'network.router' })}
								{activeStatus ? (
									<a href="javascript:void(0);" onClick={() => console.log('aa')}>
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
					</div>
				</div>
			</div>
		</div>
	);
};

export default NetworkList;
