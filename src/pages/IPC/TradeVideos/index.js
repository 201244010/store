import React from 'react';
import { Card } from 'antd';
import { connect } from 'dva';
import moment from 'moment';

import { DEFAULT_PAGE_SIZE } from '@/constants';
import { judgeHasAudio } from '@/utils/utils';
import SearchBox from './SearchBox';
import TradeVideosTable from './TradeVideosTable';
// import ModalPlayer from '@/components/VideoPlayer/ModalPlayer';
import TradeVideosPlayer from './TradeVideosPlayer';

import styles from './TradeVideos.less';



@connect(
	state => {
		const { tradeVideos, ipcList, loading } =state;
		return {
			tradeVideos,
			ipcList,
			loading
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
					pageSize
				}
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
							milliseconds: 999
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
		getTradeVideo(orderId) {
			const url = dispatch({
				type: 'tradeVideos/getVideo',
				payload: {
					orderId,
				},
			});

			return url;
		},
		getPaymentInfo(orderId) {
			dispatch({
				type: 'tradeVideos/getPaymentInfo',
				payload: {
					orderId,
				}
			});
		},
		getDeviceType: async(sn) => {
			const result = await dispatch({
				type: 'ipcList/getDeviceType',
				payload: {sn}
			});
			return result;
		},
		getCurrentVersion: async(sn) => {
			const result = await dispatch({
				type: 'ipcList/getCurrentVersion',
				payload: {sn}
			});
			return result;
		},

	})
)
class TradeVideos extends React.Component {

	state = {
		isWatchVideo: false,
		detailVisible: false,
		deviceInfo: {
			pixelRatio: '16:9',
		},
		expandedRowKeys: [],
		currentPage: 1,
		pageSize: DEFAULT_PAGE_SIZE,
		hasAudio: '',
	};

