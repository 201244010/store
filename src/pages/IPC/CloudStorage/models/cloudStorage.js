import { order, getOrderInfo } from '../../services/order';
import { getStorageIpcList } from '../../services/cloudStorage';
import { ERROR_OK } from '@/constants/errorCode';
import { ORDER_STATUS } from '../constant';

export default {
	namespace: 'cloudStorage',
	state: {
		storageIpcList: [],
		bundledStatus: 2, // 1: 存在未激活ipc, 2: 全部ipc已激活
	},
	reducers: {
		readData(state, { payload }) {
			return {
				...state,
				...payload
			};
		},
	},
	effects: {
		*getStorageIpcList({payload}, { put }) {
			const { sn } = payload;
			const response = yield getStorageIpcList({
				deviceSnList: sn ? [sn] : undefined,
			});
			const { code, data } = response;
			const { deviceList = [] } = data;
		
			if(code === ERROR_OK) {
				// true 为全部已激活，false 存在未激活的ipc
				const bundledStatusBool = deviceList.length === 0 ? true : deviceList.every((item) => (
					item.activeStatus === 2 || !item.activeStatus
				));
				
				yield put({
					type: 'readData',
					payload: {
						storageIpcList: deviceList,
						bundledStatus: bundledStatusBool ? 2 : 1,
					}
				});
				
				return deviceList;
			}
			
			return [];
		},
		*order({ payload }){
			const { ipcSelectedList, invoiceInfo, productNo, bundledStatus } = payload;
			const productList = ipcSelectedList.map((sn) => ({
				productNo,
				deviceSn: sn,
				productCnt: 1,
				bundledStatus,
			}));
			const response = yield order({
				orderSource: 1,
				productList,
				invoiceInfo
			});
			
			return response;
		},
		*getStorageListByOrder({payload}){
			const { orderNo } = payload;
			const orderInfoResult = yield getOrderInfo({
				orderNo
			});
			const { code, data = {} } = orderInfoResult;
			if(code === ERROR_OK){
				const { serviceList = [] } = data;
				const snList = serviceList.map((item) => item.deviceSn);
				const response = yield getStorageIpcList({
					deviceSnList: snList,
				});
				const { code: successIpcListCode, data: { deviceList = [] } } = response;
				if(successIpcListCode === ERROR_OK) {
					return deviceList;
				}
			}
			return [];
		},
		*getCountDown({ payload }){
			const { orderNo } = payload;
			const orderInfoResult = yield getOrderInfo({
				orderNo
			});
			const { code, data = {} } = orderInfoResult;
			if(code === ERROR_OK) {
				return data.remainingTime;
			}
			return undefined;
		},
		*getOrderStatus({ payload }){
			const { orderNo } = payload;
			const response = yield getOrderInfo({
				orderNo
			});
			const { code, data = {} } = response;
			if(code === ERROR_OK){
				const { status, serviceList = [] } = data;
				if(status === 1){
					return ORDER_STATUS.UNPAID;
				}
				if(status === 4){
					const serviceStatus = serviceList.length === 0 ? false : serviceList.every((item) => (
						item.subscribeStatus === 1
					));
					if(serviceStatus){
						return ORDER_STATUS.SUCCESS;
					}
					return ORDER_STATUS.SUBSCRIBING;
				}
				if(status === 5){
					return ORDER_STATUS.CLOSE;
				}
				return '';
			}
			return '';
		}
	},
};