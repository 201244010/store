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
	namespace: 'showInfo',
	state: {
		deviceOverView: {},
		ipcOverView: {},
		today: {
			searchValue: {
				rangeType: RANGE.TODAY,
			},

			totalAmount: {},
			totalCount: {},
			totalRefund: {},
			avgUnitSale: {},
			orderList: [],
			skuRankList: [],
			purchaseInfo: {},
		},
		week: {
			searchValue: {
				rangeType: RANGE.TODAY,
			},

			totalAmount: {},
			totalCount: {},
			totalRefund: {},
			avgUnitSale: {},
			orderList: [],
			skuRankList: [],
			purchaseInfo: {},
		},
		month: {
			searchValue: {
				rangeType: RANGE.TODAY,
			},

			totalAmount: {},
			totalCount: {},
			totalRefund: {},
			avgUnitSale: {},
			orderList: [],
			skuRankList: [],
			purchaseInfo: {},
		},
	},
	effects: {
		*fetchAllData({ payload }, { all, put }) {
			const { range, activeKey = 'all' } = payload;
			yield all([
				// device overview
				put({
					type: 'fetchOverviewDevices',
					payload: { range, activeKey },
				}),

				// ipc overview
				put({
					type: 'fetchOverviewIPC',
					payload: { range, activeKey },
				}),

				// total card
				put({
					type: 'fetchTotalInfo',
					payload: {
						queryType: QUERY_TYPE.TOTAL_AMOUNT,
						range,
						activeKey
					},
				}),
				put({
					type: 'fetchTotalInfo',
					payload: {
						queryType: QUERY_TYPE.TOTAL_COUNT,
						range,
						activeKey
					},
				}),
				put({
					type: 'fetchTotalInfo',
					payload: {
						queryType: QUERY_TYPE.TOTAL_REFUND,
						range,
						activeKey
					},
				}),
				put({
					type: 'fetchTotalInfo',
					payload: {
						queryType: QUERY_TYPE.AVG_UNIT,
						range,
						activeKey
					},
				}),
				// time duration
				put({
					type: 'fetchTimeDistribution',
					payload: { range, activeKey },
				}),
				// sku rank
				put({
					type: 'fetchSKURankList',
					payload: { range, activeKey },
				}),
				// payment
				put({
					type: 'fetchPurchaseTypeStatistics',
					payload: { range, activeKey },
				}),
			]);
		},

		*fetchOverviewDevices({ payload }, { put }) {
			const { range, activeKey } = payload;
			if (range !== activeKey && activeKey !== 'all') {
				return null;
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
						range,
					},
				});
			}

			return response;
		},

		*fetchOverviewIPC({ payload }, { call, put }) {
			const { range, activeKey } = payload;
			if (range !== activeKey && activeKey !== 'all') {
				return;
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
						range,
					},
				});
			}
		},

		*fetchTotalInfo({ payload }, { call, put }) {
			const { queryType = null, range, activeKey } = payload;
			if (range !== activeKey && activeKey !== 'all') {
				return null;
			}

			const [startTime, endTime] = getQueryTimeRange({ rangeType: range });
			const stateField = stateFields[queryType];
			const options = {
				rateRequired: range === RANGE.FREE ? 0 : 1,
				timeRangeStart: startTime,
				timeRangeEnd: endTime,
			};

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
						range,
					},
				});
			}

			return response;
		},

		*fetchSKURankList({ payload }, { put, call }) {
			const { range, activeKey } = payload;
			if (range !== activeKey && activeKey !== 'all') {
				return null;
			}

			const [startTime, endTime] = getQueryTimeRange({ rangeType: range });
			const options = {
				timeRangeStart: startTime,
				timeRangeEnd: endTime,
			};

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
					payload: { skuRankList: fullfuillSKURankList(quantityRank), range },
				});
			}
			return response;
		},

		*fetchTimeDistribution({ payload }, { put, call }) {
			const { range, activeKey } = payload;
			if (range !== activeKey && activeKey !== 'all') {
				return;
			}

			const [startTime, endTime] = getQueryTimeRange({ rangeType: range });

			const options = {
				startTime,
				endTime,
				timeInterval: range === RANGE.TODAY ? TIME_INTERVAL.HOUR : TIME_INTERVAL.DAY,
			};

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
					payload: { orderList, range },
				});
			}
		},

		*fetchPurchaseTypeStatistics({ payload }, { put, call }) {
			const { range, activeKey } = payload;
			if (range !== activeKey && activeKey !== 'all') {
				return;
			}

			const [startTime, endTime] = getQueryTimeRange({ rangeType: range });

			const options = {
				startTime,
				endTime,
				timeInterval: range === RANGE.TODAY ? TIME_INTERVAL.HOUR : TIME_INTERVAL.DAY,
			};

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
						range,
					},
				});
			}
		},

		*setSearchValue({ payload }, { select, put }) {
			const {range, activeKey} = payload;
			if (range !== activeKey && activeKey !== 'all') {
				return;
			}

			const { searchValue } = yield select(state => state.showInfo);
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
			const { payload: { range } = {} } = action;
			switch (range) {
				case 'today':
					return {
						...state,
						...action.payload,
						today: { ...state.today, ...action.payload },
					};
				case 'week':
					return {
						...state,
						...action.payload,
						week: { ...state.week, ...action.payload },
					};
				case 'month':
					return {
						...state,
						...action.payload,
						month: { ...state.month, ...action.payload },
					};
				default:
					return {
						...state,
					};
			}
		},
	},
};
