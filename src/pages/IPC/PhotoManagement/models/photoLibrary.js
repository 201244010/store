import { ERROR_OK } from '@/constants/errorCode';
import {
	deletePhoto,
	editInfo,
	getLibrary,
	getRange,
	move,
	readPhotoList,
	saveFile,
} from '../../services/photoLibrary';
import { message } from 'antd';
import { formatMessage } from 'umi/locale';


export default {
	namespace: 'photoLibrary',
	state: {
		photoList: [],
		faceList: [],
		total: 0,
		checkList: [],
		ageRange: [],
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
		*getPhotoList({ payload }, { put, call }){
			const head = payload;
			const { pageNum, pageSize, groupId, gender, name, age} = head;
			const request = {
				pageSize,
				pageNum,
				groupId,
			};
			if(head.gender !== -1) {
				request.gender = gender;
			}
			if(head.name !== '') {
				request.name = name;
			}
			if(head.age !== 10) {
				request.age = age;
			}
			const response = yield call(readPhotoList, request);
			const { code, data:{ faceList, totalCount }} = response;
			if(totalCount < pageNum * pageSize && code === ERROR_OK) {
				request.pageNum = Math.ceil(totalCount / pageSize);
				const responseAgain = yield call(readPhotoList, request);
				yield put({
					type: 'readData',
					payload: {
						photoList: responseAgain.data.faceList,
						total: responseAgain.data.totalCount,
					}
				});
			} else if(code === ERROR_OK) {
				yield put({
					type: 'readData',
					payload: {
						photoList: faceList,
						total: totalCount,
					}
				});
			} else {
				message.error(formatMessage({id: 'photoManagement.card.getListError'}));
			}
		},
		*getLibrary(_, {put, call}) {
			const response = yield call(getLibrary);
			const { data: { groupList }} = response;
			if (response.code === ERROR_OK) {
				yield put({
					type: 'readData',
					payload: {
						faceList: groupList,
					}
				});
				return groupList;
			}
			return [];
		},
		*move({payload}, {put, select, call}) {
			// body请求的对象  移库之后去掉选中状态 更新选中列表
			const response = yield call(move, {...payload});
			const { code } = response;
			const { checkList } = yield select(state => state.photoLibrary );
			const moveList = payload.faceIdList;
			if(code === ERROR_OK) {
				const list = checkList.filter(x => moveList.indexOf(x) === -1);
				message.success(formatMessage({id: 'photoManagement.card.moveSuccess'}));
				yield put({
					type: 'readData',
					payload: {
						checkList: list
					}
				});
			} else {
				message.error(formatMessage({id: 'photoManagement.card.moveFail'}));
			}
		},
		*deletePhoto({payload}, {put, call, select}) {
			const response = yield call(deletePhoto, payload);
			const { checkList } = yield select(state => state.photoLibrary );
			const deleteList = payload.faceIdList;
			if(response.code === ERROR_OK) {
				message.success(formatMessage({id: 'photoManagement.card.deleteSuccess'}));
				// 删除成功后，刷新页面  更新checkList
				const list = checkList.filter(x => deleteList.indexOf(x) === -1);
				yield put({
					type: 'readData',
					payload: {
						checkList: list
					}
				});
			} else {
				message.error(formatMessage({id: 'photoManagement.card.deleteFail'}));
			}
		},
		*checked({payload}, {put, select}) {
			const { checkList } = yield select(state => state.photoLibrary);
			const newCheckList = payload.checkList;

			if(payload.isChecked) {
				newCheckList.forEach(item => {
					if(checkList.indexOf(item) === -1) {
						checkList.push(item);
					}
				});

				yield put({
					type: 'readData',
					payload: {
						checkList
					}
				});
			} else {
				// 把checklist里有的删掉
				const list = checkList.filter( x => newCheckList.indexOf(x) === -1);
				yield put({
					type: 'readData',
					payload: {
						checkList: list
					}
				});
			}
		},
		*clearSelect(_, {put}) {
			yield put({
				type: 'readData',
				payload: {
					checkList: []
				}
			});
		},
		*getRange(_,{put, call}) {
			const response = yield call(getRange);
			const { code, data: {ageRangeList} } = response;
			if(code === ERROR_OK) {
				yield put({
					type: 'readData',
					payload: {
						ageRange: ageRangeList
					}
				});
			}
		},
		*saveFile({payload}, { call}) {
			const response = yield call(saveFile, payload);
			if(response.code === ERROR_OK) {
				return response;
			}
			return false;
		},
		*edit({payload}, { call }) {
			const response = yield call(editInfo, payload);
			return response.code === ERROR_OK;
		},
		*clearPhotoList(_, {put}) {
			yield put({
				type: 'readData',
				payload: {
					photoList: [],
					total: 0,
					checkList: []
				}
			});
		}
	}
};