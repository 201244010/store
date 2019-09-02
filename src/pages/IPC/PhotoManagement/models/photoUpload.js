import { handleUpload } from '../../services/photoLibrary';

export default {
	namespace: 'photoUpload',
	state: {
		fileList: []
	},
	reducers: {
		setFileList(state, { payload }) {
			const { fileList } = payload;
			console.log('setFileList', fileList);
			state.fileList = fileList;
		},
		clearFileList(state) {
			state.fileList = [];
		},
		changeFile({ fileList }, { payload: { uid, response, status } }) {
			// console.log('setFileStatus');
			fileList.forEach(item => {
				// console.log(uid, item.uid, status);
				if(uid === item.uid){
					item.response = response;
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
			const { uid, data } = payload;

			const response = yield call(handleUpload, data);
			const { data: { verifyResult }, code } = response;
			let status = 'done';

			if(verifyResult !== 1 || code !== 1) {
				status = 'error';
			}

			yield put({
				type: 'changeFile',
				payload: {
					response,
					uid,
					status
				}
			});
		},
		*uploadFileList({ payload }, { put }) {
			const { fileList, groupId } = payload;
			for (let index = 0, len = fileList.length; index < len; index++){
				const file = fileList[index];
				yield put.resolve({
					type: 'uploadFile',
					payload: {
						data: {
							groupId,
							file
						},
						uid: file.uid
					}
				});
			// 	file.response = result;
			}
		}
	}
};