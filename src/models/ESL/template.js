import { Modal, message } from 'antd';
import { formatMessage } from 'umi/locale';
import { getImagePromise, initTemplateDetail, purifyJsonOfBackEnd, downloadJsonAsDraft } from '@/utils/studio';
import { getLocationParam } from '@/utils/utils';
import { DEFAULT_PAGE_LIST_SIZE, DEFAULT_PAGE_SIZE } from '@/constants';
import TemplateService from '@/services/ESL/template';
import { ERROR_OK, ALERT_NOTICE_MAP } from '@/constants/errorCode';
import {IMAGE_TYPES, MAPS, SCREEN_TYPE, COLOR_TYPE} from '@/constants/studio';

function generateModelName() {
	const studioType = getLocationParam('screen');
	const colorType = getLocationParam('color');
	return `${COLOR_TYPE[colorType]}-${SCREEN_TYPE[studioType]}`;
}

export default {
	namespace: 'template',
	state: {
		loading: false,
		screenTypes: [],
		colors: [],
		bindFields: [],
		data: [],
		searchFormValues: {
			keyword: '',
			status: -1,
			screen_type: -1,
			colour: -1,
		},
		pagination: {
			current: 1,
			pageSize: DEFAULT_PAGE_SIZE,
			total: 0,
			pageSizeOptions: DEFAULT_PAGE_LIST_SIZE,
			showSizeChanger: true,
			showQuickJumper: true,
		},
		curTemplate: {},
		viewType: 'table',
		fontList: [],
		templateConfig: {}
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
		*changeViewType({ payload = {} }, { put }) {
			yield put({
				type: 'updateState',
				payload: {
					viewType: payload.viewType
				},
			});
		},
		*fetchScreenTypes({ payload = {} }, { call, put }) {
			const response = yield call(TemplateService.fetchScreenTypes, payload);
			yield put({
				type: 'updateState',
				payload: {
					screenTypes: response.data.screen_type_list || [],
				},
			});
		},
		*fetchBindFields({ payload = {} }, { call, put }) {
			const response = yield call(TemplateService.fetchBindFields, payload);
			yield put({
				type: 'updateState',
				payload: {
					bindFields: response.data.bindable_product_field_list || [],
				},
			});
		},
		*fetchColors({ payload = {} }, { call, put }) {
			const response = yield call(TemplateService.fetchColors, payload);
			yield put({
				type: 'updateState',
				payload: {
					colors: response.data.colour_list || [],
				},
			});
		},
		*fetchScreenNameList({ payload = {} }, { call }) {
			return yield call(TemplateService.fetchScreenNameList, payload);
		},
		*createTemplate({ payload = {} }, { call, put }) {
			yield put({
				type: 'updateState',
				payload: { loading: true },
			});

			const response = yield call(TemplateService.createTemplate, payload);
			if (response && response.code === ERROR_OK) {
				yield put({
					type: 'updateState',
					payload: { loading: false },
				});
				yield put({
					type: 'fetchTemplates',
					payload: {
						options: {
							screen_type: -1,
							colour: -1,
						},
					},
				});
				message.success(formatMessage({ id: 'esl.device.template.action.create.success' }));
			} else {
				yield put({
					type: 'updateState',
					payload: { loading: false },
				});
				if (ALERT_NOTICE_MAP[response.code]) {
					message.error(formatMessage({ id: ALERT_NOTICE_MAP[response.code] }));
				} else {
					message.error(formatMessage({ id: 'esl.device.template.action.create.error' }));
				}
			}
			return response;
		},
		*fetchTemplates({ payload = {} }, { call, put, select }) {
			const { options = {} } = payload;
			const { pagination, searchFormValues, viewType } = yield select(state => state.template);

			yield put({
				type: 'updateState',
				payload: { loading: true },
			});

			const opts = Object.assign({}, pagination, searchFormValues, options);
			const response = yield call(viewType === 'picture' ? TemplateService.fetchPreviewList : TemplateService.fetchTemplates, {
				...opts,
				page_num: opts.current,
				page_size: viewType === 'picture' ? 8 : opts.pageSize,
			});
			const result = response.data || {};
			yield put({
				type: 'updateState',
				payload: {
					loading: false,
					data: result.template_list || [],
					pagination: {
						...pagination,
						current: opts.current,
						pageSize: opts.pageSize,
						total: Number(result.total_count) || 0,
					},
				},
			});
		},
		*saveAsDraft({ payload = {} }, { call, put, select }) {
			const { curTemplate, fontList } = yield select(state => state.template);
			yield put({
				type: 'updateState',
				payload: { loading: true },
			});
			const draft = {
				encoding: 'UTF-8',
				type: curTemplate.model_name,
				backgroundColor: 'white',
				fillFields: [],
				layers: [],
				layerCount: 0,
			};
			const result = purifyJsonOfBackEnd(payload.draft, fontList);
			draft.fillFields = result.bindFields;
			draft.layers = result.layers;
			draft.layerCount = result.layers.length;

			const response = yield call(TemplateService.saveAsDraft, {
				...payload,
				draft: JSON.stringify(draft),
			});
			if (response && response.code === ERROR_OK) {
				yield put({
					type: 'updateState',
					payload: { loading: false },
				});
				message.success(formatMessage({ id: 'esl.device.template.action.save.success' }));
			} else {
				yield put({
					type: 'updateState',
					payload: { loading: false },
				});
				message.error(formatMessage({ id: 'esl.device.template.action.save.error' }));
			}
		},
		*downloadAsDraft({ payload = {} }, { put, select }) {
			const { curTemplate } = yield select(state => state.template);
			yield put({
				type: 'updateState',
				payload: { loading: true },
			});
			const draft = {
				encoding: 'UTF-8',
				type: curTemplate.model_name || generateModelName(),
				backgroundColor: 'white',
				fillFields: [],
				layers: [],
				layerCount: 0,
			};
			const result = purifyJsonOfBackEnd(payload.draft);
			draft.fillFields = result.bindFields;
			draft.layers = result.layers;
			draft.layerCount = result.layers.length;

			downloadJsonAsDraft(curTemplate.name, draft);
		},
		*fetchTemplateDetail({ payload = {} }, { call, put, select }) {
			yield put({
				type: 'updateState',
				payload: { loading: true },
			});
			const response = yield call(TemplateService.fetchTemplateDetail, payload);
			if (response && response.code === ERROR_OK) {
				const { stage } = yield select(state => state.studio);
				const templateInfo = response.data.template_info;

				yield put({
					type: 'updateState',
					payload: {
						curTemplate: response.data.template_info,
					},
				});

				let { zoomScale, layers } = JSON.parse(templateInfo.studio_info || '{}') || {};
				zoomScale = zoomScale || MAPS.screen[payload.screenType].zoomScale;
				yield put({
					type: 'studio/updateState',
					payload: {
						zoomScale
					},
				});
				layers = layers || [];

				initTemplateDetail(stage, layers, zoomScale);

				const componentsDetail = {
					isStep: !!templateInfo.studio_info
				};
				let hasImage = false;
				for (let i = 0; i < layers.length; i++) {
					const layer = layers[i];
					if (!layer.name) {
						layer.name = `${layer.type}${i}`;
					}
					componentsDetail[layer.name] = layers[i];
					hasImage = hasImage || IMAGE_TYPES.includes(layers[i].type);
				}

				if (hasImage) {
					(yield Promise.all(
						layers
							.map(layer => {
								if (IMAGE_TYPES.includes(layer.type)) {
									return getImagePromise(layer);
								}
								return undefined;
							})
							.filter(item => item)
					)).forEach(value => {
						componentsDetail[value.name].image = value.image;
					});
					yield put({
						type: 'studio/addComponentsDetail',
						payload: componentsDetail,
					});
				} else {
					yield put({
						type: 'studio/addComponentsDetail',
						payload: componentsDetail,
					});
				}
			} else {
				yield put({
					type: 'updateState',
					payload: { loading: false },
				});
			}
			return response;
		},
		*uploadImage({ payload = {} }, { call, put }) {
			yield put({
				type: 'updateState',
				payload: { loading: true },
			});
			const response = yield call(TemplateService.uploadImage, payload);
			if (response && response.code === ERROR_OK) {
				yield put({
					type: 'updateState',
					payload: { loading: false },
				});
				message.success(formatMessage({ id: 'esl.device.template.action.upload.success' }));
			} else {
				yield put({
					type: 'updateState',
					payload: { loading: false },
				});
				message.error(formatMessage({ id: 'esl.device.template.action.upload.error' }));
			}
			return response;
		},
		*deleteTemplate({ payload = {} }, { call, put, select }) {
			const {
				data,
				pagination: { current },
			} = yield select(state => state.template);
			yield put({
				type: 'updateState',
				payload: { loading: true },
			});
			const response = yield call(TemplateService.deleteTemplate, payload);
			if (response && response.code === ERROR_OK) {
				yield put({
					type: 'updateState',
					payload: { loading: false },
				});
				yield put({
					type: 'fetchTemplates',
					payload: {
						options: {
							screen_type: -1,
							colour: -1,
							current: data.length > 1 ? current : current - 1,
						},
					},
				});
				message.success(formatMessage({ id: 'esl.device.template.action.delete.success' }));
			} else {
				yield put({
					type: 'updateState',
					payload: { loading: false },
				});
				if (ALERT_NOTICE_MAP[response.code]) {
					message.error(formatMessage({ id: ALERT_NOTICE_MAP[response.code] }));
				} else {
					message.error(formatMessage({ id: 'esl.device.template.action.delete.error' }));
				}
			}
			return response;
		},
		*renameTemplate({ payload = {} }, { call, put }) {
			yield put({
				type: 'updateState',
				payload: { loading: true },
			});
			const response = yield call(TemplateService.renameTemplate, payload);
			if (response && response.code === ERROR_OK) {
				yield put({
					type: 'updateState',
					payload: { loading: false },
				});
			} else {
				yield put({
					type: 'updateState',
					payload: { loading: false },
				});
				if (ALERT_NOTICE_MAP[response.code]) {
					message.error(formatMessage({ id: ALERT_NOTICE_MAP[response.code] }));
				} else {
					message.error(formatMessage({ id: 'esl.device.template.action.modify.name.error' }));
				}
			}
			return response;
		},
		*applyTemplate({ payload = {} }, { call, put }) {
			yield put({
				type: 'updateState',
				payload: { loading: true },
			});
			const response = yield call(TemplateService.applyTemplate, payload);
			if (response && response.code === ERROR_OK) {
				yield put({
					type: 'updateState',
					payload: { loading: false },
				});
				yield put({
					type: 'fetchTemplates',
					payload: {
						options: {
							screen_type: -1,
							colour: -1,
						},
					},
				});
				message.success(formatMessage({ id: 'esl.device.template.action.apply.success' }));
			} else {
				yield put({
					type: 'updateState',
					payload: { loading: false },
				});
				message.error(formatMessage({ id: 'esl.device.template.action.apply.error' }));
			}
			return response;
		},
		*cloneTemplate({ payload = {} }, { call, put }) {
			yield put({
				type: 'updateState',
				payload: { loading: true },
			});
			const response = yield call(TemplateService.cloneTemplate, payload);
			if (response && response.code === ERROR_OK) {
				yield put({
					type: 'updateState',
					payload: { loading: false },
				});
				yield put({
					type: 'fetchTemplates',
					payload: {
						options: {
							screen_type: -1,
							colour: -1,
						},
					},
				});
				message.success(formatMessage({ id: 'esl.device.template.action.clone.success' }));
			} else {
				yield put({
					type: 'updateState',
					payload: { loading: false },
				});
				if (ALERT_NOTICE_MAP[response.code]) {
					message.error(formatMessage({ id: ALERT_NOTICE_MAP[response.code] }));
				} else {
					message.error(formatMessage({ id: 'esl.device.template.action.modify.name.error' }));
				}
			}
			return response;
		},
		*uploadTemplate({ payload = {} }, { call, put, select }) {
			const {
				data,
				pagination: { current },
			} = yield select(state => state.template);
			yield put({
				type: 'updateState',
				payload: { loading: true },
			});
			const response = yield call(TemplateService.uploadTemplate, payload);
			if (response && response.code === ERROR_OK) {
				yield put({
					type: 'updateState',
					payload: { loading: false },
				});
				yield put({
					type: 'fetchTemplates',
					payload: {
						options: {
							screen_type: -1,
							colour: -1,
							current: data.length > 1 ? current : current - 1,
						},
					},
				});
				message.success(formatMessage({ id: 'esl.device.template.action.upload.success' }));
			} else {
				yield put({
					type: 'updateState',
					payload: { loading: false },
				});
				if (ALERT_NOTICE_MAP[response.code]) {
					message.error(formatMessage({ id: ALERT_NOTICE_MAP[response.code] }));
				} else {
					message.error(formatMessage({ id: 'esl.device.template.action.upload.error' }));
				}
			}
			return response;
		},
		*previewTemplate({ payload = {} }, { call }) {
			return yield call(TemplateService.previewTemplate, payload);
		},
		*realTimePreview({ payload = {} }, { call, select }) {
			const { curTemplate, fontList } = yield select(state => state.template);
			const draft = {
				encoding: 'UTF-8',
				type: curTemplate.model_name,
				backgroundColor: 'white',
				fillFields: [],
				layers: [],
				layerCount: 0,
			};
			const result = purifyJsonOfBackEnd(payload.draft, fontList);
			draft.fillFields = result.bindFields;
			draft.layers = result.layers;
			draft.layerCount = result.layers.length;
			return yield call(TemplateService.realTimePreview, {
				...payload,
				draft: JSON.stringify(draft),
			});
		},
		*fetchFontList({ payload = {} }, { call, put }) {
			const response = yield call(TemplateService.getFontList, payload);
			yield put({
				type: 'updateState',
				payload: {
					fontList: response.data.font_list || [],
				},
			});
		},
		*uploadFont({ payload = {} }, { call, put }) {
			yield put({
				type: 'updateState',
				payload: { loading: true },
			});
			Modal.info({
				title: formatMessage({id: 'studio.upload.font'}),
				content: formatMessage({id: 'studio.upload.font.waiting.message'}),
				okText: formatMessage({id: 'btn.confirm'}),
				okButtonProps: { style: { display: 'none' } },
			});
			const response = yield call(TemplateService.uploadFont, payload);
			Modal.destroyAll();
			if (response && response.code === ERROR_OK) {
				yield put({
					type: 'updateState',
					payload: { loading: false },
				});
				yield put({
					type: 'fetchFontList',
					payload: {},
				});
				Modal.success({
					title: formatMessage({id: 'studio.upload.font.success.title'}),
					content: formatMessage({id: 'studio.upload.font.success'}),
					okText: formatMessage({id: 'btn.confirm'})
				});
			} else {
				yield put({
					type: 'updateState',
					payload: { loading: false },
				});
				Modal.error({
					title: formatMessage({id: 'studio.upload.font.fail.title'}),
					content:
						response.code === 5351 ?
							formatMessage({id: 'studio.upload.font.fail.again'}) :
							formatMessage({id: 'studio.upload.font.fail'}),
					okText: formatMessage({id: 'btn.confirm'})
				});
			}
			return response;
		},
		*fetchCustomTemplateConfig({ payload = {} }, { call, put }) {
			yield put({
				type: 'updateState',
				payload: { loading: true },
			});
			const response = yield call(TemplateService.getCustomTemplateConfig, payload);
			if (response && response.code === ERROR_OK) {
				yield put({
					type: 'updateState',
					payload: {
						loading: false,
						templateConfig: response.data.custom_tmpl_config || [],
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
		*updateCustomTemplateConfig({ payload = {} }, { call, put }) {
			yield put({
				type: 'updateState',
				payload: { loading: true },
			});
			const response = yield call(TemplateService.updateCustomTemplateConfig, payload);
			if (response && response.code === ERROR_OK) {
				yield put({
					type: 'updateState',
					payload: { loading: false },
				});
				message.success(formatMessage({ id: 'esl.device.template.action.apply.default.success' }));
			} else {
				yield put({
					type: 'updateState',
					payload: { loading: false },
				});
				message.error(formatMessage({ id: 'esl.device.template.action.apply.default.error' }));
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
