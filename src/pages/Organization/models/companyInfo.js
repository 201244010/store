import typecheck from '@konata9/typecheck.js';
import { format } from '@konata9/milk-shake';
import Storage from '@konata9/storage.js';
import { ERROR_OK } from '@/constants/errorCode';
import * as CookieUtil from '@/utils/cookies';
import * as Action from '@/services/storeManagement/storeList';
import { getOrganizationTree,
	createOrganization,
	updateOrganization,
	getOrganizationInfo,
	getOrgList
} from '@/services/organization';


function getHeight(arr, len) {
	let flag = false;
	const arr1 = [];
	for (let i = 0; i< arr.length; i++) {
		const isAry = Array.isArray(arr[i].children);
		if (isAry) {
			for(let j = 0; j< arr[i].children.length; j ++) {
				arr1.push(arr[i].children[j]);
			}
			flag = true;
		}
	}
	if (flag) {
		len ++;
		return getHeight(arr1,len);
	}
	return len;

}

function allDisable(obj) {
	let children = [];
	if(obj.children && obj.children.length > 0){
		const arr = obj.children.map(item => allDisable(item));
		children = arr;
	}
	return {
		...obj,
		disabled: true,
		key: `${obj.value}`,
		children,
	};
}

function addDisableHandler(level, obj, targetId) {
	let children = [];
	if(obj.value === targetId){
		if(obj.children){
			return allDisable(obj);
		}
	}
	if(obj.children && obj.children.length > 0 && obj.value !== targetId){
		const arr = obj.children.map(item => addDisableHandler(level, item, targetId));
		children = arr;
	}
	if((obj.level && (obj.level + level) > 5) || obj.orgStatus === 1){
		return {
			...obj,
			disabled: true,
			key: `${obj.value}`,
			children,
		};
	}

	return {
		...obj,
		key: `${obj.value}`,
		children
	};
}

function getOrgName(list) {
	return list.reduce((result, item) => {
		let arr = result.concat({
			id: item.orgId,
			name: item.orgName
		}, []);
		arr = arr.concat(item.children && item.children.length > 0 ? getOrgName(item.children) : []);
		return arr;
	}, []);
}

function flattenOrgList(list) {
	return list.reduce((result, item) => {
		let arr = result.concat(item, []);
		arr = arr.concat(item.children && item.children.length > 0 ? flattenOrgList(item.children): []);
		return arr;
	}, []);
}

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

