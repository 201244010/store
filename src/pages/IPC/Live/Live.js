import React from 'react';
import moment from 'moment';
import { connect } from 'dva';
import Link from 'umi/link';
import { List, Avatar, Card, notification } from 'antd';
import PerfectScrollbar from 'react-perfect-scrollbar';

import Faceid from '@/components/VideoPlayer/Faceid';
import VideoPlayer from '@/components/VideoPlayer/VideoPlayer';
// import Faveid from './Faveid';

import InitStatusSDCard from '../InitStatusSDCard/InitStatusSDCard';
import SDCard from '../SDCard/SDCard';

import styles from './Live.less';
import 'react-perfect-scrollbar/dist/css/styles.css';

@connect((state) => {
	const { faceid: { rectangles, list }, live: { url, ppi, streamId, ppiChanged, timeSlots } } = state;

	const rects = [];
	rectangles.forEach(item => {
		item.rects.forEach(rect => {
			rects.push(rect);
		});
	});

	return {
		liveUrl: url,
		streamId,
		ppiChanged,
		currentPPI: ppi || '1080',
		faceidRects: rects || [],
		faceidList: list || [],
		timeSlots: timeSlots || []
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
	startLive({ sn }) {
		dispatch({
			type: 'live/startLive',
			payload: {
				sn
			}
		});
	},
	stopLive({ sn, streamId }) {
		dispatch({
			type: 'live/stopLive',
			payload: {
				sn,
				streamId
			}
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
			type: 'live/changePPI',
			payload: {
				ppi,
				sn
			}
		});
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
		dispatch({
			type: 'live/stopHistoryPlay',
			payload: {
				sn
			}
		});
	}
}))
class Live extends React.Component{
	constructor(props) {
		super(props);

		this.state = {
			deviceInfo: {
				pixelRatio: '16:9'
			},
			liveTimestamp: 0
		};

		this.changePPI = this.changePPI.bind(this);
		this.onTimeChange = this.onTimeChange.bind(this);
		this.getHistoryUrl = this.getHistoryUrl.bind(this);
		this.stopHistoryPlay = this.stopHistoryPlay.bind(this);
		this.syncLiveTimestamp = this.syncLiveTimestamp.bind(this);
	}

	async componentDidMount() {
		const { startLive, getDeviceInfo, location: { query } } = this.props;

		const {sn} = query;

		if (sn) {
			const deviceInfo = await getDeviceInfo({ sn });
			console.log('getDeviceInfo', deviceInfo);
			this.setState({
				deviceInfo
			});

			startLive({
				sn
			});
		}

	}

	componentWillUnmount() {
		const { stopLive, streamId, location: { query }, stopHistoryPlay } = this.props;
		const { sn } = query;

		// 这部分代码是为了离开live页面关闭notification【需优化】
		const noSdcardKey = `noSdcard${sn}`;
		notification.close(noSdcardKey);
		const unknownKey = `unknown${ sn }`;
		notification.close(unknownKey);
		const formatKey = `formatSdcard${sn}`;
		notification.close(formatKey);

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

	async onTimeChange(timeStart, timeEnd) {

		const { getTimeSlots, location: { query } } = this.props;
		const {sn} = query;

		const result = await getTimeSlots({
			sn,
			timeStart,
			timeEnd
		});

		return result;
	}

	async getHistoryUrl (timestamp) {
		const { getHistoryUrl, location: { query }} = this.props;
		const { sn } = query;

		const url = await getHistoryUrl({ sn, timestamp });
		return url;
	}

	syncLiveTimestamp (timestamp) {
		this.setState({
			liveTimestamp: timestamp
		});
	}

	stopHistoryPlay () {
		const { stopHistoryPlay, location: { query } } = this.props;
		const { sn } = query;

		stopHistoryPlay({ sn });
	}

	changePPI (ppi) {
		const { changePPI, location:{ query } } = this.props;
		const { sn } = query;

		changePPI({
			ppi,
			sn
		});
	}



	render() {
		const { timeSlots, liveUrl, faceidRects, faceidList, currentPPI, ppiChanged, location: { query } } = this.props;
		const { sn } = query;

		const { deviceInfo: { pixelRatio, hasFaceid }, liveTimestamp } = this.state;

		const genders = {
			0: '未知',
			1: '男',
			2: '女'
		};

		return(
			<div className={styles['live-wrapper']}>
				<InitStatusSDCard sn={sn} />
				<SDCard />
				<div className={`${styles['video-player-container']} ${hasFaceid ? styles['has-faceid'] : ''}`}>
					<VideoPlayer

						pixelRatio={pixelRatio}
						type='time'

						currentPPI={currentPPI}
						changePPI={this.changePPI}
						ppiChanged={ppiChanged}

						getHistoryUrl={this.getHistoryUrl}
						stopHistoryPlay={this.stopHistoryPlay}

						// sources={sources}
						timeSlots={timeSlots}
						url={liveUrl}

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
					/>

				</div>

				{
					hasFaceid ?
						<div className={styles['faceid-list-container']}>
							<PerfectScrollbar>
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
															<Avatar className={styles.avatar} shape="square" size={96} src={`data:image/jpeg;base64,${item.pic}`} />
														</div>
													}
													bordered={false}

													className={styles.infos}
												>
													<p className={styles.name}>{ item.name }</p>
													<p>
														{ `(${ genders[item.gender] } ${ item.age }岁)` }
													</p>
													<p>
														<span>进店时间：</span>
														<span>
															{
																moment.unix(item.timestamp).format('MM-DD HH:mm:ss')
															}
														</span>
													</p>

													<p>
														<Link className={styles['button-infos']} to='./userinfo'>会员详情</Link>
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
			</div>

		);
	}
};

export default Live;