import { MESSAGE_TYPE } from '@/constants';
import { ERROR_OK } from '@/constants/errorCode';

import { unbind, updateIPCName } from '../../services/IPCList';

const OPCODE = {
	READ: '0x3126'
};


export default {
	namespace: 'ipcBasicInfo',
	state: {
		name: '',
		img: '',
		sn: '',
		type: '',
		status: 'normal',
		ip: '',
		mac: '',
		conntype: ''
	},
	reducers: {
		readData(state, { payload }) {
			return {
				...state,
				...payload
			};
		},
		readNetwork(state, { payload }) {
			const { sn } = payload;
			if(state.sn === sn) {
				return {
					...state,
					...payload
				};
			}
			return state;
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
				type:'readData',
				payload: {
					name,
					img,
					type,
					sn,
					status: 'loading'
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
	subscriptions: {
		setup({ dispatch }) {
			const listeners = [
				{
					opcode: OPCODE.READ,
					type: MESSAGE_TYPE.RESPONSE,
					handler: (topic, messages) => {
						const msg = JSON.parse(JSON.stringify(messages));
						if (msg.errcode === ERROR_OK) {
							const { data: { sn, network, mac, conntype } } = msg;
							dispatch({
								type: 'readNetwork',
								payload: {
									sn,
									ip: network ? network.lan.ipaddr : '',
									mac,
									conntype,
									status: 'normal',
								}
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