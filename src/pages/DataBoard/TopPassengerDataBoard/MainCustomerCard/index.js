import React from 'react';
import { Progress } from 'antd';
import { formatMessage } from 'umi/locale';
import styles from './mainCustomerCard.less';

const GENDER = {
	1: formatMessage({id: 'databoard.top.mainCustomerCard.gender.male'}),
	2: formatMessage({id: 'databoard.top.mainCustomerCard.gender.female'}),
};
const AGERANGE = {
	3: formatMessage({id: 'databoard.top.mainCustomerCard.ageRange18'}),
	4: formatMessage({id: 'databoard.top.mainCustomerCard.ageRange19'}),
	5: formatMessage({id: 'databoard.top.mainCustomerCard.ageRange29'}),
	6: formatMessage({id: 'databoard.top.mainCustomerCard.ageRange36'}),
	7: formatMessage({id: 'databoard.top.mainCustomerCard.ageRange46'}),
	8: formatMessage({id: 'databoard.top.mainCustomerCard.ageRange56'}),
};

const SCENETYPE = {
	single: {
		type: 'single',
		isDefault: false,
	},
	singleDefault: {
		type: 'single',
		isDefault: true,
	},
	total: {
		type: 'total',
		isDefault: false,
	},
	totalDefault: {
		type: 'total',
		isDefault: true,
	},
};

class MainCustomerCard extends React.Component {
	render() {
		const {
			gender = 1,
			age = 1,
			num = '0',
			totalPercent = 0,
			scene = 'single',
			frequentPercent = 0,
			frequencyOfArrival = '0',
			shopPeak = formatMessage({id: 'databoard.top.mainCustomerCard.shopPeak.value'}),
		} = this.props;

		const type = SCENETYPE[scene].type;
		const isDefault = SCENETYPE[scene].isDefault;

		const singleFooter = [
			{
				title: formatMessage({id: 'databoard.top.mainCustomerCard.frequentPercent'}),
				value: `${frequentPercent}%`,
			},
			{
				title: formatMessage({id: 'databoard.top.mainCustomerCard.frequencyOfArrival'}),
				value: `${frequencyOfArrival}${formatMessage({id: 'databoard.top.mainCustomerCard.frequencyOfArrival.unit'})}`,
			},
			{
				title: formatMessage({id: 'databoard.top.mainCustomerCard.shopPeak.title'}),
				value: shopPeak,
			},
		];

		return (
			<div className={styles['card-body']}>
				<div className={styles['card-header']}>
					<div className={styles['card-header-right']}>
						<div
							className={styles['card-img']}
							style={{
								backgroundImage: `url(${
									isDefault? require('./default.png') : gender === 1 ? require('./man.png') : require('./woman.png')
								})`,
							}}
						/>
						{
							isDefault?
								<span className={styles['card-default']}>{formatMessage({id: 'databoard.top.mainCustomerCard.default.title'})}</span>
								:
								<>
									<span className={styles['card-sex']}>{GENDER[gender]}</span>
									<span className={styles['card-line']} />
									<span className={styles['card-age']}>{AGERANGE[age]}</span>
								</>
						}
					</div>
					<span className={styles['card-header-left']}>
						<span>{num}</span>
						<span className={styles['card-header-left-unit']}>{formatMessage({id: 'databoard.top.mainCustomerCard.person.unit'})}</span>
					</span>
				</div>
				<div className={styles['card-footer']}>
					<div className={styles['card-content-label']}>
						<span className={styles['label-title']}>{formatMessage({id: 'databoard.top.mainCustomerCard.totalPercent'})}</span>
						<span className={styles['label-percent']}>
							<span>{totalPercent}</span>
							<span className={styles['label-percent-unit']}>%</span>
						</span>
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
				{type === 'total' ? (
					<div className={styles['card-footer']}>
						<div className={styles['card-content-label']}>
							<span className={styles['label-title']}>{formatMessage({id: 'databoard.top.mainCustomerCard.frequentPercent'})}</span>
							<span className={styles['label-percent']}>
								<span>{frequentPercent}</span>
								<span className={styles['label-percent-unit']}>%</span>
							</span>
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
				) : (
					<div className={`${styles['card-footer']} ${styles['footer-list']}`}>
						{singleFooter.map(item => (
							<div className={styles['list-item']}>
								<div className={styles['item-title']}>{item.title}</div>
								<div className={styles['item-value']}>{item.value}</div>
							</div>
						))}
					</div>
				)}
			</div>
		);
	}
}

export default MainCustomerCard;
