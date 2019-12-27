import moment from 'moment';
import { formatMessage } from 'umi/locale';
import { format } from '@konata9/milk-shake';
import * as Actions from '@/services/passengerFlow';
import { getRange } from '@/pages/IPC/services/photoLibrary';
import { ERROR_OK } from '@/constants/errorCode';

const UNDER18_CODE = [1, 2, 3];
const ABOVE56_CODE = [8];

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
				let under18female = 0;
				let under18male = 0;
				let above56female = 0;
				let above56male = 0;
				let dataList = [];

				countList.map(item => {
					if(UNDER18_CODE.includes(item.ageRangeCode)) {
						under18female += item.femaleCount;
						under18male += item.maleCount;
					} else if (ABOVE56_CODE.includes(item.ageRangeCode)) {
						above56female += item.femaleCount;
						above56male += item.maleCount;
					} else {
						dataList.push(item);
					}
				});

				dataList.push(
					{ageRangeCode: 3, femaleCount: under18female, maleCount: under18male },
					{ageRangeCode: 8, femaleCount: above56female, maleCount: above56male },
				);
				dataList = dataList.sort((a, b) => a.ageRangeCode - b.ageRangeCode);

				console.log('dataList', dataList);
				yield put({
					type: 'updateState',
					payload: {
						countListByGender: dataList,
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
					const { ageRangeCode } = cur;
					let { ageRange } = cur;
					
					if(UNDER18_CODE.includes(ageRangeCode)) {
						ageRange = formatMessage({id: 'flow.ageSmallInfo'});
					} else if (ABOVE56_CODE.includes(ageRangeCode)) {
						ageRange = formatMessage({id: 'flow.ageLargeInfo'});
					} else {
						ageRange = `${ageRange}${formatMessage({ id: 'flow.distribution.age' })}`;
					}

					return {
						...prev,
						[ageRangeCode]: ageRange,
					};
				}, {});

				console.log('ageRangeMap', ageRangeMap);
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
