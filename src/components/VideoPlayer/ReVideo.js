import React from 'react';
// import PropTypes from 'prop-types';
import browser from 'browser-detect';

import styles from './ReVideo.less';

class ReVideojs extends React.Component{


	componentDidMount() {
		const { getVideojsPlayer, onPlay, onPause, onError, onEnd, onTimeUpdate } = this.props;

		const { videojs } = window;
		videojs.options.flash.swf = './swf/video-js.swf';
		const currentbrowser = browser();
		// console.log(currentbrowser);

		const techOrder = (currentbrowser.name === 'ie') ? [ 'flash', 'html5' ] : [ 'flvjs', 'flash', 'html5' ];
		const player = videojs(this.videojsPlayer, {
			techOrder,
			preload: 'auto',
			// autoplay: 'muted',
			aspectRatio: '4:3',
			fluid: false,
			loop: false,
			controls : false,
			language: 'cn',
			flvjs: {
				mediaDataSource: {
					type: 'flv',
					cors: true
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

			// player.loading();

			// console.log('revideo player: ', player, player.tech_, player.techName_);
			player.muted(true);

			// 测试是否可以监听到这个时间
			player.on('timeupdate', () => {
				onTimeUpdate(player.currentTime());
			});

			// player.on('durationchange', () => {
			// 	console.log('durationchange', e);
			// });

			// player.on('metadata_arrived', (e) => {
			// 	console.log('player metadata_arrived', e);
			// });

			// if (player.techName_.toLowerCase() === 'flvjs') {
			// 	player.tech_.on('metadata_arrived', (e, metadata) => {
			// 		console.log('tech metadata_arrived', e);
			// 		onMetadataArrived(metadata);
			// 	});
			// }


			// player.on('loadedmetadata', (e, d) => {
			// 	console.log('player loadedmetadata', e, d);
			// });

			player.on('play', () => {
				onPlay(player);
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
		});

		getVideojsPlayer(player);
		this.player = player;
	}

	componentWillUnmount() {
		if (this.player) {
			this.player.dispose();
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