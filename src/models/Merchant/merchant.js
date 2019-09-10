import * as Actions from '@/services/Merchant/merchant';
import { ERROR_OK } from '@/constants/errorCode';
import { message } from 'antd';
import { formatMessage } from 'umi/locale';
import * as CookieUtil from '@/utils/cookies';
import Storage from '@konata9/storage.js';

export default {
	namespace: 'merchant',
	state: {
		currentCompanyId: CookieUtil.getCookieByKey(CookieUtil.COMPANY_ID_KEY),
		companyList: Storage.get(CookieUtil.COMPANY_LIST_KEY, 'local') || [],
		companyInfo: {},
		loading: false,
	},

	effects: {
		*getCompanyNameById({ payload }, { take, select }) {
			const { companyId } = payload;
			let list = yield select(state => state.merchant.companyList);
			let name = '';

			if (list.length === 0) {
				const { payload: result } = yield take('updateState');
				list = result;
			}
			list.forEach(item => {
				if (item.company_id === companyId) {
					name = item.company_name;
				}
			});
			return name;
		},
		*initialCompany({ payload = {} }, { call }) {
			const { options = {} } = payload;
			yield call(Actions.initialCompany, options);
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
				message.success(formatMessage({ id: 'create.success' }));
				const data = response.data || {};
				CookieUtil.setCookieByKey(CookieUtil.COMPANY_ID_KEY, data.company_id);
				yield put({
					type: 'updateState',
					payload: { loading: false },
				});
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
				const result = response.data || {};
				const companyList = result.company_list || [];
				Storage.set({ [CookieUtil.COMPANY_LIST_KEY]: companyList }, 'local');

				if (companyList.length === 1) {
					const companyInfo = companyList[0] || {};
					CookieUtil.setCookieByKey(CookieUtil.COMPANY_ID_KEY, companyInfo.company_id);
					yield put({
						type: 'setCurrentCompany',
						payload: {
							companyId: companyInfo.company_id,
						},
					});
				}

				// TODO 移到前面，暂时不对错误情况做处理（等待云端评审结果）
				yield put({
					type: 'initialCompany',
					payload: {
						options: {
							company_id_list: companyList.map(company => company.company_id),
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
				const result = response.data || {};
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
