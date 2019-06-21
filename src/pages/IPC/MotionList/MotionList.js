
import React from 'react';
import { Select, DatePicker, Button, Table, Row, Col, Card, Form } from 'antd';
import moment from 'moment';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';

import { SEARCH_FORM_COL, SEARCH_FORM_GUTTER } from '@/constants/form';
import { DEFAULT_PAGE_LIST_SIZE, DEFAULT_PAGE_SIZE } from '@/constants';

import VideoPlayComponent from '../component/VideoPlayComponent';


import styles from './MotionList.less';
import global from '@/styles/common.less';

const { Option } = Select;
const { RangePicker } = DatePicker;

// function getTimestamp(time){
// 	if(typeof(time) === 'string'){
// 		return Math.round(moment(time).valueOf()/ 1000);
// 	}

// 	if( time instanceof moment ){
// 		 return Math.round(time.valueOf()/ 1000);
// 	}
// 	return '';
// }


@connect((state) => {
	const { motionList: { motionList, total }, ipcList, loading } = state;
	// console.log(motionList, ipcList);
	return {
		motionList,
		total,
		ipcList,
		loading
	};
},(dispatch) => ({
	getMotionList({ startTime, endTime, ipcSelected, detectedSourceSelected, currentPage, pageSize }){
		dispatch({
			type: 'motionList/read',
			payload: {
				startTime,
				endTime,
				ipcSelected,
				detectedSourceSelected,
				currentPage,
				pageSize
			}
		});
	},
	async getIpcType( sn ){
		const result = await dispatch({
			type: 'ipcList/getDeviceType',
			payload: {
				sn
			}
		});
		return result;
	},
	// getIpcList(){
	// 	return dispatch({
	// 		type: 'motionList/getIpcList'
	// 	});
	// }
}))
@Form.create()
class MotionList extends React.Component {

	state = {
		// selectedStartTime: '',
		// selectedEndTime: '',
		isWatchVideo: false,
		videoUrl: '',
		// ipcSelected: '',
		// detectedSourceSelected: '',
		ipcType: '',

		currentPage: 1,
		pageSize: DEFAULT_PAGE_SIZE
	};

	columns = [{
		title: formatMessage({id: 'motionList.ipcName'}),
		dataIndex: 'name',
		key: 'name'
	}, {
		title: formatMessage({id: 'motionList.detectedSource'}),
		dataIndex: 'detectedSource',
		key: 'detectedSource',
		render: (item) => {
			switch(item){
				case 1:
					return formatMessage({id: 'motionList.image'});
				case 2:
					return formatMessage({id: 'motionList.sound'});
				case 3:
					return formatMessage({id: 'motionList.soundAndImage'});
				default:
					return formatMessage({id: 'motionList.else'});
			}
		}
	}, {
		title: formatMessage({id: 'motionList.detectedTime'}),
		dataIndex: 'detectedTime',
		key: 'detectedTime',
	}, {
		title: formatMessage({id: 'motionList.action'}),
		dataIndex:'video',
		key: 'action',
		render: (item) => (
			<span className={styles['video-watch']} onClick={()=>this.watchVideoHandler(item)}>
				{formatMessage({id: 'motionList.watch'})}
			</span>
		)
	}];


	async componentDidMount(){
		const { getMotionList } = this.props;
		const { currentPage, pageSize } = this.state;

		const startTime = moment().subtract(1, 'days');
		const endTime = moment();
		// getMotionList(currentTime,lastDayTime);
		getMotionList({
			startTime: startTime.unix(),
			endTime: endTime.unix(),
			currentPage,
			pageSize
		});


		// this.setState({
		// 	selectedStartTime: startTime,
		// 	selectedEndTime: endTime
		// });

	}

	watchVideoHandler = async (item) =>{
		const { getIpcType } = this.props;
		const ipcType = await getIpcType(item.sn);

		this.setState({
			videoUrl:item.video,
			isWatchVideo:true,
			ipcType
		});
	}

	watchVideoClose =()=>{
		this.setState({
			videoUrl:'',
			isWatchVideo:false
		});
	}

	// ipcSelectHandler = (value) => {
	// 	if(value === 0) return;
	// 	this.setState({
	// 		ipcSelected:value
	// 	});
	// }

	// sourceSelectHandler = (value) => {
	// 	this.setState({
	// 		detectedSourceSelected: value
	// 	});
	// }

	disabledDate = (value) =>{
		if(!value) return false;
		return value.valueOf() > moment().valueOf();
	}

	// changeHandler = (dates, dateStrings) =>{
	// 	this.setState({
	// 		selectedStartTime: dateStrings[0],
	// 		selectedEndTime: dateStrings[1]
	// 	});
	// }

	onShowSizeChange = (currentPage, pageSize) => {
		this.getMotionList(currentPage, pageSize);

		this.setState({
			currentPage,
			pageSize
		});

		console.log('onShowSizeChange', currentPage, pageSize);
	}

