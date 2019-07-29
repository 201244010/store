const formatCode = '0x3058';

// const Status = {
// 	NO_SDCARD: 0,
// 	NEED_FORMAT: 1,
// 	FORMATED: 2,	//正常状态
// 	UNKNOWN: 3
// };

export default {
	namespace: 'sdcard',
	effects: {
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