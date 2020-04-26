import React from 'react';
import moment from 'moment';

import Timebar from './Timebar';
import VideoPlayer from './VideoPlayer';

class LivePlayer extends React.Component{

	constructor(props) {
		super(props);

		this.state = {
			isLive: true,
			playBtnDisabled: true,
			ppiChanged: false,
			currentTimestamp: moment().unix()
		};

		this.currentSrc = '';
		this.startTimestamp = 0;
		this.metadataCount = 0;
		this.relativeTimestamp = 0;
		this.baseTime = 0;
		this.lastMetadataTimestamp = 0;
		this.replayTimeout = 0;
		this.playbackTimeout = 0; // 视频回放异常处理定时器
		this.playHistoryTimestamp = ''; // 暂存视频回放时间戳
		this.toPause = false;	// patch 方式拖拽后更新state导致进度条跳变；

		this.isPlaying = false; // video是否正在播放

		this.bufferGap = 0; // 当前播放帧离缓存中最新帧的间隔时间(ms)
	}

	componentDidMount () {
		this.playLive();
	}

	componentDidUpdate (oldProps) {
		const { url } = this.props;
		if (oldProps.url !== url) {
			this.playLive();
		}
	}

	componentWillUnmount () {
		clearTimeout(this.replayTimeout);
		clearTimeout(this.playbackTimeout);
	}

	play = () => {
		const { videoplayer } = this;
		videoplayer.play();
	}

	pause = () => {
		const { videoplayer } = this;
		this.toPause = true;
		videoplayer.pause();
	}

	paused = () => {
		const { videoplayer } = this;
		return videoplayer.paused();
	}

	src = (src) => {
		const { videoplayer } = this;
		this.currentSrc = src;
		videoplayer.src(src);
	}

	playLive = async () => {
		this.showLoadingSpinner();

		const { getLiveUrl } = this.props;
		const url = await getLiveUrl();

		if (!url) {
			console.log('直播未能获取url！');
			return;
		}

		this.src(url);

		this.setState({
			isLive: true
		});

		this.startTimestamp = moment().unix();
		this.relativeTimestamp = 0;
		this.metadataCount = 0;
		this.toPause = false;
	}

	pauseLive = async () => {
		const { pauseLive } = this.props;
		this.pause();

		if (pauseLive) {
			await pauseLive();
		}
	}

	backToLive = async () => {
		await this.pauseHistory();
		this.playLive();
	}

	playHistory = async (timestamp) => {
		console.log('playHistory timestamp', timestamp, moment.unix(timestamp).format('YYYY-MM-DD HH:mm:ss'));
		this.playHistoryTimestamp = timestamp;
		if (moment().valueOf()/1000 - timestamp <= 60 ){
			// 拖到了直播
			console.log('goto playLive.');
			await this.pauseLive();
			await this.pauseHistory();
			this.playLive();

		}else{
			const { getHistoryUrl } = this.props;

			const isInside = this.isInsideSlots(timestamp);

			if (isInside === true) {
				const { isLive } = this.state;

				if (isLive) {
					await this.pauseLive();
					console.log('pauseLive done.');
				}else{
					await this.pauseHistory();
					console.log('pauseHistory done.');
				}

				setTimeout(async () => {
					// 拖动到了有值的区域，则播放回放
					const url = await getHistoryUrl(timestamp);
					console.log('goto playhistory url: ', url);
					if (url) {
						this.src(url);
						this.timeoutReplay();
					}else{
						console.log('回放未获取到url，当前时间戳为：', timestamp);
					}

					// 光标定位到当前回放位置，将状态调整我未非直播状态；
					this.setState({
						isLive: false,
						playBtnDisabled: this.getTechName() !== 'flvjs',
						currentTimestamp: timestamp
					});

					this.startTimestamp = timestamp;
					this.toPause = false;
					this.play();
				}, 800);

			}
			// 下面情况均为选中有值区域
			else if (isInside === timestamp) {
				// 选取的时间点比所有时间段都晚，说明下一段是直播
				console.log('goto playLive. because no next video.');
				await this.pauseLive();
				await this.pauseHistory();
				this.playLive();
			}else{
				// 拖动到了无值的区域，则跳转到下个时间点；
				console.log('goto next time. nextTimeStart:', isInside);

				await this.pauseLive();
				this.playHistory(isInside);
			}

		}
	}

