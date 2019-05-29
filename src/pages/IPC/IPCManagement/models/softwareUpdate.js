import { detectUpdate } from '../../services/IPCList';
import { MESSAGE_TYPE } from '@/constants';
import { ERROR_OK } from '@/constants/errorCode';


const OPCODE = {
	UPDATE: '0x3140'
};

export default {
	namespace: 'ipcSoftwareUpdate',
	state: {
		needUpdate: false,
		currentVersion: '1.0.0',
		newVersion: '',
		updating: false
	},
	reducers: {
		setCurrentVersion (state, { payload: { version }}) {
			state.currentVersion = version;
		},
		updateStatus (state, { payload: { needUpdate, version }}) {
			state.needUpdate = needUpdate;
			state.newVersion = version;
		},
		setUpdatingStatus (state, { payload: { status }}) {
			state.updating = status;
		}
	},
	effects: {
		*load ({ payload: { sn }}, { put }) {
			console.log('load: ', sn);
			// todo 更新接口后，从ipcList读取；
			yield put({
				type: 'setCurrentVersion',
				payload: {
					version: '1.1.0'
				}
			});
		},
		*detect ({ payload: { sn }}, { put, call }) {
			console.log('detect: ', sn);
			const deviceId = yield put.resolve({
				type: 'ipcList/getDeviceId',
				payload: {
					sn
				}
			});

			const response = yield call(detectUpdate, {
				deviceId
			});

			if (response.code === ERROR_OK) {
				const { data } = response;
				const { needUpdate, version } = data;

				yield put({
					type: 'updateStatus',
					payload: {
						needUpdate,
						version
					}
				});
			}
		},
		*update ({ payload: { sn }}, { put, select }) {
			const newVersion = yield select(state => state.ipcSoftwareUpdate.newVersion);

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
							bin_version: newVersion
						}
					}
				}
			});

			yield put({
				type: 'setUpdatingStatus',
				payload: {
					status: true
				}
			});
		}
	},
	subscriptions: {
		setup({ dispatch }) {
			const listeners = [
				{
					opcode: OPCODE.UPDATE,
					models: ['FS1', 'SS1'],
					type: MESSAGE_TYPE.RESPONSE,
					handler: (topic, messages) => {
						const msg = JSON.parse(JSON.stringify(messages));

						if (msg.errcode === ERROR_OK) {
							dispatch({
								type: 'setUpdatingStatus',
								payload: {
									status: false
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