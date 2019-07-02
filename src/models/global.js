// import { queryNotices } from '@/services/user';
import * as CookieUtil from '@/utils/cookies';
import Storage from '@konata9/storage.js';

export default {
	namespace: 'global',

	state: {
		collapsed: false,
		notices: [],
	},

	effects: {
		getUserInfoFromStorage() {
			return CookieUtil.getCookieByKey(CookieUtil.USER_INFO_KEY) || null;
		},

		getCompanyIdFromStorage() {
			return CookieUtil.getCookieByKey(CookieUtil.COMPANY_ID_KEY) || null;
		},

		getShopIdFromStorage() {
			return CookieUtil.getCookieByKey(CookieUtil.SHOP_ID_KEY) || null;
		},

		getShopListFromStorage() {
			return Storage.get('__shop_list__', 'local') || [];
		},

		getCompanyListFromStorage() {
			return Storage.get('__company_list__', 'local') || [];
		},

		// *fetchNotices(_, { call, put, select }) {
		// 	const data = yield call(queryNotices);
		// 	yield put({
		// 		type: 'saveNotices',
		// 		payload: data,
		// 	});
		// 	const unreadCount = yield select(
		// 		state => state.global.notices.filter(item => !item.read).length
		// 	);
		// 	yield put({
		// 		type: 'user/changeNotifyCount',
		// 		payload: {
		// 			totalCount: data.length,
		// 			unreadCount,
		// 		},
		// 	});
		// },
		*clearNotices({ payload }, { put, select }) {
			yield put({
				type: 'saveClearedNotices',
				payload,
			});
			const count = yield select(state => state.global.notices.length);
			const unreadCount = yield select(
				state => state.global.notices.filter(item => !item.read).length
			);
			yield put({
				type: 'user/changeNotifyCount',
				payload: {
					totalCount: count,
					unreadCount,
				},
			});
		},
		*changeNoticeReadState({ payload }, { put, select }) {
			const notices = yield select(state =>
				state.global.notices.map(item => {
					const notice = { ...item };
					if (notice.id === payload) {
						notice.read = true;
					}
					return notice;
				})
			);
			yield put({
				type: 'saveNotices',
				payload: notices,
			});
			yield put({
				type: 'user/changeNotifyCount',
				payload: {
					totalCount: notices.length,
					unreadCount: notices.filter(item => !item.read).length,
				},
			});
		},
	},

	reducers: {
		changeLayoutCollapsed(state, { payload }) {
			return {
				...state,
				collapsed: payload,
			};
		},
		saveNotices(state, { payload }) {
			return {
				...state,
				notices: payload,
			};
		},
		saveClearedNotices(state, { payload }) {
			return {
				...state,
				notices: state.notices.filter(item => item.type !== payload),
			};
		},
	},

	subscriptions: {
		setup({ history }) {
			// Subscribe history(url) change, trigger `load` action if pathname is `/`
			return history.listen(({ pathname, search }) => {
				if (typeof window.ga !== 'undefined') {
					window.ga('send', 'pageview', pathname + search);
				}
			});
		},
	},
};
