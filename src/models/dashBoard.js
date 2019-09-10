import moment from 'moment';
import { shake, format, map } from '@konata9/milk-shake';
import * as Action from '@/services/dashBoard';
import { getRange } from '@/pages/IPC/services/photoLibrary';
import { ERROR_OK } from '@/constants/errorCode';
import { getDeviceList } from '@/pages/IPC/services/IPCList';

import { DASHBOARD } from '@/pages/DashBoard/constants';

const {
	QUERY_TYPE,
	SEARCH_TYPE: { RANGE, TRADE_TIME, PAYMENT_TYPE, PASSENGER_FLOW_TYPE },
	TIME_INTERVAL,
	PURCHASE_ORDER,
} = DASHBOARD;

const stateFields = {
	[QUERY_TYPE.TOTAL_AMOUNT]: 'totalAmount',
	[QUERY_TYPE.TOTAL_COUNT]: 'totalCount',
	[QUERY_TYPE.TOTAL_REFUND]: 'totalRefund',
	[QUERY_TYPE.AVG_UNIT]: 'avgUnitSale',
};

const queryRangeType = {
	[RANGE.TODAY]: 1,
	[RANGE.WEEK]: 2,
	[RANGE.MONTH]: 3,
};

export const getQueryDate = rangeType => {
	const range = {
		[RANGE.TODAY]: 'day',
		[RANGE.WEEK]: 'week',
		[RANGE.MONTH]: 'month',
	};

	return [
		moment()
			.startOf(range[rangeType])
			.unix(),
		moment()
			.endOf(range[rangeType])
			.unix(),
	];
};

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

const fullfuillSKURankList = (rankList = []) => {
	const len = rankList.length;
	const fullfillLen = 10 - len;

	if (fullfillLen > 0) {
		const filledList = [...rankList];
		for (let i = 0; i < fullfillLen; i++) {
			filledList.push({ name: '--', quantity: '--' });
		}
		return filledList;
	}
	return rankList;
};

const sortPurchaseOrder = purchaseInfo => {
	const { purchaseTypeList = [] } = purchaseInfo;
	const orderedList = [];

	PURCHASE_ORDER.forEach(type => {
		orderedList.push(purchaseTypeList.find(info => info.purchaseTypeName === type));
	});

	return {
		...purchaseInfo,
		purchaseTypeList: orderedList,
	};
};

const getGenderCount = targetList =>
	targetList.reduce(
		(prev, cur) => {
			const { femaleCount = 0, maleCount = 0 } = cur || {};
			const { femaleCount: prevFemaleCount = 0, maleCount: prevMaleCount = 0 } = prev || {};
			return {
				maleCount: maleCount + prevMaleCount,
				femaleCount: femaleCount + prevFemaleCount,
			};
		},
		{ maleCount: 0, femaleCount: 0 }
	);

const getGenderFieldsList = targetList => {
	const maleList = targetList.map(item => {
		const { ageRange, ageRangeCode, maleCount } = item;
		return {
			ageRange,
			ageRangeCode,
			personCount: maleCount,
			maleCount,
		};
	});

	const femaleList = targetList.map(item => {
		const { ageRange, ageRangeCode, femaleCount } = item;
		return {
			ageRange,
			ageRangeCode,
			personCount: femaleCount,
			femaleCount,
		};
	});

	return {
		maleList,
		femaleList,
	};
};

const formatTime = (time, rangeType, timeRangeStart, timeRangeEnd) => {
	if (rangeType === RANGE.TODAY) {
		return parseInt(time, 10) - 1;
	}

	if (rangeType === RANGE.WEEK || rangeType === RANGE.MONTH) {
		return time;
	}

	if (rangeType === RANGE.FREE) {
		if (moment(timeRangeStart).isSame(timeRangeEnd, 'day')) {
			return parseInt(time, 10) - 1;
		}

		return moment(timeRangeStart)
			.add(time - 1, 'day')
			.format('MM/DD');
	}

	return time;
};

