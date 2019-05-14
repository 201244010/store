import { message } from 'antd';
import { hideSinglePageCheck } from "@/utils/utils";
import { getImagePromise } from "@/utils/studio";
import { DEFAULT_PAGE_LIST_SIZE, DEFAULT_PAGE_SIZE } from "@/constants";
import * as TemplateService from '@/services/ESL/template';
import { ERROR_OK } from '@/constants/errorCode';
import { IMAGE_TYPES, SHAPE_TYPES, BARCODE_TYPES, PRICE_TYPES } from "@/constants/studio";

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
        },
        pagination: {
            current: 1,
            pageSize: DEFAULT_PAGE_SIZE,
            total: 0,
            pageSizeOptions: DEFAULT_PAGE_LIST_SIZE,
            showSizeChanger: true,
            showQuickJumper: true,
        },
        curTemplate: {}
    },
    effects: {
        * changeSearchFormValue({ payload = {} }, { put }) {
            const { options = {} } = payload;
            yield put({
                type: 'setSearchFormValue',
                payload: {
                    ...options,
                },
            });
        },
        * fetchScreenTypes({ payload = {} }, { call, put }) {
            const response = yield call(TemplateService.fetchScreenTypes, payload);
            yield put({
                type: 'updateState',
                payload: {
                    screenTypes: response.data.screen_type_list || [],
                },
            });
        },
        * fetchBindFields({ payload = {} }, { call, put }) {
            const response = yield call(TemplateService.fetchBindFields, payload);
            yield put({
                type: 'updateState',
                payload: {
                    bindFields: response.data.bindable_product_field_list || [],
                },
            });
        },
        * fetchColors({ payload = {} }, { call, put }) {
            const response = yield call(TemplateService.fetchColors, payload);
            yield put({
                type: 'updateState',
                payload: {
                    colors: response.data.colour_list || [],
                },
            });
        },
        * createTemplate({ payload = {} }, { call, put }) {
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
                            colour: -1
                        }
                    }
                });
                message.success('新建模板成功');
            } else {
                yield put({
                    type: 'updateState',
                    payload: { loading: true },
                });
                message.error('新建模板失败');
            }
            return response;
        },
        * fetchTemplates({ payload = {} }, { call, put, select }) {
            const { options = {} } = payload;
            const { pagination, searchFormValues } = yield select(state => state.template);

            yield put({
                type: 'updateState',
                payload: { loading: true },
            });

            const opts = Object.assign({}, pagination, searchFormValues, options);
            const response = yield call(TemplateService.fetchTemplates, opts);
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
        * saveAsDraft({ payload = {} }, { call, put, select }) {
            const { bindFields, curTemplate } = yield select(state => state.template);
            yield put({
                type: 'updateState',
                payload: { loading: true },
            });
            const draft = {
                encoding: 'UTF-8',
                type: curTemplate.type,
                background_color: '',
                fill_fields: bindFields,
                layers: [],
                layer_count: 0,
            };
            const layers = [];
            const originOffset = {};
            Object.keys(payload.draft).map(key => {
                const componentDetail = payload.draft[key];
                if (componentDetail.type === SHAPE_TYPES.RECT_FIX) {
                    originOffset.x = componentDetail.x;
                    originOffset.y = componentDetail.y;
                    draft.background_color = componentDetail.fill;
                }
            });
            Object.keys(payload.draft).map(key => {
                const componentDetail = payload.draft[key];
                Object.keys(componentDetail).map(detailKey => {
                    componentDetail.content = componentDetail.bindField ? `{{${componentDetail.bindField}}}` : '';
                    if (["height", "width"].includes(detailKey)) {
                        const realKey = `back${detailKey.replace(/^\S/, s => s.toUpperCase())}`;
                        const scale = {
                            width: componentDetail.scaleX,
                            height: componentDetail.scaleY
                        };
                        componentDetail[realKey] =
                            (componentDetail[detailKey] * scale[detailKey] / componentDetail.zoomScale).toFixed();
                    }
                    if (["x", "y"].includes(detailKey)) {
                        if (componentDetail.type !== SHAPE_TYPES.RECT_FIX) {
                            componentDetail.backStartX =
                                ((componentDetail.x - originOffset.x) / componentDetail.zoomScale).toFixed();
                            componentDetail.backStartY =
                                ((componentDetail.y - originOffset.y) / componentDetail.zoomScale).toFixed();
                        }
                    }
                    if (["type"].includes(detailKey)) {
                        const realKey = `back${detailKey.replace(/^\S/, s => s.toUpperCase())}`;
                        if ([...PRICE_TYPES, SHAPE_TYPES.RECT].includes(componentDetail.type)) {
                            componentDetail[realKey] = SHAPE_TYPES.TEXT;
                        }
                        if (BARCODE_TYPES.includes(componentDetail.type)) {
                            componentDetail[realKey] = SHAPE_TYPES.CODE;
                            componentDetail.codec = componentDetail.type === SHAPE_TYPES.CODE_QR ? 'qrcode' : 'ean13';
                        }
                        if ([SHAPE_TYPES.TEXT].includes(componentDetail.type)) {
                            componentDetail[realKey] = SHAPE_TYPES.TEXT;
                        }
                    }
                    if (["fill"].includes(detailKey)) {
                        if ([...PRICE_TYPES, SHAPE_TYPES.TEXT].includes(componentDetail.type)) {
                            componentDetail.backBg = componentDetail.textBg;
                        }
                        if ([SHAPE_TYPES.RECT].includes(componentDetail.type)) {
                            componentDetail.backBg = componentDetail.fill;
                            componentDetail.fontFamily = '';
                            componentDetail.fontSize = '';
                        }
                    }
                });
                layers.push(payload.draft[key]);
            });
            draft.layers = layers;
            draft.layer_count = layers.length;

            const response = yield call(TemplateService.saveAsDraft, {
                ...payload,
                draft: JSON.stringify(draft)
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
                    payload: { loading: true },
                });
                message.error('保存模板草稿失败');
            }
        },
        * fetchTemplateDetail({ payload = {} }, { call, put }) {
            yield put({
                type: 'updateState',
                payload: { loading: true },
            });
            const response = yield call(TemplateService.fetchTemplateDetail, payload);
            if (response && response.code === ERROR_OK) {
                yield put({
                    type: 'updateState',
                    payload: {
                        curTemplate: response.data.template_info
                    },
                });
                let { layers } = JSON.parse(response.data.template_info.studio_info) || {};
                layers = layers || [];
                const componentsDetail = {};
                let hasImage = false;
                layers.map(layer => {
                    componentsDetail[layer.name] = layer;
                    hasImage = hasImage || IMAGE_TYPES.includes(layer.type);
                });

                if (hasImage) {
                    (yield Promise.all(layers.map(layer => {
                        if (IMAGE_TYPES.includes(layer.type)) {
                            return getImagePromise(layer)
                        }
                        return undefined;
                    }).filter(item => item))).forEach(value => {
                        componentsDetail[value.name].image = value.image;
                    });
                    yield put({
                        type: 'studio/addComponentsDetail',
                        payload: componentsDetail
                    });
                } else {
                    yield put({
                        type: 'studio/addComponentsDetail',
                        payload: componentsDetail
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
        *deleteTemplate({ payload = {} }, { call, put }) {
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
                            colour: -1
                        }
                    }
                });
                message.success('删除成功');
            } else {
                yield put({
                    type: 'updateState',
                    payload: { loading: false },
                });
                message.error('删除失败');
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
            } else {
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
