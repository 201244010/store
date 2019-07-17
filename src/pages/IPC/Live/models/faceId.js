
// import { listen } from '@/services/mqtt';
// import moment from 'moment';

export default {
	namespace: 'faceid',
	state: {
		rectangles: [],
		list: []
	},
	reducers: {
		drawRects({ rectangles, list }, { payload: { rects, sn, timestamp, /* reportTime */ } }) {

			// todo 需要添加信息清除逻辑
			const rect = rectangles;

			return {
				rectangles: [
					...rect,
					{
						rects,
						sn,
						timestamp,
						// reportTime
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
					type: 'event',
					handler: (topic, message) => {
						const { data } = message;

						const { rect, pts } = data;

						const rects = rect.map(item => ({
							id: item.face_id,
							left: item.left,
							top: item.top,
							right: item.right,
							bottom: item.bottom,
							timestamp: pts
						}));

						dispatch({
							type: 'drawRects',
							payload: {
								rects,
								timestamp: pts,
								// reportTime: data.report_time,
								sn: data.sn
							}
						});
					}
				}, {
					opcode: '0x4101',
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