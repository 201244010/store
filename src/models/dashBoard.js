import * as Action from '@/services/dashBoard';
import moment from 'moment';
import { ERROR_OK } from '@/constants/errorCode';
import { shake, format, map } from '@konata9/milk-shake';
import { getDeviceList } from '@/pages/IPC/services/IPCList';

import { DASHBOARD } from '@/pages/DashBoard/constants';

const {
	QUERY_TYPE,
	SEARCH_TYPE: { RANGE, TRADE_TIME, PAYMENT_TYPE },
	TIME_INTERVAL,
	PURCHASE_ORDER,
} = DASHBOARD;

const stateFields = {
	[QUERY_TYPE.TOTAL_AMOUNT]: 'totalAmount',
	[QUERY_TYPE.TOTAL_COUNT]: 'totalCount',
	[QUERY_TYPE.TOTAL_REFUND]: 'totalRefund',
	[QUERY_TYPE.AVG_UNIT]: 'avgUnitSale',
};

const getQueryDate = rangeType => {
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

export default {
	namespace: 'dashBoard',
	state: {
		searchValue: {
			rangeType: RANGE.TODAY,
			timeRangeStart: null,
			timeRangeEnd: null,
			tradeTime: TRADE_TIME.AMOUNT,
			paymentType: PAYMENT_TYPE.AMOUNT,
		},

		overviewProductLoading: false,
		overviewDeviceLoading: false,
		overviewIPCLoading: false,

		totalAmountLoading: false,
		totalCountLoading: false,
		totalRefundLoading: false,
		avgUnitLoading: false,

		barLoading: false,
		skuLoading: false,
		chartLoading: false,

		lastModifyTime: moment().format('YYYY-MM-DD HH:mm:ss'),

		productOverview: {},
		deviceOverView: {},
		ipcOverView: {},

		totalAmount: {},
		totalCount: {},
		totalRefund: {},
		avgUnitSale: {},
		orderList: [],
		skuRankList: [],
		purchaseInfo: {},
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

		*fetchAllData({ payload }, { all, put }) {
			const { needLoading = false } = payload;
			yield all([
				// product overview
				put({
					type: 'fetchOverviewProduct',
					payload: { needLoading },
				}),

				// device overview
				put({
					type: 'fetchOverviewDevices',
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
				put({
					type: 'fetchTotalInfo',
					payload: {
						queryType: QUERY_TYPE.TOTAL_REFUND,
						needLoading,
						loadingType: 'totalRefundLoading',
					},
				}),
				put({
					type: 'fetchTotalInfo',
					payload: {
						queryType: QUERY_TYPE.AVG_UNIT,
						needLoading,
						loadingType: 'avgUnitLoading',
					},
				}),
				// time duration
				put({
					type: 'fetchTimeDistribution',
					payload: { needLoading },
				}),
				// sku rank
				put({
					type: 'fetchSKURankList',
					payload: { needLoading },
				}),
				// payment
				put({
					type: 'fetchPurchaseTypeStatistics',
					payload: { needLoading },
				}),
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
						ipcOverView: {onLineCount, offLineCount},
						overviewIPCLoading: false,
					},
				});
			}
		},

		*fetchTotalInfo({ payload }, { select, call, put }) {
			const {
				searchValue,
				searchValue: { rangeType },
			} = yield select(state => state.dashBoard);
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
			const { searchValue } = yield select(state => state.dashBoard);
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
			} = yield select(state => state.dashBoard);
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
			} = yield select(state => state.dashBoard);
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
			const { searchValue } = yield select(state => state.dashBoard);
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
