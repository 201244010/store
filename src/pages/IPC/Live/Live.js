import React from 'react';
import moment from 'moment';
import { connect } from 'dva';
// import Link from 'umi/link';
import { List, Avatar, Card, message } from 'antd';
import { formatMessage } from 'umi/locale';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { UNBIND_CODE, ERROR_OK } from '@/constants/errorCode';
import Faceid from '@/components/VideoPlayer/Faceid';
import LivePlayer from '@/components/VideoPlayer/LivePlayer';

import styles from './Live.less';
import manImage from '@/assets/imgs/male.png';
import womanImage from '@/assets/imgs/female.png';

const statusCode = {
	opened: 1,
	nonactivated: 2,
	expired: 3
};
@connect((state) => {
	const { faceid: { rectangles, list, ageRangeList }, live: { ppi, streamId, ppiChanged, timeSlots } } = state;

	return {
		streamId,
		ppiChanged,
		currentPPI: ppi || '720',
		faceidRects: rectangles || [],
		faceidList: list || [],
		timeSlots: timeSlots || [],
		ageRangeList:  ageRangeList || []
	};
}, (dispatch) => ({
	async getTimeSlots({sn, timeStart, timeEnd}) {
		const result = await dispatch({
			type: 'live/getTimeSlots',
			payload: {
				sn,
				timeStart,
				timeEnd
			}
		});
		return result;
	},
	async getLiveUrl({ sn }) {
		const result = await dispatch({
			type: 'live/getLiveUrl',
			payload: {
				sn
			}
		});
		const { code, url } = result;
		if( code === UNBIND_CODE) {
			message.warning(formatMessage({ id: 'live.nobind' }));
		}
		return url;
	},
	// stopLive({ sn, streamId }) {
	// 	return dispatch({
	// 		type: 'live/stopLive',
	// 		payload: {
	// 			sn,
	// 			streamId
	// 		}
	// 	}).then(() => {
	// 		console.log('stopLive done.');
	// 		return true;
	// 	});
	// },
	getDeviceInfo({ sn }) {
		return dispatch({
			type: 'ipcList/getDeviceInfo',
			payload: {
				sn
			}
		}).then(info => info);
	},
	async changePPI({ ppi, sn }) {
		const url = await dispatch({
			type: 'live/changePPI',
			payload: {
				ppi,
				sn
			}
		});
		return url;
	},
	async getHistoryUrl({ timestamp, sn }) {
		const url = await dispatch({
			type: 'live/getHistoryUrl',
			payload: {
				timestamp,
				sn
			}
		});

		return url;
	},
	stopHistoryPlay({ sn }) {
		return dispatch({
			type: 'live/stopHistoryPlay',
			payload: {
				sn
			}
		}).then(() => {
			console.log('stopHistoryPlay done.');
		});
	},
	clearRects(timestamp) {
		dispatch({
			type: 'faceid/clearRects',
			payload: {
				timestamp
			}
		});
	},
	navigateTo: (pathId, urlParams) => dispatch({
		type: 'menu/goToPath',
		payload: {
			pathId,
			urlParams
		}
	}),
	getAgeRangeList() {
		dispatch({
			type: 'faceid/getAgeRangeList'
		});
	},
	getSdStatus: ({ sn }) => {
		const result = dispatch({
			type: 'sdcard/getSdStatus',
			sn
		});
		return result;
	},
	setDeviceSn({ sn }) {
		dispatch({
			type: 'faceid/setDeviceSn',
			payload: {
				sn
			}
		});
	},
	clearList({ sn }) {
		dispatch({
			type: 'faceid/clearList',
			payload: {
				sn
			}
		});
	},
	requestMetadata({ sn }) {
		dispatch({
			type: 'live/requestMetadata',
			payload: {
				sn
			}
		});
	},
	changeFaceidPushStatus({ sn, status }) {
		dispatch({
			type: 'faceid/changeFaceidPushStatus',
			payload: {
				sn,
				status
			}
		});
	},
	changeFaceComparePushStatus({ sn, status }) {
		dispatch({
			type: 'faceid/changeFaceComparePushStatus',
			payload: {
				sn,
				status
			}
		});
	},
	getCloudInfo: async (sn) => {
		const cloudStatus = await dispatch({
			type: 'ipcList/readCloudInfo',
			payload: {
				sn
			}
		}).then((result) => {
			const { code, data} = result;
			if(code === ERROR_OK) {
				const { status, validTime } = data;
				if(status === statusCode.opened) {
					const days = validTime/3600/24;
					// console.log(days);
					if (days < 3){
						return 'willExpired';
					}
					return 'opened';
				} if( status === statusCode.expired) {
					return 'expired';
				}
				return 'closed';
			}
			return 'error';
		});
		return cloudStatus;
	}
}))
class Live extends React.Component{
	constructor(props) {
		super(props);

		this.state = {
			deviceInfo: {
				pixelRatio: '16:9'
			},
			liveTimestamp: 0,
			sdStatus: true,
			cloudStatus: 'normal',
			historyPPI: '',
		};
	}

