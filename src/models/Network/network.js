import * as Actions from '@/services/network';
import { ERROR_OK } from '@/constants/errorCode';
import { format } from '@konata9/milk-shake';
// import { formatSpeed } from '@/utils/utils';
// import { OPCODE } from '@/constants/mqttStore';

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
				payload: { service: 'response', action: 'sub' },
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

						const sn = msgMap.get(msgId);
						const clientNumber =
							(((data[0] || {}).result || {}).data || []).length || 0;
						const guestNumber = (((data[0] || {}).result || {}).data || []).filter(
							item => item.bridge === 'br-lan'
						).length;
						// console.log(sn, clientNumber, guestNumber);
						// const wan = data[1].result.traffic_stats.wan;
						// const {speed: upSpeed, unit: upUnit} = formatSpeed(wan.cur_tx_bytes);
						// const {speed: downSpeed, unit: downUnit} = formatSpeed(wan.cur_rx_bytes);
						// console.log(upSpeed, downSpeed);
						// handler({sn, clientNumber, guestNumber, upSpeed, upUnit, downSpeed, downUnit});
						handler({ sn, clientNumber, guestNumber });
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
				type: 'mqttStore/publishArray',
				payload: {
					topic: requestTopic,
					message
				},
			});
		},

		*refreshNetworkList({ payload }, { put, select }) {
			console.log(payload);
			const { sn, guestNumber, clientNumber, edit = 0, errorTip = '' } = payload;
			const {
				networkList,
				deviceList: { totalCount, networkDeviceList },
			} = yield select(state => state.network);
			console.log(networkList);
			const tmpList = networkList.map(item => {
				if (item.masterDeviceSn === sn) {
					return { ...item, guestNumber, clientNumber, edit, errorTip };
				}
				return { ...item, edit: 0, errorTip: '' };
			});
			const tmpDeviceList = networkDeviceList.map(item => {
				if (item.sn === sn) {
					return { ...item, clientCount: clientNumber };
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