	onPaginationChange = (currentPage, pageSize) => {
		this.getMotionList(currentPage, pageSize);

		this.setState({
			currentPage,
			pageSize
		});

		console.log('onPaginationChange', currentPage, pageSize);
	}

	getMotionList = (currentPage, pageSize) => {
		const { getMotionList, form: { getFieldValue } } = this.props;

		const [startTime, endTime] = getFieldValue('dateRange');
		const ipcId = getFieldValue('ipcId');
		const detectedSource = getFieldValue('detectedSource');

		console.log(startTime, endTime, ipcId, detectedSource, currentPage, pageSize);

		getMotionList({
			startTime: startTime.unix(),
			endTime: endTime.unix(),
			ipcSelected: ipcId,
			detectedSourceSelected: detectedSource,
			currentPage,
			pageSize
		});

	}

	searchHandler = () => {
		const { currentPage , pageSize } = this.state;

		this.getMotionList(currentPage , pageSize);
	}

	render() {
		const { motionList, ipcList, total, loading, form } = this.props;
		const { isWatchVideo, videoUrl, ipcType, currentPage, pageSize } = this.state;
		const { getFieldDecorator } = form;
		const dateFormat = 'YYYY-MM-DD';

		return (
			<Card bordered={false}>
				<div className={!isWatchVideo ? styles['motion-list-container'] : styles['display-none']}>
					<div className={global['search-bar']}>
						<Form layout="inline">
							<Row gutter={SEARCH_FORM_GUTTER.NORMAL}>
								<Col {...SEARCH_FORM_COL.ONE_FOURTH}>
									<Form.Item
										label={formatMessage({id: 'motionList.ipcName'})}
									>
										{
											getFieldDecorator('ipcId', {
												initialValue: 0
											})(
												<Select
													// defaultValue='0'
													placeholder={formatMessage({id: 'motionList.select.ipcName'})}
													// onChange={this.ipcSelectHandler}
												>
													<Option value={0}>
														{formatMessage({ id: 'motionList.all' })}
													</Option>

													{
														ipcList && ipcList.map((item,index)=> (
															<Option key={`ipc-selector${index}`} value={item.deviceId}>{item.name}</Option>
														))
													}

												</Select>
											)
										}
									</Form.Item>
								</Col>
								<Col {...SEARCH_FORM_COL.ONE_FOURTH}>
									<Form.Item
										label={formatMessage({id: 'motionList.detectedSource'})}
									>
										{
											getFieldDecorator('detectedSource', {
												initialValue: 0
											})(
												<Select
													// defaultValue='0'
													placeholder={formatMessage({id: 'motionList.select.detectedSource'})}
													// onChange={this.sourceSelectHandler}
												>
													<Option value={0}>
														{formatMessage({id: 'motionList.all'})}
													</Option>
													<Option value={1}>
														{formatMessage({id: 'motionList.image.detect'})}
													</Option>
													<Option value={2}>
														{formatMessage({id: 'motionList.sound.detect'})}
													</Option>
													<Option value={3}>
														{formatMessage({id: 'motionList.soundAndImage.detect'})}
													</Option>
												</Select>
											)
										}

									</Form.Item>

								</Col>
								<Col {...SEARCH_FORM_COL.ONE_THIRD}>
									<Form.Item
										label={formatMessage({id: 'motionList.time'})}
									>
										{
											getFieldDecorator('dateRange', {
												initialValue: [
													moment().subtract(1, 'days'),
													moment()
												]
											})(
												<RangePicker
													// defaultValue={[moment().subtract(1, 'days'), moment()]}
													disabledDate={this.disabledDate}
													// onChange={this.changeHandler}
													format={dateFormat}
												/>
											)
										}
									</Form.Item>
								</Col>
								<Col {...SEARCH_FORM_COL.ONE_SIXTH}>
									<Button
										type="primary"
										onClick={()=>this.searchHandler()}
									>
										{formatMessage({id: 'motionList.search'})}
									</Button>
								</Col>
							</Row>
						</Form>
					</div>
					<div className={styles['table-wrapper']}>
						<Table
							columns={this.columns}
							dataSource={motionList}
							loading={loading.effects['motionList/read']}
							pagination={
								{
									current: currentPage,
									total,
									pageSize,
									showQuickJumper: true,
									showSizeChanger: true,
									pageSizeOptions: DEFAULT_PAGE_LIST_SIZE,
									defaultPageSize: DEFAULT_PAGE_SIZE,
									onShowSizeChange: this.onShowSizeChange,
									onChange: this.onPaginationChange
								}
							}
						/>
					</div>
				</div>

				{/* <div className={isWatchVideo ? styles['video-player'] : styles['display-none']}> */}
				<VideoPlayComponent playing={isWatchVideo} watchVideoClose={this.watchVideoClose} videoUrl={videoUrl} ipcType={ipcType} />
				{/* </div> */}

			</Card>
		);
	}
}

export default MotionList;