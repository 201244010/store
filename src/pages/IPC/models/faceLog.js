import { formatMessage } from 'umi/locale';
import { getFaceLogList } from '../services/faceLog';
import { getLibrary, getRange, move } from '../services/photoLibrary';
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
		*moveLibrary({payload}, {call}) {
			const { code } = yield call(move, {...payload});
			return code;
		},
		// 更新store上的ageRangeList，并返回ageRangeCodeMap
		*readAgeRangeList(action, { call, put }) {
			const response = yield call(getRange);
			const { code, data: { ageRangeList = [] } } = response;

			if(code === ERROR_OK) {
				const list = ageRangeList.filter(item => item.ageRangeCode !== 1 && item.ageRangeCode !== 2 && item.ageRangeCode!== 3);
				yield put({
					type: 'readData',
					payload: {
						ageRangeList: list
					}
				});
				const ageRangeCodeMap = {};
				for(let i=0; i<ageRangeList.length;i++){
					if( ageRangeList[i].ageRangeCode === 1 || ageRangeList[i].ageRangeCode === 2 || ageRangeList[i].ageRangeCode === 3 || ageRangeList[i].ageRangeCode === 18) {
						ageRangeCodeMap[ageRangeList[i].ageRangeCode] = formatMessage({id: 'photoManagement.ageLessInfo'});
					} else if (ageRangeList[i].ageRange === 8) {
						ageRangeCodeMap[ageRangeList[i].ageRangeCode] = formatMessage({ id: 'photoManagement.ageLargeInfo'});
					} else {
						ageRangeCodeMap[ageRangeList[i].ageRangeCode] = ageRangeList[i].ageRange;
					}
				}
				for(let j=1; j< 4; j++){
					ageRangeCodeMap[j] = formatMessage({id: 'photoManagement.ageLessInfo'});
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