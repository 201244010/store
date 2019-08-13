import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card } from 'antd';
import PageList from '@/components/List/PageList';
import { formatMessage } from 'umi/locale';
import styles from './Network.less';

const mockData = {
	errcode: '0',
	msg_id: '1',
	data: [
		{
			opcode: '0x2116',
			errcode: '0',
			result: {
				sonconnect: {
					devices: [
						{
							mac: '0C:25:76:35:D9:9D',
							routermac: '00:00:00:00:00:00',
							devid: 'W101D8BS00101',
							conn_mode: {
								wired: 0,
								w_2g: 0,
								w_5g: 0,
							},
							ip: '192.168.100.1',
							online: '1',
							location: 'W101D8BS00101',
							rssi: 0,
							role: '1',
						},

						{
							mac: '0C:25:76:35:D9:9D',
							routermac: '00:00:00:00:00:00',
							devid: 'W101D8BS00101',
							conn_mode: {
								wired: 0,
								w_2g: 0,
								w_5g: 0,
							},
							ip: '192.168.100.1',
							online: '1',
							location: 'W101D8BS00101',
							rssi: 0,
							role: 0,
						},

						{
							mac: '0C:25:76:35:D9:9D',
							routermac: '00:00:00:00:00:00',
							devid: 'W101D8BS00101',
							conn_mode: {
								wired: 0,
								w_2g: 0,
								w_5g: 0,
							},
							ip: '192.168.100.1',
							online: '1',
							location: 'W101D8BS00101',
							rssi: 0,
							role: 0,
						},

						{
							mac: '0C:25:76:35:D9:9D',
							routermac: '00:00:00:00:00:00',
							devid: 'W101D8BS00101',
							conn_mode: {
								wired: 0,
								w_2g: 0,
								w_5g: 0,
							},
							ip: '192.168.100.1',
							online: '1',
							location: 'W101D8BS00101',
							rssi: 0,
							role: 0,
						},

						{
							mac: '0C:25:76:35:D9:9D',
							routermac: '00:00:00:00:00:00',
							devid: 'W101D8BS00101',
							conn_mode: {
								wired: 0,
								w_2g: 0,
								w_5g: 0,
							},
							ip: '192.168.100.1',
							online: '1',
							location: 'W101D8BS00101',
							rssi: 0,
							role: '1',
						},

						{
							mac: '0C:25:76:35:D9:9D',
							routermac: '00:00:00:00:00:00',
							devid: 'W101D8BS00101',
							conn_mode: {
								wired: 0,
								w_2g: 0,
								w_5g: 0,
							},
							ip: '192.168.100.1',
							online: '1',
							location: 'W101D8BS00101',
							rssi: 0,
							role: '1',
						},

						{
							mac: '0C:25:76:35:D9:9D',
							routermac: '00:00:00:00:00:00',
							devid: 'W101D8BS00101',
							conn_mode: {
								wired: 0,
								w_2g: 0,
								w_5g: 0,
							},
							ip: '192.168.100.1',
							online: '1',
							location: 'W101D8BS00101',
							rssi: 0,
							role: '1',
						},

						{
							mac: '0C:25:76:35:D9:9D',
							routermac: '00:00:00:00:00:00',
							devid: 'W101D8BS00101',
							conn_mode: {
								wired: 0,
								w_2g: 0,
								w_5g: 0,
							},
							ip: '192.168.100.1',
							online: '1',
							location: 'W101D8BS00101',
							rssi: 0,
							role: '1',
						},

						{
							mac: '0C:25:76:35:D9:9D',
							routermac: '00:00:00:00:00:00',
							devid: 'W101D8BS00101',
							conn_mode: {
								wired: 0,
								w_2g: 0,
								w_5g: 0,
							},
							ip: '192.168.100.1',
							online: '1',
							location: 'W101D8BS00101',
							rssi: 0,
							role: '1',
						},

						{
							mac: '0C:25:76:35:D9:9D',
							routermac: '00:00:00:00:00:00',
							devid: 'W101D8BS00101',
							conn_mode: {
								wired: 0,
								w_2g: 0,
								w_5g: 0,
							},
							ip: '192.168.100.1',
							online: '1',
							location: 'W101D8BS00101',
							rssi: 0,
							role: '1',
						},

						{
							mac: '0C:25:76:35:D9:9D',
							routermac: '00:00:00:00:00:00',
							devid: 'W101D8BS00101',
							conn_mode: {
								wired: 0,
								w_2g: 0,
								w_5g: 0,
							},
							ip: '192.168.100.1',
							online: '1',
							location: 'W101D8BS00101',
							rssi: 0,
							role: '1',
						},

						{
							mac: '0C:25:76:35:D9:9D',
							routermac: '00:00:00:00:00:00',
							devid: 'W101D8BS00101',
							conn_mode: {
								wired: 0,
								w_2g: 0,
								w_5g: 0,
							},
							ip: '192.168.100.1',
							online: '1',
							location: 'W101D8BS00101',
							rssi: 0,
							role: '1',
						},

						{
							mac: '0C:25:76:35:D9:9D',
							routermac: '00:00:00:00:00:00',
							devid: 'W101D8BS00101',
							conn_mode: {
								wired: 0,
								w_2g: 0,
								w_5g: 0,
							},
							ip: '192.168.100.1',
							online: '1',
							location: 'W101D8BS00101',
							rssi: 0,
							role: '1',
						},
						{
							mac: '0C:25:76:35:D9:9D',
							routermac: '00:00:00:00:00:00',
							devid: 'W101D8BS00101',
							conn_mode: {
								wired: 0,
								w_2g: 0,
								w_5g: 0,
							},
							ip: '192.168.100.1',
							online: '1',
							location: 'W101D8BS00101',
							rssi: 0,
							role: '0',
						},
						{
							mac: '0C:25:76:35:D9:9D',
							routermac: '00:00:00:00:00:00',
							devid: 'W101D8BS00101',
							conn_mode: {
								wired: 0,
								w_2g: 0,
								w_5g: 0,
							},
							ip: '192.168.100.1',
							online: '1',
							location: 'W101D8BS00101',
							rssi: 0,
							role: '1',
						},
						{
							mac: '0C:25:76:35:D9:9D',
							routermac: '00:00:00:00:00:00',
							devid: 'W101D8BS00101',
							conn_mode: {
								wired: 0,
								w_2g: 0,
								w_5g: 0,
							},
							ip: '192.168.100.1',
							online: '1',
							location: 'W101D8BS00101',
							rssi: 0,
							role: '1',
						},
						{
							mac: '0C:25:76:35:D9:9D',
							routermac: '00:00:00:00:00:00',
							devid: 'W101D8BS00101',
							conn_mode: {
								wired: 0,
								w_2g: 0,
								w_5g: 0,
							},
							ip: '192.168.100.1',
							online: '1',
							location: 'W101D8BS00101',
							rssi: 0,
							role: '1',
						},
					],
				},
			},
		},
	],
};

