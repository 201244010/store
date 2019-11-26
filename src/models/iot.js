import IotServices from '@/services/iot';
import { DEFAULT_PAGE_LIST_SIZE, DEFAULT_PAGE_SIZE } from '@/constants';

export default {
	namespace: 'iot',
	state: {
		loading: false,
		data: [],
		deviceInfo: {},
		netInfo: {},
		printerInfo: {},
		runningInfo: {},
		warrantyInfo: {},
		searchFormValues: {
			keyword: '',
			status: -1,
		},
		pagination: {
			current: 1,
			pageSize: DEFAULT_PAGE_SIZE,
			total: 0,
			pageSizeOptions: DEFAULT_PAGE_LIST_SIZE,
			showSizeChanger: true,
			showQuickJumper: true,
		}
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
						status: -1,
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
						status: -1,
					},
				},
			});
		},
		*fetchPosList({ payload = {} }, { call, put }) {
			const { options = {} } = payload;

			yield put({
				type: 'updateState',
				payload: { loading: true },
			});

			const opts = Object.assign({}, options);
			const response = yield call(IotServices.getPosList, opts);
			const result = response.data || {};
			yield put({
				type: 'updateState',
				payload: {
					loading: false,
					data: result.device_list || [],
				},
			});
		},
		*fetchPosDetail({ payload = {} }, { call, put }) {
			const { options = {} } = payload;

			yield put({
				type: 'updateState',
				payload: {
					loading: true,
					deviceInfo: {},
					netInfo: {},
					printerInfo: {},
					runningInfo: {},
				},
			});

			const opts = Object.assign({}, options);
			const response = yield call(IotServices.getBaseInfo, opts);
			const result = response.data || {};
			yield put({
				type: 'updateState',
				payload: {
					loading: false,
					deviceInfo: result.device_info || {},
					netInfo: result.net_info || {},
					printerInfo: result.printer_info || {},
					runningInfo: result.running_info || {},
				},
			});
		},
		*fetchWarrantyInfo({ payload = {} }, { call, put }) {
			const { options = {} } = payload;

			yield put({
				type: 'updateState',
				payload: {
					loading: true,
					warrantyInfo: {}
				},
			});

			const opts = Object.assign({}, options);
			const response = yield call(IotServices.getWarrantyInfo, opts);
			const result = response.data || {};
			yield put({
				type: 'updateState',
				payload: {
					loading: false,
					warrantyInfo: result,
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
