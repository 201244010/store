import { formatMessage } from 'umi/locale';
import { message } from 'antd';
import typecheck from '@konata9/typecheck.js';
import { format } from '@konata9/milk-shake';
import Storage from '@konata9/storage.js';
import { ERROR_OK } from '@/constants/errorCode';
import * as Action from '@/services/storeManagement/storeList';
import { getLayerByUser, getOrgList, getLayer } from '@/services/organization';
import * as CookieUtil from '@/utils/cookies';

const cascaderDataWash = (data, mapping) => {
	const formatData = [...data];
	return formatData.map(item => {
		const temp = { ...item };
		mapping.forEach(map => {
			if (temp[map.from]) {
				if (typecheck(temp[map.from]) === 'array') {
					temp[map.to] = cascaderDataWash(temp[map.from], mapping);
				} else {
					temp[map.to] = temp[map.from];
				}
			}
		});

		return temp;
	});
};

const traversalTreeData = (originalList, targetList) => {
	if (originalList instanceof Array) {
		originalList.forEach((item) => {
			const { orgName, orgId, userBindStatus } = item;
			const target = {
				title: orgName,
				value: orgId,
				disabled: !userBindStatus,
				children: [],
			};
			targetList.push(target);
			if(item.children && item.children.length) {
				traversalTreeData(item.children, target.children);
			}
		});
	}
};

const mapTreetoArray = (originalTree, targetList) => {
	if (originalTree instanceof Array) {
		originalTree.forEach((item) => {
			const { orgId, orgName } = item;
			const target = {
				...item,
				shopId: orgId,
				shopName: orgName,
			};
			targetList.push(target);
			if(item.children && item.children.length) {
				mapTreetoArray(item.children, targetList);
			}
		});
	}
};

