import * as Actions from '@/services/role';
import { ERROR_OK } from '@/constants/errorCode';
import { DEFAULT_PAGE_SIZE, USER_PERMISSION_LIST } from '@/constants';
import { map, format } from '@konata9/milk-shake';
import Storage from '@konata9/storage.js';

const getInitStatus = (permissionList, roleInfo) => {
	const rolePermissionList = roleInfo.permissionList;
	const initResult = {};
	rolePermissionList.map(item => {
		if (item.group === permissionList.label) {
			initResult.valueList = item.valueList;
			initResult.checkAll = item.checkAll;
		}
	});
	return initResult;
};

const formatData = data => {
	let tmp = [...data];
	tmp = tmp.map(item => map([{ from: 'id', to: 'value' }, { from: 'name', to: 'label' }])(item));
	tmp = tmp.map(item => {
		if (item.permissionList) {
			item.permissionList = item.permissionList.map(items =>
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
		roleSelectList: [],
		roleInfo: {
			name: '',
			permissionList: [],
		},
		permissionList: [],
		userPermissionList: Storage.get(USER_PERMISSION_LIST, 'local') || [],
	},
	effects: {
		*getAllRoles(_, { put, call }) {
			const response = yield call(Actions.handleRoleManagement, 'getList', {
				page_num: 1,
				page_size: 999,
			});
			if (response && response.code === ERROR_OK) {
				const { data = {} } = response;
				const { roleList } = format('toCamel')(data);
				yield put({
					type: 'updateState',
					payload: {
						roleSelectList: roleList
							.filter(role => !role.isDefault)
							.map(role => ({ id: role.id, name: role.name })),
					},
				});
			}
		},

		*getRoleList({ payload = {} }, { put, call, select }) {
			const { pagination } = yield select(state => state.role);
			const { keyword, current, pageSize } = payload;
			const opts = {
				keyword,
				page_num: current,
				page_size: pageSize,
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
							pageSize,
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
				const forData = format('toCamel')(data);
				forData.permissionList = formatData(forData.permissionList).map(item =>
					Object.assign(
						{},
						{
							checkedList: item,
							indeterminate: item.permissionList && true,
							checkAll: false,
							group: item.label,
							valueList: item.permissionList
								? item.permissionList.map(items => items.value)
								: [item.value],
						}
					)
				);
				yield put({
					type: 'updateState',
					payload: {
						roleInfo: forData,
					},
				});
				yield put({
					type: 'getPermissionList',
					payload: {
						type: 'modify',
					},
				});
			}
		},

		*getPermissionList({ payload = {} }, { put, call, select }) {
			const { type } = payload;
			const response = yield call(Actions.handleRoleManagement, 'getPermissionList');
			if (response && response.code === ERROR_OK) {
				const roleInfo = yield select(state => state.role.roleInfo);

				const { data = {} } = response;
				const forData = format('toCamel')(data);

				const tmpList = formatData(forData.permissionList).map(item =>
					Object.assign(
						{},
						{
							checkedList: item,
							indeterminate: item.permissionList && true,
							checkAll:
								type === 'modify' ? getInitStatus(item, roleInfo).checkAll : false,
							group: item.label,
							valueList:
								type === 'modify' ? getInitStatus(item, roleInfo).valueList : [],
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

		*updateRole({ payload = {} }, { call }) {
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

		*getUserPermissionList(_, { call, put }) {
			const response = yield call(Actions.handleRoleManagement, 'getPermissionListByUser');
			if (response && response.code === ERROR_OK) {
				const { data = {} } = response;
				const { permissionList } = format('toCamel')(data);
				Storage.set(
					{
						[USER_PERMISSION_LIST]: permissionList,
					},
					'local'
				);
				yield put({
					type: 'updateState',
					payload: {
						userPermissionList: permissionList,
					},
				});
			}
			return response;
		},

		*changeAdmin({ payload = {} }, { call }) {
			const { targetSsoUsername: target_sso_username } = payload;
			const opts = {
				target_sso_username,
			};
			const response = yield call(Actions.handleRoleManagement, 'changeAdmin', opts);
			return response;
		},

		*checkAdmin(_, { call }) {
			const response = yield call(Actions.handleRoleManagement, 'checkAdmin');
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
