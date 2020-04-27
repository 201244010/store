import { format } from '@konata9/milk-shake';
import { formatMessage } from 'umi/locale';
import Storage from '@konata9/storage.js';
import * as Actions from '@/services/role';
import * as CookieUtil from '@/utils/cookies';
import { ERROR_OK } from '@/constants/errorCode';
import { DEFAULT_PAGE_SIZE, USER_PERMISSION_LIST } from '@/constants';
import { FIRST_MENU_ORDER, SECOND_MENU_ORDER } from '@/config';

// 权限列表平铺结构转换树状结构
// eslint-disable-next-line arrow-body-style
const formatPList = data => {
	return FIRST_MENU_ORDER.map(menu => {
		const firstMenu = {
			path: `/${menu}`,
			permissionList: [],
			label: formatMessage({ id: `menu${`/${menu}`.split('/').join('.')}` }),
		};
		firstMenu.permissionList = data.reduce((pList, permissionInfo) => {
			const { id, permission: path } = permissionInfo;
			const pathList = path.split('/');
			const firstMenuPath = pathList[1];
			const secondMenuPath = pathList[2];
			// 如果有二级菜单, 添加permissionList
			if (menu === firstMenuPath && SECOND_MENU_ORDER.includes(secondMenuPath)) {
				const pItemFirst = pList.find(
					item => item.path === `/${menu}/${secondMenuPath}`
				) || {
					permissionList: [],
					label: formatMessage({
						id: `menu${path
							.split('/')
							.slice(0, 3)
							.join('.')}`,
					}),
					path: `/${menu}/${secondMenuPath}`,
				};
				pItemFirst.permissionList = [
					...pItemFirst.permissionList,
					{
						id,
						value: id,
						name: path,
						path,
						label: formatMessage({
							id: `menu${path.split('/').join('.')}`,
						}),
					},
				];
				const hasExit = pItemFirst.permissionList.length > 1;
				// 已有列表中有二级菜单，不新增，否则新增
				return hasExit ? pList : [...pList, pItemFirst];
			}
			if (menu === firstMenuPath) {
				return [
					...pList,
					{
						id,
						value: id,
						name: path,
						path,
						label: formatMessage({
							id: `menu${path.split('/').join('.')}`,
						}),
					},
				];
			}
			return pList;
		}, []);
		return firstMenu;
	});
};

