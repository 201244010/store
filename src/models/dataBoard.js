import moment from 'moment';
import { format } from '@konata9/milk-shake';
import {
	getLatestPassengerFlow,
	getTimeRangePassengerFlow,
	getHistoryPassengerTypeCount,
	getLatestOrderList,
	getTimeRangeOrderList,
	getHistoryEnteringDistribution,
	getHistoryFrequencyList,
	handlePassengerFlowManagement,
} from '@/services/passengerFlow';
import { handleDashBoard } from '@/services/dashBoard';
import { ERROR_OK } from '@/constants/errorCode';

const RANGE = {
	TODAY: 'day',
	WEEK: 'week',
	MONTH: 'month',
	FREE: 'free',
	YESTERDAY: 'yesterday'
};

const queryRangeType = {
	[RANGE.TODAY]: 1,
	[RANGE.WEEK]: 2,
	[RANGE.MONTH]: 3,
	[RANGE.YESTERDAY]: 4,
};

const groupBy = {
	[RANGE.TODAY]: 'hour',
	[RANGE.WEEK]: 'day',
	[RANGE.MONTH]: 'day',
	[RANGE.YESTERDAY]: 'hour',
	[RANGE.FREE]: 'day',
};

export const getQueryDate = rangeType => [
	moment()
		.startOf(rangeType)
		.unix(),
	moment()
		.endOf(rangeType)
		.unix(),
];
const getQueryTimeRange = (searchValue = {}) => {
	const { rangeType, timeRangeStart, timeRangeEnd } = searchValue;

	let startTime;
	let endTime;

	if (rangeType !== RANGE.FREE) {
		[startTime, endTime] = getQueryDate(rangeType);
	} else {
		[startTime, endTime] = [
			timeRangeStart.startOf('day').unix(),
			timeRangeEnd.endOf('day').unix(),
		];
	}

	return [startTime, endTime];
};

