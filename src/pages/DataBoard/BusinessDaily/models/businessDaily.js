import { format } from '@konata9/milk-shake';
import moment from 'moment';
import * as Actions from '@/services/businessDaily';
import { DEFAULT_PAGE_SIZE } from '@/constants';
import { ERROR_OK } from '@/constants/errorCode';

export default {
	namespace: 'businessDaily',
	state: {
		pagination: {
			current: 1,
			pageSize: DEFAULT_PAGE_SIZE,
			showSizeChanger: true,
			showQuickJumper: true,
			total: 0,
		},
		countList: [],
	},
	effects: {
		*getBusinessData({ payload = {} }, { call, put }) {
			const response = yield call(
				Actions.handleBusiness,
				'getBusinessData',
				format('toSnake')(payload)
			);
			if (response && response.code === ERROR_OK) {
				const {
					data: { countList },
				} = format('toCamel')(response);
				yield put({
					type: 'updateState',
					payload: {
						countList: countList.sort((a, b) => {
							// 第一顺序排序为时间倒序，第二排序为shopId
							const aTime = moment(a.time).valueOf();
							const bTime = moment(b.time).valueOf();
							if (aTime === bTime) {
								return a.shopId - b.shopId;
							}
							return bTime - aTime;
						}),
					},
				});
			}
			return response;
		},

		*setPagination({ payload }, { select, put }) {
			const { pagination } = yield select(state => state.businessDaily);
			yield put({
				type: 'updateState',
				payload: {
					pagination: {
						...pagination,
						...payload,
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