const getRegularCount = targetList =>
	targetList.reduce(
		(prev, cur) => {
			const { strangerCount = 0, regularCount = 0 } = cur || {};
			const { strangerCount: prevStrangerCount = 0, regularCount: prevRegularCount = 0 } =
				prev || {};
			return {
				strangerCount: strangerCount + prevStrangerCount,
				regularCount: regularCount + prevRegularCount,
			};
		},
		{ strangerCount: 0, regularCount: 0 }
	);

const getRegularFiledsList = targetList => {
	const strangerList = targetList.map(item => {
		const { ageRange, ageRangeCode, strangerCount } = item;
		return {
			ageRange,
			ageRangeCode,
			personCount: strangerCount,
			strangerCount,
		};
	});

	const regularList = targetList.map(item => {
		const { ageRange, ageRangeCode, regularCount } = item;
		return {
			ageRange,
			ageRangeCode,
			personCount: regularCount,
			regularCount,
		};
	});

	return {
		strangerList,
		regularList,
	};
};

export default {
	namespace: 'dashboard',
	state: {
		searchValue: {
			rangeType: RANGE.TODAY,
			startQueryTime: moment()
				.startOf('day')
				.unix(),
			endQueryTime: moment()
				.endOf('day')
				.unix(),
			timeRangeStart: null,
			timeRangeEnd: null,
			tradeTime: TRADE_TIME.AMOUNT,
			paymentType: PAYMENT_TYPE.AMOUNT,
			passengerFlowType: PASSENGER_FLOW_TYPE.GENDER,
		},

		ageRangeList: [],
		ageRangeMap: {},

		overviewProductLoading: true,
		overviewDeviceLoading: true,
		overviewIPCLoading: true,
		overviewNetworkLoading: true,

		totalAmountLoading: true,
		totalCountLoading: true,
		totalRefundLoading: true,
		avgUnitLoading: true,

		passengerFlowLoading: true,
		passengerOrderLoading: true,
		passengerFlowTypeLoading: true,

		barLoading: false,
		skuLoading: false,
		chartLoading: false,

		lastModifyTime: moment().format('YYYY-MM-DD HH:mm:ss'),

		productOverview: {},
		deviceOverView: {},
		ipcOverView: {},
		networkOverview: {},

		totalAmount: {},
		totalCount: {},
		totalRefund: {},
		avgUnitSale: {},
		orderList: [],
		skuRankList: [],
		purchaseInfo: {},

		passengerFlow: {},
		passengerAgeInfo: {},
		passengerOrderList: [],
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

		*getAgeRanges(_, { call, put }) {
			const response = yield call(getRange);
			if (response && response.code === ERROR_OK) {
				const { data = {} } = response;
				const { ageRangeList = [] } = format('toCamel')(data);

				const ageRangeMap = ageRangeList.reduce((prev, cur) => {
					const { ageRange, ageRangeCode } = cur;
					return {
						...prev,
						[ageRangeCode]: ageRange,
					};
				}, {});

				yield put({
					type: 'updateState',
					payload: {
						ageRangeList,
						ageRangeMap,
					},
				});
			}
			return response;
		},

		*fetchAllData({ payload }, { all, put }) {
			const { needLoading = false } = payload;
			yield all([
				// product overview
				// put({
				// 	type: 'fetchOverviewProduct',
				// 	payload: { needLoading },
				// }),

				// device overview
				put({
					type: 'fetchOverviewDevices',
					payload: { needLoading },
				}),

				// network overviw
				put({
					type: 'fetchOverviewNetwork',
					payload: { needLoading },
				}),

				// ipc overview
				put({
					type: 'fetchOverviewIPC',
					payload: { needLoading },
				}),

				// total card
				put({
					type: 'fetchTotalInfo',
					payload: {
						queryType: QUERY_TYPE.TOTAL_AMOUNT,
						needLoading,
						loadingType: 'totalAmountLoading',
					},
				}),
				put({
					type: 'fetchTotalInfo',
					payload: {
						queryType: QUERY_TYPE.TOTAL_COUNT,
						needLoading,
						loadingType: 'totalCountLoading',
					},
				}),

				// 进店客流
				put({
					type: 'fetchPassengerFlowByTimeRange',
					payload: {
						needLoading,
						loadingType: 'passengerFlowLoading',
					},
				}),

				// 转化率趋势
				put({
					type: 'fetchPassengerOrderByTimeRange',
					payload: {
						needLoading,
						loadingType: 'passengerOrderLoading',
					},
				}),

				// 客群年龄分布
				put({
					type: 'fetchPassengerAgeByTimeRange',
					payload: {
						needLoading,
						loadingType: 'passengerFlowTypeLoading',
					},
				}),

				// put({
				// 	type: 'fetchTotalInfo',
				// 	payload: {
				// 		queryType: QUERY_TYPE.TOTAL_REFUND,
				// 		needLoading,
				// 		loadingType: 'totalRefundLoading',
				// 	},
				// }),
				// put({
				// 	type: 'fetchTotalInfo',
				// 	payload: {
				// 		queryType: QUERY_TYPE.AVG_UNIT,
				// 		needLoading,
				// 		loadingType: 'avgUnitLoading',
				// 	},
				// }),
				// time duration
				// put({
				// 	type: 'fetchTimeDistribution',
				// 	payload: { needLoading },
				// }),
				// sku rank
				// put({
				// 	type: 'fetchSKURankList',
				// 	payload: { needLoading },
				// }),
				// payment
				// put({
				// 	type: 'fetchPurchaseTypeStatistics',
				// 	payload: { needLoading },
				// }),
			]);

			yield put({
				type: 'updateState',
				payload: {
					lastModifyTime: moment().format('YYYY-MM-DD HH:mm:ss'),
				},
			});
		},

		*fetchOverviewProduct({ payload }, { put }) {
			const { needLoading } = payload;
			if (needLoading) {
				yield put({
					type: 'switchLoading',
					payload: {
						loadingType: 'overviewProductLoading',
						loadingStatus: true,
					},
				});
			}

			const response = yield put.resolve({
				type: 'basicDataProduct/fetchProductOverview',
			});
			if (response && response.code === ERROR_OK) {
				const { data = {} } = response;
				yield put({
					type: 'updateState',
					payload: {
						productOverview: format('toCamel')(data),
						overviewProductLoading: false,
					},
				});
			}

			return response;
		},

		*fetchOverviewDevices({ payload }, { put }) {
			const { needLoading } = payload;
			if (needLoading) {
				yield put({
					type: 'switchLoading',
					payload: {
						loadingType: 'overviewDeviceLoading',
						loadingStatus: true,
					},
				});
			}

			const response = yield put.resolve({
				type: 'eslElectricLabel/fetchDeviceOverview',
			});
			if (response && response.code === ERROR_OK) {
				const { data = {} } = response;
				yield put({
					type: 'updateState',
					payload: {
						deviceOverView: format('toCamel')(data),
						overviewDeviceLoading: false,
					},
				});
			}

			return response;
		},

		*fetchOverviewNetwork({ payload }, { put }) {
			const { needLoading } = payload;
			if (needLoading) {
				yield put({
					type: 'switchLoading',
					payload: {
						loadingType: 'overviewNetworkLoading',
						loadingStatus: true,
					},
				});
			}

			const response = yield put.resolve({
				type: 'network/getOverview',
			});
			if (response && response.code === ERROR_OK) {
				const { data = {} } = response;
				yield put({
					type: 'updateState',
					payload: {
						networkOverview: format('toCamel')(data),
						overviewNetworkLoading: false,
					},
				});
			}
		},

		*fetchOverviewIPC({ payload }, { call, put }) {
			const { needLoading } = payload;
			if (needLoading) {
				yield put({
					type: 'switchLoading',
					payload: {
						loadingType: 'overviewIPCLoading',
						loadingStatus: true,
					},
				});
			}

			const response = yield call(getDeviceList);

			if (response && response.code === ERROR_OK) {
				const { data = {} } = response;
				let [onLineCount, offLineCount] = [0, 0];

				data.forEach(ipc => {
					const { isOnline = false } = ipc;
					if (isOnline) {
						onLineCount++;
					} else {
						offLineCount++;
					}
				});

				yield put({
					type: 'updateState',
					payload: {
						ipcOverView: { onLineCount, offLineCount },
						overviewIPCLoading: false,
					},
				});
			}
		},

		*fetchPassengerOrderByTimeRange({ payload }, { select, put }) {
			const {
				searchValue,
				searchValue: { rangeType, timeRangeStart, timeRangeEnd },
			} = yield select(state => state.dashboard);
			const [startTime, endTime] = getQueryTimeRange(searchValue);

			const { needLoading } = payload;
			if (needLoading) {
				yield put({
					type: 'switchLoading',
					payload: {
						loadingType: 'passengerOrderLoading',
						loadingStatus: true,
					},
				});
			}

			let response = null;
			if (rangeType === RANGE.FREE) {
				response = yield put.resolve({
					type: 'passengerFlow/getPassengerFlowOrderByRange',
					payload: {
						startTime: moment.unix(startTime).format('YYYY-MM-DD'),
						endTime: moment.unix(endTime).format('YYYY-MM-DD'),
					},
				});
			} else {
				response = yield put.resolve({
					type: 'passengerFlow/getPassengerFlowOrderLatest',
					payload: {
						type: queryRangeType[rangeType],
					},
				});
			}

			if (response && response.code === ERROR_OK) {
				const { data = {} } = response;
				const { countList = [] } = format('toCamel')(data);

				const formattedList = countList.map(item => {
					const { orderCount = 0, passengerFlowCount = 0, time } = item;
					return {
						...item,
						time: formatTime(time, rangeType, timeRangeStart, timeRangeEnd),
						passengerFlowRate:
							passengerFlowCount === 0
								? 0
								: parseInt((orderCount / passengerFlowCount) * 100, 10),
					};
				});

				yield put({
					type: 'updateState',
					payload: {
						passengerOrderList: formattedList,
						passengerOrderLoading: false,
					},
				});
			}
		},

		*fetchPassengerFlowByTimeRange({ payload }, { select, put }) {
			const {
				searchValue,
				searchValue: { rangeType },
			} = yield select(state => state.dashboard);
			const [startTime, endTime] = getQueryTimeRange(searchValue);

			const { needLoading } = payload;
			if (needLoading) {
				yield put({
					type: 'switchLoading',
					payload: {
						loadingType: 'passengerFlowLoading',
						loadingStatus: true,
					},
				});
			}

			let response = null;
			if (rangeType === RANGE.FREE) {
				response = yield put.resolve({
					type: 'passengerFlow/getPassengerFlow',
					payload: {
						startTime: moment.unix(startTime).format('YYYY-MM-DD'),
						endTime: moment.unix(endTime).format('YYYY-MM-DD'),
					},
				});
			} else {
				response = yield put.resolve({
					type: 'passengerFlow/getPassengerFlowLatest',
					payload: {
						type: queryRangeType[rangeType],
					},
				});
			}

			if (response && response.code === ERROR_OK) {
				const { data = {} } = response;
				yield put({
					type: 'updateState',
					payload: {
						passengerFlow: format('toCamel')(data),
						passengerFlowLoading: false,
					},
				});
			}
		},

		*fetchPassengerAgeByTimeRange({ payload }, { select, put }) {
			const {
				searchValue,
				searchValue: { passengerFlowType },
				ageRangeMap,
			} = yield select(state => state.dashboard);
			const [startTime, endTime] = getQueryTimeRange(searchValue);

			const { needLoading } = payload;
			if (needLoading) {
				yield put({
					type: 'switchLoading',
					payload: {
						loadingType: 'passengerFlowTypeLoading',
						loadingStatus: true,
					},
				});
			}

			const response = yield put.resolve({
				type: 'passengerFlow/getPassengerAge',
				payload: {
					startTime: moment.unix(startTime).format('YYYY-MM-DD'),
					endTime: moment.unix(endTime).format('YYYY-MM-DD'),
					type: passengerFlowType,
				},
			});

			if (response && response.code === ERROR_OK) {
				const { data = {} } = response;
				const { countList = [] } = format('toCamel')(data) || {};

				const formattedList = countList
					.map(item => {
						const { ageRangeCode } = item;
						return {
							...item,
							ageRange: ageRangeMap[ageRangeCode] || '',
						};
					})
					.sort((a, b) => a.ageRangeCode - b.ageRangeCode);

				if (passengerFlowType === PASSENGER_FLOW_TYPE.GENDER) {
					const genderCount = getGenderCount(formattedList);
					const { maleList, femaleList } = getGenderFieldsList(formattedList);

					yield put({
						type: 'updateState',
						payload: {
							passengerAgeInfo: {
								passengerList: [...maleList, ...femaleList] || [],
								...genderCount,
							},
							passengerFlowTypeLoading: false,
						},
					});
				} else {
					const regularCount = getRegularCount(formattedList);
					const { strangerList, regularList } = getRegularFiledsList(formattedList);

					yield put({
						type: 'updateState',
						payload: {
							passengerAgeInfo: {
								passengerList: [...strangerList, ...regularList] || [],
								...regularCount,
							},
							passengerFlowTypeLoading: false,
						},
					});
				}
			}
		},

		*fetchTotalInfo({ payload }, { select, call, put }) {
			const {
				searchValue,
				searchValue: { rangeType },
			} = yield select(state => state.dashboard);
			const [startTime, endTime] = getQueryTimeRange(searchValue);

			const { queryType = null, needLoading, loadingType } = payload;
			const stateField = stateFields[queryType];
			const options = {
				rateRequired: rangeType === RANGE.FREE ? 0 : 1,
				timeRangeStart: startTime,
				timeRangeEnd: endTime,
			};

			if (needLoading) {
				yield put({
					type: 'switchLoading',
					payload: {
						loadingType,
						loadingStatus: true,
					},
				});
			}

			const response = yield call(
				Action.handleDashBoard,
				queryType,
				format('toSnake')(options)
			);

			if (response && response.code === ERROR_OK) {
				const { data = {} } = response;
				yield put({
					type: 'updateState',
					payload: {
						[stateField]: format('toCamel')(data),
						[loadingType]: false,
					},
				});
			}

			return response;
		},

		*fetchSKURankList({ payload }, { select, put, call }) {
			const { searchValue } = yield select(state => state.dashboard);
			const [startTime, endTime] = getQueryTimeRange(searchValue);

			const options = {
				timeRangeStart: startTime,
				timeRangeEnd: endTime,
			};

			const { needLoading } = payload;
			if (needLoading) {
				yield put({
					type: 'switchLoading',
					payload: {
						loadingType: 'skuLoading',
						loadingStatus: true,
					},
				});
			}

			const response = yield call(
				Action.handleDashBoard,
				'getQuantityRank',
				format('toSnake')(options)
			);

			if (response && response.code === ERROR_OK) {
				const { data = {} } = response;
				const { quantityRank = [] } = format('toCamel')(data);
				yield put({
					type: 'updateState',
					payload: { skuRankList: fullfuillSKURankList(quantityRank) },
				});
			}

			yield put({
				type: 'switchLoading',
				payload: {
					loadingType: 'skuLoading',
					loadingStatus: false,
				},
			});

			return response;
		},

		*fetchTimeDistribution({ payload }, { select, put, call }) {
			const {
				searchValue,
				searchValue: { rangeType },
			} = yield select(state => state.dashboard);
			const [startTime, endTime] = getQueryTimeRange(searchValue);

			const options = {
				startTime,
				endTime,
				timeInterval: rangeType === RANGE.TODAY ? TIME_INTERVAL.HOUR : TIME_INTERVAL.DAY,
			};

			const { needLoading } = payload;
			if (needLoading) {
				yield put({
					type: 'switchLoading',
					payload: {
						loadingType: 'barLoading',
						loadingStatus: true,
					},
				});
			}

			const response = yield call(
				Action.handleDashBoard,
				'getTimeDistribution',
				format('toSnake')(options)
			);

			if (response && response.code === ERROR_OK) {
				const { data = {} } = response;
				const { orderList } = format('toCamel')(data);
				yield put({
					type: 'updateState',
					payload: { orderList },
				});
			}

			yield put({
				type: 'switchLoading',
				payload: {
					loadingType: 'barLoading',
					loadingStatus: false,
				},
			});
		},

		*fetchPurchaseTypeStatistics({ payload }, { select, put, call }) {
			const {
				searchValue,
				searchValue: { rangeType },
			} = yield select(state => state.dashboard);
			const [startTime, endTime] = getQueryTimeRange(searchValue);

			const options = {
				startTime,
				endTime,
				timeInterval: rangeType === RANGE.TODAY ? TIME_INTERVAL.HOUR : TIME_INTERVAL.DAY,
			};

			const { needLoading } = payload;
			if (needLoading) {
				yield put({
					type: 'switchLoading',
					payload: {
						loadingType: 'chartLoading',
						loadingStatus: true,
					},
				});
			}

			const response = yield call(
				Action.handleDashBoard,
				'getPurchaseTypeStatistics',
				format('toSnake')(options)
			);

			if (response && response.code === ERROR_OK) {
				const { data = {} } = response;

				const formattedData = shake(data)(
					format('toCamel'),
					map([
						{
							from: 'purchaseTypeList',
							to: 'purchaseTypeList',
							rule: (list, params) => {
								const { totalAmount, totalCount } = params;
								return list.map(item => ({
									...item,
									amountPercent: parseFloat(
										Math.abs(item.amount / (totalAmount || 1)) * 100
									).toFixed(2),
									countPercent: parseFloat(
										Math.abs(item.count / (totalCount || 1)) * 100
									).toFixed(2),
								}));
							},
						},
					])
				);

				const sortedData = sortPurchaseOrder(formattedData);
				const { purchaseTypeList = [] } = sortedData;
				const total = purchaseTypeList.slice(0, 5).reduce((prev, cur) => ({
					amountPercent: parseFloat(
						1 * prev.amountPercent + 1 * cur.amountPercent
					).toFixed(2),
					countPercent: parseFloat(1 * prev.countPercent + 1 * cur.countPercent).toFixed(
						2
					),
				}));

				const [rest] = purchaseTypeList.slice(5);
				const { amount = 0, count = 0 } = rest;
				rest.amountPercent = amount
					? parseFloat(100 - 1 * total.amountPercent).toFixed(2)
					: parseFloat(amount).toFixed(2);

				rest.countPercent = count
					? parseFloat(100 - 1 * total.countPercent).toFixed(2)
					: parseFloat(count).toFixed(2);

				sortedData.purchaseTypeList = [...purchaseTypeList.slice(0, 5), rest];

				yield put({
					type: 'updateState',
					payload: {
						purchaseInfo: sortedData,
						chartLoading: false,
					},
				});
			}
		},

		*setSearchValue({ payload }, { select, put }) {
			const { searchValue } = yield select(state => state.dashboard);
			yield put({
				type: 'updateState',
				payload: {
					searchValue: {
						...searchValue,
						...payload,
					},
				},
			});
		},

		*clearSearch(_, { put }) {
			yield put({
				type: 'updateState',
				payload: {
					searchValue: {
						rangeType: RANGE.TODAY,
						timeRangeStart: null,
						timeRangeEnd: null,
						startQueryTime: moment()
							.startOf('day')
							.unix(),
						endQueryTime: moment()
							.endOf('day')
							.unix(),
						tradeTime: TRADE_TIME.AMOUNT,
						paymentType: PAYMENT_TYPE.AMOUNT,
					},
				},
			});
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
