import React from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { TIMER, DAY } from '@/constants';
import TimeLine from '../TimeLine';
import VideoPlayer from '../VideoPlayer';

import styles from './CashierAudit.less';


@connect(null,
	dispatch => ({
		getTradeList({ startTime, endTime }) {
			return dispatch({
				type: 'tradeVideos/read',
				payload: {
					startTime,
					endTime
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

	state = {
		tradeList:[],
		activeOrderId:'',
		activeVideoInfo: {
			videoUrl: '',
			pixelRatio: '16:9'
		},
		activeOrderItem:{}
	}

	async componentDidMount(){
		const { activeOrderId } = this.state;
		await this.getTradeList();
		if(activeOrderId === ''){
			await this.setActiveOrder();
		}
		this.timerHandler();
	}


	getTradeList = async () => {

		let { activeOrderItem } = this.state;	
		const { activeOrderId } = this.state;
		const endTime = moment().unix();
		const startTime = moment().subtract(DAY, 'days').unix();
		const { getTradeList } = this.props;
		const { list = [] } = await getTradeList({startTime, endTime});
		let tradeList = [];
		if(list.length >= 6){
			tradeList = list.slice(0,6).map(item => ({
				time:item.purchaseTime,
				amount:item.totalPrice,
				hasVideo: item.url !== '',
				orderId: item.orderId,
				videoUrl: item.url,
				posSn: item.paymentDeviceSn
			}));
		}else if(list.length >= 1) {
			tradeList = list.slice(0,list.length).map(item => ({
				time:item.purchaseTime,
				amount:item.totalPrice,
				hasVideo: item.url !== '',
				orderId: item.orderId,
				videoUrl : item.url,
				posSn: item.paymentDeviceSn
			}));
		}
		for(let i=tradeList.length; i<6; i++){
			const obj = {
				time: -1,
				amount: -1,
				hasVideo: true,
			};
			tradeList[i] = obj;
		}

		if(activeOrderItem.orderId && activeOrderItem.orderId !== activeOrderId){
			tradeList = tradeList.sort((a,b) => moment(b.time).valueOf() - moment(a.time).valueOf()).slice(0,5);
			tradeList.push(activeOrderItem);
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
		},TIMER.TRADE_SHOW);
	}

	render(){
		const { tradeList, activeOrderId, activeVideoInfo } = this.state;

		return(
			<div className={styles['trade-container']}>
				<TimeLine tradeList={tradeList} activeOrderId={activeOrderId} />
				<VideoPlayer activeVideoInfo={activeVideoInfo} setActiveOrder={this.setActiveOrder} />
			</div>
		);
	}
}

export default CashierAudit;