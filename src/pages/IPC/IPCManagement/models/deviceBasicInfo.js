const dataFormatter = (item) => ({
		name: item.name,
		type: item.type,
		sn: item.sn,
		img: item.img,
		mode: item.mode || 1
	});
export default {
	namespace: 'deviceBasicInfo',
	state: {},
	reducers: {

		// updateData(state, action) {
		// 	// const { payload } = action;
		// 	// if(payload.errcode === 0){
		// 	// 	message.success('修改成功');
		// 	// 	return {
		// 	// 		...payload,
		// 	// 		status:'success'
		// 	// 	};
		// 	// } else {
		// 	// 	message.error('修改失败，请检查网络或重新设置');
		// 	// 	return {
		// 	// 		...payload,
		// 	// 		status:'error'
		// 	// 	};
		// 	// }
		// },
		readData(state, action) {
			const { payload } = action;
			// console.log(payload);
			return {
				...payload,
				status:''
			};
		}
	},
	effects: {
		*read({ payload: sn }, { put }) {

			const deviceInfo = yield put.resolve({
				type:'ipcList/getDeviceInfo',
				payload: {
					sn
				}
			});
			// console.log(deviceInfo)
			yield put({
				type:'readData',
				payload: dataFormatter(deviceInfo)
			});

		},
		// *update(action, { put, select}) {
		// 	const { payload } = action;

		// 	const cameraId = yield select((state) => {
		// 		//return state.id
		// 		return '1';
		// 	});
		// 	/*
		// 	const response = yield updateCameraInfo({
		// 		cameraId,
		// 		payload
		// 	});
		// 	if(!response.errcode){
		// 		yield put({
		// 			type: 'updateData',
		// 			payload: response
		// 		});
		// 	}
		// 	*/
		// 	yield put({
		// 		type:'updateData',
		// 		payload:{
		// 			...payload,
		// 			errcode:0
		// 		}
		// 	});

		// }
	}
};