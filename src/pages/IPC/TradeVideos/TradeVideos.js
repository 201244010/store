import React from 'react';

import { Select, DatePicker, Button, Table, Row, Col, Card, Input, message } from 'antd';
import moment from 'moment';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';

import VideoPlayComponent from '../component/VideoPlayComponent';

import styles from './TradeVideos.less';

const { Option } = Select;
const { Search } = Input;
const { RangePicker } = DatePicker;


@connect((state) => {
	const { tradeVideos,loading } = state;

	return {
		tradeVideos,
		loading
	};
}, (dispatch) => (
	{
		getTradeVideos ( startTime, endTime, ipcSelected, paymentDeviceSN, keyword ){
			dispatch({
				type: 'tradeVideos/read',
				payload: {
					startTime,
					endTime,
					ipcSelected,
					paymentDeviceSN,
					keyword
				}
			});
		},
		getPaymentDeviceList(ipcId) {
			return dispatch({
				type: 'tradeVideos/getPaymentDeviceList',
				payload: {
					ipcId
				}
			});
		},
		getPaymentDetailList(orderId) {
			dispatch({
				type: 'tradeVideos/getPaymentDetailList',
				payload: {
					orderId
				}
			});
		},
		getIpcList() {
			return dispatch({
				type: 'tradeVideos/getIpcList'
			});
		},

		getIpcTypeByPosSN (sn) {
			const type = dispatch({
				type: 'tradeVideos/getIpcTypeByPosSN',
				payload: {
					sn
				}
			});

			return type;
		},
		getTradeVideo (orderId) {
			const url = dispatch({
				type: 'tradeVideos/getVideo',
				payload: {
					orderId
				}
			});

			return url;
		}
	}
))

class TradeVideos extends React.Component {

	state = {
		selectedStartTime:'',
		selectedEndTime:'',
		isWatchVideo: false,
		// videoUrl: '',
		ipcSelected: '0',
		paymentDeviceSelected:'0',
		ipcType: '',
		keyWord: '',
		// expandedRowKeys:[],
		// currentPaymentDetailList:[]
	};

	columns = [{
		title: formatMessage({id: 'tradeVideos.camera'}),// '摄像头',
		dataIndex: 'ipcName',
		key: 'ipcName',
		sorter: (a, b) => a.ipcName.localeCompare(b.ipcName),
	}, {
		title: formatMessage({id: 'tradeVideos.pos'}),// '收银设备',
		dataIndex: 'paymentDeviceName',
		key: 'paymentDeviceName',
		sorter: (a, b) => a.paymentDeviceName.localeCompare(b.paymentDeviceName),
	}, {
		title: formatMessage({id: 'tradeVideos.sn'}),// '设备SN',
		dataIndex: 'paymentDeviceSn',
		key: 'paymentDeviceSn',
		sorter: (a, b) => a.paymentDeviceSn.localeCompare(b.paymentDeviceSn),
	}, {
		title: formatMessage({id: 'tradeVideos.totalPrice'}),// '交易金额',
		dataIndex:'totalPrice',
		key: 'totalPrice',
		sorter: (a, b) => a.totalPrice - b.totalPrice,
	},
	{
		title: formatMessage({id: 'tradeVideos.paymentMethod'}),// '支付方式',
		dataIndex:'paymentMethod',
		key:'paymentMethod',
		sorter: (a, b) => a.paymentMethod.localeCompare(b.paymentMethod),
		render: (item) => (
			<span>
				{
					item || formatMessage({id: 'tradeVideos.unknown'}) // '未知'
				}
			</span>
		)
	},
	{
		title: formatMessage({id: 'tradeVideos.purchaseTime'}),// '交易时间',
		dataIndex:'purchaseTime',
		key: 'purchaseTime',
		sorter: (a, b) => moment(a.purchaseTime).valueOf() - moment(b.purchaseTime).valueOf(),
	},{

	},{
		title: formatMessage({id: 'tradeVideos.operation'}),// '操作',
		dataIndex:'key',
		key: 'action',
		render: (item, record) => (
			<span className={styles['video-watch']} onClick={() => this.watchVideoHandler(item, record.paymentDeviceSn)}>
				{/* 查看视频 */}
				{formatMessage({id: 'tradeVideos.viewVideo'})}
			</span>
		)
	}];


	async componentDidMount(){
		const { getIpcList, getTradeVideos, getPaymentDeviceList, location: { query } } = this.props;
		let { ipcId, posSN } = query;
		await getIpcList();

		ipcId = ipcId || '0';
		posSN = posSN || '0';

		if (ipcId !== '0'){
			await getPaymentDeviceList(ipcId);
		}

		const currentTime = moment().subtract(1, 'days').unix();
		const lastWeekTime = moment().unix();

		this.setState({
			ipcSelected: ipcId,
			paymentDeviceSelected: posSN,
			selectedStartTime: moment().subtract(1, 'days'),
			selectedEndTime: moment()
		});

		getTradeVideos(currentTime,lastWeekTime, ipcId, posSN);
	}

	watchVideoHandler = async (orderId, sn) => {

		const { getIpcTypeByPosSN, getTradeVideo } = this.props;
		const type = await getIpcTypeByPosSN(sn);
		// console.log(type);

		const url = await getTradeVideo(orderId);
		console.log(url);

		if (url) {
			this.setState({
				videoUrl: url,
				isWatchVideo: true,
				ipcType: type,
			// 	paymentDeviceSelected: item.paymentDeviceId,
			// 	ipcSelected: item.ipcId
			});
		}else{
			// message.error('获取审计视频失败，请稍候重试。');
			message.error(formatMessage({id: 'tradeVideos.getVideoFailed'}));
		}

	}

