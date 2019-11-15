import React from 'react';
import moment from 'moment';
import { connect } from 'dva';
// import Link from 'umi/link';
import { List, Avatar, Card, message } from 'antd';
import { formatMessage } from 'umi/locale';
import PerfectScrollbar from 'react-perfect-scrollbar';
import Faceid from '@/pages/Flow/VideoPlayer/Faceid';
import LivePlayer from '@/pages/Flow/VideoPlayer/LivePlayer';
import { LIBRARY_STYLE } from './libraryName';
import manImage from '@/assets/imgs/male.png';
import womanImage from '@/assets/imgs/female.png';

import styles from './Live.less';

@connect((state) => {
	const { flowFaceid: { rectangles, list, libraryList, ageRangeList }, flowLive: { ppi, streamId, ppiChanged, timeSlots }, routing: { location }} = state;
	// const rects = [];
	// rectangles.forEach(item => {
	// item.rects.forEach(rect => {
	// rects.push(rect);
	// });
	// });

	return {
		streamId,
		ppiChanged,
		currentPPI: ppi || '720',
		// faceidRects: rects || [],
		faceidRects: rectangles || [],
		faceidList: list || [],
		timeSlots: timeSlots || [],
		ageRangeList: ageRangeList || [],
		location,
		libraryList,
	};
}, (dispatch) => ({
	async getTimeSlots({sn, timeStart, timeEnd}) {
		const result = await dispatch({
			type: 'flowLive/getTimeSlots',
			payload: {
				sn,
				timeStart,
				timeEnd
			}
		});
		return result;
	},
	async getLiveUrl({ sn }) {
		const url = await dispatch({
			type: 'flowLive/getLiveUrl',
			payload: {
				sn
			}
		});
		return url;
	},
	// stopLive({ sn, streamId }) {
	// 	return dispatch({
	// 		type: 'flowLive/stopLive',
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
		const url = dispatch({
			type: 'flowLive/changePPI',
			payload: {
				ppi,
				sn
			}
		});
		return url;
	},
	async getHistoryUrl({ timestamp, sn }) {
		const url = await dispatch({
			type: 'flowLive/getHistoryUrl',
			payload: {
				timestamp,
				sn
			}
		});

		return url;
	},
	stopHistoryPlay({ sn }) {
		return dispatch({
			type: 'flowLive/stopHistoryPlay',
			payload: {
				sn
			}
		}).then(() => {
			console.log('stopHistoryPlay done.');
		});
	},
	clearRects(timestamp) {
		dispatch({
			type: 'flowFaceid/clearRects',
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
			type: 'flowFaceid/getAgeRangeList'
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
			type: 'flowFaceid/setDeviceSn',
			payload: {
				sn
			}
		});
	},
	clearList({ sn }) {
		dispatch({
			type: 'flowFaceid/clearList',
			payload: {
				sn
			}
		});
	},
	requestMetadata({ sn }) {
		dispatch({
			type: 'flowLive/requestMetadata',
			payload: {
				sn
			}
		});
	},
	changeFaceidPushStatus({ sn, status }) {
		dispatch({
			type: 'flowFaceid/changeFaceidPushStatus',
			payload: {
				sn,
				status
			}
		});
	},
	changeFaceComparePushStatus({ sn, status }) {
		dispatch({
			type: 'flowFaceid/changeFaceComparePushStatus',
			payload: {
				sn,
				status
			}
		});
	},
	readLibraryType() {
		dispatch({
			type: 'flowFaceid/readLibraryType',
		});
	},
	loadList: () => dispatch({ type:'ipcList/read'}),
}))
class Live extends React.Component{
	constructor(props) {
		super(props);
		this.state = {
			deviceInfo: {
				pixelRatio: '16:9'
			},
			liveTimestamp: 0,
			sdStatus: true
		};
	}

