import { query as queryUsers, queryCurrent } from '@/services/user';
import { login, logout } from '@/api/user';
import { ERROR_OK } from '@/constants/errorCode';
import Storage from '@konata9/storage.js';

export default {
  namespace: 'user',

  state: {
    list: [],
    currentUser: {},
  },

  effects: {
    *login({ payload }, { call, put }) {
      const { type, options } = payload;
      const response = yield call(login, type, options);

      if (response && response.code === ERROR_OK) {
        const token = response.data;
        Storage.set({ __token__: token });
      }

      yield put({
        type: 'login',
      });

      return response;
    },

    *logout(_, { call, put }) {
      const response = yield call(logout);
      yield put({
        type: 'logout',
      });
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
    login(state) {
      return {
        ...state,
      };
    },
    logout(state) {
      return {
        ...state,
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
