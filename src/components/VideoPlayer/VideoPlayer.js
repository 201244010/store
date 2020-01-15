import React from 'react';
import moment from 'moment';
import { formatMessage } from 'umi/locale';
import { Button } from  'antd';
import browser from 'browser-detect';

import ReVideo from './ReVideo';
import Toolbar from './Toolbar';
import DetailBoard from './DetailBoard';

import styles from './VideoPlayer.less';

class VideoPlayer extends React.Component{
	static defaultProps = {
		currentPPI: 1080,
		playBtnDisabled: false,
		showDatePicker: false,
		canPPIChange: false,
		showBackToLive: false,
		pixelRatio: '16:9',
		current: moment().unix()
	}

	constructor(props) {
		super(props);

		this.state = {
			noMedia: false,

			// playBtnDisabled: false,
			// canPPIChange: false,
			// showBackToLive: false,
			// showDatePicker: false,

			canScreenShot: true,

			fullScreen: false,

			volume: 0,
			maxVolume: props.maxVolume || 100,
		};

		this.ppis = [
			{
				name: formatMessage({ id: 'videoPlayer.fullHighDefinition' }),
				value: '1080'
			}, {
				name: formatMessage({ id: 'videoPlayer.highDefinition' }),
				value: '720'
			}
		];

	}

	componentDidMount = () => {
		// const { url } = this.props;
		this.setState({
			canScreenShot: this.canScreenShot()
		});

		window.addEventListener('resize', this.fullScreenChangeHandler);


		const { player } = this;
		if (player) {
			if (this.getTechName() === 'flvjs') {
				player.tech_.on('metadata_arrived', (e, data) => {
					// console.log('metadata_arrived', e, data);
					this.onMetadataArrived(data);
				});

				player.tech_.on('error', (e, data) => {
					console.log('error: ', e, data);
					player.load();
				});

				player.tech_.on('other_error', (e, data) => {
					console.log('OTHER_ERROR: ', e, data);
					player.load();
				});

				player.tech_.on('network_error', (e, data) => {
					console.log('NETWORK_ERROR: ', e, data);
					player.load();
				});

				player.tech_.on('network_exception', (e, data) => {
					console.log('NETWORK_EXCEPTION: ', e, data);
					player.load();
				});

				player.tech_.on('network_unrecoverable_early_eof', (e, data) => {
					console.log('NETWORK_UNRECOVERABLE_EARLY_EOF: ', e, data);
					player.load();
				});
			}
		}
	}

	src = (src) => {
		const { player } = this;
		player.pause();

		this.showLoadingSpinner();

		player.src({
			src,
			type: 'video/flv'
		});

		player.load();

		this.removeNoMediaCover();

		this.setState({
			playing: true
		});
	}

	play = () => {
		const { player } = this;
		if (player) {
			console.log('paused: ', player.paused());
			player.play();

			this.setState({
				playing: true
			});
		}
	}

	pause = () => {
		const { player } = this;
		if (player) {
			player.pause();

			this.setState({
				playing: false
			});
		}
	}

	paused = () => {
		const { player } = this;
		if (player) {
			return player.paused();
		}
		return false;
	}

	setCurrentTime = (time) => {
		const {player} = this;
		if (player) {
			player.currentTime(time);
		}
	}

	showLoadingSpinner = () => {
		const { player } = this;

		if (player) {
			player.addClass('vjs-waiting');
			if(player.loadingSpinner) {
				player.loadingSpinner.show();
			}
		}
	}

	getTechName = () => {
		const { player } = this;
		return player.techName_;
	}

	onPlay = () => {
		this.setState({
			playing: true,
			canScreenShot: this.canScreenShot()
		});
	}

	onCanPlay = () => {
		console.log('org onCanPlay');
	}

	onCanplayThrough = () => {
		console.log('org onCanplayThrough');
	}

	onPause = () => {
		console.log('org onPause');
	}

	onEnd = () => {
		this.setState({
			playing: false
		});
	}

	onError = () => {
		console.log('org onError');
	}

	onMetadataArrived = () => {
		console.log('org onMetadataArrived');
	}

	onTimeUpdate = () => {
		console.log('org onTimeUpdate');
	}

	mute = () => {
		const { player } = this;
		const { maxVolume } = this.state;

		const muted = player.muted();
		player.muted(!muted);

		this.setState({
			volume: !muted ? 0 : player.volume()*maxVolume
		});
	}

	changeVolume = (volume) => {
		const { player } = this;
		const { maxVolume } = this.state;

		player.volume(volume/maxVolume);

		this.setState({
			volume
		});

		if (volume > 0) {
			player.muted(false);
		};
	}

	fullScreenHandler = () => {
		const { fullScreen } = this.state;

		if (fullScreen){
			this.exitFullScreen();
		}else{
			this.requestFullScreen();
		}
	}

