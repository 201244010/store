import { message } from 'antd';
import { formatMessage } from 'umi/locale';
import { hideSinglePageCheck } from '@/utils/utils';
import { getImagePromise, initTemplateDetail, purifyJsonOfBackEnd } from '@/utils/studio';
import { DEFAULT_PAGE_LIST_SIZE, DEFAULT_PAGE_SIZE } from '@/constants';
import * as TemplateService from '@/services/ESL/template';
import { ERROR_OK, ALERT_NOTICE_MAP } from '@/constants/errorCode';
import {IMAGE_TYPES, MAPS} from '@/constants/studio';

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
				message.success('新建模板成功');
			} else {
				yield put({
					type: 'updateState',
					payload: { loading: false },
				});
				if (ALERT_NOTICE_MAP[response.code]) {
					message.error(formatMessage({ id: ALERT_NOTICE_MAP[response.code] }));
				} else {
					message.error('新建模板失败');
				}
			}
			return response;
		},
		*fetchTemplates({ payload = {} }, { call, put, select }) {
			const { options = {} } = payload;
			const { pagination, searchFormValues } = yield select(state => state.template);

			yield put({
				type: 'updateState',
				payload: { loading: true },
			});

			const opts = Object.assign({}, pagination, searchFormValues, options);
			const response = yield call(TemplateService.fetchTemplates, {
				...opts,
				page_num: opts.current,
				page_size: opts.pageSize,
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
						hideOnSinglePage: hideSinglePageCheck(result.total_count) || true,
					},
				},
			});
		},
		*saveAsDraft({ payload = {} }, { call, put, select }) {
			const { curTemplate } = yield select(state => state.template);
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
			const result = purifyJsonOfBackEnd(payload.draft);
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
				message.success('保存模板草稿成功');
			} else {
				yield put({
					type: 'updateState',
					payload: { loading: false },
				});
				message.error('保存模板草稿失败');
			}
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

				// layers = [{
				// 	type: 'rect',
				// 	name: 'rect1',
				// 	background: 'red',
				// 	startX: 10,
				// 	startY: 10,
				// 	width: 450,
				// 	height: 150,
				// 	strokeWidth: 3,
				// 	strokeColor: 'black',
				// 	cornerRadius: 0,
				// 	rotation: 0
				// }, {
				// 	type: 'text',
				// 	name: 'text2',
				// 	background: 'white',
				// 	startX: 20,
				// 	startY: 20,
				// 	width: 450,
				// 	height: 150,
				// 	rotation: 0,
				// 	fontFamily: 'Microsoft Yahei',
				// 	fontSize: 14,
				// 	fontColor: 'black',
				// 	bold: false,
				// 	italic: false,
				// 	underline: false,
				// 	strikethrough: true,
				// 	align: 'left',
				// 	content: '商品名称',
				// 	bindField: '{{goods_name}}'
				// }, {
				// 	startX: 15,
				// 	startY: 200,
				// 	type: 'line@h',
				// 	name: 'line@h3',
				// 	background: 'black',
				// 	width: 50,
				// 	height: 1,
				// 	strokeWidth: 1,
				// 	strokeColor: 'black',
				// 	rotation: 0
				// }, {
				// 	startX: 15,
				// 	startY: 200,
				// 	type: 'line@v',
				// 	name: 'line@v4',
				// 	background: 'black',
				// 	width: 1,
				// 	height: 50,
				// 	strokeWidth: 1,
				// 	strokeColor: 'black',
				// 	rotation: 0
				// }, {
				// 	type: 'image',
				// 	name: 'image5',
				// 	startX: 200,
				// 	startY: 200,
				// 	rotation: 0,
				// 	width: 16,
				// 	height: 16
				// }, {
				// 	type: 'price@sub@white',
				// 	subType: 'sub',
				// 	name: 'price@sub@white6',
				// 	background: 'white',
				// 	startX: 0,
				// 	startY: 0,
				// 	width: 450,
				// 	height: 150,
				// 	strokeWidth: 3,
				// 	strokeColor: 'black',
				// 	precision: 2,
				// 	rotation: 0,
				// 	fontFamily: 'Microsoft Yahei',
				// 	fontSize: 14,
				// 	fontColor: 'black',
				// 	smallFontSize: 8,
				// 	bold: true,
				// 	italic: true,
				// 	underline: true,
				// 	strikethrough: true,
				// 	align: 'left',
				// 	content: '99.00',
				// 	bindField: '{{goods_name}}'
				// }, {
				// 	type: 'barcode@qr',
				// 	name: 'barcode@qr7',
				// 	startX: 9,
				// 	startY: 85,
				// 	width: 95,
				// 	height: 14,
				// 	codec: 'EAN13',
				// 	content: '1234561234567',
				// 	bindField: '{{bar_code}}'
				// }];
				initTemplateDetail(stage, layers, zoomScale, payload.screenType);

				const componentsDetail = {
					isStep: !!templateInfo.studio_info
				};
				let hasImage = false;
				layers.map(layer => {
					componentsDetail[layer.name] = layer;
					hasImage = hasImage || IMAGE_TYPES.includes(layer.type);
				});

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
				message.success('上传成功');
			} else {
				yield put({
					type: 'updateState',
					payload: { loading: false },
				});
				message.error('上传失败');
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
				message.success('删除成功');
			} else {
				yield put({
					type: 'updateState',
					payload: { loading: false },
				});
				if (ALERT_NOTICE_MAP[response.code]) {
					message.error(formatMessage({ id: ALERT_NOTICE_MAP[response.code] }));
				} else {
					message.error('删除失败');
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
					message.error('修改模板名称失败');
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
				message.success('应用成功');
			} else {
				yield put({
					type: 'updateState',
					payload: { loading: false },
				});
				message.error('应用失败');
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
				message.success('克隆成功');
			} else {
				yield put({
					type: 'updateState',
					payload: { loading: false },
				});
				if (ALERT_NOTICE_MAP[response.code]) {
					message.error(formatMessage({ id: ALERT_NOTICE_MAP[response.code] }));
				} else {
					message.error('修改模板名称失败');
				}
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
