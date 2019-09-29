import { getLiveUrl, /* stopLive, */ getTimeSlots, startPublish, stopPublish } from '../../services/live';
import { ERROR_OK } from '@/constants/errorCode';

const PPIS = {
	'1080': 0,
	'720': 1
};

const OPCODE = {
	// CHANGE_PPI: '0x3125'
	REQUEST_METADATA: '0x3145'
};

export default {
	namespace: 'live',
	state: {
		streamId: '',
		ppi: '1080',
		ppiChanged: false,
		timeSlots: []
	},
	reducers: {
		// update(state, { payload: { streamId, ppi }}) {
		// 	return {
		// 		...state,
		// 		streamId,
		// 		ppi
		// 	};
		// },
		updateStreamId(state, { payload: { streamId }}) {
			state.streamId = streamId;
		},
		updatePPI(state, { payload: { ppi }}) {
			state.ppi = ppi;
		},
		// ppiChanged(state) {
		// 	state.ppiChanged = true;
		// },
		updateTimeSlots(state, { payload: { timeSlots } }) {
			state.timeSlots = timeSlots;
		}
	},
	effects: {
		*getLiveUrl({ payload: { sn }}, { select, call, put }) {
			const clientId = yield put.resolve({
				type: 'mqttIpc/getClientId'
			});

			const deviceId = yield put.resolve({
				type: 'ipcList/getDeviceId',
				payload: {
					sn
				}
			});

			const resolution = yield select(state => {
				const { ppi } = state.live;
				return PPIS[ppi];
			});

			const response = yield call(getLiveUrl, {
				clientId,
				deviceId,
				resolution
			});

			if (response.code === ERROR_OK){
				const { data: { url, streamId } } = response;

				yield put({
					type: 'updateStreamId',
					payload: {
						streamId
					}
				});

				return url;
			}
			return '';
		},
		// *getLiveUrl({ payload: { sn }}, { call, put }) {

		// 	const clientId = yield put.resolve({
		// 		type: 'mqttIpc/getClientId'
		// 	});

		// 	const response = yield call(getLiveUrl, {
		// 		clientId,
		// 		sn
		// 	});

		// 	if (response.code === ERROR_OK){
		// 		const { data: { url, streamId, resolution } } = response;
		// 		let ppi = '';

		// 		const list = Object.keys(PPIS);
		// 		list.forEach(index => {
		// 			if (resolution === PPIS[index]){
		// 				ppi = index;
		// 			};
		// 		});

		// 		yield put({
		// 			type: 'update',
		// 			payload: {
		// 				streamId,
		// 				ppi
		// 			}
		// 		});

		// 		return url;
		// 	};
		// 	return '';
		// },

		// *stopLive({ payload: { sn, /* streamId */ }}, { call }) {
		// 	// yield call(stopLive, {
		// 	// 	streamId,
		// 	// 	sn
		// 	// });
		// },
		*changePPI({ payload: { ppi, sn } }, { put }) {
			yield put.resolve({
				type: 'updatePPI',
				payload: {
					ppi
				}
			});

			const url = yield put.resolve({
				type: 'getLiveUrl',
				payload: {
					sn
				}
			});

			return url;
		},

		// *changePPI({ payload: { ppi, sn } }, { put, select }) {

		// 	const deviceType = yield put.resolve({
		// 		type: 'ipcList/getDeviceType',
		// 		payload: {
		// 			sn
		// 		}
		// 	});

		// 	const topic = yield put.resolve({
		// 		type: 'mqttIpc/generateTopic',
		// 		payload: {
		// 			deviceType,
		// 			messageType: 'request',
		// 			method: 'pub'
		// 		}
		// 	});

		// 	const streamId = yield select((state) => state.live.streamId);

		// 	yield put({
		// 		type: 'mqttIpc/publish',
		// 		payload: {
		// 			topic,
		// 			message: {
		// 				opcode: OPCODE.CHANGE_PPI, // '0x3125',
		// 				param: {
		// 					stream_id: streamId,
		// 					sn,
		// 					resolution: PPIS[ppi]
		// 				}
		// 			}
		// 		}
		// 	});

		// 	yield put({
		// 		type: 'updatePPI',
		// 		payload: {
		// 			ppi
		// 		}
		// 	});
		// },

		*getTimeSlots({ payload: { sn, timeStart, timeEnd }}, { put, call }) {
			const deviceId = yield put.resolve({
				type: 'ipcList/getDeviceId',
				payload: {
					sn
				}
			});

			const response = yield call(getTimeSlots, {
				deviceId,
				timeStart,
				timeEnd
			});
			// console.log(response);
			if (response.code === ERROR_OK){
				const { data: { timeslots } } = response;

				const slots = timeslots.map(item => {
					const d = {
						timeStart: item.start_time,
						timeEnd: item.end_time
					};
					return d;
				});

				yield put({
					type: 'updateTimeSlots',
					payload: {
						timeSlots: slots
					}
				});
			}
		},

		*getHistoryUrl({ payload: { sn, timestamp }}, { put, call }) {
			// console.log('models: ', getHistoryUrl);
			const deviceId = yield put.resolve({
				type: 'ipcList/getDeviceId',
				payload: {
					sn
				}
			});

			const clientId = yield put.resolve({
				type: 'mqttIpc/getClientId'
			});

			const response = yield call(startPublish, {
				clientId,
				deviceId,
				timeStart: timestamp,
				// timeEnd
			});

			const { code, data } = response;
			if (code === ERROR_OK) {
				return data;
			}
			return '';
		},

		*stopHistoryPlay({ payload: { sn }}, { put, call}) {
			const deviceId = yield put.resolve({
				type: 'ipcList/getDeviceId',
				payload: {
					sn
				}
			});

			const clientId = yield put.resolve({
				type: 'mqttIpc/getClientId'
			});

			const response = yield call(stopPublish, {
				clientId,
				deviceId
			});

			const { code } = response;
			if (code === ERROR_OK) {
				return true;
			}
			return false;
		},
		*requestMetadata({ payload: { sn } }, { put, select }) {
			const deviceType = yield put.resolve({
				type: 'ipcList/getDeviceType',
				payload: {
					sn
				}
			});

			const topic = yield put.resolve({
				type: 'mqttIpc/generateTopic',
				payload: {
					deviceType,
					messageType: 'request',
					method: 'pub'
				}
			});

			const streamId = yield select(state => state.live.streamId);

			yield put({
				type: 'mqttIpc/publish',
				payload: {
					topic,
					message: {
						opcode: OPCODE.REQUEST_METADATA,
						param: {
							sn,
							stream_id: streamId
						}
					}
				}
			});
		},
	},
	// subscriptions: {
	// 	setup ({ dispatch }) {
	// 		const listeners = [
	// 			{
	// 				opcode: OPCODE.CHANGE_PPI,
	// 				type: 'response',
	// 				handler: (topic, message) => {
	// 					const { data } = message;

	// 					dispatch({
	// 						type: 'ppiChanged',
	// 						payload: {
	// 							streamId: data.stream_id,
	// 							isChanged: true
	// 						}
	// 					});

	// 					setTimeout(() => {
	// 						dispatch({
	// 							type: 'ppiChanged',
	// 							payload: {
	// 								streamId: data.stream_id,
	// 								isChanged: false
	// 							}
	// 						});
	// 					}, 3*1000);
	// 				}
	// 			}
	// 		];

	// 		dispatch({
	// 			type: 'mqttIpc/addListener',
	// 			payload: listeners
	// 		});
	// 	}
	// }
};