import { format, map } from '@konata9/milk-shake';
import * as Action from '@/services/employee';
import { handleRoleManagement } from '@/services/role';
import { getUserInfoByUsername } from '@/services/user';
import { DEFAULT_PAGE_SIZE } from '@/constants';
import { ERROR_OK } from '@/constants/errorCode';
import * as CookieUtil from '@/utils/cookies';
import { getLocationParam } from '@/utils/utils';

export default {
	namespace: 'employee',
	state: {
		pagination: {
			current: 1,
			pageSize: DEFAULT_PAGE_SIZE,
			total: 0,
			showSizeChanger: true,
			showQuickJumper: true,
		},
		searchValue: {
			shopIdList: [],
			name: null,
			number: null,
			username: null,
			roleId: -1,
		},
		getInfoValue: {
			shopIdList: [],
			name: null,
			number: null,
			username: null,
			roleId: -1,
		},
		employeeList: [],
		employeeInfo: {},
	},
	effects: {
		*setSearchValue({ payload = {} }, { select, put }) {
			const { searchValue } = yield select(state => state.employee);
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

		*setGetInfoValue({ payload = {} }, { select, put }) {
			const { searchValue } = yield select(state => state.employee);
			yield put({
				type: 'updateState',
				payload: {
					getInfoValue: {
						...searchValue,
						...payload,
					},
				},
			});
		},
		*clearSearchValue(_, { put }) {
			const initStatus = {
				shopIdList: [],
				name: null,
				number: null,
				username: null,
			};
			yield put({
				type: 'updateState',
				payload: {
					searchValue: initStatus,
					getInfoValue: initStatus
				},
			});
		},

		*getEmployeeList({ payload = {} }, { call, select, put }) {
			const { getInfoValue, pagination } = yield select(state => state.employee);
			const { storeList } = yield select(state => state.store);
			const shopId = CookieUtil.getCookieByKey(CookieUtil.SHOP_ID_KEY) || storeList[0].shopId || '';
			const { current = 1, pageSize = 10, roleId = -1, shopIdList: shopIdListParams = [] } = payload;
			const tmpShopIdList = yield put.resolve({
				type: 'global/getShopListFromStorage',
			});
			const adminResponse = yield put.resolve({
				type: 'role/checkAdmin',
			});
			const orgId = Number(getLocationParam('orgId'));
			let tmpShopList = [];
			const { shopIdList } = getInfoValue;
			if (shopIdList.length) {
				tmpShopList = shopIdList;
			} else if (adminResponse && adminResponse.code !== ERROR_OK) {
				tmpShopList = tmpShopIdList.map(item => item.shopId);
			} else if (orgId) {
				tmpShopList = [orgId];
			}

			const options = {
				...getInfoValue,
				pageNum: current,
				pageSize,
				roleId,
				shopId,
				shopIdList: shopIdListParams.length > 0 ? shopIdListParams : tmpShopList,
			};

			const response = yield call(
				Action.handleEmployee,
				'getList',
				format('toSnake')(options)
			);

			if (response && response.code === ERROR_OK) {
				const { data = {} } = response;
				const { employeeList, totalCount } = format('toCamel')(data);

				const fromattedList = employeeList
					.map(employee =>
						map([
							{
								from: 'organizationRoleMappingList',
								to: 'mappingList',
								rule: role => role.filter(r => r.id !== 0),
							},
						])(employee)
					)
					.map(e => ({ ...e, username: e.phone || e.email }))
					.sort((a, b) => b.createTime - a.createTime);

				yield put({
					type: 'updateState',
					payload: {
						employeeList: fromattedList,
						pagination: {
							...pagination,
							total: totalCount,
							current,
							pageSize,
						},
					},
				});
			}
		},

		*getEmployeeInfo({ payload: { employeeId = null } = {} }, { call, put, select }) {
			const { storeList } = yield select(state => state.store);
			const shopId = CookieUtil.getCookieByKey(CookieUtil.SHOP_ID_KEY) || storeList[0].orgId || '';

			const response = yield call(
				Action.handleEmployee,
				'getInfo',
				format('toSnake')({ employeeId, shopId })
			);

			if (response && response.code === ERROR_OK) {
				const { data = {} } = response;
				const formattedData = map([
					{
						from: 'organizationRoleMappingList',
						to: 'mappingList',
						rule: role => role.filter(d => d.roleId !== 0),
					},
				])(format('toCamel')(data));
				const { phone = '', email = '' } = formattedData;
				yield put({
					type: 'updateState',
					payload: {
						employeeInfo: {
							...formattedData,
							username: phone || email,
						},
					},
				});
			}
		},

		*checkUsernameExist({ payload: { username = '' } = {} }, { call }) {
			const response = yield call(Action.handleEmployee, 'isUsernameExist', { username });
			return response;
		},

		*checkNumberExist({ payload: { number = '' } = {} }, { call }) {
			const response = yield call(Action.handleEmployee, 'isNumberExist', { number });
			return response;
		},

		*checkSsoBinded({ payload: { ssoUsername = '' } = {} }, { call }) {
			const response = yield call(
				Action.handleEmployee,
				'isSsoUsernameBinded',
				format('toSnake')({ ssoUsername })
			);

			return response;
		},

		*createEmployee(
			{ payload: { name, number, username, gender, ssoUsername, mappingList } = {} },
			{ call }
		) {
			const response = yield call(
				Action.handleEmployee,
				'create',
				format('toSnake')({
					name,
					number,
					username,
					gender: gender || 0,
					ssoUsername,
					mappingList,
					shopId: mappingList[0].shopId
				})
			);

			return response;
		},

		*updateEmployee(
			{ payload: { employeeId, name, number, username, gender, mappingList } = {} },
			{ call }
		) {
			const response = yield call(
				Action.handleEmployee,
				'update',
				format('toSnake')({
					employeeId,
					name,
					number,
					username,
					gender,
					mappingList,
				})
			);

			return response;
		},

		*deleteEmployee({ payload: { employeeIdList } = {} }, { select, call, put }) {
			const response = yield call(
				Action.handleEmployee,
				'delete',
				format('toSnake')({ employeeIdList })
			);

			if (response && response.code === ERROR_OK) {
				const {
					pagination: { current },
					employeeList = [],
				} = yield select(state => state.employee);

				yield put({
					type: 'getEmployeeList',
					payload: {
						current: employeeList.length === 1 && current > 1 ? current - 1 : current,
					},
				});
			}

			return response;
		},

		*getAdmin(_, { call }) {
			const response = yield call(handleRoleManagement, 'getAdmin');
			return response;
		},

		*getUserInfoByUsername(
			{
				payload: { username },
			},
			{ select, put, call }
		) {
			const employeeInfo = yield select(state => state.employee.employeeInfo);
			const response = yield call(getUserInfoByUsername, { username });

			if (response && response.code === ERROR_OK) {
				const { data = {} } = response;
				const { email, phone } = format('toCamel')(data);
				yield put({
					type: 'updateState',
					payload: {
						employeeInfo: {
							...employeeInfo,
							ssoUsername: email || phone,
						},
					},
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
