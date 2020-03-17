import moment from 'moment';
import { format } from '@konata9/milk-shake';
import { getLatestPassengerFlow, getPassengerFlowOrderLatest, getPassengerFlowOrderByRange } from '@/services/passengerFlow';
import { handleDashBoard } from '@/services/dashBoard';
import { ERROR_OK } from '@/constants/errorCode';

const RANGE = {
	TODAY: 'day',
	WEEK: 'week',
	MONTH: 'month',
	FREE: 'free',
	YESTERDAY: 'yesterday'
};

const queryRangeType = {
	[RANGE.TODAY]: 1,
	[RANGE.WEEK]: 2,
	[RANGE.MONTH]: 3,
	[RANGE.YESTERDAY]: 4,
};

export const getQueryDate = rangeType => [
	moment()
		.startOf(rangeType)
		.unix(),
	moment()
		.endOf(rangeType)
		.unix(),
];
const getQueryTimeRange = (searchValue = {}) => {
	const { rangeType, timeRangeStart, timeRangeEnd } = searchValue;

	let startTime;
	let endTime;

	if (rangeType !== RANGE.FREE) {
		[startTime, endTime] = getQueryDate(rangeType);
	} else {
		[startTime, endTime] = [
			timeRangeStart.startOf('day').unix(),
			timeRangeEnd.endOf('day').unix(),
		];
	}

	return [startTime, endTime];
};

export default {
	namespace: 'databoard',
	state: {
		searchValue: {
			rangeType: RANGE.TODAY,
			timeRangeStart: moment()
				.startOf('day')
				.unix(),
			timeRangeEnd: moment()
				.endOf('day')
				.unix(),
		},
	},
	effects: {
		*getLatestPassengerData({ payload }, { call }) {
			const { startTime, endTime } = payload || {};
			const opts = { startTime, endTime };
			const response = yield call(
				getLatestPassengerFlow,
				opts
			);

			if (response && response.code === ERROR_OK) {
				// yield put({
				// 	type: 'updateState',
				// 	payload: {
				// 		passengerFlowCount: { latestCount },
				// 	},
				// });
			}

			return response;
		},
		// 获取实时销售额
		*getTotalAmount({ payload }, { call, put, select }) {
			const {
				searchValue,
			} = yield select(state => state.dashboard);
			const [startTime, endTime] = getQueryTimeRange(searchValue);

			const options = {
				timeRangeStart: startTime,
				timeRangeEnd: endTime
			};
			const response = yield call(
				handleDashBoard,
				'getTotalAmount',
				format('toSnake')(options)
			);
			if (response && response.code === ERROR_OK) {
				const { dayAmount, yesterdayAmount, weekAmount, lastWeekAmount, monthAmount, lastMonthAmount } = payload;
				yield put({
					type: 'updateState',
					payload: {
						paymentTotalAmount: {
							dayAmount,
							yesterdayAmount,
							weekAmount,
							lastWeekAmount,
							monthAmount,
							lastMonthAmount,
						},
					},
				});
			}
		},
		// 获取实时交易量
		*getTotalCount({ payload }, { call, put }) {
			const {
				searchValue,
			} = yield select(state => state.dashboard);
			const [startTime, endTime] = getQueryTimeRange(searchValue);
			const options = {
				timeRangeStart: startTime,
				timeRangeEnd: endTime
			};
			const response = yield call(
				handleDashBoard,
				'getTotalCount',
				format('toSnake')(options)
			);
			if (response && response.code === ERROR_OK) {
				const { dayCount, yesterdayCount, weekCount, lastWeekCount, monthCount, lastMonthCount } = payload;
				yield put({
					type: 'updateState',
					payload: {
						paymentTotalCount: {
							dayCount,
							yesterdayCount,
							weekCount,
							lastWeekCount,
							monthCount,
							lastMonthCount,
						},
					},
				});
			}
		},
		// 获取交易分布（销售额和交易量按时间分布）
		*getTimeDistribution(_, { call }) {
			const {
				searchValue,
			} = yield select(state => state.dashboard);
			const [startTime, endTime] = getQueryTimeRange(searchValue);
			const timeInterval = 3600;
			const options = {
				startTime,
				endTime,
				timeInterval
			};
			const response = yield call(
				handleDashBoard,
				'getTimeDistribution',
				format('toSnake')(options)
			);
			if (response && response.code === ERROR_OK) {
				// yield put({
				// 	type: 'updateState',
				// 	payload: {
				// 		passengerFlowCount: { latestCount },
				// 	},
				// });
			}
		},
		// 交易转化率分布 （客流量和交易量按时间分布）
		*getPassengerOrderLatest(_, { call }) {
			const {
				searchValue,
				searchValue: { rangeType }
			} = yield select(state => state.dashboard);
			const [startTime, endTime] = getQueryTimeRange(searchValue);
			let response = {};
			let opt = {};
			if(rangeType !== RANGE.FREE) {
				opt = {
					type: queryRangeType(rangeType)
				};
				response = yield call(
					getPassengerFlowOrderLatest,
					opt
				);
			} else {
				opt = {
					startTime: moment.unix(startTime).format('YYYY-MM-DD'),
					endTime: moment.unix(endTime).format('YYYY-MM-DD')
				};
				response = yield call(
					getPassengerFlowOrderByRange,
					opt
				);
			}
			if (response && response.code === ERROR_OK) {
				// yield put({
				// 	type: 'updateState',
				// 	payload: {
				// 		passengerFlowCount: { latestCount },
				// 	},
				// });
			}

		}
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
