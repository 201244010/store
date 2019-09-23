import moment from '@/pages/PassengerAnalyze/models/node_modules/moment';
import * as Actions from '@/pages/PassengerAnalyze/models/node_modules/@/services/passengerFlow';
import { ERROR_OK } from '@/pages/PassengerAnalyze/models/node_modules/@/constants/errorCode';
import DASHBOARD from '@/pages/PassengerAnalyze/models/node_modules/@/pages/DashBoard/constants';

const {
	SEARCH_TYPE: { GROUP_RANGE, RANGE_VALUE },
} = DASHBOARD;

// const getSearchTimeRange = (type, format = 'YYYY-MM-DD') => {
// 	// TODO 待完善
// };

export default {
	namespace: 'passengerAnalyze',
	state: {
		searchValue: {
			startTime: moment().format('YYYY-MM-DD'),
			endTime: moment().format('YYYY-MM-DD'),
			type: RANGE_VALUE.TODAY,
			gourpBy: GROUP_RANGE.HOUR,
		},
		passengerFlowCount: {
			totalCount: 0,
			regularCount: 0,
			strangerCount: 0,
			memberCount: 0,
		},
		passengerFlowTrendList: [],
		passengerAgeListByGender: [],
	},

	effects: {
		*setSearchValue({ payload }, { select, put }) {
			const searchValue = yield select(state => state.passengerAnalyze);
			const { type = RANGE_VALUE.TODAY, groupBy = GROUP_RANGE.HOUR } = payload;
			yield put({
				type: 'updateState',
				payload: {
					searchValue: {
						...searchValue,
						type,
						groupBy,
					},
				},
			});
		},

		*clearSearch(_, { put }) {
			yield put({
				type: 'updateState',
				payload: {
					searchValue: {
						startTime: moment().format('YYYY-MM-DD'),
						endTime: moment().format('YYYY-MM-DD'),
						type: RANGE_VALUE.TODAY,
						gourpBy: GROUP_RANGE.HOUR,
					},
				},
			});
		},

		*getPassengerFlowHistory(_, { select, put, call }) {
			const searchValue = yield select(state => state.searchValue);
			const { type } = searchValue;

			const response = yield call(Actions.getPassengerFlowHistory, { type });
			if (response && response.code === ERROR_OK) {
				const {
					data: {
						totalCount = 0,
						regularCount = 0,
						strangerCount = 0,
						memberCount = 0,
					} = {},
				} = response || {};

				yield put({
					type: 'updateState',
					payload: {
						passengerFlowCount: {
							totalCount,
							regularCount,
							strangerCount,
							memberCount,
						},
					},
				});
			}
		},

		*getPassengerFlowHistoryTrend(_, { select, put, call }) {
			const searchValue = yield select(state => state.searchValue);
			const { type, groupBy } = searchValue;

			const response = yield call(Actions.getPassengerFlowHistoryTrend, { type, groupBy });
			if (response && response.code === ERROR_OK) {
				const { data: { countList = [] } = {} } = response || {};

				yield put({
					type: 'updateState',
					payload: {
						passengerFlowTrendList: countList,
					},
				});
			}
		},

		*getPassengerFlowAgeByGender(_, { select, put, call }) {
			const searchValue = yield select(state => state.searchValue);
			const { type } = searchValue;

			const response = yield call(Actions.getPassengerFlowAgeByGender, { type });
			if (response && response.code === ERROR_OK) {
				const {
					data: { countList = [] },
				} = response || {};

				yield put({
					type: 'updateState',
					payload: {
						passengerAgeListByGender: countList,
					},
				});
			}
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
