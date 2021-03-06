import React from 'react';
import { Card, Divider, Badge, Icon, Input, message } from 'antd';
import { formatMessage } from 'umi/locale';
import { IconLink, IconEquipment, IconNetwork } from '@/components/IconSvg';
import { ERROR_OK } from '@/constants/errorCode';
import styles from './Network.less';

class NetworkList extends React.PureComponent {
	constructor(props) {
		super(props);
		this.intervalTimer = null;
	}

	componentDidMount() {
		const { getList } = this.props;
		getList();
	}

	editName = payload => {
		const { editNetworkId } = this.props;
		clearInterval(this.intervalTimer);
		editNetworkId(payload);
	};

	upgradeName = async payload => {
		const { networkId, networkAlias, initNetworkAlias } = payload;
		const { updateAlias, getList, editNetworkId } = this.props;
		if (initNetworkAlias !== networkAlias) {
			const response = await updateAlias({ networkId, networkAlias });
			if (response && response.code === ERROR_OK) {
				message.success(formatMessage({ id: 'network.changeSuccess' }));
			}
		}
		await getList();
		await editNetworkId(payload);
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
								onClick={() => editName({ networkId, edit: 1 })}
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
									<Icon component={() => <IconNetwork activeStatus />} />
									<Badge
										count={routerNumber}
										showZero
										offset={[0, -2]}
										overflowCount={9999}
									>
										<Icon component={() => <IconLink activeStatus />} />
									</Badge>
									<Badge
										count={clientNumber || 0}
										// showZero
										offset={[-32, -2]}
										overflowCount={9999}
									>
										<Icon
											className={styles['network-client']}
											component={() => <IconEquipment activeStatus />}
										/>
									</Badge>
								</>
							) : (
								<>
									<Icon component={() => <IconNetwork activeStatus />} />
									<Icon component={() => <IconLink activeStatus />} />
									<Icon
										className={styles['network-client']}
										component={() => <IconEquipment activeStatus />}
									/>
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
												type: 'client',
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
					<Divider className={styles['network-divider']} type="vertical" />
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
										type: 'guest',
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
