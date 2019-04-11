import { query as queryUsers, queryCurrent } from '@/services/user';
import * as Actions from '@/api/user';
import { ERROR_OK } from '@/constants/errorCode';
import Storage from '@konata9/storage.js';

export default {
  namespace: 'user',

  state: {
    userInfo: {},
    list: [],
    currentUser: {},
  },

  effects: {
    *login({ payload }, { call, put }) {
      const { type, options } = payload;
      const response = yield call(Actions.login, type, options);

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
      const response = yield call(Actions.logout);
      yield put({
        type: 'logout',
      });
      return response;
    },

    *register({ payload }, { call, put }) {
      const { options } = payload;
      const response = yield call(Actions.register, options);
      yield put({
        type: 'register',
      });
      return response;
    },

    *getUserInfo(_, { call, put }) {
      const response = yield call(Actions.getUserInfo);
      console.log(response);
      if (response && response.code === ERROR_OK) {
        const result = response.data || {};
        yield put({
          type: 'getUserInfoData',
          payload: result,
        });
      }
    },

    *resetPassword({ payload }, { call }) {
      const { options } = payload;
      const response = yield call(Actions.resetPassword, options);
      console.log(response);
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
    register(state) {
      return {
        ...state,
      };
    },
    getUserInfoData(state, action) {
      return {
        ...state,
        userInfo: action.payload,
      };
    },
    resetPassword(state) {
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
