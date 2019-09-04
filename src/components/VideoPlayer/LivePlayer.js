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
		this.relativeTimestamp = 0;
		this.toPause = false;	// patch 方式拖拽后更新state导致进度条跳变；
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
		// console.log('timestamp', timestamp, moment.unix(timestamp).format('YYYY-MM-DD HH:mm:ss'));
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
						setTimeout(() => {
							const { videoplayer } = this;
							// console.log(videoplayer.paused());
							if (videoplayer.paused()) {
								this.src(url);
							}
						}, 1000);
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
		const { timeSlots } = this.props;

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

			getCurrentTimestamp(this.relativeTimestamp + timestamp*1000);
		}

	}

	onMetadataArrived = (metadata) => {
		const { onMetadataArrived } = this.props;

		const { isLive } = this.state;

		if (isLive) {
			if (this.relativeTimestamp === 0) {
				this.relativeTimestamp = metadata.relativeTime;
			}

			onMetadataArrived(metadata.relativeTime);
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
	}

	onError = () => {
		console.log('liveplayer error handler');
		this.src(this.currentSrc);
	}

	render () {
		const { timeSlots, plugin, currentPPI } = this.props;
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
				onPause={this.onPause}
				onError={this.onError}
				onMetadataArrived={this.onMetadataArrived}

				progressbar={
					<Timebar
						ref={bar => this.timebar = bar}
						current={currentTimestamp}
						timeSlots={timeSlots}

						onStartDrag={this.onTimebarStartDarg}
						onMoveDrag={this.onTimebarMoveDarg}
						onStopDrag={this.onTimebarStopDrag}

						onTimeChange={this.onTimeChange}
					/>
				}
			/>
		);
	}
}

export default LivePlayer;