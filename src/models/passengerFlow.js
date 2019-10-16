import { format } from '@konata9/milk-shake';
import * as Actions from '@/services/passengerFlow';
import { ERROR_OK } from '@/constants/errorCode';

export default {
	namespace: 'passengerFlow',
	state: {
		passengerFlowCount: {},
		passengerFlowOrder: {},
		passengerAgeCountList: [],
	},
	effects: {
		*getPassengerFlow({ payload }, { call, put }) {
			const { startTime, endTime } = payload || {};
			const opts = { startTime, endTime };
			const response = yield call(
				Actions.handlePassengerFlowManagement,
				'statistic/getByTimeRange',
				format('toSnake')(opts)
			);

			if (response && response.code === ERROR_OK) {
				const { data = {} } = response || {};
				const { latestCount = 0 } = format('toCamel')(data);
				yield put({
					type: 'updateState',
					payload: {
						passengerFlowCount: { latestCount },
					},
				});
			}

			return response;
		},

		*getPassengerFlowLatest({ payload }, { call, put }) {
			const { type = 1 } = payload || {};
			const response = yield call(
				Actions.handlePassengerFlowManagement,
				'statistic/getLatest',
				format('toSnake')({ type })
			);

			if (response && response.code === ERROR_OK) {
				const { data = {} } = response || {};
				const { latestCount = 0, earlyCount = 0 } = format('toCamel')(data);

				yield put({
					type: 'updateState',
					payload: { passengerFlowCount: { latestCount, earlyCount } },
				});
			}

			return response;
		},

		*getPassengerFlowOrderLatest({ payload }, { call, put }) {
			const { type = 1 } = payload || {};
			const response = yield call(
				Actions.handlePassengerFlowManagement,
				'statistic/order/getLatest',
				format('toSnake')({ type })
			);

			if (response && response.code === ERROR_OK) {
				const { data = {} } = response || {};
				const { countList = [] } = format('toCamel')(data) || {};
				yield put({
					type: 'updateState',
					payload: { passengerFlowOrder: countList },
				});
			}

			return response;
		},

		*getPassengerFlowOrderByRange({ payload }, { call, put }) {
			const { startTime, endTime } = payload || {};
			const response = yield call(
				Actions.handlePassengerFlowManagement,
				'statistic/order/getByTimeRange',
				format('toSnake')({ startTime, endTime })
			);

			if (response && response.code === ERROR_OK) {
				const { data = {} } = response || {};
				const { countList = [] } = format('toCamel')(data) || {};
				yield put({
					type: 'updateState',
					payload: { passengerFlowOrder: countList },
				});
			}

			return response;
		},

		*getPassengerAge({ payload }, { call, put }) {
			const { startTime, endTime, type = 'gender' } = payload || {};
			const opts = { startTime, endTime };
			const optType = type === 'gender' ? 'getByGender' : 'getByRegular';

			const response = yield call(
				Actions.handlePassengerFlowManagement,
				`statistic/age/${optType}`,
				format('toSnake')(opts)
			);

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
