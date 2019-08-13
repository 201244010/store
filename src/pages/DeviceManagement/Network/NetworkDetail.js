import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card } from 'antd';
import PageList from '@/components/List/PageList';
import { formatMessage } from 'umi/locale';
import styles from './Network.less';

const rssiStyle = {
	strong: { color: 'green' },
	weak: { color: 'red' },
};

const ListContent = ({ data = {}, index = 0, parent = {} }) => {
	const { mac = '', ip = '', location = '', rssi = '', role = '' } = data;
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
		getDetailList: ({ sn, networkId }) =>
			dispatch({ type: 'network/getDetailList', payload: { sn, networkId } }),
		setDetailHandler: ({ handler }) =>
			dispatch({ type: 'network/setDetailHandler', payload: { handler } }),
	})
)
class NetworkDetail extends PureComponent {
	constructor(props) {
		super(props);
		this.checkTimer = null;
		this.state = { deviceList: [], parentRouter: {}, detailLoading: true };
	}

	componentDidMount() {
		const {
			routing: { location: { query: { sn = null, networkId = null } = {} } = {} } = {},
		} = this.props;

		if (sn && networkId) {
			this.checkMQTTClient();
		}
	}

	componentWillUnmount() {
		const { unsubscribeDetail } = this.props;
		unsubscribeDetail();
	}

	deviceHandler = (data = []) => {
		// console.log('aaaaaaaa');
		// console.log(data);
		const parentRouter = data.find(info => info.role === '1');
		this.setState({
			deviceList: data,
			parentRouter,
			detailLoading: false,
		});
	};

	checkMQTTClient = async () => {
		const { checkClientExist, subscribeDetail, setDetailHandler, getDetailList } = this.props;
		clearTimeout(this.checkTimer);
		const isClientExist = await checkClientExist();
		if (isClientExist) {
			const {
				routing: { location: { query: { sn = null, networkId = null } = {} } = {} } = {},
			} = this.props;

			await subscribeDetail();
			// console.log(111);
			await setDetailHandler({ handler: this.deviceHandler });
			await getDetailList({ sn, networkId });
		} else {
			this.checkTimer = setTimeout(() => this.checkMQTTClient(), 1000);
		}
	};

	render() {
		const { deviceList = [], parentRouter = {}, detailLoading = true } = this.state;
		return (
			<Card title={formatMessage({ id: 'network.detail' })}>
				<PageList
					loading={detailLoading}
					data={deviceList}
					RenderComponent={({ data: _data, index }) => (
						<ListContent data={_data} index={index} parent={parentRouter} />
					)}
				/>
			</Card>
		);
	}
}

export default NetworkDetail;
