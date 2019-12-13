import React from 'react';
import moment from 'moment';
import { Button, Card, Table } from 'antd';
import { connect } from 'dva';
import { formatMessage } from 'umi-plugin-locale';
import styles from './SubscriptionSuccess.less';

@connect(
	null,
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

	successColumns = [
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
			render:(deviceName) => (<div className={styles.deviceName}>{deviceName}</div>)
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

	waitColumns = [
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
			render:(deviceName) => (<div className={styles.deviceName}>{deviceName}</div>)
		},
		{
			key: 'sn',
			title: 'SN',
			dataIndex: 'deviceSn',
		},
	];

	constructor(props) {
		super(props);
		this.state = {
			successStorageIpcList: [],
			status: undefined
		};
	}

	async componentDidMount(){
		const { getStorageListByOrder, location: { query: { orderNo = null, status = undefined } = {} } = {} } = this.props;
		const successStorageIpcList = await getStorageListByOrder(orderNo);
		this.setState({
			successStorageIpcList,
			status
		});
	}

	render(){
		const { navigateTo } = this.props;
		const { successStorageIpcList, status } = this.state;
		return(
			<Card className={styles['subscription-success-container']} bordered={false}>
				{status === 'success' && 
				<>
					<div className={styles['success-icon']} />
					<div className={styles['success-tip']}>{formatMessage({id: 'cloudStorage.service.success.subscribe'})}</div>
				</>}
				{status === 'waitting' && 
				<>
					<div className={styles['waitting-icon']} />
					<div className={styles['success-tip']}>{formatMessage({id: 'cloudStorage.waitting.sub'})}</div>
				</>
				}

				<Table
					className={styles.table}
					bordered 
					columns={status === 'waitting' ? this.waitColumns : this.successColumns}
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