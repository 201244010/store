import React from 'react';
import moment from 'moment';
import { connect } from 'dva';
// import Link from 'umi/link';
import { List, Avatar, Card, message } from 'antd';
import { formatMessage } from 'umi/locale';
import PerfectScrollbar from 'react-perfect-scrollbar';
import Faceid from '@/pages/Flow/VideoPlayer/Faceid';
import LivePlayer from '@/pages/Flow/VideoPlayer/LivePlayer';
import { LIBRARY_NAME } from './libraryName';

import styles from './Live.less';

@connect((state) => {
	const { flowFaceid: { rectangles, list }, flowLive: { ppi, streamId, ppiChanged, timeSlots }, routing: { location }, } = state;
	const rects = [];
	rectangles.forEach(item => {
		item.rects.forEach(rect => {
			rects.push(rect);
		});
	});

	return {
		streamId,
		ppiChanged,
		currentPPI: ppi || '1080',
		faceidRects: rects || [],
		faceidList: list || [],
		timeSlots: timeSlots || [],
		location,
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
	stopLive({ sn, streamId }) {
		return dispatch({
			type: 'flowLive/stopLive',
			payload: {
				sn,
				streamId
			}
		}).then(() => {
			console.log('stopLive done.');
			return true;
		});
	},
	getDeviceInfo({ sn }) {
		return dispatch({
			type: 'ipcList/getDeviceInfo',
			payload: {
				sn
			}
		}).then(info => info);
	},
	changePPI({ ppi, sn }) {
		dispatch({
			type: 'flowLive/changePPI',
			payload: {
				ppi,
				sn
			}
		});
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
	}
	// test: () => {
	// 	dispatch({
	// 		type:'faceid/test'
	// 	});
	// }
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
		const { getDeviceInfo, location: { query }, getAgeRangeList, getSdStatus, setDeviceSn, clearList } = this.props;

		const {sn} = query;
		let sdStatus = true;
		if (sn) {
			// test();
			clearList({ sn });
			getAgeRangeList();
			const deviceInfo = await getDeviceInfo({ sn });
			const { hasFaceid } = deviceInfo;
			setDeviceSn({ sn });
			if(hasFaceid){
				const status = await getSdStatus({ sn });
				if(status === 0) {
					message.info(formatMessage({ id: 'live.nosdInfo' }));
					sdStatus = false;
				}
			}

			this.setState({
				deviceInfo,
				sdStatus
			});

			// setTimeout(test, 1000);
		}
	}

	componentWillUnmount () {
		const { stopLive, streamId, location: { query }, stopHistoryPlay } = this.props;
		const { sn } = query;

		if (sn) {
			stopHistoryPlay({
				sn
			});
			if (streamId) {
				stopLive({
					sn,
					streamId
				});
			}
		}
	}

	onTimeChange = async (timeStart, timeEnd) => {

		const { getTimeSlots, location: { query } } = this.props;
		const {sn} = query;

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

	getLiveUrl = async () => {
		const { getLiveUrl, location: { query }} = this.props;
		const { sn } = query;

		const url = await getLiveUrl({ sn });
		return url;
	}

	stopLive = async () => {
		const { stopLive, streamId, location: { query }} = this.props;
		const { sn } = query;

		await stopLive({
			sn,
			streamId
		});
	}

	getHistoryUrl = async  (timestamp) => {
		const { getHistoryUrl, location: { query }} = this.props;
		const { sn } = query;

		const url = await getHistoryUrl({ sn, timestamp });
		return url;
	}

	stopHistoryPlay = async () => {
		const { stopHistoryPlay, location: { query } } = this.props;
		const { sn } = query;

		await stopHistoryPlay({ sn });
	}

	changePPI = (ppi) => {
		const { changePPI, location:{ query } } = this.props;
		const { sn } = query;

		changePPI({
			ppi,
			sn
		});
	}

	render() {
		const { timeSlots, faceidRects, faceidList, currentPPI, ppiChanged } = this.props;

		const { deviceInfo: { pixelRatio, hasFaceid }, liveTimestamp, sdStatus } = this.state;
		const genders = {
			0: formatMessage({ id: 'live.genders.unknown' }),
			1: formatMessage({ id: 'live.genders.male'}),
			2: formatMessage({ id: 'live.genders.female'})
		};

		return(
			<div className={styles['live-wrapper']}>

				<div className={`${styles['video-player-container']} ${sdStatus && hasFaceid ? styles['has-faceid'] : ''}`}>
					<LivePlayer

						pixelRatio={pixelRatio}

						currentPPI={currentPPI}
						changePPI={this.changePPI}
						ppiChanged={ppiChanged}

						getHistoryUrl={this.getHistoryUrl}
						stopHistoryPlay={this.stopHistoryPlay}

						getLiveUrl={this.getLiveUrl}
						pauseLive={this.stopLive}

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
																<div className={styles.type} style={{backgroundImage: LIBRARY_NAME[item.libraryName]}}>{ item.libraryName }</div>
																<Avatar className={styles.avatar} shape="square" size={128} src={`data:image/jpeg;base64,${item.pic}`} />
															</div>
														}
														bordered={false}
														className={styles.infos}
													>
														<p className={styles['infos-age']}>
															{ `(${ genders[item.gender] } ${ item.age }${formatMessage({id: 'live.age.unit'})})` }
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
