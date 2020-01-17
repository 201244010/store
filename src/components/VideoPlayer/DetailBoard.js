import React from 'react';
import { formatMessage } from 'umi/locale';
import PerfectScrollbar from 'react-perfect-scrollbar';

import styles from './DetailBoard.less';

class DetailBoard extends React.Component {

	componentDidMount() {
		window.addEventListener('resize', this.reRender);
	}


	componentWillUnmount() {
		window.removeEventListener('resize', this.reRender);
	}


	generateShape = () => {

		// console.log('----generate shape----');
		const { container } = this;
		if(!container) {
			return {
				width: '35%',
				height: '86%',
				top: '10%',
				right: '5%',
			};
			// return '';
		}
		const containerWidth = container.offsetWidth;
		const containerHeight = container.offsetHeight;
		// console.log('-------container----',containerWidth, containerHeight);
		if(containerWidth >= containerHeight) {
			const width = containerHeight * 0.35;
			const height = containerHeight * 0.85;
			const top = containerHeight * 0.1;
			const right = (containerWidth - containerHeight) / 2 + width * 0.05;
			// this.setState({
			// 	shape: {
			// 		width,
			// 		height,
			// 		top,
			// 		right,
			// 	}
			// });
			return {
				width,
				height,
				top,
				right,
			};
		}
		const width = containerWidth * 0.35;
		const height = containerWidth * 0.85;
		const top = (containerHeight - containerWidth) / 2 + height * 0.1;
		const right = containerWidth * 0.05;
		// this.setState({
		// 	shape: {
		// 		width,
		// 		height,
		// 		top,
		// 		right,
		// 	}
		// });
		return {
			width,
			height,
			top,
			right,
		};
	}

	reRender = () =>  {
		// const { shape } = this.state;
		// this.setState({
		// 	shape: !shape
		// });
		this.forceUpdate();
	}


	render() {
		// console.log('render');
		// const { shape } = this.state;
		const { paymentInfo = {}, pixelRatio } = this.props;
		const { totalPrice, details, orderTime, paymentMethod } = paymentInfo;
		return(
			<div className={styles['video-detail-wrapper']}>
				<div
					className={styles['video-detail-container']}
					ref={
						container => this.container = container
					}
				>
					<div
						className={`${styles['video-detail-board']}
						${pixelRatio === '16:9' ? styles.resolution : '' }`}
						// style={
						// 	(() => ({
						// 		...shape
						// 	}))()
						// }
						style={this.generateShape()}
					>
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
										details && details.map((item, index) =>
											<div className={styles['info-item']} key={index}>
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
		);
	}
}

export default DetailBoard;