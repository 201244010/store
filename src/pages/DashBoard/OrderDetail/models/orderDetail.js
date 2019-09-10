import * as Actions from '../services/payment';
import { ERROR_OK } from '@/constants/errorCode';

export default {
	namespance: 'orderDetail',
	state: {
		total: 0,
		orderList: [],
		detailList: [],
	},
	reducers: {
		updateState(state, { payload }) {
			return {
				...state,
				...payload,
			};
		},
	},
	effects: {
		*getList({ payload }, { put, call }) {
			const { options = {} } = payload;
			const {
				timeRangeStart = 946656000,
				timeRangeEnd = 4102444800,
				sortByAmount = -1,
				sortByTime = -1,
				purchaseTypeList = [],
				orderTypeList = [],
				pageNum = 1,
				pageSize = 10,
			} = options;

			const response = yield call(Actions.getList, {
				timeRangeStart,
				timeRangeEnd,
				sortByAmount,
				sortByTime,
				purchaseTypeList,
				orderTypeList,
				pageNum,
				pageSize,
			});

			if (response && response.code === ERROR_OK) {
				const result = response.data || {};
				const { orderList = [], totalCount } = result;

				yield put({
					type: 'updateState',
					payload: {
						orderList,
						total: totalCount,
					},
				});
			}
		},

		*addDetailList({ payload }, { put, call, select }) {
			const { orderId } = payload;
			const response = yield call(Actions.getDetailList, { order_id: orderId });
			if (response && response.code === ERROR_OK) {
				const result = response.data || {};
				const detailList = result.detailList || [];

				const orderList = yield select(state => state.orderDetail.orderList);
				orderList.forEach(order => {
					if (order.id === orderId) {
						order.detail = detailList;
					}
				});

				yield put({
					type: 'updateState',
					payload: {
						detailList,
						orderList,
					},
				});
			}
		},
	},
};
