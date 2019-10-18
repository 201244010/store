import moment from 'moment';
import { formatMessage } from 'umi/locale';
import * as Actions from '@/services/passengerFlow';
import { ERROR_OK } from '@/constants/errorCode';
import { DASHBOARD } from '@/pages/DashBoard/constants';

const {
	SEARCH_TYPE: { GROUP_RANGE, RANGE_VALUE },
} = DASHBOARD;

export default {
	namespace: 'passengerAnalyze',
	state: {
		hasData: false,
		searchValue: {
			startTime: moment().format('YYYY-MM-DD'),
			endTime: moment().format('YYYY-MM-DD'),
			type: RANGE_VALUE.YESTERDAY,
			groupBy: GROUP_RANGE.HOUR,
		},
		passengerFlowCount: {
			totalCount: 0,
			regularCount: 0,
			strangerCount: 0,
			memberCount: 0,
		},
		passengerFlowTrendList: [],
		passengerAgeListByGender: [],
		// TODO 等待云端接口
		passengerDetailWithAgeAndGender: {},
	},

	effects: {
		*setSearchValue({ payload }, { select, put }) {
			const { searchValue } = yield select(state => state.passengerAnalyze);
			const { type = RANGE_VALUE.YESTERDAY, groupBy = GROUP_RANGE.HOUR } = payload;
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
					hasData: false,
					searchValue: {
						startTime: moment().format('YYYY-MM-DD'),
						endTime: moment().format('YYYY-MM-DD'),
						type: RANGE_VALUE.YESTERDAY,
						groupBy: GROUP_RANGE.HOUR,
					},
				},
			});
		},

		*refreshPage(_, { all, put }) {
			yield all([
				put({ type: 'getPassengerFlowHistory' }),
				put({ type: 'getPassengerFlowHistoryTrend' }),
				put({ type: 'getPassengerFlowAgeByGender' }),
				// TODO Sprint 10 不做，之后做了再完善接口
				// put({ type: 'getPassengerFlowHistoryWithAgeAndGender' }),
			]);
		},

		*getPassengerFlowHistory(_, { select, put, call }) {
			const { searchValue: { type } = {} } = yield select(state => state.passengerAnalyze);

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
						hasData: true,
					},
				});
			} else {
				yield put({
					type: 'updateState',
					payload: {
						hasData: false,
					},
				});
			}
		},

		*getPassengerFlowHistoryTrend(_, { select, put, call }) {
			const { searchValue: { type, groupBy } = {} } = yield select(
				state => state.passengerAnalyze
			);

			const response = yield call(Actions.getPassengerFlowHistoryTrend, { type, groupBy });
			if (response && response.code === ERROR_OK) {
				const { data: { countList = [] } = {} } = response || {};

				console.log(countList);

				const formattedList = countList.reduce((prev, cur) => {
					const { time, totalCount = 0, regularCount = 0, strangerCount = 0 } = cur;

					let _time = time;
					if (type === RANGE_VALUE.TODAY || type === RANGE_VALUE.YESTERDAY) {
						_time = moment(time).format('HH:mm');
					} else if (type === RANGE_VALUE.WEEK) {
						_time = moment(time).format('ddd');
					} else {
						_time = moment(time).format('MM/DD');
					}

					return prev.concat([
						{
							time: _time,
							passengerType: 'total',
							count: totalCount,
							passengerTypeDisplay: formatMessage({ id: 'passenger.total' }),
						},
						{
							time: _time,
							passengerType: 'regular',
							count: regularCount,
							passengerTypeDisplay: formatMessage({ id: 'passenger.regular' }),
						},
						{
							time: _time,
							passengerType: 'stranger',
							count: strangerCount,
							passengerTypeDisplay: formatMessage({ id: 'passenger.stranger' }),
						},
					]);
				}, []);

				yield put({
					type: 'updateState',
					payload: {
						passengerFlowTrendList: formattedList,
					},
				});
			}
		},

		*getPassengerFlowAgeByGender(_, { select, put, call }) {
			const {
				searchValue: { type },
			} = yield select(state => state.passengerAnalyze);

			const result = yield put.resolve({
				type: 'dashboard/getAgeRanges',
			});

			if (result && result.code === ERROR_OK) {
				const { data: { ageRangeList = [] } = {} } = result;
				const response = yield call(Actions.getPassengerFlowAgeByGender, { type });
				if (response && response.code === ERROR_OK) {
					const {
						data: { countList = [] },
					} = response || {};

					const totalGender = countList.reduce((prev, cur) => {
						const { maleCount = 0, femaleCount = 0 } = cur;
						return (prev = prev + maleCount + femaleCount);
					}, 0);

					const formattedList = countList
						.reduce((prev, cur) => {
							const { ageRangeCode, maleCount, femaleCount } = cur;

							const { ageRange } = ageRangeList.find(
								item => item.ageRangeCode === ageRangeCode
							);

							return prev.concat([
								{
									ageRange,
									ageRangeCode,
									genderRate:
										totalGender === 0
											? 0
											: parseInt((maleCount / totalGender) * 100, 10),
									gender: 'male',
								},
								{
									ageRange,
									ageRangeCode,
									genderRate:
										totalGender === 0
											? 0
											: parseInt((femaleCount / totalGender) * 100, 10),
									gender: 'female',
								},
							]);
						}, [])
						.sort((a, b) => b.genderRate - a.genderRate)
						.slice(0, 5);

					yield put({
						type: 'updateState',
						payload: {
							passengerAgeListByGender: formattedList,
						},
					});
				}
			}
		},

		*getPassengerFlowHistoryWithAgeAndGender() {
			// TODO 等待云端接口
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
