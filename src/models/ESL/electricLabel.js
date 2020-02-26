import { formatMessage } from 'umi/locale';
import { message } from 'antd';
import ESLServices from '@/services/ESL/electricLabel';
import TemplateServices from '@/services/ESL/template';
import * as ProductServices from '@/services/ESL/product';
import { DEFAULT_PAGE_LIST_SIZE, DEFAULT_PAGE_SIZE, DURATION_TIME } from '@/constants';
import { ERROR_OK, SWITCH_SCEEN_NO_DELETE } from '@/constants/errorCode';

export default {
	namespace: 'eslElectricLabel',
	state: {
		loading: false,
		data: [],
		searchFormValues: {
			keyword: '',
			status: -1,
			modelId: -1
		},
		pagination: {
			current: 1,
			pageSize: DEFAULT_PAGE_SIZE,
			total: 0,
			pageSizeOptions: DEFAULT_PAGE_LIST_SIZE,
			showSizeChanger: true,
			showQuickJumper: true,
		},
		modelList: [],
		detailInfo: {},
		templates4ESL: [],
		flashModes: [],
		screenInfo: [],
		screenPushInfo: {}
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
						modelId: -1
					},
				},
			});
		},
		*fetchElectricLabels({ payload = {} }, { call, put, select }) {
			const { options = {} } = payload;
			const { pagination, searchFormValues } = yield select(state => state.eslElectricLabel);

			yield put({
				type: 'updateState',
				payload: { loading: true },
			});

			const opts = Object.assign({}, pagination, searchFormValues, options);
			const response = yield call(ESLServices.fetchElectricLabels, opts);
			const result = response.data || {};
			yield put({
				type: 'updateState',
				payload: {
					loading: false,
					data: result.esl_list || [],
					pagination: {
						...pagination,
						current: opts.current,
						pageSize: opts.pageSize,
						total: Number(result.total_count) || 0,
					},
				},
			});
		},
		*fetchESLDetails({ payload = {} }, { call, put }) {
			const { options = {} } = payload;
			yield put({
				type: 'updateState',
				payload: { loading: true },
			});

			const response = yield call(ESLServices.fetchESLDetails, options);
			const result = response.data || {};
			if (response.code === ERROR_OK) {
				yield put({
					type: 'updateState',
					payload: {
						loading: false,
						detailInfo: result.esl_info || {},
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
		*fetchModelList({ payload = {} }, { call, put }) {
			const { options = {} } = payload;
			const response = yield call(ESLServices.getModelList, options);
			const result = response.data || {};
			if (response.code === ERROR_OK) {
				yield put({
					type: 'updateState',
					payload: {
						modelList: result.model_list || [],
					},
				});
			}
			return response;
		},

		*fetchFlashModes({ payload = {} }, { call, put }) {
			const { options = {} } = payload;

			const response = yield call(ESLServices.fetchFlashModes, options);
			const result = response.data || {};
			if (response.code === ERROR_OK) {
				yield put({
					type: 'updateState',
					payload: {
						flashModes: result.esl_flash_mode_list || [],
					},
				});
			}
			return response;
		},
		*updateFlashLedConfig({ payload = {} }, { call, put }) {
			const { options = {} } = payload;

			yield put({
				type: 'updateState',
				payload: { loading: true },
			});
			const response = yield call(ESLServices.updateFlashLedConfig, options);
			if (response.code === ERROR_OK) {
				message.success(
					formatMessage({ id: 'esl.device.led.update.config.success' }),
					DURATION_TIME
				);
				yield put({
					type: 'updateState',
					payload: { loading: false },
				});
				yield put({
					type: 'fetchFlashModes',
				});
			} else {
				message.error(
					formatMessage({ id: 'esl.device.led.update.config.error' }),
					DURATION_TIME
				);
				yield put({
					type: 'updateState',
					payload: { loading: false },
				});
			}
			return response;
		},
		*fetchTemplatesByESLCode({ payload = {} }, { call, put }) {
			const { options = {} } = payload;

			const response = yield call(TemplateServices.fetchTemplatesByESLCode, options);
			const result = response.data || {};
			if (response.code === ERROR_OK) {
				yield put({
					type: 'updateState',
					payload: {
						templates4ESL: result.template_list || [],
					},
				});
			}
			return response;
		},
		*fetchDeviceOverview(_, { call, put }) {
			yield put({
				type: 'updateState',
				payload: { loading: true },
			});
			const response = yield call(ESLServices.fetchDeviceOverview);
			if (response && response.code === ERROR_OK) {
				yield put({
					type: 'updateState',
					payload: {
						loading: false,
						overview: response.data,
					},
				});
			}
			yield put({
				type: 'updateState',
				payload: { loading: false },
			});
			return response;
		},
		*flushESL({ payload = {} }, { call, put }) {
			const { options = {} } = payload;
			yield put({
				type: 'updateState',
				payload: { loading: true },
			});

			const response = yield call(ProductServices.flushESL, options);
			if (response.code === ERROR_OK) {
				message.success(
					formatMessage({ id: 'esl.device.esl.flush.success' }),
					DURATION_TIME
				);
				yield put({
					type: 'updateState',
					payload: { loading: false },
				});
				yield put({
					type: 'fetchElectricLabels',
				});
			} else {
				message.error(formatMessage({ id: 'esl.device.esl.flush.fail' }), DURATION_TIME);
				yield put({
					type: 'updateState',
					payload: { loading: false },
				});
			}
		},
		*bindESL({ payload = {} }, { call, put }) {
			const { options = {} } = payload;
			yield put({
				type: 'updateState',
				payload: { loading: true },
			});

			const response = yield call(ProductServices.bindESL, options);
			if (response.code === ERROR_OK) {
				message.success(
					formatMessage({ id: 'esl.device.esl.bind.success' }),
					DURATION_TIME
				);
				yield put({
					type: 'updateState',
					payload: { loading: false },
				});
				yield put({
					type: 'fetchElectricLabels',
				});
			} else {
				message.error(formatMessage({ id: 'esl.device.esl.bind.fail' }), DURATION_TIME);
				yield put({
					type: 'updateState',
					payload: { loading: false },
				});
			}
			return response;
		},
		*unbindESL({ payload = {} }, { call, put }) {
			const { options = {} } = payload;
			yield put({
				type: 'updateState',
				payload: { loading: true },
			});

			const response = yield call(ProductServices.unbindESL, options);
			if (response.code === ERROR_OK) {
				message.success(
					formatMessage({ id: 'esl.device.esl.unbind.success' }),
					DURATION_TIME
				);
				yield put({
					type: 'updateState',
					payload: { loading: false },
				});
				yield put({
					type: 'fetchElectricLabels',
				});
			} else {
				message.error(formatMessage({ id: 'esl.device.esl.unbind.fail' }), DURATION_TIME);
				yield put({
					type: 'updateState',
					payload: { loading: false },
				});
			}
		},
		*changeTemplate({ payload = {} }, { call, put }) {
			const { options = {} } = payload;
			yield put({
				type: 'updateState',
				payload: { loading: true },
			});

			const response = yield call(ESLServices.changeTemplate, options);
			if (response.code === ERROR_OK) {
				message.success(
					formatMessage({ id: 'esl.device.esl.change.template.success' }),
					DURATION_TIME
				);
				yield put({
					type: 'updateState',
					payload: { loading: false },
				});
				yield put({
					type: 'fetchElectricLabels',
				});
			} else {
				message.error(
					formatMessage({ id: 'esl.device.esl.change.template.fail' }),
					DURATION_TIME
				);
				yield put({
					type: 'updateState',
					payload: { loading: false },
				});
			}
		},
		*flashLed({ payload = {} }, { call, put }) {
			const { options = {} } = payload;
			yield put({
				type: 'updateState',
				payload: { loading: true },
			});

			const response = yield call(ESLServices.flashLed, options);
			if (response.code === ERROR_OK) {
				message.success(
					formatMessage({ id: 'esl.device.esl.flash.success' }),
					DURATION_TIME
				);
				yield put({
					type: 'updateState',
					payload: { loading: false },
				});
			} else {
				message.error(formatMessage({ id: 'esl.device.esl.flash.fail' }), DURATION_TIME);
				yield put({
					type: 'updateState',
					payload: { loading: false },
				});
			}
		},
		*deleteESL({ payload = {} }, { call, put, select }) {
			const {
				pagination: { current },
				data,
			} = yield select(state => state.eslElectricLabel);
			const { options = {} } = payload;
			yield put({
				type: 'updateState',
				payload: { loading: true },
			});

			const targetPage = data.length === 1 ? 1 : current;
			const response = yield call(ESLServices.deleteESL, options);
			if (response.code === ERROR_OK) {
				message.success(
					formatMessage({ id: 'esl.device.esl.delete.success' }),
					DURATION_TIME
				);
				yield put({
					type: 'fetchElectricLabels',
					payload: {
						options: {
							current: targetPage,
						},
					},
				});
			} else if (response.code === SWITCH_SCEEN_NO_DELETE) {
				message.error(formatMessage({ id: 'esl.device.esl.delete.fail.switch.screen' }), DURATION_TIME);
			} else {
				message.error(formatMessage({ id: 'esl.device.esl.delete.fail' }), DURATION_TIME);
			}
			yield put({
				type: 'updateState',
				payload: { loading: false },
			});
		},

		*refreshFailedImage(_, { call, put }) {
			yield put({
				type: 'updateState',
				payload: { loading: true },
			});

			const response = yield call(ESLServices.refreshFailedImage);
			if (response.code === ERROR_OK) {
				message.success(formatMessage({ id: 'esl.device.esl.push.all.success' }));
			}

			yield put({
				type: 'updateState',
				payload: { loading: false },
			});
		},

		*setScanTime({ payload = {} }, { call, put }) {
			yield put({
				type: 'updateState',
				payload: { loading: true },
			});

			const { options = {} } = payload;
			const response = yield call(ESLServices.setScanTime, options);
			if (response.code === ERROR_OK) {
				message.success(formatMessage({ id: 'esl.device.esl.set.scan.success' }));
			}

			yield put({
				type: 'updateState',
				payload: { loading: false },
			});
		},

		*fetchSwitchScreenInfo({ payload = {} }, { call, put }) {
			const { options = {} } = payload;

			const response = yield call(ESLServices.getSwitchScreenInfo, options);
			const result = response.data || {};
			if (response.code === ERROR_OK) {
				yield put({
					type: 'updateState',
					payload: {
						screenInfo: result.esl_switch_screen_info_list || [],
					},
				});
			}
			return response;
		},

		*fetchScreenPushInfo({ payload = {} }, { call, put }) {
			const { options = {} } = payload;

			const response = yield call(ESLServices.getScreenPushInfo, options);
			const result = response.data || {};
			if (response.code === ERROR_OK) {
				yield put({
					type: 'updateState',
					payload: {
						screenPushInfo: result.esl_screen_push_info || {},
					},
				});
			}
			return response;
		},

		*switchScreen({ payload = {} }, { call }) {
			const { options = {} } = payload;

			const response = yield call(ESLServices.switchScreen, options);
			if (response.code === ERROR_OK) {
				message.success(
					formatMessage({ id: 'esl.device.esl.toggle.page.success' }),
					DURATION_TIME
				);
			} else {
				message.error(
					formatMessage({ id: 'esl.device.esl.toggle.page.fail' }),
					DURATION_TIME
				);
			}
			return response;
		},

		*clearSearchValue(_, { put }) {
			yield put({
				type: 'updateState',
				payload: {
					searchFormValues: {
						keyword: '',
						status: -1,
						modelId: -1
					},
				},
			});
		},

		*batchDeleteESL({ payload = {} }, { call, put, select }) {
			const {
				pagination: { current },
				data,
			} = yield select(state => state.eslElectricLabel);
			const { options = {} } = payload;
			yield put({
				type: 'updateState',
				payload: { loading: true },
			});

			const targetPage = data.length === 1 ? 1 : current;
			const response = yield call(ESLServices.batchDeleteESL, options);
			if (response.code === ERROR_OK) {
				message.success(
					formatMessage({ id: 'esl.device.esl.delete.success' }),
					DURATION_TIME
				);
				yield put({
					type: 'fetchElectricLabels',
					payload: {
						options: {
							current: targetPage,
						},
					},
				});
			} else if (response.code === SWITCH_SCEEN_NO_DELETE) {
				message.error(formatMessage({ id: 'esl.device.esl.delete.fail.switch.screen' }), DURATION_TIME);
			} else {
				message.error(formatMessage({ id: 'esl.device.esl.delete.fail' }), DURATION_TIME);
			}
			yield put({
				type: 'updateState',
				payload: { loading: false },
			});

			return response;
		},

		*batchUnbindESL({ payload = {} }, { call, put }) {
			const { options = {} } = payload;
			yield put({
				type: 'updateState',
				payload: { loading: true },
			});

			const response = yield call(ProductServices.batchUnbindESL, options);
			if (response.code === ERROR_OK) {
				message.success(
					formatMessage({ id: 'esl.device.esl.unbind.success' }),
					DURATION_TIME
				);
				yield put({
					type: 'updateState',
					payload: { loading: false },
				});
				yield put({
					type: 'fetchElectricLabels',
				});
			} else {
				message.error(formatMessage({ id: 'esl.device.esl.unbind.fail' }), DURATION_TIME);
				yield put({
					type: 'updateState',
					payload: { loading: false },
				});
			}
		},

		*batchFlushESL({ payload = {} }, { call, put }) {
			const { options = {} } = payload;
			yield put({
				type: 'updateState',
				payload: { loading: true },
			});

			const response = yield call(ProductServices.batchFlushESL, options);
			if (response.code === ERROR_OK) {
				message.success(
					formatMessage({ id: 'esl.device.esl.flush.success' }),
					DURATION_TIME
				);
				yield put({
					type: 'updateState',
					payload: { loading: false },
				});
				yield put({
					type: 'fetchElectricLabels',
				});
			} else {
				message.error(formatMessage({ id: 'esl.device.esl.flush.fail' }), DURATION_TIME);
				yield put({
					type: 'updateState',
					payload: { loading: false },
				});
			}

			return response;
		},

		*batchChangeTemplate({ payload = {} }, { call, put }) {
			const { options = {} } = payload;
			yield put({
				type: 'updateState',
				payload: { loading: true },
			});

			const response = yield call(ESLServices.batchChangeTemplate, options);
			if (response.code === ERROR_OK) {
				message.success(
					formatMessage({ id: 'esl.device.esl.change.template.success' }),
					DURATION_TIME
				);
				yield put({
					type: 'updateState',
					payload: { loading: false },
				});
				yield put({
					type: 'fetchElectricLabels',
				});
			} else {
				message.error(
					formatMessage({ id: 'esl.device.esl.change.template.fail' }),
					DURATION_TIME
				);
				yield put({
					type: 'updateState',
					payload: { loading: false },
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
