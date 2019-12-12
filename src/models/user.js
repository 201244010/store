import { message } from 'antd';
import { formatMessage } from 'umi/locale';
import * as Actions from '@/services/user';
import { ERROR_OK, ALERT_NOTICE_MAP } from '@/constants/errorCode';
import * as CookieUtil from '@/utils/cookies';
import Storage from '@konata9/storage.js';

export default {
	namespace: 'user',

	state: {
		userInfo: {},
		loading: false,
		errorTimes: 0,
		list: [],
		currentUser: CookieUtil.getCookieByKey(CookieUtil.USER_INFO_KEY) || {},
	},

	effects: {
		*login({ payload }, { call, put }) {
			const { type, options } = payload;
			yield put({
				type: 'updateState',
				payload: { loading: true },
			});

			CookieUtil.clearCookies();
			Storage.remove(
				[CookieUtil.SHOP_LIST_KEY, CookieUtil.COMPANY_LIST_KEY, 'FILTERED_MENU'],
				'local'
			);

			const response = yield call(Actions.login, type, options);

			if (response && response.code === ERROR_OK) {
				const token = response.data;
				CookieUtil.setCookieByKey(CookieUtil.TOKEN_KEY, token);
				yield put({
					type: 'updateState',
					payload: { loading: false },
				});
			} else {
				yield put({
					type: 'updateState',
					payload: { loading: false },
				});

				yield put({
					type: 'computeErrorTime',
					payload: 1,
				});
			}

			return response;
		},
		*logout(_, { call, put }) {
			call(Actions.logout);
			yield put({
				type: 'initState',
			});
			CookieUtil.clearCookies();
			Storage.remove(
				[CookieUtil.SHOP_LIST_KEY, CookieUtil.COMPANY_LIST_KEY, 'FILTERED_MENU'],
				'local'
			);

			window.location.reload();
			// yield put({
			// 	type: 'menu/goToPath',
			// 	payload: {
			// 		pathId: 'userLogin',
			// 		linkType: 'replace',
			// 	},
			// });
			// router.push('/user/login');
		},
		*checkImgCode({ payload }, { call }) {
			const { options } = payload;
			return yield call(Actions.checkImgCode, options);
		},
		*register({ payload }, { call }) {
			const { options } = payload;
			const response = yield call(Actions.register, options);
			if (response && response.code !== ERROR_OK) {
				message.error(formatMessage({ id: ALERT_NOTICE_MAP[response.code] }));
			}
			return response;
		},
		*getUserInfo(_, { call, put }) {
			const response = yield call(Actions.getUserInfo);
			if (response && response.code === ERROR_OK) {
				const result = response.data || {};
				CookieUtil.setCookieByKey(CookieUtil.USER_INFO_KEY, result);
				yield put({
					type: 'storeUserInfo',
					payload: result,
				});
			}
		},
		getUserInfoFromStorage() {
			return CookieUtil.getCookieByKey(CookieUtil.USER_INFO_KEY) || null;
		},
		*resetPassword({ payload }, { call }) {
			const { options } = payload;
			return yield call(Actions.resetPassword, options);
		},
		*updateUsername({ payload }, { call, put, select }) {
			const { options } = payload;
			const response = yield call(Actions.updateUsername, options);
			if (response && response.code === ERROR_OK) {
				message.success(formatMessage({ id: 'userCenter.basicInfo.nameChange.success' }));
				const { username } = options;
				const currentUser = yield select(state => state.user.currentUser);
				const updatedUserInfo = {
					...currentUser,
					username,
				};

				CookieUtil.setCookieByKey(CookieUtil.USER_INFO_KEY, updatedUserInfo);
				yield put({
					type: 'storeUserInfo',
					payload: updatedUserInfo,
				});
			} else {
				message.error(formatMessage({ id: 'userCenter.basicInfo.nameChange.fail' }));
			}
		},
		*changePassword({ payload }, { call }) {
			const { options } = payload;
			const response = yield call(Actions.changePassword, options);
			if (response && response.code === ERROR_OK) {
				message.success(formatMessage({ id: 'change.password.success' }));
				CookieUtil.clearCookies();
			}
			return response;
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

				CookieUtil.setCookieByKey(CookieUtil.USER_INFO_KEY, updatedUserInfo);
				yield put({
					type: 'storeUserInfo',
					payload: updatedUserInfo,
				});
			}

			return response;
		},
		*updateIcon({ payload }, { call, put }) {
			const { options } = payload;
			const response = yield call(Actions.updateIcon, options);
			if (response && response.code === ERROR_OK) {
				yield put({
					type: 'getUserInfo',
				});
			}
		},
		*checkUserExist({ payload }, { call }) {
			const { options } = payload;
			const response = yield call(Actions.checkUserExist, options);
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
		computeErrorTime(state, action) {
			return {
				...state,
				errorTimes: state.errorTimes + action.payload,
			};
		},
		storeUserInfo(state, action) {
			return {
				...state,
				currentUser: action.payload || {},
			};
		},
		initState(state) {
			return {
				...state,
				userInfo: {},
				currentUser: {},
				errorTimes: 0,
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
