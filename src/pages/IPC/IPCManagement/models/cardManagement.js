import { ERROR_OK } from '@/constants/errorCode';
import { MESSAGE_TYPE } from '@/constants';

const OPCODE = {
	SDGET: '0x3102',
	SDFORMAT: '0x3058',
	SDREMOVE: '0x3103'
};

export default {
	namespace: 'cardManagement',
	state: {
		sn: '',
		isLoading: true,
		hasCard: false,

		used: 0, // 已用存储空间MB
		total: 0, // 总存储空间MB
		available_time: 0, // 可用时长h
		sd_status_code: null, // sd卡状态码

		removeStatus: 'normal', // normal初始值 pending格式化进行中 success格式化成功 fail格式化失败
		formatStatus: 'normal' // normal初始值 pending格式化进行中 success格式化成功 fail格式化失败
	},

	reducers: {
		/**
		 * 设置sn
		 * */
		updateSn(state, { payload }) {
			const { sn } = payload;
			return {
				...state,
				sn
			};
		},
		/**
		 * 更新状态
		 * */
		updateState(state, { payload }) {
			const { sn, ...data} = payload;
			if (sn === state.sn) {
				return {
					...state,
					...data,
				};
			}
			return {
				...state
			};
		},
		/**
		 * 重置状态
		 * */
		resetState() {
			console.log('resetState');
			return {
				sn: '',
				isLoading: true,
				hasCard: false,

				used: 0,
				total: 0,
				available_time: 0,
				sd_status_code: null,

				removeStatus: 'normal',
				formatStatus: 'normal'
			};
		},
	},

	effects: {
		/**
		 * 获取卡信息
		 * */
		*readCardInfo({ payload }, { put }) {
			console.log('payload=', payload);
			const { sn } = payload;

			yield put({
				type: 'updateSn',
				payload: {
					sn
				}
			});

			yield put({
				type: 'updateState',
				payload: {
					sn,
					isLoading: true
				}
			});

			// 获取摄像机型号
			const type = yield put.resolve({
				type:'ipcList/getDeviceType',
				payload:{
					sn
				}
			});

			// 获取topic
			const topicPublish = yield put.resolve({
				type:'mqttIpc/generateTopic',
				payload:{
					deviceType: type,
					messageType: 'request',
					method: 'pub'
				}
			});

			yield put({
				type:'mqttIpc/publish',
				payload:{
					topic: topicPublish,
					message: {
						opcode: OPCODE.SDGET,
						param: {
							sn
						}
					}
				}
			});
		},

		/**
		 * 移除卡
		 * */
		*requestRemoveCard({ payload }, { put }) {
			console.log('payload=', payload);
			const { sn } = payload;

			// 获取摄像机型号
			const type = yield put.resolve({
				type:'ipcList/getDeviceType',
				payload:{
					sn
				}
			});
			console.log('cardManagement type=', type);

			// 获取topic
			const topicPublish = yield put.resolve({
				type:'mqttIpc/generateTopic',
				payload:{
					deviceType: type,
					messageType: 'request',
					method: 'pub'
				}
			});

			yield put({
				type:'mqttIpc/publish',
				payload:{
					topic: topicPublish,
					message: {
						opcode: OPCODE.SDREMOVE,
						param: {
							sn
						}
					}
				}
			});
		},

		/**
		 * 格式化卡
		 * */
		*requestFormatCard({ payload }, { put }) {
			console.log('payload=', payload);
			const { sn } = payload;

			// 获取摄像机型号
			const type = yield put.resolve({
				type:'ipcList/getDeviceType',
				payload:{
					sn
				}
			});
			console.log('requestFormatCard type=', type);

			// 获取接口地址
			const topicPublish = yield put.resolve({
				type:'mqttIpc/generateTopic',
				payload:{
					deviceType: type,
					messageType: 'request',
					method: 'pub'
				}
			});

			yield put({
				type:'mqttIpc/publish',
				payload:{
					topic: topicPublish,
					message: {
						opcode: OPCODE.SDFORMAT,
						param: {
							sn
						}
					}
				}
			});
		}
	},

	subscriptions: {
		setup({ dispatch }) {
			const listeners = [
				// 获取sd卡信息
				{
					opcode: OPCODE.SDGET,
					type: MESSAGE_TYPE.RESPONSE,
					handler: (topic, messages) => {
						const msg = JSON.parse(JSON.stringify(messages));

						console.log('CardInfo msg=', msg);

						const { sd_status_code, sn } = msg.data;
						// sd_status_code 1，卡读不到信息，但可被操作；2，卡能读到信息，能被操作；其他num，卡读不到信息，不能被操作；
						if (msg.errcode === ERROR_OK && sd_status_code === 2) {
							const {
								used,
								total,
								available_time
							} = msg.data;

							const payloadData = {};
							if (used !== undefined) {
								payloadData.used = used;
							}
							if (total !== undefined) {
								payloadData.total = total;
							}
							if (available_time !== undefined) {
								payloadData.available_time = available_time;
							}

							dispatch({
								type: 'updateState',
								payload: {
									sn,
									hasCard: true,
									isLoading: false,
									sd_status_code,
									...payloadData
								}
							});
						} else if (msg.errcode === ERROR_OK && sd_status_code === 1) {
							dispatch({
								type: 'updateState',
								payload: {
									sn,
									hasCard: true,
									isLoading: false,
									sd_status_code
								}
							});
						} else {
							dispatch({
								type: 'updateState',
								payload: {
									sn,
									hasCard: false,
									isLoading: false,
									sd_status_code
								}
							});
						}
					}
				},
				// 移除sd卡
				{
					opcode: OPCODE.SDREMOVE,
					type: MESSAGE_TYPE.RESPONSE,
					handler: (topic, messages) => {
						const msg = JSON.parse(JSON.stringify(messages));
						const { sn, sd_status_code } = msg.data;
						console.log('SDREMOVE messages=', messages);
						if (msg.errcode === ERROR_OK) {

							dispatch({
								type: 'updateState',
								payload: {
									sn,
									hasCard: false,
									sd_status_code,
									removeStatus: 'success'
								}
							});

						} else {

							dispatch({
								type: 'updateState',
								payload: {
									sn,
									removeStatus: 'fail'
								}
							});
						};

						setTimeout(() => {
							dispatch({
								type: 'updateState',
								payload: {
									sn,
									removeStatus: 'normal'
								}
							});
						}, 800);
					}
				},
				// 格式化sd卡
				{
					opcode: OPCODE.SDFORMAT,
					type: MESSAGE_TYPE.RESPONSE,
					handler: (topic, messages) => {
						const msg = JSON.parse(JSON.stringify(messages));
						const { sn } = msg.data;
						console.log('setFormat msg=', msg);
						if (msg.errcode === ERROR_OK) {

							dispatch({
								type: 'updateState',
								payload: {
									sn,
									formatStatus: 'success'
								}
							});

							dispatch({
								type: 'readCardInfo',
								payload: {
									sn
								}
							});
						} else {

							dispatch({
								type: 'updateState',
								payload: {
									sn,
									formatStatus: 'fail'
								}
							});
						};

						setTimeout(() => {
							dispatch({
								type: 'updateState',
								payload: {
									sn,
									formatStatus: 'normal'
								}
							});
						}, 800);
					}
				},
			];
			dispatch({
				type: 'mqttIpc/addListener',
				payload: listeners
			});
		}
	}
};