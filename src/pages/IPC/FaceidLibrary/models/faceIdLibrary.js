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
			const response = yield createLibrary({
				faceidList,
				// companyId,
				// // userId,
				// shopId,
			});
			// console.log(response);
			if (response.code === ERROR_OK) {
				yield put({
					type: 'read'
				});
			}
			return response.code;
			// else{
			// 	message.error('人脸库创建失败，请检查网络');
			// }
		},
		*read(action, { put }) {
			// console.log(action);


			const response = yield readLibrary({
				// userId,
				// companyId,
				// shopId,
			});
			const { data, code} = response;
			const list = data.map(item => {
				const { name, type } = item;


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


			const response = yield updateLibrary({
				library,
			});

			if (response.code === ERROR_OK) {
				yield put({
					type: 'updateData',
					payload: library,
				});
			}
			return response.code;
		},
		*delete(action, { put }) {
			const { payload } = action;
			const { id } = payload;

			const response = yield deleteLibrary({
				libraryId: id,
			});

			if (response.code === ERROR_OK) {
				yield put({
					type: 'deleteData',
					payload: {
						id,
					},
				});
			}
			return response.code;
		},
	},
};