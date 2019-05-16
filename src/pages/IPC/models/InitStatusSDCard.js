import { getSdStatus } from '../InitStatusSDCard/services/InitStatusSDCard';
import { ERROR_OK } from '@/constants/errorCode';



const formatCode = '0x3058';
// const changeStatusCode = '0x3057';


// const Status = {
// 	NO_SDCARD: 0,
// 	NEED_FORMAT: 1,
// 	FORMATED: 2,	//正常状态
// 	UNKNOWN: 3
// };

export default {
	namespace: 'initStatusSDCard',
	state: {
		status:2
	},
	reducers: {
		changeStatus(state, action) {
			console.log(state);
			const { payload } = action;
			state.status = payload;
		}
	},
	effects: {
		*getSdStatus(action, { put }) {
			const { sn } = action;
			const deviceId = yield put.resolve({
				type:'ipcList/getDeviceId',
				payload: {
					sn
				}
			});
			const response = yield getSdStatus({deviceId});
			if(response.code === ERROR_OK ){
				yield put({
					type: 'changeStatus',
					payload:response.status
				});
			}
			return response.status;
		},
		
		*formatSdCard(action, { put }) {
			const { sn } = action;

			const topicPublish = yield put.resolve({
				type:'mqttIpc/generateTopic',
				payload:{
					deviceType: 'SS1',
					messageType: 'request',
					method: 'pub'
				}
			});

			yield put({
				type:'mqttIpc/publish',
				payload:{
					topic: topicPublish,
					message: {
						opcode: formatCode,
						param: {
							sn
						}
					}
				}
			});
		},

	},
};