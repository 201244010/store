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

const rangeTimeInterval = {
	[RANGE.TODAY]: 3600,
	[RANGE.WEEK]: 24 * 3600,
	[RANGE.MONTH]: 24 * 3600,
	[RANGE.YESTERDAY]: 3600,
	[RANGE.FREE]: 24 * 3600,
};

const GENDER = {
	MALE: 1,
	FEMALE: 2,
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
		passengerCount: {},
		enteringRate: {},
	},
	effects: {
		*fetchAllData(_, { put }) {
			const type = 1; // type 1 实时； 2 客流分析
			const searchValue = {
				rangeType: RANGE.MONTH,
				timeRangeStart: moment()
					.startOf('day')
					.unix(),
				timeRangeEnd: moment()
					.endOf('day')
					.unix(),
			};

			if (type === 1) {
				yield put({
					type: 'fetchRealTimeData',
					payload: {
						searchValue,
						type,
					},
				});
			}
			if(type === 2) {
				yield put({
					type: 'fetchPassengerData',
					payload: {
						searchValue,
						type,
					},
				});
			}

		},
		*fetchRealTimeCard({ payload }, { put, select }) {
			// const {
			// 	searchValue: { rangeType }
			// } = payload;
			yield put.resolve({
				type: 'getPassengerData',
				payload,
			});
			yield put.resolve({
				type: 'getTotalAmount',
				payload,
			});
			yield put.resolve({
				type: 'getTotalCount',
				payload,
			});
			yield put.resolve({
				type: 'getTransactionRate',
				payload
			});
			const {
				RTPassengerCount, paymentTotalAmount,  paymentTotalCount, transactionRate,
			} = yield select(state => state.databoard);
			// const { count: passCount, earlyCount: earlyPassengerCount } = passengerCount;
			// const { count: paymentCount, earlyCount: earlyPaymentCount } = paymentTotalCount[rangeType];
			// const rate = passCount ? paymentCount / passCount : undefined;
			// const earlyRate = earlyPassengerCount ? earlyPaymentCount / earlyPassengerCount : undefined;
			console.log('===fetchRealTimeCard===', RTPassengerCount, paymentTotalCount, paymentTotalAmount, transactionRate);
			yield put({
				type: 'updateState',
				realTimeCard: [
					RTPassengerCount,
					paymentTotalAmount,
					paymentTotalCount,
					transactionRate,
					// {
					// 	count: rate,
					// 	earlyCount: earlyRate,
					// 	label: 'transactionRate',
					// 	unit: 'percent',
					// }
				]
			});
		},
		*fetchPassengerCard({ payload }, { put }) {
			yield put({
				type: 'getPassengerData',
				payload,
			});
		},
		*fetchRealTimeData({ payload }, { put }) {
			yield put({
				type: 'fetchRealTimeCard',
				payload,
			});
			yield put({
				type: 'getTimeDistribution',
				payload,
			});
			yield put({
				type: 'getPassengerOrderLatest',
				payload,
			});
			yield put({
				type: 'getPassengerByAgeGender',
				payload,
			});
			yield put({
				type: 'getPassengerByRegular',
				payload,
			});
		},
		*fetchPassengerData({ payload }, { put }) {
			yield put({
				type: 'fetchPassengerCard',
				payload,
			});
			yield put({
				type: 'getHistoryByGender',
				payload
			});
			yield put({
				type: 'getPassengerHistoryTrend',
				payload
			});
			yield put({
				type: 'getFrequencyWithAgeAndGender',
				payload
			});
		},
		// 获取门店客流数 && 进店率 OK
		*getPassengerData({ payload = {} }, { call, put }) {
			const {
				type,
				searchValue,
				searchValue: { rangeType }
			} = payload;
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
				const passengerCompareValue = !(totalEarlyCount && totalLastestCount) ? undefined : (totalLastestCount - totalEarlyCount) / totalEarlyCount;
				const entryCompareValue = !(lastestEntryRate && earlyEntryRate)? undefined : (lastestEntryRate - earlyEntryRate) / earlyEntryRate;
				// ByTimeRange 无上次进店客流（未处理）
				console.log('最新进店客流：', totalLastestCount);
				console.log('上次进店客流: ', totalEarlyCount);
				console.log('最新进店率：', lastestEntryRate);
				console.log('上次进店率: ', earlyEntryRate);
				console.log('进店客流较上次：', passengerCompareValue);
				console.log('进店率较上次：', entryCompareValue);
				if (type === 1) {
					yield put({
						type: 'updateState',
						payload: {
							passengerCount: {
								label: 'passengerCount',
								count: totalLastestCount,
								earlyCount: totalEarlyCount,
								compareRate: false,
								unit: 'default'
							},
							enteringRate: {
								label: 'enteringRate',
								count: lastestEntryRate,
								earlyCount: earlyEntryRate,
								compareRate: false,
								unit: 'percent'
							},
						},
					});
				}
				if(type === 2) {
					yield put({
						type: 'updateState',
						payload: {
							passengerCount: {
								label: 'passengerCount',
								count: totalLastestCount,
								earlyCount: passengerCompareValue,
								compareRate: true,
								unit: 'default'
							},
							enteringRate: {
								label: 'enteringRate',
								count: lastestEntryRate,
								earlyCount: entryCompareValue,
								compareRate: true,
								unit: 'percent'
							},
						},
					});
				}

			}
		},
		// 获取门店客流趋势 OK
		*getPassengerFlow({ payload = {} }, { call }) {
			const {
				searchValue,
				searchValue: { rangeType }
			} = payload;
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
		*getRegularCount({ payload = {} }, { call }) {
			const {
				searchValue: { rangeType }
			} = payload;
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
		*getEnteringDistribution({ payload = {} }, { call }) {
			const {
				searchValue: { rangeType }
			} = payload;
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
		*getFrequencyList({ payload = {} }, { call }) {
			const {
				searchValue: { rangeType }
			} = payload;
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
		*getTotalAmount({ payload = {} }, { call, put }) {
			const {
				searchValue,
				searchValue: { rangeType }
			} = payload;
			let startTime;
			let endTime;
			if(rangeType === RANGE.FREE) {
				[startTime, endTime] = getQueryTimeRange(searchValue);
			} else {
				[startTime, endTime] = getQueryTimeRange({...searchValue, rangeType: RANGE.TODAY });
			}

			const options = {
				timeRangeStart: startTime,
				timeRangeEnd: endTime,
				rateRequired: 1,
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
				console.log('====总销售额====', data);
				yield put({
					type: 'updateState',
					payload: {
						paymentTotalAmount: {
							[RANGE.TODAY]: {
								count: dayAmount,
								earlyCount: yesterdayAmount,
								label: 'totalAmount',
							},
							[RANGE.WEEK]: {
								count: weekAmount,
								earlyCount: lastWeekAmount,
								label: 'totalAmount',
							},
							[RANGE.MONTH]: {
								count: monthAmount,
								earlyCount: lastMonthAmount,
								label: 'totalAmount',
							},
						},
					},
				});
			}
		},
		// 获取实时交易量
		*getTotalCount({ payload = {} }, { call, put }) {
			const {
				searchValue,
				searchValue: { rangeType }
			} = payload;
			let startTime;
			let endTime;
			if(rangeType === RANGE.FREE) {
				[startTime, endTime] = getQueryTimeRange(searchValue);
			} else {
				[startTime, endTime] = getQueryTimeRange({...searchValue, rangeType: RANGE.TODAY });
			}
			const options = {
				timeRangeStart: startTime,
				timeRangeEnd: endTime,
				rateRequired: 1,
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
				console.log('====总销售量====', data);
				yield put({
					type: 'updateState',
					payload: {
						paymentTotalCount: {
							[RANGE.TODAY]: {
								count: dayCount,
								earlyCount: yesterdayCount,
								label: 'totalCount',
							},
							[RANGE.WEEK]: {
								count: weekCount,
								earlyCount: lastWeekCount,
								label: 'totalCount',
							},
							[RANGE.MONTH]: {
								count: monthCount,
								earlyCount: lastMonthCount,
								label: 'totalCount',
							},
						},
					},
				});
			}
		},

		// 计算总交易转化率
		*getTransactionRate({ payload = {} }, { put, select }) {
			const {
				RTPassengerCount,
				paymentTotalCount,
			} = yield select(state => state.databoard);
			const {
				searchValue: { rangeType }
			} = payload;
			const { count: passCount, earlyCount: earlyPassengerCount } = RTPassengerCount;
			const { count: paymentCount, earlyCount: earlyPaymentCount } = paymentTotalCount[rangeType];
			const rate = passCount ? paymentCount / passCount : undefined;
			const earlyRate = earlyPassengerCount ? earlyPaymentCount / earlyPassengerCount : undefined;
			console.log('====总交易转化率===', rate, earlyRate);
			yield put({
				type: 'updateState',
				payload: {
					transactionRate: {
						count: rate,
						earlyCount: earlyRate,
						label: 'transactionRate',
						unit: 'percent'
					}
				}
			});
		},


		// 获取交易分布（销售额和交易量按时间分布）
		*getTimeDistribution({ payload = {} }, { call, put }) {
			const {
				searchValue,
				searchValue: { rangeType }
			} = payload;
			const [startTime, endTime] = getQueryTimeRange(searchValue);
			const timeInterval = rangeTimeInterval[rangeType];
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
				const { data = {} } = response;
				const { orderList = [] } = format('toCamel')(data);
				const amountList = orderList.map((item, index) => ({
					time: index + 1,
					value: item.amount,
					name: 'amount',
				}));
				const countList = orderList.map((item, index) => ({
					time: index + 1,
					value: item.count,
					name: 'count'
				}));
				console.log('销售额 订单数 分布', amountList, countList);
				yield put({
					type: 'updateState',
					payload: {
						amountList,
						countList
					},
				});
			}
		},
		// 交易转化率分布 （客流量和交易量按时间分布）
		*getPassengerOrderLatest({ payload = {} }, { call, put }) {
			const {
				searchValue,
				searchValue: { rangeType }
			} = payload;
			let response = {};
			let opt = {};
			if(rangeType !== RANGE.FREE) {
				opt = {
					type: queryRangeType[rangeType]
				};
				response = yield call(
					handlePassengerFlowManagement,
					'statistic/order/getLatest',
					format('toSnake')(opt)
				);
			} else {
				const [startTime, endTime] = getQueryTimeRange(searchValue);
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
				const { data = {} } = response;
				const { countList = [] } = format('toCamel')(data);
				const orderRateList = countList.map(item => {
					const { orderCount = 0, passengerFlowCount = 0, entryHeadCount = 0, time } = item;
					const totalPassenger = passengerFlowCount + entryHeadCount;
					return {
						time,
						value: totalPassenger ? orderCount / totalPassenger : 0,
					};
				});
				console.log('交易转化率', orderRateList);
				yield put({
					type: 'updateState',
					payload: {
						orderRateList
					},
				});
			}

		},
		// 年龄性别分布实时客流数据
		*getPassengerByAgeGender({ payload = {} }, { call, put }) {
			const {
				searchValue
			} = payload;
			const [startTime, endTime] = getQueryTimeRange(searchValue);
			const opt = {
				startTime: moment.unix(startTime).format('YYYY-MM-DD'),
				endTime: moment.unix(endTime).format('YYYY-MM-DD')
			};
			const response = yield call(
				handlePassengerFlowManagement,
				'statistic/age/getByGender',
				format('toSnake')(opt)
			);
			if (response && response.code === ERROR_OK) {
				const { data = {} } = response;
				const { countList = [] } = format('toCamel')(data) || {};
				const [aObj, bObj, cObj, ...tail] = countList.sort((a, b) => a.ageRangeCode - b.ageRangeCode);
				const below = [aObj, bObj, cObj].reduce((prev, cur) => {
					const { maleCount, femaleCount } = prev;
					return {
						...prev,
						maleCount: maleCount + cur.maleCount,
						femaleCount: femaleCount + cur.femaleCount
					};
				});
				const targetList = [below, ...tail].reduce((prev, cur) => {
					const { maleCount, femaleCount, ageRangeCode } = cur;
					return prev.concat([{
						gender: 'male',
						range: ageRangeCode,
						count: maleCount
					}, {
						gender: 'female',
						range: ageRangeCode,
						count: femaleCount
					}]);
				}, []);
				console.log('=====年龄性别分布实时客流数据====', targetList);
				yield put({
					type: 'updateState',
					payload: {
						ageGenderList: targetList
					}
				});
			}
		},
		// 生熟客分布实时客流数据
		*getPassengerByRegular({ payload = {} }, { call, put }) {
			const {
				searchValue
			} = payload;
			const [startTime, endTime] = getQueryTimeRange(searchValue);
			const opt = {
				startTime: moment.unix(startTime).format('YYYY-MM-DD'),
				endTime: moment.unix(endTime).format('YYYY-MM-DD')
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
				console.log('==生熟客分布实时客流数据==', totalRegular, totalStranger);
				yield put({
					type: 'updateState',
					payload: {
						regularList: [{
							name: 'regular',
							value: totalRegular,
						}, {
							name: 'stranger',
							value: totalStranger
						}]
					}
				});
			}
		},

		// 客流趋势
		*getPassengerHistoryTrend({ payload = {} }, { call, put }) {
			const {
				searchValue: { rangeType }
			} = payload;
			const opt = {
				type: queryRangeType[rangeType],
				groupBy: groupBy[rangeType]
			};
			const response = yield call(
				handlePassengerFlowManagement,
				'statistic/history/getList',
				format('toSnake')(opt)
			);
			if (response && response.code === ERROR_OK) {
				const { data = {} } = response;
				const { countList = [] } = format('toCamel')(data);
				const passengerFlowList = countList.reduce((prev, cur, index) => {
					const { /* time, */totalCount, entryHeadCount, regularCount, strangerCount } = cur;
					return prev.concat([{
						time: index + 1,
						value: totalCount + entryHeadCount,
						name: 'total'
					},{
						time: index + 1,
						value: regularCount,
						name: 'regular'
					},{
						time: index + 1,
						value: strangerCount,
						name: 'stranger'
					}]);
				}, []);
				console.log('===历史客流===', passengerFlowList);
				yield put({
					type: 'updateState',
					payload: {
						passengerFlowList
					}
				});
			}
		},
		// 客群平均到店频次
		*getFrequencyWithAgeAndGender({ payload = {} }, { call, put }) {
			const {
				searchValue: { rangeType }
			} = payload;
			if(rangeType!== RANGE.YESTERDAY) {
				const opt = {
					type: queryRangeType[rangeType],
				};
				const response = yield call(
					handlePassengerFlowManagement,
					'statistic/history/getFrequencyWithAgeAndGender',
					format('toSnake')(opt)
				);
				if (response && response.code === ERROR_OK) {
					const { data = {} } = response;
					const { frequencyList = [] } = format('toCamel')(data);
					const femaleList = frequencyList.filter(item => item.gender === 2);
					const maleList = frequencyList.filter(item => item.gender === 1);

					const femalePassenger = femaleList.reduce((prev, cur) => prev + cur.passengerCount, 0);
					const femaleUniqPassenger = femaleList.reduce((prev, cur) => prev + cur.uniqPassengerCount, 0);
					const malePassenger = maleList.reduce((prev, cur) => prev + cur.passengerCount, 0);
					const maleUniqPassenger = maleList.reduce((prev, cur) => prev + cur.uniqPassengerCount, 0);
					const femaleFrequency = femaleUniqPassenger ? femalePassenger / femaleUniqPassenger : 0;
					const maleFrequency = maleUniqPassenger ? malePassenger / maleUniqPassenger : 0;

					const [code1, code2, code3, ...femalTail] = femaleList.sort((a, b) => a.ageRangeCode - b.ageRangeCode);
					const [code4, code5, code6, ...maleTail] = maleList.sort((a, b) => a.ageRangeCode - b.ageRangeCode);
					const femaleObj = [code1, code2, code3].reduce((prev, cur) => ({
						passengerCount: prev.passengerCount + cur.passengerCount,
						uniqPassengerCount: prev.uniqPassengerCount + cur.uniqPassengerCount,
						ageRangeCode: 1,
						gender: prev.gender,
					}));
					const maleObj = [code4, code5, code6].reduce((prev, cur) => ({
						passengerCount: prev.passengerCount + cur.passengerCount,
						uniqPassengerCount: prev.uniqPassengerCount + cur.uniqPassengerCount,
						ageRangeCode: 1,
						gender: prev.gender,
					}));

					const targetList = [femaleObj, maleObj, ...femalTail, ...maleTail].map(item => ({
						value: item.uniqPassengerCount ? item.passengerCount / item.uniqPassengerCount : 0,
						gender: item.gender === 1 ? 'male' : 'female',
						range: item.ageRangeCode
					}));

					console.log('===到店频次===', targetList, femaleFrequency, maleFrequency);
					yield put({
						type: 'updateState',
						payload: {
							customerDistri: {
								data: targetList,
								frequency: {
									male: maleFrequency,
									female: femaleFrequency,
								}
							}
						}
					});

				}
			}

		},

		// 主力客群画像
		*getHistoryByGender({ payload = {} }, { call, put, select }) {
			const {
				searchValue: { rangeType }
			} = payload;
			const { passengerCount: { count: totalCount } } = yield select(state => state.databoard);
			const opt = {
				type: queryRangeType[rangeType],
			};
			const response = yield call(
				handlePassengerFlowManagement,
				'statistic/age/getHistoryByGender',
				format('toSnake')(opt)
			);
			if (response && response.code === ERROR_OK) {
				const { data = {} } = response;
				const { countList = [] } = format('toCamel')(data);
				// const totalCount = countList.reduce((prev, cur) => {
				// 	const { maleCount = 0, femaleCount = 0 } = cur;
				// 	return prev + maleCount + femaleCount;
				// }, 0);
				// const [aObj, bObj, cObj, ...tail] = countList.sort((a, b) => a.ageRangeCode - b.ageRangeCode);
				// console.log('======', [aObj, bObj, cObj], tail);
				// const below = [aObj, bObj, cObj].reduce((prev, cur) => {
				// 	const { }
				// });
				const targetList = countList
					.reduce((prev, cur) => {
						const {
							ageRangeCode,
							maleCount, maleRegularCount, maleRushHour, maleUniqCount,
							femaleCount, femaleRegularCount, femaleRushHour, femaleUniqCount,
						} = cur;
						return prev.concat([{
							ageRangeCode,
							count: maleCount,
							hotTime: maleRushHour,
							regularCount: maleRegularCount,
							uniqCount: maleUniqCount,
							totalPercent: totalCount ? maleCount / totalCount : 0,
							regularPercent: maleCount ? maleRegularCount / maleCount : 0,
							frequency: maleUniqCount ? maleCount / maleUniqCount : 0,
							gender: GENDER.MALE,
						}, {
							ageRangeCode,
							count: femaleCount,
							hotTime: femaleRushHour,
							regularCount: femaleRegularCount,
							uniqCount: femaleUniqCount,
							totalPercent: totalCount ? femaleCount / totalCount : 0,
							regularPercent: femaleCount ? femaleRegularCount / femaleCount : 0,
							frequency: femaleUniqCount ? femaleCount / femaleUniqCount : 0,
							gender: GENDER.FEMALE,
						}]);
					}, []).sort((a, b) => b.count - a.count);
				const majorList = targetList.slice(0, 3);
				console.log('====主力客群画像===', majorList);
				yield put({
					type: 'updateState',
					payload: {
						majorList
					}
				});
			}
		}

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
