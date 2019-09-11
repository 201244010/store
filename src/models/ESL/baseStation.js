import { message } from 'antd';
import { formatMessage } from 'umi/locale';
import { format } from '@konata9/milk-shake';
import { ERROR_OK } from '@/constants/errorCode';
import * as Actions from '@/services/ESL/baseStation';
import { DEFAULT_PAGE_LIST_SIZE, DEFAULT_PAGE_SIZE, DURATION_TIME } from '@/constants';
import { OPCODE } from '@/constants/mqttStore';
import moment from 'moment';

const IN_ENERGY_SAVE = 128;
const ACTION = {
	QUERY: 'query',
	UPDATE: 'update'
};

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
		networkConfig: {
		},
		baseStationList: [],
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
			const { pagination, searchFormValues } = yield select(state => state.eslBaseStation);

			yield put({
				type: 'updateState',
				payload: { loading: true },
			});
			const opts = Object.assign({}, pagination, searchFormValues, payload);
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
				const { networkList = [] } = format('toCamel')(data);
				yield put({ type: 'updateState', payload: { networkIdList: networkList } });
				return networkList;
			}
			
			message.error(formatMessage({id: 'esl.device.ap.network.get.fail'}));
			return [];
		},
		
		*getBaseStationList({ payload }, { put, call }) {
			const response = yield call(Actions.fetchBaseStations, payload);
			const formatResponse = format('toCamel')(response);
			if(response.code === ERROR_OK) {
				const {data: { apList = [] }} = formatResponse;
				yield put({
					type: 'updateState',
					payload: {
						baseStationList: apList
					}
				});
				return apList;
			}
			
			message.error(formatMessage({id: 'esl.device.ap.getList.fail'}));
			yield put({
				type: 'updateState',
				payload: {
					baseStationList: []
				}
			});
			return [];
			
		},

		*unsubscribeTopic(_, { put }) {
			const responseTopic = yield put.resolve({
				type: 'mqttStore/generateTopic',
				payload: { service: 'ESL/response', action: 'sub' },
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
					service: 'ESL/response',
					handler: receivedMessage => {
						const { data } = JSON.parse(receivedMessage);
						const {
							opcode,
							errcode,
							result: {
								scanMulti = 30,
								scanPeriod = 143,
								scanDeepSleep = 60,
								clksyncPeriod = 259200,
								eslRefleshPeriod = 1,
								eslRefleshTime = moment().startOf('day').add(4, 'hour').add(0, 'minute'),
							} = {}
						} = format(
							'toCamel'
						)(data[0] || {});
						// 正常模式下扫描周期大于128则开启了节能模式，实际扫描时间减去128
						
						const action = opcode === OPCODE.GET_AP_CONFIG ? ACTION.QUERY : ACTION.UPDATE;
						const hour = Math.floor(eslRefleshTime / 3600);
						const minute = (eslRefleshTime % 3600) / 60;
						let networkConfig = {};

						if (action === ACTION.QUERY) {
							const isEnergySave = parseInt(scanPeriod, 10) > IN_ENERGY_SAVE;
							networkConfig = {
								scanMulti,
								scanPeriod: isEnergySave
									? parseInt(scanPeriod, 10) - IN_ENERGY_SAVE
									: parseInt(scanPeriod, 10),
								scanDeepSleep,
								clksyncPeriod: clksyncPeriod / 86400,
								eslRefleshPeriod,
								eslRefleshTime: moment().startOf('day').add(hour, 'hour').add(minute, 'minute'),
								isEnergySave
							};
						}

						handler(errcode, action, networkConfig, opcode);
					},
				},
			});
		},

		*getAPConfig({ payload }, { put }) {
			const { networkId } = payload;
			const requestTopic = yield put.resolve({
				type: 'mqttStore/generateTopic',
				payload: { service: 'ESL/request' },
			});
			const param = format('toSnake')({networkId});

			yield put({
				type: 'mqttStore/publish',
				payload: {
					topic: requestTopic,
					message: {
						opcode: OPCODE.GET_AP_CONFIG,
						param,
					},
				},
			});
		},

		*updateAPConfig({ payload }, { put }) {
			const {
				networkId,
				scanPeriod,
				isEnergySave,
				scanMulti,
				clksyncPeriod,
				eslRefleshPeriod,
				eslRefleshTime,
				scanDeepSleep
			} = payload;
			const [refleshHour = 4, refleshMinute = 0 ] = [eslRefleshTime.hour(), eslRefleshTime.minutes()];
			const param1 = format('toSnake')({
				networkId,
				scanPeriod: isEnergySave
					? parseInt(scanPeriod, 10) + IN_ENERGY_SAVE
					: parseInt(scanPeriod, 10),
				scanMulti,
				scanDeepSleep
			});
			const param2 = format('toSnake')({
				networkId,
				clksyncPeriod: parseInt(clksyncPeriod, 10) * 24 * 3600,
			});
			const param3 = format('toSnake')({
				networkId,
				eslRefleshPeriod: parseInt(eslRefleshPeriod, 10),
				eslRefleshTime: refleshHour * 3600 + refleshMinute * 60,
			});
			
			const requestTopic = yield put.resolve({
				type: 'mqttStore/generateTopic',
				payload: { service: 'ESL/request' },
			});
			yield put({
				type: 'mqttStore/publish',
				payload: {
					topic: requestTopic,
					message: {
						opcode: OPCODE.SET_AP_CONFIG,
						param: param1,
					},
				},
			});

			yield put({
				type: 'mqttStore/publish',
				payload: {
					topic: requestTopic,
					message: {
						opcode: OPCODE.SET_CLKSYNC,
						param: param2
					},
				},
			});

			yield put({
				type: 'mqttStore/publish',
				payload: {
					topic: requestTopic,
					message: {
						opcode: OPCODE.SET_SELF_REFRESH,
						param: param3
					},
				},
			});
		},
		
		*setNetworkConfig({ payload }, { put }) {
			const { networkConfig } = payload;
			yield put({
				type: 'updateState',
				payload: {
					networkConfig
				}
			});
		}
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