export default {
	namespace: 'databoard',
	state: {
		realDataSearchValue: {
			rangeType: RANGE.DAY,
			timeRangeStart: moment()
				.startOf('day')
				.unix(),
			timeRangeEnd: moment()
				.endOf('day')
				.unix(),
		},
		passengerFlowSearchValue: {
			rangeType: RANGE.YESTERDAY,
			timeRangeStart: moment()
				.startOf('day')
				.unix(),
			timeRangeEnd: moment()
				.endOf('day')
				.unix(),
		}
	},
	effects: {
		// 获取门店客流数 && 进店率 OK
		*getPassengerData(_, { call, select }) {
			const {
				searchValue,
				searchValue: { rangeType }
			} = yield select(state => state.databoard);
			const [startTime, endTime] = getQueryTimeRange(searchValue);
			let response = {};
			let opt = {};
			if(rangeType !== RANGE.FREE) {
				opt = {
					type: queryRangeType[rangeType]
				};
				response = yield call(
					getLatestPassengerFlow,
					opt
				);
			} else {
				opt = {
					startTime: moment.unix(startTime).format('YYYY-MM-DD'),
					endTime: moment.unix(endTime).format('YYYY-MM-DD')
				};
				response = yield call(
					getTimeRangePassengerFlow,
					opt
				);
			}
			if (response && response.code === ERROR_OK) {
				console.log('----门店实时客流数----');
				const { data = {} } = response;
				const { latestCount, latestEntryHeadCount, earlyCount, earlyEntryHeadCount, latestPassCount, earlyPassCount } = data;
				const totalLastestCount = latestCount + latestEntryHeadCount;
				const totalEarlyCount = earlyCount + earlyEntryHeadCount;
				const lastestEntryRate = (totalLastestCount + latestPassCount) === 0 ? undefined : totalLastestCount / (totalLastestCount + latestPassCount) * 100;
				const earlyEntryRate = (totalEarlyCount + earlyPassCount) === 0 ? undefined : totalEarlyCount / (totalEarlyCount + earlyPassCount) * 100;
				// ByTimeRange 无上次进店客流（未处理）
				console.log('最新进店客流：', totalLastestCount);
				console.log('上次进店客流: ', totalEarlyCount);
				console.log('最新进店率：', lastestEntryRate);
				console.log('上次进店率: ', earlyEntryRate);
			}
		},
		// 获取门店客流趋势 OK
		*getPassengerFlow(_, { call, select }) {
			const {
				searchValue,
				searchValue: { rangeType }
			} = yield select(state => state.databoard);
			const [startTime, endTime] = getQueryTimeRange(searchValue);
			let response = {};
			let opt = {};
			if(rangeType !== RANGE.FREE) {
				opt = {
					type: queryRangeType[rangeType],
				};
				response = yield call(
					getLatestOrderList,
					opt
				);
			} else {
				opt = {
					startTime: moment.unix(startTime).format('YYYY-MM-DD'),
					endTime: moment.unix(endTime).format('YYYY-MM-DD'),
				};
				response = yield call(
					getTimeRangeOrderList,
					opt
				);
			}
			if (response && response.code === ERROR_OK) {
				console.log('----门店客流趋势----');
				const { data = {} } = response;
				const { countList = [] } = data;
				const passengerFlowList = countList.map(item => item.passengerFlowCount + item.entryHeadCount);
				console.log('门店客流趋势:', passengerFlowList);
			}
		},
		// 获取熟客数 Todo: 数据处理，日期范围确认
		*getRegularCount(_, { call, select }) {
			const {
				searchValue: { rangeType }
			} = yield select(state => state.databoard);
			let opt = {};
			let lastOpt = {};
			if(rangeType === RANGE.TODAY || rangeType === RANGE.FREE) return;
			if(rangeType === RANGE.YESTERDAY) {
				opt = {
					startTime: moment().subtract(1, 'days').format('YYYY-MM-DD'),
					endTime: moment().subtract(1, 'days').format('YYYY-MM-DD'),
				};
				lastOpt =  {
					startTime: moment().subtract(2, 'days').format('YYYY-MM-DD'),
					endTime: moment().subtract(2, 'days').format('YYYY-MM-DD'),
				};
			}
			if(rangeType === RANGE.WEEK) {
				opt = {
					startTime: moment().startOf('week').format('YYYY-MM-DD'),
					endTime: moment().endOf('week').format('YYYY-MM-DD'),
				};
				lastOpt =  {
					startTime: moment().subtract(1, 'weeks').startOf('week').format('YYYY-MM-DD'),
					endTime: moment().subtract(1, 'weeks').endOf('week').format('YYYY-MM-DD'),
				};
			}
			if(rangeType === RANGE.MONTH) {
				opt = {
					startTime: moment().startOf('month').format('YYYY-MM-DD'),
					endTime: moment().endOf('month').format('YYYY-MM-DD'),
				};
				lastOpt =  {
					startTime: moment().subtract(1, 'months').startOf('month').format('YYYY-MM-DD'),
					endTime: moment().subtract(1, 'months').endOf('month').format('YYYY-MM-DD'),
				};
			}
			const response = yield call(
				getHistoryPassengerTypeCount,
				opt
			);
			const lastResponse = yield call(
				getHistoryPassengerTypeCount,
				lastOpt
			);
			console.log(opt, lastOpt);
			console.log('----获取熟客数----');
			console.log(response);
			console.log(lastResponse);
		},
		// 进店率 OK
		*getEnteringDistribution(_, { call, select }) {
			const {
				searchValue: { rangeType }
			} = yield select(state => state.databoard);
			if(rangeType === RANGE.FREE || rangeType === RANGE.TODAY) return;
			const opt = {
				type: queryRangeType[rangeType],
				groupBy: groupBy[rangeType],
			};
			const response = yield call(
				getHistoryEnteringDistribution,
				opt
			);
			if (response && response.code === ERROR_OK) {
				console.log('----进店率----');
				const { data = {} } = response;
				const { countList = [] } = data;
				console.log('进店率原始数据:', countList);
				const enteringList = countList.map((item) => {
					const entry = item.passengerCount + item.entryHeadCount;
					const total = entry + item.passPassengerCount;
					return total === 0 ? 0 : entry / total * 100;
				});
				console.log('进店率:', enteringList);
			}
		},
		// 到店次数分布 OK
		*getFrequencyList(_, { call, select }) {
			const {
				searchValue: { rangeType }
			} = yield select(state => state.databoard);
			if(rangeType === RANGE.FREE || rangeType === RANGE.TODAY) return;
			let upper = 10;
			if(rangeType === RANGE.YESTERDAY) upper = 4;
			const opt = {
				type: queryRangeType[rangeType],
			};
			const response = yield call(
				getHistoryFrequencyList,
				opt
			);
			if (response && response.code === ERROR_OK) {
				console.log('----到店次数----');
				const { data = {} } = response;
				const { frequencyList: dataArr = [] } = data;
				console.log('到店次数原始数据:', dataArr);
				const frequencyList = [];
				for (let i = 0; i < dataArr.length; i += 1) {
					if (dataArr[i].frequency <= upper && dataArr[i].frequency >= 1) {
						frequencyList[dataArr[i].frequency - 1] = dataArr[i].uniqPassengerCount;
					}
					if (dataArr[i].frequency > upper) {
						frequencyList[upper] = frequencyList[upper]
							? frequencyList[upper] + dataArr[i].uniqPassengerCount : dataArr[i].uniqPassengerCount;
					}
				}
				console.log('到店次数:', frequencyList);
			}
		},
		// 获取实时销售额
		*getTotalAmount(_, { call, put, select }) {
			const {
				realDataSearchValue,
				realDataSearchValue: { rangeType }
			} = yield select(state => state.databoard);
			let startTime;
			let endTime;
			if(rangeType === RANGE.FREE) {
				[startTime, endTime] = getQueryTimeRange(realDataSearchValue);
			} else {
				[startTime, endTime] = getQueryTimeRange({...realDataSearchValue, rangeType: RANGE.DAY });
			}

			const options = {
				timeRangeStart: startTime,
				timeRangeEnd: endTime
			};
			const response = yield call(
				handleDashBoard,
				'getTotalAmount',
				format('toSnake')(options)
			);
			if (response && response.code === ERROR_OK) {
				const { data = {} } = response;
				const { dayAmount, yesterdayAmount,
					weekAmount, lastWeekAmount,
					monthAmount, lastMonthAmount
				} = format('toCamel')(data);
				yield put({
					type: 'updateState',
					payload: {
						paymentTotalAmount: {
							dayAmount,
							yesterdayAmount,
							weekAmount,
							lastWeekAmount,
							monthAmount,
							lastMonthAmount,
						},
					},
				});
			}
		},
		// 获取实时交易量
		*getTotalCount(_, { call, put, select }) {
			const {
				realDataSearchValue,
				realDataSearchValue: { rangeType }
			} = yield select(state => state.databoard);
			let startTime;
			let endTime;
			if(rangeType === RANGE.FREE) {
				[startTime, endTime] = getQueryTimeRange(realDataSearchValue);
			} else {
				[startTime, endTime] = getQueryTimeRange({...realDataSearchValue, rangeType: RANGE.DAY });
			}
			const options = {
				timeRangeStart: startTime,
				timeRangeEnd: endTime
			};
			const response = yield call(
				handleDashBoard,
				'getTotalCount',
				format('toSnake')(options)
			);
			if (response && response.code === ERROR_OK) {
				const { data = {} } = response;
				const { dayCount, yesterdayCount,
					weekCount, lastWeekCount,
					monthCount, lastMonthCount } = format('toCamel')(data);
				yield put({
					type: 'updateState',
					payload: {
						paymentTotalCount: {
							dayCount,
							yesterdayCount,
							weekCount,
							lastWeekCount,
							monthCount,
							lastMonthCount,
						},
					},
				});
			}
		},
		// 获取交易分布（销售额和交易量按时间分布）
		*getTimeDistribution(_, { call, select }) {
			const {
				realDataSearchValue,
			} = yield select(state => state.databoard);
			const [startTime, endTime] = getQueryTimeRange(realDataSearchValue);
			const timeInterval = 3600;
			const options = {
				startTime,
				endTime,
				timeInterval
			};
			const response = yield call(
				handleDashBoard,
				'getTimeDistribution',
				format('toSnake')(options)
			);
			if (response && response.code === ERROR_OK) {
				// yield put({
				// 	type: 'updateState',
				// 	payload: {
				// 		passengerFlowCount: { latestCount },
				// 	},
				// });
			}
		},
		// 交易转化率分布 （客流量和交易量按时间分布）
		*getPassengerOrderLatest(_, { call, select }) {
			const {
				realDataSearchValue,
				realDataSearchValue: { rangeType }
			} = yield select(state => state.databoard);
			const [startTime, endTime] = getQueryTimeRange(realDataSearchValue);
			let response = {};
			let opt = {};
			if(rangeType !== RANGE.FREE) {
				opt = {
					type: queryRangeType(rangeType)
				};
				response = yield call(
					handlePassengerFlowManagement,
					'statistic/order/getLatest',
					format('toSnake')(opt)
				);
			} else {
				opt = {
					startTime: moment.unix(startTime).format('YYYY-MM-DD'),
					endTime: moment.unix(endTime).format('YYYY-MM-DD')
				};
				response = yield call(
					handlePassengerFlowManagement,
					'statistic/order/getByTimeRange',
					format('toSnake')(opt)
				);
			}
			if (response && response.code === ERROR_OK) {
				// yield put({
				// 	type: 'updateState',
				// 	payload: {
				// 		passengerFlowCount: { latestCount },
				// 	},
				// });
			}

		},
		// 年龄性别分布实时客流数据
		*getPassengerByAgeGender(_, { call, select }) {
			const {
				realDataSearchValue,
			} = yield select(state => state.databoard);
			const [startTime, endTime] = getQueryTimeRange(realDataSearchValue);
			const opt = {
				startTime,
				endTime,
			};
			const response = yield call(
				handlePassengerFlowManagement,
				'statistic/age/getByGender',
				format('toSnake')(opt)
			);
			if (response && response.code === ERROR_OK) {
				const { data = {} } = response;
				const { countList = [] } = format('toCamel')(data) || {};
				const maleList = [];
				const femaleList = [];
				countList.forEach((item) => {
					const { maleCount, femaleCount, ageRangeCode } = item;
					maleList.push({
						count: maleCount,
						ageRangeCode,
					});
					femaleList.push({
						count: femaleCount,
						ageRangeCode,
					});
				});
			}
		},

		// 生熟客分布实时客流数据
		*getPassengerByRegular(_, { call, select }) {
			const {
				realDataSearchValue,
			} = yield select(state => state.databoard);
			const [startTime, endTime] = getQueryTimeRange(realDataSearchValue);
			const opt = {
				startTime,
				endTime,
			};
			const response = yield call(
				handlePassengerFlowManagement,
				'statistic/age/getByRegular',
				format('toSnake')(opt)
			);
			if (response && response.code === ERROR_OK) {
				const { data = {} } = response;
				const { countList = [] } = format('toCamel')(data) || {};
				const totalRegular = countList.reduce((prev, cur) => prev + cur.regularCount, 0);
				const totalStranger = countList.reduce((prev, cur) => prev + cur.strangerCount, 0);
				console.log('==', totalRegular, totalStranger);
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
