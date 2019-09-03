import React from 'react';
import { Card } from 'antd';
import { connect } from 'dva';
import moment from 'moment';


import { DEFAULT_PAGE_SIZE } from '@/constants';

import ModalPlayer from '@/components/VideoPlayer/ModalPlayer';
import MotionListSearchBar from './MotionListSearchBar';
import MotionListTable from './MotionListTable';

import styles from './MotionList.less';

@connect((state) => {
	const { motionList: { motionList, total }, ipcList, loading } = state;
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
	async getDeviceInfo( sn ){
		const result = await dispatch({
			type: 'ipcList/getDeviceInfo',
			payload: {
				sn
			}
		});
		return result;
	},

}))

class MotionList extends React.Component {

	state = {
		isWatchVideo: false,
		videoUrl: '',
		deviceInfo: {
			pixelRatio: '16:9'
		},
		currentPage: 1,
		pageSize: DEFAULT_PAGE_SIZE

	};

	async componentDidMount(){
		const { currentPage, pageSize } = this.props;
		this.getCurrentMotionList(currentPage, pageSize);
	}

	searchHandler = () => {
		const { pageSize } = this.state;
		this.getCurrentMotionList(1, pageSize);
		this.setState({
			currentPage: 1
		});
	}

	resetHandler = () => {
		const { form } = this.searchForm.props;
		const { pageSize } = this.state;

		form.setFieldsValue({
			ipcId:0,
			detectedSource:0,
			dateRange:[moment().subtract(7, 'days'),
				moment()]
		});

		this.getCurrentMotionList(1, pageSize);

		this.setState({
			currentPage: 1
		});
	}

	getCurrentMotionList = (currentPage, pageSize) => {
		const { getMotionList } = this.props;
		const { form } = this.searchForm.props;
		const [startTime, endTime] = form.getFieldValue('dateRange');
		const ipcId = form.getFieldValue('ipcId');
		const detectedSource = form.getFieldValue('detectedSource');
		getMotionList({
			startTime: startTime.set({
				hour: 0,
				minute: 0,
				second: 0,
				millisecond: 0
			}).unix(),
			endTime: endTime.set({
				hour: 23,
				minute: 59,
				second: 59,
				millisecond: 999
			}).unix(),
			ipcSelected: ipcId,
			detectedSourceSelected: detectedSource,
			currentPage,
			pageSize
		});

	}

	watchVideoClose = () =>{
		this.setState({
			videoUrl:'',
			isWatchVideo:false
		});
	}

	onShowSizeChange = (currentPage, pageSize) => {
		this.getCurrentMotionList(currentPage, pageSize);

		this.setState({
			currentPage,
			pageSize
		});
	}

	onPaginationChange = (currentPage, pageSize) => {
		this.getCurrentMotionList(currentPage, pageSize);

		this.setState({
			currentPage,
			pageSize
		});
	}

	watchVideoHandler = async (item) =>{
		const { getDeviceInfo } = this.props;
		const deviceInfo = await getDeviceInfo(item.sn);

		this.setState({
			videoUrl:item.video,
			isWatchVideo:true,
			deviceInfo
		});
	}

	watchVideoClose =()=>{
		this.setState({
			videoUrl:'',
			isWatchVideo:false
		});
	}



	render() {
		const { motionList, ipcList, total, loading, getMotionList } = this.props;
		const { isWatchVideo, videoUrl, deviceInfo:{ pixelRatio }, currentPage, pageSize } = this.state;
		return (
			<Card bordered={false}>
				<div className={styles['motion-list-container']}>
					<MotionListSearchBar
						wrappedComponentRef={ref => {
							this.searchForm = ref;
						}}
						ipcList={ipcList}
						getMotionList={getMotionList}
						getCurrentMotionList={this.getCurrentMotionList}
						loading={loading}
						currentPage={currentPage}
						pageSize={pageSize}
						searchHandler={this.searchHandler}
						resetHandler={this.resetHandler}

					/>
					<MotionListTable
						motionList={motionList}
						total={total}
						loading={loading}
						currentPage={currentPage}
						pageSize={pageSize}
						watchVideoHandler={this.watchVideoHandler}
						onShowSizeChange={this.onShowSizeChange}
						onPaginationChange={this.onPaginationChange}
					/>
				</div>
				<ModalPlayer
					defaultDuration={5}
					visible={isWatchVideo}
					onClose={this.watchVideoClose}
					url={videoUrl}
					pixelRatio={pixelRatio}
				/>

			</Card>
		);
	}
}

export default MotionList;