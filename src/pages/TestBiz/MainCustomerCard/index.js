import React from 'react';
import { Progress } from 'antd';
import styles from './mainCustomerCard.less';

const GENDER = {
	1: '男',
	2: '女',
}
const AGERANGE = {
	1: "0~6岁",
	2: "7~12岁",
	3: "13~18岁",
	4: "19~28岁",
	5: "29~35岁",
	6: "36~45岁",
	7: "46~55岁",
	8: "56~100岁",
};

class MainCustomerCard extends React.Component {
	render() {
		const { gender = 1, age = 1, num = '0', totalPercent = 50, scene = 'single', frequentPercent = 60, frequencyOfArrival = '1.2', shopPeak = '12-13点'} = this.props;

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
						<div className={styles['card-img']} style={{backgroundImage: `url(${gender === 1? require('./man.png'):require('./woman.png')})`}}></div>
						<span className={styles['card-sex']}>{GENDER[gender]}</span>
						<span className={styles['card-line']}></span>
						<span className={styles['card-age']}>{AGERANGE[age]}</span>
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