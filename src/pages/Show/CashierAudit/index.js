import React from 'react';
import { connect } from 'dva';
import moment from 'moment';

import TimeLine from '../TimeLine';
import VideoPlayer from '../VideoPlayer';

import styles from './CashierAudit.less';

const TIMER = 60000;
const DAY = 30;
const PAGE_SIZE = 10;
const PAGE_NUM = 1;

/**
 * unit
 * 0 => 元
 * 1 => 万元
 */


@connect(null,
	dispatch => ({
		getTradeList({ startTime, endTime, currentPage, pageSize }) {
			return dispatch({
				type: 'tradeVideos/read',
				payload: {
					startTime,
					endTime,
					currentPage,
					pageSize
				}
			});
		},
		getDeviceInfoByPosSN(sn) {
			const type = dispatch({
				type: 'tradeVideos/getDeviceInfoByPosSN',
				payload: {
					sn,
					startTime: moment()
						.set({
							hours: 0,
							minutes: 0,
							seconds: 0,
							milliseconds: 0,
						})
						.unix(),
					endTime: moment()
						.set({
							hours: 23,
							minutes: 59,
							seconds: 59,
							milliseconds: 999,
						})
						.unix(),
				},
			});
			return type;
		},

	}),
	
)

class CashierAudit extends React.Component {

	constructor(props) {
		super(props);
		const { time } = this.props;
		this.state = {
			tradeList:[],
			activeOrderId:'',
			activeVideoInfo: {
				videoUrl: '',
				pixelRatio: '16:9'
			},
			activeOrderItem:{},
			time,
			activeTime: 'today'
		};
	}


	async componentDidMount(){
		const { activeOrderId } = this.state;
		await this.getTradeList();
		if(activeOrderId === ''){
			await this.setActiveOrder();
		}
		this.timerHandler();
	}

	componentWillReceiveProps(nextProps){
		const { activeTime } = nextProps;
		this.setState({
			activeTime
		});
	}

	getTradeList = async () => {

		let { activeOrderItem } = this.state;	
		const { activeOrderId } = this.state;
		const endTime = moment().unix();
		const startTime = moment().subtract(DAY, 'days').unix();
		const { getTradeList } = this.props;
		const { list = [] } = await getTradeList({startTime, endTime, currentPage:PAGE_NUM, pageSize:PAGE_SIZE});
		let tradeList = [];

		if(list.length >= 6){
			tradeList = list.slice(0,6).map(item => ({
				time:item.purchaseTime,
				amount: Number(item.totalPrice) < 10000 ?
					Number(item.totalPrice).toFixed(2) : 
					(Number(item.totalPrice)/10000).toFixed(2),
				hasVideo: item.url !== '',
				orderId: item.orderId,
				videoUrl: item.url,
				posSn: item.paymentDeviceSn,
				unit: Number(item.totalPrice) < 10000 ? 0 : 1
			}));
		}else if(list.length >= 1) {
			tradeList = list.slice(0,list.length).map(item => ({
				time: item.purchaseTime,
				amount: Number(item.totalPrice) < 10000 ? 
					Number(item.totalPrice).toFixed(2) : 
					(Number(item.totalPrice)/10000).toFixed(2),
				hasVideo: item.url !== '',
				orderId: item.orderId,
				videoUrl : item.url,
				posSn: item.paymentDeviceSn,
				unit: Number(item.totalPrice) < 10000 ? 0 : 1
			}));
		}
		for(let i=tradeList.length; i<6; i++){
			const obj = {
				time: -1,
				amount: -1,
				hasVideo: true,
				unit: 0
			};
			tradeList[i] = obj;
		}

		if(activeOrderItem.orderId && activeOrderItem.orderId !== activeOrderId){
			tradeList = tradeList.sort((a,b) => moment(b.time).valueOf() - moment(a.time).valueOf()).slice(0,5);
			tradeList.push(activeOrderItem);
		}

		// 判断前五条内容是否都是没有视频
		let noVideoFlag = false;
		noVideoFlag = tradeList.slice(0,5).every(item =>(
			!item.hasVideo
		));
		if(noVideoFlag){
			if(tradeList[5].hasVideo){
				tradeList.splice(4, 1, ...tradeList.splice(5, 1, tradeList[4]));
			}else{
				const findVideoList = list.filter(item => (item.orderId && item.url !== '' ));
				if(findVideoList.length > 0){
					const obj = {
						time: findVideoList[0].purchaseTime,
						amount: Number(findVideoList[0].totalPrice) < 10000 ? 
							Number(findVideoList[0].totalPrice).toFixed(2) : 
							(Number(findVideoList[0].totalPrice)/10000).toFixed(2),
						hasVideo: findVideoList[0].url !== '',
						orderId: findVideoList[0].orderId,
						videoUrl : findVideoList[0].url,
						posSn: findVideoList[0].paymentDeviceSn,
						unit: Number(findVideoList[0].totalPrice) < 10000 ? 0 : 1
					};
					tradeList[4] = obj;
				}
			}
		}
		
		const filterList = tradeList.filter(item => (item.orderId && item.hasVideo ));

		if(filterList.length > 0){
			activeOrderItem = filterList[0];
		}

		this.setState({
			tradeList,
			activeOrderItem,
		});
		
	}

	setActiveOrder = async() => {
		const { activeOrderItem } = this.state;
		const { getDeviceInfoByPosSN } = this.props;

		let { activeOrderId} = this.state;

		let pixelRatio = '16:9';
		activeOrderId = activeOrderItem.orderId || '' ;
		const videoUrl = activeOrderItem.videoUrl || '';

		if(videoUrl){
			const deviceInfo = await getDeviceInfoByPosSN(activeOrderItem.posSn);
			pixelRatio = deviceInfo.pixelRatio || '16:9';
		}


		this.setState({
			activeOrderId,
			activeVideoInfo:{
				videoUrl,
				pixelRatio
			}
		});
	}

	timerHandler = () => {
		setInterval(async() => {
			const { activeOrderId } = this.state;
			await this.getTradeList();
			if(activeOrderId === ''){
				await this.setActiveOrder();
			}
		},TIMER);
	}

	render(){
		const { tradeList, activeOrderId, activeVideoInfo, time, activeTime } = this.state;
		return(
			<div className={styles['trade-container']}>
				<TimeLine tradeList={tradeList} activeOrderId={activeOrderId} />
				<VideoPlayer activeVideoInfo={activeVideoInfo} setActiveOrder={this.setActiveOrder} isActiveTimeState={time === activeTime} />
			</div>
		);
	}
}

export default CashierAudit;