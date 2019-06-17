// import { MESSAGE_TYPE } from '@/constants';
import { ERROR_OK } from '@/constants/errorCode';

import { unbind, updateIPCName } from '../../services/IPCList';

// const OPCODE = {
// 	READ: '0x305b'
// };

// const dataFormatter = (item) => ({
// 	name: item.name,
// 	type: item.type,
// 	sn: item.sn,
// 	img: item.img,
// 	mode: item.mode || 1
// });

export default {
	namespace: 'ipcBasicInfo',
	state: {
		name: '',
		img: '',
		sn: '',
		type: '',
		status: 'loading'
	},
	reducers: {
		readData(state, action) {
			const { payload: { name, img, type, sn } } = action;
			// console.log(payload);
			return {
				name,
				img,
				type,
				sn,
				status: 'normal'
			};
		},
		updateData(state, { payload: { name } }) {
			state.name = name;
		},
		// setStatus(state, {payload: { status }}) {
		// 	state.status = status;
		// }
	},
	effects: {
		*read({ payload: { sn } }, { put }) {

			const { name, img, type } = yield put.resolve({
				type:'ipcList/getDeviceInfo',
				payload: {
					sn
				}
			});

			yield put({
				type:'readData',
				payload: {
					name,
					img,
					type,
					sn
				}
			});

		},
		*update({ payload: { sn, name }}, { put, call }) {
			const deviceId = yield put.resolve({
				type: 'ipcList/getDeviceId',
				payload:{
					sn
				}
			});

			const { code } = yield call(updateIPCName, {
				deviceId,
				deviceName: name
			});

			if (code === ERROR_OK) {
				yield put({
					type: 'updateData',
					payload: {
						name
					}
				});
				return true;
			}
			return false;
		},
		*delete({ payload: { sn }}, { put, call }) {
			const deviceId = yield put.resolve({
				type: 'ipcList/getDeviceId',
				payload: {
					sn
				}
			});

			const { code } = yield call(unbind, {
				deviceId
			});

			if (code === ERROR_OK) {
				return true;
			}
			return false;
		}
	},
	// subscriptions: {
	// 	setup({ dispatch }) {
	// 		const listeners = [
	// 			{
	// 				opcode: OPCODE.READ,
	// 				models: ['FS1', 'SS1'],
	// 				type: MESSAGE_TYPE.RESPONSE,
	// 				handler: (topic, messages) => {
	// 					const msg = JSON.parse(JSON.stringify(messages));
	// 					// console.log(msg);
	// 					if (msg.errcode === ERROR_OK) {
	// 						const { data } = msg;
	// 						dispatch({
	// 							type: 'readData',
	// 							payload: {
	// 								name: data.ipc_name
	// 							}
	// 						});

	// 						dispatch({
	// 							type: 'setStatus',
	// 							payload: {
	// 								status: 'success'
	// 							}
	// 						}).then(() => {
	// 							setTimeout(() => {
	// 								// console.log('ccc');
	// 								dispatch({
	// 									type: 'setStatus',
	// 									payload: {
	// 										status: 'normal'
	// 									}
	// 								});
	// 							}, 300);
	// 						});
	// 					}
	// 				}
	// 			}
	// 		];
	// 		dispatch({
	// 			type: 'mqttIpc/addListener',
	// 			payload: listeners
	// 		});
	// 	}
	// }
};