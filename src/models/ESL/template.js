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

            const response = yield call(TemplateService.saveAsDraft, payload);
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
                const componentsDetail = JSON.parse(response.data.template_info.studio_info);
                const detailKeys = Object.keys(componentsDetail);

                const hasImage = detailKeys.filter(key => key.indexOf(SHAPE_TYPES.IMAGE) > -1);

                if (hasImage) {
                    Promise.all(detailKeys.map(key => {
                        if (componentsDetail[key].type === SHAPE_TYPES.IMAGE) {
                            return getImagePromise(componentsDetail[key])
                        }
                        return undefined;
                    }).filter(item => item)).then(function *it (values) {
                        values.forEach(value => {
                            componentsDetail[value.name].image = value.image;
                        });
                        yield put({
                            type: 'studio/addComponentDetail',
                            payload: response.data.template_info
                        });
                    });
                } else {
                    yield put({
                        type: 'studio/addComponentDetail',
                        payload: componentsDetail
                    });
                }
            } else {
                yield put({
                    type: 'updateState',
                    payload: { loading: false },
                });
            }
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
