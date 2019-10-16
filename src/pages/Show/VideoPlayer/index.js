import React from 'react';

import TrackPlayer from '@/components/VideoPlayer/TrackPlayer';
import styles from './VideoPlayer.less';


class VideoPlayer extends React.Component {
	

	// componentWillReceiveProps(nextProps){
	// 	const { isActiveTimeState } = nextProps;
	// }

	componentDidMount(){
		const { isActiveTimeState } = this.props;
		if(isActiveTimeState){
			this.trackplayler.play();
		}else{
			setTimeout(() => {
				this.trackplayler.pause();
			},5000);
			
		}
	}

	componentWillReceiveProps(nextProps){
		const { isActiveTimeState } = this.props;
		const { isActiveTimeState: nextState } = nextProps;
		if(isActiveTimeState !== nextState){
			if(nextState){
				this.trackplayler.play();
			}else{
				this.trackplayler.pause();
			}
		}
	}

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
						autoPlay={false}
					/>
				</div>
			</div>
			
		);
	}
}
export default VideoPlayer;