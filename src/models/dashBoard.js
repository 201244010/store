import * as Action from '@/services/dashBoard';
import moment from 'moment';
import { ERROR_OK } from '@/constants/errorCode';
import { format } from '@konata9/milk-shake';

import { DASHBOARD } from '@/constants';

const {
	QUERY_TYPE,
	SEARCH_TYPE: { RANGE, TRADE_TIME, PAYMENT_TYPE },
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
		lastModifyTime: moment().format('YYYY-MM-DD HH:mm:ss'),
		totalAmount: {},
		totalCount: {},
		totalRefund: {},
		avgUnitSale: {},
	},
	effects: {
		*fetchAllData(_, { all, put }) {
			// TODO 全部查询
			yield all([
				put({
					type: 'fetchTotalInfo',
					payload: { queryType: QUERY_TYPE.TOTAL_AMOUNT },
				}),
				put({
					type: 'fetchTotalInfo',
					payload: { queryType: QUERY_TYPE.TOTAL_COUNT },
				}),
				put({
					type: 'fetchTotalInfo',
					payload: { queryType: QUERY_TYPE.TOTAL_REFUND },
				}),
				put({
					type: 'fetchTotalInfo',
					payload: { queryType: QUERY_TYPE.AVG_UNIT },
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
			const { searchValue } = yield select(state => state.dashBoard);
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

			const { queryType = null } = payload;
			const stateField = stateFields[queryType];
			const options = {
				rateRequired: rangeType === RANGE.FREE ? 1 : 0,
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
					payload: { [stateField]: format('toCamel')(data) },
				});
			}

			return response;
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
