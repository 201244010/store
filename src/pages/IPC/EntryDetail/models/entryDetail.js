import { getFaceLogList } from '../../services/faceLog';
import { getArrivalList, deleteArrivalItem } from '../../services/entryDetail';
import { ERROR_OK } from '@/constants/errorCode';


export default {
	namespace: 'entryDetail',
	state: {
		arrivalList:[],
		faceInfo:{},
		total: 0
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
		*readArrivalList({ payload }, { put }) {
			const { deviceId, faceId, pageNum, pageSize } = payload;
			const response = yield getArrivalList({
				deviceId,
				faceId,
				pageNum,
				pageSize
			});
			const { code, data: { historyList, totalCount } } = response;
			const arrivalList = [];
			for(let i=0;i<historyList.length;i++){
				const shopName = yield put.resolve({
					type:'store/getStoreNameById',
					payload:{
						shopId:historyList[i].shopId
					}
				});
				arrivalList.push({
					shopName,
					...historyList[i]
				});
			}
			if(code === ERROR_OK) {
				yield put({
					type: 'readData',
					payload: {
						arrivalList,
						total: totalCount
					}
				});
			}
		},
		*getFaceInfo({ payload },{ put }){
			const { faceId } = payload;
			const response = yield getFaceLogList({
				faceId
			});
			const groupList = yield put.resolve({
				type:'faceLog/getLibrary'
			});
			const { code, data:{faceList}} = response;
			if(code === ERROR_OK){
				if(faceList.length === 1){
					let name;
					for(let i=0; i<groupList.length; i++){
						if(groupList[i].groupId === faceList[0].groupId){
							name = groupList[i].groupName;
							break;
						}
					}
					const faceInfo = {
						groupName: name,
						...faceList[0]
					};
					yield put({
						type:'readData',
						payload:{
							faceInfo
						}
					});
					return faceInfo;
				}
			}
			return {};
		},
		*deleteArrivalItem({ payload }){
			const { historyIdList } = payload;
			const response = yield deleteArrivalItem({
				historyIdList
			});
			const { code } = response;
			return code;
		}
	},
};