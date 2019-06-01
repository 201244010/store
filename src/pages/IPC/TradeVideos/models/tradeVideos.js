
import { getTradeVideos, getVideo , getPaymentDetailList } from '../../services/tradeVideos';
import { getPOSList } from '../../services/posList';
import { ERROR_OK } from '@/constants/errorCode';

export default {
	namespace: 'tradeVideos',
	state: {
		tradeVideos:[],
		paymentDeviceList:[],
		// paymentDetailList:[],
		ipcList:[]
	},
	reducers: {
		readData(state, action){
			const { payload } = action;
			// console.log(payload);
			payload.sort((a,b) => Date.parse(b.purchaseTime)-Date.parse(a.purchaseTime));
			state.tradeVideos = [...payload];
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
			// state.paymentDetailList.push(payload);
		},
		readIpcList(state, { payload: { ipcList }}){
			state.ipcList = [
				...ipcList
			];
		}
	},
	effects: {
		*read({ payload }, { put }){
			const { startTime, endTime } = payload;

			let {ipcSelected: ipcId, paymentDeviceSN, keyword } = payload;

			keyword = keyword === '' ? undefined : keyword;
			paymentDeviceSN = paymentDeviceSN === '0' ? undefined : paymentDeviceSN;
			ipcId = ipcId === '0' ? undefined : ipcId;

			const response = yield getTradeVideos({
				keyword,
				ipcId,
				startTime,
				endTime,
				paymentDeviceSN
			});

			if (response.code === ERROR_OK) {
				const result = response.data;
				yield put({
					type: 'readData',
					payload: result
				});
			}
		},
		*getPOSList(_, { call }) {
			const response = yield call(getPOSList);
			if(response.code === ERROR_OK){
				const posList = response.data;
				return posList;
			}
			return [];
		},
		*getPaymentDeviceList({ payload: { ipcId } },{ put }){
			const posList = yield put.resolve({
				type: 'getPOSList'
			});

			// console.log(posList);
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
		*getIpcList(_,{ put }) {
			const ipcList = yield put.resolve({
				type: 'ipcList/getIpcList'
			});

			yield put({
				type: 'readIpcList',
				payload: {
					ipcList
				}
			});

			return ipcList;
		},
		*getVideo({ payload: { orderId } }, { call, select }) {

			const tradeVideos = yield select(state => state.tradeVideos.tradeVideos);
			// console.log(tradeVideos);
			let no = '';
			tradeVideos.every((item) => {
				if (item.orderId === orderId){
					no = item.orderNo;
					return false;
				}
				return true;
			});

			const response = yield call(getVideo, {
				orderNo: no
			});

			const { code, data } = response;
			if (code === ERROR_OK) {
				return data.address;
			}
			return '';
		},
		*getIpcTypeByPosSN({ payload: { sn }}, { put }) {
			const posList = yield put.resolve({
				type: 'posList/read'
			});
			// const posList = yield select(state => state.posList);
			// console.log(posList);

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

				const ipcType = yield put.resolve({
					type: 'ipcList/getDeviceType',
					payload: {
						sn: ipcSN
					}
				});
				return ipcType;
			}
			return '';
		}
	}
};