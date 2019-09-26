import { getLatestAgreement, acceptAgreement } from '../services/agreementModal';
import { ERROR_OK } from '@/constants/errorCode';

export default {
	namespace: 'agreementModal',
	state: {
		agreementInfo: {}
	},
	reducers: {
		readData(state, { payload }) {
			return {
				...state,
				...payload
			};
		},
	},
	effects: {
		*getLatestAgreement({ payload }, { put }) {
			const { type, lang } = payload;
			const response = yield getLatestAgreement({
				type,
				lang
			});

			const { code, data } = response;
			
			if(code === ERROR_OK) {
				yield put({
					type: 'readData',
					payload: {
						agreementInfo: data
					}
				});
			}
		},
		*acceptAgreement({ payload }){
			const { agreementId } = payload;
			const response = yield acceptAgreement({
				agreementId
			});
	
			return response;
		}
	},
};