	async componentDidMount () {
		const { getDeviceInfo, getAgeRangeList, getSdStatus, setDeviceSn, clearList, getCloudInfo } = this.props;

		const sn = this.getSN();

		let sdStatus = true;
		let cloudStatus = 'normal';
		if (sn) {
			clearList({ sn });
			getAgeRangeList();

			const deviceInfo = await getDeviceInfo({ sn });
			const { hasFaceid, hasCloud } = deviceInfo;

			setDeviceSn({ sn });

			if(hasFaceid){
				const status = await getSdStatus({ sn });
				if(status === 0) {
					message.info(formatMessage({ id: 'live.nosdInfo' }));
					sdStatus = false;
				}

				this.startFaceComparePush();
			}
			if(hasCloud) {
				cloudStatus = await getCloudInfo(sn);
			}

			this.setState({
				deviceInfo,
				sdStatus,
				cloudStatus
			});
			// setTimeout(test, 1000);
		}
	}

	componentWillUnmount () {
		const { stopHistoryPlay } = this.props;
		const sn = this.getSN();
		if (sn) {
			stopHistoryPlay({
				sn
			});

			const hasFaceid = this.hasFaceid();
			if (hasFaceid) {
				this.stopFaceidPush();
				this.stopFaceComparePush();
			}
		}
	}

	onTimeChange = async (timeStart, timeEnd) => {

		const { getTimeSlots } = this.props;
		const sn = this.getSN();

		const result = await getTimeSlots({
			sn,
			timeStart,
			timeEnd
		});

		return result;
	}

	onMetadataArrived = (timestamp) => {
		const { clearRects } = this.props;
		clearRects(timestamp);
	}


	syncLiveTimestamp = (timestamp) => {
		// console.log(timestamp);
		this.setState({
			liveTimestamp: timestamp
		});
	}

	getSN = () => {
		const { location: { query } } = this.props;
		const { sn } = query;

		return sn;
	}

	hasFaceid = async () => {
		const { getDeviceInfo } = this.props;
		const sn = this.getSN();
		const deviceInfo = await getDeviceInfo({ sn });
		const { hasFaceid } = deviceInfo;

		return hasFaceid;
	}

	requestMetadata = () => {
		const { requestMetadata } = this.props;
		const sn = this.getSN();

		requestMetadata({ sn });
	}

	startFaceidPush = () => {
		const { changeFaceidPushStatus } = this.props;
		const sn = this.getSN();

		changeFaceidPushStatus({
			sn,
			status: true
		});
	}

	stopFaceidPush = () => {
		const { changeFaceidPushStatus } = this.props;
		const sn = this.getSN();

		changeFaceidPushStatus({
			sn,
			status: false
		});
	}

	startFaceComparePush = () => {
		const { changeFaceComparePushStatus } = this.props;
		const sn = this.getSN();

		changeFaceComparePushStatus({
			sn,
			status: true
		});
	}

	stopFaceComparePush = () => {
		const { changeFaceComparePushStatus } = this.props;
		const sn = this.getSN();

		changeFaceComparePushStatus({
			sn,
			status: false
		});
	}

	getLiveUrl = async () => {
		const { getLiveUrl } = this.props;
		const sn = this.getSN();

		const hasFaceid = this.hasFaceid();
		if (hasFaceid) {
			this.startFaceidPush();
		}

		const url = await getLiveUrl({ sn });
		return url;
	}

	// stopLive = async () => {
	// 	const hasFaceid = this.hasFaceid();

	// 	if (hasFaceid) {
	// 		this.stopFaceidPush();
	// 	}
	// }

	getHistoryUrl = async  (timestamp) => {
		const { getHistoryUrl } = this.props;
		const sn = this.getSN();


		const url = await getHistoryUrl({ sn, timestamp });

		const hasFaceid = this.hasFaceid();

		if (hasFaceid) {
			this.stopFaceidPush();
		}
		this.setState({
			historyPPI: '1080'
		});
		return url;
	}

	stopHistoryPlay = async () => {
		const { stopHistoryPlay } = this.props;
		const sn = this.getSN();

		await stopHistoryPlay({ sn });

		this.setState({
			historyPPI: ''
		});
	}

	changePPI = (ppi) => {
		const { changePPI } = this.props;
		const sn = this.getSN();

		const url = changePPI({
			ppi,
			sn
		});

		return url;
	}

	mapAgeInfo(age, ageRangeCode) {

		const { ageRangeList } = this.props;
		let ageName = formatMessage({id: 'live.unknown' });
		if(age) {
			ageName = `${age} ${formatMessage({id: 'live.age.unit'})}`;
		} else {
			switch(ageRangeCode) {
				case 1:
				case 2:
				case 3:
				case 18:
					ageName = formatMessage({ id: 'photoManagement.ageLessInfo'});
					break;
				case 8:
					ageName = formatMessage({ id: 'photoManagement.ageLargeInfo'});
					break;
				default:
					if(ageRangeList){
						ageRangeList.forEach(item => {
							if(item.ageRangeCode === ageRangeCode) {
								ageName = `${item.ageRange} ${formatMessage({id: 'live.age.unit'})}`;
							}
						});
					}
			}
		}

		return ageName;
	}

