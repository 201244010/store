import { MESSAGE_TYPE } from '@/constants';
import { ERROR_OK } from '@/constants/errorCode';

const opCode = {
	read: '0x3060',
	wifiList: '0x3061',
	connect: '0x3062'
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
			// console.log(status);
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
					status: true
				}
			});
			// console.log(topic);
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
					status: true
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
						opcode: opCode.connect,
						param: {
							sn,
							ssid,
							pin: password
						}
					}
				}
			});

		}
	},
	subscriptions: {
		setup({ dispatch }) {
			const listeners = [
				{
					opcode: opCode.read,
					type: MESSAGE_TYPE.RESPONSE,
					handler: (topic, messages) => {
						const msg = JSON.parse(JSON.stringify(messages));

						if (msg.errcode === ERROR_OK) {
							const { data } = msg;

							const { ssid } = data;

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
				},
				{
					opcode: opCode.wifiList,
					type: MESSAGE_TYPE.RESPONSE,
					handler: (topic, messages) => {
						const msg = JSON.parse(JSON.stringify(messages));

						if (msg.errcode === ERROR_OK) {
							const { data } = msg;

							const { wifi_list: wifiList } = data;

							const list = wifiList.map(item => ({
								ssid: item.ssid,
								isEncrypted: item.pin_required === 1
							}));

							dispatch({
								type: 'updateWifiList',
								payload: {
									list
								}
							});

							dispatch({
								type: 'changeLoadingWifiStatus',
								payload: {
									status: false
								}
							});
						}
					}
				},
				{
					opcode: opCode.connect,
					type: MESSAGE_TYPE.RESPONSE,
					handler: (topic, messages) => {
						const msg = JSON.parse(JSON.stringify(messages));

						if (msg.errcode === ERROR_OK) {
							dispatch({
								type: 'connectWifiSucceed',
								payload: {
									status: false
								}
							});
						}else{
							dispatch({
								type: 'connectWifiFailed',
								payload: {
									status: false
								}
							});
						}
					}
				},
			];

			dispatch({
				type: 'mqttIpc/addListener',
				payload: listeners
			});
		}
	}
};