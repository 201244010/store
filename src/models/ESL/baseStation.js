import * as Actions from '@/services/ESL/baseStation';
import { message } from 'antd';
import { formatMessage } from 'umi/locale';
import { ERROR_OK } from '@/constants/errorCode';
import { format } from '@konata9/milk-shake';
import { DEFAULT_PAGE_LIST_SIZE, DEFAULT_PAGE_SIZE, DURATION_TIME } from '@/constants';
import { OPCODE } from '@/constants/mqttStore';

const IN_ENERGY_SAVE = 128;

export default {
	namespace: 'eslBaseStation',
	state: {
		loading: false,
		searchFormValues: {
			keyword: '',
			baseStationID: null,
			status: -1,
		},
		states: [],
		data: [],
		deviceInfoList: [],
		networkIdList: [],
		networkConfig: {},
		pagination: {
			current: 1,
			pageSize: DEFAULT_PAGE_SIZE,
			total: 0,
			pageSizeOptions: DEFAULT_PAGE_LIST_SIZE,
			showSizeChanger: true,
			showQuickJumper: true,
		},
	},
	effects: {
		*changeSearchFormValue({ payload = {} }, { put }) {
			const { options = {} } = payload;
			yield put({
				type: 'setSearchFormValue',
				payload: {
					...options,
				},
			});
		},
		*clearSearch(_, { put }) {
			yield put({
				type: 'updateState',
				payload: {
					searchFormValues: {
						keyword: '',
						baseStationID: null,
						status: -1,
					},
				},
			});
		},
		*fetchBaseStationState(_, { put }) {
			yield put({
				type: 'setBaseStationState',
				payload: [
					{
						status_code: 1,
						status_desc: formatMessage({ id: 'esl.device.ap.status.online' }),
					},
					{
						status_code: 2,
						status_desc: formatMessage({ id: 'esl.device.ap.status.offline' }),
					},
					{
						status_code: 0,
						status_desc: formatMessage({ id: 'esl.device.ap.status.inactivated' }),
					},
				],
			});
		},
		*fetchBaseStations({ payload = {} }, { call, put, select }) {
			const { options = {} } = payload;
			const { pagination, searchFormValues } = yield select(state => state.eslBaseStation);

			yield put({
				type: 'updateState',
				payload: { loading: true },
			});

			const opts = Object.assign({}, pagination, searchFormValues, options);
			const response = yield call(Actions.fetchBaseStations, opts);
			const result = response.data || {};
			yield put({
				type: 'updateState',
				payload: {
					loading: false,
					data: result.ap_list || [],
					pagination: {
						...pagination,
						current: opts.current,
						pageSize: opts.pageSize,
						total: Number(result.total_count) || 0,
					},
				},
			});
		},
		*getBaseStationDetail({ payload = {} }, { call, put }) {
			const { options = {} } = payload;
			yield put({
				type: 'updateState',
				payload: { loading: true },
			});

			const response = yield call(Actions.getBaseStationDetail, options);
			const result = response.data || {};
			if (response.code === ERROR_OK) {
				yield put({
					type: 'updateState',
					payload: {
						loading: false,
						stationInfo: result.ap_info || {},
					},
				});
			} else {
				yield put({
					type: 'updateState',
					payload: { loading: false },
				});
			}
			return response;
		},
		*deleteBaseStation({ payload = {} }, { call, put, select }) {
			const {
				pagination: { current },
				data,
			} = yield select(state => state.eslBaseStation);
			const { options = {} } = payload;
			yield put({
				type: 'updateState',
				payload: { loading: true },
			});

			const targetPage = data.length === 1 ? 1 : current;
			const response = yield call(Actions.deleteBaseStation, options);
			if (response.code === ERROR_OK) {
				message.success(
					formatMessage({ id: 'esl.device.ap.delete.success' }),
					DURATION_TIME
				);
				yield put({
					type: 'updateState',
					payload: { loading: false },
				});
				yield put({
					type: 'fetchBaseStations',
					payload: {
						options: {
							current: targetPage,
						},
					},
				});
			} else {
				message.error(formatMessage({ id: 'esl.device.ap.delete.fail' }), DURATION_TIME);
				yield put({
					type: 'updateState',
					payload: { loading: false },
				});
			}
		},

		*restartBaseStation({ payload }, { put, call }) {
			const { options } = payload;
			yield put({
				type: 'updateState',
				payload: { loading: true },
			});

			const response = yield call(Actions.restartBaseStation, options);
			if (response.code === ERROR_OK) {
				message.success(formatMessage({ id: 'esl.device.ap.restart.loading' }));
				yield put({
					type: 'fetchBaseStations',
					payload: { options: {} },
				});
			}

			yield put({
				type: 'updateState',
				payload: { loading: false },
			});
		},

		*changeBaseStationName({ payload }, { put, call }) {
			const { options } = payload;
			yield put({
				type: 'updateState',
				payload: { loading: true },
			});

			const response = yield call(Actions.changeBaseStationName, options);
			if (response.code === ERROR_OK) {
				message.success(formatMessage({ id: 'esl.device.ap.change.name' }));
				yield put({
					type: 'fetchBaseStations',
					payload: { options: {} },
				});
			}

			yield put({
				type: 'updateState',
				payload: { loading: false },
			});
		},

		*getNetWorkIdList(_, { put, call }) {
			const response = yield call(Actions.deviceApHandler, 'getNetworkList');
			if (response.code === ERROR_OK) {
				const { data = {} } = response || {};
				const { networkIdList = [] } = format('toCamel')(data);
				yield put({ type: 'updateState', payload: { networkIdList } });
			}
			return response;
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

			yield put({
				type: 'mqttStore/setTopicListener',
				payload: {
					service: 'response',
					handler: receivedMessage => {
						const { data } = JSON.parse(receivedMessage);
						const { opcode, result: { scanMulti, scanPeriod } = {} } = format(
							'toCamel'
						)(data[0] || {});

						const action = opcode === OPCODE.GET_AP_CONFIG ? 'query' : 'update';
						let networkConfig = {};

						if (action === 'query') {
							const isEnergySave = parseInt(scanPeriod, 10) > IN_ENERGY_SAVE;
							networkConfig = {
								scanMulti,
								scanPeriod: isEnergySave
									? parseInt(scanPeriod, 10) - IN_ENERGY_SAVE
									: parseInt(scanPeriod, 10),
								isEnergySave,
							};
						}

						handler(action, networkConfig);
					},
				},
			});
		},

		*getAPConfig({ payload }, { put }) {
			const { networkId } = payload;
			const requestTopic = yield put.resolve({
				type: 'mqttStore/generateTopic',
				payload: { service: 'request' },
			});

			yield put({
				type: 'mqttStore/publish',
				payload: {
					topic: requestTopic,
					message: {
						opcode: OPCODE.GET_AP_CONFIG,
						param: { network_id: networkId },
					},
				},
			});
		},

		*updateAPConfig({ payload }, { put }) {
			const { networkId, scanPeriod, isEnergySave, scanMulti = 2 } = payload;
			const requestTopic = yield put.resolve({
				type: 'mqttStore/generateTopic',
				payload: { service: 'request' },
			});
			yield put({
				type: 'mqttStore/publish',
				payload: {
					topic: requestTopic,
					message: {
						opcode: OPCODE.SET_AP_CONFIG,
						param: {
							network_id: networkId,
							scan_period: isEnergySave
								? parseInt(scanPeriod, 10) + IN_ENERGY_SAVE
								: parseInt(scanPeriod, 10),
							scan_multi: scanMulti,
						},
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
		setBaseStationState(state, action) {
			return {
				...state,
				states: action.payload,
			};
		},
		setSearchFormValue(state, action) {
			return {
				...state,
				searchFormValues: {
					...state.searchFormValues,
					...action.payload,
				},
			};
		},
	},
};
