import { message } from 'antd';
import { hideSinglePageCheck } from "@/utils/utils";
import { getImagePromise } from "@/utils/studio";
import { DEFAULT_PAGE_LIST_SIZE, DEFAULT_PAGE_SIZE } from "@/constants";
import * as TemplateService from '@/services/ESL/template';
import { ERROR_OK } from '@/constants/errorCode';
import { SHAPE_TYPES } from '@/constants/studio';

export default {
    namespace: 'template',
    state: {
        loading: false,
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
        * saveAsDraft({ payload = {} }, { call, put }) {
            yield put({
                type: 'updateState',
                payload: { loading: true },
            });
            const draft = {
                name: 'Promote Template',
                background_color: 'white',
                encoding: 'UTF-8',
                fill_fields: ['product_name', 'product_price'],
                layer_count: 0,
                notes: 'This is promote template for ESL',
                type: 'BWR-2.13',
                layers: []
            };
            const layers = [];
            Object.keys(payload.draft).map(key => layers.push(payload.draft[key]));
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
                const { layers } = JSON.parse(response.data.template_info.studio_info) || {};
                const componentsDetail = {};
                let hasImage = false;
                layers.map(layer => {
                    componentsDetail[layer.name] = layer;
                    hasImage = hasImage || layer.type === SHAPE_TYPES.IMAGE;
                });

                if (hasImage) {
                    (yield Promise.all(layers.map(layer => {
                        if (layer.type === SHAPE_TYPES.IMAGE) {
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