	async componentDidMount () {
		const { getDeviceInfo, getAgeRangeList, getSdStatus, setDeviceSn, clearList, readLibraryType, loadList } = this.props;

		readLibraryType();
		const sn = this.getSN();

		let sdStatus = true;
		if (sn) {
			// test();
			clearList({ sn });
			getAgeRangeList();
			await loadList();
			const deviceInfo = await getDeviceInfo({ sn });
			const { hasFaceid } = deviceInfo;

			setDeviceSn({ sn });

			if(hasFaceid){
				const status = await getSdStatus({ sn });
				if(status === 0) {
					message.info(formatMessage({ id: 'flow.nosdInfo' }));
					sdStatus = false;
				}
				this.startFaceComparePush();
				// setTimeout(() => {
				// 	this.startFaceComparePush();
				// }, 3000);

			}

			this.setState({
				deviceInfo,
				sdStatus
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
		console.log('facied');
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
		console.log('compare');
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
			// setTimeout(() => {
			// 	this.startFaceidPush();
			// }, 3000);
		}

		const url = await getLiveUrl({ sn });
		console.log('uuuuuuuu',url);
		return url;
	}

	// stopLive = async () => {
	//	const { stopLive, streamId, location: { query }} = this.props;
	//	const { sn } = query;

	//	await stopLive({
	//		sn,
	//		streamId
	//	});
	// }

	getHistoryUrl = async  (timestamp) => {
		const { getHistoryUrl } = this.props;
		const sn = this.getSN();

		const url = await getHistoryUrl({ sn, timestamp });

		const hasFaceid = this.hasFaceid();

		if (hasFaceid) {
			this.stopFaceidPush();
		}

		return url;
	}

	stopHistoryPlay = async () => {
		const { stopHistoryPlay } = this.props;
		const sn = this.getSN();

		await stopHistoryPlay({ sn });
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
		let ageName = formatMessage({id: 'flow.unknown'});
		if(age) {
			ageName = `${age} ${formatMessage({id: 'flow.age.unit'})}`;
		} else {
			switch(ageRangeCode) {
				case 1:
				case 2:
				case 3:
				case 18:
					ageName = formatMessage({ id: 'flow.ageLessInfo'});
					break;
				case 8:
					ageName = formatMessage({ id: 'flow.ageLargeInfo'});
					break;
				default:
					if(ageRangeList){
						ageRangeList.forEach(item => {
							if(item.ageRangeCode === ageRangeCode) {
								ageName = `${item.ageRange} ${formatMessage({id: 'flow.age.unit'})}`;
							}
						});
					}
			}
		}

		return ageName;
	}

	render() {
		const { timeSlots, faceidRects, faceidList, currentPPI, ppiChanged, libraryList } = this.props;

		const libraryType = {};
		libraryList.map(item => {
			libraryType[item.id] = LIBRARY_STYLE[item.type];
		});
		const { deviceInfo: { pixelRatio, hasFaceid }, liveTimestamp, sdStatus } = this.state;
		const genders = {
			0: formatMessage({ id: 'flow.genders.unknown' }),
			1: formatMessage({ id: 'flow.genders.male'}),
			2: formatMessage({ id: 'flow.genders.female'})
		};

		const images = {
			0: manImage,
			1: manImage,
			2: womanImage
		};

		return(
			<div className={styles['live-wrapper']}>

				<div className={`${styles['video-player-container']} ${sdStatus && hasFaceid ? styles['has-faceid'] : ''}`}>
					<LivePlayer

						pixelRatio={pixelRatio}

						currentPPI={currentPPI}
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
					sdStatus && hasFaceid ?
						<div className={styles['faceid-list-container']}>
							<PerfectScrollbar className={styles['faceid-list']}>
								<List
									dataSource={
										faceidList
									}
									renderItem={
										(item) =>
											(
												<List.Item key={item.id}>
													<Card
														title={
															<div className={styles['avatar-container']}>
																<div className={`${styles.type} ${styles[libraryType[item.libraryId]]}`}>{ item.libraryName }</div>
																{/* <Avatar className={styles.avatar} shape="square" size={128} src={`data:image/jpeg;base64,${item.pic ? item.pic : images[item.gender]}`} /> */}
																<Avatar className={styles.avatar} shape="square" size={128} src={item.pic ? item.pic : images[item.gender]} />
															</div>
														}
														bordered={false}
														className={styles.infos}
													>
														<p className={styles['infos-age']}>
															{ `(${ genders[item.gender] } ${this.mapAgeInfo(item.age, item.ageRangeCode)})` }
														</p>
														<p className={styles['infos-time']}>
															{/* <span>{formatMessage({id: 'live.last.arrival.time'})}</span> */}
															<span>
																{
																	moment.unix(item.timestamp).format('MM-DD HH:mm:ss')
																}
															</span>
														</p>
													</Card>
												</List.Item>
											)

									}
								/>

							</PerfectScrollbar>
						</div>
						: ''
				}
				<p className={styles['live-privacy']}>{formatMessage({ id: 'flow.fs.privacy'})}</p>
			</div>
		);
	}
};

export default Live;
