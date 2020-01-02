import React from 'react';
import { Icon, Modal } from 'antd';
import styles from './ModalPlayer.less';

import TrackPlayer from '@/components/VideoPlayer/TrackPlayer';


class ModalPlayer extends React.Component {

	componentDidUpdate (prevProps) {
		const { visible: prevVisible } = prevProps;
		const { visible } = this.props;
		if (prevVisible !== visible && visible === true && this.trackplayler) {
			this.trackplayler.setCurrentTime(0);
			this.trackplayler.play();
		}
	}

	close = () => {
		const { onClose } = this.props;
		this.trackplayler.pause();

		onClose();
	}

	render() {
		const { url, pixelRatio, visible, defaultDuration } = this.props;

		return (
			<Modal
				className={styles['video-player']}
				visible={visible}
				footer={null}
				closable={false}
				maskClosable={false}
				width='1024'
				height='1024'
			>
				<div className={styles['live-wrapper']}>
					<Icon className={styles.close} type="close" onClick={this.close} />
					<div className={styles['video-player-container']}>
						<TrackPlayer
							fullScreenFlagShow
							defaultDuration={defaultDuration}
							pixelRatio={pixelRatio}
							url={url}
							ref={playler => this.trackplayler = playler}
						/>
					</div>
				</div>
			</Modal>
		);
	}

}


export default ModalPlayer;