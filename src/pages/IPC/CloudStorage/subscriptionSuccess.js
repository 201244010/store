import React from 'react';
import moment from 'moment';
import { Button, Card, Table } from 'antd';
import { connect } from 'dva';
import { formatMessage } from 'umi-plugin-locale';
import styles from './SubscriptionSuccess.less';

@connect(
	_,
	(dispatch) => ({
		navigateTo: (pathId, urlParams) => dispatch({
			type: 'menu/goToPath',
			payload: {
				pathId,
				urlParams
			}
		}),
		getStorageListByOrder: (orderNo) => dispatch({
			type: 'cloudStorage/getStorageListByOrder',
			payload: {
				orderNo
			}
		})

	}))
class SubscriptionSuccess extends React.Component{

	columns = [
		{
			key: 'img',
			title: formatMessage({ id: 'cloudStorage.monitoringArea.img'}),
			dataIndex:'imgUrl',
			render: (img) => {
				if(img){
					return (<img className={styles['ipc-img']} src={img} /> );
				}
				return(<div className={styles['no-img']} />);
			}
		},
		{
			key:'deviceName',
			title: formatMessage({ id: 'cloudStorage.device.name'}),
			dataIndex: 'deviceName',
		},
		{
			key: 'sn',
			title: 'SN',
			dataIndex: 'deviceSn',
		},
		{
			key: 'expireTime',
			title: formatMessage({ id: 'cloudStorage.validTime'}),
			dataIndex:'expireTime',
			render:(expireTime) => {
				if(expireTime){
					const year = moment.unix(expireTime).year();
					const month = moment.unix(expireTime).month();
					const day = moment.unix(expireTime).day();
					return (
						<span>
							{year}{formatMessage({ id: 'cloudStorage.year.unit'})}
							{month}{formatMessage({ id: 'cloudStorage.month.unit'})}
							{day}{formatMessage({ id: 'cloudStorage.day.unit'})}
						</span>);
				}
				return '--';

			}
		},
		
	];

	constructor(props) {
		super(props);
		this.state = {
			successStorageIpcList: [],
		};
	}

	async componentDidMount(){
		const { getStorageListByOrder, location: { query: { orderNo = null } = {} } = {} } = this.props;
		const successStorageIpcList = await getStorageListByOrder(orderNo);
		this.setState({
			successStorageIpcList
		});
	}

	render(){
		const { navigateTo } = this.props;
		const { successStorageIpcList } = this.state;
		return(
			<Card className={styles['subscription-success-container']} bordered={false}>
				<div className={styles['sucess-icon']} />
				<div className={styles['success-tip']}>{formatMessage({id: 'cloudStorage.service.success.subscribe'})}</div>

				<Table
					className={styles.table}
					bordered 
					columns={this.columns}
					locale={{
						emptyText: formatMessage({id: 'cloudStorage.no.ipc'})
					}}
					rowKey='deviceSn'
					dataSource={successStorageIpcList}
					pagination={false}
				/>
				<Button type="primary" onClick={() => navigateTo('serviceManagement')} className={styles.btn}>{formatMessage({id: 'cloudStorage.service.management'})}</Button>
				{/* <Button className={styles.btn} onClick={() => navigateTo('cloudStorage')}>{formatMessage({id: 'cloudStorage.back'})}</Button> */}
			</Card>
		);
	}
}

export default SubscriptionSuccess;