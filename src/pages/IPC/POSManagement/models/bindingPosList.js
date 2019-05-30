import { addPos, checkSN, sendCode, verifyCode, bindPos, getVerifyStatusList, /* getBoundList */ } from '../../services/posList';
import { ERROR_OK } from '@/constants/errorCode';

export default {
	namespace: 'bindingPosList',
	state: [],
	reducers: {
		readData(state, { payload }) {
			return [...payload];
		},
		createData(state, action) {
			const { payload } = action;
			return [...state, ...payload];
		},
		updatePos(_, { payload: { list }}) {
			return [
				...list
			];
		},
		updateStatus(state, { payload: { posSN }}) {
			state.every((item) => {
				if (item.sn === posSN) {
					item.status = 0;
					return false;
				}
				return true;
			});
		}
	},
	effects: {
		*addSN({ payload: { ipcSN, snList }}, { put, call }) {
			const ipcId = yield put.resolve({
				type: 'ipcList/getDeviceId',
				payload: {
					sn: ipcSN
				}
			});

			const response = yield call(addPos, {
				ipcId,
				snList
			});

			const { code } = response;

			if (code === ERROR_OK) {
				// console.log(data);

				// yield put({
				// 	type: 'updatePos',
				// 	payload: {
				// 		list: data
				// 	}
				// });
				return true;
			}
			return false;
		},
		*checkSN({ payload: {ipcSN, posSN}}, { put, call }) {
			const ipcId = yield put.resolve({
				type: 'ipcList/getDeviceId',
				payload: {
					sn: ipcSN
				}
			});

			const response = yield call(checkSN, {
				ipcId,
				posSN
			});
			// console.log('response: ', response);
			return response.code;
		},
		*sendCode({ payload: { posSN }}, { call }) {
			const response = yield call(sendCode, {
				posSN
			});

			if (response.code === ERROR_OK) {
				return true;
			}
			return false;
		},
		*verifyCode({ payload: { posSN, code: vcode }}, { put, call }) {
			const response = yield call(verifyCode, {
				posSN,
				code: vcode
			});

			const { code } = response;

			if (code === ERROR_OK) {
				yield put({
					type: 'updateStatus',
					payload: {
						posSN
					}
				});
			}
			return code;
		},
		*bind ({ payload: { ipcSN, posList }}, { put, call }) {
			// console.log('bind: ', ipcSN, posList);
			const ipcId = yield put.resolve({
				type: 'ipcList/getDeviceId',
				payload: {
					sn: ipcSN
				}
			});

			const response = yield call(bindPos, {
				ipcId,
				posList
			});

			if (response.code === ERROR_OK) {
				return true;
			}
			return false;
		},
		*getPosListByIpcSN ({ payload: { ipcSN }} , { put, call }) {
			// const list = yield put.resolve({
			// 	type: 'posList/read'
			// });

			// let postList = [];
			// list.every(item => {
			// 	if (item.sn === ipcSN) {
			// 		postList = item.posList;
			// 		return false;
			// 	}
			// 	return true;
			// });

			const ipcId = yield put.resolve({
				type: 'ipcList/getDeviceId',
				payload: {
					sn: ipcSN
				}
			});

			const response = yield call(getVerifyStatusList, {
				ipcId
			});

			const { code, data } = response;
			// console.log(data);
			if (code === ERROR_OK) {
				yield put({
					type: 'readData',
					payload: data
				});
				return data;
			}
			return [];
		}
		// *deletePos ({ payload: {ipcSN, posSN}}, { put, call }) {
		// 	const ipcId = yield put.resolve({
		// 		type: 'ipcList/getDeviceId',
		// 		payload: {
		// 			sn: ipcSN
		// 		}
		// 	});

		// 	const response = yield call(checkSN, {
		// 		ipcId,
		// 		posSN
		// 	});
		// }
	}
};