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
		readBindPOS () {

		},
		unbindPOS (state, { payload: {ipcSN, posSN}}) {
			state.every((item) => {
				if (item.sn === ipcSN) {
					const { posList } = item;
					posList.filter((pos) => {
						if (pos.sn === posSN) {
							pos.status = 1;
						}
					});
					return false;
				}
				return true;
			});
		},
		deletePOS (state, { payload: {ipcSN, posSN}}) {
			state.every((item) => {
				if (item.sn === ipcSN) {
					const { posList } = item;
					posList.filter((pos, index) => {
						if (pos.sn === posSN) {
							posList.splice(index, 1);
						}
					});
					return false;
				}
				return true;
			});
		}
	},
	effects: {
		*read(_, { put, call }) {
			const response = yield call(getPOSList);
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