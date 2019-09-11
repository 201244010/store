import moment from 'moment';
import * as Actions from '@/services/passengerFlow';
import { getRange } from '@/pages/IPC/services/photoLibrary';
import { format } from '@konata9/milk-shake';
import { ERROR_OK } from '@/constants/errorCode';

export default {
	namespace: 'flowInfo',
	state: {
		passengerFlowCount: {},
		countListByGender: [],
		countListByRegular: [],
		ageRangeList: [],
		ageRangeMap: [],
		passengerFlowOrder: [],
	},
	effects: {
		*getPassengerFlowLatest({ payload }, { call, put }) {
			const { type = 1 } = payload || {};
			const response = yield call(
				Actions.handlePassengerFlowManagement,
				'statistic/getLatest',
				format('toSnake')({ type })
			);

			if (response && response.code === ERROR_OK) {
				const { data = {} } = response || {};
				const { latestCount = 0, earlyCount = 0 } = format('toCamel')(data);

				yield put({
					type: 'updateState',
					payload: { passengerFlowCount: { latestCount, earlyCount } },
				});
			}

			return response;
		},

		*getPassengerAgeByGender({ payload = {} }, { call, put }) {
			const { startTime = moment().format('YYYY-MM-DD'), endTime = moment().format('YYYY-MM-DD') } = payload;
			const opts = { startTime, endTime };

			const response = yield call(
				Actions.handlePassengerFlowManagement,
				'statistic/age/getByGender',
				format('toSnake')(opts)
			);

			if (response && response.code === ERROR_OK) {
				const { data = {} } = response || {};
				const { countList = [] } = format('toCamel')(data);

				for (let j = 0; j < countList.length -1; j++) {
					for( let i = 0; i < countList.length - j - 1; i++) {
						if (countList[i].ageRangeCode < countList[i+1].ageRangeCode) {
							const item = countList[i];
							countList[i] = countList[i+1];
							countList[i+1] = item;
						}
					}
				}

				yield put({
					type: 'updateState',
					payload: {
						countListByGender: countList,
					},
				});
			}

			return response;
		},

		*getPassengerAgeByRegular({ payload = {} }, { call, put }) {
			const { startTime = moment().format('YYYY-MM-DD'), endTime = moment().format('YYYY-MM-DD') } = payload;
			const opts = { startTime, endTime };

			const response = yield call(
				Actions.handlePassengerFlowManagement,
				'statistic/age/getByRegular',
				format('toSnake')(opts)
			);

			// TODO 云端可能会修正
			if (response && response.code === ERROR_OK) {
				const { data = {} } = response || {};
				const { countList = [] } = format('toCamel')(data);

				yield put({
					type: 'updateState',
					payload: {
						countListByRegular: countList,
					},
				});
			}

			return response;
		},

		*getAgeRanges(_, { call, put }) {
			const response = yield call(getRange);
			if (response && response.code === ERROR_OK) {
				const { data = {} } = response;
				const { ageRangeList = [] } = format('toCamel')(data);

				const ageRangeMap = ageRangeList.reduce((prev, cur) => {
					const { ageRange, ageRangeCode } = cur;
					return {
						...prev,
						[ageRangeCode]: ageRange,
					};
				}, {});

				yield put({
					type: 'updateState',
					payload: {
						ageRangeList,
						ageRangeMap,
					},
				});
			}
			return response;
		},

		*getPassengerFlowOrderLatest({ payload }, { call, put }) {
			const { type = 1 } = payload || {};
			const response = yield call(
				Actions.handlePassengerFlowManagement,
				'statistic/order/getLatest',
				format('toSnake')({ type })
			);

			if (response && response.code === ERROR_OK) {
				const { data = {} } = response || {};
				const { countList = [] } = format('toCamel')(data) || {};

				yield put({
					type: 'updateState',
					payload: { passengerFlowOrder: countList },
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
