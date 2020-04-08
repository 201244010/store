import React from 'react';
import { Card, Row, Col, Divider, Table, Spin, Avatar } from 'antd';
import { formatMessage } from 'umi/locale';
import { connect } from 'dva';
import moment from 'moment';

import { DEFAULT_PAGE_SIZE, DEFAULT_PAGE_LIST_SIZE } from '@/constants';

import styles from './EntryDetail.less';

const { Meta } = Card;

@connect((state) => {
	const { entryDetail:{arrivalList, total, faceInfo}, loading, ipcList } = state;
	return {
		arrivalList,
		total,
		faceInfo,
		loading,
		ipcList
	};
},(dispatch) => ({
	getArrivalList:(params) => {
		const {deviceId, faceId, pageNum, pageSize} = params;
		dispatch({
			type:'entryDetail/readArrivalList',
			payload:{
				deviceId,
				faceId,
				pageNum,
				pageSize
			}
		});
	},
	getFaceInfo:(params) => {
		const { faceId } = params;
		return dispatch({
			type:'entryDetail/getFaceInfo',
			payload:{
				faceId
			}
		});
	},
	deleteArrivalItem:(params) => {
		const { historyIdList } = params;
		return dispatch({
			type:'entryDetail/deleteArrivalItem',
			payload:{
				historyIdList
			}
		});
	},
	getStoreList:() => {
		dispatch({
			type:'entryDetail/getStoreList'
		});
	}
}))

class EntryDetail extends React.Component {

	columns = [
		{
			title: formatMessage({id: 'entry.detail.capture.face'}),
			dataIndex: 'imgUrl',
			key: 'imgUrl',
			render: img => <div className={styles['img-wrapper']}>{img&&img !== ''?<img src={img} />:<Avatar shape="square" size={50} icon="user" />}</div>,
		},
		{
			title: formatMessage({id: 'entry.detail.capture.time'}),
			dataIndex:'arrivalTime',
			key:'arrivalTime',
			render:(time) => (
				<span>{moment.unix(time).format('YYYY.MM.DD HH:mm:ss')}</span>
			)
		},
		{
			title: formatMessage({id: 'entry.detail.shop'}),
			dataIndex:'shopName',
			key:'shopName'
		},
		{
			title: formatMessage({id: 'entry.detail.ipc'}),
			dataIndex:'deviceName',
			key:'deviceName',
			render: (item) => item || formatMessage({ id: 'entry.detail.myCamera'}),
			filters: () => {
				const { ipcList } = this.props;
				return ipcList.map(item => ({
					text: item.name,
					value: item.deviceId
				}));
			},
			onFilter:  (value, record) => record.deviceId === value,
			filterMultiple:false,
		}
	];

	state= {
		currentPage: 1,
		deviceId: undefined,
		pageSize: DEFAULT_PAGE_SIZE,
		faceInfo:{},
		// visible:false
	}

	async componentDidMount(){
		const { currentPage, pageSize } = this.state;
		const { location: { query }, getFaceInfo, getStoreList } = this.props;
		await getStoreList();
		await this.getCurrentArrivalList({currentPage, pageSize});
		
		const {faceId} = query;
		const faceInfo = await getFaceInfo({faceId});
		this.setState({
			faceInfo
		});
	}

	handleLibraryName = groupName => {
		switch(groupName) {
			case 'stranger': return formatMessage({id: 'photoManagement.card.stranger'});
			case 'regular': return formatMessage({id: 'photoManagement.card.regular'});
			case 'employee': return formatMessage({id: 'photoManagement.card.employee'});
			case 'blacklist': return formatMessage({id: 'photoManagement.card.blacklist'});
			default: return groupName;
		}
	};

	getCurrentArrivalList = async(params) => {
		const { deviceId } = this.state;
		const { currentPage, pageSize } = params;
		const { getArrivalList } = this.props;
		const { location: { query } } = this.props;
		const {faceId} = query;
		await getArrivalList({
			faceId,
			deviceId,
			pageNum:currentPage,
			pageSize
		});
	}

