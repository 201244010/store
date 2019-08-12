import React from 'react';
import { Card, Divider, Badge, Icon } from 'antd';
import { formatMessage } from 'umi/locale';
import { IconLink, IconEquipment, IconNetwork } from '@/components/IconSvg';
import styles from './Network.less';

class NetworkList extends React.PureComponent {
	constructor(props) {
		super(props);
		this.intervalTimer = null;
		this.checkTimer = null;
	}

	async componentDidMount() {
		// const { getList } = this.props;
		// await getList();
		await this.checkMQTTClient();
	}

	componentWillUnmount() {
		clearTimeout(this.checkTimer);
		clearInterval(this.intervalTimer);
		const { unsubscribeTopic } = this.props;
		unsubscribeTopic();
	}

	apHandler = (sn, data) => {
		console.log(sn, data);
	};

	checkMQTTClient = async () => {
		clearTimeout(this.checkTimer);
		const {
			networkList,
			checkClientExist,
			setAPHandler,
			generateTopic,
			subscribe,
			getAPMessage,
		} = this.props;
		const isClientExist = await checkClientExist();
		if (isClientExist) {
			// const {
			// 	eslBaseStation: { networkIdList = [] },
			// } = this.props;
			const apInfoTopic = await generateTopic({ service: 'W1/response', action: 'sub' });
			await subscribe({ topic: [apInfoTopic] });
			// await setAPHandler({ handler: () => console.log('aaa') });
			// if (networkIdList.length > 0) {
			// 	const { networkId } = networkIdList[0] || {};
			// 	this.setState(
			// 		{
			// 			networkId,
			// 		},
			// 		() => getAPConfig({ networkId })
			// 	);
			// }
			// console.log('client existed', networkIdList);
			// this.intervalTimer = setInterval(() => {
			// await getList();
			// console.log(networkList);
			await setAPHandler({ handler: data => this.apHandler(data) });

			await Promise.all(
				networkList.map(async item => {
					const { networkId, masterDeviceSn } = item;
					// console.log(masterDeviceSn);
					// let sn = masterDeviceSn;
					// await setAPHandler({ handler: data => this.apHandler(masterDeviceSn, data) });
					await getAPMessage({
						networkId,
						sn: masterDeviceSn,
					});
				})
			);
			// }, 5000);
		} else {
			this.checkTimer = setTimeout(() => this.checkMQTTClient(), 1000);
		}
	};

	render() {
		const {
			networkList,
			deviceList: { networkDeviceList },
		} = this.props;
		// console.log(networkDeviceList);
		const TopologyList = networkList.map(item => (
			<Topology key={item.networkId} networkDeviceList={networkDeviceList} {...item} />
		));
		return (
			<Card bordered={false}>
				<h1>{formatMessage({ id: 'network.shopNetwork' })}</h1>
				{TopologyList}
			</Card>
		);
	}
}

const Topology = props => {
	const { networkId, networkDeviceList, networkAlias, online } = props || {};
	const routerNumber = networkDeviceList.filter(item => item.networkId === networkId).length;
	const clientNumber = networkDeviceList.reduce((acc, items) => {
		if (networkId === items.networkId && items.activeStatus) {
			return acc + items.clientCount;
		}
		return acc;
	}, 0);
	const upSpeed = '';
	const downSpeed = '';
	return (
		<div className={styles['network-shop']}>
			<div className={styles['network-title']}>
				<div className={styles['network-Id']}>
					<span>{`${formatMessage({ id: 'network.networkId' })}: ${networkAlias}`}</span>
					<div className={styles['network-edit']} />
				</div>
				<div className={styles['network-speed']}>
					<div className={styles['network-upspeed']} />
					{`${formatMessage({ id: 'network.upSpeed' })}：`}
					<span>{upSpeed || '--'}</span>KB/s
					<Divider type="vertical" />
					<div className={styles['network-downspeed']} />
					{`${formatMessage({ id: 'network.downSpeed' })}：`}
					<span>{downSpeed || '--'}</span>KB/s
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
										count={clientNumber}
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
						{online ? (
							<div>
								<span className={styles['network-guest-number']}>6</span>
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
