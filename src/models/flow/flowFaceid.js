import { formatMessage } from 'umi/locale';
import { getRange, readLibrary } from '@/pages/Flow/IPC/services/photoLibrary';
import { ERROR_OK } from '@/constants/errorCode';

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
		drawRects({ rectangles, list, ageRangeList, deviceSn, libraryList }, { payload: { rects, sn, timestamp, /* reportTime */ } }) {

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
				list,
				ageRangeList,
				deviceSn,
				libraryList,
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
		// *subscribe({ payload: { device }}, { select, call }) {
		// 	const { userId, clientId } = yield select((state) => {
		// 		return {
		// 			userId: state.user.id,
		// 			clientId: state.mqtt.clientId
		// 		};
		// 	});

		// 	const topic = `/WEB/${ userId }/${clientId}/${device.type}/event/sub`;
		// 	yield call(subscribe, topic);
		// }
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
		// *test(_, { put }) {
		// 	console.log('in test');
		// 	yield put({
		// 		// type: 'updateList',
		// 		type:'mapFaceInfo',
		// 		payload: {
		// 			age: 0,
		// 			ageRangeCode: 4,
		// 			timestamp: 15652373226,
		// 			libraryId: 3497,
		// 			libraryName: 'stranger',
		// 			gender: 1,
		// 			id: 2751,
		// 			name: 'undefined'
		// 		}
	// 		});
	// 	}
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
		}
	}
};