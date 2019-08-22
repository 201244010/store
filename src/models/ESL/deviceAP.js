import { handleAPAction } from '@/services/ESL/deviceUpgrade';
import { message } from 'antd';
import { formatMessage } from 'umi/locale';
import { ERROR_OK } from '@/constants/errorCode';
import { DEFAULT_PAGE_LIST_SIZE, DEFAULT_PAGE_SIZE } from '@/constants';

function* switchLoadingStatus(status, put) {
	yield put({
		type: 'updateState',
		payload: { loading: status },
	});
}

export default {
	namespace: 'deviceAP',
	state: {
		loading: false,
		searchFormValues: {
			keyword: '',
		},
		states: [
			{
				status_code: '0',
				status_desc: '未升级',
			},
			{
				status_code: '1',
				status_desc: '已升级',
			},
			{
				status_code: '2',
				status_desc: '升级失败',
			},
			{
				status_code: '3',
				status_desc: '无法升级',
			},
		],
		apGroupList: [],
		apInfoList: [],
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
		*getAPGroupList(_, { call, put }) {
			yield switchLoadingStatus(true, put);
			const response = yield call(handleAPAction, 'getList');
			if (response && response.code === ERROR_OK) {
				const { data = {} } = response;
				yield put({
					type: 'updateState',
					payload: {
						apGroupList: data.firmware_group_list || [],
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

		*getAPGroupInfo({ payload }, { call, put, select }) {
			yield switchLoadingStatus(true, put);
			const { pagination, searchFormValues } = yield select(state => state.deviceAP);
			const options = {
				...pagination,
				...searchFormValues,
				...payload,
				page_num: payload.current || 1,
				page_size: payload.pageSize || 10,
			};

			const response = yield call(handleAPAction, 'getInfo', options);
			if (response && response.code === ERROR_OK) {
				const { data = {} } = response;
				yield put({
					type: 'updateState',
					payload: {
						apInfoList: data.ap_firmware_group_info_list || [],
						pagination: {
							...pagination,
							current: payload.current || 1,
							pageSize: payload.pageSize || 10,
							total: data.total_count || 0,
						},
					},
				});
			}
			yield switchLoadingStatus(false, put);
		},

		*updateAPAutoUpgradeStatus({ payload }, { put, call }) {
			yield switchLoadingStatus(true, put);
			const response = yield call(handleAPAction, 'updateAutoUpgradeStatus', payload);
			if (response.code === ERROR_OK) {
				yield put({
					type: 'getAPGroupList',
				});
			} else {
				message.error(formatMessage({ id: 'esl.device.upgrade.auto.fail' }));
			}
			yield switchLoadingStatus(false, put);
		},

		*uploadAPFirmware({ payload }, { put, call }) {
			yield switchLoadingStatus(true, put);
			const response = yield call(handleAPAction, 'upload', payload);
			if (response.code === ERROR_OK) {
				yield put({
					type: 'getAPGroupList',
				});
			}
			yield switchLoadingStatus(false, put);
			return response;
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
