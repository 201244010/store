import React from 'react';
// import PropTypes from 'prop-types';
import moment from 'moment';
import { formatMessage } from 'umi/locale';

import browser from 'browser-detect';

import ReVideo from './ReVideo';
import Toolbar from './Toolbar';
import Timebar from './Timebar';

import Faceid from './Faceid';

import Progressbar from './Progressbar';

import styles from './VideoPlayer.less';

class VideoPlayer extends React.Component{
	constructor(props){
		super(props);

		this.state = {
			volume: 0,
			currentTimestamp: moment().valueOf()/1000,
			// liveTimestamp: 0,
			noMedia: false,
			isLive: true,
			playing: false,

			maxVolume: props.maxVolume || 100,
			fullScreen: false,
			canScreenShot: false,

			ppis: [
				{
					name: formatMessage({ id: 'videoPlayer.fullHighDefinition' }),
					value: '1080'
				}, {
					name: formatMessage({ id: 'videoPlayer.highDefinition' }),
					value: '720'
				}
			]
		};

		this.interval = 0;
		this.dragTimeout = 0;

		// this.currentTimestamp = moment().valueOf()/1000;
		// this.liveTimestamp = 0;
		this.liveStartTime = 0;

		// 事件
		this.onPlay = this.onPlay.bind(this);
		this.onPause = this.onPause.bind(this);
		this.onError = this.onError.bind(this);
		this.onEnd = this.onEnd.bind(this);
		this.onTimeUpdate = this.onTimeUpdate.bind(this);


		// 方法
		this.updateUrl = this.updateUrl.bind(this);
		// this.updateSources = this.updateSources.bind(this);

		this.play = this.play.bind(this);
		this.playlive = this.playlive.bind(this);

		this.playTrackAtTimestamp = this.playTrackAtTimestamp.bind(this);
		this.playlistAtTimestamp = this.playlistAtTimestamp.bind(this);

		this.pause = this.pause.bind(this);
		// this.pauselist = this.pauselist.bind(this);
		this.pauseHistory = this.pauseHistory.bind(this);

		this.startClock = this.startClock.bind(this);
		this.stopClock = this.stopClock.bind(this);

		this.showNoMediaCover = this.showNoMediaCover.bind(this);
		this.removeNoMediaCover = this.removeNoMediaCover.bind(this);


		this.mute = this.mute.bind(this);
		this.changeVolume = this.changeVolume.bind(this);

		this.requestFullScreen = this.requestFullScreen.bind(this);
		this.fullScreenChangeHandler = this.fullScreenChangeHandler.bind(this);
		this.exitFullScreen = this.exitFullScreen.bind(this);


		this.canScreenShot = this.canScreenShot.bind(this);
		this.screenShot = this.screenShot.bind(this);



		this.ppiChange = this.ppiChange.bind(this);
		this.dateChange = this.dateChange.bind(this);

	}

	componentDidMount() {
		const { url, type } = this.props;

		this.setState({
			canScreenShot: this.canScreenShot(),
			currentTimestamp: type === 'track' ? 0 : moment().valueOf()/1000
		});



		window.addEventListener('resize', this.fullScreenChangeHandler);

		// let { sources } = this.props;

		// sources = sources || [];

		if ( url && this.player ) {
			this.updateUrl(url);
			// this.updateSources(sources);
		}
		// console.log('componentDidMount');
	}

	componentDidUpdate(oldProps) {
		// const { url, type } = this.props;
		// const sources = this.props.sources || [];
		// console.log('video player updated.');
		// if (type === 'track'){
		// 	if (url && oldProps.url !== url){
		// 		this.playUrl(url);
		// 	}
		// }else{
		// 	if (url && oldProps.url !== url){
		// 		//直播路径更新，则重新直播
		// 		this.playlive();
		// 	};

		// 	if (sources !== oldProps.sources){
		// 		//更新sources
		// 		this.updateSources(sources);
		// 		sources.sort((a, b) => {
		// 			return a.timeStart - b.timeStart;
		// 		});

		// 		this.list = sources.map((item) => {
		// 			return {
		// 				sources: [{
		// 					src: item.url,
		// 					type: 'video/flv'
		// 				}]
		// 			};
		// 		});
		// 	}
		// }

		// let { sources } = this.props;
		const { url } = this.props;
		// sources = sources || [];
		// console.log('did update:', url, oldProps.url);
		if (url && oldProps.url !== url) {
			this.updateUrl(url);
		}
		// if (1) {
		// this.updateSources(sources);
		// }
	}

