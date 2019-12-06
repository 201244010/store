import { format } from '@konata9/milk-shake';
import * as Actions from '@/services/trade';
import { ERROR_OK } from '@/constants/errorCode';

export default {
	namespace: 'trade',
	state: {
		purchaseType: {
			b2b: [],
			b2c: [],
		},
		payLink: {},
		orderDetail: {},
	},
	effects: {
		*getPurchaseType(_, { call, put }) {
			const response = yield call(Actions.handleTradeManagement, 'getPurchaseType');
			if (response && response.code === ERROR_OK) {
				const { data = {} } = response || {};
				const formattedData = format('toCamel')(data) || {};
				yield put({
					type: 'updateState',
					payload: {
						purchaseType: {
							b2b: formattedData.b2b.sort((a, b) => b.id - a.id) || [],
							b2c: formattedData.b2c.sort((a, b) => b.id - a.id) || [],
						},
					},
				});
			}
		},

		*payOrder({ payload }, { call, put }) {
			const { orderNo, purchaseType, source } = payload || {};
			const opts = { orderNo, purchaseType, source };
			const response = yield call(
				Actions.handleTradeManagement,
				'pay',
				format('toSnake')(opts)
			);

			if (response && response.code === ERROR_OK) {
				const { data = {} } = response || {};
				const { qrCodeUrl = '', unionPayForm = '' } = data;
				yield put({
					type: 'updateState',
					payload: { payLink: { qrCodeUrl, unionPayForm } },
				});
			}

			return response;
		},

		*getOrderDetail({ payload }, { call, put }) {
			const { orderNo } = payload || {};
			console.log(orderNo);
			const response = yield call(
				Actions.handleTradeManagement,
				'order/getInfo',
				format('toSnake')({ orderNo })
			);
			console.log(response);
			if (response && response.code === ERROR_OK) {
				const { data = {} } = response || {};
				yield put({
					type: 'updateState',
					payload: { orderDetail: format('toCamel')(data) || {}},
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
