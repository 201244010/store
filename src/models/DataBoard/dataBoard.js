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
import { getShopSaasList, getShopDevices } from '@/services/checkDeviceNormal';
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
		// 进店率（实时）
		RTEnteringRate: {
			label: 'enteringRate',
			count: 0,
			earlyCount: 0,
			unit: 'percent'
		},
		// 进店客流（实时）
		RTPassengerCount: {
			label: 'passengerCount',
			count: 0,
			earlyCount: 0
		},
		RTDeviceCount: {
			label: 'deviceCount',
			count: 0,
			earlyCount: 0,
		}, // 总设备数（实时）
		RTPassengerFlowList: [], // 客流趋势（折线图-实时）
		// 日月周-总销售额-实时
		paymentTotalAmount: {
			[RANGE.TODAY]: {
				count: 0,
				earlyCount: 0,
				label: 'totalAmount',
			},
			[RANGE.WEEK]: {
				count: 0,
				earlyCount: 0,
				label: 'totalAmount',
			},
			[RANGE.MONTH]: {
				count: 0,
				earlyCount: 0,
				label: 'totalAmount',
			},
		},
		// 日月周-总销量-实时
		paymentTotalCount: {
			[RANGE.TODAY]: {
				count: 0,
				earlyCount: 0,
				label: 'totalCount',
			},
			[RANGE.WEEK]: {
				count: 0,
				earlyCount: 0,
				label: 'totalCount',
			},
			[RANGE.MONTH]: {
				count: 0,
				earlyCount: 0,
				label: 'totalCount',
			},
		},
		// 总交易转化率-实时
		transactionRate: {
			count: 0,
			earlyCount: 0,
			label: 'transactionRate',
			unit: 'percent'
		},
		// RTOverviewCard: [], // 顶部卡片-实时
		amountList: [], // 销售额分布-实时
		countList: [], // 销售量分布-实时
		transactionRateList: [], // 交易转化率分布-实时
		ageGenderList: [], // 性别年龄分布-实时
		regularList: [], // 生熟客分布-实时

		lastModifyTime: moment().format('YYYY-MM-DD HH:mm:ss'),

		RTPassLoading: true,
		RTDevicesLoading: true,
		totalAmountLoading: true,
		totalCountLoading: true,
		totalRateLoading: true,
		RTPassengerFlowLoading: true,
		transactionCountLoading: true,
		transactionRateLoading: true,
		regularDistriLoading: true,
		genderAndAgeLoading: true,

		passengerCount: {}, // 进店客流（客流）
		enteringRate: {}, // 进店率（客流）
		regularCount: {}, // 熟客人数 （客流）
		avgFrequency: {}, // 到店频次（客流）
		enteringList: [], // 进店率（折线图-客流）
		frequencyList: [], // 到店次数分布（柱状图-客流）
		frequencyTrend: [], // 到店频次趋势（折线图-客流）
		passengerFlowList: [], // 客流量分布-客流
		// 客群平均到店频次-客流
		customerDistri: {
			data: [],
			frequency: {},
		},
		majorList: [], // 主力客群卡片-客流
		passOverviewCard: [], // 顶部卡片-客流

		passengerLoading: true,
		passengerFlowLoading: true,
		enteringRateLoading: true,
		entryCountLoading: true,
		frequencyTrendLoading: true,
		passFrenquencyLoading: true,
		majorLoading: true,

		hasFS: true, // 当前company下是否有FS设备
		isSaasAuth: true, // 是否有saas授权
	},
	effects: {
		*switchLoading({ payload }, { put }) {
			const { loadingType, loadingStatus } = payload;
			yield put({
				type: 'updateState',
				payload: {
					[loadingType]: loadingStatus,
				},
			});
		},

		*fetchAllData({ payload = {} }, { put }) {
			const { type, searchValue } = payload;

			if (type === 1) {
				console.log('comin ');
				yield put({
					type: 'fetchRealTimeData',
					payload: {
						searchValue,
						type
					},
				});
				yield put({
					type: 'updateState',
					payload: {
						lastModifyTime: moment().format('YYYY-MM-DD HH:mm:ss'),
					}
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

		*fetchRealTimeData({ payload }, { all, put }) {
			yield all([
				put({
					type: 'fetchRealTimeCard',
					payload,
				}),
				put({
					type: 'getTimeDistribution',
					payload,
				}),
				put({
					type: 'getPassengerOrderLatest',
					payload,
				}),
				put({
					type: 'getPassengerByAgeGender',
					payload,
				}),
				put({
					type: 'getPassengerByRegular',
					payload,
				}),
				put({
					type: 'getPassengerFlow',
					payload,
				})
			]);
		},
		*fetchPassengerData({ payload }, { all, put, take }) {
			yield all([
				put({
					type: 'getPassengerHistoryTrend',
					payload,
				}),
				put({
					type: 'getFrequencyWithAgeAndGender',
					payload,
				}),
				put({
					type: 'getEnteringDistribution',
					payload,
				}),
				put({
					type: 'getFrequencyList',
					payload,
				}),
				put({
					type: 'getFrequencyDistribution',
					payload,
				}),
			]);
			yield put({
				type: 'fetchPassengerCard',
				payload,
			});
			yield take('fetchPassengerCard/@@end');
			yield put({
				type: 'getHistoryByGender',
				payload,
			});
		},

		*fetchRealTimeCard({ payload }, { put, all, take }) {
			yield all([
				put({
					type: 'getTotalAmount',
					payload,
				}),
				put({
					type: 'getDeviceCount',
					payload,
				})
			]);
			yield put({
				type: 'getPassengerData',
				payload,
			});
			yield take('getPassengerData/@@end');
			yield put({
				type: 'getTotalCount',
				payload,
			});
			yield take('getTotalCount/@@end');
			yield put({
				type: 'getTransactionRate',
				payload
			});
		},
		// 客流统计顶部卡片总览 OK
		*fetchPassengerCard({ payload }, { put, call }) {
			const {
				searchValue: { rangeType },
				needLoading
			} = payload;
			if(rangeType === RANGE.FREE || rangeType === RANGE.TODAY) return;
			const opt = {
				type: queryRangeType[rangeType],
			};
			if(needLoading) {
				yield put({
					type: 'switchLoading',
					payload: {
						loadingType: 'passengerLoading',
						loadingStatus: true,
					},
				});
			}
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
							compareRate: false,
							chainRate: true,
							unit: 'percent'
						},
						avgFrequency: {
							label: 'avgFrequency',
							count: latestAvgFrequecy,
							earlyCount: earlyAvgFrequecy,
							compareRate: true,
							unit: 'frequency'
						},
						passengerLoading: false,
					},
				});
			}
		},
		// 获取门店客流数 && 进店率 OK
		*getPassengerData({ payload = {} }, { call, put }) {
			const {
				type,
				searchValue,
				searchValue: { rangeType },
				needLoading
			} = payload;
			const [startTime, endTime] = getQueryTimeRange(searchValue);
			let response = {};
			let earlyResponse = {};
			let opt = {};
			if(needLoading) {
				yield put({
					type: 'switchLoading',
					payload: {
						loadingType: 'RTPassLoading',
						loadingStatus: true,
					},
				});
			}
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
				const lastestEntryRate = (totalLastestCount + latestPassCount) === 0 ? undefined : totalLastestCount / (totalLastestCount + latestPassCount);
				const earlyEntryRate = (totalEarlyCount + earlyPassCount) === 0 ? undefined : totalEarlyCount / (totalEarlyCount + earlyPassCount);
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
							RTPassLoading: false,
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
				searchValue: { rangeType },
				needLoading
			} = payload;
			if(needLoading) {
				yield put({
					type: 'switchLoading',
					payload: {
						loadingType: 'RTPassengerFlowLoading',
						loadingStatus: true,
					},
				});
			}
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
						RTPassengerFlowList,
						RTPassengerFlowLoading: false,
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
		*getDeviceCount({ payload = {} }, { call, put }) {
			const { needLoading } = payload;
			if(needLoading) {
				yield put({
					type: 'switchLoading',
					payload: {
						loadingType: 'RTDevicesLoading',
						loadingStatus: true,
					},
				});
			}
			const options = {
				source: 1,
			};
			const response = yield call(
				getDeviceOverview,
				options,
			);
			if(response && response.code === ERROR_OK) {
				const { data: { dataList = [] }} = response;
				const { onlineCount, offlineCount } = dataList[0];
				console.log('-------设备数-------');
				console.log({
					label: 'deviceCount',
					count: onlineCount + offlineCount,
					earlyCount: offlineCount,
				});
				yield put({
					type: 'updateState',
					payload: {
						RTDeviceCount: {
							label: 'deviceCount',
							count: onlineCount + offlineCount,
							earlyCount: onlineCount,
						},
						RTDevicesLoading: false,
					},
				});
			}
		},
		// 进店率分布 OK
		*getEnteringDistribution({ payload = {} }, { call, put }) {
			const {
				searchValue: { rangeType },
				needLoading
			} = payload;
			if(rangeType === RANGE.FREE || rangeType === RANGE.TODAY) return;
			if(needLoading) {
				yield put({
					type: 'switchLoading',
					payload: {
						loadingType: 'enteringRateLoading',
						loadingStatus: true,
					},
				});
			}
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
						enteringList,
						enteringRateLoading: false,
					},
				});
			}
		},
		// 到店次数分布 OK
		*getFrequencyList({ payload = {} }, { call, put }) {
			const {
				searchValue: { rangeType },
				needLoading
			} = payload;
			if(rangeType === RANGE.FREE || rangeType === RANGE.TODAY) return;
			if(needLoading) {
				yield put({
					type: 'switchLoading',
					payload: {
						loadingType: 'entryCountLoading',
						loadingStatus: true,
					},
				});
			}
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
						entryCountLoading: false,
					},
				});

			}
		},

		// 周（月）到店频次趋势
		*getFrequencyDistribution({ payload = {} }, { call, put }) {
			const {
				searchValue: { rangeType },
				needLoading
			} = payload;
			if(!(rangeType === RANGE.WEEK || rangeType === RANGE.MONTH)) {
				yield put({
					type: 'switchLoading',
					payload: {
						loadingType: 'frequencyTrendLoading',
						loadingStatus: false,
					},
				});
				return;
			};
			if(needLoading) {
				yield put({
					type: 'switchLoading',
					payload: {
						loadingType: 'frequencyTrendLoading',
						loadingStatus: true,
					},
				});
			}
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
					time: index + 1,
					// 柱状图 分母为0 显示 0
					value: item.uniqPassengerCount === 0 ? 0 : item.passengerCount / item.uniqPassengerCount,
					timeFormat: item.time,
				}));
				console.log('到店频次趋势:', frequencyList);

				yield put({
					type: 'updateState',
					payload: {
						frequencyTrend: frequencyList,
						frequencyTrendLoading: false,
					},
				});
			}
		},


		// 获取实时销售额
		*getTotalAmount({ payload = {} }, { call, put }) {
			const {
				searchValue,
				searchValue: { rangeType },
				needLoading
			} = payload;

			if(needLoading) {
				yield put({
					type: 'switchLoading',
					payload: {
						loadingType: 'totalAmountLoading',
						loadingStatus: true,
					},
				});
			}
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
						totalAmountLoading: false,
					},
				});
			}
		},
		// 获取实时交易量
		*getTotalCount({ payload = {} }, { call, put }) {
			const {
				searchValue,
				searchValue: { rangeType },
				needLoading
			} = payload;
			if(needLoading) {
				yield put({
					type: 'switchLoading',
					payload: {
						loadingType: 'totalCountLoading',
						loadingStatus: true,
					},
				});
			}
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
						totalCountLoading: false,
					},
				});
			}
		},
		// 计算总交易转化率
		*getTransactionRate({ payload = {} }, { put, select, /* take */ }) {
			const {
				RTPassengerCount,
				paymentTotalCount,
			} = yield select(state => state.databoard);
			const {
				searchValue: { rangeType },
				needLoading
			} = payload;
			if(needLoading) {
				yield put({
					type: 'switchLoading',
					payload: {
						loadingType: 'totalRateLoading',
						loadingStatus: true,
					},
				});
			}
			const { count: passCount, earlyCount: earlyPassengerCount } = RTPassengerCount;
			const { count: paymentCount, earlyCount: earlyPaymentCount } = paymentTotalCount[rangeType];
			const rate = passCount ? paymentCount / passCount : undefined;
			const earlyRate = earlyPassengerCount ? earlyPaymentCount / earlyPassengerCount : undefined;
			console.log('====总交易转化率===', RTPassengerCount, paymentTotalCount, rate, earlyRate);
			yield put({
				type: 'updateState',
				payload: {
					transactionRate: {
						count: rate > 1 ? 1 : rate,
						earlyCount: earlyRate > 1 ? 1 : earlyRate,
						label: 'transactionRate',
						unit: 'percent'
					},
					totalRateLoading: false,
				}
			});
		},
		// 获取交易分布（销售额和交易量按时间分布）
		*getTimeDistribution({ payload = {} }, { call, put }) {
			const {
				searchValue,
				searchValue: { rangeType },
				needLoading
			} = payload;
			if(needLoading) {
				yield put({
					type: 'switchLoading',
					payload: {
						loadingType: 'transactionCountLoading',
						loadingStatus: true,
					},
				});
			}
			const [startTime, endTime] = getQueryTimeRange(searchValue);
			console.log('======endTime====', endTime);
			const timeInterval = rangeTimeInterval[rangeType];
			const options = {
				startTime,
				endTime: moment().unix(),
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
						countList,
						transactionCountLoading: false,
					},
				});
			}
		},
		// 交易转化率分布 （客流量和交易量按时间分布）
		*getPassengerOrderLatest({ payload = {} }, { call, put }) {
			const {
				searchValue,
				searchValue: { rangeType },
				needLoading
			} = payload;
			let response = {};
			let opt = {};
			if(needLoading) {
				yield put({
					type: 'switchLoading',
					payload: {
						loadingType: 'transactionRateLoading',
						loadingStatus: true,
					},
				});
			}
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
				const transactionRateList = countList.map(item => {
					const { orderCount = 0, passengerFlowCount = 0, entryHeadCount = 0, time } = item;
					const totalPassenger = passengerFlowCount + entryHeadCount;
					const rate = totalPassenger ? orderCount / totalPassenger : 0;
					return {
						name: 'transactionRate',
						time,
						value: rate > 1 ? 1 : rate,
					};
				});
				console.log('交易转化率', transactionRateList);
				yield put({
					type: 'updateState',
					payload: {
						transactionRateList,
						transactionRateLoading: false,
					},
				});
			}

		},
		// 年龄性别分布实时客流数据
		*getPassengerByAgeGender({ payload = {} }, { call, put }) {
			const {
				searchValue,
				needLoading
			} = payload;
			if(needLoading) {
				yield put({
					type: 'switchLoading',
					payload: {
						loadingType: 'genderAndAgeLoading',
						loadingStatus: true,
					},
				});
			}
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
						ageGenderList: targetList,
						genderAndAgeLoading: false,
					}
				});
			}
		},
		// 生熟客分布实时客流数据
		*getPassengerByRegular({ payload = {} }, { call, put }) {
			const {
				searchValue,
				needLoading
			} = payload;
			if(needLoading) {
				yield put({
					type: 'switchLoading',
					payload: {
						loadingType: 'regularDistriLoading',
						loadingStatus: true,
					},
				});
			}
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
						}],
						regularDistriLoading: false,
					}
				});
			}
		},

		// 客流趋势
		*getPassengerHistoryTrend({ payload = {} }, { call, put }) {
			const {
				searchValue,
				searchValue: { rangeType },
				needLoading
			} = payload;
			if(needLoading) {
				yield put({
					type: 'switchLoading',
					payload: {
						loadingType: 'passengerFlowLoading',
						loadingStatus: true,
					},
				});
			}
			let response = {};
			let opt = {};
			if(rangeType === RANGE.FREE) {
				const [startTime, endTime] = getQueryTimeRange(searchValue);
				opt = {
					startTime: moment.unix(startTime).format('YYYY-MM-DD'),
					endTime: moment.unix(endTime).format('YYYY-MM-DD'),
					groupBy: groupBy[rangeType],
				};
				response = yield call(
					handlePassengerFlowManagement,
					'statistic/history/getListByTimeRange',
					format('toSnake')(opt)
				);
			} else {
				opt = {
					type: queryRangeType[rangeType],
					groupBy: groupBy[rangeType]
				};
				response = yield call(
					handlePassengerFlowManagement,
					'statistic/history/getList',
					format('toSnake')(opt)
				);
			}

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
						passengerFlowList,
						passengerFlowLoading: false,
					}
				});
			}
		},
		// 客群平均到店频次
		*getFrequencyWithAgeAndGender({ payload = {} }, { call, put }) {
			const {
				searchValue: { rangeType },
				needLoading
			} = payload;
			if(rangeType!== RANGE.YESTERDAY && rangeType !== RANGE.TODAY) {
				if(needLoading) {
					yield put({
						type: 'switchLoading',
						payload: {
							loadingType: 'passFrenquencyLoading',
							loadingStatus: true,
						},
					});
				}
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
					const femaleFrequency = femaleUniqPassenger ? femalePassenger / femaleUniqPassenger : undefined;
					const maleFrequency = maleUniqPassenger ? malePassenger / maleUniqPassenger : undefined;

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
							},
							passFrenquencyLoading: false,
						}
					});

				}
			} else {
				yield put({
					type: 'switchLoading',
					payload: {
						loadingType: 'passFrenquencyLoading',
						loadingStatus: false,
					},
				});
			}

		},

		// 主力客群画像
		*getHistoryByGender({ payload = {} }, { call, put, select }) {
			const {
				searchValue: { rangeType },
				needLoading
			} = payload;
			if(needLoading) {
				yield put({
					type: 'switchLoading',
					payload: {
						loadingType: 'majorLoading',
						loadingStatus: true,
					},
				});
			}
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
							totalPercent: totalCount ? maleCount / totalCount : undefined,
							regularPercent: maleCount ? maleRegularCount / maleCount : undefined,
							frequency: maleUniqCount ? maleCount / maleUniqCount : undefined,
							gender: GENDER.MALE,
						}, {
							ageRangeCode,
							count: femaleCount,
							hotTime: femaleRushHour,
							regularCount: femaleRegularCount,
							uniqCount: femaleUniqCount,
							totalPercent: totalCount ? femaleCount / totalCount : undefined,
							regularPercent: femaleCount ? femaleRegularCount / femaleCount : undefined,
							frequency: femaleUniqCount ? femaleCount / femaleUniqCount : undefined,
							gender: GENDER.FEMALE,
						}]);
					}, []).sort((a, b) => b.count - a.count);
				const majorList = targetList.slice(0, 3);
				console.log('====主力客群画像===', majorList);
				yield put({
					type: 'updateState',
					payload: {
						majorList,
						majorLoading: false,
					}
				});
			}
		},

		// 检查是否异常
		*checkIsNormal({ payload = {} }, { all, put }) {
			console.log('checkIsNormal');
			const { type } = payload;
			// 判断当前是总部还是单门店
			// 总部
			// if(type === 1) {
			// 	yield all([
			// 		put({
			// 			type: 'getCompanyDevices',
			// 		}),
			// 		put({
			// 			type: 'getCompanySaasList',
			// 		}),
			// 	]);
			// } else {
			// 	yield all([
			// 		put({
			// 			type: 'getCompanyDevices',
			// 		}),
			// 	]);
			// }

			// 单门店
			if(type === 1) {
				yield all([
					put({
						type: 'getShopDevices',
					}),
					put({
						type: 'getShopSaasList',
					}),
				]);
			} else {
				yield all([
					put({
						type: 'getShopDevices',
					}),
				]);
			}

		},
		// 总部视角获取设备列表
		// *getCompanyDevices(_, { call, put }) {
		// 	let hasFS = false;
		// 	const devicesResponse = yield call(
		// 		getCompanyDevices,
		// 		{}
		// 	);
		// 	console.log('getCompanyDevices devicesResponse=', devicesResponse);
		// 	if (devicesResponse && devicesResponse.code === ERROR_OK && devicesResponse.data) {
		// 		const { deviceList } = format('toCamel')(devicesResponse.data);
		// 		console.log('deviceList=', deviceList);
		// 		if (deviceList && deviceList.length > 0) {
		// 			deviceList.forEach(device => {
		// 				if (device.model === 'FM020') {
		// 					hasFS = true;
		// 				}
		// 			});
		// 		}
		// 		console.log('hasFS=', hasFS);
		// 	}
		// 	yield put({
		// 		type: 'updateState',
		// 		payload: {
		// 			hasFS,
		// 		}
		// 	});
		// 	return hasFS;
		// },
		// 单门店获取设备列表
		*getShopDevices(_, { call, put }) {
			let hasFS = false;
			const devicesResponse = yield call(
				getShopDevices,
				{}
			);
			console.log('getShopDevices devicesResponse=', devicesResponse);
			if (devicesResponse && devicesResponse.code === ERROR_OK && devicesResponse.data) {
				const { fsList: deviceList } = format('toCamel')(devicesResponse.data);
				console.log('deviceList=', deviceList);
				if (deviceList && deviceList.length > 0) {
					hasFS = true;
				}
			}
			console.log('hasFS=', hasFS);
			yield put({
				type: 'updateState',
				payload: {
					hasFS
				}
			});
			return hasFS;
		},
		// 总部视角获取saas授权列表
		// *getCompanySaasList(_, { call, put }) {
		// 	let isSaasImport = false;
		// 	const saasResponse = yield call(
		// 		getCompanySaasList,
		// 		{}
		// 	);
		// 	console.log('getCompanySaasList saasResponse=', saasResponse);

		// 	if (saasResponse && saasResponse.code === ERROR_OK && saasResponse.data) {
		// 		const { authorizedList } = format('toCamel')(saasResponse.data);
		// 		if (authorizedList && authorizedList.length > 0) {
		// 			authorizedList.forEach(item => {
		// 				if (item.importStatus === 2) {
		// 					isSaasImport = true;
		// 				}
		// 			});
		// 		}
		// 	}
		// 	console.log('isSaasImport=', isSaasImport);
		// 	yield put({
		// 		type: 'updateState',
		// 		payload: {
		// 			isSaasAuth: isSaasImport,
		// 		}
		// 	});
		// 	return isSaasImport;
		// },
		// 单门店获取saas授权列表
		*getShopSaasList(_, { call, put }) {
			let isSaasImport = false;
			const saasResponse = yield call(
				getShopSaasList,
				{}
			);
			console.log('getShopSaasList saasResponse=', saasResponse);

			if (saasResponse && saasResponse.code === ERROR_OK && saasResponse.data) {
				const { authorizedList } = format('toCamel')(saasResponse.data);
				if (authorizedList && authorizedList.length > 0) {
					authorizedList.forEach(item => {
						if (item.importStatus === 2) {
							isSaasImport = true;
						}
					});
				}
			}
			console.log('isSaasImport=', isSaasImport);
			yield put({
				type: 'updateState',
				payload: {
					isSaasAuth: isSaasImport,
				}
			});
			return isSaasImport;
		},
	},
	reducers: {
		updateState(state, action) {
			return {
				...state,
				...action.payload,
			};
		},
		resetCheckNormal(state) {
			return {
				...state,
				hasFS: true,
				isSaasAuth: true,
			};
		}
	},
};