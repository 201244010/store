import React from 'react';
import { Card, Table, Spin } from 'antd';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import { OPCODE } from '@/constants/mqttStore';
import { formatRelativeTime } from '@/utils/utils';
import styles from './Network.less';

const columns = [
	{
		title: formatMessage({ id: 'network.hostName' }),
		dataIndex: 'hostname',
		key: 'hostname',
	},
	{
		title: formatMessage({ id: 'network.macAddress' }),
		dataIndex: 'mac',
		key: 'mac',
	},
	{
		title: formatMessage({ id: 'network.ipAddress' }),
		dataIndex: 'ip',
		key: 'ip',
	},
	{
		title: formatMessage({ id: 'network.routerMac' }),
		dataIndex: 'sn',
		key: 'sn',
	},
	{
		title: formatMessage({ id: 'network.connectMode' }),
		dataIndex: 'connMode',
		key: 'connMode',
	},
	{
		title: formatMessage({ id: 'network.ontime' }),
		dataIndex: 'ontime',
		key: 'ontime',
	},
];

@connect(
	state => ({
		loading: state.loading,
	}),
	dispatch => ({
		generateTopic: payload => dispatch({ type: 'mqttStore/generateTopic', payload }),
		subscribe: payload => dispatch({ type: 'mqttStore/subscribe', payload }),
		checkClientExist: () => dispatch({ type: 'mqttStore/checkClientExist' }),
		apHandler: payload => dispatch({ type: 'network/apHandler', payload }),
		getDeviceList: payload => dispatch({ type: 'network/getDeviceList', payload }),
		unsubscribe: () => dispatch({ type: 'network/unsubscribeDeviceTopic' }),
	})
)
class ClientList extends React.Component {
	constructor(props) {
		super(props);
		this.checkTime = null;
		this.state = {
			dataSource: [],
			pageSize: 10,
			sn: '',
			networkId: '',
			type: '',
		};
	}

	componentDidMount() {
		const {
			location: {
				query: { sn, networkId, type },
			},
		} = this.props;
		this.setState({ sn, networkId, type }, () => {
			this.checkClient();
		});
	}

	componentWillUnmount() {
		clearTimeout(this.checkTime);
		const { unsubscribe } = this.props;
		unsubscribe();
	}

	// 对返回的数据进行处理
	apHandler = (responseData, action) => {
		const { getDeviceList } = this.props;
		const { errcode } = responseData[0];
		const { sn, networkId, dataSource, type } = this.state;

		// 当未组网时直接用sn号填进去，有routerMac字段时需要再发一个请求进行匹配

		if (errcode === 0 && action === 'list') {
			const { result = {} } = responseData[0];
			let dataArray = [];
			if ((result.data[0] || {}).routermac === undefined) {
				dataArray = result.data.map(item => {
					// item.ontime = formatRelativeTime(item.ontime);
					item.sn = sn;
					item.ontime = formatRelativeTime(item.ontime * 1000);
					return item;
				});
			} else {
				dataArray = result.data.map(item => {
					// item.ontime = formatRelativeTime(item.ontime);
					item.sn = '--';
					item.ontime = formatRelativeTime(item.ontime * 1000);
					return item;
				});
				getDeviceList({
					message: {
						opcode: OPCODE.GET_ROUTES_DETAIL,
						param: {
							sn,
							network_id: networkId,
						},
					},
				});
			}

			// 根据type筛选是否为客户
			if (type === 'guest') {
				const filter = dataArray.filter(item => item.bridge === 'br-guest');
				this.setState({ dataSource: filter });
			} else {
				this.setState({ dataSource: dataArray });
			}
		}

		if (errcode === 0 && action === 'router') {
			// 对路由进行处理
			const {
				result: {
					sonconnect: { devices = [] },
				},
			} = responseData[0];
			dataSource.forEach(item => {
				devices.forEach(single => {
					if (item.routermac.toUpperCase() === single.mac) {
						item.sn = single.devid;
					}
				});
			});
			this.setState({ dataSource });
		}
	};

	checkClient = async () => {
		const { generateTopic, subscribe, checkClientExist, apHandler, getDeviceList } = this.props;
		const { sn, networkId } = this.state;
		const isClientExist = await checkClientExist();
		clearTimeout(this.checkTime);

		if (isClientExist) {
			const apInfo = await generateTopic({ service: 'W1/response', action: 'sub' });
			await subscribe({ topic: [apInfo] });
			await apHandler({ handler: this.apHandler });

			getDeviceList({
				message: {
					opcode: OPCODE.CLIENT_LIST_GET,
					param: {
						sn,
						network_id: networkId,
					},
				},
			});
		} else {
			this.checkTime = setTimeout(() => this.checkClient(), 1000);
		}
	};

	render() {
		const { dataSource, pageSize } = this.state;
		const { loading } = this.props;
		const array = dataSource.slice(0, 50 * pageSize);

		return (
			<Card
				title={formatMessage({ id: 'menu.network.clientListTitle' })}
				className={styles['network-client-table']}
			>
				<Spin spinning={loading.effects['network/apHandler']}>
					<Table
						columns={columns}
						dataSource={array}
						rowKey="mac"
						pagination={{
							showSizeChanger: true,
							onShowSizeChange: (_, size) => this.setState({ pageSize: size }),
						}}
					/>
				</Spin>
			</Card>
		);
	}
}

export default ClientList;
