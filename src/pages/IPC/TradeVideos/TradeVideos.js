import React from 'react';

import { Select, DatePicker, Button, Table, Row, Col, Card, Input, Form, Divider } from 'antd';
import moment from 'moment';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';

import { SEARCH_FORM_COL, SEARCH_FORM_GUTTER } from '@/constants/form';
import { DEFAULT_PAGE_LIST_SIZE, DEFAULT_PAGE_SIZE } from '@/constants';
import VideoPlayComponent from '../component/VideoPlayComponent';

import styles from './TradeVideos.less';
import global from '@/styles/common.less';

const { Option } = Select;
const { Search } = Input;
const { RangePicker } = DatePicker;

@connect(
	state => {
		const { tradeVideos, ipcList, loading } = state;
		// console.log(tradeVideos);
		return {
			tradeVideos,
			ipcList,
			loading,
		};
	},
	dispatch => ({
		getTradeVideos({ startTime, endTime, ipcId, posSN, keyword, currentPage, pageSize }) {
			dispatch({
				type: 'tradeVideos/read',
				payload: {
					startTime,
					endTime,
					ipcId,
					posSN,
					keyword,
					currentPage,
					pageSize,
				},
			});
		},
		getPaymentDeviceList(ipcId) {
			return dispatch({
				type: 'tradeVideos/getPaymentDeviceList',
				payload: {
					ipcId,
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
		},
		getPaymentDetailList(orderId) {
			dispatch({
				type: 'tradeVideos/getPaymentDetailList',
				payload: {
					orderId,
				},
			});
		},
		// getIpcList() {
		// 	return dispatch({
		// 		type: 'tradeVideos/getIpcList'
		// 	});
		// },

		getIpcTypeByPosSN(sn) {
			const type = dispatch({
				type: 'tradeVideos/getIpcTypeByPosSN',
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
		getTradeVideo(orderId) {
			const url = dispatch({
				type: 'tradeVideos/getVideo',
				payload: {
					orderId,
				},
			});

			return url;
		},
	})
)
@Form.create()
class TradeVideos extends React.Component {
	state = {
		// selectedStartTime:'',
		// selectedEndTime:'',
		isWatchVideo: false,
		// videoUrl: '',
		// ipcSelected: '0',
		// paymentDeviceSelected:'0',
		ipcType: '',
		// keyWord: '',
		expandedRowKeys: [],
		// currentPaymentDetailList:[]

		currentPage: 1,
		pageSize: DEFAULT_PAGE_SIZE,
	};

	columns = [
		{
			title: formatMessage({ id: 'tradeVideos.camera' }), // '摄像头',
			dataIndex: 'ipcName',
			key: 'ipcName',
			sorter: (a, b) => a.ipcName.localeCompare(b.ipcName),
		},
		{
			title: formatMessage({ id: 'tradeVideos.pos' }), // '收银设备',
			dataIndex: 'paymentDeviceName',
			key: 'paymentDeviceName',
			sorter: (a, b) => a.paymentDeviceName.localeCompare(b.paymentDeviceName),
			render: item => item || formatMessage({ id: 'tradeVideos.unknownDevice' }),
		},
		{
			title: formatMessage({ id: 'tradeVideos.sn' }), // '设备SN',
			dataIndex: 'paymentDeviceSn',
			key: 'paymentDeviceSn',
			sorter: (a, b) => a.paymentDeviceSn.localeCompare(b.paymentDeviceSn),
		},
		{
			title: formatMessage({ id: 'tradeVideos.totalPrice' }), // '交易金额',
			dataIndex: 'totalPrice',
			key: 'totalPrice',
			sorter: (a, b) => a.totalPrice - b.totalPrice,
		},
		{
			title: formatMessage({ id: 'tradeVideos.paymentMethod' }), // '支付方式',
			dataIndex: 'paymentMethod',
			key: 'paymentMethod',
			sorter: (a, b) => a.paymentMethod.localeCompare(b.paymentMethod),
			render: item => (
				<span>
					{item || formatMessage({ id: 'tradeVideos.unknown' })}
				</span>
			),
		},
		{
			title: formatMessage({ id: 'tradeVideos.purchaseTime' }), // '交易时间',
			dataIndex: 'purchaseTime',
			key: 'purchaseTime',
			sorter: (a, b) => moment(a.purchaseTime).valueOf() - moment(b.purchaseTime).valueOf(),
		},
		{},
		{
			title: formatMessage({ id: 'tradeVideos.operation' }), // '操作',
			dataIndex: 'key',
			key: 'action',
			render: (item, record) => {
				const { expandedRowKeys } = this.state;
				return (
					<>
						<a
							className={`${styles['video-watch']} ${
								record.url ? '' : styles.disabled
							}`}
							href="javascript:void(0);"
							onClick={() =>
								this.watchVideoHandler(record.paymentDeviceSn, record.url)
							}
						>
							{record.url
								? formatMessage({ id: 'tradeVideos.viewVideo' })
								: formatMessage({ id: 'tradeVideos.viewVideo.merging' })}
						</a>
						<Divider type="vertical" />
						<a
							className={styles['video-watch']}
							href="javascript:void(0);"
							onClick={() => {
								this.onExpand(record.key);
							}}
						>
							{expandedRowKeys.includes(record.key)
								? formatMessage({ id: 'tradeVideos.closeDetails' })
								: formatMessage({ id: 'tradeVideos.viewDetails' })}
						</a>
					</>
				);
			},
		},
	];

	async componentDidMount() {
		const {
			/* getIpcList, */ getPaymentDeviceList,
			location: { query },
			form,
		} = this.props;
		const { setFieldsValue } = form;
		let { ipcId, posSN } = query;
		// await getIpcList();

		ipcId = ipcId || 0;
		posSN = posSN || 0;

		setFieldsValue({
			camera: ipcId,
		});

		if (ipcId !== 0) {
			await getPaymentDeviceList(ipcId);
			setFieldsValue({
				pos: posSN,
			});
		}

		// const startTime = moment().subtract(1, 'days').unix();
		// const endTime = moment().unix();

		const { currentPage, pageSize } = this.state;

		this.getTradeVideos(currentPage, pageSize);
	}

	watchVideoHandler = async (sn, url) => {
		if (url) {
			const { getIpcTypeByPosSN /* , getTradeVideo */ } = this.props;
			const type = await getIpcTypeByPosSN(sn);
			// console.log(type);

			// const url = await getTradeVideo(orderId);
			// console.log(url);

			this.setState({
				videoUrl: url,
				isWatchVideo: true,
				ipcType: type,
			// 	paymentDeviceSelected: item.paymentDeviceId,
			// 	ipcSelected: item.ipcId
			});
		}
	};

	watchVideoClose = () => {
		this.setState({
			isWatchVideo: false,
		});
	};

	disabledDate = value => {
		if (!value) return false;
		return value.valueOf() > moment().valueOf();
	};

	// changeHandler = (dates) => {
	// 	this.setState({
	// 		selectedStartTime: dates[0],
	// 		selectedEndTime: dates[1]
	// 	});
	// }

	ipcSelectHandler = async value => {
		const { getPaymentDeviceList } = this.props;
		await getPaymentDeviceList(value);

	// 	this.setState({
	// 		ipcSelected: value
	// 	});
	};

	// paymentDeviceSelectHandler = (value) => {
	// 	this.setState({
	// 		paymentDeviceSelected: value
	// 	});
	// }

	// keyWordHandler = (e) => {
	// 	this.setState({
	// 		keyWord: e.target.value
	// 	});
	// }

	getPaymentDetailList = orderId => {
		const { getPaymentDetailList } = this.props;
		getPaymentDetailList(orderId);
	};

	searchHandler = () => {
		const { pageSize } = this.state;
		this.getTradeVideos(1, pageSize);
	};

	getTradeVideos = (currentPage, pageSize) => {
		const { getTradeVideos, form } = this.props;
		const { getFieldsValue } = form;

		const { tradeDate, camera: ipcId, pos: posSN, keywords } = getFieldsValue([
			'tradeDate',
			'camera',
			'pos',
			'keywords',
		]);

		const [startTime, endTime] = tradeDate;
		// console.log(currentPage, pageSize);

		getTradeVideos({
			startTime: startTime
				.set({
					hour: 0,
					minute: 0,
					second: 0,
					millisecond: 0,
				})
				.unix(),
			endTime: endTime
				.set({
					hour: 23,
					minute: 59,
					second: 59,
					millisecond: 999,
				})
				.unix(),
			ipcId,
			posSN,
			keyword: keywords,
			currentPage,
			pageSize,
		});

		this.setState({
			currentPage,
			pageSize,
			expandedRowKeys: [],
		});
	};

	onPaginationChange = (currentPage, pageSize) => {
		this.getTradeVideos(currentPage, pageSize);
	};

	onShowSizeChange = (currentPage, pageSize) => {
		this.getTradeVideos(currentPage, pageSize);
	};

	// onExpand = (expanded, record) => {
	// 	if (expanded) {
	// 		const { expandedRowKeys } = this.state;
	// 		this.getPaymentDetailList(record.key);
	// 		// console.log([...expandedRowKeys, record.key]);
	// 		this.setState({
	// 			expandedRowKeys: Array.from(new Set([...expandedRowKeys, record.key]))
	// 		});
	// 	}
	// }

	onExpand = key => {
		this.getPaymentDetailList(key);

		const { expandedRowKeys } = this.state;
		const keyIndex = expandedRowKeys.indexOf(key);
		// console.log(keyIndex);

		if (keyIndex >= 0) {
			expandedRowKeys.splice(keyIndex, 1);
			this.setState({
				expandedRowKeys,
			});
		} else {
			this.setState({
				expandedRowKeys: [...expandedRowKeys, key],
			});
		}
	};

	render() {
		const {
			tradeVideos: { tradeVideos, paymentDeviceList, total },
			ipcList,
			loading,
			form,
		} = this.props;
		const {
			isWatchVideo,
			/* ipcSelected, paymentDeviceSelected, */ ipcType,
			videoUrl,
			currentPage,
			pageSize,
			expandedRowKeys,
		} = this.state;
		const { getFieldDecorator } = form;

		return (
			<Card bordered={false}>
				<div
					// className={!isWatchVideo ? styles['motion-list-container'] : styles['display-none']}
					className={styles['motion-list-container']}
				>
					<div className={global['search-bar']}>
						<Form layout="inline">
							<Row gutter={SEARCH_FORM_GUTTER.SMALL}>
								<Col {...SEARCH_FORM_COL.ONE_SIXTH}>
									<Form.Item
										label={formatMessage({ id: 'tradeVideos.camera' })} // '摄像机'
									>
										{getFieldDecorator('camera', {
											initialValue: 0,
										})(
											<Select
												// defaultValue={0}
												// value={ipcSelected}
												className={styles['input-item']}
												placeholder={
													formatMessage({
														id: 'tradeVideos.chooseCamera',
													}) /* '请选择摄像头' */
												}
												onChange={this.ipcSelectHandler}
											>
												<Option value={0}>
													{/* 所有 */}
													{formatMessage({ id: 'tradeVideos.all' })}
												</Option>
												{ipcList.map((item, index) => (
													<Option
														key={`ipc-selector-${index}`}
														value={`${item.deviceId}`}
													>
														{item.name}
													</Option>
												))}
											</Select>
										)}
									</Form.Item>
								</Col>
								<Col {...SEARCH_FORM_COL.ONE_SIXTH}>
									<Form.Item
										label={formatMessage({ id: 'tradeVideos.pos' })} // '收银设备'
									>
										{getFieldDecorator('pos', {
											initialValue: 0,
										})(
											<Select
												// defaultValue={0}
												// value={paymentDeviceSelected}
												className={styles['input-item']}
												placeholder={
													formatMessage({
														id: 'tradeVideos.choosePos',
													}) /* '请选择收银设备' */
												}
												// onChange={this.paymentDeviceSelectHandler}
											>
												<Option value={0}>
													{/* 所有 */}
													{formatMessage({ id: 'tradeVideos.all' })}
												</Option>
												{paymentDeviceList &&
													paymentDeviceList.map((item, index) => (
														<Option
															key={`payment-selector-${index}`}
															value={`${item.sn}`}
														>
															{item.name ||
																formatMessage({
																	id: 'tradeVideos.unknownDevice',
																})}
														</Option>
													))}
											</Select>
										)}
									</Form.Item>
								</Col>
								<Col {...SEARCH_FORM_COL.ONE_THIRD}>
									<Form.Item
										label={formatMessage({ id: 'tradeVideos.tradeDate' })} // '交易日期'
									>
										{getFieldDecorator('tradeDate', {
											initialValue: [moment().subtract(30, 'days'), moment()],
										})(
											<RangePicker
												// defaultValue={[moment().subtract(1, 'days'), moment()]}
												className={styles['input-item']}
												disabledDate={this.disabledDate}
												// onChange={this.changeHandler}
												format="YYYY-MM-DD"
											/>
										)}
									</Form.Item>
								</Col>
								<Col {...SEARCH_FORM_COL.ONE_FOURTH}>
									<Form.Item>
										{getFieldDecorator('keywords')(
											<Search
												placeholder={
													formatMessage({
														id: 'tradeVideos.keywords',
													}) /* '请输入关键字进行筛选' */
												}
												// onChange={this.keyWordHandler}
												className={styles['input-item']}
											/>
										)}
									</Form.Item>
								</Col>

								<Col {...SEARCH_FORM_COL.ONE_12TH}>
									<Button
										type="primary"
										className={styles['input-item']}
										onClick={this.searchHandler}
										loading={loading.effects['tradeVideos/read']}
									>
										{/* 查询 */}
										{formatMessage({ id: 'tradeVideos.query' })}
									</Button>
								</Col>
							</Row>
						</Form>
					</div>

					<Table
						columns={this.columns}
						dataSource={tradeVideos}
						loading={loading.effects['tradeVideos/read']}
						defaultExpandedRowKeys={['details']}
						expandedRowKeys={expandedRowKeys}
						// onExpand={this.onExpand}
						expandIconColumnIndex={-1}
						expandIconAsCell={false}
						pagination={{
							current: currentPage,
							pageSize,
							total,
							defaultCurrent: 1,
							showSizeChanger: true,
							showQuickJumper: true,
							defaultPageSize: DEFAULT_PAGE_SIZE,
							pageSizeOptions: DEFAULT_PAGE_LIST_SIZE,
							onShowSizeChange: this.onShowSizeChange,
							onChange: this.onPaginationChange,
						}}
						expandedRowRender={record => (
							<div className={styles['paymemt-detail']}>
								<span
									className={`${styles['payment-detail-title']} ${
										styles['payment-detail-item-name']
									} ${styles['payment-detail-item']}`}
								>
									{/* 商品 */}
									{formatMessage({ id: 'tradeVideos.product' })}
								</span>
								{/* <span className={`${styles['payment-detail-title']} ${styles['payment-detail-item']}`}>单价</span> */}
								<span
									className={`${styles['payment-detail-title']} ${
										styles['payment-detail-item-amount']
									} ${styles['payment-detail-item']}`}
								>
									{/* 数量 */}
									{formatMessage({ id: 'tradeVideos.amount' })}
								</span>
								{/* <span className={`${styles['payment-detail-title']} ${styles['payment-detail-item']}`}>折扣价</span> */}
								{record.details &&
									record.details.map((item, index) => (
										<div key={index}>
											<span
												className={`${styles['payment-detail-item-name']} ${
													styles['payment-detail-item']
												}`}
											>
												{item.name}
											</span>
											{/* <span className={`${styles['payment-detail-item']}`}>{item.perPrice}</span> */}
											<span
												className={`${styles['payment-detail-item']} ${
													styles['payment-detail-item-amount']
												}`}
											>
												{item.quantity}
											</span>
											{/* <span className={`${styles['payment-detail-item']}`}>{item.promotePrice}</span> */}
										</div>
									))}
							</div>
						)}
					/>
				</div>

				{/* <div
					className={isWatchVideo ? styles['video-player'] : styles['display-none']}
				> */}
				<VideoPlayComponent
					className={styles.video}
					playing={isWatchVideo}
					watchVideoClose={this.watchVideoClose}
					videoUrl={videoUrl}
					ipcType={ipcType}
				/>

				{/* </div> */}
			</Card>
		);
	}
}

export default TradeVideos;