export default {
	namespace: 'companyInfo',
	state: {
		shopTypeList: Storage.get('__shopTypeList__', 'local') || [],
		regionList: Storage.get('__regionList__', 'local') || [],
		orgInfo: {},
		organizationTree: {},
		orgNameList: [],
	},

	effects: {
		*getCurrentHeight(payload){
			const { orgId } = payload;
			const response = yield getOrganizationTree({orgId});
			if (response && response.code === ERROR_OK) {
				const { data } = response;
				const { orgLayer = [] } = data;
				if(orgLayer[0] && orgLayer[0].orgId === orgId){
					if(orgLayer[0].children && orgLayer[0].children.length > 0){
						return getHeight(orgLayer[0].children, 0) + 1;
					}
					return 1;
				}
			}
			// response code !== 0 或者 orgLayer[0].orgId !== orgId 上级组织不可选
			return 6;
		},
		*clearState(_, { put }) {
			yield put({
				type: 'updateState',
				payload: {
					orgInfo: {},
				},
			});
		},
		*getAllOrgName(_, { put }) {
			const { id: userId } = yield put.resolve({
				type: 'global/getUserInfoFromStorage',
			}) || {};

			const companyId = yield put.resolve({
				type: 'global/getCompanyIdFromStorage',
			}) || {};
			if(userId && companyId){
				const response = yield getOrgList({userId, companyId});
				const { code } = response;
				if(code === ERROR_OK){
					const { data: { orgList = []}} = response;
					const result = getOrgName(orgList);

					yield put({
						type: 'updateState',
						payload: {
							orgNameList: result,
						},
					});
				}
			}else{
				yield put({
					type: 'updateState',
					payload: {
						orgNameList: [],
					},
				});
			}



		},
		*createOrganization({ payload },{ put }) {
			const { options } = payload;
			const response = yield createOrganization(options);
			if (response && response.code === ERROR_OK) {
				const data = response.data || {};
				if (!CookieUtil.getCookieByKey(CookieUtil.SHOP_ID_KEY)) {
					CookieUtil.setCookieByKey(CookieUtil.SHOP_ID_KEY, data.orgId);
				}
				yield put.resolve({
					type: 'updateOrgList'
				});
			}
			return response;
		},
		// 当前 key 还是 shopList
		*updateOrgList(_, { put }){
			const { id: userId } = yield put.resolve({
				type: 'global/getUserInfoFromStorage',
			}) || {};

			const companyId = yield put.resolve({
				type: 'global/getCompanyIdFromStorage',
			}) || {};

			yield put({
				type: 'store/getOrgLayer'
			});
			const response = yield getOrgList({userId, companyId});
			if (response && response.code === ERROR_OK) {
				const { data } = response;
				const targetData = format((key) => {
					if(key === 'orgId'){
						return 'shopId';
					}
					if(key === 'orgName'){
						return 'shopName';
					}
					return key;
				})(data);
				const { orgList= [] } = targetData;
				const result = flattenOrgList(orgList);
				Storage.set({ [CookieUtil.SHOP_LIST_KEY]: result }, 'local');
			}
		},
		*updateOrganization({ payload },{ put }) {
			const { options } = payload;
			const response = yield updateOrganization(options);
			if (response && response.code === ERROR_OK) {
				yield put.resolve({
					type: 'updateOrgList'
				});
			}
			return response;
		},

		*getOrganizationInfo( payload , { put }) {
			const { orgId } = payload;
			const response = yield getOrganizationInfo({orgId});
			if (response && response.code === ERROR_OK) {
				const data = response.data || {};
				yield put({
					type: 'updateState',
					payload: {
						orgInfo: data,
					},
				});
			}
		},
		*getShopTypeList(_, { call, put }) {
			const response = yield call(Action.getShopTypeList);
			if (response && response.code === ERROR_OK) {
				const data = response.data || {};
				const shopTypeList = data.shopTypeList || [];
				const formattedShopType = cascaderDataWash(shopTypeList, [
					{ from: 'id', to: 'value' },
					{ from: 'name', to: 'label' },
					{ from: 'child', to: 'children' },
				]);
				Storage.set({ __shopTypeList__: formattedShopType }, 'local');
				yield put({
					type: 'updateState',
					payload: {
						shopTypeList: formattedShopType,
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
		*getOrganizationTreeByUser(_, { put }) {
			const response = yield getOrganizationTree();
			if (response && response.code === ERROR_OK) {
				const { data = {} } = response;
				const targetData = format((key) => {
					if(key === 'orgId'){
						return 'value';
					}
					if(key === 'orgName'){
						return 'title';
					}
					return key;
				})(data);
				const companyId = yield put.resolve({
					type: 'global/getCompanyIdFromStorage',
				});
				const companyName = yield put.resolve({
					type: 'merchant/getCompanyNameById',
					payload: {
						companyId
					}
				});

				const { orgLayer=[] } = targetData;
				const organizationTree = {
					title: companyName,
					value: 0,
					level: 0,
					children: orgLayer,
				};
				yield put({
					type: 'updateState',
					payload: {
						organizationTree,
					},
				});
			}
		},
		*getOrganizationTreeByCompanyInfo({payload}, { select, put }) {
			const { currentLevel, orgId } = payload;
			let organizationTree = yield select((state) => state.companyInfo.organizationTree);

			if (!organizationTree.value){
				yield put.resolve({
					type: 'getOrganizationTreeByUser'
				});
				organizationTree  = yield select((state) => state.companyInfo.organizationTree);
			}
			const result = addDisableHandler(currentLevel, organizationTree, orgId);
			return result;
		},
		*getOrgTreeByOrgId({ payload }){
			const { orgId } = payload;
			const response = yield getOrganizationTree({orgId});
			if (response && response.code === ERROR_OK) {
				const { data = {} } = response;
				return data;
			}
			return {};
		}

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
