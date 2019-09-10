import { format, map } from '@konata9/milk-shake';
import * as Action from '@/services/employee';
import { DEFAULT_PAGE_SIZE } from '@/constants';
import { ERROR_OK } from '@/constants/errorCode';

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

		*clearSearchValue(_, { put }) {
			yield put({
				type: 'updateState',
				payload: {
					searchValue: {
						shopIdList: [],
						name: null,
						number: null,
						username: null,
					},
				},
			});
		},

		*getEmployeeList({ payload = {} }, { call, select, put }) {
			const { searchValue, pagination } = yield select(state => state.employee);
			const { current = 1, pageSize = 10, roleId = -1 } = payload;

			const options = {
				...searchValue,
				pageNum: current,
				pageSize,
				roleId,
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
					.map(e => ({ ...e, username: e.phone || e.email }));

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

		*getEmployeeInfo({ payload: { employeeId = null } = {} }, { call, put }) {
			const response = yield call(
				Action.handleEmployee,
				'getInfo',
				format('toSnake')({ employeeId })
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
