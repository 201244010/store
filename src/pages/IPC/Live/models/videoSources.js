import { readVideoSources } from '@/services/videoSources';
import { ERROR_OK } from '@/constants/errorCode';
// import moment from 'moment';

export default {
	namespace: 'videoSources',
	state: [],
	reducers:{
		readData(_, { payload }) {
			return payload;
		}
	},
	effects: {
		*read ({ payload: { timeStart, timeEnd, sn } }, { select, call, put }) {

			// const timeEnd = moment.unix(timeStart).subtract(3, 'days').format('X');
			const { userId } = select((state) => state.userId);

			// const deviceId = 0;	//从sn换去deviceId；
			const deviceId = yield put.resolve({
				type:'ipcList/getDeviceId',
				payload: {
					sn
				}
			});
			const response = yield call(readVideoSources, {
				userId,
				timeStart,
				timeEnd,
				deviceId
			});

			if (response.code === ERROR_OK){
				const { data } = response;
				yield put({
					type: 'readData',
					payload: data.video_list
				});
			}

		}
	}
};