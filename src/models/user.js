import * as Actions from '@/api/user';
import { ERROR_OK } from '@/constants/errorCode';
import Storage from '@konata9/storage.js';
import router from 'umi/router';

export default {
  namespace: 'user',

  state: {
    userInfo: {},
    errorTimes: 0,
    list: [],
    currentUser: Storage.get('__userInfo__') || {},
  },

  effects: {
    *login({ payload }, { call, put }) {
      const { type, options } = payload;
      const response = yield call(Actions.login, type, options);

      if (response && response.code === ERROR_OK) {
        const token = response.data;
        Storage.set({ __token__: token });
      } else {
        yield put({
          type: 'computeErrorTime',
          payload: 1,
        });
      }

      return response;
    },

    *logout(_, { call, put }) {
      yield call(Actions.logout);
      yield put({
        type: 'initState',
      });
      Storage.remove('__token__');
      router.push('/user/login');
    },

    *checkImgCode({ payload }, { call }) {
      const { options } = payload;
      const response = yield call(Actions.checkImgCode, options);
      return response;
    },

    *register({ payload }, { call }) {
      const { options } = payload;
      const response = yield call(Actions.register, options);
      // TODO 需要后端返回 token
      // if(response && response.code === ERROR_OK){
      //
      // }
      return response;
    },

    *getUserInfo(_, { call, put }) {
      const response = yield call(Actions.getUserInfo);
      if (response && response.code === ERROR_OK) {
        const result = response.data || {};
        Storage.set({ __userInfo__: result });
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

    *updateUsername({ payload }, { call, put, select }) {
      const { options } = payload;
      const response = yield call(Actions.updateUsername, options);
      if (response && response.code === 1) {
        const { username } = options;
        const currentUser = yield select(state => state.user.currentUser);
        const updatedUserInfo = {
          ...currentUser,
          username,
        };

        Storage.set({ __userInfo__: updatedUserInfo });
        yield put({
          type: 'setUserInfo',
          payload: updatedUserInfo,
        });
      }
    },

    *changePassword({ payload }, { call }) {
      const { options } = payload;
      const response = yield call(Actions.changePassword, options);
      if (response && response.code === ERROR_OK) {
        Storage.clear('session');
        router.push('/user/login');
      }
    },

    *updatePhone({ payload }, { call, put, select }) {
      const { options } = payload;
      const response = yield call(Actions.updatePhone, options);
      if (response && response.code === ERROR_OK) {
        const { phone } = options;
        const currentUser = yield select(state => state.user.currentUser);
        const updatedUserInfo = {
          ...currentUser,
          phone,
        };

        Storage.set({ __userInfo__: updatedUserInfo });
        yield put({
          type: 'setUserInfo',
          payload: updatedUserInfo,
        });
      }
    },
  },

  reducers: {
    computeErrorTime(state, action) {
      return {
        ...state,
        errorTimes: state.errorTimes + action.payload,
      };
    },
    setUserInfo(state, action) {
      return {
        ...state,
        currentUser: action.payload || {},
      };
    },
    initState(state) {
      return {
        ...state,
        userInfo: {},
        errorTimes: 0,
      };
    },
  },
};
