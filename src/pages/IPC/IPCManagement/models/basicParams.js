import { MESSAGE_TYPE } from '@/constants';
import { ERROR_OK } from '@/constants/errorCode';


const OPCODE = {
	READ: '0x305c',
	UPDATE: '0x305d'
};

export default {
	namespace: 'ipcBasicParams',
	state:{
		sn: '',
		nightMode: 2,
		indicator: false,
		rotation: 0,
		isReading: true,
		isSaving: 'normal'
	},
	reducers:{
		init: (state, { payload: { sn }}) => {
			state.sn = sn;
		},
		readData: (state, { payload: { sn, nightMode, indicator, rotation }}) => {
			if (state.sn === sn) {
				state.nightMode = nightMode;
				state.indicator = indicator;
				state.rotation = rotation;
			}
		},
		setReadingStatus: (state, { payload: { sn, status }}) => {
			if(state.sn === sn) {
			state.isReading = status;
			}
		},
		setSavingStatus: (state, { payload: { sn, status }}) => {
			if(state.sn === sn) {
			state.isSaving = status;
		}
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
						opcode: OPCODE.READ,
						param: {
							sn
						}
					}
				}
			});

			yield put({
				type: 'init',
				payload: {
					sn
				}
			});

			yield put({
				type: 'setReadingStatus',
				payload: {
					sn,
					status: true
				}
			});
		},
		*update({ payload: { nightMode, indicator, rotation, sn } }, { put }){
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
						opcode: OPCODE.UPDATE,
						param: {
							sn,
							night_mode: nightMode,
							led_indicator: indicator ? 1 : 0,
							// rotation: rotation ? 1 : 0
							rotation
						}
					}
				}
			});

			yield put({
				type: 'readData',
				payload: {
					nightMode,
					indicator,
					rotation,
					sn
				}
			});

			yield put({
				type: 'setSavingStatus',
				payload: {
					sn,
					status: 'saving'
				}
			});

		}
	},
	subscriptions: {
		setup({ dispatch }) {
			const listeners = [
				{
					opcode: OPCODE.READ,
					type: MESSAGE_TYPE.RESPONSE,
					handler: (topic, messages) => {
						const msg = JSON.parse(JSON.stringify(messages));

						if (msg.errcode === ERROR_OK) {
							const { data } = msg;
							dispatch({
								type: 'readData',
								payload: {
									sn: data.sn,
									nightMode: data.night_mode,
									indicator: data.led_indicator === 1,
									rotation: data.rotation
								}
							});

						dispatch({
							type: 'setReadingStatus',
							payload: {
									sn: data.sn,
								status: false
							}
						});
					}

						// dispatch({
						// 	type: 'setReadingStatus',
						// 	payload: {
						// 		sn: msg.data.sn,
						// 		status: false
						// 	}
						// });
					}
				}, {
					opcode: OPCODE.UPDATE,
					type: MESSAGE_TYPE.RESPONSE,
					handler: (topic, messages) => {
						const msg = JSON.parse(JSON.stringify(messages));
						const { sn } = msg.data;
						if (msg.errcode === ERROR_OK) {
							dispatch({
								type: 'setSavingStatus',
								payload: {
									sn,
									status: 'success'
								}
							});
						}else{
							dispatch({
								type: 'setSavingStatus',
								payload: {
									sn,
									status: 'failed'
								}
							});
						};

						setTimeout(() => {
							dispatch({
								type: 'setSavingStatus',
								payload: {
									sn,
									status: 'normal'
								}
							});
						}, 800);
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