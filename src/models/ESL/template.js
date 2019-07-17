import { message } from 'antd';
import { formatMessage } from 'umi/locale';
import { hideSinglePageCheck } from '@/utils/utils';
import { getImagePromise } from '@/utils/studio';
import { DEFAULT_PAGE_LIST_SIZE, DEFAULT_PAGE_SIZE } from '@/constants';
import * as TemplateService from '@/services/ESL/template';
import { ERROR_OK, ALERT_NOTICE_MAP } from '@/constants/errorCode';
import {
	IMAGE_TYPES,
	SHAPE_TYPES,
	BARCODE_TYPES,
	NORMAL_PRICE_TYPES,
	NON_NORMAL_PRICE_TYPES,
	MAPS,
	RECT_SELECT_NAME
} from '@/constants/studio';

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
				backgroundColor: '',
				fillFields: [],
				layers: [],
				layerCount: 0,
			};
			const layers = [];
			const originOffset = {};
			const bindFields = [];
			Object.keys(payload.draft).map(key => {
				const componentDetail = payload.draft[key];
				if (componentDetail.type === SHAPE_TYPES.RECT_FIX) {
					originOffset.x = componentDetail.x;
					originOffset.y = componentDetail.y;
					draft.backgroundColor = componentDetail.fill;
				}
				if (componentDetail.bindField) {
				    bindFields.push(componentDetail.bindField);
				}
			});
			draft.fillFields = bindFields;
			delete payload.draft[RECT_SELECT_NAME];
			Object.keys(payload.draft).map(key => {
				const componentDetail = { ...payload.draft[key]};
				Object.keys(componentDetail).map(detailKey => {
					componentDetail.content = componentDetail.content ? componentDetail.content :
						(componentDetail.bindField ? `{{${componentDetail.bindField}}}` : (componentDetail.text || ''));
					if (['height', 'width'].includes(detailKey)) {
						const realKey = `back${detailKey.replace(/^\S/, s => s.toUpperCase())}`;
						if (SHAPE_TYPES.IMAGE === componentDetail.type) {
							const backWidth = Math.round(MAPS.containerWidth[componentDetail.type] * componentDetail.scaleX);
							componentDetail.backWidth = backWidth;
							componentDetail.backHeight = backWidth * componentDetail.ratio;
						} else if (SHAPE_TYPES.HLine === componentDetail.type) {
							componentDetail.backWidth = Math.round(MAPS.containerWidth[componentDetail.type] * componentDetail.scaleX);
							componentDetail.backHeight = componentDetail.strokeWidth;
						} else if (SHAPE_TYPES.VLine === componentDetail.type) {
							componentDetail.backWidth = componentDetail.strokeWidth;
							componentDetail.backHeight = Math.round(MAPS.containerHeight[componentDetail.type] * componentDetail.scaleY);
						} else {
							const scale = {
								width: componentDetail.scaleX,
								height: componentDetail.scaleY,
							};
							const size = {
								width: MAPS.containerWidth,
								height: MAPS.containerHeight,
							};
							componentDetail[realKey] = Math.round(size[detailKey][componentDetail.type] * scale[detailKey]);
						}
					}
					if (['x', 'y'].includes(detailKey)) {
						if (componentDetail.type !== SHAPE_TYPES.RECT_FIX) {
							componentDetail.backStartX = ((componentDetail.x - originOffset.x) / componentDetail.zoomScale).toFixed();
							componentDetail.backStartY = ((componentDetail.y - originOffset.y) / componentDetail.zoomScale).toFixed();
							if (NON_NORMAL_PRICE_TYPES.includes(componentDetail.type)) {
								const intPriceText = `${componentDetail.text}`.split('.')[0];
								const smallPriceText = `${componentDetail.text}`.split('.')[1] || '';
								let backSmallStartY = 0;
								if (componentDetail.type.indexOf(SHAPE_TYPES.PRICE_SUPER)) {
									backSmallStartY =
										(MAPS.containerHeight[componentDetail.type] * componentDetail.scaleY - componentDetail.fontSize) / 2;
								}
								const intTextWidth = (componentDetail.fontSize / 2) * (intPriceText.length + (smallPriceText ? 0.7 : 0));
								const textWidth = intTextWidth + (smallPriceText.length * componentDetail.smallFontSize) / 2;
								let intXPosition = 0;
								if (componentDetail.align === 'center') {
									intXPosition = (MAPS.containerWidth[componentDetail.type] * componentDetail.scaleX - textWidth) / 2;
								}
								if (componentDetail.align === 'right') {
									intXPosition = MAPS.containerWidth[componentDetail.type] * componentDetail.scaleX - textWidth;
								}
								componentDetail.backType = SHAPE_TYPES.PRICE;
								componentDetail.backIntStartX = Math.round(componentDetail.backStartX) + Math.round(intXPosition);
								componentDetail.backIntStartY = Math.round(componentDetail.backStartY) + Math.round(backSmallStartY);
								componentDetail.backSmallStartX = componentDetail.backIntStartX + Math.round(intTextWidth);
								if (componentDetail.type.indexOf(SHAPE_TYPES.PRICE_SUPER) > -1) {
									componentDetail.backSmallStartY = componentDetail.backIntStartY;
								} else {
									componentDetail.backSmallStartY = componentDetail.backIntStartY + componentDetail.fontSize - componentDetail.smallFontSize;
								}
							}
						}
					}
					if (['type'].includes(detailKey)) {
						const realKey = `back${detailKey.replace(/^\S/, s => s.toUpperCase())}`;
						if (
							[...NORMAL_PRICE_TYPES, SHAPE_TYPES.RECT, SHAPE_TYPES.HLine, SHAPE_TYPES.VLine].includes(componentDetail.type)
						) {
							componentDetail[realKey] = SHAPE_TYPES.TEXT;
						}
						if (BARCODE_TYPES.includes(componentDetail.type)) {
							componentDetail[realKey] = SHAPE_TYPES.CODE;
							componentDetail.codec = componentDetail.type === SHAPE_TYPES.CODE_QR ? 'qrcode' : componentDetail.codec;
						}
						if ([SHAPE_TYPES.TEXT].includes(componentDetail.type)) {
							componentDetail[realKey] = SHAPE_TYPES.TEXT;
						}
						if ([SHAPE_TYPES.IMAGE].includes(componentDetail.type)) {
							componentDetail[realKey] = 'picture';
							if (componentDetail.imgPath.indexOf('.png') > -1) {
								componentDetail.codec = 'png';
							} else {
								componentDetail.codec = 'jpeg';
							}
						}
					}
					if (['fill'].includes(detailKey)) {
						if ([...NORMAL_PRICE_TYPES, ...NON_NORMAL_PRICE_TYPES, SHAPE_TYPES.TEXT].includes(componentDetail.type)) {
							componentDetail.backBg = componentDetail.textBg;
						}
						if ([SHAPE_TYPES.RECT].includes(componentDetail.type)) {
							componentDetail.backBg = componentDetail.fill;
							componentDetail.fontFamily = '';
							componentDetail.fontSize = '';
						}
					}
					if (['stroke'].includes(detailKey)) {
						if ([SHAPE_TYPES.HLine, SHAPE_TYPES.VLine].includes(componentDetail.type)) {
							componentDetail.backBg = componentDetail.stroke;
							componentDetail.fill = componentDetail.stroke;
							componentDetail.fontFamily = '';
							componentDetail.fontSize = '';
						}
					}
				});
				layers.push(payload.draft[key]);
			});
			draft.layers = layers;
			draft.layerCount = layers.length;

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
		*fetchTemplateDetail({ payload = {} }, { call, put }) {
			yield put({
				type: 'updateState',
				payload: { loading: true },
			});
			const response = yield call(TemplateService.fetchTemplateDetail, payload);
			if (response && response.code === ERROR_OK) {
				const templateInfo = response.data.template_info;
				yield put({
					type: 'updateState',
					payload: {
						curTemplate: response.data.template_info,
					},
				});
				let { layers } = JSON.parse(templateInfo.studio_info || '{}') || {};
				layers = layers || [];
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
				message.error('克隆失败');
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
