import React from 'react';
// import PropTypes from 'prop-types';
import browser from 'browser-detect';

import styles from './ReVideo.less';

class ReVideojs extends React.Component{


	componentDidMount() {
		const { getVideojsPlayer, onPlay, onCanPlay, onCanplayThrough, onPause, onError, onEnd, onTimeUpdate, onMetadataArrived } = this.props;

		const { videojs } = window;
		videojs.options.flash.swf = '/swf/video-js.swf';

		const currentbrowser = browser();
		const techOrder = (currentbrowser.name === 'ie') ? [ 'flash', 'html5' ] : [ 'flvjs', 'flash', 'html5' ];

		const player = videojs(this.videojsPlayer, {
			techOrder,
			preload: 'auto',
			autoplay: false,
			aspectRatio: '4:3',
			fluid: false,
			loop: false,
			controls : false,
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
				}
			}
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
				console.log('revideo canplay');
				player.play();
				onCanPlay(player);
			});

			player.on('canplaythrough', () => {
				console.log('revideo canplaythrough');
				onCanplayThrough(player);
			});

			player.on('pause', () => {
				onPause(player);
			});

			player.on('error', () => {
				// console.log('error', e);
				onError(player);
			});

			player.on('ended', () => {
				// console.log('end: ', e);
				onEnd(player);
			});

			console.log('techName: ', player.techName_);

			if (player.techName_ === 'Flvjs') {
				player.tech_.on('metadata_arrived', (e, data) => {
					console.log('metadata_arrived', e, data);
					onMetadataArrived(data);
				});

				player.tech_.on('scriptdata_arrived', (e, data) => {
					console.log('SCRIPTDATA_ARRIVED', e, data);
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

			};
		});

		getVideojsPlayer(player);
		this.player = player;
	}

	componentWillUnmount() {
		try{
		if (this.player) {
			this.player.dispose();
		}
		}catch(e){
			console.log(e);
		}
	}

	render() {
		const { fullScreen, pixelRatio } = this.props;

		// console.log(pixelRatio);
		const p = pixelRatio.split(':');
		let isWide = false;
		if (p[0]/p[1] > 4/3){
			// 宽
			isWide = true;
		}
		return (
			<div className={`${ styles['video-player-container'] } ${ fullScreen ? styles['full-screen'] : '' }`}>
				<video className={isWide ? styles.wide : styles.high} crossOrigin='anonymous' ref={(player) => this.videojsPlayer = player}>
					<track kind='captions' />
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