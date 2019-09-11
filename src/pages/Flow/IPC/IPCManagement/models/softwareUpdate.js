import { detectUpdate } from '../../services/IPCList';
import { MESSAGE_TYPE } from '@/constants';
import { ERROR_OK } from '@/constants/errorCode';


const OPCODE = {
	UPDATE_STATUS: '0x4103',
	UPDATE_SUCCESS: '0x4200',
	START_UPDATE: '0x3140',
};


const STATUS = {
	NORMAL: 'normal',
	DOWNLOAD: 'downloading',
	DOWNLOADFAIL: 'downloadFailed',
	AI: 'aiUpgrading',
	AIFIRMWARE: 'firmwaringAfterAI',
	FIRMWARE: 'firmwaring',
	RESTART: 'restarting',
	SUCCESS: 'success',
	FAIL: 'failed',
	BTNLOAD: 'btnLoading'
};

export default {
	namespace: 'ipcSoftwareUpdate',
	state: {
		needUpdate: false,
		currentVersion: '0.0.0',
		lastCheckTime: 0,
		newVersion: '',
		updating: STATUS.NORMAL,
		newTimeValue:'',
		url: '',
		sn: '',
		OTATime:{
			restartTime: 150000
		}
	},
	reducers: {
		init( state, { payload: { sn }} ) {
			state.sn = sn;
		},
		setCurrentVersion (state, { payload: { sn, version }}) {
			if(state.sn === sn){
				state.currentVersion = version;
			}
		},
		setLastCheckTime (state, { payload: { sn, time }}) {
			if(state.sn === sn){
				state.lastCheckTime = time;
			}
		},
		updateStatus (state, { payload: { needUpdate, version, url, newTimeValue }}) {
			state.needUpdate = needUpdate;
			state.newVersion = version;
			state.url = url;
			state.newTimeValue = newTimeValue;
		},
		setUpdatingStatus (state, { payload: { sn, status }}) {
			if(state.sn === sn){
				state.updating = status;
			}
		},
		setOTATime(state, { payload: { sn, newTime} }){
			if(state.sn === sn){
				Object.keys(newTime).forEach(key => {
					state.OTATime[key] = newTime[key];
				});
			}
		},

	},
	effects: {
		*load ({ payload: { sn }}, { put }) {
			const ipcInfo = yield put.resolve({
				type: 'ipcList/getDeviceInfo',
				payload: {
					sn
				}
			});

			yield put({
				type: 'init',
				payload: {
					sn
				}
			});

			yield put({
				type: 'setCurrentVersion',
				payload: {
					sn,
					version: ipcInfo.binVersion
				}
			});

			yield put({
				type: 'setLastCheckTime',
				payload: {
					sn,
					time: ipcInfo.checkTime
				}
			});

		},
		*detect ({ payload: { sn }}, { put, call }) {
			const deviceId = yield put.resolve({
				type: 'ipcList/getDeviceId',
				payload: {
					sn
				}
			});

			const response = yield call(detectUpdate, {
				deviceId
			});

			// const response = {
			// 	code:1,
			// 	data:{
			// 		version: '1.0.1',
			// 		needUpdate: true,
			// 		url: ''
			// 	}
			// };

			if (response.code === ERROR_OK) {
				const ipcList = yield put.resolve({
					type:'ipcList/read'
				});
				let newTimeValue;
				for(let i=0;i<ipcList.length;i++){
					if(ipcList[i].sn === sn){
						newTimeValue = ipcList[i].checkTime;
						break;
					}
				}
				const { data } = response;
				const { needUpdate, version, url } = data;
				yield put({
					type: 'updateStatus',
					payload: {
						needUpdate,
						version,
						url,
						newTimeValue
					}
				});
				
			}
		},

		*update ({ payload: { sn }}, { put, select }) {

			const {newVersion, url} = yield select(state => state.ipcSoftwareUpdate);

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

			yield put({
				type:'mqttIpc/publish',
				payload:{
					topic: topicPublish,
					message: {
						opcode: OPCODE.START_UPDATE,
						param: {
							sn,
							bin_version: newVersion,
							url
						}
					}
				}
			});

			yield put({
				type: 'setUpdatingStatus',
				payload: {
					sn,
					status: STATUS.BTNLOAD
				}
			});
		},
		*getNewVersion (_, { select }) {
			const newVersion = yield select(state =>
				state.ipcSoftwareUpdate.newVersion
			);
			return newVersion;
		},
		*getUpdatingValue(_, {  select }){
			const updating = yield select(state => 
				state.ipcSoftwareUpdate.updating
			);
			return updating;
		}

	},
	subscriptions: {
		setup({ dispatch }) {
			const listeners = [
				{
					opcode: OPCODE.UPDATE_STATUS,
					type: MESSAGE_TYPE.EVENT,
					handler:async (topic, messages) => {
						const msg = JSON.parse(JSON.stringify(messages));
						const { sn, status: statusCode } = msg.data;
						const updating = await dispatch({
							type: 'getUpdatingValue'
						});
						if(updating !== STATUS.NORMAL){
				
							if(statusCode === 0 && updating === STATUS.BTNLOAD){
								const { timeout } = msg.data;
								const newTime = { downloadTime: timeout? parseInt(timeout,0)*1000: timeout };
								dispatch({
									type: 'setOTATime',
									payload: {
										sn,
										newTime
									}
								});
								
								dispatch({
									type: 'setUpdatingStatus',
									payload: {
										sn,
										status: STATUS.DOWNLOAD
									}
								});

							}
							if(statusCode === 1 && updating === STATUS.DOWNLOAD){
								const { ai, timeout } = msg.data;
								if(ai === 0){
									const newTime = { firmwareTime: timeout? parseInt(timeout,0)*1000: timeout };

									dispatch({
										type: 'setOTATime',
										payload: {
											sn,
											newTime
										}
									});
									dispatch({
										type: 'setUpdatingStatus',
										payload: {
											sn,
											status: STATUS.FIRMWARE
										}
									});
									
								}
								if(ai === 1){
									const newTime = { aiUpgradeTime: timeout? parseInt(timeout,0)*1000: timeout };
									dispatch({
										type: 'setOTATime',
										payload: {
											sn,
											newTime
										}
									});
									dispatch({
										type: 'setUpdatingStatus',
										payload: {
											sn,
											status: STATUS.AI
										}
									});
								
								}
							}
							if(statusCode === 2 && updating === STATUS.AI){

								const { timeout } = msg.data;
								const newTime = { aiUpgradeTime: timeout? parseInt(timeout,0)*1000: timeout };
								dispatch({
									type: 'setOTATime',
									payload: {
										sn,
										newTime
									}
								});
								dispatch({
									type: 'setUpdatingStatus',
									payload: {
										sn,
										status: STATUS.AIFIRMWARE
									}
								});
								
							}
							if(statusCode === 10 && updating === STATUS.DOWNLOAD){
								dispatch({
									type: 'setUpdatingStatus',
									payload: {
										sn,
										status: STATUS.DOWNLOADFAIL
									}
								});
							}
						}
						
					}
				},
				{
					opcode: OPCODE.UPDATE_SUCCESS,
					type: MESSAGE_TYPE.EVENT,
					handler:async(topic, messages) =>{
						const msg = JSON.parse(JSON.stringify(messages));
						const { sn } = msg.data;
						const updating = await dispatch({
							type: 'getUpdatingValue'
						}); 
						if(updating === STATUS.RESTART){
							const status = STATUS.SUCCESS;
							dispatch({
								type: 'setUpdatingStatus',
								payload: {
									sn,
									status
								}
							});
						}
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
