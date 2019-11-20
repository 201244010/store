import moment from 'moment';
import { formatMessage } from 'umi/locale';
import * as Actions from '@/services/passengerFlow';
import { ERROR_OK } from '@/constants/errorCode';
import { DASHBOARD } from '@/pages/DashBoard/constants';

const {
	SEARCH_TYPE: { GROUP_RANGE, RANGE_VALUE },
} = DASHBOARD;

const fullfillCountList = (countList = [], type = null) => {
	const [firstItem = null, ,] = countList;
	if (!firstItem) {
		return countList;
	}

	if (type === RANGE_VALUE.WEEK) {
		if (countList.length === 7) {
			return countList;
		}
		const { time } = firstItem;

		const dateList = [];
		for (let i = 0; i < 7; i++) {
			dateList.push({
				time: moment(time)
					.add(i, 'days')
					.format('YYYY-MM-DD'),
				totalCount: null,
				regularCount: null,
				strangerCount: null,
			});
		}

		return dateList.map(date => {
			const countItem = countList.find(item => item.time === date.time);
			return countItem || date;
		});
	}

	if (type === RANGE_VALUE.MONTH) {
		const { time } = firstItem;
		const daysOfMonth = moment(time).daysInMonth();

		if (countList.length === daysOfMonth) {
			return countList;
		}

		const dateList = [];
		for (let i = 0; i < daysOfMonth; i++) {
			dateList.push({
				time: moment(time)
					.add(i, 'days')
					.format('YYYY-MM-DD'),
				totalCount: null,
				regularCount: null,
				strangerCount: null,
			});
		}

		return dateList.map(date => {
			const countItem = countList.find(item => item.time === date.time);
			return countItem || date;
		});
	}
	return countList;
};

const formatPassengerCountList = (countList = [], ageRangeList) => {
	const totalGender = countList.reduce((prev, cur) => {
		const { maleCount = 0, femaleCount = 0 } = cur;
		return (prev = prev + maleCount + femaleCount);
	}, 0);

	// const totalGender = countList.reduce((prev, cur) => {
	// 	const { maleCount = 0, femaleCount = 0 } = cur;
	// 	return (prev = prev + maleCount + femaleCount);
	// }, 0);

	const formattedList = countList
		.reduce((prev, cur) => {
			const { ageRangeCode, maleCount, femaleCount, femaleRegularCount, femaleRushHour, maleRegularCount, maleRushHour } = cur;

			const { ageRange } = ageRangeList.find(
				item => item.ageRangeCode === ageRangeCode
			);

			return prev.concat([
				{
					ageRange,
					ageRangeCode,
					maleCount,
					maleRegularRate: maleCount === 0 ? 0 : Math.round((maleRegularCount / maleCount) * 100, 10),
					maleRushHour,
					maleGenderRate: totalGender === 0
						? 0
						: Math.round((maleCount / totalGender) * 100, 10),
					genderRate:
						totalGender === 0
							? 0
							: Math.round((maleCount / totalGender) * 100, 10),
					gender: 'male',
					totalGender
				},
				{
					ageRange,
					ageRangeCode,
					femaleCount,
					femaleRegularRate: femaleCount === 0 ? 0 : Math.round((femaleRegularCount / femaleCount) * 100, 10),
					femaleRushHour,
					femaleGenderRate: totalGender === 0
						? 0
						: Math.round((femaleCount / totalGender) * 100, 10),
					genderRate:
						totalGender === 0
							? 0
							: Math.round((femaleCount / totalGender) * 100, 10),
					gender: 'female',
					totalGender
				},
			]);
		}, [])
		.sort((a, b) => b.genderRate - a.genderRate);

	return formattedList;
};

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
		lastPassengerAgeListByGender: [],
		// TODO 等待云端接口
		passengerDetailWithAgeAndGender: {},
		activeIndex: 0,
		activeContent: {}
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

			yield put({
				type: 'getPassengerFlowHistoryWithAgeAndGender'
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

		*updateActiveIndex({ payload }, { put, select }) {
			const { activeIndex } = payload;
			const { passengerAgeListByGender } = yield select(state => state.passengerAnalyze);

			yield put({
				type: 'updateState',
				payload: {
					activeIndex,
					activeContent: passengerAgeListByGender[activeIndex]
				},
			});
		},

		*updateActiveContent({ payload }, { put }) {
			const { activeContent } = payload;

			yield put({
				type: 'updateState',
				payload: {
					activeContent
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

				const fullfilledList = fullfillCountList(countList, type);
				// console.log(fullfilledList);

				const formattedList = fullfilledList.reduce((prev, cur) => {
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

					const formattedList = formatPassengerCountList(countList, ageRangeList).slice(0, 5);

					yield put({
						type: 'updateState',
						payload: {
							passengerAgeListByGender: formattedList,
							activeIndex: 0,
							activeContent: formattedList[0]
						},
					});
				}
			}
		},

		*getPassengerFlowHistoryWithAgeAndGender(_, { select, put, call }) {
			const {
				searchValue: { type },
			} = yield select(state => state.passengerAnalyze);

			let [startTime, endTime] = [null, null];
			if (type === RANGE_VALUE.YESTERDAY) {
				const beforeYesterday = moment().subtract(2, 'days').format('YYYY-MM-DD');
				startTime = beforeYesterday;
				endTime = beforeYesterday;
			} else if (type === RANGE_VALUE.WEEK) {
				startTime = moment().subtract(1, 'weeks').startOf('week').format('YYYY-MM-DD');
				endTime = moment().subtract(1, 'weeks').endOf('week').format('YYYY-MM-DD');
			} else {
				startTime = moment().subtract(1, 'month').startOf('month').format('YYYY-MM-DD');
				endTime = moment().subtract(1, 'month').endOf('month').format('YYYY-MM-DD');
			}

			const result = yield put.resolve({
				type: 'dashboard/getAgeRanges',
			});

			if (result && result.code === ERROR_OK) {
				const { data: { ageRangeList = [] } = {} } = result;
				const response = yield call(Actions.getPassengerFlowHistoryWithAgeAndGender, { startTime, endTime });
				if (response && response.code === ERROR_OK) {
					const {
						data: { countList = [] },
					} = response || {};

					const formattedList = formatPassengerCountList(countList, ageRangeList);

					yield put({
						type: 'updateState',
						payload: {
							lastPassengerAgeListByGender: formattedList,
						},
					});
				}
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
