import * as Action from '@/services/dashBoard';
import moment from 'moment';
import { ERROR_OK } from '@/constants/errorCode';
import { format } from '@konata9/milk-shake';

import { DASHBOARD } from '@/constants';

const {
	QUERY_TYPE,
	SEARCH_TYPE: { RANGE, TRADE_TIME, PAYMENT_TYPE },
} = DASHBOARD;

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
		lastModifyTime: moment().format('YYYY-MM-DD HH:MM:SS'),
		totalAmount: {},
		totalCount: {},
		totalRefund: {},
		avgUnitSale: {},
	},
	effects: {
		// *queryTotal(payload = {}, { call, put }) {
		// 	// TODO 全部查询
		// },

		*fetchTotalInfo(payload = {}, { call, put }) {
			const { queryType = null } = payload;
			const options = {
				rateRequired: 0,
				...payload,
			};

			const response = yield call(
				Action.handleDashBoard,
				QUERY_TYPE[queryType],
				format('toSnake')(options)
			);

			if (response && response.code === ERROR_OK) {
				const { data = {} } = response;
				yield put({
					type: 'updateState',
					payload: { [queryType]: format('toCamel')(data) },
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