	// onShowSizeChange = async (currentPage, pageSize) => {
	// 	console.log('start onShowSizeChange search');
	// 	await this.getCurrentArrivalList({currentPage, pageSize});
	// 	console.log('end onShowSizeChange search');

	// 	this.setState({
	// 		currentPage,
	// 		pageSize
	// 	});
	// }

	// onPaginationChange = async (currentPage, pageSize) => {
	// 	console.log('start onPaginationChange search');
	// 	await this.getCurrentArrivalList({currentPage, pageSize});
	// 	console.log('end onPaginationChange search');

	// 	this.setState({
	// 		currentPage,
	// 		pageSize
	// 	});
	// }

	onTableChange = async(pagination, filters) => {
		const { deviceName: deviceArray } = filters;
		let deviceId;
		if(deviceArray){
			[deviceId] = deviceArray;
		}
		
		const { current, pageSize } = pagination;
		await this.setState({
			currentPage: current,
			pageSize,
			deviceId
		});
		await this.getCurrentArrivalList({currentPage:current, pageSize});
	}

	// async deleteArrivalHandler(historyId){
	// 	const { deleteArrivalItem, getFaceInfo } = this.props;
	// 	const { currentPage, pageSize, faceInfo:{ faceId }} = this.state;
	// 	const historyIdList = [historyId];
	// 	const result = await deleteArrivalItem({historyIdList});
	// 	const faceInfo = await getFaceInfo({faceId});
	// 	this.setState({
	// 		faceInfo
	// 	});
	// 	if(result === ERROR_OK){ // 删除成功
	// 		message.success(formatMessage({id: 'entry.detail.delete.success'}));
	// 	}
	// 	if(result === -1){
	// 		message.error(formatMessage({id: 'entry.detail.delete.fail'}));
	// 	}

	// 	this.getCurrentArrivalList({currentPage, pageSize});
	// }


	render(){
		const { arrivalList, total, loading } = this.props;

		const { currentPage, pageSize, faceInfo } = this.state;
		// const { name } = faceInfo;
		let { name } = faceInfo;

		if(faceInfo.name === ''){
			name = formatMessage({id: 'entry.detail.unknown'});
		}else if(faceInfo.name === undefined){
			name = formatMessage({id: 'entry.detail.undefined'});
		}

		return(
			<Spin spinning={
				loading.effects['entryDetail/getFaceInfo']||
				loading.effects['entryDetail/readArrivalList']||
				loading.effects['ipcList/read']}
			>
				<Card className={styles['entryDetail-container']}>
					<Meta
						title={formatMessage({id: 'entry.detail.user.info'})}
						description={
							<div className={styles['user-info']}>
								<Row gutter={16}>
									<Col span={7}>
										{faceInfo.imgUrl&&faceInfo.imgUrl !==''?<img className={styles['user-avatar']} src={faceInfo.imgUrl} />:<Avatar shape="square" size={50} icon="user" />}
									</Col>
									<Col span={7}>
										<div>{formatMessage({id: 'entry.detail.user.name'})} : {name}</div>
									</Col>
									<Col span={7}>
										<div>{formatMessage({id: 'entry.detail.user.group'})} : {this.handleLibraryName(faceInfo.groupName)}</div>
									</Col>
									<Col span={3}>
										<div>{formatMessage({id: 'entry.detail.arrival.count'})} : {faceInfo.arrivalCount}</div>
									</Col>
								</Row>
							</div>
						}
					/>
					<Divider />
					<h3>{formatMessage({id: 'entry.detail.arrival.record'})}</h3>
					<Table
						className={styles['entry-detail-table']}
						// loading={loading.effects['entryDetail/readArrivalList']}
						rowKey={record => record.historyId}
						dataSource={arrivalList}
						columns={this.columns}
						pagination={
							{
								current: currentPage,
								total,
								pageSize,
								showSizeChanger: true,
								pageSizeOptions: DEFAULT_PAGE_LIST_SIZE,
								defaultPageSize: DEFAULT_PAGE_SIZE,
								// onShowSizeChange:this.onShowSizeChange,
								// onChange:this.onPaginationChange
							}
						}
						onChange={this.onTableChange}
					/>
				</Card>
			</Spin>
		);
	}
}

export default EntryDetail;