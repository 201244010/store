import { detectUpdate } from '../../services/IPCList';
import { MESSAGE_TYPE } from '@/constants';
import { ERROR_OK } from '@/constants/errorCode';

const OPCODE = {
	START_UPDATE: '0x3140',
	// END_UPDATE: '0x31xx'
};

export default {
	namespace: 'ipcSoftwareUpdate',
	state: {
		needUpdate: false,
		currentVersion: '0.0.0',
		lastCheckTime: 0,
		newVersion: '',
		updating: 'normal',
		url: '',
		sn: '',
	},
	reducers: {
		init(
			state,
			{
				payload: { sn },
			}
		) {
			state.sn = sn;
		},
		setCurrentVersion(
			state,
			{
				payload: { sn, version },
			}
		) {
			// console.log('inn: ', version);
			if (state.sn === sn) {
				state.currentVersion = version;
			}
		},
		setLastCheckTime(
			state,
			{
				payload: { sn, time },
			}
		) {
			if (state.sn === sn) {
				state.lastCheckTime = time;
			}
		},
		updateStatus(
			state,
			{
				payload: { needUpdate, version, url },
			}
		) {
			state.needUpdate = needUpdate;
			state.newVersion = version;
			state.url = url;
		},
		setUpdatingStatus(
			state,
			{
				payload: { sn, status },
			}
		) {
			// console.log(status);
			if (state.sn === sn) {
				state.updating = status;
			}
		},
	},
	effects: {
		*load(
			{
				payload: { sn },
			},
			{ put }
		) {
			const ipcInfo = yield put.resolve({
				type: 'ipcList/getDeviceInfo',
				payload: {
					sn,
				},
			});

			yield put({
				type: 'init',
				payload: {
					sn,
				},
			});

			yield put({
				type: 'setCurrentVersion',
				payload: {
					sn,
					version: ipcInfo.binVersion,
				},
			});

			yield put({
				type: 'setLastCheckTime',
				payload: {
					sn,
					time: ipcInfo.checkTime,
				},
			});
		},
		*detect(
			{
				payload: { sn },
			},
			{ put, call }
		) {
			// console.log('detect: ', sn);
			const deviceId = yield put.resolve({
				type: 'ipcList/getDeviceId',
				payload: {
					sn,
				},
			});

			const response = yield call(detectUpdate, {
				deviceId,
			});

			if (response.code === ERROR_OK) {
				const { data } = response;
				const { needUpdate, version, url } = data;
				// console.log(needUpdate, version, url);
				yield put({
					type: 'updateStatus',
					payload: {
						needUpdate,
						version,
						url,
					},
				});
			}
		},
		*update(
			{
				payload: { sn },
			},
			{ put, select }
		) {
			const { newVersion, url } = yield select(state => state.ipcSoftwareUpdate);

			const type = yield put.resolve({
				type: 'ipcList/getDeviceType',
				payload: {
					sn,
				},
			});

			const topicPublish = yield put.resolve({
				type: 'mqttIpc/generateTopic',
				payload: {
					deviceType: type,
					messageType: 'request',
					method: 'pub',
				},
			});

			yield put({
				type: 'mqttIpc/publish',
				payload: {
					topic: topicPublish,
					message: {
						opcode: OPCODE.START_UPDATE,
						param: {
							sn,
							bin_version: newVersion,
							url,
						},
					},
				},
			});

			yield put({
				type: 'setUpdatingStatus',
				payload: {
					sn,
					status: 'loading',
				},
			});
		},
		*getNewVersion(_, { select }) {
			const newVersion = yield select(
				state =>
					// console.log(state, state.ipcSoftwareUpdate);
					state.ipcSoftwareUpdate.newVersion
			);
			// console.log('newVersion: ', newVersion);
			return newVersion;
		},
	},
	subscriptions: {
		setup({ dispatch }) {
			const listeners = [
				{
					opcode: OPCODE.START_UPDATE,
					type: MESSAGE_TYPE.RESPONSE,
					handler: (topic, messages) => {
						// IPC返回开始升级
						const msg = JSON.parse(JSON.stringify(messages));
						const { sn } = msg.data;
						if (msg.errcode === ERROR_OK) {
							const status = 'success';
							dispatch({
								type: 'getNewVersion',
							}).then(version => {
								// console.log('version: ', version);
								dispatch({
									type: 'setUpdatingStatus',
									payload: {
										sn,
										status,
									},
								});

								dispatch({
									type: 'setCurrentVersion',
									payload: {
										sn,
										version,
									},
								});
							});
						} else {
							const status = 'failed';

							dispatch({
								type: 'setUpdatingStatus',
								payload: {
									sn,
									status,
								},
							});
						}
					},
				},
			];

			dispatch({
				type: 'mqttIpc/addListener',
				payload: listeners,
			});
		},
	},
};
