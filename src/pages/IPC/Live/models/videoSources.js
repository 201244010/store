import { readVideoSources } from '@/services/videoSources';
import { ERROR_OK } from '@/constants/errorCode';
// import moment from 'moment';

export default {
	namespace: 'videoSources',
	state: [],
	reducers:{
		readData(state, { payload }) {
			return [
				...new Set([
					...state,
					...payload
				])
			];
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
				const list = data.video_list.map((item) => {
					const d = {
						timeEnd: item.end_time,
						timeStart: item.start_time,
						url: item.url,
						deviceId: item.device_id
						// device_id: 2237, start_time: 1558511993, end_time: 1558512001
					};
					return d;
				});

				yield put({
					type: 'readData',
					payload: list
				});
			}

		}
	}
};