const rssiStyle = {
	strong: { color: 'green' },
	weak: { color: 'red' },
};

const ListContent = ({ data = {}, index = 0, parent = {} }) => {
	const { mac = '', ip = '', location = '', rssi = '', role = '' } = data;
	// console.log('ppp', parent);
	return (
		<div
			className={`${index > 0 ? '' : styles['list-content-first']}  ${
				styles['list-content']
			}`}
		>
			<div className={styles['info-title']}>{location}</div>
			<div className={styles['info-bar']}>
				<div className={styles['info-content']}>
					<span>{formatMessage({ id: 'network.rssi' })}:</span>
					<span
						className={styles.detail}
						style={rssi > 20 ? rssiStyle.strong : rssiStyle.weak}
					>
						{rssi > 20
							? formatMessage({ id: 'network.rssi.strong' })
							: formatMessage({ id: 'network.rssi.weak' })}
					</span>
				</div>
				<div className={styles['info-content']}>
					<span>IP:</span>
					<span className={styles.detail}>{ip}</span>
				</div>
				<div className={styles['info-content']}>
					<span>MAC:</span>
					<span className={styles.detail}>{mac}</span>
				</div>
				<div className={styles['info-content']}>
					<span>{formatMessage({ id: 'network.router.parent' })}</span>
					<span className={styles.detail}>
						{`${role}` === '1'
							? formatMessage({ id: 'network.router.parent.none' })
							: parent.mac}
					</span>
				</div>
			</div>
		</div>
	);
};

@connect(
	state => ({
		network: state.network,
		routing: state.routing,
	}),
	dispatch => ({
		checkClientExist: () => dispatch({ type: 'mqttStore/checkClientExist' }),
		subscribeDetail: () => dispatch({ type: 'network/subscribeDetail' }),
		unsubscribeDetail: () => dispatch({ type: 'network/unsubscribeDetail' }),
		setDetailHandler: ({ handler }) =>
			dispatch({ type: 'network/setDetailHandler', payload: { handler } }),
	})
)
class NetworkDetail extends PureComponent {
	constructor(props) {
		super(props);
		this.checkTimer = null;
		// this.state = { deviceList: [], parentRouter: {} };
	}

	componentDidMount() {
		// const { routing: { location: { query = {} } = {} } = {} } = this.props;
		this.checkMQTTClient();
	}

	componentWillUnmount() {
		const { unsubscribeDetail } = this.props;
		unsubscribeDetail();
	}

	deviceHandler = data => {
		console.log(data);
	};

	checkMQTTClient = async () => {
		const { checkClientExist, subscribeDetail, setDetailHandler } = this.props;
		clearTimeout(this.checkTimer);
		const isClientExist = await checkClientExist();
		if (isClientExist) {
			await subscribeDetail();
			await setDetailHandler({ handler: this.deviceHandler });
		} else {
			this.checkTimer = setTimeout(() => this.checkMQTTClient(), 1000);
		}
	};

	render() {
		const { data = [] } = mockData;
		const [dataResult = {}, ,] = data;
		const { result: { sonconnect: { devices = [] } = {} } = {} } = dataResult;
		const parentRoute = devices.find(device => device.role === '1');

		return (
			<Card title={formatMessage({ id: 'network.detail' })}>
				<PageList
					data={devices}
					RenderComponent={({ data: _data, index }) => (
						<ListContent data={_data} index={index} parent={parentRoute} />
					)}
				/>
			</Card>
		);
	}
}

export default NetworkDetail;