	requestFullScreen = () => {
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

	exitFullScreen = () => {
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
	}

	dateChange = () => {
		console.log('org dateChange');
	}

	backToLive = () => {
		console.log('org backToLive');
	}

	ppiChange = () => {
		console.log('org ppiChange');
	}

	screenShot = () => {
		const { player } = this;
		const video = player.el_.firstChild;
		console.log(video);
		const { pixelRatio, currentPPI: ppi } = this.props;
		console.log(pixelRatio, ppi);
		const pr = pixelRatio.split(':').map(item => parseInt(item, 10));

		const canvas = document.createElement('canvas');

		const height = ppi;
		// 只给720p的图，否则内存不够导致下载失败；
		const width = parseInt(height/pr[1]*pr[0], 10);

		canvas.width = width;
		canvas.height = height;
		console.log(width, height);

		canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
		const base64 = canvas.toDataURL('image/jpeg');
		console.log(base64);
		const image = new Image();
		image.setAttribute('crossOrigin', 'anonymous');
		image.addEventListener('load', () => {
			console.log('load');
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

	canScreenShot = () => {
		const { player } = this;
		const currentBrowser = browser();
		return player.techName_ !== 'Flash' && currentBrowser.name !== 'safari' && currentBrowser.name !== 'edge';
	}

	showNoMediaCover = () => {
		this.setState({
			noMedia: true
		});
	}

	removeNoMediaCover = () => {
		this.setState({
			noMedia: false
		});
	}

	generateDuration = () => {
		const { player } = this;
		if (player){
			let duration = player.duration();
			// console.log('generateDuration: ', duration);
			if (Number.isNaN(duration) || !Number.isFinite(duration)){
				duration = 0;
			}
			return duration;
		}
		return 0;
	}

	render() {
		const { pixelRatio, currentPPI, ppiChanged, progressbar, isLive,
			onTimeUpdate, onMetadataArrived, onPlay, onError, onPause, onEnd, onCanPlay, onCanplayThrough, onDateChange, playHandler,
			playBtnDisabled, showDatePicker, canPPIChange, showBackToLive, ppiChange, backToLive,
			current, plugin, isOnline, cloudStatus, navigateTo, sn, fullScreenFlagShow,
			detailVisible, paymentInfo = {}
		} = this.props;

		const { playing, fullScreen, noMedia, volume,
			// playBtnDisabled, showDatePicker, canPPIChange, showBackToLive,
			maxVolume, canScreenShot
		} = this.state;

		// const { totalPrice, details, orderTime, paymentMethod } = paymentInfo;

		const { player } = this;

		return (
			<div className={`${styles['video-player']} ${fullScreen ? styles.fullscreen : ''}`} ref={(container) => this.container = container}>
				<div className={styles['video-container']}>
					<ReVideo
						getVideojsPlayer={(vjs) => this.player = vjs}

						pixelRatio={pixelRatio}

						fullScreen={fullScreen}

						onPlay={onPlay || this.onPlay}
						onCanPlay={onCanPlay || this.onCanPlay}
						onCanplayThrough={onCanplayThrough || this.onCanplayThrough}
						onPause={onPause || this.onPause}
						onEnd={onEnd || this.onEnd}
						onError={onError || this.onError}
						onMetadataArrived={onMetadataArrived || this.onMetadataArrived}
						onTimeUpdate={onTimeUpdate || this.onTimeUpdate}
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


					{
						player && player.techName_ === 'Flvjs' ?
							<div className={styles['plugin-container']}>
								{  isOnline && isLive ? plugin : '' }
							</div>
							: ''
					}

					<div
						style={
							{
								display: !isOnline && !noMedia && isLive ? 'block': 'none'
							}
						}
						className={styles['no-media']}
					>
						<div className={styles.content}>
							<span className={styles.icon} />
							{
								cloudStatus === 'closed' ?
									<div>
										<span>{ formatMessage({ id: 'videoPlayer.noCloudService' }) }</span>
										<Button type='primary' className={styles['cloud-btn']} onClick={() => { navigateTo('cloudStorage',{ sn, type: 'subscribe' });}}>
											{ formatMessage({ id: 'videoPlayer.subCloud' })}
										</Button>
									</div>
									:<span>{ formatMessage({ id: 'videoPlayer.noPlay'}) }</span>
							}
						</div>
					</div>

					{
						detailVisible ?
							<DetailBoard paymentInfo={paymentInfo} pixelRatio={pixelRatio} />
							: ''
					}
				</div>

				<div className={styles['toolbar-container']}>
					<Toolbar
						play={playHandler || this.playHandler}

						playing={playing}
						playBtnDisabled={playBtnDisabled}
						isLive={isLive}

						ppis={this.ppis}
						currentPPI={currentPPI}
						volume={volume}
						maxVolume={maxVolume}

						mute={this.mute}
						changeVolume={this.changeVolume}

						screenShot={this.screenShot}
						canScreenShot={canScreenShot}

						fullScreen={this.fullScreenHandler}
						fullScreenStatus={fullScreen}

						today={current}

						canPPIChange={canPPIChange}
						ppiChange={ppiChange || this.ppiChange}
						ppiChanged={ppiChanged}

						showDatePicker={showDatePicker}
						onDatePickerChange={onDateChange || this.dateChange}

						showBackToLive={showBackToLive}
						backToLive={backToLive || this.backToLive}

						isOnline={isOnline}
						cloudStatus={cloudStatus}

						fullScreenFlagShow={fullScreenFlagShow}

						progressbar={
							progressbar
						}
					/>
				</div>
			</div>
		);
	}
}

export default VideoPlayer;