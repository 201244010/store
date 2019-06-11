import { getMemberStatus } from '../../services/member';
import { ERROR_OK } from '@/constants/errorCode';

export default {
	namespace: 'cloudService',
	state: {
		isMember: true
	},
	reducers: {
		updateMember (state, { payload: { isMember }}) {
			state.isMember = isMember;
		}
	},
	effects: {
		*read(action, { put, call }) {
			const response = yield call(getMemberStatus);

			if (response.code === ERROR_OK) {
				yield put({
					type:'updateMember',
					payload: {
						isMember: true
					}
				});
			}else {
				yield put({
					type:'updateMember',
					payload: {
						isMember: false
					}
				});
			}


		},
		// *update(action, { put, select }) {

		// }
	}
};