	watchVideoClose = () => {
		this.setState({
			isWatchVideo: false
		});
	}

	disabledDate = (value) => {
		if(!value) return false;
		return value.valueOf() > moment().valueOf();
	}

	changeHandler = (dates) => {
		this.setState({
			selectedStartTime: dates[0],
			selectedEndTime: dates[1]
		});
	}

	ipcSelectHandler = async (value) => {
		const { getPaymentDeviceList } = this.props;
		await getPaymentDeviceList(value);

		this.setState({
			ipcSelected: value
		});
	}

	paymentDeviceSelectHandler = (value) => {
		this.setState({
			paymentDeviceSelected: value
		});
	}

	keyWordHandler = (e) => {
		this.setState({
			keyWord: e.target.value
		});
	}

	getPaymentDetailList = (orderId) => {
		const { getPaymentDetailList } = this.props;
		getPaymentDetailList(orderId);
	}

	searchHandler = () => {
		const { getTradeVideos } = this.props;
		const { ipcSelected, paymentDeviceSelected, selectedStartTime: startTime, selectedEndTime: endTime, keyWord } = this.state;

		getTradeVideos(startTime.unix(), endTime.unix(), ipcSelected, paymentDeviceSelected, keyWord);

	}

	render() {

		const { tradeVideos: { tradeVideos, paymentDeviceList, ipcList }, loading} = this.props;
		const { isWatchVideo, ipcSelected, paymentDeviceSelected, ipcType, videoUrl } = this.state;

		return (
			<Card>
				<div className={!isWatchVideo ? styles['motion-list-container'] : styles['display-none']}>
					<div className={styles['search-container']}>
						<Row gutter={16}>
							<Col span={4}>
								<Select defaultValue='0' value={ipcSelected} className={styles['input-item']} placeholder={formatMessage({id: 'tradeVideos.chooseCamera'}) /* '请选择摄像头' */} onChange={this.ipcSelectHandler}>
									<Option value='0'>
										{/* 所有 */}
										{formatMessage({id: 'tradeVideos.all'})}
									</Option>
									{
										ipcList.map((item,index) => (
											<Option key={`ipc-selector-${index}`} value={`${item.deviceId}`}>{item.name}</Option>
										))
									}
								</Select>
							</Col>
							<Col span={4}>
								<Select defaultValue='0' value={paymentDeviceSelected} className={styles['input-item']} placeholder={formatMessage({id: 'tradeVideos.choosePos'}) /* '请选择收银设备' */} onChange={this.paymentDeviceSelectHandler}>
									<Option value='0'>
										{/* 所有 */}
										{formatMessage({id: 'tradeVideos.all'})}
									</Option>
									{
										paymentDeviceList && paymentDeviceList.map((item, index) => (
											<Option key={`payment-selector-${index}`} value={`${item.sn}`}>{item.name}</Option>
										))
									}
								</Select>
							</Col>
							<Col span={6}>
								<RangePicker
									defaultValue={[moment().subtract(1, 'days'), moment()]}
									className={styles['input-item']}
									disabledDate={this.disabledDate}
									onChange={this.changeHandler}
									format="YYYY-MM-DD"
								/>
							</Col>
							<Col span={4} />
							<Col span={4}>
								<Search
									placeholder={formatMessage({id: 'tradeVideos.keywords'}) /* '请输入关键字进行筛选' */}
									onChange={this.keyWordHandler}
									className={styles['input-item']}
								/>
							</Col>

							<Col span={2}>
								<Button type="primary" className={styles['input-item']} onClick={this.searchHandler}>
									{/* 查询 */}
									{formatMessage({id: 'tradeVideos.query'})}
								</Button>
							</Col>
						</Row>
					</div>

					<Table
						columns={this.columns}
						dataSource={tradeVideos}
						loading={loading.effects['tradeVideos/read']}

						defaultExpandedRowKeys={['details']}
						onExpand={
							(expanded, record) => {
								if (expanded) {
									this.getPaymentDetailList(record.key);
								}
							}
						}
						expandedRowRender={
							(record) => (
								<div className={styles['paymemt-detail']}>
									<span className={`${styles['payment-detail-title']} ${styles['payment-detail-item-name']} ${styles['payment-detail-item']}`}>
										{/* 商品 */}
										{formatMessage({id: 'tradeVideos.product'})}
									</span>
									{/* <span className={`${styles['payment-detail-title']} ${styles['payment-detail-item']}`}>单价</span> */}
									<span className={`${styles['payment-detail-title']} ${styles['payment-detail-item']}`}>
										{/* 数量 */}
										{formatMessage({id: 'tradeVideos.amount'})}
									</span>
									{/* <span className={`${styles['payment-detail-title']} ${styles['payment-detail-item']}`}>折扣价</span> */}
									{
										record.details && record.details.map((item, index) => (
											<div key={index}>
												<span className={`${styles['payment-detail-item-name']} ${styles['payment-detail-item']}`}>{item.name}</span>
												{/* <span className={`${styles['payment-detail-item']}`}>{item.perPrice}</span> */}
												<span className={`${styles['payment-detail-item']}`}>{item.quantity}</span>
												{/* <span className={`${styles['payment-detail-item']}`}>{item.promotePrice}</span> */}
											</div>
										))
									}
								</div>
							)
						}
					/>
				</div>

				<div className={isWatchVideo ? styles['video-player']:styles['display-none']}>
					<VideoPlayComponent className={styles.video} playing={isWatchVideo} watchVideoClose={this.watchVideoClose} videoUrl={videoUrl} ipcType={ipcType} />
				</div>

			</Card>
		);
	}
}

export default TradeVideos;