import * as Actions from '@/services/ESL/systemConfig';
import {ERROR_OK} from '@/constants/errorCode';

export default {
	namespace: 'systemConfig',
	state: {
		loading: false,
		displayConfig: {}
	},
	effects: {
		* getDisplayConfig(_, {put, call}) {
			const response = yield call(Actions.fetchDisplayConfig);
			if (response && response.code === ERROR_OK) {
				const {data = {}} = response;
				yield put({
					type: 'updateState',
					payload: {
						displayConfig: data
					},
				});
			}
			return response;
		},
		* updateScreenName({ payload = {} }, {put, call}) {
			const response = yield call(Actions.updateScreenName, payload);
			if (response && response.code === ERROR_OK) {
				yield put({
					type: 'updateState',
					payload: {},
				});
			}
		},
		* updateTemplateConfig({ payload = {} }, {put, call}) {
			const response = yield call(Actions.updateTemplateConfig, payload);
			if (response && response.code === ERROR_OK) {
				yield put({
					type: 'updateState',
					payload: {},
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
	},
};
