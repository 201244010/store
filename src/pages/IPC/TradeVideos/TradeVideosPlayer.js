import React from 'react';
import { Icon, Modal } from 'antd';
// import { formatMessage } from 'umi/locale';
// import PerfectScrollbar from 'react-perfect-scrollbar';
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
		// const { totalPrice, details, orderTime, paymentMethod } = paymentInfo;
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
							showPaymentInfo={showPaymentInfo}
							detailVisible={detailVisible}
							paymentInfo={paymentInfo}
						/>
						{/* {
							detailVisible ?
								<div className={styles['video-detail-wrapper']}>
									<div className={styles['video-detail-container']}>
										<div className={`${styles['video-detail-board']} ${pixelRatio === '16:9' ? styles.resolution : '' }`}>
											<div className={styles['detail-board-content']}>
												<div className={styles['info-block']}>
													<h1>
														<span className={`${styles.title} ${styles['scale-text']}`}>{formatMessage({ id: 'tradeVideos.cashierInfo'})}</span>
													</h1>
													<div className={styles['info-item']}>
														<div className={styles['info-label']}>
															<span className={`${styles['scale-text']}`}>{formatMessage({ id: 'tradeVideos.paymentMethod'})}</span>
														</div>
														<div className={styles['info-label-value']}>
															<span className={`${styles['scale-text']}`}>{paymentMethod}</span>
														</div>
													</div>
													<div className={styles['info-item']}>
														<div className={styles['info-label']}>
															<span className={`${styles['scale-text']}`}>{formatMessage({ id: 'tradeVideos.purchaseTime'})}</span>
														</div>
														<div className={styles['info-label-value']}>
															<span className={`${styles['scale-text']}`}>{orderTime}</span>
														</div>
													</div>
													<div className={styles['info-item']}>
														<div className={styles['info-label']}>
															<span className={`${styles['scale-text']}`}>{formatMessage({ id: 'tradeVideos.total'})}</span>
														</div>
														<div className={styles['info-label-value']}>
															<span className={`${styles['scale-text']}`}>{totalPrice}</span>
														</div>
													</div>
												</div>
												<div className={`${styles['info-block']} ${styles.detail}`}>
													<h1>
														<span className={`${styles.title} ${styles['scale-text']}`}>{formatMessage({ id: 'tradeVideos.paymentDetail'})}</span>
													</h1>
													<PerfectScrollbar className={styles['detail-block']}>
														{
															details && details.map(item =>
																<div className={styles['info-item']}>
																	<div className={styles['detail-label']}>
																		<span className={`${styles['scale-text']}`}>{item.name}</span>
																	</div>
																	<div className={styles['detail-label-value']}>
																		<span className={`${styles['scale-text']}`}>{item.quantity}</span>
																	</div>
																</div>
															)
														}
													</PerfectScrollbar>
												</div>
											</div>
										</div>
									</div>

								</div>
								: ''

						} */}

					</div>
				</div>
			</Modal>
		);
	}

}


export default TradeVideosPlayer;