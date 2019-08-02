import React from 'react';
import { Card,Row,Col,Divider,Icon,Table,Modal, message, Spin, Radio, Avatar } from 'antd';
import { formatMessage } from 'umi/locale';
import { connect } from 'dva';
import moment from 'moment';

import { ERROR_OK } from '@/constants/errorCode';
import { DEFAULT_PAGE_SIZE, DEFAULT_PAGE_LIST_SIZE } from '@/constants';

import styles from './EntryDetail.less';

const { confirm } = Modal;
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
	}
}))

class EntryDetail extends React.Component {
	state= {
		currentPage: 1,
		deviceId: undefined,
		pageSize: DEFAULT_PAGE_SIZE,
		faceInfo:{},
		// visible:false
	}

	async componentDidMount(){
		const { currentPage, pageSize } = this.state;
		this.getCurrentArrivalList({currentPage, pageSize});
		const { location: { query }, getFaceInfo} = this.props;
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

	getCurrentArrivalList = (params) => {
		// const { deviceId } = this.state;
		const { currentPage, pageSize, deviceId } = params;
		const { getArrivalList } = this.props;
		const { location: { query } } = this.props;
		const {faceId} = query;
		getArrivalList({
			faceId,
			deviceId,
			pageNum:currentPage,
			pageSize
		});
	}

	onShowSizeChange = (currentPage, pageSize) => {
		this.getCurrentArrivalList({currentPage, pageSize});
		this.setState({
			currentPage,
			pageSize
		});
	}

	onPaginationChange = (currentPage, pageSize) => {
		this.getCurrentArrivalList({currentPage, pageSize});

		this.setState({
			currentPage,
			pageSize
		});
	}

	deviceSelectHandler = e => {
		this.setState({
			deviceId: e.target.value,
		});
	}

	searchHandler = (confirmHandler) => {
		confirmHandler();
		const { deviceId, currentPage, pageSize } = this.state;
		this.getCurrentArrivalList({currentPage, pageSize, deviceId});
	}

	resetHandler = (confirmHandler) => {
		confirmHandler();
		const { pageSize } = this.state;
		const  currentPage = 1;
		this.getCurrentArrivalList({currentPage, pageSize});
		this.setState({
			currentPage,
			deviceId: undefined
		});
	}

	async deleteArrivalHandler(historyId){
		const { deleteArrivalItem } = this.props;
		const { currentPage, pageSize } = this.state;
		const historyIdList = [historyId];
		const result = await deleteArrivalItem({historyIdList});
		if(result === ERROR_OK){ // 删除成功
			message.success(formatMessage({id: 'entry.detail.delete.success'}));
		}
		if(result === -1){
			message.error(formatMessage({id: 'entry.detail.delete.fail'}));
		}
		this.getCurrentArrivalList({currentPage, pageSize});
	}


	render(){
		const { arrivalList, total, loading, ipcList } = this.props;
		const { currentPage, pageSize, faceInfo } = this.state;
		const columns = [
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
					<span>{moment.unix(time).format('YYYY.MM.DD hh:mm:ss')}</span>
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
				filterDropdown: (params) => {
					const { confirm: confirmHandler } = params;
					const { deviceId } = this.state;
					return(
						<div className={styles['entry-detail-drop-down']}>
							<Radio.Group onChange={this.deviceSelectHandler} value={deviceId}>
								{
									ipcList.map((item) => (
										<Radio key={item.deviceId} className={styles['drop-down-radio']} value={item.deviceId}>
											{item.name}
										</Radio>
									))
								}
							</Radio.Group>
							<div className={styles['drop-down-buttons']}>
								<a onClick={() => this.searchHandler(confirmHandler)}>{formatMessage({id: 'entry.detail.confirm'})}</a>
								<a className={styles['reset-button']} onClick={() => this.resetHandler(confirmHandler)}>{formatMessage({id: 'entry.detail.reset'})}</a>
							</div>
						</div>
					);},
			},
			{
				title: formatMessage({id: 'entry.detail.action'}),
				key: 'action',
				render: (item) => (
					<span>
						<a
							href="javascript:;"
							onClick={()=>{
								confirm({
									icon:<Icon style={{color:'red'}} type="close-circle" theme="filled" />,
									title: formatMessage({id: 'entry.detail.delete.confirm.title'}),
									content: formatMessage({id: 'entry.detail.delete.confirm.content'}),
									okText: formatMessage({id: 'entry.detail.delete'}),
									okType: 'danger',
									cancelText: formatMessage({id: 'entry.detail.cancel'}),
									onOk: () => this.deleteArrivalHandler(item.historyId)
								});
							}}
						>
							{formatMessage({id: 'entry.detail.delete'})}
						</a>
					</span>
				)
			},
		];
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
							<Row className={styles['user-info']} gutter={16}>
								<Col span={6}>
									{faceInfo.imgUrl&&faceInfo.imgUrl !==''?<img className={styles['user-avatar']} src={faceInfo.imgUrl} />:<Avatar shape="square" size={50} icon="user" />}
								</Col>
								<Col span={6}>
									<div>{formatMessage({id: 'entry.detail.user.name'})} ：{faceInfo.name === ''? '--': faceInfo.name}</div>
								</Col>
								<Col span={6}>
									<div>{formatMessage({id: 'entry.detail.user.group'})} ：{this.handleLibraryName(faceInfo.groupName)}</div>
								</Col>
								<Col span={6}>
									<div>{formatMessage({id: 'entry.detail.arrival.count'})}：{faceInfo.arrivalCount}</div>
								</Col>
							</Row>
						}
					/>
					<Divider />
					<h3>{formatMessage({id: 'entry.detail.arrival.record'})}</h3>
					<Table
						className={styles['entry-detail-table']}
						// loading={loading.effects['entryDetail/readArrivalList']}
						rowKey={record => record.historyId}
						dataSource={arrivalList}
						columns={columns}
						pagination={
							{
								current: currentPage,
								total,
								pageSize,
								showSizeChanger: true,
								pageSizeOptions: DEFAULT_PAGE_LIST_SIZE,
								defaultPageSize: DEFAULT_PAGE_SIZE,
								onShowSizeChange:this.onShowSizeChange,
								onChange:this.onPaginationChange
							}
						}
					/>
				</Card>
			</Spin>
		);
	}
}

export default EntryDetail;