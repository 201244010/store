import { getFaceLogList } from '../../services/faceLog';
import { getLibrary, getRange } from '../../services/photoLibrary';
import { ERROR_OK } from '@/constants/errorCode';


export default {
	namespace: 'faceLog',
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
		*readAgeRangeList(action, { call, put }) {
			const response = yield call(getRange);
			const { code, data: {ageRangeList} } = response;
			
			if(code === ERROR_OK) {
				yield put({
					type: 'readData',
					payload: {
						ageRangeList
					}
				});
			}
		},
		*readFaceLogList({payload}, { put }){
			const response = yield getFaceLogList(payload);
			const { code, data: {faceList, totalCount} } = response;
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