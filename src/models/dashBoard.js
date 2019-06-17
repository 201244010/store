import * as Action from '@/services/dashBoard';
import moment from 'moment';
import { ERROR_OK } from '@/constants/errorCode';
import { format } from '@konata9/milk-shake';

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

		totalLoading: false,
		barLoading: false,
		skuLoading: false,
		chartLoading: false,

		lastModifyTime: moment().format('YYYY-MM-DD HH:mm:ss'),
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
				// total card
				put({
					type: 'fetchTotalInfo',
					payload: { queryType: QUERY_TYPE.TOTAL_AMOUNT, needLoading },
				}),
				put({
					type: 'fetchTotalInfo',
					payload: { queryType: QUERY_TYPE.TOTAL_COUNT, needLoading },
				}),
				put({
					type: 'fetchTotalInfo',
					payload: { queryType: QUERY_TYPE.TOTAL_REFUND, needLoading },
				}),
				put({
					type: 'fetchTotalInfo',
					payload: { queryType: QUERY_TYPE.AVG_UNIT, needLoading },
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

		*fetchTotalInfo({ payload }, { select, call, put }) {
			const {
				searchValue,
				searchValue: { rangeType },
			} = yield select(state => state.dashBoard);
			const [startTime, endTime] = getQueryTimeRange(searchValue);

			const { queryType = null, needLoading } = payload;
			const stateField = stateFields[queryType];
			const options = {
				rateRequired: rangeType === RANGE.FREE ? 1 : 0,
				timeRangeStart: startTime,
				timeRangeEnd: endTime,
			};

			if (needLoading) {
				yield put({
					type: 'switchLoading',
					payload: {
						loadingType: 'totalLoading',
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
					payload: { [stateField]: format('toCamel')(data) },
				});
			}

			yield put({
				type: 'switchLoading',
				payload: {
					loadingType: 'totalLoading',
					loadingStatus: false,
				},
			});

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

				yield put({
					type: 'updateState',
					payload: { purchaseInfo: sortPurchaseOrder(format('toCamel')(data)) },
				});
			}

			yield put({
				type: 'switchLoading',
				payload: {
					loadingType: 'chartLoading',
					loadingStatus: false,
				},
			});
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
