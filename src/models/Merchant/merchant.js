import { message } from 'antd';
import { formatMessage } from 'umi/locale';
import Storage from '@konata9/storage.js';
import { format } from '@konata9/milk-shake';
import * as Actions from '@/services/Merchant/merchant';
import { ERROR_OK } from '@/constants/errorCode';
import * as CookieUtil from '@/utils/cookies';

export default {
	namespace: 'merchant',
	state: {
		currentCompanyId: CookieUtil.getCookieByKey(CookieUtil.COMPANY_ID_KEY),
		companyList: Storage.get(CookieUtil.COMPANY_LIST_KEY, 'local') || [],
		companyInfo: {},
		loading: false,
	},

	effects: {
		setCompanyListInStorage({ payload = {} }) {
			const { companyList = [] } = payload;
			Storage.set({ [CookieUtil.COMPANY_LIST_KEY]: companyList }, 'local');
		},

		setCompanyIdInCookie({ payload = {} }) {
			const { companyId } = payload;
			CookieUtil.setCookieByKey(CookieUtil.COMPANY_ID_KEY, companyId);
		},

		*getCompanyNameById({ payload }, { take, select }) {
			const { companyId } = payload;
			let list = yield select(state => state.merchant.companyList);
			let name = '';

			if (list.length === 0) {
				const { payload: result } = yield take('updateState');
				list = result;
			}
			list.forEach(item => {
				if (item.companyId === companyId) {
					name = item.companyName;
				}
			});
			return name;
		},

		*initialCompany({ payload = {} }, { call }) {
			const { options = {} } = payload;
			yield call(Actions.initialCompany, format('toSnake')(options));
		},

		*setCurrentCompany({ payload }, { put }) {
			const { companyId } = payload;
			yield put({
				type: 'updateState',
				payload: { currentCompanyId: companyId },
			});
		},

		*companyCreate({ payload }, { put, call }) {
			yield put({
				type: 'updateState',
				payload: { loading: true },
			});
			const response = yield call(Actions.companyCreate, payload);
			if (response && response.code === ERROR_OK) {
				const { data = {} } = format('toCamel')(response);
				const { companyId } = data;

				yield put({
					type: 'setCompanyIdInCookie',
					payload: { companyId },
				});

				yield put({
					type: 'updateState',
					payload: { currentCompanyId: companyId },
				});

				yield put.resolve({
					type: 'initSetupAfterCreate',
				});

				yield put({
					type: 'updateState',
					payload: { loading: false },
				});
				message.success(formatMessage({ id: 'create.success' }));
			} else {
				yield put({
					type: 'updateState',
					payload: { loading: false },
				});
			}
			return response;
		},

		*getCompanyList(_, { call, put }) {
			yield put({
				type: 'updateState',
				payload: {
					loading: true,
				},
			});
			const response = yield call(Actions.getCompanyList);
			if (response && response.code === ERROR_OK) {
				const { data = {} } = response || {};
				const { companyList = [] } = format('toCamel')(data);

				yield put({
					type: 'setCompanyListInStorage',
					payload: {
						companyList,
					},
				});

				if (companyList.length === 1) {
					const companyInfo = companyList[0] || {};
					yield put({
						type: 'setCompanyIdInCookie',
						payload: {
							companyId: companyInfo.companyId,
						},
					});

					yield put({
						type: 'setCurrentCompany',
						payload: {
							companyId: companyInfo.companyId,
						},
					});
				}

				// TODO 移到前面，暂时不对错误情况做处理（等待云端评审结果）
				yield put({
					type: 'initialCompany',
					payload: {
						options: {
							companyIdList: companyList.map(company => company.companyId),
						},
					},
				});

				yield put({
					type: 'updateState',
					payload: {
						companyList,
						loading: false,
					},
				});
			} else {
				yield put({
					type: 'updateState',
					payload: {
						loading: false,
					},
				});

				yield put({
					type: 'menu/goToPath',
					payload: {
						pathId: 'userLogin',
					},
				});
				// router.push('/user/login');
			}

			return response;
		},

		*companyGetInfo(_, { call, put }) {
			const response = yield call(Actions.companyGetInfo);
			yield put({
				type: 'updateState',
				payload: { loading: true },
			});
			if (response && response.code === ERROR_OK) {
				const result = format('toCamel')(response.data) || {};
				yield put({
					type: 'updateState',
					payload: { companyInfo: result, loading: false },
				});
			} else {
				yield put({
					type: 'updateState',
					payload: { loading: false },
				});
			}
		},

		*companyUpdate({ payload }, { call, put }) {
			const { options } = payload;
			yield put({
				type: 'updateState',
				payload: { loading: true },
			});
			const response = yield call(Actions.companyUpdate, options);
			if (response && response.code === ERROR_OK) {
				yield put({
					type: 'updateState',
					payload: { companyInfo: options, loading: false },
				});
				message.success(formatMessage({ id: 'modify.success' }));
				yield put({
					type: 'getCompanyList',
				});
				yield put({
					type: 'store/updateCompany',
					payload: options,
				});
				yield put({
					type: 'menu/goToPath',
					payload: {
						pathId: 'merchantView',
					},
				});
				// router.push(`${MENU_PREFIX.MERCHANT}/view`);
			} else {
				yield put({
					type: 'updateState',
					payload: { loading: false },
				});
			}
			return response;
		},

		*switchCompany({ payload = {} }, { put }) {
			const { companyId } = payload;
			yield put({
				type: 'setCompanyIdInCookie',
				payload: { companyId },
			});

			yield put({
				type: 'setCurrentCompany',
				payload: { companyId },
			});

			const result = yield put.resolve({
				type: 'store/getStoreList',
			});

			const { data: { shopList = [] } = {} } = format('toCamel')(result);

			yield put({
				type: 'store/setShopListInStorage',
				payload: { shopList },
			});

			yield put({
				type: 'store/setShopIdInCookie',
				payload: { shopId: 0 },
			});

			yield put({
				type: 'menu/goToPath',
				payload: {
					pathId: 'root',
					linkType: 'href',
				},
			});
		},

		*initSetupAfterCreate(_, { call, put }) {
			const res = yield call(Actions.getCompanyList);
			if (res && res.code === ERROR_OK) {
				const { data = {} } = res || {};
				const { companyList = [] } = format('toCamel')(data);
				yield put.resolve({
					type: 'initialCompany',
					payload: {
						options: {
							companyIdList: companyList.map(company => company.companyId),
						},
					},
				});
			}
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
