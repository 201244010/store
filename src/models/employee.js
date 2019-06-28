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
				// TODO 处理员工列表返回
				yield put({
					type: 'updateState',
					payload: {
						pagination: {
							...pagination,
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
				// TODO 处理员工详情
				yield put({
					type: 'updateState',
					payload: {},
				});
			}
		},

		*createEmployee(
			{
				payload: {
					name,
					number,
					username,
					gender,
					ssoUsername,
					organizationRoleMappingList,
				} = {},
			},
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
					organizationRoleMappingList,
				})
			);

			if (response && response.code === ERROR_OK) {
				// TODO 处理创建员工的返回值
				yield put({
					type: 'updateState',
					payload: {},
				});
			}
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
				// TODO 更新员工的处理逻辑
				yield put({
					type: 'updateState',
					payload: {},
				});
			}
		},

		*deleteEmployee({ payload: { employeeIdList } = {} }, { call, put }) {
			const response = yield call(
				Action.handleEmployee,
				'delete',
				format('toSnake')(employeeIdList)
			);

			if (response && response.code === ERROR_OK) {
				// TODO 删除员工处理逻辑
				yield put({
					type: 'updateState',
					payload: {},
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
