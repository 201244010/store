import { query as queryUsers, queryCurrent } from '@/services/user';
import * as Actions from '@/api/user';
import { ERROR_OK } from '@/constants/errorCode';
import Storage from '@konata9/storage.js';
import router from 'umi/router';

export default {
  namespace: 'user',

  state: {
    userInfo: {},
    list: [],
    currentUser: {},
  },

  effects: {
    *login({ payload }, { call }) {
      const { type, options } = payload;
      const response = yield call(Actions.login, type, options);

      if (response && response.code === ERROR_OK) {
        const token = response.data;
        Storage.set({ __token__: token });
      }

      return response;
    },

    *logout(_, { call }) {
      yield call(Actions.logout);
      Storage.remove('__token__');
      router.push('/login');
    },

    *register({ payload }, { call }) {
      const { options } = payload;
      const response = yield call(Actions.register, options);
      return response;
    },

    *getUserInfo(_, { call, put }) {
      const response = yield call(Actions.getUserInfo);
      if (response && response.code === ERROR_OK) {
        const result = response.data || {};
        yield put({
          type: 'setUserInfo',
          payload: result,
        });
      }
    },

    *resetPassword({ payload }, { call }) {
      const { options } = payload;
      const response = yield call(Actions.resetPassword, options);
      return response;
    },

    *fetch(_, { call, put }) {
      const response = yield call(queryUsers);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *fetchCurrent(_, { call, put }) {
      const response = yield call(queryCurrent);
      yield put({
        type: 'saveCurrentUser',
        payload: response,
      });
    },
  },

  reducers: {
    setUserInfo(state, action) {
      return {
        ...state,
        userInfo: action.payload,
      };
    },
    save(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
    saveCurrentUser(state, action) {
      return {
        ...state,
        currentUser: action.payload || {},
      };
    },
    changeNotifyCount(state, action) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload.totalCount,
          unreadCount: action.payload.unreadCount,
        },
      };
    },
  },
};
