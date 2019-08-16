import { MESSAGE_TYPE } from '@/constants';
// import { message } from 'antd';
import { ERROR_OK } from '@/constants/errorCode';


const getOperationCode = '0x3120';
const setOperationCode = '0x3121';

const dataSerializer = (item) => {
	// console.log('item: ', item);
	const object = {};
	switch (item.audio_level) {
		case 0:
		{
			object.isSound = false;
			object.sSensitivity = 50;
			break;
		}
		case 1: {
			object.isSound = true;
			object.sSensitivity = 0;
			break;
		}
		case 2: {
			object.isSound = true;
			object.sSensitivity = 50;
			break;
		}
		case 3: {
			object.isSound = true;
			object.sSensitivity = 100;
			break;
		}
		default: break;
	}


	switch (item.motion_level) {
		case 0:
		{
			object.isDynamic = false;
			object.mSensitivity = 50;
			break;
		}
		case 1: {
			object.isDynamic = true;
			object.mSensitivity = 0;
			break;
		}
		case 2: {
			object.isDynamic = true;
			object.mSensitivity = 50;
			break;
		}
		case 3: {
			object.isDynamic = true;
			object.mSensitivity = 100;
			break;
		}
		default: break;
	}

	const arr = item.weekday.toString(2).split('').reverse();
	// console.log(arr);
	// console.log(object);

	const days = [];
	for (let i = 0; i < arr.length; i++) {
		if (arr[i] === '1'){
			days.push((i + 1).toString());
		};
	}

	// console.log(days);
	if (days.length === 1 && days[0] === '8') {
		// 7*24小时
		object.isAuto = 1;
		for (let index = 0; index < 7; index++) {
			days[index] = (index+1).toString();
		}

		object.all = true;
	} else {
		object.isAuto = 2;

		if (days.length === 7) {
			object.all = true;
		} else {
			object.all = false;
		}
	}
	object.days = days;
	object.startTime = item.start_time;
	object.endTime = item.stop_time;
	object.sn = item.sn;

	return object;
};

const paramSerializer = (item) => {
	const object = {};
	if (item.isSound === false) {
		object.audio_level = 0;
	} else {
		switch (item.sSensitivity) {
			case 0:
			default:
				object.audio_level = 1;
				break;
			case 50:
				object.audio_level = 2;
				break;
			case 100:
				object.audio_level = 3;
				break;
		}
	}

	if (item.isDynamic === false) {
		object.motion_level = 0;
	} else {
		switch (item.mSensitivity) {
			case 0:
			default:
				object.motion_level = 1;
				break;
			case 50: object.motion_level = 2;
				break;
			case 100: object.motion_level = 3;
				break;
		}
	}

	// console.log(item.days);
	let arr = ['0', '0', '0', '0', '0', '0', '0', '0'];
	if (item.isAuto === 1) {
		arr[7] = '1';
	} else if (item.isAuto === 2) {
		// object.start_time = item.startTime.unix() - moment().startOf('day').unix();
		// object.end_time = item.endTime.unix() - moment().startOf('day').unix();
		item.days.forEach((index) => {
			arr[index - 1] = '1';
		});
	};

	arr = arr.reverse();
	object.weekday = parseInt(arr.join(''), 2);

	// console.log(arr);
	object.start_time = item.startTime;
	object.stop_time = item.endTime;

	// console.log(object.weekday);
	object.sn = item.sn;

	// console.log('object: ', object);
	return object;
};

