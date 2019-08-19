import { MESSAGE_TYPE } from '@/constants';
import { ERROR_OK } from '@/constants/errorCode';


export default {
	namespace: 'initialSetting',
	state: {
		status: 'normal',
		sn: '',
		visible: true
	},
	reducers: {
		init( state, { payload: { sn }} ) {
			state.sn = sn;
			state.status = 'normal';
		},
		updateStatus(state, { payload: { sn, status }}) {
			if(state.sn === sn) {
				state.status = status;
			}
		},
		updateVisible(state, { payload: { sn, visible}}) {
			if(state.sn === sn){
				state.visible = visible;
			}
		}

	},
	effects: {
		*reboot ({ payload: { sn }}, { put }) {

			const type = yield put.resolve({
				type:'ipcList/getDeviceType',
				payload:{
					sn
				}
			});
			// console.log(type);
			const topicPublish = yield put.resolve({
				type:'mqttIpc/generateTopic',
				payload: {
					deviceType: type,
					messageType: 'request',
					method: 'pub'
				}
			});
			// console.log(topicPublish);
			yield put({
				type: 'mqttIpc/publish',
				payload: {
					topic: topicPublish,
					message: {
						opcode: '0x3170',
						param: {
							sn,
							action: 'reboot'
						}
					}
				}
			});
			yield put({
				type: 'updateStatus',
				payload: {
					sn,
					status: 'waiting'
				}
			});

		},
		*reset ({ payload: { sn }}, { put }) {

			const type = yield put.resolve({
				type:'ipcList/getDeviceType',
				payload:{
					sn
				}
			});
			const topicPublish = yield put.resolve({
				type:'mqttIpc/generateTopic',
				payload: {
					deviceType: type,
					messageType: 'request',
					method: 'pub'
				}
			});

			yield put({
				type: 'mqttIpc/publish',
				payload: {
					topic: topicPublish,
					message: {
						opcode: '0x3170',
						param: {
							sn,
							action: 'reset'
						}
					}
				}
			});

			yield put({
				type: 'updateStatus',
				payload: {
					sn,
					status: 'waiting'
				}
			});
		},
		*setStatus({ payload: { sn, status }}, { put, select }) {
			let { visible } = yield select(state => state.initialSetting);
			if(status === 'normal') {
				visible = true;
			} else if(status === 'rebootSuccess' || status === 'resetSuccess' || status === 'rebootFailed' || status === 'resetFailed') {
				visible = false;
			}



			yield put({
				type: 'updateVisible',
				payload: {
					sn,
					visible
				}
			});

			yield put({
				type: 'updateStatus',
				payload: {
					sn,
					status
				}
			});


		}
	},
	subscriptions: {
		setup({ dispatch }) {
			const listeners = [
				{
					opcode: '0x3170',
					type: MESSAGE_TYPE.RESPONSE,
					handler: (topic, messages) => {
						const msg = JSON.parse(JSON.stringify(messages));
						const { sn, action } = msg.data;
						let status = '';

						if(msg.errcode === ERROR_OK) {
							// ipc开始重启
							switch(action) {
								case 'reboot':
									status = 'startReboot';
									break;
								case 'reset':
									status = 'startReset';
									break;
								default: break;
							}
						} else {

							switch(action) {
								case 'reboot':
									status = 'rebootFailed';
									break;
								case 'reset':
									status = 'resetFailed';
									break;
								default: break;
							}
						}
						dispatch({
							type: 'setStatus',
							payload: {
								sn, status
							}
						});
					}
				},{
					opcode: '0x4200',
					type: 'event',
					handler: (topic, messages) => {
						const msg = JSON.parse(JSON.stringify(messages));
						// console.log(msg);
						const { sn } = msg.data;
						const status = 'success';
						dispatch({
							type: 'setStatus',
							payload: {
								sn, status
							}
						});
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