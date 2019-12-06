import { getDeviceList } from '@/pages/IPC/services/IPCList';
import { getServiceInfo } from '@/pages/IPC/services/storageManagement';
import { ERROR_OK } from '@/constants/errorCode';
import ipcTypes from '@/constants/ipcTypes';

export default {
	namespace: 'ipcList',
	state: [],
	reducers: {
		readData(state, action) {
			const { payload } = action;
			// console.log(payload);
			return [...payload];
		}
	},
	effects: {
		*read(action,{ put }) {

			const response = yield getDeviceList();

			const {data : result , code} = response;
			if (code === ERROR_OK) {

				// const d = result.map(item => ({
				// 	...item,
				// 	...ipcTypes[item.type]
				// }));

				const d = result.map(item => {
					const name = item.name === ''? 'My Camera': item.name;
					item.name = name;
					return {
						...item,
						...ipcTypes[item.type]
					};
				});

				yield put({
					type: 'readData',
					payload: d
				});
			}
			return result;

		},
		// *getList(action,{ put }){
		// 	const response = yield getDeviceList();
		// 	const result = response.data;
		// 	if (response.code === ERROR_OK) {
		// 		yield put({
		// 			type: 'readData',
		// 			payload: result
		// 		});
		// 	}
		// },
		*getIpcList(_, { select, put}) {
			let ipcList  = yield select((state) => state.ipcList);

			if (ipcList.length === 0){
				// console.log(ipcList.length);
				yield put.resolve({
					type: 'read'
				});
				ipcList  = yield select((state) => state.ipcList);
			}

			return ipcList;
		},
		*getDeviceInfo({ payload: { sn }}, { put }) {
			const ipcList = yield put.resolve({
				type: 'getIpcList'
			});

			if(ipcList){
				for(let i=0;i <ipcList.length; i++){
					if(ipcList[i].sn === sn){
						return(ipcList[i]);
					}
				}
			}
			return {};
		},
		*getDeviceType({ payload: { sn }},{ put }){
			const ipcList = yield put.resolve({
				type: 'getIpcList'
			});

			for (let i = 0; i < ipcList.length; i++) {
				if (ipcList[i].sn === sn) {
					return ipcList[i].type;
				}
			}
			return '';
		},
		*getDeviceId({ payload: { sn }},{ put }){
			const ipcList = yield put.resolve({
				type: 'getIpcList'
			});
			for (let i = 0; i < ipcList.length; i++) {
				if (ipcList[i].sn === sn) {
					return ipcList[i].deviceId;
				}
			}
			return '';
		},
		*getDeviceSn({ payload: { deviceId }}, { put}) {
			const ipcList = yield put.resolve({
				type: 'getIpcList'
			});

			for (let i = 0; i < ipcList.length; i++) {
				if (ipcList[i].deviceId === deviceId) {
					return ipcList[i].sn;
				}
			}

			return '';
		},
		*checkBind({ payload: { sn }}, { put }) {
			const list = yield put.resolve({
				type: 'read'
			});
			let isBind = false;
			if(list) {
				list.forEach(item => {
					if(item.sn === sn) {
						isBind = true;
					}
				});
			}
			return isBind;
		},
		/**
		 * 获取云服务的状态
		 */
		*readCloudInfo({ payload }, { call }) {
			const { sn } = payload;
			// const deviceId = yield put.resolve({
			// 	type: 'getDeviceId',
			// 	payload: {
			// 		sn
			// 	}
			// });

			const response = yield call(getServiceInfo, {
				deviceSnList: [sn]
			});
			// console.log(response);
			const { code , data } = response;
			if(code === ERROR_OK) {
				const { deviceList } = data;
				const { status, validTime, activeStatus } = deviceList[0];
				return {
					code,
					data: {
						status,
						validTime,
						activeStatus
					}
				};
			}
			return {
				code
			};
		},
		*getCurrentVersion({ payload: { sn }},{ put }){
			const ipcList = yield put.resolve({
				type: 'getIpcList'
			});

			for (let i = 0; i < ipcList.length; i++) {
				if (ipcList[i].sn === sn) {
					return ipcList[i].binVersion;
				}
			}
			return '';
		},
		*checkOnlineStatus({ payload }, { put }) {
			const { sn } = payload;
			const ipcList = yield put.resolve({
				type: 'read'
			});
			if(ipcList){
				for(let i=0;i <ipcList.length; i++){
					if(ipcList[i].sn === sn){
						const { isOnline } = ipcList[i];
						return isOnline;
					}
				}
			}
			return false;
		}

	}
};