import { getOrgList, getLayerByUser, deprecate, move, isDeprecatable, enable } from '@/services/organization';
import { ERROR_OK } from '@/constants/errorCode';

// 初始化组织树
const traversalTreeData = (originalList, targetList, hash, maxHeight) => {
	if (originalList instanceof Array) {
		originalList.forEach((item) => {
			const { orgName, orgId, orgStatus /* , height */, orgPid, level } = item;
			let overHeight = false;
			// 判断是否超过6层
			overHeight = maxHeight + level >= 6;
			// 如果父节点是被选项，则其子结点不可选。
			if(hash[orgPid]) {
				hash[orgId] = true;
			}
			const target = {
				title: orgName,
				key: orgId.toString(),
				disabled: !!orgStatus || !!hash[orgId] || overHeight,
				children: [],
			};
			targetList.push(target);
			if(item.children && item.children.length) {
				traversalTreeData(item.children, target.children, hash, maxHeight);
			}
		});
	}
};
// 获得每个结点的深度
// 维护一个height hashTable 保存每个组织的height
const getTreeHeight = (original) => {
	if(original.children && original.children.length) {
		const heights = [];
		original.children.map((item) => {
			// item.height = getTreeHeight(item) + 1;
			const height = getTreeHeight(item) + 1;
			heights.push(height);
			return item;
		});
		return Math.max(...heights);
	}
	return 0;
};
// 遍历组织列表
const traversalOrgList = (originalList) => {
	if (originalList instanceof Array) {
		originalList.forEach((item) => {
			if(item.children) {
				if(item.children.length === 0) {
					delete item.children;
				} else {
					traversalOrgList(item.children);
				}
			}
		});
	}
};

export default {
	namespace: 'organization',
	state: {
		orgList: [],
		treeData: [],
		originalOrgList: [],
		originalLayerTree: [],
		expandedRowKeys: [],
		expandedTreeKeys: [],
		currentCompany: {},
	},
	reducers: {
		updateOrgList(state, { payload }) {
			const { orgList } = payload;
			state.orgList = [...orgList];
		},
		updateTreeData(state, { payload }) {
			const { treeData } = payload;
			state.treeData = [...treeData];
			state.expandedTreeKeys = [treeData[0].key];
		},
		updateOriginalLayerTree(state, { payload }) {
			const { treeList } = payload;
			state.originalLayerTree = [...treeList];
		}
	},
	effects: {

		*initOrgList(_, { call, put }) {

			console.log('---init orgList');

			const response = yield call(getOrgList);
			const { code, data } = response;
			if(code === ERROR_OK) {
				const { orgList } = data;
				traversalOrgList(orgList);
				yield put({
					type: 'updateOrgList',
					payload: {
						orgList,
					},
				});
				yield put({
					type: 'store/getOrgLayer'
				});
			}

		},
		*initLayerTree(_, { call, put }) {
			console.log('---iinitLayerTree');
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
			};
			const response = yield call(getLayerByUser);
			const { code, data } = response;
			if(code === ERROR_OK) {
				const { orgLayer } = data;
				company.children = orgLayer;
				console.log('----company', company);
				yield put({
					type: 'updateOriginalLayerTree',
					payload: {
						treeList: [company]
					}
				});
			}

		},
		*setTreeData({ payload }, { put, select }) {
			const { originalLayerTree } = yield select(state => state.organization);
			console.log('----setTreeDate----');
			console.log(originalLayerTree);
			const { selectedList, type } = payload;
			console.log('----selectedList----',selectedList);
			const targetList = [];
			const hash = {};
			let maxHeight = 0;
			selectedList.forEach((item) => {
				hash[item.orgId] = true;
				const height = getTreeHeight(item) + 1;
				maxHeight = maxHeight < height ? height : maxHeight;
			});

			if(type === 'deprecate') {
				maxHeight -=1;
			}

			console.log('----maxHeight---', maxHeight, type);
			// treeList.map((item) => {
			// 	item.height = getTreeHeight(item) + 1;
			// 	hashTable[item.orgId] = item.height;
			// 	return item;
			// });
			traversalTreeData(originalLayerTree, targetList, hash, maxHeight);
			yield put({
				type: 'updateTreeData',
				payload: {
					treeData: targetList
				}
			});
			return '';
		},
		*deprecate({ payload }, { call }) {
			console.log('-----deprecate---', payload);

			const response = yield call(deprecate, payload);
			const { code } = response;
			if(code === ERROR_OK) {
				return true;
			}
			return false;
		},
		*move({ payload }, { call }) {
			const { selectedIdList, targetPId } = payload;
			console.log('----move---', selectedIdList, targetPId);
			const response = yield call(move, {
				orgCidList: selectedIdList,
				targetOrgPid: targetPId
			});
			const { code } = response;
			if(code === ERROR_OK) {
				return true;
			}
			return false;
		},
		*check({ payload }, { call }) {
			const { orgId } = payload;
			console.log('-----check orgId', orgId);
			const response = yield call(isDeprecatable, {
				orgId
			});
			return response;

		},
		*enable({ payload }, { call }) {
			const { orgId } = payload;
			console.log('----enable---',orgId);
			const response = yield call(enable, {
				orgId
			});
			const { code } = response;
			if(code === ERROR_OK) {
				return true;
			}
			return false;
		}
	}
};
