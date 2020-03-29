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
			offline: 0,
			online: 0,
		},
		latestCustomerCount: 0,
		earlyCustomerCount: 0,
		latestOrderInfo: {},
		earlyOrderInfo: {},
		latestCustomerData: [],
		latestOrderAmoutData: [],
		latestCustomerByShop: [],
		latestOrderAmoutByShop: [],
		overViewStatusLoading: false,
		customerDistri: {},
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
		*fetchAllData(_, { put }) {
			yield put({
				type: 'getPermessionPassengerFlow',
			});
			yield put({
				type: 'getCompanySaasInfo',
			});
			yield put({
				type: 'getOverViewStatus',
				payload: {
					needLoading: true,
				},
			});
			yield put({
				type: 'getPermessionPassengerFlow',
			});
			yield put({
				type: 'getCompanySaasInfo',
			});
			yield put({
				type: 'getLatestOrderTrend',
			});
			yield put({
				type: 'getShopListLatestOrderAmout',
			});
			yield put({
				type: 'getLatestPassengerTrend',
			});
			yield put({
				type: 'getShopListLatestPassengerTrend',
			});
			yield put({
				type: 'updateState',
				payload: {
					lastModifyTime: moment().format('YYYY-MM-DD HH:mm:ss'),
				},
			});
		},

		*getOverViewStatus(_, { put, all }) {
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
				put({
					type: 'getEarlyPassengerAgeRegular',
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
			let status = false;
			if (response && response.code === ERROR_OK) {
				const {
					data: { deviceList },
				} = response;
				if (deviceList && deviceList.length > 0) {
					deviceList.forEach(device => {
						if (device.model === 'FM020') {
							status = true;
						}
					});
				}
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

		// 昨（日）客流生熟分布
		*getEarlyPassengerAgeRegular(_, { call, put }) {
			const currentOptions = {
				startTime: moment().format('YYYY-MM-DD'),
				type: 1,
			};
			const response = yield call(
				handleTopViewPassengerFlow,
				'history/ageRegular/getByDate',
				format('toSnake')(currentOptions)
			);
			let currentDistri;
			let earlyDistri;
			if (response && response.code === ERROR_OK) {
				const { data = {} } = response;
				const { countList } = format('toCamel')(data);
				currentDistri = countList.reduce((pre, cur) => ({
					strangerUniqCount: cur.strangerUniqCount + pre.strangerUniqCount,
					regularUniqCount: cur.regularUniqCount + pre.regularUniqCount,
				}));
			}
			const earlyOptions = {
				startTime: moment()
					.add(-1, 'days')
					.format('YYYY-MM-DD'),
				type: 1,
			};
			const res = yield call(
				handleTopViewPassengerFlow,
				'history/ageRegular/getByDate',
				format('toSnake')(earlyOptions)
			);
			if (res && res.code === ERROR_OK) {
				const { data = {} } = res;
				const { countList } = format('toCamel')(data);
				earlyDistri = countList.reduce((pre, cur) => ({
					strangerUniqCount: cur.strangerUniqCount + pre.strangerUniqCount,
					regularUniqCount: cur.regularUniqCount + pre.regularUniqCount,
				}));
			}
			yield put({
				type: 'updateState',
				payload: {
					customerDistri: {
						earlyStranger: earlyDistri.strangerUniqCount,
						earlyRegular: earlyDistri.regularUniqCount,
						currentStranger: currentDistri.strangerUniqCount,
						currentRegular: currentDistri.regularUniqCount,
					},
				},
			});
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
