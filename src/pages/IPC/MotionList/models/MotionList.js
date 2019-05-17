
import { getMotionList,getIpcList } from '../services/MotionList';
import { ERROR_OK } from '@/constants/errorCode';

export default {
	namespace: 'motionList',
	state: {
		motionList:[],
		ipcList:[]
	},
	reducers: {
		readData(state,action){
			const { payload } = action;
			payload.sort((a,b) => Date.parse(b.detectedTime)-Date.parse(a.detectedTime));
			state.motionList = [...payload];
		},
		readIpcList(state,action){
			const { payload } = action;
			state.ipcList = [...payload];
		}
	},
	effects: {
		*read({ payload },{ put }){
			// const companyId = yield put.resolve({
			// 	type: 'global/getCompanyIdFromStorage'
			// });
			// const shopId = yield select((state) => {
			// 	return state.shops.currentShopId;
			// });
			const { startTime, endTime,ipcSelected,detectedSourceSelected } = payload;
			let deviceId;
			let source;
			if(ipcSelected){
				// deviceId = yield put.resolve({
				// 	type: 'ipcList/getDeviceId',
				// 	payload: {
				// 		sn:ipcSelected
				// 	}
				// });
				deviceId = ipcSelected;
			}
			if(detectedSourceSelected){
				source = detectedSourceSelected;
			}
			const response = yield getMotionList({
				startTime,
				endTime,
				deviceId,
				source
			});	
			if (response.code === ERROR_OK) {
				const result = response.data;
				yield put({
					type: 'readData',
					payload: result
				});
			}
		},
		*getIpcType({ payload },{ put }){
			const { sn } = payload;
			const type = yield put.resolve({
				type:'ipcList/getDeviceType',
				payload:{
					sn
				}
			});
			return type;
		},
		*getIpcList(_,{ put }){
			// const companyId = yield put.resolve({
			// 	type: 'global/getCompanyIdFromStorage'
			// });
			// const shopId = yield select((state) => {
			// 	return state.shops.currentShopId;
			// });
			// console.log(`motionList: companyId:${companyId} shopId${shopId}`);
			const response = yield getIpcList();	
			if (response.code === ERROR_OK) {
				const result = response.data;
				// console.log(result);
				yield put({
					type: 'readIpcList',
					payload: result
				});
			}
		}
	}
};