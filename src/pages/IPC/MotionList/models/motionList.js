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
	},
	effects: {
		*read({ payload }, { put }) {
			const {
				startTime,
				endTime,
				ipcSelected,
				detectedSourceSelected,
				currentPage,
				pageSize,
			} = payload;

			let deviceId;
			let source;
			if (ipcSelected) {
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
				const motionList = list.map(item => {
					const name = item.name === ''? 'My Camera': item.name;
					item.name = name;
					return {
						...item
					};
				});
				yield put({
					type: 'readData',
					payload: {
						list:motionList,
						total,
					},
				});
			}
		},
	},
};