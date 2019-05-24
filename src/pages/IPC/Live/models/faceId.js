
// import { listen } from '@/services/mqtt';
import moment from 'moment';

export default {
	namespace: 'faceid',
	state: {
		rectangles: [],
		list: []
	},
	reducers: {
		drawRects({ rectangles, list }, { payload: { rects, sn, timestamp, reportTime } }) {
			// const newState = [];
			// console.log('drawRects');
			// rects.forEach((rect) => {

			// });
			// newState.push({
			// 	rects,
			// 	sn,
			// 	timestamp
			// });

			// console.log('rectangles: ', rectangles);

			// return {
			// 	rectangles: [
			// 		...rectangles,
			// 		...newState
			// 	]
			// };
			const rect = rectangles.filter((item) => 
				// console.log(item.timestamp, moment().subtract(2, 'minutes').unix());
				 item.timestamp > moment().subtract(2, 'minutes').unix()
			);


			// rectangles.push({
			// 	rects,
			// 	sn,
			// 	timestamp,
			// 	reportTime
			// });

			return {
				rectangles: [
					...rect,
					{
						rects,
						sn,
						timestamp,
						reportTime
					}
				],
				list
			};
		},
		clearRects() {
			return {
				rectangles: []
			};
		},
		updateList( { list }, { payload }) {
			list.push(payload);
		}

	},
	// effects: {
	// 	*subscribe({ payload: { device }}, { select, call }) {
	// 		const { userId, clientId } = yield select((state) => {
	// 			return {
	// 				userId: state.user.id,
	// 				clientId: state.mqtt.clientId
	// 			};
	// 		});

	// 		const topic = `/WEB/${ userId }/${clientId}/${device.type}/event/sub`;
	// 		yield call(subscribe, topic);
	// 	}
	// },
	subscriptions: {
		mqtt ({ dispatch }) {
			const listeners = [
				{
					opcode: '0x4100',
					models: 'FS1',
					type: 'event',
					handler: (topic, message) => {
						const { data } = message;
						// console.log(data);
						// console.log(message);
						dispatch({
							type: 'drawRects',
							payload: {
								rects: data.rect,
								timestamp: data.pts,
								reportTime: data.report_time,
								sn: data.sn
							}
						});
					}
				}, {
					opcode: '0x4101',
					models: 'FS1',
					type: 'event',
					handler: (topic, message) => {
						const { data } = message;
						// console.log(message, data);

						dispatch({
							type: 'updateList',
							payload: {
								timestamp: data.pts,
								name: data.name,
								id: data.id,
								libraryId: data.db_id,
								libraryName: data.db_name,
								age: data.age,
								gender: data.gender,
								pic: data.pic
							}
						});
					}
				}
			];

			dispatch({
				type: 'mqttIpc/addListener',
				payload: listeners
			});
		}
	}
};