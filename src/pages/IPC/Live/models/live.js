import { getLiveUrl, stopLive } from '@/services/live';
import { ERROR_OK } from '@/constants/errorCode';

const PPIS = {
	'1080': 0,
	'720': 1
};

const OPCODE = {
	CHANGE_PPI: '0x3125'
};

export default {
	namespace: 'live',
	state: {
		streamId: '',
		url: '',
		ppi: '',
		ppiChanged: false
	},
	reducers: {
		updateUrl(state, { payload: { url, streamId, ppi }}) {
			// console.log(_);
			// state.temp.map(item => {
			// 	console.log('item', item);
			// });

			return {
				url,
				streamId,
				ppi
			};
		},
		updatePPI(state, { payload: { ppi }}) {
			// console.log(state);
			state.ppi = ppi;
			// return {
			// 	...state,
			// 	ppi
			// };
		},
		ppiChanged(state, { payload: { streamId, isChanged }}) {
			if (state.streamId === streamId) {
				state.ppiChanged = isChanged;
			}
		}
	},
	effects: {
		*startLive({ payload: { sn }}, { call, put }) {
			const companyId = yield put.resolve({
				type: 'global/getCompanyIdFromStorage'
			});

			const shopId = yield put.resolve({
				type: 'global/getShopIdFromStorage'
			});

			const clientId = yield put.resolve({
				type: 'mqttIpc/getClientId'
			});

			const response = yield call(getLiveUrl, {
				companyId,
				shopId,
				clientId,
				sn
			});

			if (response.code === ERROR_OK){
				const { data: { url, streamId, resolution } } = response;
				let ppi = '';
				// for (let index in PPIS){
				// 	if (PPIS.hasOwnProperty(index)){
				// 		if (resolution === PPIS[index]){
				// 			ppi = index;
				// 		};
				// 	}
				// }
				const list = Object.keys(PPIS);
				list.forEach(index => {
					if (resolution === PPIS[index]){
						ppi = index;
					};
				});

				yield put({
					type: 'updateUrl',
					payload: {
						url,
						streamId,
						ppi
					}
				});
			};
		},

		*stopLive({ payload: { sn, streamId }}, { call }) {
			// const c = yield select((state) => {
			// 	return state.live.streamId;
			// });

			// console.log('check: ', c, streamId);

			yield call(stopLive, {
				streamId,
				sn
			});
		},

		*changePPI({ payload: { ppi, sn } }, { put, select }) {

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

			const streamId = yield select((state) => state.live.streamId);

			yield put({
				type: 'mqttIpc/publish',
				payload: {
					topic,
					message: {
						opcode: OPCODE.CHANGE_PPI, // '0x3125',
						param: {
							stream_id: streamId,
							sn,
							resolution: PPIS[ppi]
						}
					}
				}
			});

			yield put({
				type: 'updatePPI',
				payload: {
					ppi
				}
			});
		}
	},
	subscriptions: {
		setup ({ dispatch }) {
			const listeners = [
				{
					opcode: OPCODE.CHANGE_PPI,
					models: ['FS1', 'SS1'],
					type: 'response',
					handler: (topic, message) => {
						const { data } = message;

						dispatch({
							type: 'ppiChanged',
							payload: {
								streamId: data.stream_id,
								isChanged: true
							}
						});

						setTimeout(() => {
							dispatch({
								type: 'ppiChanged',
								payload: {
									streamId: data.stream_id,
									isChanged: false
								}
							});
						}, 3*1000);
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