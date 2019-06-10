import { fetchCommunications } from '@/services/ESL/monitor';
import { ERROR_OK } from '@/constants/errorCode';
import { DEFAULT_PAGE_LIST_SIZE, DEFAULT_PAGE_SIZE } from '@/constants';

function* switchLoadingStatus(status, put) {
	yield put({
		type: 'updateState',
		payload: { loading: status },
	});
}

export default {
	namespace: 'monitor',
	state: {
		loading: false,
		searchFormValues: {
			keyword: '',
		},
		data: [],
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
		*fetchCommunications({ payload }, { call, put, select }) {
			yield switchLoadingStatus(true, put);
			const { pagination, searchFormValues } = yield select(state => state.deviceAP);
			const options = {
				...pagination,
				...searchFormValues,
				...payload,
			};

			const response = yield call(fetchCommunications, 'getCommList', options);
			if (response && response.code === ERROR_OK) {
				const { data = {} } = response;
				yield put({
					type: 'updateState',
					payload: {
						data: data.esl_comm_list || [],
						pagination: {
							...pagination,
							total: data.total_count || 0,
						},
					},
				});
			}
			yield switchLoadingStatus(false, put);
		},

		*updateSearchValue({ payload }, { put }) {
			const { keyword = '' } = payload;
			yield put({
				type: 'updateState',
				payload: {
					searchFormValues: {
						keyword,
					},
				},
			});
		},

		*clearSearchValue(_, { put }) {
			yield put({
				type: 'updateState',
				payload: {
					searchFormValues: {
						keyword: '',
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
