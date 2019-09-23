import moment from '@/pages/PassengerAnalyze/models/node_modules/moment';
import * as Actions from '@/services/passengerFlow';
import { ERROR_OK } from '@/constants/errorCode';
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

		*getPassengerFlowCount(_, { select, put, call }) {
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
