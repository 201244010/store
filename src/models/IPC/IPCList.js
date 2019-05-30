import { getDeviceList } from '@/pages/IPC/services/IPCList';
import { ERROR_OK } from '@/constants/errorCode';

export default {
	namespace: 'ipcList',
	state: [],
	reducers: {
		readData(state, action) {
			const { payload } = action;
			// console.log(payload);
			return [...payload];
		},
	},
	effects: {
		*read(action, { put }) {
			// const userInfo = yield put.resolve({
			// 	type: 'user/getUserInfoFromStorage'
			// });
			// const userId = userInfo.id;
			const companyId = yield put.resolve({
				type: 'global/getCompanyIdFromStorage',
			});

			const shopId = yield put.resolve({
				type: 'global/getShopIdFromStorage',
			});

			// console.log(companyId, shopId);
			if (!companyId || !shopId) {
				return [];
			}

			const response = yield getDeviceList({
				companyId,
				shopId,
			});

			const result = response.data;
			if (response.code === ERROR_OK) {
				yield put({
					type: 'readData',
					payload: result,
				});
			}
			return result;
		},
		*getList(action, { put }) {
			const companyId = yield put.resolve({
				type: 'global/getCompanyIdFromStorage',
			});

			const shopId = put.resolve({
				type: 'global/getShopIdFromStorage',
			});

			const response = yield getDeviceList({
				companyId,
				shopId,
			});
			const result = response.data;
			if (response.code === ERROR_OK) {
				yield put({
					type: 'readData',
					payload: result,
				});
			}
		},
		*getIpcList(_, { select, take }) {
			let ipcList = yield select(state => state.ipcList);

			if (ipcList.length === 0) {
				// console.log(ipcList.length);
				const { payload } = yield take('readData');
				ipcList = payload;
			}

			return ipcList;
		},
		*getDeviceInfo(
			{
				payload: { sn },
			},
			{ put }
		) {
			const ipcList = yield put.resolve({
				type: 'getIpcList',
			});

			if (ipcList) {
				for (let i = 0; i < ipcList.length; i++) {
					if (ipcList[i].sn === sn) {
						return ipcList[i];
					}
				}
			}
			return {};
		},
		*getDeviceType(
			{
				payload: { sn },
			},
			{ put }
		) {
			const ipcList = yield put.resolve({
				type: 'getIpcList',
			});

			for (let i = 0; i < ipcList.length; i++) {
				if (ipcList[i].sn === sn) {
					return ipcList[i].type;
				}
			}
			return '';
		},
		*getDeviceId(
			{
				payload: { sn },
			},
			{ put }
		) {
			const ipcList = yield put.resolve({
				type: 'getIpcList',
			});
			for (let i = 0; i < ipcList.length; i++) {
				if (ipcList[i].sn === sn) {
					return ipcList[i].deviceId;
				}
			}
			return '';
		},
		*getDeviceSn(
			{
				payload: { deviceId },
			},
			{ put }
		) {
			const ipcList = yield put.resolve({
				type: 'getIpcList',
			});

			for (let i = 0; i < ipcList.length; i++) {
				if (ipcList[i].deviceId === deviceId) {
					return ipcList[i].sn;
				}
			}

			return '';
		},
	},
};
