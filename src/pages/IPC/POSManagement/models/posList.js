import { getPOSList, deletePos, unbindPos } from '../../services/posList';
import { ERROR_OK } from '@/constants/errorCode';

export default {
	namespace: 'posList',
	state: [],
	reducers: {
		readData(state, { payload }) {
			const { posList } = payload;
			return [
				...posList
			];
		},
		// readBindPOS () {

		// },
		unbindPOS (state, { payload: {ipcSN, posSN}}) {
			state.every((item) => {
				if (item.sn === ipcSN) {
					const { posList } = item;
					const target = [];
					posList.forEach((pos) => {
						if (pos.sn !== posSN) {
							target.push(pos);
						}
					});
					item.posList = target;
					return false;
				}
				return true;
			});
		},
		deletePOS (state, { payload: {ipcSN, posSN}}) {
			state.every((item) => {
				if (item.sn === ipcSN) {
					const { posList } = item;
					const target = [];
					posList.forEach((pos) => {
						if (pos.sn !== posSN) {
							target.push(pos);
						}
					});
					item.posList = target;
					return false;
				}
				return true;
			});
		}
	},
	effects: {
		*read({ payload: { startTime, endTime }}, { put, call }) {
			// console.log(startTime, endTime);
			const response = yield call(getPOSList, { startTime, endTime });
			if(response.code === ERROR_OK){
				const posList = response.data;

				yield put({
					type: 'readData',
					payload: {
						posList
					}
				});

				return posList;
			}
			return [];
		},
		*delete({payload: { ipcSN, posSN }}, { put, call }){
			const ipcId = yield put.resolve({
				type: 'ipcList/getDeviceId',
				payload: {
					sn: ipcSN
				}
			});

			const response = yield call(deletePos, {
				ipcId,
				posSN
			});

			if (response.code === ERROR_OK){
				yield put({
					type: 'deletePOS',
					payload: {
						ipcSN,
						posSN
					}
				});
				return true;
			}
			return false;
		},
		*unbind({payload: { ipcSN, posSN }}, { put, call }){
			const ipcId = yield put.resolve({
				type: 'ipcList/getDeviceId',
				payload: {
					sn: ipcSN
				}
			});

			const response = yield call(unbindPos, {
				ipcId,
				posSN
			});

			if (response.code === ERROR_OK){
				yield put({
					type: 'unbindPOS',
					payload: {
						ipcSN,
						posSN
					}
				});
				return true;
			}
			return false;
		},
	},
};