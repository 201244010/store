import * as Actions from '@/services/role';
import { ERROR_OK } from '@/constants/errorCode';
import { DEFAULT_PAGE_SIZE } from '@/constants';
import { map, format } from '@konata9/milk-shake';

const getInitStatus = (permissionList, roleInfo) => {
	const rolePermissionList = roleInfo.permission_list;
	const initResult = {};
	rolePermissionList.map(item => {
		if (item.group === permissionList.label) {
			initResult.valueList = item.valueList;
			initResult.checkAll = item.checkAll;
		}
	});
	return initResult;
};

const formatData = (data) => {
	let tmp = [...data];
	tmp = tmp.map(item =>
		map([{ from: 'id', to: 'value' }, { from: 'name', to: 'label' }])(item)
	);
	tmp = tmp.map(item => {
		if (item.permission_list) {
			item.permission_list = item.permission_list.map(items =>
				map([{ from: 'id', to: 'value' }, { from: 'name', to: 'label' }])(items)
			);
		}
		return item;
	});
	return tmp;
};

export default {
	namespace: 'role',
	state: {
		pagination: {
			current: 1,
			pageSize: DEFAULT_PAGE_SIZE,
			total: 0,
			showSizeChanger: true,
			showQuickJumper: true,
		},
		roleList: [],
		roleInfo: {
			name: '',
			permission_list: [],
		},
		permissionList: [],
	},
	effects: {
		*getRoleList({payload = {}}, { put, call, select }) {
			const { pagination } = yield select(state => state.role);
			const { keyword, current, pageSize } = payload;
			const opts = {
				keyword,
				page_num: current,
				page_size: pageSize
			};
			const response = yield call(Actions.handleRoleManagement, 'getList', opts);
			if (response && response.code === ERROR_OK) {
				const { data = {} } = response;
				const { role_list: roleList, total_count: totalCount } = data;
				const formatList = roleList.map(item => format('toCamel')(item));
				yield put({
					type: 'updateState',
					payload: {
						roleList: formatList,
						pagination: {
							...pagination,
							total: totalCount,
							current,
							pageSize
						},
					},
				});
			}
		},

		*getRoleInfo({ payload = {} }, { put, call }) {
			const { roleId: role_id } = payload;
			const opts = {
				role_id,
			};
			const response = yield call(Actions.handleRoleManagement, 'getInfo', opts);
			if (response && response.code === ERROR_OK) {
				const { data = {} } = response;
				data.permission_list = formatData(data.permission_list).map(item =>
					Object.assign(
						{},
						{
							checkedList: item,
							indeterminate: item.permission_list && true,
							checkAll: true,
							group: item.label,
							valueList: item.permission_list
								? item.permission_list.map(items => items.value)
								: [item.value],
						}
					)
				);
				yield put({
					type: 'updateState',
					payload: {
						roleInfo: data,
					},
				});
				yield put({
					type: 'getPermissionList',
					payload: {
						type: 'modify'
					}
				});
			}
		},

		*getPermissionList({payload = {}}, { put, call, select }) {
			const { type } = payload;
			const response = yield call(Actions.handleRoleManagement, 'getPermissionList');
			if (response && response.code === ERROR_OK) {
				const roleInfo = yield select(
					state => state.role.roleInfo
				);

				const { data = {} } = response;
				const { permission_list: permissionList } = data;

				const tmpList = formatData(permissionList).map(item =>
					Object.assign(
						{},
						{
							checkedList: item,
							indeterminate: item.permission_list && true,
							checkAll: type === 'modify' ?getInitStatus(item, roleInfo).checkAll : false,
							group: item.label,
							valueList: type === 'modify' ?  getInitStatus(item, roleInfo).valueList : [],
						}
					)
				);

				yield put({
					type: 'updateState',
					payload: {
						permissionList: tmpList,
					},
				});
			}
		},

		*creatRole({ payload = {} }, { call }) {
			const { name, permissionIdList: permission_id_list, username } = payload;
			const opts = {
				name,
				permission_id_list,
				username,
			};
			const response = yield call(Actions.handleRoleManagement, 'create', opts);
			return response;
		},

		*updateRole({payload = {}}, { call }) {
			const { name, roleId: role_id, permissionIdList: permission_id_list } = payload;
			const opts = {
				name,
				role_id,
				permission_id_list,
			};
			const response = yield call(Actions.handleRoleManagement, 'update', opts);
			return response;
		},

		*deleteRole({ payload = {} }, { call }) {
			const { roleId: role_id } = payload;
			const opts = {
				role_id,
			};
			const response = yield call(Actions.handleRoleManagement, 'delete', opts);
			return response;
		},

		*updatePermissionList(payload = {}, { put }) {
			yield put({
				type: 'updateState',
				payload: {
					payload,
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
	},
};
