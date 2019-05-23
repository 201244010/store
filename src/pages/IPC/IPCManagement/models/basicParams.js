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
		rotation: false,
		isReading: true,
		isSaving: 'normal'
	},
	reducers:{
		readSn: (state, { payload: { sn }}) => {
			state.sn = sn;
		},
		readData: (state, { payload: { sn, nightMode, indicator, rotation }}) => {
			if (state.sn === sn) {
				state.nightMode = nightMode;
				state.indicator = indicator;
				state.rotation = rotation;
			}
		},
		setReadingStatus: (state, { payload: { status }}) => {
			state.isReading = status;
		},
		setSavingStatus: (state, { payload: { status }}) => {
			state.isSaving = status;
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
				type: 'readSn',
				payload: {
					sn
				}
			});

			yield put({
				type: 'setReadingStatus',
				payload: {
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
							rotation: rotation ? 1 : 0
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
					models: ['FS1', 'SS1'],
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
									rotation: data.rotation === 1
								}
							});
						}

						dispatch({
							type: 'setReadingStatus',
							payload: {
								status: false
							}
						});
					}
				}, {
					opcode: OPCODE.UPDATE,
					models: ['FS1', 'SS1'],
					type: MESSAGE_TYPE.RESPONSE,
					handler: (topic, messages) => {
						const msg = JSON.parse(JSON.stringify(messages));

						if (msg.errcode === ERROR_OK) {
							dispatch({
								type: 'setSavingStatus',
								payload: {
									status: 'success'
								}
							});
						}else{
							dispatch({
								type: 'setSavingStatus',
								payload: {
									status: 'failed'
								}
							});
						};

						setTimeout(() => {
							dispatch({
								type: 'setSavingStatus',
								payload: {
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