	// shouldComponentUpdate(newProps, newState) {
	// 	// console.log(newProps, newState);
	// 	const { type, url } = this.props;
	// 	const { noMedia, isLive, playing } = this.state;
	// 	let flag = false;

	// 	if (!url || noMedia !== newState.noMedia || isLive !== newState.isLive || playing !== newState.playing){
	// 		flag = true;
	// 	};

	// 	return flag;
	// }

	componentWillUnmount() {
		this.stopClock();
	}


	// 时间响应
	onTimeUpdate(timestamp) {
		const { type } = this.props;
		if (type === 'track') {
			this.setState({
				currentTimestamp: timestamp
			});
		}
	}

	onPlay() {
		this.setState({
			playing: true
		});
	}

	onPause() {
		this.setState({
			playing: false
		});
	}

	onError() {
		this.setState({
			playing: false
		});
	}

	onEnd() {
		const { type } = this.props;
		console.log(type, 'End Handler.');
	}
	// onEnd(player) {
	// 	const { sources, type } = this.props;
	// 	// const player = this.vjs;
	// 	if (type === 'track'){
	// 		// track模式下，播放结束不作动作；
	// 		return;
	// 	}

	// 	const currentIndex = player.playlist.currentIndex();
	// 	const lastIndex = player.playlist.lastIndex();

	// 	// console.log('onEnd: ', currentIndex, lastIndex);
	// 	const { currentTimestamp } = this.state;
	// 	// const currentTimestamp = this.currentTimestamp;

	// 	if (currentIndex === lastIndex){
	// 		// 当前是最后一个视频
	// 		// console.log('last: ', moment().valueOf()/1000, currentTimestamp, moment().valueOf()/1000 - currentTimestamp);
	// 		if ( moment().valueOf()/1000 - currentTimestamp <= 60) {
	// 			// 60s 内认为可以连续播放，转直播
	// 			this.playlive();
	// 		}else{
	// 			// 还不到当前时间
	// 			this.showNoMediaCover();
	// 		}
	// 	}else{
	// 		// 当前不是最后一个视频
	// 		const nextIndex = player.playlist.nextIndex();
	// 		const nextSource = sources[nextIndex];
	// 		// console.log(nextIndex, currentTimestamp, nextSource.timeStart);
	// 		if (currentTimestamp < nextSource.timeStart){
	// 			// 还未到下一段视频点
	// 			this.showNoMediaCover();
	// 		}else{
	// 			player.playlist.next();
	// 		}
	// 	}
	// }

	onToolbarPlay = () => {
		const { type } = this.props;
		const { playing, isLive, currentTimestamp } = this.state;
		if (type === 'track'){
			// playing ? this.pause() : this.play();
			if (playing) {
				this.pause();
			}else{
				this.play();
			}
		}else{
			if (isLive) {
				// 直播时禁用播放暂停按钮
				return;
			}
			// playing ? this.pauselist() : this.playlistAtTimestamp(currentTimestamp);
			if (playing) {
				// this.pauselist();
				this.pauseHistory();
			}else{
				this.playlistAtTimestamp(currentTimestamp);
			}
		}

	}

	onTimebarStartDarg = () => {
		const { stopHistoryPlay } = this.props;
		const { playing } = this.state;

		this.stopClock();
		clearTimeout(this.dragTimeout);

		// console.log('playing: ', playing);

		if (playing) {
			stopHistoryPlay();
		}

	}

	onTimebarMoveDarg = () => {
		this.stopClock();
		clearTimeout(this.dragTimeout);
	}

