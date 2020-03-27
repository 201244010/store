import React from 'react';
import { Progress } from 'antd';
import styles from './mainCustomerCard.less';

class MainCustomerCard extends React.Component {
	render() {
		const { type = 'man', age = '19~28岁', num = '0', totalPercent = 50, scene = 'single', frequentPercent = 60, frequencyOfArrival = '1.2', shopPeak = '12-13点'} = this.props;
		const singleFooter = [
			{
				title: '熟客占比',
				value: frequentPercent + '%',
			},
			{
				title: '到店频次',
				value: frequencyOfArrival + '次/日',
			},
			{
				title: '到店高峰',
				value: shopPeak,
			},
		];

		return (
			<div className={styles['card-body']}>
				<div className={styles['card-header']}>
					<div className={styles['card-header-right']}>
						<div className={styles['card-img']} style={{backgroundImage: `url(${type === 'man'? require('./man.png'):require('./woman.png')})`}}></div>
						<span className={styles['card-sex']}>{type === 'man'? '男':'女'}</span>
						<span className={styles['card-line']}></span>
						<span className={styles['card-age']}>{age}</span>
					</div>
					<span className={styles['card-header-left']}>{num}人</span>
				</div>
				<div className={styles['card-footer']}>
					<div className={styles['card-content-label']}>
						<span className={styles['label-title']}>总客流占比</span>
						<span className={styles['label-percent']}>{totalPercent}%</span>
					</div>
					<Progress
						percent={totalPercent}
						strokeColor={{
							'0%': '#4B7AFA',
							'100%': '#65B2FF',
						}}
						showInfo={false}
					/>
				</div>
				{
					scene === 'total'?
					<div className={styles['card-footer']}>
						<div className={styles['card-content-label']}>
							<span className={styles['label-title']}>熟客占比</span>
							<span className={styles['label-percent']}>{frequentPercent}%</span>
						</div>
						<Progress
							percent={frequentPercent}
							strokeColor={{
								'0%': '#FF8133',
								'100%': '#FFB066',
							}}
							showInfo={false}
						/>
					</div>
					:
					<div className={`${styles['card-footer']} ${styles['footer-list']}`}>
						{
							singleFooter.map(item => (
								<div className={styles['list-item']}>
									<div className={styles['item-title']}>{item.title}</div>
									<div className={styles['item-value']}>{item.value}</div>
								</div>
							))
						}
					</div>
				}
			</div>
		);
	}
}

export default MainCustomerCard;