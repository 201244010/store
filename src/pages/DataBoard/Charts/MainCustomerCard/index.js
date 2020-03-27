import React from 'react';
import { Progress } from 'antd';
import { formatMessage } from 'umi/locale';
import styles from './mainCustomerCard.less';
import { formatFrequency, formatPassengerRate } from '../../format';

const frequencyUnit = {
	1: formatMessage({id: 'databoard.frequency.day.unit'}),
	2: formatMessage({id: 'databoard.frequency.week.unit'}),
	3: formatMessage({id: 'databoard.frequency.month.unit'}),
};

class MainCustomerCard extends React.Component {

	formatAge = (range) => {
		switch(range) {
			case 1:
				return '0-7';
			case 2:
				return '7-11';
			case 3:
				return '12-18';
			case 4:
				return '19-28';
			case 5:
				return '29-35';
			case 6:
				return '36-45';
			case 7:
				return '46-55';
			default:
				return '56-100';
		}
	}

	render() {
		const { gender, ageRangeCode, count,
			totalPercent = 0, scene = 'single', regularPercent,
			frequency, hotTime,
			timeType = 1,
		} = this.props;
		const singleFooter = [
			{
				title: formatMessage({ id: 'databoard.regular.rate'}),
				value: regularPercent !== undefined ? `${formatPassengerRate(regularPercent)}` : '--',
				unit: regularPercent !== undefined ? '%' : ''
			},
			{
				title: formatMessage({ id: 'databoard.passenger.frequency'}),
				value: frequency !== undefined ? `${formatFrequency(frequency)}`: '--',
				unit: frequency !== undefined ? frequencyUnit[timeType] : '',
			},
			{
				title: formatMessage({ id: 'databoard.hot.time'}),
				value: hotTime !== -1 ? `${hotTime}-${hotTime + 1}` : '--',
				unit: hotTime !== -1 ? formatMessage({ id: 'databoard.hot.time.unit'}) : ''
			},
		];

		return (
			<div className={styles['card-body']}>
				<div className={styles['card-header']}>
					<div className={styles['card-header-right']}>
						<div className={styles['card-img']} style={{backgroundImage: `url(${gender === 1? require('./man.png'):require('./woman.png')})`}} />
						<span className={styles['card-sex']}>{gender === 1? formatMessage({id: 'databoard.gender.male'}): formatMessage({id: 'databoard.gender.male'})}</span>
						<span className={styles['card-line']} />
						<span className={styles['card-age']}>{`${this.formatAge(ageRangeCode)}${formatMessage({id: 'databoard.age.unit'})}`}</span>
					</div>
					<span className={styles['card-header-left']}>{count}<span className={styles['card-header-unit']}>{formatMessage({id: 'databoard.passenger.unit'})}</span></span>
				</div>
				<div className={styles['card-footer']}>
					<div className={styles['card-content-label']}>
						<span className={styles['label-title']}>{formatMessage({ id: 'databoard.passenger.rate'})}</span>
						<span className={styles['label-percent']}>{formatPassengerRate(totalPercent)}<span className={styles['label-percent-unit']}>%</span></span>
					</div>
					<Progress
						percent={totalPercent * 100}
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
								<span className={styles['label-title']}>{formatMessage({ id: 'databoard.regular.rate'})}</span>
								<span className={styles['label-percent']}>{formatPassengerRate(regularPercent)}%</span>
							</div>
							<Progress
								percent={regularPercent}
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
								singleFooter.map((item, index) => (
									<div className={styles['list-item']} key={index}>
										<div className={styles['item-title']}>{item.title}</div>
										<div className={styles['item-value']}>{item.value}<span className={styles['item-unit']}>{item.unit}</span></div>
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