	pauseHistory = async () => {
		const { stopHistoryPlay } = this.props;

		this.pause();
		await stopHistoryPlay();
	}

	playHandler = async () => {
		const { isLive,  currentTimestamp } = this.state;
		if (isLive) {
			return;
		}

		if (this.paused()) {
			await this.playHistory(parseInt(currentTimestamp, 10));
		}else{
			await this.pauseHistory();
		}

	}

	getTechName = () => {
		const { videoplayer } = this;
		return videoplayer.getTechName().toLowerCase();
	}

	showLoadingSpinner = () => {
		const { videoplayer } = this;
		videoplayer.showLoadingSpinner();

		this.setState({
			playBtnDisabled: true
		});
	}

	showNoMediaCover = () => {
		const { videoplayer } = this;
		videoplayer.showNoMediaCover();
	}

	ppiChange = async (ppi) => {
		const { changePPI } = this.props;
		const { videoplayer } = this;

		this.pause();
		const url = await changePPI(ppi);

		if (url) {
			videoplayer.src(url);

			this.setState({
				ppiChanged: true
			});

			setTimeout(() => {
				this.setState({
					ppiChanged: false
				});
			}, 3*1000);
		}else{
			console.log('切换分辨率，未获得url！');
		}
	}

	isInsideSlots = (timestamp) => {
		const { timeSlots: timeSlotsArray } = this.props;

		const timeSlots = JSON.parse(JSON.stringify(timeSlotsArray));
		timeSlots.sort((a, b) => b.timeStart - a.timeStart);

		let nextTimeStart = timestamp;
		const isInside = !timeSlots.every((slot) => {
			const { timeStart, timeEnd } = slot;
			if (timeStart <= timestamp && timestamp <= timeEnd ){
				return false;
			}
			if (timestamp < timeStart) {
				nextTimeStart = timeStart;
			}
			return true;
		});

		if (isInside) {
			return true;
		};

		return nextTimeStart;
	}

	onPlay = () => {
		const { onLivePlay } = this.props;
		const { isLive } = this.state;
		// console.log('metadataCount reset onPlay ');
		// this.metadataCount = 0;
		if (isLive) {
			onLivePlay();
		}

		console.log('LivePlayer onPlay');
		this.isPlaying = true;
	}

	onDateChange = async (timestamp) => {
		this.pause();

		this.showLoadingSpinner();

		// const { onTimeChange } = this.props;
		// await onTimeChange(timestamp, moment().unix());
		this.onTimebarStopDrag(timestamp);
	}

	onTimebarStartDarg = () => {
		clearTimeout(this.dragTimeout);
	}

	onTimebarMoveDarg = () => {
		clearTimeout(this.dragTimeout);
	}

	onTimebarStopDrag = (timestamp) => {
		this.toPause = true;

		this.setState({
			currentTimestamp: timestamp
		});

		this.pause();

		const { getTimeStart, getTimeEnd } = this.timebar;
		const timeStart = getTimeStart();
		const timeEnd = getTimeEnd();

		if (timeStart <= timestamp && timestamp <= timeEnd) {
			this.onTimeChangeEnd(timestamp);
		}

	}

	onTimeChange = async (timeStart, timeEnd) => {
		// console.log('onTimeChange.');
		const { onTimeChange } = this.props;
		await onTimeChange(timeStart, timeEnd);

		if (this.toPause) {
			this.onTimeChangeEnd();
		}

	}

	onTimeChangeEnd = (time) => {
		// console.log('onTimeChangeEnd');
		const { currentTimestamp } = this.state;

		const timestamp = time || currentTimestamp;
		const isInside = this.isInsideSlots(timestamp);

		if (isInside !== true) {
			this.showNoMediaCover();
		}

		clearTimeout(this.dragTimeout);
		this.dragTimeout = setTimeout(() => {
			clearTimeout(this.dragTimeout);
			this.playHistory(timestamp);
		}, 1.2*1000);

	}

