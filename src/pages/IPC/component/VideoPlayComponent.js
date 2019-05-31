import React from 'react';
import styles from './VideoPlayComponent.less';
import { Icon } from 'antd';
import VideoPlayer from '@/components/VideoPlayer/VideoPlayer';
// import { formatMessage } from 'umi/locale';

class VideoPlayComponent extends React.Component {

	// componentDidMount(){
	// 	// console.log('come in');
	// 	const { videoUrl,ipcType } = this.props;
	// 	// console.log(videoUrl,ipcType);
	// }

	componentDidUpdate () {
		const { playing } = this.props;
		if (playing) {
			// this.child.currentTime(0);
			this.child.setCurrentTime(0);
			this.child.play();
		}
	}

	closeWindow = () => {
		const { watchVideoClose } = this.props;
		this.child.pause();

		watchVideoClose();
	}

	onRef = (ref) => {
		this.child = ref;
	}

	render() {
		const { videoUrl,ipcType } = this.props;
		// let pixelRatio;
		// switch(ipcType){
		// 	case 'FS1':
		// 		pixelRatio = '16:9';
		// 		break;
		// 	case 'SS1':
		// 		pixelRatio = '1:1';
		// 		break;
		// 	default:
		// 		pixelRatio = '16:9';
		// 		break;
		// }
		const pixelRatio = {
			'FS1':'16:9',
			'SS1':'1:1'
		};
		// console.log(pixelRatio[ipcType]);
		return (
			<div className={styles['live-wrapper']}>
				<Icon className={styles.close} type="close" onClick={this.closeWindow} />
				<div className={styles['video-player-container']}>
					<VideoPlayer
						pixelRatio={pixelRatio[ipcType]?pixelRatio[ipcType]:'16:9'}
						// pixelRatio= '16:9'
						type='track'
						url={videoUrl}
						// onRef={this.onRef}
						ref={playler => this.child = playler}
					/>
				</div>
			</div>
		);
	}

}


export default VideoPlayComponent;