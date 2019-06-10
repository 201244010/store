import { getBoundList } from '../../services/posList';
import { ERROR_OK } from '@/constants/errorCode';

export default {
	namespace: 'bindedPosList',
	state: [],
	reducers: {
		readData(_, {payload: {list}}) {
			return list;
		}
	},
	effects: {
		*read({payload: { ipcSN }}, { put, call}) {
			const ipcId = yield put.resolve({
				type: 'ipcList/getDeviceId',
				payload: {
					sn: ipcSN
				}
			});

			const response = yield call(getBoundList, {
				ipcId
			});

			const { code, data } = response;
			if (code === ERROR_OK) {
				// console.log(data);
				yield put({
					type: 'readData',
					payload: {
						list: data
					}
				});
				return data;
			}
			return [];
		}
	}
};