	onTimeUpdate = (timestamp) => {
		const { getCurrentTimestamp } = this.props;
		// console.log('onTimeUpdate timestamp=', timestamp); // 即ReVideo.js中的player.currentTime()单位s
		// console.log('onTimeUpdate: ', this.toPause);
		if (this.toPause) {
			return;
		}

		const { isLive } = this.state;
		const currentTimestamp = this.startTimestamp + timestamp;

		if (isLive) {
			this.setState({
				currentTimestamp
			});

			const gap = (Math.round((timestamp - this.lastMetadataTimestamp)*1000*1000))/1000;
			// console.log('this.relativeTimestamp + gap=', this.relativeTimestamp + gap);
			// console.log('player current时间=', moment(this.baseTime + this.relativeTimestamp + gap).format('YYYY-MM-DD HH:mm:ss.SSS'));
			console.log('this.bufferGap=', this.bufferGap);
			getCurrentTimestamp(this.relativeTimestamp - this.bufferGap + gap);

			// lastMetadataTimestamp：metadata到来时，video此时的播放进度时间；ms
			// relativeTimestamp：metadata传过来的相对时间，ms

			// console.log('relativeTimestamp: ', this.relativeTimestamp, 'timestamp: ', timestamp, 'lastMetadataTimestamp: ', this.lastMetadataTimestamp, 'gap: ', gap,  'total: ', this.relativeTimestamp + gap);
		}

	}

	onMetadataArrived = (metadata) => {
		const { onMetadataArrived, updateBasetime, getCurrentTimestamp } = this.props;
		const { isLive } = this.state;
		const { videoplayer: { player } } = this;

		this.metadataCount++;
		console.log('this.metadataCount++', this.metadataCount);

		if (isLive) {

			if (this.metadataCount === 2) {
				// 只使用第二次到达的metadata
				this.relativeTimestamp = metadata.relativeTime;
				this.lastMetadataTimestamp = player.currentTime();
			}

			let timeGap = 0;

			// const { player } = this.videoplayer;

			// 仅flvjs播放器能使用此方式矫正播放进度
			if (player.techName_ === 'Flvjs' && player.buffered &&  player.buffered().length > 0) {
				const index = player.buffered().length -1;
				const curTime = player.currentTime();
				const endTime = player.buffered().end(index);
				const startTime = player.buffered().start(index);

				console.log('player.buffered().length=', player.buffered().length);
				console.log('before curTime=', curTime);
				console.log('endTime=', endTime);
				console.log('startTime=', startTime);
				console.log('endTime-startTime=', endTime-startTime);

				timeGap = (endTime - curTime) * 1000;

				// 离缓存间隔太小，会导致loading
				if (endTime - 2 > curTime) {
					console.log('endTime-curTime=', endTime - curTime);
					player.currentTime(endTime - 2);
					console.log('after player.currentTime()=', player.currentTime());

					timeGap = 2 * 1000;
				}
			}

			if (this.metadataCount === 2) {
				this.bufferGap = timeGap;
			}

			if (metadata.baseTime !== undefined && metadata.relativeTime !== undefined) {
				const baseTime = metadata.baseTime * 1000;
				const { relativeTime } = metadata;
				const videoTime = moment(baseTime + relativeTime).format('YYYY-MM-DD HH:mm:ss.SSS');
				const now = moment();

				// this.baseTime= baseTime;

				console.log('系统时间=', now.format('YYYY-MM-DD HH:mm:ss.SSS'));
				console.log('视频帧时间=', videoTime);
				console.log('系统时间-视频帧画面时间=', now.valueOf() - (baseTime + relativeTime));

				const gap = (Math.round((player.currentTime() - this.lastMetadataTimestamp)*1000*1000))/1000;
				// console.log('player.currentTime()=', player.currentTime());
				// console.log('player current时间=', moment(baseTime + this.relativeTimestamp + gap).format('YYYY-MM-DD HH:mm:ss.SSS'));
				getCurrentTimestamp(this.relativeTimestamp - this.bufferGap + gap);
			}
			onMetadataArrived(metadata.relativeTime - timeGap); // 用于清除人脸框
			updateBasetime(metadata.baseTime);
		} else {
			const { creationdate } = metadata;
			const timestamp = moment(creationdate.substring(0, creationdate.length - 4)).unix();

			this.setState({
				currentTimestamp: timestamp
			});
		}

	}

