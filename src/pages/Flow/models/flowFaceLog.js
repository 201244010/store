import { getFaceLogList } from '@/pages/Flow/IPC/services/faceLog';
import { getLibrary, getRange, move } from '@/pages/Flow/IPC/services/photoLibrary';
import { ERROR_OK } from '@/constants/errorCode';


export default {
	namespace: 'flowFaceLog',
	state: {
		total:0,
		faceLibraryList:[],
		ageRangeList:[],
		faceLogList:[]
	},
	reducers: {
		readData(state, { payload }) {
			return {
				...state,
				...payload
			};
		},
	},
	effects: {
		*moveLibrary({payload}, {call}) {
			const { code } = yield call(move, {...payload});
			return code;
		},
		// 更新store上的ageRangeList，并返回ageRangeCodeMap
		*flowReadAgeRangeList(action, { call, put }) {
			const response = yield call(getRange);
			const { code, data: { ageRangeList = [] } } = response;
			
			if(code === ERROR_OK) {
				yield put({
					type: 'readData',
					payload: {
						ageRangeList
					}
				});
				const ageRangeCodeMap = {};
				for(let i=0; i<ageRangeList.length;i++){
					ageRangeCodeMap[ageRangeList[i].ageRangeCode] = ageRangeList[i].ageRange;
				}
				return ageRangeCodeMap;
			}
			return {};
		},
		*readFaceLogList({payload}, { put }){
			const response = yield getFaceLogList(payload);
			const { code, data } = response;
			let { faceList = [] } = data;
			const { totalCount } = data;
			
			faceList = faceList === null ? [] : faceList;
			const groupList = yield put.resolve({
				type:'getLibrary'
			});

			const faceLogList = faceList.map(item => {
				// O(n²) 
				let name;
				for(let i=0; i<groupList.length; i++){
					if(groupList[i].groupId === item.groupId){
						name = groupList[i].groupName;
						break;
					}
				}
				return {
					action:{
						faceId:item.faceId
					},
					groupName:name,
					ageItem:{
						age: item.age,
						ageRangeCode: item.ageRangeCode
					},
					regFace:item.imgUrl,
					...item
				};
			}
			);

			if(code === ERROR_OK){
				yield put({
					type:'readData',
					payload:{
						faceLogList,
						total:totalCount
					}
				});
			}
		},
		*getLibrary(_, {put, call}) {
			const response = yield call(getLibrary);
			const { data: { groupList }} = response;
			if (response.code === ERROR_OK) {
				yield put({
					type: 'readData',
					payload: {
						faceLibraryList:groupList
					}
				});
				return groupList;
			}
			return [];
		},
	},
};