
import React from 'react';
import { Select,DatePicker,message,Button,Table,Row,Col,Card } from 'antd';
import moment from 'moment';
import { connect } from 'dva';
import { FormattedMessage,formatMessage } from 'umi/locale';
import VideoPlayComponent from '../component/VideoPlayComponent';


import styles from './MotionList.less';

const { Option } = Select;
const { RangePicker } = DatePicker;

function getTimestamp(time){
	if(typeof(time) === 'string'){
		return Math.round(moment(time).valueOf()/ 1000);
	}
	if( time instanceof moment ){
		 return Math.round(time.valueOf()/ 1000);
	}
	return '';
}


@connect((state) => {
	const { motionList,loading } = state;
	return {
		motionList,
		loading
	};
},(dispatch) => ({
	getMotionList( startTime, endTime,ipcSelected,detectedSourceSelected ){
		dispatch({
			type: 'motionList/read',
			payload: {
				startTime,
				endTime,
				ipcSelected,
				detectedSourceSelected
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
	getIpcList(){
		return dispatch({
			type: 'motionList/getIpcList'
		});
	}
}))
class MotionList extends React.Component {

	state = {
		selectedStartTime:'',
		selectedEndTime:'',
		isWatchVideo:false,
		videoUrl:'',
		ipcSelected:'',
		detectedSourceSelected:'',
		ipcType:''
	};

	columns = [{
		title: <FormattedMessage id='motionList.ipcName' />,
		dataIndex: 'name',
		key: 'name'
	}, {
		title: <FormattedMessage id='motionList.detectedSource' />,
		dataIndex: 'detectedSource',
		key: 'detectedSource',
		render: (item) => {
			switch(item){
				case 1:
					return <FormattedMessage id='motionList.image' />;
				case 2:
					return <FormattedMessage id='motionList.sound' /> ;
				case 3:
					return  <FormattedMessage id='motionList.soundAndImage' />;
				default:
					return  <FormattedMessage id='motionList.else' />;
			}
		}
	}, {
		title: <FormattedMessage id='motionList.detectedTime' />,
		dataIndex: 'detectedTime',
		key: 'detectedTime',
	}, {
		title: <FormattedMessage id='motionList.action' />,
		dataIndex:'video',
		key: 'action',
		render: (item) => (
			<span className={styles['video-watch']} onClick={()=>this.watchVideoHandler(item)}>
				{<FormattedMessage id='motionList.watch' />}
			</span>
		)
	}];


	async componentDidMount(){
		const { getIpcList } = this.props;
		await getIpcList();
		const { getMotionList } = this.props;
		const currentTime = getTimestamp(moment().subtract(1, 'days'));
		const lastDayTime = getTimestamp(moment());
		getMotionList(currentTime,lastDayTime);
		this.setState({
			selectedStartTime:moment().subtract(1, 'days'),
			selectedEndTime:moment()
		});

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

	ipcSelectHandler = (value) => {
		if(value === 0) return;
		this.setState({
			ipcSelected:value
		});
	}

	sourceSelectHandler = (value) => {
		this.setState({
			detectedSourceSelected:value
		});
	}

	disabledDate = (value) =>{
		if(!value) return false;
		return value.valueOf()>moment().valueOf();
	}

	changeHandler = (dates, dateStrings) =>{
		this.setState({
			selectedStartTime:dateStrings[0],
			selectedEndTime:dateStrings[1]
		});
	}

	searchHandler(){
		const { getMotionList } = this.props;
		const { ipcSelected, detectedSourceSelected, selectedStartTime, selectedEndTime } = this.state;
		// const ipcSelected = this.state.ipcSelected;
		// const detectedSourceSelected = this.state.detectedSourceSelected;
		const startTime = selectedStartTime;
		const endTime = moment(selectedEndTime).add(1,'days');

		if(!Number.isNaN(getTimestamp(startTime)) && !Number.isNaN(getTimestamp(endTime))){
			getMotionList(getTimestamp(startTime),getTimestamp(endTime),ipcSelected,detectedSourceSelected);
			return;
		}

		const warningMessage = formatMessage({id: 'motionList.select.detectedTime'});
		message.warning(warningMessage);

	}

	render() {
		const { motionList: motionObj, loading } = this.props;
		const { isWatchVideo, videoUrl, ipcType } = this.state;

		const { motionList, ipcList } = motionObj;
		// const ipcList = this.props.motionList.ipcList;
		// console.log(ipcList);
		const dateFormat = 'YYYY-MM-DD';
		return (
			<Card>
				<div className={!isWatchVideo ? styles['motion-list-container']:styles['display-none']}>
					<Row gutter={24} style={{marginLeft:'10px'}}>
						<Col lg={20} xl={8} xxl={6} style={{marginTop:'10px'}}>
							<FormattedMessage id='motionList.ipcName' />:&nbsp;&nbsp;
							<Select defaultValue='0' placeholder={<FormattedMessage id='motionList.select.ipcName' />} style={{ width: '68%' }} onChange={this.ipcSelectHandler}>
								<Option value='0'><FormattedMessage id='motionList.all' /></Option>
								{
									ipcList && ipcList.map((item,index)=> (
										<Option key={`ipc-selector${index}`} value={item.deviceId}>{item.deviceName}</Option>
									))
								}
							</Select>
						</Col>
						<Col lg={20} xl={7} xxl={6} style={{marginTop:'10px'}}>
							<FormattedMessage id='motionList.detectedSource' />:&nbsp;&nbsp;
							<Select defaultValue='0' placeholder={<FormattedMessage id='motionList.select.detectedSource' />} style={{ width: '70%' }} onChange={this.sourceSelectHandler}>
								<Option value='0'>
									<FormattedMessage id='motionList.all' />
								</Option>
								<Option value='1'>
									<FormattedMessage id='motionList.image.detect' />
								</Option>
								<Option value='2'>
									<FormattedMessage id='motionList.sound.detect' />
								</Option>
								<Option value='3'>
									<FormattedMessage id='motionList.soundAndImage.detect' />
								</Option>
							</Select>
						</Col>
						<Col lg={20} xl={9} xxl={7} style={{marginTop:'10px'}}>
							<FormattedMessage id='motionList.time' />:&nbsp;&nbsp;
							<RangePicker
								defaultValue={[moment().subtract(1, 'days'), moment()]}
								style={{ width: '74%' }}
								disabledDate={this.disabledDate}
								onChange={this.changeHandler}
								format={dateFormat}
							/>
						</Col>
						<Col lg={16} xl={3} xxl={2} style={{marginTop:'10px'}}>
							<Button type="primary" style={{ width: '100%' }} onClick={()=>this.searchHandler()}><FormattedMessage id='motionList.search' /></Button>
						</Col>
					</Row>
					<br />
					<Table columns={this.columns} dataSource={motionList} loading={loading.effects['motionList/read']} />
				</div>
				<div className={isWatchVideo ? styles['video-player'] : styles['display-none']}>
					<VideoPlayComponent playing={isWatchVideo} watchVideoClose={this.watchVideoClose} videoUrl={videoUrl} ipcType={ipcType} />
				</div>

			</Card>
		);
	}
}

export default MotionList;