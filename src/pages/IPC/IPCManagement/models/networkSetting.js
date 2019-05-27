import { MESSAGE_TYPE } from '@/constants';

const opCode = {
	read: '0x0000',
	wifiList: '0x0001'
};

export default {
	namespace: 'ipNetworkSetting',
	state: {
		ssid: 'TP_Link_166',
		loadingSsid: true,
		wifiList: [],
		loadingWifiList: true,
		isConnected: 'normal'
	},
	reducers: {
		readSsid: (_, { payload: { ssid }}) => ({
			ssid
		}),
		changeLoadingSsidStatus: (state, {payload: { status }}) => {
			state.loadingSsid = status;
		},
		changeLoadingWifiStatus: (state, {payload: { status }}) => {
			console.log(status);
			state.loadingWifiList = status;
		},
		updateWifiList: (state, {payload: { list }}) => {
			state.wifiList = [
				...list
			];
		},
		connectWifiSucceed: (state, { payload: { ssid } }) => {
			state.ssid = ssid;
			state.isConnected = 'connected';
		},
		connectWifiFailed: (state) => {
			state.isConnected = 'failed';
		}
	},
	effects: {
		*read({ sn }, { put }) {
			const deviceType = yield put.resolve({
				type: 'ipcList/getDeviceType',
				payload: {
					sn
				}
			});

			const topic = yield put.resolve({
				type:'mqttIpc/generateTopic',
				payload: {
					deviceType,
					messageType: 'request',
					method: 'pub'
				}
			});

			yield put({
				type: 'mqttIpc/publish',
				payload: {
					topic,
					message: {
						opcode: opCode.read,
						param: {
							sn
						}
					}
				}
			});

			yield put({
				type: 'changeLoadingSsidStatus',
				payload: {
					status: false // 临时先改成false，方便调试
				}
			});
			console.log(topic);
		},
		// *update(action, { put, select }) {

		// },
		*loadWifiList({ sn }, { put }) {
			const deviceType = yield put.resolve({
				type: 'ipcList/getDeviceType',
				payload: {
					sn
				}
			});

			const topic = yield put.resolve({
				type:'mqttIpc/generateTopic',
				payload: {
					deviceType,
					messageType: 'request',
					method: 'pub'
				}
			});

			yield put({
				type: 'mqttIpc/publish',
				payload: {
					topic,
					message: {
						opcode: opCode.wifiList,
						param: {
							sn
						}
					}
				}
			});

			yield put({
				type: 'changeLoadingWifiStatus',
				payload: {
					status: false
				}
			});

			// 临时代码
			yield put({
				type: 'updateWifiList',
				payload: {
					list: [
						{
							ssid: '测试1',
							isEncrypted: true
						},
						{
							ssid: '测试2',
							isEncrypted: false
						}
					]
				}
			});
		},
		*connect({ payload: { sn, ssid, password }}, { put }){
			const deviceType = yield put.resolve({
				type: 'ipcList/getDeviceType',
				payload: {
					sn
				}
			});

			const topic = yield put.resolve({
				type:'mqttIpc/generateTopic',
				payload: {
					deviceType,
					messageType: 'request',
					method: 'pub'
				}
			});

			yield put({
				type: 'mqttIpc/publish',
				payload: {
					topic,
					message: {
						opcode: opCode.wifiList,
						param: {
							sn,
							ssid,
							password
						}
					}
				}
			});

			// 临时代码
			yield put({
				type: 'connectWifiFailed',
				payload: {
					ssid
				}
			});

		}
	},
	subscriptions: {
		setup({ dispatch }) {
			const listeners = [
				{
					opcode: opCode.read,
					models: ['FS1', 'SS1'],
					type: MESSAGE_TYPE.RESPONSE,
					handler: (topic, messages) => {
						console.log(topic, messages);

						const ssid = messages;

						dispatch({
							type: 'readSsid',
							payload: {
								ssid
							}
						});

						dispatch({
							type: 'changeLoadingSsidStatus',
							payload: {
								status: false
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