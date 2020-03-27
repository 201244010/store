import moment from 'moment';
import { format } from '@konata9/milk-shake';
import {
	handleTopViewPassengerFlow,
	handleTopViewOrder,
	getCompanySaasInfo,
	getCompanyIPCList,
	getDeviceOverView,
} from '@/services/topview';
import { ERROR_OK } from '@/constants/errorCode';

export default {
	namespance: 'topview',
	state: {
		lastModifyTime: moment().format('YYYY-MM-DD HH:mm:ss'),
		hasCustomerData: false,
		hasOrderData: false,
		timeType: 1, // 日维度
		deviceOverView: {
			offline: null,
			online: null,
		},
		latestCustomerCount: null,
		earlyCustomerCount: null,
		latestOrderInfo: {},
		earlyOrderInfo: {},
		latestCustomerData: [],
		latestOrderAmoutData: [],
		latestCustomerByShop: [],
		latestOrderAmoutByShop: [],
		overViewStatusLoading: false,
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
		*fetchAllData(_, { all, put }) {
			yield all([
				put({
					type: 'getPermessionPassengerFlow',
				}),
				put({
					type: 'getCompanySaasInfo',
				}),
				put({
					type: 'getOverViewStatus',
					payload: {
						needLoading: true,
					},
				}),
				// put({
				// 	type: 'getDeviceOverView',
				// }),
				// put({
				// 	type: 'getLatestOrderInfo',
				// }),
				// put({
				// 	type: 'getEarlyOrderInfo',
				// }),
				put({
					type: 'getLatestOrderTrend',
				}),
				put({
					type: 'getShopListLatestOrderAmout',
				}),
				// put({
				// 	type: 'getLatestPassenger',
				// }),
				// put({
				// 	type: 'getEarlyPassenger',
				// }),
				put({
					type: 'getLatestPassengerTrend',
				}),
				put({
					type: 'getShopListLatestPassengerTrend',
				}),
			]);
			yield put({
				type: 'updateState',
				payload: {
					lastModifyTime: moment().format('YYYY-MM-DD HH:mm:ss'),
				},
			});
		},

		*getOverViewStatus({ payload }, { put, all }) {
			const { needLoading } = payload;
			if (needLoading) {
				// yield put({
				// 	type: 'updateState',
				// 	payload: {
				// 		// loadingType: 'overViewStatusLoading',
				// 		overViewStatusLoading: true,
				// 	},
				// });
			}
			yield all([
				put({
					type: 'getDeviceOverView',
				}),
				put({
					type: 'getLatestOrderInfo',
				}),
				put({
					type: 'getEarlyOrderInfo',
				}),
				put({
					type: 'getLatestPassenger',
				}),
				put({
					type: 'getEarlyPassenger',
				}),
			]);
			// yield put({
			// 	type: 'updateState',
			// 	payload: {
			// 		overViewStatusLoading: false,
			// 	},
			// });
		},

		*getPermessionPassengerFlow(_, { put, call }) {
			const response = yield call(getCompanyIPCList);
			if (response && response.code === ERROR_OK) {
				const {
					data: { deviceList },
				} = response;
				const status = deviceList.length > 0;
				yield put({
					type: 'updateState',
					payload: {
						hasCustomerData: status,
					},
				});
			}
		},

		*getCompanySaasInfo(_, { put, call }) {
			const response = yield call(getCompanySaasInfo);
			if (response && response.code === ERROR_OK) {
				const {
					data: { authorizedList },
				} = response;
				const status = authorizedList.length > 0;
				yield put({
					type: 'updateState',
					payload: {
						hasOrderData: status,
					},
				});
			}
		},

		*getDeviceOverView(_, { put, call }) {
			const options = { source: 1 };
			const response = yield call(getDeviceOverView, options);
			if (response && response.code === ERROR_OK) {
				const {
					data: { dataList },
				} = response;
				const deviceOverView = {
					offline: 0,
					online: 0,
					total: 0,
				};
				dataList.map(shop => {
					deviceOverView.offline += shop.offlineCount;
					deviceOverView.online += shop.onlineCount;
				});
				yield put({
					type: 'updateState',
					payload: {
						deviceOverView,
					},
				});
			}
		},

		// 实时客流数
		*getLatestPassenger(_, { put, call }) {
			const response = yield call(handleTopViewPassengerFlow, 'getLatest');
			if (response && response.code === ERROR_OK) {
				const { data = {} } = response;
				const { latestCount: latestCustomerCount } = format('toCamel')(data);
				yield put({
					type: 'updateState',
					payload: {
						latestCustomerCount,
					},
				});
			}
		},

		// 昨（日）客流
		*getEarlyPassenger(_, { call, put }) {
			const options = {
				startTime: moment()
					.add(-1, 'days')
					.format('YYYY-MM-DD'),
				type: 1,
			};
			const response = yield call(
				handleTopViewPassengerFlow,
				'history/getByDate',
				format('toSnake')(options)
			);
			if (response && response.code === ERROR_OK) {
				const { data = {} } = response;
				const { passengerCount } = format('toCamel')(data);
				yield put({
					type: 'updateState',
					payload: {
						earlyCustomerCount: passengerCount,
					},
				});
			}
		},

		// 实时交易概况
		*getLatestOrderInfo(_, { put, call }) {
			const response = yield call(handleTopViewOrder, 'getLatest');
			if (response && response.code === ERROR_OK) {
				const { data = {} } = response;
				const latestOrderInfo = format('toCamel')(data);
				yield put({
					type: 'updateState',
					payload: {
						latestOrderInfo,
					},
				});
			}
		},

		// 昨（日）销售概况
		*getEarlyOrderInfo(_, { call, put }) {
			const options = {
				startTime: moment()
					.add(-1, 'days')
					.format('YYYY-MM-DD'),
				type: 1,
			};
			const response = yield call(
				handleTopViewOrder,
				'history/getByDate',
				format('toSnake')(options)
			);
			if (response && response.code === ERROR_OK) {
				const { data = {} } = response;
				const orderInfo = format('toCamel')(data);
				yield put({
					type: 'updateState',
					payload: {
						earlyOrderInfo: orderInfo,
					},
				});
			}
		},

		// 实时交易金额趋势
		*getLatestOrderTrend(_, { put, call }) {
			const response = yield call(handleTopViewOrder, 'trend/getLatest');
			if (response && response.code === ERROR_OK) {
				const { data = {} } = response;
				const { timeList } = format('toCamel')(data);
				yield put({
					type: 'updateState',
					payload: {
						latestOrderAmoutData: timeList,
					},
				});
			}
		},

		// 实时客流趋势
		*getLatestPassengerTrend(_, { put, call }) {
			const response = yield call(handleTopViewPassengerFlow, 'trend/getLatest');
			if (response && response.code === ERROR_OK) {
				const { data = {} } = response;
				const { timeList } = format('toCamel')(data);
				yield put({
					type: 'updateState',
					payload: {
						latestCustomerData: timeList,
					},
				});
			}
		},

		// 门店客流
		*getShopListLatestPassengerTrend(_, { put, call }) {
			const response = yield call(handleTopViewPassengerFlow, 'branch/getLatest');
			if (response && response.code === ERROR_OK) {
				const { data = {} } = response;
				const { shopList } = format('toCamel')(data);
				yield put({
					type: 'updateState',
					payload: {
						latestCustomerByShop: shopList,
					},
				});
			}
		},

		// 门店销售额
		*getShopListLatestOrderAmout(_, { put, call }) {
			const response = yield call(handleTopViewOrder, 'branch/getLatest');
			if (response && response.code === ERROR_OK) {
				const { data = {} } = response;
				const { shopList } = format('toCamel')(data);
				yield put({
					type: 'updateState',
					payload: {
						latestOrderAmoutByShop: shopList,
					},
				});
			}
		},
	},
};
