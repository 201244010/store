import { format } from '@konata9/milk-shake';
import { message } from 'antd';
import { formatMessage } from 'umi/locale';
import moment from 'moment';
import * as Actions from '@/services/orderManagement';
import { ERROR_OK } from '@/constants/errorCode';

export default {
	namespace: 'orderManagement',
	state: {
		searchValue: {
			key: '',
			status: -1,
			date: [],
		},
		orderList: {
			totalCount: 0,
			list: [],
		},
		orderDetail: {},
	},
	effects: {
		*getOrderList({ payload }, { call, put, select }) {
			const {
				searchValue: { key, status, date },
			} = yield select(state => state.orderManagement);
			const options = { ...payload, status };

			if (date.length !== 0) {
				options.startTime = moment(date[0]).unix();
				options.startTime = moment
					.unix(options.startTime)
					.startOf('day')
					.unix();
				options.endTime = moment(date[1]).unix();
				options.endTime = moment
					.unix(options.endTime)
					.endOf('day')
					.unix();
			}

			if (key !== '' && key !== undefined) {
				options.keyword = key;
			}

			const response = yield call(Actions.getOrderList, { ...options });
			if (response && response.code === ERROR_OK) {
				const { data } = format('toCamel')(response);
				const { orderList, totalCount } = data;
				yield put({
					type: 'updateState',
					payload: {
						orderList: {
							totalCount,
							list: orderList,
						},
					},
				});
			} else {
				message.error(formatMessage({ id: 'orderManagement.list.error' }));
			}
		},
		*getOrderDetail({ payload }, { call, put }) {
			const { orderNo } = payload;
			const response = yield call(Actions.getOrderDetail, { order_no: orderNo });

			if (response && response.code === ERROR_OK) {
				const { data } = format('toCamel')(response);
				yield put({
					type: 'updateState',
					payload: {
						orderDetail: data
					},
				});
				return data;
			}
			message.error(formatMessage({ id: 'orderManagement.detail.error' }));
			return {};
		},
		*cancelOrder({ payload }, { call }) {
			const { orderNo } = payload;
			const response = yield call(Actions.cancelOrder, { order_no: orderNo });

			if (response && response.code === ERROR_OK) {
				return true;
			}
			return false;
		},
		*clearSearchValue(_, { put }) {
			yield put({
				type: 'updateState',
				payload: {
					searchValue: {
						key: '',
						status: -1,
						date: [],
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
		updateDetail(state, action) {
			const {
				payload: {
					orderDetail: { invoiceInfo = null },
				},
			} = action;

			return {
				...state,
				orderDetail: {
					...payload.orderDetail,
					invoiceInfo,
				},
			};
		},
	},
};
