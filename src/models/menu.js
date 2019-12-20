import memoizeOne from 'memoize-one';
import isEqual from 'lodash/isEqual';
import { formatMessage } from 'umi/locale';
import router from 'umi/router';
import Storage from '@konata9/storage.js';
import { format } from '@konata9/milk-shake';
import Authorized from '@/utils/Authorized';
import * as MenuAction from '@/services/Merchant/merchant';
import { ERROR_OK } from '@/constants/errorCode';
// import routeConfig from '@/config/devRouter';
import routeConfig from '@/config/router';

import { env, FIRST_MENU_ORDER } from '@/config';

const { check } = Authorized;

// Conversion router to menu.
function formatter(data, parentAuthority, parentName) {
	return data
		.map(item => {
			if (!item.name || !item.path) {
				return null;
			}

			let locale = 'menu';
			if (parentName) {
				locale = `${parentName}.${item.name}`;
			} else {
				locale = `menu.${item.name}`;
			}

			const result = {
				...item,
				name: formatMessage({ id: locale, defaultMessage: item.name }),
				locale,
				authority: item.authority || parentAuthority,
			};
			if (item.routes) {
				const children = formatter(item.routes, item.authority, locale);
				// Reduce memory usage
				result.children = children;
			}
			delete result.routes;
			return result;
		})
		.filter(item => item);
}

const memoizeOneFormatter = memoizeOne(formatter, isEqual);

/**
 * get SubMenu or Item
 */
const getSubMenu = item => {
	// doc: add hideChildrenInMenu
	if (item.children && !item.hideChildrenInMenu && item.children.some(child => child.name)) {
		return {
			...item,
			children: filterMenuData(item.children), // eslint-disable-line
		};
	}
	return item;
};

/**
 * filter menuData
 */
const filterMenuData = menuData => {
	if (!menuData) {
		return [];
	}
	return menuData
		.filter(item => item.name && !item.hideInMenu)
		.map(item => check(item.authority, getSubMenu(item)))
		.filter(item => item);
};
/**
 * 获取面包屑映射
 * @param {Object} menuData 菜单配置
 */
const getBreadcrumbNameMap = menuData => {
	const routerMap = {};

	const flattenMenuData = data => {
		data.forEach(menuItem => {
			if (menuItem.children) {
				flattenMenuData(menuItem.children);
			}
			// Reduce memory usage
			routerMap[menuItem.path] = menuItem;
		});
	};
	flattenMenuData(menuData);
	return routerMap;
};

const memoizeOneGetBreadcrumbNameMap = memoizeOne(getBreadcrumbNameMap, isEqual);

const checkChildrenAuth = (children, authMenuList) =>
	children.filter(child => authMenuList.some(authMenu => authMenu.path.indexOf(child.path) > -1));

const checkMenuAuth = (menuData, authMenuList = []) =>
	menuData
		.filter(menu => authMenuList.some(authMenu => authMenu.base === menu.path.slice(1)))
		.map(menu => {
			const { children = [] } = menu;
			return {
				...menu,
				children: checkChildrenAuth(children, authMenuList),
			};
		});

const flatRoutes = routesList => {
	let result = [];
	routesList.forEach(route => {
		const { routes, id, path, name } = route;
		if (id) {
			result = [...result, { id, path, name }];
		}

		if (routes && routes.length > 0) {
			const childRoutes = flatRoutes(routes);
			result = [...result, ...childRoutes];
		}
	});

	return result;
};

const flattedRoutes = flatRoutes(routeConfig);

export default {
	namespace: 'menu',

	state: {
		menuData: Storage.get('FILTERED_MENU', 'local') || [],
		breadcrumbNameMap: {},
		routes: [],
	},

	effects: {
		*getAuthMenu(_, { call }) {
			const response = yield call(MenuAction.getAuthMenu);
			return response;
		},

		*getMenuData({ payload }, { put }) {
			const { routes, authority } = payload;
			const menuData = filterMenuData(memoizeOneFormatter(routes, authority));
			const breadcrumbNameMap = memoizeOneGetBreadcrumbNameMap(menuData);

			let filteredMenuData = menuData;

			const permissionResult = yield put.resolve({
				type: 'role/getUserPermissionList',
			});
			
			if (!['dev', 'test'].includes(env)) {
				
				const authMenuResult = yield put.resolve({ type: 'getAuthMenu' });

				if (
					permissionResult &&
					permissionResult.code === ERROR_OK &&
					authMenuResult &&
					authMenuResult.code === ERROR_OK
				) {
					const { data: permissionData = {} } = permissionResult || {};
					const { permissionList = [] } = format('toCamel')(permissionData);
					console.log('permissionList, ', permissionList);

					if (permissionList.length === 0) {
						filteredMenuData = [];
					} else {
						const formattedPermissionList = permissionList.map(item => ({
							base: ((item.path || '').slice(1).split('/') || [])[0],
							path: item.path,
						}));
						console.log('formattedPermissionList: ', formattedPermissionList);

						const { data: authMenuData = {} } = authMenuResult || {};
						const { menuList = [] } = format('toCamel')(authMenuData);
						console.log('menu control: ', menuList);

						const filteredPermissionList = formattedPermissionList.filter(item => {
							if (env === 'dev') {
								return FIRST_MENU_ORDER.includes(item.base);
							}
							return (menuList || []).includes(item.base);
						});

						console.log('filteredPermissionList: ', filteredPermissionList);

						if (filteredPermissionList.length > 0) {
							filteredMenuData = checkMenuAuth(menuData, filteredPermissionList);
						}
					}
				}
			}

			yield put({
				type: 'save',
				payload: {
					menuData: filteredMenuData,
					breadcrumbNameMap,
					routes,
				},
			});

			return filteredMenuData;
		},

		goToPath({ payload = {} }) {
			const { pathId = null, urlParams = {}, linkType = null, anchorId = null } = payload;

			const { path } = flattedRoutes.find(route => route.id === pathId) || {};

			console.log('input id:', pathId, '   matched path:', path);
			// console.log(flattedRoutes);

			if (!path) {
				router.push('/exception/404');
			}

			const keyList = Object.keys(urlParams);
			let targetPath = path;
			if (keyList.length > 0) {
				const query = keyList.map(key => `${key}=${urlParams[key]}`).join('&');
				targetPath = `${path}?${query}`;
			}

			if (anchorId) {
				targetPath = `${targetPath}#${anchorId}`;
			}

			const { open, location, origin } = window;

			if (linkType === 'open') {
				open(targetPath);
			} else if (linkType === 'replace') {
				location.replace(targetPath);
			} else if (linkType === 'href') {
				location.href = `${origin}${targetPath}`;
			} else {
				router.push(targetPath);
			}
		},
	},

	reducers: {
		save(state, action) {
			return {
				...state,
				...action.payload,
			};
		},
	},
};
