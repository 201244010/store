import * as Action from '@/services/employee';
import { DEFAULT_PAGE_SIZE } from '@/constants';
import { ERROR_OK } from '@/constants/errorCode';
import { format } from '@konata9/milk-shake';

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
			const { current = 1, pageSize = 10 } = payload;
			const options = {
				...searchValue,
				pageNum: current,
				pageSize,
			};

			const response = yield call(
				Action.handleEmployee,
				'getList',
				format('toSnake')(options)
			);

			if (response && response.code === ERROR_OK) {
				const { data = {} } = response;
				const { employeeList, totalCount } = format('toCamel')(data);
				yield put({
					type: 'updateState',
					payload: {
						employeeList,
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
				yield put({
					type: 'updateState',
					payload: { employeeInfo: format('toCamel')(data) },
				});
			}
		},

		*createEmployee(
			{ payload: { name, number, username, gender, ssoUsername, mappingList } = {} },
			{ call, put }
		) {
			const response = yield call(
				Action.handleEmployee,
				'create',
				format('toSnake')({
					name,
					number,
					username,
					gender,
					ssoUsername,
					mappingList,
				})
			);

			if (response && response.code === ERROR_OK) {
				yield put({
					type: 'updateState',
					payload: {},
				});
			}
			return response;
		},

		*updateEmployee(
			{
				payload: {
					employeeId,
					name,
					number,
					username,
					gender,
					organizationRoleMappingList,
				} = {},
			},
			{ call, put }
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
					organizationRoleMappingList,
				})
			);

			if (response && response.code === ERROR_OK) {
				yield put({
					type: 'updateState',
					payload: {},
				});
			}
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
