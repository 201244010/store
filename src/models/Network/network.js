import * as Actions from '@/services/network';
import { ERROR_OK, MQTT_RES_OK } from '@/constants/errorCode';
import { format } from '@konata9/milk-shake';
import { formatSpeed } from '@/utils/utils';
import { OPCODE } from '@/constants/mqttStore';

export default {
	namespace: 'network',
	state: {
		networkList: [
			// {
			// 	networkAlias: '12313',
			// 	networkId: 'bac72ca1e0684c0c8ffe1d89b8cefd00',
			// 	masterDeviceSn: 'W10118AC00018',
			// },
			// {
			// 	networkAlias: '312312',
			// 	networkId: '565635225a334d2ba9f9935f8c612b20',
			// 	masterDeviceSn: 'W10118AC00059',
			// },
			// {
			// 	networkAlias: '31231',
			// 	networkId: '2cd01f3293344ad186c9ef798772efe3',
			// 	masterDeviceSn: 'W101P8CC00069',
			// },
		],
		deviceList: {
			totalCount: 0,
			networkDeviceList: [],
		},
	},

	effects: {
		*getList(_, { call, put }) {
			const response = yield call(Actions.handleNetworkEquipment, 'network/getList');
			if (response && response.code === ERROR_OK) {
				const { data = {} } = response;
				const { networkList } = format('toCamel')(data);
				yield put({
					type: 'updateState',
					payload: {
						networkList,
					},
				});
			}
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
		*updateAlias({ networkId, networkAlias }, { call }) {
			const response = yield call(Actions.handleNetworkEquipment, 'network/updateAlias', {
				networkId,
				networkAlias,
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
				const { networkDeviceList, totalCount } = format('toCamel')(data);
				const { networkList } = yield select(state => state.network);
				const tmpNetworkList = [];
				networkList.map(item => {
					networkDeviceList.map(items => {
						if (item.masterDeviceSn === items.sn) {
							tmpNetworkList.push({ ...item, online: items.activeStatus });
						}
					});
				});
				// console.log(tmpNetworkList);
				yield put({
					type: 'updateState',
					payload: {
						deviceList: { networkDeviceList, totalCount },
						networkList: tmpNetworkList,
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
		*setAPHandler({ payload }, { put, select }) {
			const { handler } = payload;
			const { networkList } = yield select(state => state.network);
			console.log(networkList);
			const msgMap = yield put.resolve({
				type: 'mqttStore/putMsg',
			});
			yield put({
				type: 'mqttStore/setTopicListener',
				payload: {
					service: 'W1/response',
					handler: receivedMessage => {
						const { data = [], msgId } = format('toCamel')(JSON.parse(receivedMessage));
						console.log('data', data, msgId);
						const { opcode, errcode } = data[0] || {};
						const sn = msgMap.get(msgId);
						if (opcode === '0x2025' && errcode === 0) {
							const clientNumber = data[0].result.data.length || 0;
							const guestNumber = data[0].result.data.filter(
								item => item.bridge === 'br-guest'
							).length;
							handler({ msgId, opcode, sn, clientNumber, guestNumber });
						}

						if (opcode === '0x2040' && errcode === 0) {
							const wan = data[0].result.trafficStats.wan;
							const { speed: upSpeed, unit: upUnit } = formatSpeed(wan.curTxBytes);
							const { speed: downSpeed, unit: downUnit } = formatSpeed(
								wan.curRxBytes
							);
							handler({ msgId, opcode, sn, upSpeed, upUnit, downSpeed, downUnit });
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
			console.log(payload);
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
			} = payload;
			const {
				networkList,
				deviceList: { totalCount, networkDeviceList },
			} = yield select(state => state.network);
			console.log(networkList);
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
				if (item.sn === sn) {
					switch (opcode) {
						case '0x2025':
							return { ...item, clientCount: clientNumber };
						default:
							return { ...item };
					}
				}
				return { ...item };
			});
			console.log(tmpList, tmpDeviceList);
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