export default {
	namespace: 'role',
	state: {
		pagination: {
			current: 1,
			pageSize: DEFAULT_PAGE_SIZE,
			total: 0,
			showSizeChanger: true,
		},
		roleList: [],
		roleSelectList: [],
		roleInfo: {
			name: '',
			permissionList: [],
			permissionCount: 0,
		},
		permissionList: [],
		userPermissionList: Storage.get(USER_PERMISSION_LIST, 'local') || [],
		permissionListByRoleList: [],
	},
	effects: {
		*getAllRoles(_, { put, call }) {
			const response = yield call(
				Actions.handleRoleManagement,
				'getList',
				format('toSnake')({
					pageNum: 1,
					pageSize: 999,
				})
			);
			if (response && response.code === ERROR_OK) {
				const { data = {} } = response;
				const { roleList } = format('toCamel')(data);
				yield put({
					type: 'updateState',
					payload: {
						roleSelectList: roleList
							.filter(role => !role.isDefault)
							.map(role => ({
								id: role.id,
								name: role.name,
								permissionList: role.permissionList.map(i => i.id),
							})),
					},
				});
			}
		},

		*getRoleList({ payload = {} }, { put, call, select }) {
			const { pagination } = yield select(state => state.role);
			const { keyword, current, pageSize } = payload;
			const opts = {
				keyword,
				pageNum: current,
				pageSize,
			};
			const response = yield call(
				Actions.handleRoleManagement,
				'getList',
				format('toSnake')(opts)
			);
			if (response && response.code === ERROR_OK) {
				const { data = {} } = response;
				const { roleList, totalCount } = format('toCamel')(data);
				const formatList = roleList
					.map(item => format('toCamel')(item))
					.sort((a, b) => a.createTime - b.createTime);
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
			const { roleId } = payload;
			const response = yield call(
				Actions.handleRoleManagement,
				'getInfo',
				format('toSnake')({ roleId })
			);
			if (response && response.code === ERROR_OK) {
				const { data = {} } = response;
				const forData = format('toCamel')(data) || {};
				const { permissionList = [] } = forData || {};
				// 拿到pList 生成list TODO
				// 滤除后台脏数据
				const sortedPermission = formatPList(permissionList);
				console.log('formatPList,', sortedPermission);
				const basicData = sortedPermission.find(item => item.path === '/basicData');
				if (basicData && basicData.permissionList.length) {
					const index = basicData.permissionList.findIndex(
						item => item.path.indexOf('storeManagement') > -1
					);
					if (index >= 0) {
						basicData.permissionList.splice(index, 1);
					}
				}
				// 权限列表format 添加字段
				forData.permissionList = sortedPermission.map((item, index) => {
					const valueList = item.permissionList
						? item.permissionList.map(items => items.value)
						: [item.value];
					return {
						permissionList: item.permissionList,
						group: item.label,
						valueList,
						key: `0-${index}`,
					};
				});
				forData.checkedList = permissionList.reduce((pre, cur) => [...pre, cur.id], []);
				forData.permissionCount = forData.checkedList.length;

				yield put({
					type: 'updateState',
					payload: {
						roleInfo: forData,
					},
				});
			}
		},

		// 获取所有权限列表
		*getPermissionList(_, { put, call }) {
			const response = yield call(Actions.handleRoleManagement, 'getPermissionList');
			let retPermissionList = [];
			if (response && response.code === ERROR_OK) {
				const { data = {} } = response;
				const { permissionList = [] } = format('toCamel')(data) || {};
				// 拿到pList 生成list TODO
				retPermissionList = permissionList;
				const sortedPermission = formatPList(permissionList);
				console.log('formatPList,', sortedPermission);
				// 滤除后台脏数据
				const basicData = sortedPermission.find(item => item.path === '/basicData');
				if (basicData && basicData.permissionList.length) {
					const index = basicData.permissionList.findIndex(
						item => item.path.indexOf('storeManagement') > -1
					);
					if (index >= 0) {
						basicData.permissionList.splice(index, 1);
					}
				}

				const tmpList = sortedPermission.map(item => ({
					permissionList: item.permissionList,
					label: item.label,
					valueList: item.permissionList
						? item.permissionList.map(items => items.value)
						: [item.value],
				}));
				yield put({
					type: 'updateState',
					payload: {
						permissionList: tmpList,
					},
				});
			}

			return retPermissionList;
		},

		*creatRole({ payload = {} }, { call }) {
			const { name, permissionIdList, username } = payload;
			const opts = {
				name,
				permissionIdList,
				username,
			};
			const response = yield call(
				Actions.handleRoleManagement,
				'create',
				format('toSnake')(opts)
			);
			return response;
		},

		*updateRole({ payload = {} }, { call }) {
			const { name, roleId, permissionIdList } = payload;
			const opts = {
				name,
				roleId,
				permissionIdList,
			};
			const response = yield call(
				Actions.handleRoleManagement,
				'update',
				format('toSnake')(opts)
			);
			return response;
		},

		*deleteRole({ payload = {} }, { call }) {
			const { roleId } = payload;
			const response = yield call(
				Actions.handleRoleManagement,
				'delete',
				format('toSnake')({ roleId })
			);
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

		*updateRoleInfo({ payload = {} }, { put }) {
			const { roleInfo } = payload;
			yield put({
				type: 'updateState',
				payload: {
					roleInfo,
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

		*changeAdmin({ payload = {} }, { call, put }) {
			const { targetSsoUsername } = payload;
			const response = yield call(
				Actions.handleRoleManagement,
				'changeAdmin',
				format('toSnake')({ targetSsoUsername })
			);
			if (response && response.code === ERROR_OK) {
				yield put({ type: 'getRoleList' });
				yield put({
					type: 'getUserPermissionList',
				});
			}
			return response;
		},

		*checkAdmin(_, { select, call, put }) {
			const response = yield call(Actions.handleRoleManagement, 'checkAdmin');
			const checkAdmin = response && response.code === ERROR_OK ? 1 : 0;

			const { currentUser } = yield select(state => state.user);
			const result = { ...currentUser, checkAdmin } || { checkAdmin };
			CookieUtil.setCookieByKey(CookieUtil.USER_INFO_KEY, result);

			yield put({
				type: 'user/storeUserInfo',
				payload: result,
			});

			return response;
		},

		// 根据角色列表计算权限列表,返回一个valueList
		*getPermissionListByRoleList({ payload = {} }, { put, call, all }) {
			const { roleList } = payload;
			const responseList = yield all(
				roleList.map(roleId =>
					call(Actions.handleRoleManagement, 'getInfo', format('toSnake')({ roleId }))
				)
			);
			const listSource = responseList.reduce((last, res) => {
				const { data = {} } = res;
				const forData = format('toCamel')(data) || {};
				const idList = forData.permissionList.reduce(
					(list, menu) => [...list, ...menu.permissionList.map(i => i.id)],
					[]
				);
				return [...last, ...idList];
			}, []);

			const listMerge = Array.from(new Set(listSource));
			// const listMerge = groupBy(listSource, 'name').reduce((last,firstMenu)=>{
			// 	firstMenu.
			// },[]);
			yield put({
				type: 'updateState',
				payload: {
					permissionListByRoleList: listMerge,
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