	onPause = () => {
		console.log('liveplayer onpause');
		if (!this.toPause) {
			console.log('非人为暂停!');
			this.play();
		}
		this.isPlaying = false;
	}

	onError = () => {
		console.log('liveplayer error handler');
		this.isPlaying = false;

		// 当前为直播
		const { isLive } = this.state;
		if (isLive) {
			this.timeoutReplay();
		} else {
			this.playbackErrorHander();
		}
	}

	onEnd = () => {
		this.isPlaying = false;
	}

	// 超时重新播放
	timeoutReplay = () => {
		console.log('timeoutReplay');
		const replay = (time) => {
			clearTimeout(this.replayTimeout);
			this.replayTimeout = setTimeout(async() => {
				const { isLive } = this.state;

				console.log('isLive=', isLive);
				console.log('this.isPlaying=', this.isPlaying);
				if (!this.isPlaying && isLive) {
					// await this.pauseLive(); // 新方案不必stoplive
					await this.playLive();
					replay(5);
				} else if (this.isPlaying) {
					clearTimeout(this.replayTimeout);
				}

			}, time * 1000);
		};

		replay(2);
	}

	// 回放异常处理
	playbackErrorHander() {
		console.log('playbackErrorHander this.currentSrc=', this.currentSrc);

		if (this.currentSrc) {
			this.src(this.currentSrc);
		}

		const replay = (time) => {
			clearTimeout(this.playbackTimeout);
			this.playbackTimeout = setTimeout(() => {
				console.log('this.playbackTimeout');
				const { isLive } = this.state;
				if (this.isPlaying) {
					clearTimeout(this.playbackTimeout);
				} else if (!isLive) {
					// 当前为回放

					// if (this.currentSrc) {
					// 	this.src(this.currentSrc);
					// }

					// start history
					console.log('this.playHistoryTimestamp=', this.playHistoryTimestamp);
					if (this.playHistoryTimestamp) {
						this.playHistory(this.playHistoryTimestamp);
					}

					replay(5);
				}
			}, time * 1000);
		};

		replay(5);
	}

	render () {
		const { timeSlots, plugin, currentPPI, isOnline, cloudStatus, navigateTo, sn, pixelRatio } = this.props;
		const { currentTimestamp, isLive, ppiChanged, playBtnDisabled } = this.state;

		return (
			<VideoPlayer
				ref={videoplayer => this.videoplayer = videoplayer}
				// {...this.props}

				current={currentTimestamp}

				playBtnDisabled={playBtnDisabled || isLive}
				showDatePicker
				canPPIChange

				isLive={isLive}
				plugin={plugin}

				showBackToLive={!isLive}
				backToLive={this.backToLive}
				playHandler={this.playHandler}

				currentPPI={currentPPI}
				ppiChange={this.ppiChange}
				ppiChanged={ppiChanged}

				onDateChange={this.onDateChange}
				onTimeUpdate={this.onTimeUpdate}

				onPlay={this.onPlay}
				onPause={this.onPause}
				onError={this.onError}
				onEnd={this.onEnd}
				onMetadataArrived={this.onMetadataArrived}
				isOnline={isOnline}
				cloudStatus={cloudStatus}
				navigateTo={navigateTo}
				sn={sn}

				pixelRatio={pixelRatio}

				progressbar={
					<Timebar
						ref={bar => this.timebar = bar}
						current={currentTimestamp}
						timeSlots={timeSlots}

						onStartDrag={this.onTimebarStartDarg}
						onMoveDrag={this.onTimebarMoveDarg}
						onStopDrag={this.onTimebarStopDrag}

						onTimeChange={this.onTimeChange}
						isOnline={isOnline}
						cloudStatus={cloudStatus}
					/>
				}
			/>
		);
	}
}

export default LivePlayer;