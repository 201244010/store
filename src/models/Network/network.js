import * as Actions from '@/services/network';
import { ERROR_OK } from '@/constants/errorCode';
import { format } from '@konata9/milk-shake';
import { OPCODE } from '@/constants/mqttStore';

export default {
	namespace: 'network',
	state: {
		networkList: [
			{
				networkAlias: '12313',
				networkId: 'bac72ca1e0684c0c8ffe1d89b8cefd00',
				masterDeviceSn: 'W10118AC00018',
			},
			{
				networkAlias: '312312',
				networkId: '565635225a334d2ba9f9935f8c612b20',
				masterDeviceSn: 'W10118AC00059',
			},
			{
				networkAlias: '31231',
				networkId: '2cd01f3293344ad186c9ef798772efe3',
				masterDeviceSn: 'W101P8CC00069',
			},
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
		*getNetworkList(_, { call, put }) {
			const response = yield call(Actions.handleNetworkEquipment, 'getNetworkList');
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
				// console.log(networkDeviceList)
				// console.log(data, networkDeviceList, totalCount);
				const { networkList } = yield select(state => state.network);
				const tmpNetworkList = [];
				networkList.forEach(item => {
					networkDeviceList.forEach(items => {
						if (item.masterDeviceSn === items.sn) {
							tmpNetworkList.push({ ...item, online: items.activeStatus });
						}
					});
				});
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
				payload: { service: 'response', action: 'sub' },
			});

			yield put({
				type: 'mqttStore/unsubscribeTopic',
				payload: { topic: responseTopic },
			});
		},
		*setAPHandler({ payload }, { put }) {
			const { handler } = payload;
			// const {
			// 	deviceList: { networkDeviceList },
			// } = yield select(state => state.network);
			yield put({
				type: 'mqttStore/setTopicListener',
				payload: {
					service: 'W1/response',
					handler: receivedMessage => {
						const { data } = JSON.parse(receivedMessage);
						// console.log('data', data);
						handler(data);

						// const guestNumber
						// handler(errcode, action, networkConfig);
					},
				},
			});
		},
		*getAPMessage({ payload }, { put }) {
			const { networkId, sn } = payload;
			// console.log(sn);
			const requestTopic = yield put.resolve({
				type: 'mqttStore/generateTopic',
				payload: { service: 'W1/request' },
			});

			yield put({
				type: 'mqttStore/publishArray',
				payload: {
					topic: requestTopic,
					message: [
						{
							opcode: OPCODE.CLIENT_LIST_GET,
							param: {
								network_id: networkId,
								sn,
							},
						},
						{
							opcode: OPCODE.TRAFFIC_STATS_GET,
							param: {
								network_id: networkId,
								sn,
							},
						},
					],
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
						const { data } = JSON.parse(receivedMessage);
						console.log(data);
						handler(data);
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
