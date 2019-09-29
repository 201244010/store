import React, { PureComponent } from 'react';
import { formatMessage } from 'umi/locale';
import { connect } from 'dva';
import { Card, Progress } from 'antd';
import PassengerDetail from './PassengerDetail';
import styles from './passengerAnalyze.less';

const PassengerAgeItemActive = ({ item, onClick = null }) => {
	const { genderRate, ageRange, gender } = item;
	let icon = require('@/assets/icon/man.png');
	let strokeColor = '#2B7AC0';
	if (gender === 'female') {
		icon = require('@/assets/icon/woman.png');
		strokeColor = '#FF6699';
	}

	const handleClick = () => {
		if (onClick) {
			onClick();
		}
	};

	return (
		<div
			className={`${styles['age-item']} ${styles['age-item-active']} ${
				styles['male-active']
			}`}
			onClick={handleClick}
		>
			<div className={styles['age-icon']}>
				<img src={icon} />
			</div>
			<div className={styles['age-content']}>
				<div className={styles.title}>
					{formatMessage({ id: `common.${gender}` })} {ageRange}
					{formatMessage({ id: 'common.age' })}
				</div>
				<div className={styles['progress-wrapper']}>
					<Progress percent={genderRate} strokeWidth={15} strokeColor={strokeColor} />
				</div>
			</div>
		</div>
	);
};

const PassengerAgeItem = ({ item, onClick = null }) => {
	const { genderRate, ageRange, gender } = item;
	let strokeColor = '#2B7AC0';
	if (gender === 'female') {
		strokeColor = '#FF6699';
	}

	const handleClick = () => {
		if (onClick) {
			onClick();
		}
	};

	return (
		<div className={styles['age-item']} onClick={handleClick}>
			<div className={styles.title}>
				{formatMessage({ id: `common.${gender}` })}{ageRange}
			</div>
			<div className={styles['progress-wrapper']}>
				<Progress percent={genderRate} strokeWidth={10} strokeColor={strokeColor} />
			</div>
		</div>
	);
};

const PassengerAgeBar = ({ data = [], activeIndex = 0, onClick = null }) => {
	const handleClick = index => {
		if (onClick) {
			onClick(index);
		}
	};

	return (
		<div className={styles['agebar-wrapper']}>
			{data.map((item, index) => {
				if (index === activeIndex) {
					return (
						<PassengerAgeItemActive
							key={index}
							item={item}
							onClick={() => handleClick(index)}
						/>
					);
				}
				return (
					<PassengerAgeItem key={index} item={item} onClick={() => handleClick(index)} />
				);
			})}
		</div>
	);
};

@connect(({ loading, passengerAnalyze }) => ({
	loading,
	passengerAgeListByGender: passengerAnalyze.passengerAgeListByGender,
	passengerDetailWithAgeAndGender: passengerAnalyze.passengerDetailWithAgeAndGender,
}))
class PassengerInfo extends PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			activeIndex: 0,
		};
	}

	activeBarClick = index => {
		this.setState({
			activeIndex: index,
		});
	};

	render() {
		const { activeIndex } = this.state;
		const { passengerAgeListByGender = [], loading } = this.props;

		return (
			<div className={styles['passenger-info-wrapper']}>
				<Card
					bordered={false}
					loading={loading.effects['passengerAnalyze/getPassengerFlowAgeByGender']}
				>
					<>
						<h4>{formatMessage({ id: 'passengerAnalyze.analyze' })}</h4>
						<div className={styles['passenger-info-content']}>
							<PassengerAgeBar
								data={passengerAgeListByGender}
								activeIndex={activeIndex}
								onClick={this.activeBarClick}
							/>
							<PassengerDetail />
						</div>
					</>
				</Card>
			</div>
		);
	}
}

export default PassengerInfo;
