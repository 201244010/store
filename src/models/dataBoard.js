import { getLatestPassengerFlow } from '@/services/passengerFlow';

export default {
	namespace: 'dataBoard',
	state: {
	},
	effects: {
		*getLatestPassengerData({ payload }, { call }) {
			const { startTime, endTime } = payload || {};
			const opts = { startTime, endTime };
			const response = yield call(
				getLatestPassengerFlow,
				opts
			);

			if (response && response.code === ERROR_OK) {
				// yield put({
				// 	type: 'updateState',
				// 	payload: {
				// 		passengerFlowCount: { latestCount },
				// 	},
				// });
			}

			return response;
		},
	},
	reducers: {
		updateState(state, action) {
			return {
				...state,
				...action.payload,
			};
		},
	},
};
