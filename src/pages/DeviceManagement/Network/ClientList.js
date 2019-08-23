import React from 'react';
import { Card, Table, Spin } from 'antd';
import { connect} from 'dva';
import { formatMessage } from 'umi/locale';
import styles from './Network.less';
import { OPCODE } from '@/constants/mqttStore';

const columns = [{
	title: formatMessage({id: 'network.hostName'}), dataIndex: 'hostname', key: 'hostname'
}, {
	title: formatMessage({id: 'network.macAddress'}), dataIndex: 'mac', key: 'mac',
}, {
	title: formatMessage({id: 'network.ipAddress'}), dataIndex: 'ip', key: 'ip'
}, {
	title: formatMessage({id: 'network.routerMac'}), dataIndex: 'routermac', key: 'routermac'
}, {
	title: formatMessage({id: 'network.connectMode'}), dataIndex: 'connMode', key: 'connMode'
}, {
	title: formatMessage({id: 'network.ontime'}), dataIndex: 'ontime', key: 'ontime'
}];



// const pageOption = ['10', '20', '30', '40'];

@connect(
	state => ({
		loading: state.loading
	}),
	dispatch => ({
		generateTopic: payload => dispatch({ type: 'mqttStore/generateTopic', payload }),
		subscribe: payload => dispatch({ type: 'mqttStore/subscribe', payload }),
		checkClientExist: () => dispatch({ type: 'mqttStore/checkClientExist' }),
		apHandler: payload => dispatch({type: 'network/apHandler', payload}),
		getDeviceList: payload => dispatch({type: 'network/getDeviceList', payload}),
		unsubscribe: () => dispatch({type: 'network/unsubscribeDeviceTopic'}),
	})
)
class ClientList extends React.Component {
	constructor(props) {
		super(props);
		this.checkTime = null;
		this.state = {
			dataSource: [],
			pageSize: 10
		};
	}
	
	async componentDidMount() {
		// const { location: { query: { edit }}} = this.props;
		await this.checkClient();
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
		console.log('函数处理');
		
		if(errcode === 0 && action === 'list') {
			//
			if(result.data[0].routermac === undefined) {
				const dataSource = result.data.map(item => {
					item.routermac = 'W101P8CC00069';
					return item;
				});
				this.setState({dataSource});
			} else {
				const dataSource = result.data.map(item => {
					item.routermac = '--';
					return item;
				});
				this.setState({dataSource});
				getDeviceList({
					message: {
						opcode: OPCODE.GET_ROUTES_DETAIL,
						param: {
							sn: 'W101P8CC00069',
							network_id: '2cd01f3293344ad186c9ef798772efe3'
						}
					}
				});
			}
			
			console.log(result.data);
		}
		
		if(errcode === 0 && action === 'router') {
			// 对路由进行处理
		}
	};
	
	checkClient = async () => {
		const { generateTopic, subscribe, checkClientExist, apHandler, getDeviceList } = this.props;
		const isClientExist = await checkClientExist();
		clearTimeout(this.checkTime);
		console.log('服务端是否开启', isClientExist);
		if(isClientExist) {
			const apInfo = await generateTopic({service: 'W1/response', action: 'sub'});
			console.log('url', apInfo);
			await subscribe({ topic: [apInfo] });
			await apHandler({handler: this.apHandler});
			getDeviceList({message: {
				opcode: OPCODE.CLIENT_LIST_GET,
				param: {
					sn: 'W101P8CC00069',
					network_id: '2cd01f3293344ad186c9ef798772efe3'
				},
			}});
			
		} else {
			this.checkTime = setTimeout(() => this.checkClient(), 1000);
		}
	};
	
	render() {
		const { dataSource, pageSize } = this.state;
		const { loading } = this.props;
		const array = dataSource.slice(0, 50 * pageSize);
		
		return (
			<Card title={formatMessage({id: 'menu.network.clientListTitle'})} className={styles['network-client-table']}>
				<Spin spinning={loading.effects['network/apHandler']}>
					<Table columns={columns} dataSource={array} pagination={{showSizeChanger: true, onShowSizeChange: (_, size) => this.setState({pageSize: size})}} />
				</Spin>
				{/* <Pagination className={styles.pagination} pageSizeOptions={pageOption} total={100} showSizeChanger /> */}
			</Card>
		);
	}
}

export default ClientList;