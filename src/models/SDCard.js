import { getSdStatus } from '../pages/IPC/services/SDCard';
import { ERROR_OK } from '@/constants/errorCode';

const formatCode = '0x3058';

// const Status = {
// 	NO_SDCARD: 0,
// 	NEED_FORMAT: 1,
// 	FORMATED: 2,	//正常状态
// 	UNKNOWN: 3
// };

export default {
	namespace: 'sdcard',
	state:[],
	reducers:{},
	effects: {
		*formatSdCard(action, { put }) {
			const { sn } = action;
			const deviceType = yield put.resolve({
				type:'ipcList/getDeviceType',
				payload: {
					sn
				}
			});
			const topicPublish = yield put.resolve({
				type:'mqttIpc/generateTopic',
				payload:{
					deviceType,
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
				return response.status;
			}
			return -1;

		},

	},
};