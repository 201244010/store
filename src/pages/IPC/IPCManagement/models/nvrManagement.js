import { MESSAGE_TYPE } from '@/constants';
import { ERROR_OK } from '@/constants/errorCode';


const OPCODE = {
	GET: '0x305e',
	SET: '0x305f'
};

export default {
	namespace: 'nvrManagement',
	state:{
		sn: '',
		nvrState: false,
		loadState: true
	},
	reducers:{
		readData(state, { payload }) {
			return {
				...state,
				...payload
			};
		},
		setOppoSiteState(state){
			const { nvrState } = state;
			return{
				...state,
				nvrState: !nvrState
			};
		}
		
	},
	effects:{
		*read({ payload: { sn }}, { put }) {
			const type = yield put.resolve({
				type:'ipcList/getDeviceType',
				payload:{
					sn
				}
			});

			const topicPublish = yield put.resolve({
				type:'mqttIpc/generateTopic',
				payload:{
					deviceType: type,
					messageType: 'request',
					method: 'pub'
				}
			});

			yield put({
				type:'mqttIpc/publish',
				payload:{
					topic: topicPublish,
					message: {
						opcode: OPCODE.GET,
						param: {
							sn
						}
					}
				}
			});

			yield put({
				type: 'readData',
				payload: {
					sn
				}
			});
		},
		*setNVRState({ payload: { nvrState, sn } }, { put }){
			const type = yield put.resolve({
				type:'ipcList/getDeviceType',
				payload:{
					sn
				}
			});

			const topicPublish = yield put.resolve({
				type:'mqttIpc/generateTopic',
				payload:{
					deviceType: type,
					messageType: 'request',
					method: 'pub'
				}
			});

			yield put({
				type:'mqttIpc/publish',
				payload:{
					topic: topicPublish,
					message: {
						opcode: OPCODE.SET,
						param: {
							sn,
							enable: nvrState ? 1 : 0,
						}
					}
				}
			});

			yield put({
				type: 'readData',
				payload: {
					loadState: true
				}
			});

		}
	},
	subscriptions: {
		setup({ dispatch }) {
			const listeners = [
				{
					opcode: OPCODE.GET,
					type: MESSAGE_TYPE.RESPONSE,
					handler: (topic, messages) => {
						const msg = JSON.parse(JSON.stringify(messages));
						if (msg.errcode === ERROR_OK) {
							const { data } = msg;
							dispatch({
								type: 'readData',
								payload: {
									nvrState: data.enable === 1,
									loadState: false
								}
							});
						}
					}
				}, {
					opcode: OPCODE.SET,
					type: MESSAGE_TYPE.RESPONSE,
					handler: (topic, messages) => {
						const msg = JSON.parse(JSON.stringify(messages));
						if (msg.errcode === ERROR_OK) {
							dispatch({
								type: 'readData',
								payload: {
									loadState: false
								}
							});
							dispatch({
								type: 'setOppoSiteState'
							});
						}
					}
				}
			];
			dispatch({
				type: 'mqttIpc/addListener',
				payload: listeners
			});
		}
	}
};