	render() {
		const { timeSlots, faceidRects, faceidList, currentPPI, ppiChanged, navigateTo } = this.props;

		const { deviceInfo: { pixelRatio, hasFaceid }, liveTimestamp, sdStatus, cloudStatus, historyPPI } = this.state;

		const genders = {
			0: formatMessage({ id: 'live.genders.unknown' }),
			1: formatMessage({ id: 'live.genders.male'}),
			2: formatMessage({ id: 'live.genders.female'})
		};

		const sn = this.getSN();

		const images = {
			0: manImage,
			1: manImage,
			2: womanImage
		};


		return(
			<div className={styles['live-wrapper']}>

				<div className={`${styles['video-player-container']} ${sdStatus && hasFaceid ? styles['has-faceid'] : ''}
								${cloudStatus === 'closed' || cloudStatus === 'expired' || cloudStatus === 'willExpired' ? styles['has-cloud-info']:''}`}
				>
					<LivePlayer

						pixelRatio={pixelRatio}

						currentPPI={historyPPI || currentPPI}
						changePPI={this.changePPI}
						ppiChanged={ppiChanged}
						onLivePlay={this.requestMetadata}
						getHistoryUrl={this.getHistoryUrl}
						stopHistoryPlay={this.stopHistoryPlay}

						getLiveUrl={this.getLiveUrl}
						// pauseLive={this.stopLive}

						timeSlots={timeSlots}

						plugin={
							<Faceid
								faceidRects={
									hasFaceid ? faceidRects : []
								}
								current={liveTimestamp}
								pixelRatio={pixelRatio}
								currentPPI={currentPPI}
							/>
						}

						getCurrentTimestamp={this.syncLiveTimestamp}
						onTimeChange={this.onTimeChange}
						onMetadataArrived={this.onMetadataArrived}
					/>

				</div>
				{
					cloudStatus === 'closed' || cloudStatus === 'expired' || cloudStatus === 'willExpired'?
						<div className={styles['cloud-service-info']}>
							{
								cloudStatus === 'closed' ?
									<div>
										<span>{formatMessage({ id: 'live.cloudServiceInfo' })}</span>
										<span className={styles['cloud-action']} onClick={() => navigateTo('cloudStorage',{ sn, type: 'subscribe' })}>{formatMessage({ id: 'live.subscribeCloud'})}</span>
									</div>
									:
									<div>
										<span>{cloudStatus === 'expired'?formatMessage({ id: 'live.expired'}): formatMessage({ id: 'live.willExpired'})}</span>
										<span className={styles['cloud-action']} onClick={() => navigateTo('cloudStorage',{ sn, type: 'repay' })}>{formatMessage({ id: 'live.pay'})}</span>
									</div>
							}
						</div>
						: ''
				}
				{
					sdStatus && hasFaceid ?
						<div className={styles['faceid-list-container']}>
							<PerfectScrollbar className={styles['faceid-list']}>
								<List
									dataSource={
										faceidList
									}
									renderItem={
										(item) => (
											<List.Item key={item.id}>
												<Card
													title={
														<div className={styles['avatar-container']}>
															<div className={styles.type}>{ item.libraryName }</div>
															{/* <Avatar className={styles.avatar} shape="square" size={96} src={`data:image/jpeg;base64,${item.pic ? item.pic : images[item.gender]}`} /> */}
															<Avatar className={styles.avatar} shape="square" size={96} src={item.pic ? item.pic : images[item.gender]} />
														</div>
													}
													bordered={false}

													className={styles.infos}
												>
													<p className={styles.name}>{ item.name }</p>
													<p>
														{ `(${ genders[item.gender] } ${this.mapAgeInfo(item.age, item.ageRangeCode)})` }
													</p>
													<p>
														<span>{formatMessage({id: 'live.last.arrival.time'})}</span>
														<span>
															{
																moment.unix(item.timestamp).format('MM-DD HH:mm:ss')
															}
														</span>
													</p>

													{/* <p>
														<span className={styles['button-infos']} onClick={() => navigateTo('entryDetail',{ faceId:item.id })}>{formatMessage({ id: 'live.enter.details'})}</span>
													</p> */}
												</Card>
											</List.Item>
										)
									}
								/>

							</PerfectScrollbar>
							{/* <div className={styles['infos-more']}>
								{
									faceidList && faceidList.length? <span onClick={() => navigateTo('faceLog')}>{formatMessage({ id: 'live.logs'})}</span> : ''
								}
							</div> */}
						</div>
						: ''
				}
			</div>
		);
	}
};

export default Live;