import { order } from '../../services/order';
import { getStorageIpcList } from '../../services/cloudStorage';
import { ERROR_OK } from '@/constants/errorCode';


export default {
	namespace: 'cloudStorage',
	state: {
		storageIpcList: []
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
			const response = yield getStorageIpcList();
			const { code, data } = response;
			let  { deviceList = [] } = data;
		
			if(code === ERROR_OK) {
				for(let i = 0; i < deviceList.length ; i++){
					if(deviceList[i].deviceSn === sn){
						const item = deviceList.splice(i,1);
						deviceList = item.concat(deviceList);
						break;
					}
				}
				yield put({
					type: 'readData',
					payload: {
						storageIpcList: deviceList
					}
				});
				
				return deviceList;
			}
			
			return [];
		},
		*order({ payload }){
			const { productNo, deviceSn } = payload;
			const response = yield order({
				productCnt: 1,
				orderSource: 1,
				productList:[{
					productNo,
					deviceSn,
				}]
			});
			
			return response;
		}
	},
};