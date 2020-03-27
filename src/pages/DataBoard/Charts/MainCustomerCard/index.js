import React from 'react';
import { Progress } from 'antd';
import { formatMessage } from 'umi/locale';
import { formater } from '@/utils/format';
import styles from '../chartsCommon.less';

const frequencyUnit = {
	1: 'day',
	2: 'week',
	3: 'month',
};

const { formatFloatByPercent, frequencyFormat, passengerNumFormat } = formater;

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

	formatPercent = (value) => {
		if(value !== undefined) {
			const { int, point, float, percent } = formatFloatByPercent({ value, returnType: 'split'});
			return {
				value: `${int}${point}${float}`,
				unit: percent
			};
		}
		return {
			value: '--',
			unit: '',
		};
	}

	formatFrequency = (value, timeType) => {
		if(value !== undefined) {
			const type = frequencyUnit[timeType];
			const { int, point, float, unit } = frequencyFormat({ value, returnType: 'split'})[type];
			return {
				value: `${int}${point}${float}`,
				unit,
			};
		}
		return {
			value: '--',
			unit: '',
		};
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
				...this.formatPercent(regularPercent),
			},
			{
				title: formatMessage({ id: 'databoard.passenger.frequency'}),
				...this.formatFrequency(frequency, timeType),
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
					<span className={styles['card-header-left']}>
						{passengerNumFormat({value: count, returnType: 'join'})}
						<span className={styles['card-header-unit']}>{formatMessage({id: 'databoard.passenger.unit'})}</span>
					</span>
				</div>
				<div className={styles['card-footer']}>
					<div className={styles['card-content-label']}>
						<span className={styles['label-title']}>{formatMessage({ id: 'databoard.passenger.rate'})}</span>
						<span className={styles['label-percent']}>
							{this.formatPercent(totalPercent).value}
							<span className={styles['label-percent-unit']}>{this.formatPercent(totalPercent).unit}</span>
						</span>
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
								<span className={styles['label-percent']}>
									{this.formatPercent(regularPercent).value}
									<span className={styles['label-percent-unit']}>{this.formatPercent(totalPercent).unit}</span>
								</span>
							</div>
							<Progress
								percent={regularPercent * 100}
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