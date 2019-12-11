import React from 'react';
import { Icon, Modal } from 'antd';
import { formatMessage } from 'umi/locale';
import PerfectScrollbar from 'react-perfect-scrollbar';
import styles from './TradeVideoPlayer.less';
import TrackPlayer from '@/components/VideoPlayer/TrackPlayer';


class TradeVideosPlayer extends React.Component {

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
		const { url, pixelRatio, visible, defaultDuration, paymentInfo, detailVisible, showPaymentInfo } = this.props;
		const { totalPrice, details, orderTime, paymentMethod } = paymentInfo;
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
							defaultDuration={defaultDuration}
							pixelRatio={pixelRatio}
							url={url}
							ref={playler => this.trackplayler = playler}
							showPaymentInfo={showPaymentInfo}
						/>
						{
							detailVisible ?
								<div className={styles['video-detail-wrapper']}>
									<div className={styles['video-detail-container']}>
										<div className={`${styles['video-detail-board']} ${pixelRatio === '16:9' ? '': styles.resolution }`}>
											<div className={styles['info-block']}>
												<h1 className={styles.title}>{formatMessage({ id: 'tradeVideos.cashierInfo'})}</h1>
												<div className={styles['info-item']}>
													<span className={styles['info-label']}>{formatMessage({ id: 'tradeVideos.paymentMethod'})}</span>
													<span>{paymentMethod}</span>
												</div>
												<div className={styles['info-item']}>
													<span className={styles['info-label']}>{formatMessage({ id: 'tradeVideos.purchaseTime'})}</span>
													<span>{orderTime}</span>
												</div>
												<div className={styles['info-item']}>
													<span className={styles['info-label']}>{formatMessage({ id: 'tradeVideos.total'})}</span>
													<span>{totalPrice}</span>
												</div>
											</div>
											<div className={`${styles['info-block']} ${styles.detail}`}>
												<h1 className={styles.title}>{formatMessage({ id: 'tradeVideos.paymentDetail'})}</h1>
												<PerfectScrollbar className={styles['detail-block']}>
													{
														details && details.map(item =>
															<div className={styles['info-item']}>
																<span className={styles['detail-label']}>{item.name}</span>
																<span>{item.quantity}</span>
															</div>
														)
													}
												</PerfectScrollbar>
											</div>
										</div>
									</div>

								</div>
								: ''

						}

					</div>
				</div>
			</Modal>
		);
	}

}


export default TradeVideosPlayer;