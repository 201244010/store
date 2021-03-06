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
import { hasCompanyViewPermission } from '@/utils/utils';
import { CompanyPermission } from '@/config/index';
import * as CookieUtil from '@/utils/cookies';

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

const checkMenuAuth = (menuData, authMenuList = []) =>
	menuData
		.filter(menu => authMenuList.some(authMenu => authMenu.path.indexOf(menu.path) > -1))
		.map(menu => {
			const { children = [] } = menu;
			return {
				...menu,
				children: checkMenuAuth(children, authMenuList),
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
		getPathId({ payload }) {
			const { path } = payload;
			const { id: pathId } = flattedRoutes.find(route => route.path === path) || {};
			return pathId;
		},
		*getAuthMenu(_, { call }) {
			const response = yield call(MenuAction.getAuthMenu);
			return response;
		},

		*getMenuData({ payload }, { put, select }) {
			const { storeList } = yield select(state => state.store);
			const { routes, authority } = payload;
			const menuData = filterMenuData(memoizeOneFormatter(routes, authority));
			const breadcrumbNameMap = memoizeOneGetBreadcrumbNameMap(menuData);

			let filteredMenuData = menuData;

			const permissionResult = yield put.resolve({
				type: 'role/getUserPermissionList',
			});

			if (permissionResult && permissionResult.code === ERROR_OK) {
				const { data: permissionData = {} } = permissionResult || {};
				const { permissionList = [] } = format('toCamel')(permissionData);
				console.log('permissionList, ', permissionList);

				const shopId = CookieUtil.getCookieByKey(CookieUtil.SHOP_ID_KEY);
				if (permissionList.length === 0) {
					filteredMenuData = [];
				} else {
					let formattedPermissionList = [];
					if (shopId === 0 && storeList.length !== 1) {
						// 选择在总部层级，且拥有超过1家门店
						// 有总部视角权限——> 添加 数据页，报表
						if (hasCompanyViewPermission(permissionList, storeList)) {
							formattedPermissionList = CompanyPermission.companyView;
						}
						// 添加基础管理路由
						formattedPermissionList = formattedPermissionList.concat(
							permissionList
								.filter(item => {
									const pathList = item.permission.split('/');
									return (
										pathList &&
										pathList[1] === 'basicData' &&
										CompanyPermission.basicData.includes(pathList[2])
									);
								})
								.map(item => ({
									base: ((item.path || item.permission || '')
										.slice(1)
										.split('/') || [])[0],
									path: item.path || item.permission,
								}))
						);
					} else {
						// 单门店视角 或 只有一家门店的shopId=0
						formattedPermissionList = permissionList.map(item => ({
							base: ((item.path || item.permission || '').slice(1).split('/') ||
								[])[0],
							path: item.path || item.permission,
						}));
						if (shopId === 0 && storeList.length === 1) {
							CookieUtil.setCookieByKey(CookieUtil.SHOP_ID_KEY, storeList[0].shopId);
						}
						console.log('shopId', CookieUtil.getCookieByKey(CookieUtil.SHOP_ID_KEY));
					}
					console.log('formattedPermissionList: ', formattedPermissionList);
					if (formattedPermissionList.length > 0) {
						filteredMenuData = checkMenuAuth(menuData, formattedPermissionList);
					} else {
						filteredMenuData = [];
					}
				}

				if (filteredMenuData.length === 0) {
					if (shopId === 0 && storeList.length >= 1) {
						// 权限列表为空时 无该总部组织权限，跳转子门店视角
						CookieUtil.setCookieByKey(CookieUtil.SHOP_ID_KEY, storeList[0].shopId);
						yield put({
							type: 'goToPath',
							payload: { pathId: 'root', urlParams: {}, linkType: 'href' },
						});
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