	async componentDidMount() {
		const {
			/* getIpcList, */ getPaymentDeviceList,
			location: { query },
		} = this.props;
		const { form } = this.searchForm.props;
		const { setFieldsValue } = form;
		let { ipcId, posSN } = query;
		// await getIpcList();
		// console.log(query);
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


	getTradeVideos = (currentPage, pageSize) => {
		const { getTradeVideos } = this.props;
		const { form } = this.searchForm.props;
		const { getFieldsValue } = form;

		const { tradeDate, camera: ipcId, pos: posSN, keywords } = getFieldsValue([
			'tradeDate',
			'camera',
			'pos',
			'keywords',
		]);

		// console.log('select', tradeDate, ipcId, posSN, keywords);
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

	searchHandler = () => {
		const { pageSize } = this.state;
		this.getTradeVideos(1, pageSize);
	};

	resetHandler = async () => {
		const { location: { query }, getPaymentDeviceList } = this.props;
		let { ipcId, posSN } = query;

		const { form } = this.searchForm.props;
		const { setFieldsValue } = form;

		ipcId = ipcId || 0;
		posSN = posSN || 0;
		setFieldsValue({
			camera: ipcId,
			tradeDate: [moment().subtract(30, 'days'), moment()],
			keywords: ''
		});

		if (ipcId !== 0) {
			await getPaymentDeviceList(ipcId);
			setFieldsValue({
				pos: posSN,
			});
		}

		const { pageSize } = this.state;
		this.getTradeVideos(1, pageSize);

	};
	// selectHandler = () => {
	// 	const { pageSize } = this.state;
	// 	this.getTradeVideos(1, pageSize);
	// };

	ipcSelectHandler = async value => {
		const { getPaymentDeviceList } = this.props;
		// console.log('ipcid',value);
		const { form } = this.searchForm.props;
		const { setFieldsValue } = form;
		setFieldsValue({
			pos: 0
		});
		await getPaymentDeviceList(value);

	};

	onShowSizeChange = (currentPage, pageSize) => {
		this.getTradeVideos(currentPage, pageSize);
	};

	onPaginationChange = (currentPage, pageSize) => {
		this.getTradeVideos(currentPage, pageSize);
	};

	watchVideoHandler = async (sn, url, key) => {
		const { location: { query }, ipcList, getCurrentVersion, getDeviceType } = this.props;
		const { ipcId } = query;
		let ipcSn = '';
		for (let i = 0; i < ipcList.length; i += 1) {
			if (`${ipcList[i].deviceId}` === ipcId) {
				ipcSn = ipcList[i].sn;
				console.log('true ipcSn=', ipcSn);
				break;
			}
		}
		// console.log('ipcId=', ipcId);
		// console.log('ipcList=', ipcList);
		const ipcType = await getDeviceType(ipcSn);
		const currentVersion = await getCurrentVersion(ipcSn);
		const hasAudio = judgeHasAudio({
			deviceVision: currentVersion,
			deviceType: ipcType
		});
		console.log('hasAudio=', hasAudio);

		if (url) {
			const { getDeviceInfoByPosSN /* , getTradeVideo */, getPaymentInfo } = this.props;
			const { tradeVideos: { tradeVideos } } = this.props;
			const deviceInfo = await getDeviceInfoByPosSN(sn);
			await getPaymentInfo(key);
			console.log('tradeVideos', tradeVideos);

			// const url = await getTradeVideo(orderId);
			// console.log(url);

			this.setState({
				videoUrl: url,
				isWatchVideo: true,
				deviceInfo,
				hasAudio,
				// ipcType: type,
			// 	paymentDeviceSelected: item.paymentDeviceId,
			// 	ipcSelected: item.ipcId
			});
		} else {
			this.setState({
				hasAudio
			});
		}
	};

	getPaymentDetailList = orderId => {
		const { getPaymentDetailList } = this.props;
		// console.log(getPaymentDetailList);
		getPaymentDetailList(orderId);
	};

	onExpand = key => {
		// console.log(key);
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

	watchVideoClose = () => {
		this.setState({
			isWatchVideo: false,
			detailVisible: false
		});
	};

	showPaymentInfo = () => {
		console.log('show');
		this.setState({
			detailVisible: true
		});
	}


	render() {
		const { ipcList, loading } = this.props;
		const { tradeVideos: { tradeVideos, paymentDeviceList, total, paymentInfo } } = this.props;
		const {
			isWatchVideo,
			/* ipcSelected, paymentDeviceSelected, ipcType, */
			deviceInfo: { pixelRatio },
			videoUrl,
			currentPage,
			pageSize,
			expandedRowKeys,
			detailVisible,
			hasAudio,
		} = this.state;
		// console.log('tradeVideo ipcList=', ipcList);
		return(
			<Card bordered={false}>
				<div
					// className={!isWatchVideo ? styles['motion-list-container'] : styles['display-none']}
					className={styles['trade-videos-container']}
				>
					<SearchBox
						wrappedComponentRef={form => {
							this.searchForm = form;
						}}
						ipcList={ipcList}
						paymentDeviceList={paymentDeviceList}
						ipcSelectHandler={this.ipcSelectHandler}
						searchHandler={this.searchHandler}
						resetHandler={this.resetHandler}
						loading={loading.effects['tradeVideos/read']}
					/>
					<TradeVideosTable
						tradeVideos={tradeVideos}
						total={total}
						currentPage={currentPage}
						pageSize={pageSize}
						expandedRowKeys={expandedRowKeys}
						onShowSizeChange={this.onShowSizeChange}
						onPaginationChange={this.onPaginationChange}
						watchVideoHandler={this.watchVideoHandler}
						onExpand={this.onExpand}
						loading={loading.effects['tradeVideos/read']}
					/>
				</div>
				{/* <ModalPlayer
					className={styles.video}
					visible={isWatchVideo}
					onClose={this.watchVideoClose}
					url={videoUrl}

					pixelRatio={pixelRatio}
				/> */}
				<TradeVideosPlayer
					className={styles.video}
					visible={isWatchVideo}
					onClose={this.watchVideoClose}
					url={videoUrl}
					paymentInfo={paymentInfo}
					pixelRatio={pixelRatio}
					detailVisible={detailVisible}
					showPaymentInfo={this.showPaymentInfo}
					hasAudio={hasAudio}
				/>
			</Card>
		);
	}
}
export default TradeVideos;