import React from 'react';
import { formatMessage } from 'umi/locale';
import styles from './card.less';

class Card extends React.PureComponent {
	render() {
		const {
			title,
			dayTitle,
			dayNum,
			dayCompare,
			weekTitle,
			weekNum,
			weekCompare,
			monthTitle,
			monthNum,
			monthCompare,
		} = this.props;
		let { num = '0' } = this.props;
		num = num.toString().replace(/,/g, '');

		let showUnit = false;
		if (parseFloat(num) >= 10000) {
			num = (parseFloat(num) / 10000).toFixed(2);
			showUnit = true;
		}

		return (
			<div className={styles['card-border']}>
				<div className={styles.card}>
					<div className={styles['card-left']}>
						<div className={styles['card-left-title']}>{title}</div>
						<div className={styles['card-left-num']}>
							{num}
							{showUnit ? (
								<span
									className={styles['card-left-unit']}
								>
									{formatMessage({ id: 'show.total.unit' })}
								</span>
							) : (
								''
							)}
						</div>
					</div>
					<div className={styles['card-right']}>
						<div className={styles['card-right-count']}>
							<div className={styles['card-right-title']}>{dayTitle}</div>
							<div className={styles['card-right-num']}>
								{dayNum}%
								<span
									className={styles.compare}
									style={{
										background:
											dayCompare !== -1
												? `url(${
													dayCompare === 1
														? require('./ic_up.svg')
														: require('./ic_down.svg')
												  })`
												: 'transparent',
									}}
								/>
							</div>
						</div>
						<div className={styles['card-right-count']}>
							<div className={styles['card-right-title']}>{weekTitle}</div>
							<div className={styles['card-right-num']}>
								{weekNum}%
								<span
									className={styles.compare}
									style={{
										background:
											weekCompare !== -1
												? `url(${
													weekCompare === 1
														? require('./ic_up.svg')
														: require('./ic_down.svg')
												  })`
												: 'transparent',
									}}
								/>
							</div>
						</div>
						<div className={styles['card-right-count']}>
							<div className={styles['card-right-title']}>{monthTitle}</div>
							<div className={styles['card-right-num']}>
								{monthNum}%
								<span
									className={styles.compare}
									style={{
										background:
											monthCompare !== -1
												? `url(${
													monthCompare === 1
														? require('./ic_up.svg')
														: require('./ic_down.svg')
												  })`
												: 'transparent',
									}}
								/>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}
export default Card;
