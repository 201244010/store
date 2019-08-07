import * as Actions from '@/services/network';

export default {
	namespace: 'network',
	state: {
		networkOverview: {},
		networkList: [
			{
				networkId: '00747be968e04b6fba3acc96b6619d53',
				networkAlias: 'sjkhtryjiuhkjdk123456',
				masterDeviceSn: 'W101D8BS00002',
			},
		],

		deviceList: {
			totalCount: 216,
			returnCount: 216,
			networkDeviceList: [
				{
					networkId: '00747be968e04b6fba3acc96b6619d53',
					networkAlias: 'sjkhtryjiuhkjdk123456',
					deviceSn: 'W101D8BS00002',
					binVersion: '1.0.3',
					cpuPercent: '60',
					memPercent: '55',
					activeStatus: '0',
					clientCount: 12,
					isMaster: 1,
					isUpgrading: 0,
					isLatestVersion: 0,
				},
			],
		},
	},

	effects: {
		*getApList(_, { call, put }) {
			const response = yield call(Actions.handleNetworkEquipment, 'getApList', {
				page_num: 1,
				page_size: 10,
			});
			if (response && response.code === ERROR_OK) {
				const { data = {} } = response;
				const deviceList = format('toCamel')(data);
				yield put({
					type: 'updateState',
					payload: {
						deviceList,
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
			const response = yield call(Actions.handleNetworkEquipment, 'getOverview');
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