// var temp = {};
export default {
	namespace: 'activeDetection',
	state: {
		startTime: 0,
		endTime: 0,
		days: ['1', '2', '3', '4', '5', '6', '7'],
		all: true,
		isAuto:1,
		isSound:true,
		isDynamic:true,
		sSensitivity:50,
		mSensitivity:50,
		sn: '',
		isReading: true,
		isSaving: 'normal'
	},
	reducers: {
		init( state, { payload: { sn }} ) {
			state.sn = sn;
		},
		readData(state, { payload }) {
			// console.log(state.sn, payload.sn);
			if (state.sn === payload.sn) {
				return {
					...state,
					// readFlag: false,
					// updateFlag: false,
					...payload,
				};
			}
			return state;
		},
		// updateData(state, { payload }) {
		// 	if (state.sn === payload.sn) {
		// 		return {
		// 			...state,
		// 			updateFlag: true,
		// 			readFlag: false,
		// 			...payload,
		// 		};
		// 	}
		// 	return state;
		// },
		// updateData2(state, { payload }) {
		// 	if (state.sn === payload.sn) {
		// 		return {
		// 			...state,
		// 			updateFlag: false
		// 		};
		// 	}
		// 	return state;
		// },

		setReadingStatus(state, { payload: { sn, status }}) {
			// console.log(sn, state.sn);
			// state.isReading = status;
			if(state.sn === sn){
				state.isReading = status;
			}

		},

		setSavingStatus(state, { payload: { sn, status }}) {
			if(state.sn === sn){
				state.isSaving = status;
			}
		}

		// updateReadingFlag (state, { payload: { flag }} ) {
		// 	state.readFlag = flag;
		// }
	},
	effects: {
		*read({ payload: { sn } }, { put }) {
			const type = yield put.resolve({
				type:'ipcList/getDeviceType',
				payload:{
					sn
				}
			});
			// console.log(item);
			const topicPublish = yield put.resolve({
				type:'mqttIpc/generateTopic',
				payload:{
					deviceType: type,
					messageType: 'request',
					method: 'pub'
				}
			});
			// console.log(topicPublish);
			yield put({
				type:'mqttIpc/publish',
				payload:{
					topic: topicPublish,
					message: {
						opcode: getOperationCode,
						param: {
							sn
						}
					}
				}
			});

			yield put({
				type: 'init',
				payload: {
					sn
				}
			});

			yield put({
				type: 'setReadingStatus',
				payload: {
					sn,
					status: true
				}
			});
		},
		*update({ payload }, { put }) {
			const { sn } = payload;

			const type = yield put.resolve({
				type:'ipcList/getDeviceType',
				payload:{
					sn
				}
			});
			const topicPublish = yield put.resolve({
				type:'mqttIpc/generateTopic',
				payload:{
					deviceType: type,
					messageType: 'request',
					method: 'pub'
				}
			});

			// console.log(paramSerializer(payload));
			yield put({
				type:'mqttIpc/publish',
				payload:{
					topic: topicPublish,
					message: {
						opcode: setOperationCode,
						param: paramSerializer(payload)
					}
				}
			});
			yield put({
				type:'readData',
				payload
			});
			yield put({
				type: 'setSavingStatus',
				payload: {
					sn,
					status: 'saving'
				}
			});
		},

	},
	subscriptions: {
		setup({ dispatch }) {
			const listeners = [
				{
					opcode: getOperationCode,
					type: MESSAGE_TYPE.RESPONSE,
					handler: (topic, messages) => {
						const msg = JSON.parse(JSON.stringify(messages));
						if (msg.errcode === ERROR_OK) {
							const { sn } = msg.data;
							dispatch({
								type: 'readData',
								payload: dataSerializer(msg.data)
							});
							dispatch({
								type: 'setReadingStatus',
								payload: {
									sn,
									status: false
								}
							});

						} else {

							// message.destroy();
							// message.error('当前设备获取设置失败,请检查网络');
						}
					}
				}, {
					opcode: setOperationCode,
					type: MESSAGE_TYPE.RESPONSE,
					handler: (topic, msg) => {
						const { sn } = msg.data;
						if (msg.errcode === ERROR_OK){
							// message.destroy();

							dispatch({
								type: 'setSavingStatus',
								payload: {
									sn,
									status: 'success'
								}
							});
							// message.success('修改成功');
						}else {
							// console.log(msg);
							// const { sn } = msg.data;
							dispatch({
								type: 'setSavingStatus',
								payload: {
									sn,
									status: 'failed'
								}
							});
						};
						setTimeout(() => {
							dispatch({
								type: 'setSavingStatus',
								payload: {
									sn,
									status: 'normal'
								}
							});
						}, 800);
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