export default {
	namespace: 'store',
	state: {
		storeList: Storage.get(CookieUtil.SHOP_LIST_KEY, 'local') || [],
		allStores: Storage.get(CookieUtil.SHOP_LIST_KEY, 'local') || [],
		searchFormValue: {
			keyword: '',
			typeOne: 0,
			typeTwo: 0,
		},
		// TODO 下一个准备修改
		getList: {
			data: [],
		},
		saasBindInfo: {},
		loading: false,
		getOption: {},
		shopType_list: Storage.get('__shopTypeList__', 'local') || [],
		regionList: Storage.get('__regionList__', 'local') || [],
		storeInfo: {},
		alter: {
			name: '',
			type: '',
			status: 1,
			address: '',
			time: '',
			contactPerson: '',
			contactPhone: '',
			shopId: '',
			createdTime: '',
			modifiedTime: '',
		},
		pagination: {
			current: 1,
			pageSize: 10,
			total: 0,
			showSizeChanger: true,
			showQuickJumper: true,
		},
		authKey: {},
		treeData: [],
	},

	effects: {
		setShopIdInCookie({ payload = {} }) {
			const { shopId } = payload;
			CookieUtil.setCookieByKey(CookieUtil.SHOP_ID_KEY, shopId);
		},

		removeShopIdInCookie() {
			CookieUtil.removeCookieByKey(CookieUtil.SHOP_ID_KEY);
		},

		setShopListInStorage({ payload }) {
			const { shopList = [] } = payload;
			Storage.set({ [CookieUtil.SHOP_LIST_KEY]: shopList }, 'local');
		},

		*getStoreNameById({ payload }, { put }) {
			const { shopId } = payload;
			const response = yield put.resolve({
				type: 'getStoreList',
				payload: {},
			});
			let name = '';
			if (response && response.code === ERROR_OK) {
				const data = response.data || {};
				const shopList = data.shopList || [];
				shopList.map(item => {
					if (item.shopId === shopId) {
						name = item.shopName;
					}
				});
			}
			// console.log(name);
			return name;
		},
		*changeSearchFormValue({ payload }, { put, select }) {
			const { options = {} } = payload;
			const { searchFormValue } = yield select(state => state.store);
			yield put({
				type: 'updateState',
				payload: {
					searchFormValue: {
						...searchFormValue,
						...options,
					},
				},
			});
		},

		*updatePagination({ payload = {} }, { put, select }) {
			const { options = {} } = payload;
			const { pagination } = yield select(state => state.store);
			yield put({
				type: 'updateState',
				payload: {
					pagination: {
						...pagination,
						...options,
					},
				},
			});
		},

		*getStoreList({ payload = {} }, { call, put, select }) {
			const { options: { current = 1 } = {}, options = {} } = payload;
			const { searchFormValue, pagination } = yield select(state => state.store);
			const opts = {
				...searchFormValue,
				...pagination,
				...options,
				page_size: 999,
			};
			yield put({
				type: 'updateState',
				payload: { loading: true },
			});
			// yield put({
			// 	type: 'getOrgLayer'
			// });
			// const response2 = yield call(Action.getList, opts);
			const response = yield call(getOrgList);
			if (response && response.code === ERROR_OK) {
				const data = response.data || {};
				// const shopList = data.shopList || [];
				// const newPayload = {
				// 	loading: false,
				// 	storeList: shopList,
				// 	pagination: {
				// 		...pagination,
				// 		current,
				// 	},
				// };

				const { orgList = {} } = data;
				const targetList = [];
				mapTreetoArray(orgList, targetList);
				console.log('------shopList----', targetList);
				const newPayload = {
					loading: false,
					storeList: targetList,
					pagination: {
						...pagination,
						current,
					},
				};
				if (opts.type !== 'search') {
					newPayload.allStores = targetList;
				}

				// yield put({
				// 	type: 'setShopListInStorage',
				// 	payload: { shopList },
				// });

				yield put({
					type: 'updateState',
					payload: newPayload,
				});
				return {
					code: response.code,
					data: {
						shopList: targetList,
					}
				};
			}
			yield put({
				type: 'updateState',
				payload: { loading: false },
			});

			return response;
		},

		*createNewStore({ payload }, { call, put }) {
			const { options } = payload;
			yield put({
				type: 'updateState',
				payload: { loading: true },
			});
			const response = yield call(Action.createStore, options);
			if (response && response.code === ERROR_OK) {
				message.success(formatMessage({ id: 'storeManagement.message.createSuccess' }));
				const data = response.data || {};
				if (!CookieUtil.getCookieByKey(CookieUtil.SHOP_ID_KEY)) {
					CookieUtil.setCookieByKey(CookieUtil.SHOP_ID_KEY, data.shopId);
				}

				const res = yield put.resolve({
					type: 'getStoreList',
					payload: {},
				});

				const { data: { shopList } = {} } = res || {};
				// const { storeList } = yield select(state => state.store);
				Storage.set({ [CookieUtil.SHOP_LIST_KEY]: shopList }, 'local');

				yield put({
					type: 'menu/goToPath',
					payload: {
						pathId: 'storeList',
					},
				});
			} else {
				yield put({
					type: 'updateState',
					payload: { loading: false },
				});
			}
			return response;
		},

		*updateStore({ payload }, { select, call, put }) {
			const { options } = payload;
			yield put({
				type: 'updateState',
				payload: { loading: true },
			});
			const response = yield call(Action.alterStore, options);
			if (response && response.code === ERROR_OK) {
				message.success(formatMessage({ id: 'storeManagement.message.alterSuccess' }));

				yield put({
					type: 'getStoreList',
					payload: {},
				});
				const { storeList } = yield select(state => state.store);
				Storage.set({ [CookieUtil.SHOP_LIST_KEY]: storeList }, 'local');

				// yield put({
				// 	type: 'menu/goToPath',
				// 	payload: {
				// 		pathId: 'storeList',
				// 	},
				// });
				// router.push(`${MENU_PREFIX.STORE}/list`);
			} else {
				yield put({
					type: 'updateState',
					payload: { loading: false },
				});
			}
			return response;
		},

		*getStoreDetail({ payload }, { call, put }) {
			const { options } = payload;
			yield put({
				type: 'updateState',
				payload: { loading: true },
			});
			const response = yield call(Action.storeInformation, options);
			if (response && response.code === ERROR_OK) {
				const data = response.data || {};
				yield put({
					type: 'updateState',
					payload: {
						loading: false,
						storeInfo: data,
					},
				});
			} else {
				yield put({
					type: 'updateState',
					payload: { loading: false },
				});
			}
		},

		*getStoreInformation({ payload }, { call, put }) {
			const { options } = payload;
			const response = yield call(Action.storeInformation, options);
			if (response && response.code === ERROR_OK) {
				yield put({
					type: 'saveNewStore',
					payload: {
						data: response,
					},
				});
			}
		},

		*alterStoreInformation({ payload }, { call, put }) {
			const { options } = payload;
			const response = yield call(Action.alterStore, options);
			if (response && response.code === ERROR_OK) {
				message.success(formatMessage({ id: 'storeManagement.message.alterSuccess' }));
				yield put({
					type: 'alterStore',
					payload: {
						data: response,
					},
				});
			}
		},

		*getShopTypeList(_, { call, put }) {
			const response = yield call(Action.getShopTypeList);
			if (response && response.code === ERROR_OK) {
				const data = response.data || {};
				const shopType_list = data.shopType_list || [];
				const formattedShopType = cascaderDataWash(shopType_list, [
					{ from: 'id', to: 'value' },
					{ from: 'name', to: 'label' },
					{ from: 'child', to: 'children' },
				]);
				Storage.set({ __shopTypeList__: formattedShopType }, 'local');
				yield put({
					type: 'updateState',
					payload: {
						shopType_list: formattedShopType,
					},
				});
			}
		},

		*getRegionList(_, { call, put }) {
			const response = yield call(Action.getRegionList);
			if (response && response.code === ERROR_OK) {
				const data = response.data || {};
				const region_list = data.region_list || [];
				const formattedRegionList = cascaderDataWash(region_list, [
					{ from: 'name', to: 'label' },
					{ from: 'children', to: 'children' },
					{ from: 'province', to: 'value' },
					{ from: 'city', to: 'value' },
					{ from: 'county', to: 'value' },
				]);
				Storage.set({ __regionList__: formattedRegionList }, 'local');
				yield put({
					type: 'updateState',
					payload: {
						regionList: formattedRegionList,
					},
				});
			}
		},

		*getSaasBindInfo(_, { call, put }) {
			yield put({
				type: 'updateState',
				payload: { loading: true },
			});

			const response = yield call(Action.getSaasBindInfo);
			if (response && response.code === ERROR_OK) {
				const data = response.data || {};
				const { is_bind: isBind = false, saas_info: saasInfo } = data;
				yield put({
					type: 'updateState',
					payload: {
						saasBindInfo: {
							isBind,
							saasInfo,
						},
					},
				});
			}

			yield put({
				type: 'updateState',
				payload: { loading: false },
			});
		},

		*clearState(_, { put }) {
			yield put({
				type: 'updateState',
				payload: {
					storeInfo: {},
				},
			});
		},

		*clearSearch(_, { put }) {
			yield put({
				type: 'updateState',
				payload: {
					searchFormValue: {
						keyword: '',
						typeOne: 0,
						typeTwo: 0,
					},
					pagination: {
						current: 1,
						pageSize: 10,
						total: 0,
						showSizeChanger: true,
						showQuickJumper: true,
					},
				},
			});
		},

		*getImportedErpInfo(_, { call }) {
			const response = yield call(Action.getImportedErpInfo, {});
			return response;
		},

		*getAuthKey({ payload = {} }, { call, put }) {
			const currentShopId = yield put.resolve({
				type: 'global/getShopIdFromStorage',
			});

			const { shopId = null } = payload;
			const response = yield call(Action.getAuthKey, { shopId: shopId || currentShopId });
			if (response && response.code === ERROR_OK) {
				const { data = {} } = response;

				yield put({
					type: 'updateState',
					payload: {
						authKey: format('toCamel')(data),
					},
				});
			}
		},

		*getOrgLayer(_, { call, put }) {
			const companyId = yield put.resolve({
				type: 'global/getCompanyIdFromStorage'
			});
			const companyName = yield put.resolve({
				type: 'merchant/getCompanyNameById',
				payload: {
					companyId
				}
			});
			const company = {
				orgId: 0,
				orgName: companyName,
				orgStatus: 0,
				level: 0,
				orgPid: '',
				userBindStatus: 0,
			};
			const response = yield call(getLayerByUser);
			const { code, data } = response;
			if(response && code === ERROR_OK) {
				const { orgLayer } = data;
				company.children = orgLayer;
				const originalList = [company];
				const targetList = [];
				traversalTreeData(originalList, targetList);
				console.log('-------original--targetList', targetList);
				yield put({
					type: 'updateTreeData',
					payload: {
						treeData: targetList
					}
				});
			}
		},
		*getOrgnazationTree(_, { call }) {
			const response = yield call(getLayer);
			const { code, data } = response;
			if(response && code === ERROR_OK) {
				const { orgLayer } = data;
				return orgLayer;
			}
			return [];
		},
		*updateCompany({ payload }, { put, select }) {
			const { companyName } = format('toCamel')(payload);
			const { treeData } = yield select(state => state.store);
			const { children } = treeData[0];
			const company = {
				title: companyName,
				value: 0,
				disabled: true,
				children,
			};
			const newTree = [company];
			yield put({
				type: 'updateTreeData',
				payload: {
					treeData: newTree
				}
			});
		}
	},

	reducers: {
		updateState(state, action) {
			return {
				...state,
				...action.payload,
			};
		},

		saveStoreList(state, action) {
			const {
				payload: { data },
			} = action;
			const arrayList = data.data.shopList;
			let array = [];
			array = arrayList.map(value => ({
				address: value.address,
				status: value.businessStatus,
				shopId: value.shopId,
				name: value.shopName,
				type: value.typeName,
				contactPerson: value.contactPerson,
				key: value.id,
			}));
			return {
				...state,
				getList: {
					data: array,
				},
			};
		},
		saveNewStore(state, action) {
			const store = action.payload.data.data;
			return {
				...state,
				alter: {
					name: store.shopName,
					type: store.typeName,
					status: store.businessStatus,
					address: store.address,
					time: store.businessHours,
					contactPerson: store.contactPerson,
					contactPhone: store.contactTel,
					shopId: store.shopId,
					createdTime: store.createdTime,
					modifiedTime: store.modified_time,
				},
			};
		},
		alterStore(state) {
			return {
				...state,
			};
		},
		updateTreeData(state, action) {
			const { payload: { treeData }} = action;
			state.treeData = treeData;
		}
	},
};
