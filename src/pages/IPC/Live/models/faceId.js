
// import { listen } from '@/services/mqtt';
// import moment from 'moment';

import { formatMessage } from 'umi/locale';

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
		clearRects(state, { payload: { timestamp }}) {
			const rectangles = [];
			state.rectangles.forEach(item => {
				if (item.timestamp > timestamp - 2000) {
					rectangles.push(item);
				}
			});

			state.rectangles = [
				...rectangles
			];

		},
		updateList( { list }, { payload }) {
			const { libraryName } = payload;
			let libraryNameText = libraryName;
			switch(libraryName) {
				case 'stranger':
					libraryNameText = formatMessage({ id: 'faceid.stranger'});
					break;
				case 'regular':
					libraryNameText = formatMessage({id: 'faceid.regular'});
					break;
				case 'employee':
					libraryNameText = formatMessage({ id: 'faceid.employee'});
					break;
				case 'blacklist':
					libraryNameText = formatMessage( { id: 'faceid.blacklist'});
					break;
				default:
			}
			list.push({
				...payload,
				libraryName: libraryNameText
			});
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

						dispatch({
							type: 'updateList',
							payload: {
								timestamp: data.report_time,
								name: data.name === 'undefined' ? '--' : data.name,
								id: data.id,
								libraryId: data.db_id,
								libraryName: data.db_name,
								age: data.age ,
								gender: data.gender === 'undefined' ? '--' : data.gender,
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