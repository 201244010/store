import React from 'react';
// import moment from 'moment';
import { formatMessage } from 'umi/locale';

import styles from './TimeLine.less';

class TimeLine extends React.Component {

	render(){
		const { tradeList, activeOrderId } = this.props;


		return(
			<div className={styles.timeline}>
				<div className={styles['line-container']}>
					<div className={tradeList[0] && tradeList[0].hasVideo ? styles.line : styles['waiting-video-line']} />
				</div>
				<div className={styles['times-container']}>
					{ tradeList.map((item, index) => (
						<div 
							key={index}
							className={item.orderId === activeOrderId ? styles.active : styles.normal}
						>
							
							<div className={item.hasVideo? styles.dot : styles['waiting-video-dot']} />
							<div className={item.hasVideo? styles.border : styles['waiting-video-border']}>
								<div className={item.hasVideo? styles['normal-content'] : styles['waiting-video-content']}>
									<div className={styles.time}>
										{/* {moment.unix(item.time).format('YYYY-MM-DD HH:mm:ss')} */}
										{item.time === -1 ? '--' :item.time}
									</div>
									<div className={styles.amount}>
										<span className={styles.title}>{formatMessage({id: 'trade.show.title'})}</span>
										<span className={styles.price}>{item.amount === -1 ? formatMessage({id: 'trade.show.unknown'}) : item.amount}</span>
										<span className={styles.unit}>{item.unit === 0 ? formatMessage({id: 'trade.show.unit'}) : formatMessage({id: 'trade.show.ten.thousand.unit'})}</span>
									</div>
									{
										item.hasVideo ? 
											'' :
											<div className={styles.tips}>{formatMessage({id: 'trade.show.tips'})}</div>
									}
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
		);
	}
}

export default TimeLine;