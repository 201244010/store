import React from 'react';
import moment from 'moment';
import { connect } from 'dva';
import Link from 'umi/link';
import { List, Avatar, Card } from 'antd';
import { formatMessage } from 'umi/locale';
import PerfectScrollbar from 'react-perfect-scrollbar';
import Faceid from '@/components/VideoPlayer/Faceid';
import LivePlayer from '@/components/VideoPlayer/LivePlayer';

import styles from './Live.less';

@connect((state) => {
	const { faceid: { rectangles, list }, live: { ppi, streamId, ppiChanged, timeSlots } } = state;

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
	async getLiveUrl({ sn }) {
		const url = await dispatch({
			type: 'live/getLiveUrl',
			payload: {
				sn
			}
		});
		return url;
	},
	stopLive({ sn, streamId }) {
		return dispatch({
			type: 'live/stopLive',
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
	}

	async componentDidMount () {
		const { getDeviceInfo, location: { query } } = this.props;

		const {sn} = query;

		if (sn) {
			const deviceInfo = await getDeviceInfo({ sn });
			console.log('getDeviceInfo', deviceInfo);
			this.setState({
				deviceInfo
			});
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

		const { deviceInfo: { pixelRatio, hasFaceid }, liveTimestamp } = this.state;

		const genders = {
			0: formatMessage({ id: 'live.genders.unknown' }),
			1: formatMessage({ id: 'live.genders.male'}),
			2: formatMessage({ id: 'live.genders.female'})
		};


		return(
			<div className={styles['live-wrapper']}>

				<div className={`${styles['video-player-container']} ${hasFaceid ? styles['has-faceid'] : ''}`}>
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
												{/* <Card
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
														<span>{formatMessage({id: 'live.entry.time'})}</span>
														<span>
															{
																moment.unix(item.timestamp).format('MM-DD HH:mm:ss')
															}
														</span>
													</p>

													<p>
														<Link className={styles['button-infos']} to='./userinfo'>{formatMessage({ id: 'live.member.details'})}</Link>
													</p>
												</Card> */}
												<Card
													bordered={false}
													className={styles['faceid-card']}
												>
													<div className={styles['avatar-col']}>
														<Avatar className={styles['avatar-img']} shape="square" size={89} src={`data:image/jpeg;base64,${item.pic}`} />
													</div>
													<div className={styles['info-col']}>
														<span className={styles['info-label']}>{`${ formatMessage({id: 'live.name'}) } : ${ item.name }`}</span>
														<span className={styles['info-label']}>{`${ formatMessage({ id: 'live.group'}) } : ${ item.libraryName }`}</span>
														<span className={styles['info-label']}>{`${ formatMessage({ id: 'live.gender'}) } : ${genders[item.gender]}`}</span>
														<span className={styles['info-label']}>{`${ formatMessage({ id: 'live.age'}) } : ${item.age}`}</span>
													</div>
													<div className={styles['info-col']}>
														<span>{`${formatMessage({id: 'live.last.arrival.time'})}: `}</span>
														<span>
															{
																moment.unix(item.timestamp).format('MM-DD HH:mm:ss')
															}
														</span>
													</div>

													<p>
														<Link className={styles['button-infos']} to='./userinfo'>{formatMessage({ id: 'live.enter.details'})}</Link>
													</p>
												</Card>
											</List.Item>
										)
									}
								/>
								{
									faceidList.length ?
										<div className={styles['infos-more']}>
											<Link to='./userinfo'>{formatMessage({ id: 'live.logs'})}</Link>
										</div>
										: ''
								}

							</PerfectScrollbar>
						</div>
						: ''
				}
			</div>

		);
	}
};

export default Live;