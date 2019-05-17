// import { routerRedux } from 'dva/router';
import { message } from 'antd';
import {
	createLibrary,
	readLibrary,
	updateLibrary,
	deleteLibrary,
} from '../services/faceIdLibrary';
import { ERROR_OK } from '@/constants/errorCode';


// const dataFormatter = (item, index) => {
// 	return {
// 		id: item.id || index+1,
// 		name: item.name,
// 		capacity: item.capacity,
// 		isDefault: item.isDefault,
// 		remarks: item.remarks || '',
// 		amount: 0,
// 	};
// };

export default {
	namespace: 'faceIdLibrary',
	state: [],
	reducers: {
		createData(state, action) {
			const { payload } = action;
			// console.log(payload);
			return [...state, ...payload];
		},
		readData(state, action) {
			const { payload } = action;
			return [...payload];
		},
		updateData(state, action) {
			const { payload } = action;
			// console.log(payload);

			const result = state.map(item => {
				if (payload.id === item.id) {
					item = payload;
					// return false;
				}
				// return true;
				return item;
			});

			return [...result];
		},
		deleteData(state, action) {
			const { payload } = action;
			const { id } = payload;
			
			let target = -1;
			state.every((item, index) => {
				if (item.id === id) {
					target = index;
					return false;
				}
				return true;
			});

			state.splice(target, 1);

			// return [...state];
		},
	},
	effects: {
		*create({payload: { library } }, { put }) {

            const faceidList = [library];
            // const userInfo = yield put.resolve({
            //     type: 'user/getUserInfoFromStorage'
            // });
            // const userId = userInfo.id;

			// const userId = yield select(state => {
			// 	return state.user.id;
			// });

			// const shopId = yield select(state => {
			// 	return state.shops.currentShopId;
            // });
            // const companyId = yield put.resolve({
			// 	type: 'global/getCompanyIdFromStorage'
			// });
			// console.log(faceidList);
			const response = yield createLibrary({
				faceidList,
                // companyId,
				// // userId,
				// shopId,
			});
			// console.log(response);
			if (response.code === ERROR_OK) {
				// yield put({
				// 	type: 'createData',
				// 	payload: faceidList.map(dataFormatter)
				// });
				
				yield put({
					type: 'read'
				});


				message.success('创建人脸库成功');
				// yield put(routerRedux.push('/faceidLibrary/faceidLibraryList'));
			} else{
				message.error('人脸库创建失败，请检查网络');
			}
		},
		*read(action, { put }) {
			// console.log(action);

            // const userInfo = yield put.resolve({
            //     type: 'user/getUserInfoFromStorage'
            // });
            // const userId = userInfo.id;

			// const userId = yield select(state => {
			// 	return state.user.id;
            // });
            
            // const companyId = yield put.resolve({
			// 	type: 'global/getCompanyIdFromStorage'
			// });
			// const shopId = yield select(state => {
			// 	return state.shops.currentShopId;
			// });

			const response = yield readLibrary({
                // userId,
                // companyId,
				// shopId,
			});
			if (response.code === ERROR_OK) {
				yield put({
					type: 'readData',
					payload: response.data,
				});
			} else {
				message.error('操作失败，请检查网络');
			}
		},
		*update(action, { put }) {
			// console.log('update');
			// console.log(action);
			const { payload } = action;
			const { library } = payload;
            // const companyId = yield put.resolve({
			// 	type: 'global/getCompanyIdFromStorage'
			// });
            // const userInfo = yield put.resolve({
            //     type: 'user/getUserInfoFromStorage'
            // });
            // const userId = userInfo.id;
			// // const userId = yield select(state => {
			// // 	return state.user.id;
			// // });

			// const shopId = yield select(state => {
			// 	return state.shops.currentShopId;
			// });
            
			const response = yield updateLibrary({
				// userId,
                // companyId,
				// shopId,
				library,
			});

			if (response.code === ERROR_OK) {
				message.success('编辑成功');
				yield put({
					type: 'updateData',
					payload: library,
				});
			} else {
				message.error('操作失败，请检查网络');
			}
		},
		*delete(action, { put }) {
			const { payload } = action;
			const { id } = payload;
            // const companyId = yield put.resolve({
			// 	type: 'global/getCompanyIdFromStorage'
			// });
            // const userInfo = yield put.resolve({
            //     type: 'user/getUserInfoFromStorage'
            // });
            // const userId = userInfo.id;
			// const userId = yield select(state => {
			// 	return state.user.id;
			// });
           
			// const shopId = yield select(state => {
			// 	return state.shops.currentShopId;
			// });

			const response = yield deleteLibrary({
				// userId,
                // companyId,
				// shopId,
				libraryId: id,
			});

			if (response.code === ERROR_OK) {
				yield put({
					type: 'deleteData',
					payload: {
						id,
					},
				});

				message.success('删除人脸库成功');
				// message.success('删除人脸库成功！');
			} else {
				message.error('删除失败，请检查网络连接');
			}
		},
	},
};