	onTimebarStopDrag = (timestamp) => {
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
			this.playlistAtTimestamp(timestamp);
		}, 1.2*1000);
	}

	setCurrentTime(time) {
		const {player} = this;
		// console.log(player);
		if (player) {
			player.currentTime(time);
		}
	}

	// generateCurrent = () => {
	// 	console.log('generateCurrent');
	// 	const { player } = this;
	// 	if (player){
	// 		// console.log(this.player.currentTime());
	// 		return player.currentTime();
	// 	}
	// 	return 0;
	// }

	generateDuration = () => {
		const { player } = this;
		if (player){
			let duration = player.duration();
			console.log('generateDuration: ', duration);
			if (Number.isNaN(duration) || !Number.isFinite(duration)){
				duration = 0;
			}
			return duration;
		}
		return 0;
	}

	backToLive = () => {
		const { stopHistoryPlay } = this.props;
		const { player } = this;

		stopHistoryPlay();
		this.playlive();

		if (player) {
			setTimeout(() => {
				player.play();
			}, 0);
		}
	}

	startClock = () => {
		clearInterval(this.interval);

		this.interval = setInterval(() => {
			const { playing, isLive, currentTimestamp } = this.state;
			const { type } = this.props;

			this.setState({
				currentTimestamp: currentTimestamp + 1,
				playing: true
			});

			// console.log('playing: ', playing, 'isLive: ', isLive, 'type: ', type);

			if (playing && !isLive && type === 'time') {
				this.onPlayingHistory();
			};

			// this.currentTimestamp = this.currentTimestamp + 1;
			// console.log(moment.unix(currentTimestamp).format('YYYY-MM-DD HH:mm:ss'));

			// 如果当前不再播放，则需要判断是否开始播放下一秒
			// if (!playing){
			// 	this.playlistAtTimestamp(currentTimestamp);
			// }
		}, 1000);
	}

	isInsideSlots = (timestamp) => {
		// const { currentTimestamp : timestamp } = this.state;
		console.log('currentTimestamp: ', timestamp);
		// 判断当前的时间位置
		const { timeSlots } = this.props;

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
		console.log('isInside: ', isInside);
		if (isInside) {
			return true;
		};
		console.log('nextTimeStart: ', nextTimeStart);
		return nextTimeStart;
	}

	onPlayingHistory = async () => {
		const { currentTimestamp : timestamp } = this.state;

		const isInside = this.isInsideSlots(timestamp);
		// console.log('onPlayingHistory isInside: ', isInside);
		if (isInside !== true) {
			// 当前的位置不在有视频的区域了
			if (isInside === timestamp) {
				// todo 后面就是直播数据了 需要优化的点：结束后需要重新去拉取时间
				this.playlive();
			}else{
				// 后面还有回放
				this.setState({
					currentTimestamp: isInside
				});
			}
		}
	}

	stopClock = () => {
		clearInterval(this.interval);
	}

	play = () => {
		const {player} = this;
		// console.log(player);
		if (player.paused()){
			player.play();
		}
	}

	playUrl = (url) => {
		// console.log('playUrl');
		const {player} = this;
		player.pause();

		player.playlist([{
			sources: [{
				src: url,
				type: 'video/flv'
			}]
		}]);

		player.playlist.last();

		this.play();
		player.on('canplay', () => {
			this.play();
		});

		player.on('play', () => {
			this.setState({
				canScreenShot: this.canScreenShot()
			});
		});

		this.removeNoMediaCover();
	}

	playlive() {
		const { url } = this.props;
		// console.log('playlive: ', url);
		if (!url) {
			return;
		}
		const { player } = this;

		if (!player) {
			return;
		}
		player.pause();

		player.playlist([{
			sources: [{
				src: url,
				type: 'video/flv'
			}]
		}]);

		this.setState({
			currentTimestamp: moment().valueOf()/1000,
			isLive: true
		});

		player.playlist.last();

		this.play();
		player.on('canplay', () => {
			// 解决页面刷新后会重新播放声音的问题，这个问题可能需要详细看一下；
			const { volume } = this.state;
			if (volume === 0) {
				player.muted(true);
			}
			this.play();
		});

		player.on('play', () => {
			const stamp = moment().valueOf()/1000;
			this.setState({
				// liveTimestamp: stamp,
				canScreenShot: this.canScreenShot()
			});

			this.liveStartTime = stamp;
		});

		this.removeNoMediaCover();
		this.startClock();
	}

	playTrackAtTimestamp(timestamp){
		// 播放片段时，移动到特定时间点
		this.setState({
			currentTimestamp: timestamp,
			isLive: false
		});
		// this.currentTimestamp = timestamp;

		// this.startClock();
		this.removeNoMediaCover();

		const { player } = this;
		player.currentTime(timestamp);
	}

	async playlistAtTimestamp(timestamp) {
		const { stopHistoryPlay } = this.props;
		console.log('timestamp', timestamp, moment.unix(timestamp).format('YYYY-MM-DD HH:mm:ss'));

		if (moment().valueOf()/1000 - timestamp <= 60 ){
			// 拖到了直播
			console.log('goto playlive.');
			this.playlive();
			stopHistoryPlay();
		}else{
			const { getHistoryUrl } = this.props;

			const isInside = this.isInsideSlots(timestamp);

			if (isInside === true) {
				// 拖动到了有值的区域，则播放回放
				const url = await getHistoryUrl(timestamp);
				console.log('goto playhistory url: ', url);

				this.playUrl(url);
				this.startClock();

				// 光标定位到当前回放位置，将状态调整我未非直播状态；
				this.setState({
					isLive: false,
					currentTimestamp: timestamp
				});
			}
			// 下面情况均为选中有值区域
			else if (isInside === timestamp) {
				// 选取的时间点比所有时间段都晚，说明下一段是直播
				console.log('goto playlive. because no next video.');
				this.playlive();
				stopHistoryPlay();
			}else{
				// 拖动到了无值的区域，则跳转到下个时间点；
				console.log('goto next time. nextTimeStart:', isInside);
				this.playlistAtTimestamp(isInside);
			}

		}
	}

	pause() {
		// console.log(this);
		const {player} = this;
		// console.log(player);
		if (!player.paused()){
			player.pause();
		}
	}

	// pauselist() {
	// 	// todo 暂停和重播功能需要改动；
	// 	// 暂停自定义回看时候的;
	// 	this.stopClock();
	// 	this.pause();

	// 	this.setState({
	// 		playing: false
	// 	});
	// }
	pauseHistory () {
		const { stopHistoryPlay } = this.props;

		this.stopClock();
		this.pause();

		this.setState({
			playing: false
		});

		stopHistoryPlay();
	}

	showNoMediaCover(){
		this.setState({
			noMedia: true,
			playing: false
		});
	}

	removeNoMediaCover(){
		this.setState({
			noMedia: false
		});
	}

	mute() {
		const {player} = this;
		const { maxVolume } = this.state;

		const muted = player.muted();
		player.muted(!muted);

		this.setState({
			volume: !muted ? 0 : player.volume()*maxVolume
		});
	}

	changeVolume(volume) {
		const {player} = this;
		const { maxVolume } = this.state;

		player.volume(volume/maxVolume);

		this.setState({
			volume
		});

		if (volume > 0) {
			player.muted(false);
		};
	}


	requestFullScreen(){
		const element = this.container;
		const method = element.requestFullScreen ||
			element.webkitRequestFullScreen ||
			element.mozRequestFullScreen ||
			element.msRequestFullScreen;

		if (method){
			method.call(element);
		}else if (typeof window.ActiveXObject !== 'undefined'){
			const wscript = new window.ActiveXObject('WScript.Shell');
			if (wscript !== null) {
				wscript.SendKeys('{F11}');
			}
		}

		this.setState({
			fullScreen: true
		});
	}

	fullScreenChangeHandler () {
		let isFullscreen = document.webkitIsFullScreen || window.fullScreen || document.msFullscreenEnabled; // document.fullscreenEnabled
		// console.log(document.fullscreenEnabled, document.webkitIsFullScreen, window.fullScreen, document.msFullscreenEnabled);
		if(isFullscreen === undefined){
			isFullscreen = false;
		}

		if (!isFullscreen && browser().name !== 'safari'){
			this.setState({
				fullScreen: isFullscreen
			});
		}

		// 解决safari概率性全屏无法播放的情况，但是并不能完全解决这个问题；（修改库之后不会停止播放，带验证）
		// if (browser().name === 'safari'){
		// 	this.play();
		// }
	}

	exitFullScreen(){
		const method = document.cancelFullScreen ||
			document.webkitCancelFullScreen ||
			document.mozCancelFullScreen ||
			document.oCancelFullScreen ||
			document.msExitFullscreen ||
			document.exitFullScreen;

		if (method){
			method.call(document);
		}else if (typeof window.ActiveXObject !== 'undefined'){
			const wscript = new window.ActiveXObject('WScript.Shell');
			if (wscript !== null) {
				wscript.SendKeys('{F11}');
			}
		}

		this.setState({
			fullScreen: false
		});

		// window.addEventListener('resize', this.fullScreenHandler);
	}

	screenShot() {
		// console.log('screen 1');
		const {player} = this;
		const video = player.el_.firstChild;
		// console.log(video);
		const { pixelRatio, currentPPI: ppi } = this.props;
		const pr = pixelRatio.split(':').map(item => parseInt(item, 10));

		const canvas = document.createElement('canvas');

		// console.log(currentPPI, currentPPI === 1080);
		// let height = 720;
		// switch(currentPPI) {
		// 	case 1080:
		// 	default:
		// 		height = 800;
		// 		break;
		// 	case 720:
		// 		height = 640;
		// 		break;
		// }
		// console.log(height);
		// const height = 720;
		const height = ppi;
		// 只给720p的图，否则内存不够导致下载失败；
		const width = parseInt(height/pr[1]*pr[0], 10);

		canvas.width = width;
		canvas.height = height;

		canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
		const base64 = canvas.toDataURL('image/jpeg');

		// const currentPPI = parseInt(ppi, 10);
		// const ppiWidth = parseInt(currentPPI/pr[1]*pr[0], 10);

		// // 实际按照ipc的ppi尺寸输出图片；
		// const canvasOutput = document.createElement('canvas');
		// canvasOutput.width = ppiWidth;
		// canvasOutput.height = currentPPI;

		// canvasOutput.getContext('2d').drawImage(canvas, 0, 0, ppiWidth, currentPPI);
		// const base64 = canvasOutput.toDataURL('image/jpeg');

		const image = new Image();
		image.setAttribute('crossOrigin', 'anonymous');
		image.addEventListener('load', () => {
			const a = document.createElement('a');
			const ts = moment().format('YYYY-MM-DD_HH-mm-ss');

			a.download = `screenshot_${ts}.jpg`;
			a.href = base64;

			const event = document.createEvent('MouseEvents');
			event.initEvent('click', true, true);
			a.dispatchEvent(event);

		});
		image.src = base64;

	}

	canScreenShot() {
		const {player} = this;
		const currentBrowser = browser();
		return player.techName_ !== 'Flash' && currentBrowser.name !== 'safari' && currentBrowser.name !== 'edge';
	}

	ppiChange(ppi) {
		// const player = this.player;
		// console.log('change ppi', ppi);
		const { changePPI } = this.props;
		changePPI(ppi);
	}

	async dateChange(timestamp) {
		const { onTimeChange } = this.props;
		await onTimeChange(timestamp, moment().unix());
		this.onTimebarStopDrag(timestamp);
	}

	// updateSources(sources) {

	// 	sources.sort((a, b) => a.timeStart - b.timeStart);

	// 	this.list = sources.map((item) => ({
	// 		sources: [{
	// 			src: item.url,
	// 			type: 'video/flv'
	// 		}]
	// 	}));
	// }
	// 初始化后首次更新url
	updateUrl(url) {
		const { type } = this.props;
		if ( type === 'track') {
			this.playUrl(url);
		}else{
			this.playlive();
		}
	}



	render() {
		const { type, faceidRects, pixelRatio, currentPPI, ppiChanged, timeSlots, onTimeChange } = this.props;
		// let { sources } = this.props;
		// sources = sources || [];
		const { playing, isLive, ppis, noMedia, volume, maxVolume, fullScreen, canScreenShot, currentTimestamp } = this.state;

		// const currentTimestamp = this.currentTimestamp;

		// console.log(this.props, this.state);
		if (type !== 'track') {
			timeSlots.sort((a,b) => b.timeStart - a.timeStart);
		}

		console.log('render', currentTimestamp);

		return (
			<div className={`${styles['video-player']} ${fullScreen ? styles.fullscreen : ''}`} ref={(container) => this.container = container}>
				<div className={styles['video-container']}>
					<ReVideo
						getVideojsPlayer={(vjs) => this.player = vjs}
						// url={ url }

						pixelRatio={pixelRatio}

						fullScreen={fullScreen}

						onPlay={this.onPlay}
						onPause={this.onPause}
						onEnd={this.onEnd}
						onError={this.onError}
						onTimeUpdate={this.onTimeUpdate}
					/>

					<div
						style={
							{
								display: noMedia ? 'block': 'none'
							}
						}
						className={styles['no-media']}
					>
						<div className={styles.content}>
							<span className={styles.icon} />
							<span>{ formatMessage({ id: 'videoPlayer.noMedia'}) }</span>
						</div>
					</div>
				</div>


				<div className={styles['plugin-container']}>
					{
						(faceidRects && isLive) ?
							<Faceid
								// current={liveTimestamp}
								faceidRects={faceidRects}
								pixelRatio={pixelRatio}
								currentPPI={currentPPI}
							/>
							: ''
					}
				</div>



				<div className={styles['toolbar-container']}>
					<Toolbar
						play={this.onToolbarPlay}

						playing={playing}
						isLive={isLive && type !== 'track'}
						isTrack={type === 'track'}

						ppis={ppis}
						currentPPI={currentPPI}
						volume={volume}
						maxVolume={maxVolume}

						mute={this.mute}
						changeVolume={this.changeVolume}

						screenShot={this.screenShot}
						canScreenShot={canScreenShot}

						fullScreen={() => {
							if (fullScreen){
								this.exitFullScreen();
							}else{
								this.requestFullScreen();
							}
						}}

						today={currentTimestamp}

						fullScreenStatus={fullScreen}
						ppiChange={this.ppiChange}
						ppiChanged={ppiChanged}

						onDatePickerChange={this.dateChange}

						backToLive={this.backToLive}

						progressbar={

							type === 'track' ?
								<Progressbar
									current={currentTimestamp}
									duration={this.generateDuration()}
									onChange={this.playTrackAtTimestamp}
								/> :
								<Timebar
									timeSlots={timeSlots}
									// sources={sources}
									current={currentTimestamp}
									// noMedia={ this.state.noMedia }
									// onStartDrag={ () => {
									ref={bar => this.timebar = bar}
									// }}

									// onChange={(t) => {
									// 	console.log('here is onChange!');
									// 	this.setState({
									// 		currentTimestamp: t
									// 	});
									// }}
									onStartDrag={this.onTimebarStartDarg}
									onMoveDrag={this.onTimebarMoveDarg}
									onStopDrag={this.onTimebarStopDrag}

									onGenerateTimeRange={onTimeChange}
								/>
						}
					/>
				</div>
			</div>
		);
	}

};

// VideoPlayer.propTypes = {
// 	pixelRatio: PropTypes.string.isRequired,
// 	url: PropTypes.string.isRequired,
// 	sources: PropTypes.array,
// 	type: PropTypes.string.isRequired,	//播放器类型，track为播放片段，time为播放历史
// 	// plugin: PropTypes.element
// };

export default VideoPlayer;