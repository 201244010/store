
import { getOrgList, getLayerByUser, deprecate, move, isDeprecatable, enable } from '../../../services/organization';
import { ERROR_OK } from '@/constants/errorCode';

// 初始化组织树
const traversalTreeData = (originalList, targetList, hash, maxHeight) => {
	if (originalList instanceof Array) {
		originalList.forEach((item) => {
			const { orgName, orgId, orgStatus /* , height */, orgPid, level } = item;
			let overHeight = false;
			// 判断是否超过6层
			overHeight = maxHeight + level >= 6;
			console.log('overheight', overHeight, 'level', level);
			// 如果父节点是被选项，则其子结点不可选。
			if(hash[orgPid]) {
				hash[orgId] = true;
			}
			const target = {
				title: orgName,
				key: orgId,
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
			item.height = getTreeHeight(item) + 1;
			heights.push(item.height);
			return item;
		});
		return Math.max(...heights);
	}
	return 0;
};

export default {
	namespace: 'organization',
	state: {
		orgList: [],
		treeData: [],
		originalOrgList: [],
		originalLayerTree: [],
		expandedRowKeys: [],
	},
	reducers: {
		updateOrgList(state, { payload }) {
			const { orgList } = payload;
			state.orgList = [...orgList];
		},
		updateTreeData(state, { payload }) {
			const { treeData } = payload;
			state.treeData = [...treeData];
		},
		updateOriginalLayerTree(state, { payload }) {
			const { treeList } = payload;
			state.originalLayerTree = [...treeList];
		}
	},
	effects: {

		*initOrgList(_, { call, put }) {

			const response = yield call(getOrgList);
			const { code, data } = response;
			if(code === ERROR_OK) {
				const { orgList } = data;
				yield put({
					type: 'updateOrgList',
					payload: {
						orgList,
					},
				});
			}

			// const orgList = [{
			// 	orgPid: '1',
			// 	orgName: '一级',
			// 	orgTag: 0,
			// 	orgStatus: 0,
			// 	address: '',
			// 	contactPerson: '张三',
			// 	orgId: '11',
			// 	level: 1,
			// 	children: [{
			// 		orgPid: '11',
			// 		orgName: '二级1',
			// 		orgTag: 0,
			// 		orgStatus: 0,
			// 		address: '深圳南山区',
			// 		contactPerson: '张三',
			// 		orgId: '111',
			// 		level: 2,
			// 		children: [{
			// 			orgPid: '111',
			// 			orgName: '三级',
			// 			orgTag: 0,
			// 			orgStatus: 0,
			// 			address: '深圳南山区',
			// 			contactPerson: '张三',
			// 			orgId: '1111',
			// 			level: 3,
			// 			children: [{
			// 				orgPid: '1111',
			// 				orgName: '四级',
			// 				orgTag: 0,
			// 				orgStatus: 0,
			// 				address: '深圳南山区',
			// 				contactPerson: '张三',
			// 				orgId: '11111',
			// 				level: 4,
			// 			}]
			// 		}]
			// 	}, {
			// 		orgPid: '11',
			// 		orgName: '二级2',
			// 		orgTag: 0,
			// 		orgStatus: 0,
			// 		address: '深圳南山区',
			// 		contactPerson: '张三',
			// 		orgId: '112',
			// 		level: 2,
			// 	}]
			// }, {
			// 	orgPid: '1',
			// 	orgName: 'tea',
			// 	orgTag: 0,
			// 	orgStatus: 1,
			// 	address: '深圳南山区',
			// 	province: 13,
			// 	contactPerson: '张三',
			// 	orgId: '12',
			// 	level: 1,
			// 	children: [{
			// 		orgPid: '12',
			// 		orgName: 'tea',
			// 		orgTag: 0,
			// 		orgStatus: 0,
			// 		address: '深圳南山区',
			// 		province: 13,
			// 		contactPerson: '张三',
			// 		orgId: '121',
			// 		level: 1,
			// 		children: [{
			// 			orgPid: '121',
			// 			orgName: 'tea',
			// 			orgTag: 0,
			// 			orgStatus: 0,
			// 			address: '深圳南山区',
			// 			province: 13,
			// 			contactPerson: '张三',
			// 			orgId: '1211',
			// 			level: 3
			// 		}]
			// 	}]
			// }];

			// yield put({
			// 	type: 'updateOrgList',
			// 	payload: {
			// 		orgList,
			// 	},
			// });

		},
		*initLayerTree(_, { call, put }) {

			const response = yield call(getLayerByUser);
			const { code, data } = response;
			if(code === ERROR_OK) {
				yield put({
					type: 'updateOriginalLayerTree',
					payload: {
						treeList: [data]
					}
				});
			}
			// const Layer = {
			// 	orgPid: '',
			// 	orgName: '1',
			// 	orgId: '1',
			// 	orgStatus: 0,
			// 	level: 0,
			// 	children: [{
			// 		orgPid: '1',
			// 		orgName: '11',
			// 		orgId: '11',
			// 		orgStatus: 0,
			// 		level: 1,
			// 		children: [{
			// 			orgPid: '11',
			// 			orgName: '111',
			// 			orgId: '111',
			// 			orgStatus: 0,
			// 			level: 2,
			// 			children: [{
			// 				orgPid: '111',
			// 				orgName: '1111',
			// 				orgId: '1111',
			// 				orgStatus: 0,
			// 				level: 3,
			// 				children: [{
			// 					orgPid: '1111',
			// 					orgName: '11111',
			// 					orgId: '11111',
			// 					orgStatus: 0,
			// 					level: 4,
			// 				}]
			// 			}],
			// 		}, {
			// 			orgPid: '11',
			// 			orgName: '112',
			// 			orgId: '112',
			// 			orgStatus: 0,
			// 			level: 2,
			// 		}]
			// 	}, {
			// 		orgPid: '1',
			// 		orgName: '12',
			// 		orgId: '12',
			// 		orgStatus: 1,
			// 		level: 1,
			// 		children: [{
			// 			orgPid: '12',
			// 			orgName: '121',
			// 			orgId: '121',
			// 			orgStatus: 0,
			// 			level: 2,
			// 			children: [{
			// 				orgPid: '121',
			// 				orgName: '1211',
			// 				orgId: '1211',
			// 				orgStatus: 0,
			// 				level: 3,
			// 			}]
			// 		}]
			// 	}]
			// };
			// yield put({
			// 	type: 'updateOriginalLayerTree',
			// 	payload: {
			// 		treeList: [Layer]
			// 	}
			// });
		},
		*setTreeData({ payload }, { put, select }) {
			const { originalLayerTree } = yield select(state => state.organization);
			const { selectedList, type } = payload;
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
		},
		*deprecate({ payload }, { call }) {
			const { targetPId, selectedOrgId } = payload;
			console.log('-----deprecate---', targetPId, selectedOrgId);
			// return true;

			const response = yield call(deprecate, {
				orgId: selectedOrgId,
				targetOrgPid: targetPId
			});
			const { code } = response;
			if(code === ERROR_OK) {
				return true;
			}
			return false;
		},
		*move({ payload }, { call }) {
			const { selectedIdList, targetPId } = payload;

			const response = yield call(move, {
				orgCidList: selectedIdList,
				orgPid: targetPId
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
			// return true;
			const response = yield call(isDeprecatable, {
				orgId
			});
			return response;

		},
		*enable({ payload }, { call }) {
			const { orgId } = payload;
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
