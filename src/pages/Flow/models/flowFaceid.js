import { formatMessage } from 'umi/locale';
import { getRange, readLibrary } from '@/pages/Flow/IPC/services/photoLibrary';
import { ERROR_OK } from '@/constants/errorCode';
import { getLocationParam } from '@/utils/utils';

const OPCODE = {
	FACE_ID_STATUS: '0x4202',
	FACE_COMPARE_STATUS: '0x4203'
};

export default {
	namespace: 'flowFaceid',
	state: {
		rectangles: [],
		list: [],
		ageRangeList: [],
		deviceSn: '',
		libraryList: [],
	},
	reducers: {
		drawRects(state, { payload: { rects, sn } }) {
			const { deviceSn, rectangles } = state;
			// console.log('rrrrrrrrrrrrrrrrrrrr',rects, rectangles);
			if (deviceSn === sn) {
				state.rectangles = [
					...rectangles,
					...rects
				];
			}

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
			console.log('payload',payload);
			list.unshift({
				...payload,
			});
		},
		readAgeRangeList(state, { payload }) {
			console.log('list payload', payload.ageRangeList);

			state.ageRangeList =  payload.ageRangeList;
		},
		setDeviceSn(state, { payload }) {
			const { sn } = payload;
			state.deviceSn = sn;
		},
		clearList(state, { payload }) {
			const { sn } = payload;
			console.log('sn', sn, state.deviceSn);

			if(state.deviceSn !== sn) {
				state.list = [];
			}
		},
		readData(state, action) {
			const { libraryList } = action;
			return {...state, ...{libraryList}};
		},

	},
	effects: {
		*getAgeRangeList(_,{ put, call }) {
			const response = yield call(getRange);
			const { code, data: { ageRangeList }} = response;
			if(code === ERROR_OK) {
				yield put({
					type: 'readAgeRangeList',
					payload: {
						ageRangeList
					}
				});
			}
		},
		*mapFaceInfo({ payload }, { select, take, put }) {
			const { libraryName, name } = payload;
			let rangeList = yield select((state) => state.flowFaceid.ageRangeList);
			// const ageName = formatMessage({id: 'flow.unknown'});
			let libraryNameText = libraryName;

			switch(libraryName) {
				case 'stranger':
					libraryNameText = formatMessage({ id: 'flow.faceid.stranger'});
					break;
				case 'regular':
					libraryNameText = formatMessage({id: 'flow.faceid.regular'});
					break;
				case 'employee':
					libraryNameText = formatMessage({ id: 'flow.faceid.employee'});
					break;
				case 'blacklist':
					libraryNameText = formatMessage({ id: 'flow.faceid.blacklist'});
					break;
				default:
			}

			if(!rangeList || rangeList.length === 0){
				const { payload: list } = yield take('flowReadAgeRangeList');
				rangeList = list.ageRangeList;
			}
			// if(age) {
			// 	ageName = age;
			// } else if(rangeList) {
			// 	rangeList.forEach(item => {
			// 		if(item.ageRangeCode === ageRangeCode) {
			// 			ageName = item.ageRange;
			// 		}
			// 	});
			// }
			 yield put({
				 type: 'updateList',
				 payload: {
					...payload,
					 libraryName: libraryNameText,
					//  age: ageName,
					 name: name === 'undefined' ? formatMessage({id: 'flow.unknown'}) : name
				 }
			});
		},
		*readLibraryType(_, { put }) {
			const response = yield readLibrary({
				// userId,
				// companyId,
				// shopId,
			});
			const { data: libraryList, code} = response;
			if (code === ERROR_OK) {
				yield put({
					type: 'readData',
					libraryList,
				});
			}
			return response.code;
		},

		*changeFaceidPushStatus ({ payload: { sn, status }}, { put }) {
			// 直播页人脸加框开关
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
			console.log('faceid', topic);

			yield put({
				type: 'mqttIpc/publish',
				payload: {
					topic,
					message: {
						opcode: OPCODE.FACE_ID_STATUS,
						param: {
							sn,
							action: status === true ? 1: 0
						}
					}
				}
			});
		},
		*changeFaceComparePushStatus ({ payload: { sn, status }}, { put }) {
			// 直播页右侧人脸加框开关
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
			console.log('compare', topic);

			yield put({
				type: 'mqttIpc/publish',
				payload: {
					topic,
					message: {
						opcode: OPCODE.FACE_COMPARE_STATUS,
						param: {
							sn,
							action: status === true ? 1: 0
						}
					}
				}
			});
		},
	},
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
						console.log('data',data);
						dispatch({
							// type: 'updateList',
							type:'mapFaceInfo',
							payload: {
								// timestamp: data.report_time,
								timestamp: data.arrival_time,
								name: data.name,
								id: data.id,
								libraryId: data.db_id,
								libraryName: data.db_name,
								age: data.age,
								ageRangeCode: data.age_range_code,
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
		},

		// mqtt重连时，再次开启人脸框和进店
		mqttReconnect ({ dispatch }) {
			console.log('flowFaceId.js 注册订阅');
			dispatch({
				type: 'mqttIpc/registerReconnectHandler',
				payload: {
					handler: () => {
						console.log('ReconnectHandler faceId.js');
						if (window.location.pathname === '/flow') {
							console.log('当前是在直播页面flow');

							const sn = getLocationParam('sn');

							// 开启直播人脸框
							dispatch({
								type:'changeFaceidPushStatus',
								payload: {
									sn,
									status: true
								}
							});

							// 开启右侧进店
							dispatch({
								type:'changeFaceComparePushStatus',
								payload: {
									sn,
									status: true
								}
							});
						}
					}
				}
			});
		}
	}
};