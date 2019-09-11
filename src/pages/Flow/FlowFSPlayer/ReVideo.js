import React from 'react';
// import PropTypes from 'prop-types';
import browser from 'browser-detect';

import styles from './ReVideo.less';

class ReVideojs extends React.Component {
	componentDidMount() {
		const {
			getVideojsPlayer,
			onPlay,
			onCanPlay,
			onCanplayThrough,
			onPause,
			onError,
			onEnd,
			onTimeUpdate,
			onMetadataArrived,
		} = this.props;

		const { videojs } = window;
		videojs.options.flash.swf = '/swf/video-js.swf';

		const currentbrowser = browser();
		const techOrder =
			currentbrowser.name === 'ie' ? ['flash', 'html5'] : ['flvjs', 'flash', 'html5'];

		const player = videojs(this.videojsPlayer, {
			techOrder,
			preload: 'auto',
			autoplay: false,
			aspectRatio: '4:3',
			fluid: false,
			loop: false,
			controls: false,
			language: 'cn',
			flvjs: {
				mediaDataSource: {
					type: 'flv',
					cors: true,
				},
				config: {
					autoCleanupSourceBuffer: true,
					enableStashBuffer: false,
					isLive: true,
					// enableWorker: true,
				},
			},
		});

		player.ready(() => {
			player.muted(true);

			player.on('timeupdate', () => {
				onTimeUpdate(player.currentTime());
			});

			player.on('play', () => {
				onPlay(player);
			});

			player.on('canplay', () => {
				player.play();
				onCanPlay(player);
			});

			player.on('canplaythrough', () => {
				onCanplayThrough(player);
			});

			player.on('pause', () => {
				onPause(player);
			});

			player.on('error', () => {
				onError(player);
			});

			player.on('ended', () => {
				onEnd(player);
			});

			if (player.techName_ === 'Flvjs') {
				player.tech_.on('metadata_arrived', (e, data) => {
					onMetadataArrived(data);
				});

				player.tech_.on('scriptdata_arrived', () => {});

				player.tech_.on('error', () => {
					player.load();
				});

				player.tech_.on('other_error', () => {
					player.load();
				});

				player.tech_.on('network_error', () => {
					player.load();
				});

				player.tech_.on('network_exception', () => {
					player.load();
				});

				player.tech_.on('network_unrecoverable_early_eof', () => {
					player.load();
				});
			}
		});

		getVideojsPlayer(player);
		this.player = player;
	}

	componentWillUnmount() {
		try {
			if (this.player) {
				this.player.dispose();
			}
		} catch (e) {
			console.log(e);
		}
	}

	render() {
		const { fullScreen, pixelRatio } = this.props;
		const p = pixelRatio.split(':');
		let isWide = false;
		if (p[0] / p[1] > 4 / 3) {
			// 宽
			isWide = true;
		}
		return (
			<div
				className={`${styles['video-player-container']} ${
					fullScreen ? styles['full-screen'] : ''
				}`}
			>
				<video
					className={isWide ? styles.wide : styles.high}
					crossOrigin="anonymous"
					ref={player => (this.videojsPlayer = player)}
				>
					<track kind="captions" />
				</video>
			</div>
		);
	}
}

// ReVideojs.propTypes = {
// 	getVideojsPlayer: PropTypes.func.isRequired,
// 	onPlay: PropTypes.func,
// 	onPause: PropTypes.func,
// 	onEnd: PropTypes.func,
// 	onError: PropTypes.func
// };

export default ReVideojs;
