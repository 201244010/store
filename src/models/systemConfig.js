import { message } from 'antd';
import * as Actions from '@/services/ESL/systemConfig';
import {ERROR_OK} from '@/constants/errorCode';
import { formatMessage } from 'umi/locale';

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
				message.success(formatMessage({ id: 'esl.device.display.update.config.success' }));
				yield put({
					type: 'updateState',
					payload: {},
				});
			} else {
				message.error(formatMessage({ id: 'esl.device.display.update.config.fail' }));
				yield put({
					type: 'updateState',
					payload: {},
				});
			}
		},
		* updateTemplateConfig({ payload = {} }, {put, call}) {
			yield put({
				type: 'updateState',
				payload: { loading: true },
			});
			const response = yield call(Actions.updateTemplateConfig, payload);
			if (response && response.code === ERROR_OK) {
				message.success(formatMessage({ id: 'esl.device.display.update.config.success' }));
				yield put({
					type: 'updateState',
					payload: { loading: false },
				});
			} else {
				message.error(formatMessage({ id: 'esl.device.display.update.config.fail' }));
				yield put({
					type: 'updateState',
					payload: { loading: false },
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
