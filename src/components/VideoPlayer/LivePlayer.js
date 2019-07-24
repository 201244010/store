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
			currentTimestamp: moment().unix()
		};

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

	pause = () => {
		const { videoplayer } = this;
		videoplayer.pause();
	}

	src = (src) => {
		const { videoplayer } = this;
		videoplayer.src(src);
	}

	playLive = async () => {
		this.showLoadingSpinner();

		const { getLiveUrl } = this.props;
		const url = await getLiveUrl();

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

		await pauseLive();
	}

	playHistory = async (timestamp) => {
		console.log('timestamp', timestamp, moment.unix(timestamp).format('YYYY-MM-DD HH:mm:ss'));

		if (moment().valueOf()/1000 - timestamp <= 60 ){
			// 拖到了直播
			console.log('goto playLive.');
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

				// 拖动到了有值的区域，则播放回放
				const url = await getHistoryUrl(timestamp);
				console.log('goto playhistory url: ', url);

				this.src(url);

				// 光标定位到当前回放位置，将状态调整我未非直播状态；
				this.setState({
					isLive: false,
					playBtnDisabled: this.getTechName() !== 'flvjs',
					currentTimestamp: timestamp
				});

				this.startTimestamp = timestamp;
				this.toPause = false;
			}
			// 下面情况均为选中有值区域
			else if (isInside === timestamp) {
				// 选取的时间点比所有时间段都晚，说明下一段是直播
				console.log('goto playLive. because no next video.');

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
		console.log('pauseHistory');
		const { stopHistoryPlay } = this.props;

		this.pause();
		await stopHistoryPlay();
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

	ppiChange = (ppi) => {
		const { changePPI } = this.props;
		changePPI(ppi);
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

		const { onTimeChange } = this.props;
		await onTimeChange(timestamp, moment().unix());

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

		this.pause();

		this.setState({
			currentTimestamp: timestamp
		});

		const { timeSlots } = this.props;
		const isInside = !timeSlots.every((slot) => {
			const { timeStart, timeEnd } = slot;
			// console.log('timestamp: ', timestamp, timeStart, timestamp < timeStart);
			if (timeStart <= timestamp && timestamp <= timeEnd ){
				return false;
			}
			return true;
		});

		if (!isInside) {
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

		if (this.toPause) {
			return;
		}

		this.setState({
			currentTimestamp: this.startTimestamp + timestamp
		});

		// console.log(this.startTimestamp + timestamp, moment.unix(this.startTimestamp + timestamp).format('YYYY-MM-DD HH:mm:ss'));

		getCurrentTimestamp(this.relativeTimestamp + timestamp*1000);
	}

	onMetadataArrived = (metadata) => {
		const { onMetadataArrived } = this.props;

		if (this.relativeTimestamp === 0) {
			this.relativeTimestamp = metadata.relativeTime;
		}

		onMetadataArrived(metadata.relativeTime);
	}

	render () {
		const { onTimeChange, timeSlots, plugin } = this.props;
		const { currentTimestamp, isLive, playBtnDisabled } = this.state;

		return (
			<VideoPlayer
				ref={videoplayer => this.videoplayer = videoplayer}
				{...this.props}

				current={currentTimestamp}

				playBtnDisabled={playBtnDisabled || isLive}
				showDatePicker
				canPPIChange

				isLive={isLive}
				plugin={plugin}

				showBackToLive={!isLive}
				backToLive={this.playLive}

				ppiChange={this.ppiChange}

				onDateChange={this.onDateChange}
				onTimeUpdate={this.onTimeUpdate}

				onMetadataArrived={this.onMetadataArrived}

				progressbar={
					<Timebar
						current={currentTimestamp}
						timeSlots={timeSlots}

						onStartDrag={this.onTimebarStartDarg}
						onMoveDrag={this.onTimebarMoveDarg}
						onStopDrag={this.onTimebarStopDrag}

						onGenerateTimeRange={onTimeChange}
					/>
				}
			/>
		);
	}
}

export default LivePlayer;