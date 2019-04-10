import { sendCode } from '@/api/sso';

export default {
  namespace: 'sso',
  state: {},
  effects: {
    *sendCode({ payload }, { call, put }) {
      const { options } = payload;
      yield call(sendCode, options);
      yield put({
        type: 'sendCode',
      });
    },
  },

  reducers: {
    sendCode(state) {
      return {
        ...state,
      };
    },
  },
};
