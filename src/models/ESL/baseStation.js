import * as Actions from '@/api/ESL/baseStation';
import { ERROR_OK, SHOW_VCODE, VCODE_ERROR } from '@/constants/errorCode';
import { DEFAULT_PAGE_LIST_SIZE, DEFAULT_PAGE_SIZE } from '@/constants';
import Storage from '@konata9/storage.js';

export default {
  namespace: 'eslBaseStation',
  state: {
    loading: false,
    searchForm: {
      baseStationID: null,
      status: -1,
    },
    states: [],
    data: [],
    deviceInfoList: [],
    pagination: {
      current: 1,
      pageSize: Storage.get('deviceStationPageSize') || DEFAULT_PAGE_SIZE,
      total: 0,
      pageSizeOptions: DEFAULT_PAGE_LIST_SIZE,
      showSizeChanger: true,
      showQuickJumper: true,
    },
  },
  effects: {
    *sendCode({ payload }, { call, put }) {
      const { options } = payload;
      const response = yield call(Actions.sendCode, options);
      if (response && response.code === ERROR_OK) {
        yield put({
          type: 'setImgCode',
          payload: {
            needImgCaptcha: false,
            imgCaptcha: {},
          },
        });
      } else if (response && [SHOW_VCODE, VCODE_ERROR].includes(response.code)) {
        const result = response.data || {};
        yield put({
          type: 'setImgCode',
          payload: {
            needImgCaptcha: true,
            imgCaptcha: {
              key: result.key || '',
              url: `data:image/png;base64,${result.url}` || '',
            },
          },
        });
      }
      return response;
    },

    *checkUser({ payload }, { call, put }) {
      const { options } = payload;
      const response = yield call(Actions.checkUser, options);
      yield put({
        type: 'checkUser',
      });
      return response;
    },

    *getImageCode(_, { call, put }) {
      const response = yield call(Actions.getImageCode);
      if (response && response.code === ERROR_OK) {
        const result = response.data || {};
        yield put({
          type: 'saveImageCode',
          payload: {
            key: result.key,
            url: `data:image/png;base64,${result.url}` || '',
          },
        });
      }
    },

    *verifyCode({ payload }, { call }) {
      const { options } = payload;
      const response = yield call(Actions.verifyCode, options);
      return response;
    },
  },

  reducers: {
    checkUser(state) {
      return {
        ...state,
      };
    },
    setImgCode(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
    saveImageCode(state, action) {
      return {
        ...state,
        imgCode: {
          ...state.imgCode,
          ...action.payload,
        },
      };
    },
  },
};
