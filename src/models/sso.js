import * as Actions from '@/api/sso';
import { ERROR_OK } from '@/constants/errorCode';

export default {
  namespace: 'sso',
  state: {
    imgUrl: null,
  },
  effects: {
    *sendCode({ payload }, { call, put }) {
      const { options } = payload;
      const response = yield call(Actions.sendCode, options);
      yield put({
        type: 'sendCode',
      });
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
          payload: `data:image/png;base64,${result.url}` || '',
        });
      }
    },
  },

  reducers: {
    sendCode(state) {
      return {
        ...state,
      };
    },
    checkUser(state) {
      return {
        ...state,
      };
    },
    saveImageCode(state, action) {
      return {
        ...state,
        imgUrl: action.payload,
      };
    },
  },
};
