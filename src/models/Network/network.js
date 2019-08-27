import * as Actions from '@/services/network';
import { format } from '@konata9/milk-shake';
import { formatSpeed } from '@/utils/utils';
import { ERROR_OK, MQTT_RES_OK } from '@/constants/errorCode';
import { OPCODE } from '@/constants/mqttStore';

export default {
	namespace: 'network',
	state: {
		networkList: [],
		deviceList: {
			totalCount: 0,
			networkDeviceList: [],
		},
		tabType: {
			wireless: 1,
			qos: 'init',
		},
		qosList: {
			totalCount: 3,
			configList: [
				{
					id: 123,
					name: 'ada',
					config: {
						qos: {
							enable: true,
							source: 'speedtest/default/manual',
							operator: 'user/OEM',
							upBandwidth: '20480',
							downBandwidth: '102400',
							sunmiWeight: '50',
							whiteWeight: '30',
							normalWeight: '20',
						},
					},
				},
			],
		},
		qosInfo: {
			id: 123,
			name: 'ada',
			config: {
				qos: {
					enable: true,
					source: 'speedtest/default/manual',
					operator: 'user/OEM',
					upBandwidth: '20480',
					downBandwidth: '102400',
					sunmiWeight: '50',
					whiteWeight: '30',
					normalWeight: '20',
				},
			},
		},
	},

	effects: {
		*getList(_, { call, put, select }) {
			const response = yield call(Actions.handleNetworkEquipment, 'network/getList');
			if (response && response.code === ERROR_OK) {
				const { data = {} } = response;
				const { networkList: getList } = format('toCamel')(data);
				const { networkList } = yield select(state => state.network);
				const tmpList =
					networkList.length > 0
						? networkList.map(item => {
							const filterNetwork =
									getList.filter(
										items => item.masterDeviceSn === items.masterDeviceSn
									)[0] || {};
							const { activeStatus, networkAlias } = filterNetwork;
							item.activeStatus = activeStatus;
							item.networkAlias = networkAlias;
							return item;
						  })
						: getList;

				yield put({
					type: 'updateState',
					payload: {
						networkList: tmpList,
					},
				});
			}
		},
		*getQosList(_, { call, put }) {
			const response = yield call(Actions.handleNetworkEquipment, 'config/qos/getList');
			if (response && response.code === ERROR_OK) {
				const { data = {} } = response;
				const { totalCount = 0, configList = [] } = format('toCamel')(data);
				yield put({
					type: 'updateState',
					payload: {
						qosList: { totalCount, configList },
					},
				});
			}
			return response;
		},
		*getQosInfo(_, { call, put }) {
			const response = yield call(Actions.handleNetworkEquipment, 'config/qos/getInfo');
			if (response && response.code === ERROR_OK) {
				const { data = {} } = response;
				const qosInfo = format('toCamel')(data);
				yield put({
					type: 'updateState',
					payload: {
						qosInfo,
					},
				});
			}
			return response;
		},
		*createQos({ payload }, { call, put }) {
			const opts = {
				...payload,
			};
			const response = yield call(Actions.handleNetworkEquipment, 'config/qos/create', opts);
			if (response && response.code === ERROR_OK) {
				yield put({
					type: 'getQosList',
				});
			}
			return response;
		},
		*updateQos({ payload }, { call, put }) {
			const opts = {
				...payload,
			};
			const response = yield call(Actions.handleNetworkEquipment, 'config/qos/update', opts);
			if (response && response.code === ERROR_OK) {
				yield put({
					type: 'getQosList',
				});
			}
			return response;
		},
		*deleteQos({payload}, { call, put }) {
			const opts = {
				...payload,
			};
			const response = yield call(Actions.handleNetworkEquipment, 'config/qos/delete', opts);
			if (response && response.code === ERROR_OK) {
				yield put({
					type: 'getQosList',
				});
			}
			return response;
		},
		*getOverview(_, { call, put }) {
			const response = yield call(Actions.handleNetworkEquipment, 'device/getOverview');
			if (response && response.code === ERROR_OK) {
				const { data = {} } = response;
				const { onlineCount = 0, offlineCount = 0 } = format('toCamel')(data);
				yield put({
					type: 'updateState',
					payload: {
						networkOverview: { onlineCount, offlineCount },
					},
				});
			}
			return response;
		},
		*updateAlias({ payload }, { call, put, select }) {
			const { networkId, networkAlias } = payload;
			const response = yield call(Actions.handleNetworkEquipment, 'network/updateAlias', {
				network_id: networkId,
				network_alias: networkAlias,
			});
			const {
				deviceList: { networkDeviceList, totalCount },
			} = yield select(state => state.network);
			const tmpDeviceList = networkDeviceList.map(item => {
				if (item.networkId === networkId) {
					item.networkAlias = networkAlias;
				}
				return item;
			});

			yield put({
				type: 'updateState',
				payload: {
					deviceList: { networkDeviceList: tmpDeviceList, totalCount },
				},
			});

			return response;
		},
		*getListWithStatus(_, { call, put, select }) {
			const response = yield call(
				Actions.handleNetworkEquipment,
				'device/getListWithStatus',
				{
					page_num: 1,
					page_size: 10,
				}
			);
			if (response && response.code === ERROR_OK) {
				const { data = {} } = response;
				const { networkDeviceList: getList, totalCount } = format('toCamel')(data);
				const {
					deviceList: { networkDeviceList },
				} = yield select(state => state.network);
				const tmpList = getList
					.map(item => {
						item.masterDeviceSn = (
							getList.filter(
								items => item.networkId === items.networkId && items.isMaster
							)[0] || {}
						).sn;
						return item;
					})
					.map(item => {
						item.clientCount = (
							networkDeviceList.filter(items => item.sn === items.sn)[0] || {}
						).clientCount;
						item.onlineTime = (
							networkDeviceList.filter(items => item.sn === items.sn)[0] || {}
						).onlineTime;
						return item;
					});
				yield put({
					type: 'updateState',
					payload: {
						deviceList: { networkDeviceList: tmpList, totalCount },
					},
				});
			}
		},
		*unsubscribeTopic(_, { put }) {
			const responseTopic = yield put.resolve({
				type: 'mqttStore/generateTopic',
				payload: { service: 'W1/response', action: 'sub' },
			});

			yield put({
				type: 'mqttStore/unsubscribeTopic',
				payload: { topic: responseTopic },
			});
		},
		*setAPHandler({ payload }, { put }) {
			const { handler } = payload;
			const msgMap = yield put.resolve({
				type: 'mqttStore/putMsg',
			});
			yield put({
				type: 'mqttStore/setTopicListener',
				payload: {
					service: 'W1/response',
					handler: receivedMessage => {
						const { data = [], msgId } = format('toCamel')(JSON.parse(receivedMessage));
						const { opcode, errcode } = data[0] || {};
						const sn = msgMap.get(msgId);
						switch (opcode) {
							case '0x2025':
								if (errcode === 0) {
									const clientNumber = data[0].result.data.length || 0;
									const guestNumber = data[0].result.data.filter(
										item => item.bridge === 'br-guest'
									).length;
									handler({ msgId, opcode, sn, clientNumber, guestNumber });
								}
								break;
							case '0x2040':
								if (errcode === 0) {
									const wan = data[0].result.trafficStats.wan;
									const { speed: upSpeed, unit: upUnit } = formatSpeed(
										wan.curTxBytes
									);
									const { speed: downSpeed, unit: downUnit } = formatSpeed(
										wan.curRxBytes
									);
									handler({
										msgId,
										opcode,
										sn,
										upSpeed,
										upUnit,
										downSpeed,
										downUnit,
									});
								}
								break;
							case '0x2116':
								console.log(data);
								if (errcode === 0) {
									const devices = data[0].result.sonconnect.devices;
									handler({ msgId, opcode, sn, devices });
								}
						}
					},
				},
			});
		},
		*getAPMessage({ payload }, { put }) {
			const { message } = payload;
			const requestTopic = yield put.resolve({
				type: 'mqttStore/generateTopic',
				payload: { service: 'W1/request' },
			});

			yield put({
				type: 'mqttStore/publish',
				payload: {
					topic: requestTopic,
					message,
				},
			});
		},

		*refreshNetworkList({ payload }, { put, select }) {
			const {
				opcode,
				sn,
				guestNumber,
				clientNumber,
				edit = 0,
				upSpeed,
				upUnit,
				downSpeed,
				downUnit,
				devices = [],
			} = payload;
			const {
				networkList,
				deviceList: { totalCount, networkDeviceList },
			} = yield select(state => state.network);
			const tmpList = networkList.map(item => {
				if (item.masterDeviceSn === sn) {
					switch (opcode) {
						case '0x2025':
							return { ...item, guestNumber, clientNumber, edit };
						case '0x2040':
							return { ...item, upSpeed, upUnit, downSpeed, downUnit };
						default:
							return { ...item, edit };
					}
				}
				return { ...item };
			});
			const tmpDeviceList = networkDeviceList.map(item => {
				if (opcode === '0x2116') {
					return {
						...item,
						onlineTime: (devices.filter(items => items.devid === item.sn)[0] || {})
							.uptime,
					};
				}

				if (item.sn === sn) {
					switch (opcode) {
						case '0x2025':
							return { ...item, clientCount: clientNumber };
						case '0x2015':
							return { ...item, reboot: 1 };
						case '0x207a':
							return { ...item, upgrade: 1 };
						case '0x207b':
							return { ...item, upgrade: 1 };
						default:
							return { ...item };
					}
				}

				return { ...item };
			});
			yield put({
				type: 'updateState',
				payload: {
					networkList: tmpList,
					deviceList: {
						totalCount,
						networkDeviceList: tmpDeviceList,
					},
				},
			});
		},

		*subscribeDetail(_, { put }) {
			const responseTopic = yield put.resolve({
				type: 'mqttStore/generateTopic',
				payload: { service: 'W1/response', action: 'sub' },
			});

			yield put({
				type: 'mqttStore/subscribe',
				payload: { topic: responseTopic },
			});
		},

		*unsubscribeDetail(_, { put }) {
			const responseTopic = yield put.resolve({
				type: 'mqttStore/generateTopic',
				payload: { service: 'W1/response', action: 'sub' },
			});

			yield put({
				type: 'mqttStore/unsubscribeTopic',
				payload: { topic: responseTopic },
			});
		},

		*setDetailHandler({ payload = {} }, { put }) {
			const { handler } = payload;
			yield put({
				type: 'mqttStore/setTopicListener',
				payload: {
					service: 'W1/response',
					handler: receivedMessage => {
						const { data = [] } = JSON.parse(receivedMessage);
						// console.log(data);
						const [dataContent, ,] = data;
						const { result: { sonconnect: { devices = [] } = {} } = {}, errcode } =
							dataContent || {};

						if (errcode === MQTT_RES_OK) {
							handler(devices);
						}
					},
				},
			});
		},

		*getDetailList({ payload = {} }, { put }) {
			const { sn = null, networkId = null } = payload;
			const requestTopic = yield put.resolve({
				type: 'mqttStore/generateTopic',
				payload: { service: 'W1/request' },
			});

			yield put({
				type: 'mqttStore/publish',
				payload: {
					topic: requestTopic,
					message: {
						opcode: OPCODE.GET_ROUTES_DETAIL,
						param: { network_id: networkId, sn },
					},
				},
			});
		},

		*changeTabType({ payload = {} }, { put, select }) {
			const { type, value } = payload;
			const { tabType, qosInfo } = yield select(state => state.network);
			yield put({
				type: 'updateState',
				payload: {
					tabType: {
						...tabType,
						[type]: value,
					},
					qosInfo: value === 'create' ? {} : qosInfo
				},
			});
		},
	},

	reducers: {
		updateState(state, action) {
			return {
				...state,
				...action.payload,
			};
		},
	},
};
