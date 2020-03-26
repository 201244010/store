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
	getPassengerOverview,
	getFrequencyDistribution,
} from '@/services/passengerFlow';
import { handleDashBoard } from '@/services/dashBoard';
import { getDeviceOverview } from '@/services/device';
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
		RTEnteringRate: {}, // 进店率（实时）
		RTPassengerCount: {}, // 进店客流（实时）
		RTDeviceCount: {}, // 总设备数（实时）
		RTPassengerFlowList: [], // 客流趋势（折线图-实时）
		passengerCount: {}, // 进店客流（客流）
		enteringRate: {}, // 进店率（客流）
		regularCount: {}, // 熟客人数 （客流）
		avgFrequency: {}, // 到店频次（客流）
		enteringList: [], // 进店率（折线图-客流）
		frequencyList: [], // 到店次数分布（柱状图-客流）
		frequencyTrend: [] // 到店频次趋势（折线图-客流）
	},
	effects: {
		*fetchAllData(_, { put }) {
			const type = 1; // type 1 实时； 2 客流分析
			const searchValue = {
				rangeType: RANGE.WEEK,
				timeRangeStart: moment()
					.startOf('day')
					.unix(),
				timeRangeEnd: moment()
					.endOf('day')
					.unix(),
			};

			if (type === 1) {
				console.log('comin ');
				yield put({
					type: 'fetchRealTimeData',
					payload: {
						searchValue,
						type
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
		*fetchRealTimeCard({ payload }, { put }) {
			console.log('========================card');
			yield put({
				type: 'getDeviceCount',
				payload,
			});
			yield put({
				type: 'getPassengerData',
				payload,
			});
		},
		// 客流统计顶部卡片总览 OK
		*fetchPassengerCard({ payload }, { put, call }) {
			const {
				searchValue: { rangeType }
			} = payload;
			if(rangeType === RANGE.FREE || rangeType === RANGE.TODAY) return;
			const opt = {
				type: queryRangeType[rangeType],
			};
			const response = yield call(
				getPassengerOverview,
				opt
			);
			if (response && response.code === ERROR_OK) {
				console.log('----客流分析顶部卡片----');
				const { data = {} } = response;
				const {
					latestPassengerCount,
					earlyPassengerCount,
					latestPassPassengerCount,
					earlyPassPassengerCount,
					latestUniqPassengerCount,
					earlyUniqPassengerCount,
					latestRegularPassengerCount,
					earlyRegularPassengerCount,
					latestEntryHeadCount,
					earlyEntryHeadCount,
				} = data;
				const latestTotalPassengerCount = latestPassengerCount + latestEntryHeadCount;
				const earlyTotalPassengerCount = earlyPassengerCount + earlyEntryHeadCount;
				const comparePassengerCount = (!earlyTotalPassengerCount || latestTotalPassengerCount === undefined) ? undefined : (latestTotalPassengerCount - earlyTotalPassengerCount) / earlyTotalPassengerCount;
				const compareRegularCount = (!earlyRegularPassengerCount || latestRegularPassengerCount === undefined) ? undefined : (latestRegularPassengerCount - earlyRegularPassengerCount) / earlyRegularPassengerCount;
				const latestEnteringRate = (latestTotalPassengerCount + latestPassPassengerCount) === 0 ? undefined : latestTotalPassengerCount / (latestTotalPassengerCount + latestPassPassengerCount);
				const earlyEnteringRate = (earlyTotalPassengerCount + earlyPassPassengerCount) === 0 ? undefined : earlyTotalPassengerCount / (earlyTotalPassengerCount + earlyPassPassengerCount);
				const compareEarlyEnteringRate = (!earlyEnteringRate || latestEnteringRate === undefined) ? undefined : (latestEnteringRate - earlyEnteringRate) / earlyEnteringRate;
				const latestAvgFrequecy = latestUniqPassengerCount ? latestPassengerCount / latestUniqPassengerCount : undefined;
				const earlyAvgFrequecy = earlyUniqPassengerCount ? earlyPassengerCount / earlyUniqPassengerCount : undefined;
				const compareAvgFrequecy =  (!earlyAvgFrequecy || latestAvgFrequecy === undefined) ? undefined : (latestAvgFrequecy - earlyAvgFrequecy) / earlyAvgFrequecy;
				console.log('进店客流', latestTotalPassengerCount);
				console.log('进店客流较上次:', comparePassengerCount);
				console.log('熟客人数', latestRegularPassengerCount);
				console.log('熟客人数较上次', compareRegularCount);
				console.log('进店率', latestEnteringRate);
				console.log('进店率较上次', compareEarlyEnteringRate);
				console.log('到店频次', latestAvgFrequecy);
				console.log('到店频次较上次', compareAvgFrequecy);
				yield put({
					type: 'updateState',
					payload: {
						passengerCount: {
							label: 'passengerCount',
							count: latestTotalPassengerCount,
							earlyCount: earlyTotalPassengerCount,
							compareRate: true,
						},
						regularCount: {
							label: 'regularCount',
							count: latestRegularPassengerCount,
							earlyCount: earlyRegularPassengerCount,
							compareRate: true,
						},
						enteringRate: {
							label: 'enteringRate',
							count: latestEnteringRate,
							earlyCount: earlyEnteringRate,
							compareRate: true,
							unit: 'percent'
						},
						avgFrequency: {
							label: 'avgFrequency',
							count: latestAvgFrequecy,
							earlyCount: earlyAvgFrequecy,
							compareRate: true,
							unit: 'frequency'
						},
					},
				});
			}
		},
		*fetchRealTimeData({ payload }, { put }) {
			console.log('xxxx');
			yield put({
				type: 'fetchRealTimeCard',
				payload,
			});
			console.log('xxss');
			yield put({
				type: 'getPassengerFlow',
				payload,
			});

		},
		*fetchPassengerData({ payload }, { put }) {
			yield put({
				type: 'fetchPassengerCard',
				payload,
			});
			yield put({
				type: 'getEnteringDistribution',
				payload,
			});
			yield put({
				type: 'getFrequencyList',
				payload,
			});
			yield put({
				type: 'getFrequencyDistribution',
				payload,
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
			let earlyResponse = {};
			let opt = {};
			if(rangeType !== RANGE.FREE && rangeType !== RANGE.YESTERDAY) {
				opt = {
					type: queryRangeType[rangeType]
				};
				response = yield call(
					getLatestPassengerFlow,
					opt
				);
			} else {
				let earlyOpt = {};
				if (rangeType === RANGE.YESTERDAY) {
					opt = {
						startTime: moment().subtract(1, 'days').format('YYYY-MM-DD'),
						endTime: moment().subtract(1, 'days').format('YYYY-MM-DD')
					};
					earlyOpt = {
						startTime: moment().subtract(2, 'days').format('YYYY-MM-DD'),
						endTime: moment().subtract(2, 'days').format('YYYY-MM-DD')
					};
				} else {
					opt = {
						startTime: moment.unix(startTime).format('YYYY-MM-DD'),
						endTime: moment.unix(endTime).format('YYYY-MM-DD')
					};
					earlyOpt = {
						startTime: moment.unix(startTime).subtract(1, 'days').format('YYYY-MM-DD'),
						endTime: moment.unix(endTime).subtract(1, 'days').format('YYYY-MM-DD')
					};
				}
				response = yield call(
					getTimeRangePassengerFlow,
					opt
				);
				earlyResponse = yield call(
					getTimeRangePassengerFlow,
					earlyOpt
				);
			}
			if (response && response.code === ERROR_OK) {
				const { data = {} } = response;
				const { latestCount, latestEntryHeadCount, latestPassCount } = data;
				let { earlyCount, earlyEntryHeadCount, earlyPassCount } = data;
				if (earlyResponse && earlyResponse.code === ERROR_OK) {
					const { data: earlyData = {} } = earlyResponse;
					const { latestCount: earlyDataCount, latestEntryHeadCount: earlyDataEntryHeadCount, latestPassCount: earlyDataPassCount } = earlyData;
					earlyCount = earlyDataCount;
					earlyEntryHeadCount = earlyDataEntryHeadCount;
					earlyPassCount = earlyDataPassCount;
				}
				const totalLastestCount = latestCount + latestEntryHeadCount;
				const totalEarlyCount = earlyCount + earlyEntryHeadCount;
				const lastestEntryRate = (totalLastestCount + latestPassCount) === 0 ? undefined : totalLastestCount / (totalLastestCount + latestPassCount) * 100;
				const earlyEntryRate = (totalEarlyCount + earlyPassCount) === 0 ? undefined : totalEarlyCount / (totalEarlyCount + earlyPassCount) * 100;
				const passengerCompareValue = (!totalEarlyCount || totalLastestCount === undefined) ? undefined : (totalLastestCount - totalEarlyCount) / totalEarlyCount;
				const entryCompareValue = (!earlyEntryRate || lastestEntryRate === undefined) ? undefined : (lastestEntryRate - earlyEntryRate) / earlyEntryRate;
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
							RTPassengerCount: {
								label: 'passengerCount',
								count: totalLastestCount,
								earlyCount: totalEarlyCount,
							},
							RTEnteringRate: {
								label: 'enteringRate',
								count: lastestEntryRate,
								earlyCount: earlyEntryRate,
								unit: 'percent'
							},
						},
					});
				}
				console.log({
					RTPassengerCount: {
						label: 'passengerCount',
						count: totalLastestCount,
						earlyCount: totalEarlyCount,
					},
					RTEnteringRate: {
						label: 'enteringRate',
						count: lastestEntryRate,
						earlyCount: earlyEntryRate,
						unit: 'percent'
					},
				});
				if(type === 2) {
					yield put({
						type: 'updateState',
						payload: {
							passengerCount: {
								label: 'passengerCount',
								count: totalLastestCount,
								earlyCount: passengerCompareValue,
								compareRate: true,
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
		*getPassengerFlow({ payload = {} }, { call, put }) {
			const {
				searchValue,
				searchValue: { rangeType }
			} = payload;
			const [startTime, endTime] = getQueryTimeRange(searchValue);
			let response = {};
			let opt = {};
			if(rangeType === RANGE.YESTERDAY) return;
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
				const RTPassengerFlowList = countList.map(item => ({
					name: 'passenger',
					time: item.time,
					value: item.passengerFlowCount + item.entryHeadCount,
				}));
				console.log('门店客流趋势:', RTPassengerFlowList);
				yield put({
					type: 'updateState',
					payload: {
						RTPassengerFlowList
					},
				});
			}
		},
		// 获取熟客数 OK（暂时不会用到）
		*getRegularCount({ payload = {} }, { call, put }) {
			console.log('----获取熟客数-----');
			const {
				searchValue: { rangeType }
			} = payload;
			let earlyOpt = {};
			let opt = {};
			if(rangeType === RANGE.TODAY || rangeType === RANGE.FREE) return;
			if(rangeType === RANGE.YESTERDAY) {
				earlyOpt = {
					startTime: moment().subtract(1, 'days').format('YYYY-MM-DD'),
					endTime: moment().subtract(1, 'days').format('YYYY-MM-DD'),
				};
				opt =  {
					startTime: moment().subtract(2, 'days').format('YYYY-MM-DD'),
					endTime: moment().subtract(2, 'days').format('YYYY-MM-DD'),
				};
			}
			if(rangeType === RANGE.WEEK) {
				earlyOpt = {
					startTime: moment().startOf('week').format('YYYY-MM-DD'),
					endTime: moment().endOf('week').format('YYYY-MM-DD'),
				};
				opt =  {
					startTime: moment().subtract(1, 'weeks').startOf('week').format('YYYY-MM-DD'),
					endTime: moment().subtract(1, 'weeks').endOf('week').format('YYYY-MM-DD'),
				};
			}
			if(rangeType === RANGE.MONTH) {
				earlyOpt = {
					startTime: moment().startOf('month').format('YYYY-MM-DD'),
					endTime: moment().endOf('month').format('YYYY-MM-DD'),
				};
				opt =  {
					startTime: moment().subtract(1, 'months').startOf('month').format('YYYY-MM-DD'),
					endTime: moment().subtract(1, 'months').endOf('month').format('YYYY-MM-DD'),
				};
			}
			const earlyResponse = yield call(
				getHistoryPassengerTypeCount,
				earlyOpt
			);
			const response = yield call(
				getHistoryPassengerTypeCount,
				opt
			);
			console.log(earlyResponse, response);
			console.log('----获取熟客数----');
			let regular;
			let earlyRegular;
			if(response && response.code === ERROR_OK) {
				const { data = {} } = response;
				const { regularCount } = data;
				regular = regularCount;
			}
			if(response && response.code === ERROR_OK) {
				const { data = {} } = response;
				const { regularCount } = data;
				regular = regularCount;
			}
			if(earlyResponse && earlyResponse.code === ERROR_OK) {
				const { data = {} } = response;
				const { regularCount } = data;
				earlyRegular = regularCount;
			}
			const regularCompareValue = !(regular && earlyRegular) ? undefined :  (regular - earlyRegular) / earlyRegular * 100;
			console.log('当前熟客数：', regular);
			console.log('上次熟客数：', earlyRegular);
			console.log('熟客数较上次:', regularCompareValue);
			yield put({
				type: 'updateState',
				payload: {
					regularCount: {
						label: 'regularCount',
						count: regular,
						earlyCount: regularCompareValue,
						compareRate: true,
					},
				},
			});
		},
		// 获取总设备数 OK
		*getDeviceCount(_, { call, put }) {
			const options = {
				source: 1,
			};
			const response = yield call(
				getDeviceOverview,
				options,
			);
			const { data: { dataList = [] }} = response;
			const { onlineCount, offlineCount } = dataList[0];
			yield put({
				type: 'updateState',
				payload: {
					RTDeviceCount: {
						label: 'deviceCount',
						count: onlineCount + offlineCount,
						earlyCount: offlineCount,
					},
				},
			});

		},
		// 进店率分布 OK
		*getEnteringDistribution({ payload = {} }, { call, put }) {
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
				const enteringList = countList.map((item, index) => {
					const entry = item.passengerCount + item.entryHeadCount;
					const total = entry + item.passPassengerCount;
					return {
						name: 'entering',
						time: index + 1,
						value: total === 0 ? 0 : entry / total * 100,
					};
				});
				console.log('进店率列表:', enteringList);
				yield put({
					type: 'updateState',
					payload: {
						enteringList
					},
				});
			}
		},
		// 到店次数分布 OK
		*getFrequencyList({ payload = {} }, { call, put }) {
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
				let frequencyList = [];
				for (let i = 0; i < dataArr.length; i += 1) {
					if (dataArr[i].frequency <= upper && dataArr[i].frequency >= 1) {
						frequencyList[dataArr[i].frequency - 1] = dataArr[i].uniqPassengerCount;
					}
					if (dataArr[i].frequency > upper) {
						frequencyList[upper] = frequencyList[upper]
							? frequencyList[upper] + dataArr[i].uniqPassengerCount : dataArr[i].uniqPassengerCount;
					}
				}
				frequencyList = frequencyList.map((item, index) => ({
					frequency: index + 1,
					value: item,
				}));
				console.log('到店次数:', frequencyList);
				yield put({
					type: 'updateState',
					payload: {
						frequencyList,
					},
				});

			}
		},

		// 周（月）到店频次趋势
		*getFrequencyDistribution({ payload = {} }, { call, put }) {
			const {
				searchValue: { rangeType }
			} = payload;
			if(!(rangeType === RANGE.WEEK || rangeType === RANGE.MONTH)) return;
			const opt = {
				type: queryRangeType[rangeType],
				groupBy: rangeType === RANGE.WEEK ? 'day' : 'week',
			};
			const response = yield call(
				getFrequencyDistribution,
				opt
			);
			if (response && response.code === ERROR_OK) {
				console.log('----周（月）到店频次趋势----');
				const { data = {} } = response;
				const { frequencyList: dataArr = [] } = data;
				let frequencyList = [];
				frequencyList = dataArr.map((item, index) => ({
					frequency: index + 1,
					// 柱状图 分母为0 显示 0
					value: item.uniqPassengerCount === 0 ? 0 : item.passengerCount / item.uniqPassengerCount,
				}));
				console.log('到店频次趋势:', frequencyList);
				
				yield put({
					type: 'updateState',
					payload: {
						frequencyTrend: frequencyList,
					},
				});
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
				[startTime, endTime] = getQueryTimeRange({...realDataSearchValue, rangeType: RANGE.TODAY });
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
				[startTime, endTime] = getQueryTimeRange({...realDataSearchValue, rangeType: RANGE.TODAY });
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
				const { data = {} } = response;
				const { orderList = [] } = format('toCamel')(data);
				const amountList = orderList.map(item => ({
					time: item.time,
					value: item.amount,
				}));
				const countList = orderList.map(item => ({
					time: item.time,
					value: item.count
				}));
				console.log('销售额 订单数 分布',amountList, countList);
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
				const [startTime, endTime] = getQueryTimeRange(realDataSearchValue);
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

		// 客流趋势
		*getPassengerHistoryTrend(_, { call, select }) {
			const {
				passengerFlowSearchValue: rangeType,
			} = yield select(state => state.databoard);
			const opt = {
				type: queryRangeType(rangeType),
				groupBy: groupBy(rangeType)
			};
			const response = yield call(
				handlePassengerFlowManagement,
				'statistic/history/getList',
				format('toSnake')(opt)
			);
			if (response && response.code === ERROR_OK) {
				const { data = {} } = response;
				const { countList = [] } = format('toCamel')(data);
				const totalList = countList.map(item => ({
					time: item.time,
					value: item.totalCount + entryHeadCount
				}));
				const regularList = countList.map(item => ({
					time: item.time,
					value: item.regularCount
				}));
				const strangerList = countList.map(item => ({
					time: item.time,
					value: item.strangerCount
				}));
				console.log('===历史客流， 总人数===', totalList);
				console.log('===历史客流， 熟客人数===', regularList);
				console.log('===历史客流， 生客人数===', strangerList);
			}
		},
		// 客群平均到店频次
		*getFrequencyWithAgeAndGender(_, { call, select }) {
			const {
				passengerFlowSearchValue: rangeType,
			} = yield select(state => state.databoard);
			const opt = {
				type: queryRangeType(rangeType),
			};
			const response = yield call(
				handlePassengerFlowManagement,
				'statistic/history/getFrequencyWithAgeAndGender',
				format('toSnake')(opt)
			);
			if (response && response.code === ERROR_OK) {
				const { data = {} } = response;
				const { frequencyList = [] } = format('toCamel')(data);
				console.log('===到店频次===', frequencyList);
			}
		},

		// 主力客群画像
		*getHistoryByGender(_, { call, select }) {
			const {
				passengerFlowSearchValue: rangeType
			} = yield select(state => state.databoard);
			const opt = {
				type: queryRangeType(rangeType),
			};
			const response = yield call(
				handlePassengerFlowManagement,
				'statistic/age/getHistoryByGender',
				format('toSnake')(opt)
			);
			if (response && response.code === ERROR_OK) {
				const { data = {} } = response;
				const { countList = [] } = format('toCamel')(data);
				const totalCount = countList.reduce((prev, cur) => {
					const { maleCount = 0, femaleCount = 0 } = cur;
					return prev + maleCount + femaleCount;
				}, 0);
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
							rushHour: maleRushHour,
							regularCount: maleRegularCount,
							uniqCount: maleUniqCount,
							passengerRate: totalCount ? Math.round((maleCount / totalCount) * 100) : 0,
							regularRate: maleCount ? Math.round((maleRegularCount / maleCount) * 100) : 0,
							frequency: maleUniqCount ? Math.round((maleCount / maleUniqCount) * 10) / 10 : 0,
							gender: GENDER.MALE,
						}, {
							ageRangeCode,
							count: femaleCount,
							rushHour: femaleRushHour,
							regularCount: femaleRegularCount,
							uniqCount: femaleUniqCount,
							passengerRate: totalCount ? Math.round((femaleCount / totalCount) * 100) : 0,
							regularRate: femaleCount ? Math.round((femaleRegularCount / femaleCount) * 100) : 0,
							frequency: femaleUniqCount ? Math.round(femaleCount / femaleUniqCount * 10) / 10 : 0,
							gender: GENDER.FEMALE,
						}]);
					}, []).sort((a, b) => b.count - a.count);
				console.log('====', targetList);
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
