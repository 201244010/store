import React from 'react';
import styles from './VideoPlayComponent.less';
import { Icon, Modal } from 'antd';
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
		if (playing && this.child) {
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
		const { videoUrl, pixelRatio, playing } = this.props;

		return (
			<Modal
				className={styles['video-player']}
				visible={playing}
				footer={null}
				closable={false}
				maskClosable={false}
				width='1024'
				height='1024'
			>
				<div className={styles['live-wrapper']}>
					<Icon className={styles.close} type="close" onClick={this.closeWindow} />
					<div className={styles['video-player-container']}>
						<VideoPlayer
							pixelRatio={pixelRatio}
							type='track'
							url={videoUrl}
							ref={playler => this.child = playler}
						/>
					</div>
				</div>
			</Modal>
		);
	}

}


export default VideoPlayComponent;