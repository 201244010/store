import { ERROR_OK } from '@/constants/errorCode';
import { getTradeVideos, getVideo , getPaymentDetailList } from '../pages/IPC/services/tradeVideos';
import { getPOSList } from '../pages/IPC/services/posList';

export default {
	namespace: 'tradeVideos',
	state: {
		total: 0,
		tradeVideos:[],
		paymentDeviceList:[],
		paymentInfo: {
			paymentMethod: '',
			purchaseTime: '',
			totalPrice: '',
			paymentDeviceName: '',
			details: []
		},
		// paymentDetailList:[],
		// ipcList:[]
	},
	reducers: {
		readData(state, action){
			const { payload: { list, total} } = action;
			// console.log(payload);
			list.sort((a,b) => Date.parse(b.purchaseTime)-Date.parse(a.purchaseTime));
			state.tradeVideos = [...list];
			state.total = total;
		},
		readPaymentDeviceList(state, { payload: { posList }}){
			state.paymentDeviceList = [
				...posList
			];
		},
		readPaymentDetailList(state, action){
			const { payload: { orderId, detailList } } = action;

			state.tradeVideos.every(item => {
				// console.log(item.key, orderId);
				if (item.key === orderId) {
					item.details = [
						...detailList
					];
					return false;
				}
				return true;
			});
		},
		readPaymentInfo(state, action){
			const { payload: { orderId, detailList } } = action;

			state.tradeVideos.forEach(item => {
				// console.log(item.key, orderId);
				if (item.key === orderId) {
					item.details = [
						...detailList
					];
					console.log('payment', item);
					state.paymentInfo = item;
				}
			});
		}

	},
	effects: {
		*read({ payload }, { put, call }){
			const { startTime, endTime, currentPage, pageSize } = payload;

			let {ipcId, posSN, keyword } = payload;

			keyword = keyword === '' ? undefined : keyword;
			posSN = posSN === 0 ? undefined : posSN;
			ipcId = ipcId === 0 ? undefined : ipcId;

			const response = yield call(getTradeVideos, {
				keyword,
				ipcId,
				startTime,
				endTime,
				posSN,
				currentPage,
				pageSize
			});
			if (response.code === ERROR_OK) {
				const { data: { list=[], total } } = response;
				// const orderNoList = list.map(item => item.orderNo);

				// if (orderNoList.length > 0) {
				const { code, data } = yield call(getVideo, {
					deviceId: ipcId,
					timeRangeStart: startTime,
					timeRangeEnd: endTime,
					// 筛选条件不一致，pageNum & pageSize不准确
					// pageNum: currentPage,
					// pageSize,
				});

				if (code === ERROR_OK) {
					const { auditVideoList = [] } = data;
					list.forEach(item => {
						auditVideoList.every(videoInfo => {
							if (item.orderNo === videoInfo.orderNo) {
								item.url = videoInfo.videoUrl;
								return false;
							}
							return true;
						});
					});
				}
				// }

				// const tradevideoList = list.map(item => {
				// 	const ipcName = item.ipcName === ''? 'My Camera': item.ipcName;
				// 	item.ipcName = ipcName;
				// 	return {
				// 		...item
				// 	};
				// });
				yield put({
					type: 'readData',
					payload: {
						// list: tradevideoList,
						list,
						total
					}
				});

				return {
					list,
					total
				};
			}
			return {};
		},
		*getPOSList({ payload: { startTime, endTime } }, { call }) {
			const response = yield call(getPOSList, { startTime, endTime });
			if(response.code === ERROR_OK){
				const posList = response.data;
				return posList;
			}
			return [];
		},
		*getPaymentDeviceList({ payload: { ipcId, startTime, endTime } },{ put }){
			const posList = yield put.resolve({
				type: 'getPOSList',
				payload: {
					startTime,
					endTime
				}
			});

			// console.log('pos',posList);
			const ipcList = posList.filter((ipc) => {
				// console.log(ipc.id.toString(), ipcId);
				if (ipc.id.toString() === ipcId){
					return true;
				}
				return false;
			});
			// console.log(ipcList);
			if (ipcList.length > 0) {
				const ipc = ipcList[0];
				const { posList: list } = ipc;
				// console.log(list);
				yield put({
					type: 'readPaymentDeviceList',
					payload: {
						posList: list
					}
				});
			}
		},
		*getPaymentDetailList({ payload },{ put }){
			const { orderId } = payload;
			const response = yield getPaymentDetailList({
				orderId
			});

			const { code, data } = response;

			if (code === ERROR_OK) {
				// console.log(data);
				yield put({
					type: 'readPaymentDetailList',
					payload: {
						orderId,
						detailList: data
					}
				});

				return data;
			}
			return [];
		},
		*getDeviceInfoByPosSN({ payload: { sn, startTime, endTime }}, { put }) {
			const posList = yield put.resolve({
				type: 'getPOSList',
				payload: {
					startTime,
					endTime
				}
			});
			const targetIpc = posList.filter((ipc) => {
				const { posList: list } = ipc;
				const has = list.filter((pos) => pos.sn === sn);

				if (has.length > 0) {
					return true;
				}
				return false;
			});

			if (targetIpc.length > 0) {
				const ipcSN = targetIpc[0].sn;
				const info = yield put.resolve({
					type: 'ipcList/getDeviceInfo',
					payload: {
						sn: ipcSN
					}
				});
				return info;
			}
			return {};
		},
		*getPaymentInfo({ payload }, { put }){
			const { orderId } = payload;
			const response = yield getPaymentDetailList({
				orderId
			});

			const { code, data } = response;

			if (code === ERROR_OK) {
				// console.log(data);
				yield put({
					type: 'readPaymentInfo',
					payload: {
						orderId,
						detailList: data
					}
				});

				return data;
			}
			return [];
		}
	}
};