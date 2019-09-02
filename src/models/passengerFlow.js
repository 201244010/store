import * as Actions from '@/services/passengerFlow';
import { format } from '@konata9/milk-shake';
import { ERROR_OK } from '@/constants/errorCode';

export default {
	namespace: 'passengerFlow',
	state: {
		passengerFlowCount: null,
		passengerAgeCountList: [],
	},
	effects: {
		*getPassengerFlow({ payload }, { call, put }) {
			const { startTime, endTime } = payload || {};
			const opts = { startTime, endTime };
			const response = yield call(
				Actions.handlePassengerFlowManagement,
				'statistics/getByTimeRange',
				format('toSnake')(opts)
			);

			// TODO 云端可能会有修正
			if (response && response.code === ERROR_OK) {
				const { data = {} } = response || {};
				const { totalCount = 0 } = format('toCamel')(data);
				yield put({
					type: 'updateState',
					payload: {
						passengerFlowCount: totalCount,
					},
				});
			}
		},

		// TODO 等待交易转化率趋势接口

		*getPassengerAge({ payload }, { call, put }) {
			const { startTime, endTime, type = 'gender' } = payload || {};
			const opts = { startTime, endTime };
			const optType = type === 'gender' ? 'getByGender' : 'getByRegular';

			const response = yield call(
				Actions.handlePassengerFlowManagement,
				`statistics/age/${optType}`,
				format('toSnake')(opts)
			);

			// TODO 云端可能会修正
			if (response && response.code === ERROR_OK) {
				const { data = {} } = response || {};
				const { countList = [] } = format('toCamel')(data);

				yield put({
					type: 'updateState',
					payload: {
						passengerAgeCountList: countList,
					},
				});
			}
		},
	},
	reducres: {
		updateState(state, action) {
			return {
				...state,
				...action.payload,
			};
		},
	},
};
