import { format } from '@konata9/milk-shake';
import {  handleUpload2 } from '../../services/photoLibrary';
import { MESSAGE_TYPE } from '@/constants';
import { ERROR_OK } from '@/constants/errorCode';

export default {
	namespace: 'photoUpload',
	state: {
		fileList: []
	},
	reducers: {
		setFileList(state, { payload }) {
			const { fileList } = payload;
			// console.log('setFileList', fileList);
			state.fileList = fileList;
		},
		clearFileList(state) {
			state.fileList = [];
		},
		changeFile({ fileList }, { payload: { uid, response, imgId /* , status */ } }) {
			// console.log('setFileResponse',response);
			fileList.forEach(item => {
				// console.log(uid, item.uid, status);
				if(uid === item.uid){
					item.response = response;
					item.imgId = imgId;
					// item.status = status;
					// item.uploading = false;
				}
			});
		},
		changeFileStatus({ fileList }, { payload: { response, status } }) {
			// console.log('setFileStatus', response, status);
			fileList.forEach(item => {
				// console.log(response.imgId,item, item.imgId, status);
				if(response.imgId === item.imgId){
					item.response = {
						...item.response,
						...response
					};
					item.status = status;
					item.uploading = false;
				}
			});
		},
		removeFile({ fileList }, { payload: { uid }}) {
			let target = 0;
			fileList.forEach((item, index) => {
				if (uid === item.uid) {
					target = index;
				}
			});

			fileList.splice(target, 1);
			// console.log(fileList);
		}
	},
	effects: {
		*uploadFile({ payload }, { call, put }) {
			// const { uid, data } = payload;

			// const response = yield call(handleUpload, data);
			// const { data: { verifyResult }, code } = response;
			// let status = 'done';

			// if(verifyResult !== 1 || code !== 1) {
			// 	status = 'error';
			// }

			// yield put({
			// 	type: 'changeFile',
			// 	payload: {
			// 		response,
			// 		uid,
			// 		status
			// 	}
			// });
			const { uid, data } = payload;
			// console.log('upload',data, uid);
			const response = yield call(handleUpload2, data);
			// console.log('upload response', response);
			const { code, data: { imgList } } = response;
			if(code === ERROR_OK) {
				const file = imgList[0];
				yield put({
					type: 'changeFile',
					payload: {
						uid,
						response: {
							fileName: file.imgName,
							imgId: file.imgId,
							// code
						},
						imgId: file.imgId
					}
				});
			}
		},
		*uploadFileList({ payload }, { put /* , call */ }) {
			// console.log('upload', payload);
			const { fileList, groupId } = payload;
			// const response = yield call(handleUpload2, { fileList, groupId });
			// const { code, data: list } = response;
			// if(code === ERROR_OK) {
			// 	for( let index = 0, len = list.length; index < len; index++) {
			// 		const file = list[index];
			// 		yield put({
			// 			type: 'changeFile',
			// 			payload: {
			// 				uid: file.uid,
			// 				response: {
			// 					fileName: file.fileName
			// 				},
			// 				imageId: file.imageId
			// 			}
			// 		});
			// 	}
			// }

			// const clientId = yield put.resolve({
			// 	type: 'mqttIpc/getClientId'
			// });

			const clientId = yield put.resolve({
				type: 'mqttStore/getClientId'
			});

			for (let index = 0, len = fileList.length; index < len; index++){
				const file = fileList[index];
				yield put.resolve({
					type: 'uploadFile',
					payload: {
						data: {
							groupId,
							file,
							clientId
						},
						uid: file.uid,
					}
				});
			// 	file.response = result;
			}
		},
		*changeFileList({ payload: { faceList } }, { put }) {
			console.log('change list', faceList);
			for(let index = 0, len = faceList.length; index < len; index++){
				let status = 'done';
				// const file = faceList[index];
				const image = faceList[index];
				if(image.result !== 1) {
					status = 'error';
				}
				yield put({
					type: 'changeFileStatus',
					payload: {
						status,
						response: {
							imgId: image.imgId,
							verifyResult: image.result
						}
					}
				});
			}
		},
		*setUploadHandler({ payload: { handler }}, { put }) {
			const uploadTopic = yield put.resolve({
				type: 'mqttStore/generateTopic',
				payload: {
					service: MESSAGE_TYPE.EVENT,
					action: 'sub'
				}
			});
			// console.log('topic',uploadTopic, handler);
			yield put({
				type: 'mqttStore/subscribe',
				payload: {
					topic: [uploadTopic]
				}
			});
			yield put({
				type: 'mqttStore/setTopicListener',
				payload: {
					service: MESSAGE_TYPE.EVENT,
					handler: message => {
						const { params = [] } = JSON.parse(message);
						const { opcode, param } = format('toCamel')(params[0] || {});
						const { faceExtractionList } = param;
						if(opcode === '0x4201'){
							handler(faceExtractionList);
						}
					}
				}
			});
		},
		*unsubscribeTopic(_, { put }) {
			const eventTopic = yield put.resolve({
				type: 'mqttStore/generateTopic',
				payload: { service: MESSAGE_TYPE.EVENT, action: 'sub' },
			});

			yield put({
				type: 'mqttStore/unsubscribeTopic',
				payload: { topic: eventTopic },
			});
		},
	},
	// subscriptions: {
	// 	mqtt ( { dispatch }) {
	// 		const listeners = [{
	// 			opcode: '0x4201',
	// 			type: MESSAGE_TYPE.EVENT,
	// 			handler: (topic, message) => {
	// 				const { data: { faceExtractList } } = format('toCamel')(message);
	// 				console.log('0x4201',faceExtractList);
	// 				dispatch({
	// 					type: 'changeFileList',
	// 					payload: {
	// 						faceList: faceExtractList
	// 					}
	// 				});
	// 			}
	// 		}];

	// 		dispatch({
	// 			type: 'mqttIpc/addListener',
	// 			payload: listeners
	// 		});
	// 	}
	// }
};