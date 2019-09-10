import React from 'react';
import moment from 'moment';
import { formatMessage } from 'umi/locale';
import browser from 'browser-detect';

import ReVideo from './ReVideo';

import styles from './VideoPlayer.less';

class VideoPlayer extends React.Component {
	static defaultProps = {
		currentPPI: 1080,
		playBtnDisabled: false,
		showDatePicker: false,
		canPPIChange: false,
		showBackToLive: false,
		current: moment().unix(),
	};

	constructor(props) {
		super(props);

		this.state = {
			noMedia: false,
			fullScreen: false,
		};

		this.ppis = [
			{
				name: formatMessage({ id: 'videoPlayer.fullHighDefinition' }),
				value: '1080',
			},
			{
				name: formatMessage({ id: 'videoPlayer.highDefinition' }),
				value: '720',
			},
		];
	}

	componentDidMount = () => {
		window.addEventListener('resize', this.fullScreenChangeHandler);

		const { player } = this;
		if (player) {
			if (this.getTechName() === 'flvjs') {
				player.tech_.on('metadata_arrived', (e, data) => {
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
	};

	src = src => {
		const { player } = this;
		player.pause();

		this.showLoadingSpinner();

		player.src({
			src,
			type: 'video/flv',
		});

		player.load();

		this.removeNoMediaCover();
	};

	play = () => {
		const { player } = this;
		if (player) {
			console.log('paused: ', player.paused());
			player.play();
		}
	};

	pause = () => {
		const { player } = this;
		if (player) {
			player.pause();
		}
	};

	paused = () => {
		const { player } = this;
		if (player) {
			return player.paused();
		}
		return false;
	};

	setCurrentTime = time => {
		const { player } = this;
		if (player) {
			player.currentTime(time);
		}
	};

	showLoadingSpinner = () => {
		const { player } = this;

		if (player) {
			player.addClass('vjs-waiting');
			player.loadingSpinner.show();
		}
	};

	getTechName = () => {
		const { player } = this;
		return player.techName_;
	};

	onPlay = () => {
	};

	onCanPlay = () => {
		console.log('org onCanPlay');
	};

	onCanplayThrough = () => {
		console.log('org onCanplayThrough');
	};

	onPause = () => {
		console.log('org onPause');
	};

	onEnd = () => {
	};

	onError = () => {
		console.log('org onError');
	};

	onMetadataArrived = () => {
		console.log('org onMetadataArrived');
	};

	onTimeUpdate = () => {
		console.log('org onTimeUpdate');
	};

	canScreenShot = () => {
		const { player } = this;
		const currentBrowser = browser();
		return (
			player.techName_ !== 'Flash' &&
			currentBrowser.name !== 'safari' &&
			currentBrowser.name !== 'edge'
		);
	};

	showNoMediaCover = () => {
		this.setState({
			noMedia: true,
		});
	};

	removeNoMediaCover = () => {
		this.setState({
			noMedia: false,
		});
	};

	generateDuration = () => {
		const { player } = this;
		if (player) {
			let duration = player.duration();
			// console.log('generateDuration: ', duration);
			if (Number.isNaN(duration) || !Number.isFinite(duration)) {
				duration = 0;
			}
			return duration;
		}
		return 0;
	};

	render() {
		const {
			pixelRatio,
			isLive,
			onTimeUpdate,
			onMetadataArrived,
			onError,
			onPause,
			onEnd,
			onCanPlay,
			onCanplayThrough,
			plugin,
		} = this.props;

		const {
			fullScreen,
			noMedia,
		} = this.state;

		const { player } = this;

		return (
			<div
				className={`${styles['video-player']} ${fullScreen ? styles.fullscreen : ''}`}
				ref={container => (this.container = container)}
			>
				<div className={styles['video-container']}>
					<ReVideo
						getVideojsPlayer={vjs => (this.player = vjs)}
						pixelRatio={pixelRatio}
						fullScreen={fullScreen}
						onPlay={this.onPlay}
						onCanPlay={onCanPlay || this.onCanPlay}
						onCanplayThrough={onCanplayThrough || this.onCanplayThrough}
						onPause={onPause || this.onPause}
						onEnd={onEnd || this.onEnd}
						onError={onError || this.onError}
						onMetadataArrived={onMetadataArrived || this.onMetadataArrived}
						onTimeUpdate={onTimeUpdate || this.onTimeUpdate}
					/>

					<div
						style={{
							display: noMedia ? 'block' : 'none',
						}}
						className={styles['no-media']}
					>
						<div className={styles.content}>
							<span className={styles.icon} />
							<span>{formatMessage({ id: 'videoPlayer.noMedia' })}</span>
						</div>
					</div>

					{player && player.techName_ === 'Flvjs' ? (
						<div className={styles['plugin-container']}>{isLive ? plugin : ''}</div>
					) : (
						''
					)}
				</div>
			</div>
		);
	}
}

export default VideoPlayer;
