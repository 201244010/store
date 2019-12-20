import typecheck from '@konata9/typecheck.js';
import { format } from '@konata9/milk-shake';
import Storage from '@konata9/storage.js';
import { ERROR_OK } from '@/constants/errorCode';
import { getOrganizationTree, createOrganization, updateOrganization, getOrganizationInfo, getOrgList } from '@/services/organization';


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

function allDisable(obj, excludeId, level) {
	let children = [];
	if(obj.children && obj.children.length > 0){
		const arr = obj.children.map(item => allDisable(item,excludeId));
		children = arr;
	}
	if(obj.value === excludeId && (obj.level && (obj.level + level) <= 6) && obj.orgStatus !== 1){
		return {
			...obj,
			key: obj.value,
			children,
		};
	}
	return {
		...obj,
		disabled: true,
		key: obj.value,
		children,
	};
}

function addDisableHandler(level, obj, targetId) {
	let children = [];
	if(obj.value === targetId){
		if(obj.children && obj.children.length > 0){
			return allDisable(obj,obj.value, level);
		}
	}
	if(obj.children && obj.children.length > 0 && obj.value !== targetId){
		const arr = obj.children.map(item => addDisableHandler(level, item, targetId));
		children = arr;
	}
	if((obj.level && (obj.level + level) > 6) || obj.orgStatus === 1){
		return {
			...obj,
			disabled: true,
			key: obj.value,
			children,
		};
	}

	return {
		...obj,
		key: obj.value,
		children
	};
}

function getOrgName(list) {
	return list.reduce((result, item) => {
		let arr = result.concat(item.orgName, []);
		arr = arr.concat(item.children && item.children.length > 0 ? getOrgName(item.children) : []);
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
				const { data = {} } = response;
				if(data.children && data.children.length > 0){
					return getHeight(data.children, 0) + 1;
				}
				return 1;
			}
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
			const response = yield getOrgList({
				keyword: '',
				orgTag: -1,
				businessStatus: -1,
			});
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
			

		},
		*createOrganization({ payload }) {
			const { options } = payload;
			const response = yield createOrganization(options);
			return response;
		},

		*updateOrganization({ payload }) {
			const { options } = payload;
			const response = yield updateOrganization(options);
			return response;
		},

		*getOrganizationInfo({ payload }, { put }) {
			console.log('!!!!!!!!!!!!!!!!!');
			console.log('come in');
			console.log(payload);
			const response = yield getOrganizationInfo(payload);
			if (response && response.code === ERROR_OK) {
				const data = response.data || {};
				console.log(data);
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
				yield put({
					type: 'updateState',
					payload: {
						organizationTree: targetData,
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
