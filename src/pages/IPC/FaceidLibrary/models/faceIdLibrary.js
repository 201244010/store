import { formatMessage } from 'umi/locale';

import { createLibrary, readLibrary, updateLibrary, deleteLibrary } from '../../services/faceIdLibrary';
import { ERROR_OK } from '@/constants/errorCode';


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


				// message.success('创建人脸库成功');
				// yield put(routerRedux.push('/faceidLibrary/faceidLibraryList'));
			}
			return response.code;
			// else{
			// 	message.error('人脸库创建失败，请检查网络');
			// }
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
			const { data, code} = response;
			const list = data.map(item => {
				const { name, type } = item;

				// let remarksText = remarks;
				// if (remarks === 'stranger' && type === 1) {
				// 	remarksText = formatMessage({id: 'faceid.strangerInfo'});
				// }else if (remarks === 'regular' && type === 2) {
				// 	remarksText = formatMessage({id: 'faceid.regularInfo'});
				// }else if (remarks === 'employee' && type === 3) {
				// 	remarksText = formatMessage({id: 'faceid.employeeInfo'});
				// }else if (remarks === 'blacklist' && type === 4) {
				// 	remarksText = formatMessage({id: 'faceid.blacklistInfo'});
				// };

				let nameText = name;
				if (type === 1) {
					nameText = formatMessage({id: 'faceid.stranger'});
				}else if (type === 2) {
					nameText = formatMessage({id: 'faceid.regular'});
				}else if (type === 3) {
					nameText = formatMessage({id: 'faceid.employee'});
				}else if (type === 4) {
					nameText = formatMessage({id: 'faceid.blacklist'});
				};

				return {
					...item,
					name: nameText
				};
			});

			if (code === ERROR_OK) {
				yield put({
					type: 'readData',
					payload: list,
				});
			}
			// else {
			// 	message.error('操作失败，请检查网络');
			// }
			return response.code;
		},
		*update(action, { put }) {
			// console.log('update');
			// console.log(action);
			const { payload } = action;
			const { library } = payload;

			const { type } = library;
			switch (type) {
				case 1:
					library.name = 'stranger';
					break;
				case 2:
					library.name = 'regular';
					break;
				case 3:
					library.name = 'employee';
					break;
				case 4:
					library.name = 'blacklist';
					break;
				default:
			}

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
				// message.success('编辑成功');
				yield put({
					type: 'updateData',
					payload: library,
				});
			}
			// else {
			// 	message.error('操作失败，请检查网络');
			// }
			return response.code;
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
				// message.success('删除人脸库成功！');
			}
			// else {
			// 	message.error('删除失败，请检查网络连接');
			// }
			return response.code;
		},
	},
};