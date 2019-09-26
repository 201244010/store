import React from 'react';

import TrackPlayer from '@/components/VideoPlayer/TrackPlayer';
import styles from './VideoPlayer.less';


class VideoPlayer extends React.Component {

	onEnd = () => {
		const { setActiveOrder } = this.props;
		setActiveOrder();
		this.trackplayler.play();
	}
	

	render() {
		const { activeVideoInfo: { videoUrl, pixelRatio } } = this.props;
		return(
			<div className={styles['video-container']}>
				<div className={styles['video-wrapper']}>
					<TrackPlayer
						pixelRatio={pixelRatio}
						url={videoUrl}
						onEnd={this.onEnd}
						ref={playler => this.trackplayler = playler}
					/>
				</div>
			</div>
			
		);
	}
}
export default VideoPlayer;