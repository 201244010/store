import React from 'react';
import moment from 'moment';
import { connect } from 'dva';
import Link from 'umi/link';
import { List, Avatar, Card, notification } from 'antd';
import PerfectScrollbar from 'react-perfect-scrollbar';

import VideoPlayer from '@/components/VideoPlayer/VideoPlayer';
// import Faveid from './Faveid';

import InitStatusSDCard from '../InitStatusSDCard/InitStatusSDCard';
import SDCard from '../SDCard/SDCard';

import styles from './Live.less';
import 'react-perfect-scrollbar/dist/css/styles.css';

const pixelRatioMap = {
	'FS1': '16:9',
	'SS1': '1:1'
};

@connect((state) => {
	const { faceid: { rectangles, list }, live: { url, ppi, streamId, ppiChanged, timeSlots }, /* videoSources */ } = state;
	return {
		liveUrl: url,
		streamId,
		ppiChanged,
		currentPPI: ppi || '1080',
		// sources: videoSources || [],
		faceidRects: rectangles || [],
		faceidList: list || [],
		timeSlots: timeSlots || []
	};
}, (dispatch) => ({
	// loadVideoSources({sn, timeStart, timeEnd}) {
	// 	dispatch({
	// 		type: 'videoSources/read',
	// 		payload: {
	// 			sn,
	// 			timeStart,
	// 			timeEnd
	// 		}
	// 	});
	// },
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
	getDeviceType({ sn }) {
		return dispatch({
			type: 'ipcList/getDeviceType',
			payload: {
				sn
			}
		}).then(type => type);
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
		// console.log('getHistoryUrl');
		const url = await dispatch({
			type: 'live/getHistoryUrl',
			payload: {
				timestamp,
				sn
			}
		});
		// console.log(url);
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
			type: 'FS1'	// 默认为FS1
		};

		this.changePPI = this.changePPI.bind(this);
		this.onTimeChange = this.onTimeChange.bind(this);
		this.getHistoryUrl = this.getHistoryUrl.bind(this);
		this.stopHistoryPlay = this.stopHistoryPlay.bind(this);
	}

	async componentDidMount() {
		const { startLive, getDeviceType, location: { query } } = this.props;
		// const timeStart = moment().format('X');
		const {sn} = query;

		if (sn) {
			const type = await getDeviceType({ sn });
			this.setState({
				type
			});

			startLive({
				sn
			});
		}

		// 不一定发的出去，因为浏览器会cancel；
		// window.onbeforeunload = () => {
		// 	stopLive({
		// 		sn
		// 	});
		// };
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
		// console.log(timestamp);
		const { /* loadVideoSources, */ getTimeSlots, location: { query } } = this.props;
		const {sn} = query;

		// const timeStart = moment.unix(timestamp).subtract(24, 'hours').set({
		// 	minute: 0,
		// 	second: 0,
		// 	millisecond: 0
		// }).unix(); // .subtract(1, 'day');

		// // 标尺右侧的时间终点；
		// // 无论从输入的当前时间是什么时候，始终需要渲染到从现在到未来24小时后的时间；
		// const timeEnd = moment.unix(timestamp).add(24, 'hours').set({
		// 	minute: 0,
		// 	second: 0,
		// 	millisecond: 0
		// }).unix();

		// loadVideoSources({
		// 	sn,
		// 	timeStart,
		// 	timeEnd
		// });
		// console.log(moment.unix(timeStart).format('YYYY-MM-DD HH:mm:ss'), moment.unix(timeEnd).format('YYYY-MM-DD HH:mm:ss'));
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
		const { /* sources, */ timeSlots, liveUrl, faceidRects, faceidList, currentPPI, ppiChanged, location: { query } } = this.props;
		const { sn } = query;
		// console.log(this.props);
		// console.log('live: ', liveUrl, streamId);

		const { type } = this.state;
		const hasFaceId = (type === 'FS1');

		const genders = {
			0: '未知',
			1: '男',
			2: '女'
		};

		return(
			<div className={styles['live-wrapper']}>
				<InitStatusSDCard sn={sn} />
				<SDCard />
				<div className={`${styles['video-player-container']} ${hasFaceId ? styles['has-faceid'] : ''}`}>
					<VideoPlayer

						pixelRatio={pixelRatioMap[type] || '16:9'}
						type='time'

						currentPPI={currentPPI}
						changePPI={this.changePPI}
						ppiChanged={ppiChanged}

						getHistoryUrl={this.getHistoryUrl}
						stopHistoryPlay={this.stopHistoryPlay}

						// sources={sources}
						timeSlots={timeSlots}
						url={liveUrl}

						faceidRects={
							hasFaceId ? faceidRects : null
						}

						onTimeChange={this.onTimeChange}
					/>
				</div>

				{
					hasFaceId ?
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
														{/* { `(${ item.gender === 0 ? '未知' : item.gender === 1 ? '男' : '女' } ${ item.age }岁)` } */}
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

													{/* <Button>会员详情</Button> */}

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