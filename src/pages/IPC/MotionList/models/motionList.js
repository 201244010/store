import { getMotionList /* , getIpcList */ } from '../../services/motionList';
import { ERROR_OK } from '@/constants/errorCode';

export default {
	namespace: 'motionList',
	state: {
		motionList: [],
		// ipcList:[],
		total: 0,
	},
	reducers: {
		readData(state, action) {
			const {
				payload: { list, total },
			} = action;
			list.sort((a, b) => Date.parse(b.detectedTime) - Date.parse(a.detectedTime));
			state.motionList = [...list];
			state.total = total;
		},
		// readIpcList(state,action){
		// 	const { payload } = action;
		// 	state.ipcList = [...payload];
		// }
	},
	effects: {
		*read({ payload }, { put }) {
			// const companyId = yield put.resolve({
			// 	type: 'global/getCompanyIdFromStorage'
			// });
			// const shopId = yield select((state) => {
			// 	return state.shops.currentShopId;
			// });
			const {
				startTime,
				endTime,
				ipcSelected,
				detectedSourceSelected,
				currentPage,
				pageSize,
			} = payload;

			// console.log(currentPage, pageSize);
			let deviceId;
			let source;
			if (ipcSelected) {
				// deviceId = yield put.resolve({
				// 	type: 'ipcList/getDeviceId',
				// 	payload: {
				// 		sn:ipcSelected
				// 	}
				// });
				deviceId = ipcSelected;
			}

			if (detectedSourceSelected) {
				source = detectedSourceSelected;
			}

			const response = yield getMotionList({
				startTime,
				endTime,
				deviceId,
				source,
				currentPage,
				pageSize,
			});
			if (response.code === ERROR_OK) {
				const { list, total } = response.data;
				yield put({
					type: 'readData',
					payload: {
						list,
						total,
					},
				});
			}
		},
		// *getIpcType({ payload },{ put }){
		// 	const { sn } = payload;
		// 	const type = yield put.resolve({
		// 		type:'ipcList/getDeviceType',
		// 		payload:{
		// 			sn
		// 		}
		// 	});
		// 	return type;
		// },
		// *getIpcList(_,{ put }){
		// 	// const companyId = yield put.resolve({
		// 	// 	type: 'global/getCompanyIdFromStorage'
		// 	// });
		// 	// const shopId = yield select((state) => {
		// 	// 	return state.shops.currentShopId;
		// 	// });
		// 	// console.log(`motionList: companyId:${companyId} shopId${shopId}`);
		// 	const response = yield getIpcList();
		// 	if (response.code === ERROR_OK) {
		// 		const result = response.data;
		// 		// console.log(result);
		// 		yield put({
		// 			type: 'readIpcList',
		// 			payload: result
		// 		});
		// 	}
		// }
	},
};
