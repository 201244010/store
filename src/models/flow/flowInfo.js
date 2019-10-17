import moment from 'moment';
import { format } from '@konata9/milk-shake';
import * as Actions from '@/services/passengerFlow';
import { getRange } from '@/pages/IPC/services/photoLibrary';
import { ERROR_OK } from '@/constants/errorCode';
import { DASHBOARD } from '@/pages/DashBoard/constants';

const { AGE_CODE_LIST_UNDER_18, AGE_CODE_EQ_18 } = DASHBOARD;

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
			const {
				startTime = moment().format('YYYY-MM-DD'),
				endTime = moment().format('YYYY-MM-DD'),
			} = payload;
			const opts = { startTime, endTime };

			const response = yield call(
				Actions.handlePassengerFlowManagement,
				'statistic/age/getByGender',
				format('toSnake')(opts)
			);

			if (response && response.code === ERROR_OK) {
				const { data = {} } = response || {};
				const { countList = [] } = format('toCamel')(data);
				const mergeItem = (
					countList.filter(item => AGE_CODE_LIST_UNDER_18.includes(item.ageRangeCode)) ||
					[]
				).reduce((prev, cur) => {
					const { maleCount: pMaleCount = 0, femaleCount: pFemaleCount = 0 } = prev;
					const { maleCount = 0, femaleCount = 0 } = cur;
					return {
						maleCount: maleCount + pMaleCount,
						femaleCount: femaleCount + pFemaleCount,
					};
				}, {});

				const mergeList = (
					countList.filter(item => !AGE_CODE_LIST_UNDER_18.includes(item.ageRangeCode)) ||
					[]
				)
					.map(item => {
						const { ageRangeCode } = item;
						if (ageRangeCode === AGE_CODE_EQ_18) {
							const { maleCount, femaleCount } = item;
							item = {
								...item,
								maleCount: maleCount + mergeItem.maleCount,
								femaleCount: femaleCount + mergeItem.femaleCount,
							};
						}
						return item;
					})
					.sort((a, b) => b.ageRangeCode - a.ageRangeCode);

				yield put({
					type: 'updateState',
					payload: {
						countListByGender: mergeList,
					},
				});
			}

			return response;
		},

		*getPassengerAgeByRegular({ payload = {} }, { call, put }) {
			const {
				startTime = moment().format('YYYY-MM-DD'),
				endTime = moment().format('YYYY-MM-DD'),
			} = payload;
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
