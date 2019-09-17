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
		if (parseFloat(num) >= 10000 || parseFloat(num) <= -10000) {
			num = (parseFloat(num) / 10000).toFixed(2);
			showUnit = true;
		}

		const compareData = [
			{
				title: dayTitle,
				num: dayNum,
				compare: dayCompare,
				style: dayCompare !== -1 ? dayCompare === 1 ? 'compare-up' : 'compare-down' : 'compare-normal',
			},
			{
				title: weekTitle,
				num: weekNum,
				compare: weekCompare,
				style: weekCompare !== -1 ? weekCompare === 1 ? 'compare-up' : 'compare-down' : 'compare-normal',
			},
			{
				title: monthTitle,
				num: monthNum,
				compare: monthCompare,
				style: monthCompare !== -1 ? monthCompare === 1 ? 'compare-up' : 'compare-down' : 'compare-normal',
			},
		];

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
						{
							compareData.map(item => (
								<div className={styles['card-right-count']} key={item.title}>
									<div className={styles['card-right-title']}>{item.title}</div>
									<div className={styles['card-right-num']}>
										{item.num}%
										<span
											className={`${styles.compare} ${styles[item.style]}`}
										/>
									</div>
								</div>
							))
						}
					</div>
				</div>
			</div>
		);
	}
}
export default Card;
