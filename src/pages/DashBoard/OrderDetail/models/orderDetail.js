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
				timeRangeStart: time_range_start = 946656000,
				timeRangeEnd: time_range_end = 4102444800,
				sortByAmount: sort_by_amount = -1,
				sortByTime: sort_by_time = -1,
				purchaseTypeList: purchase_type_list = [],
				orderTypeList: order_type_list = [],
				pageNum: page_num = 1,
				pageSize: page_size = 10,
			} = options;


			const opt = {
				time_range_start,
				time_range_end,
				sort_by_amount,
				sort_by_time,
				purchase_type_list,
				order_type_list,
				page_num,
				page_size
			};

			const response = yield call(Actions.getList, opt);
			// console.log('redux res:', response);
			if (response && response.code === ERROR_OK) {
				const result = response.data || {};

				const orderList = result.order_list || [];
				const total = result.total_count;

				yield put({
					type: 'updateState',
					payload: {
						orderList,
						total,
					},
				});
			}
		},

		*addDetailList({ payload }, { put, call, select }) {
			const { orderId } = payload;
			const response = yield call(Actions.getDetailList, { order_id: orderId });
			if (response && response.code === ERROR_OK) {
				const result = response.data || {};
				const detailList = result.detail_list || [];

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
		}
	},
};