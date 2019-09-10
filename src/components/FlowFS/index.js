import React from 'react';
import moment from 'moment';
import { connect } from 'dva';
import { List, Avatar, Card } from 'antd';
import { formatMessage } from 'umi/locale';
import PerfectScrollbar from 'react-perfect-scrollbar';
import Faceid from '@/components/FlowFSPlayer/Faceid';
import LivePlayer from '@/components/FlowFSPlayer/LivePlayer';

import styles from './index.less';

@connect(
	state => {
		const {
			flowFaceid: { rectangles, list },
			flowLive: { ppi, streamId, ppiChanged, timeSlots },
			routing: { location },
		} = state;

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
	},
	dispatch => ({
		async getTimeSlots({ sn, timeStart, timeEnd }) {
			const result = await dispatch({
				type: 'flowLive/getTimeSlots',
				payload: {
					sn,
					timeStart,
					timeEnd,
				},
			});
			return result;
		},
		async getLiveUrl({ sn }) {
			const url = await dispatch({
				type: 'flowLive/getLiveUrl',
				payload: {
					sn,
				},
			});
			return url;
		},
		stopLive({ sn, streamId }) {
			return dispatch({
				type: 'flowLive/stopLive',
				payload: {
					sn,
					streamId,
				},
			}).then(() => true);
		},
		getDeviceInfo({ sn }) {
			return dispatch({
				type: 'flowIpcList/getDeviceInfo',
				payload: {
					sn,
				},
			}).then(info => info);
		},
		changePPI({ ppi, sn }) {
			dispatch({
				type: 'flowLive/changePPI',
				payload: {
					ppi,
					sn,
				},
			});
		},
		async getHistoryUrl({ timestamp, sn }) {
			const url = await dispatch({
				type: 'flowLive/getHistoryUrl',
				payload: {
					timestamp,
					sn,
				},
			});

			return url;
		},
		stopHistoryPlay({ sn }) {
			return dispatch({
				type: 'flowLive/stopHistoryPlay',
				payload: {
					sn,
				},
			});
		},
		clearRects(timestamp) {
			dispatch({
				type: 'flowFaceid/clearRects',
				payload: {
					timestamp,
				},
			});
		},
	})
)
class FlowLive extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			deviceInfo: {
				pixelRatio: '16:9',
			},
			liveTimestamp: 0,
		};
	}

	async componentDidMount() {
		const {
			getDeviceInfo,
			location: { query = {} } = {},
		} = this.props;

		const { sn = 'FS101D8BS00999' } = query;

		if (sn) {
			const deviceInfo = await getDeviceInfo({ sn });
			this.setState({
				deviceInfo,
			});
		}
	}

	componentWillUnmount() {
		const {
			stopLive,
			streamId,
			location: { query = {} },
			stopHistoryPlay,
		} = this.props;
		const { sn = 'FS101D8BS00999' } = query;

		if (sn) {
			stopHistoryPlay({
				sn,
			});
			if (streamId) {
				stopLive({
					sn,
					streamId,
				});
			}
		}
	}

	onTimeChange = async (timeStart, timeEnd) => {
		const {
			getTimeSlots,
			location: { query = {} } = {},
		} = this.props;
		const { sn = 'FS101D8BS00999' } = query;

		const result = await getTimeSlots({
			sn,
			timeStart,
			timeEnd,
		});

		return result;
	};

	onMetadataArrived = timestamp => {
		const { clearRects } = this.props;
		clearRects(timestamp);
	};

	syncLiveTimestamp = timestamp => {
		this.setState({
			liveTimestamp: timestamp,
		});
	};

	getLiveUrl = async () => {
		const {
			getLiveUrl,
			location: { query = {} } = {},
		} = this.props;
		const { sn = 'FS101D8BS00999' } = query;

		const url = await getLiveUrl({ sn });
		return url;
	};

	stopLive = async () => {
		const {
			stopLive,
			streamId,
			location: { query = {} } = {},
		} = this.props;
		const { sn = 'FS101D8BS00999' } = query;

		await stopLive({
			sn,
			streamId,
		});
	};

	getHistoryUrl = async timestamp => {
		const {
			getHistoryUrl,
			location: { query = {} } = {},
		} = this.props;
		const { sn = 'FS101D8BS00999' } = query;

		const url = await getHistoryUrl({ sn, timestamp });
		return url;
	};

	stopHistoryPlay = async () => {
		const {
			stopHistoryPlay,
			location: { query = {} } = {},
		} = this.props;
		const { sn = 'FS101D8BS00999' } = query;

		await stopHistoryPlay({ sn });
	};

	changePPI = ppi => {
		const {
			changePPI,
			location: { query = {} } = {},
		} = this.props;
		const { sn = 'FS101D8BS00999' } = query;

		changePPI({
			ppi,
			sn,
		});
	};

	render() {
		const { timeSlots, faceidRects, faceidList, currentPPI, ppiChanged } = this.props;
		const {
			deviceInfo: { pixelRatio, hasFaceid },
			liveTimestamp,
		} = this.state;
		const genders = {
			0: formatMessage({ id: 'live.genders.unknown' }),
			1: formatMessage({ id: 'live.genders.male' }),
			2: formatMessage({ id: 'live.genders.female' }),
		};

		return (
			<div className={styles['live-wrapper']}>
				<div
					className={styles['video-player-container']}
				>
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
								faceidRects={hasFaceid ? faceidRects : []}
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
				<div className={styles['faceid-list-container']}>
					<PerfectScrollbar>
						<List
							dataSource={faceidList}
							renderItem={item => (
								<List.Item key={item.id}>
									<Card
										title={
											<div className={styles['avatar-container']}>
												<div className={styles.type}>
													{item.libraryName}
												</div>
												<Avatar
													className={styles.avatar}
													shape="square"
													size={128}
													src={`data:image/jpeg;base64,${item.pic}`}
												/>
											</div>
										}
										bordered={false}
										className={styles.infos}
									>
										<p className={styles['infos-age']}>{`${genders[item.gender]} ${item.age}岁`}</p>
										<p className={styles['infos-time']}>
											<span>
												{formatMessage({
													id: 'live.last.arrival.time',
												})}
											</span>
											<span>
												{moment
													.unix(item.timestamp)
													.format('MM-DD HH:mm:ss')}
											</span>
										</p>
									</Card>
								</List.Item>
							)}
						/>
					</PerfectScrollbar>
				</div>
				<p className={styles['live-privacy']}>{formatMessage({ id: 'flow.fs.privacy'})}</p>
			</div>
		);
	}
}

export default FlowLive;
