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
					<Progress percent={Math.round(genderRate * 1)} strokeWidth={15} strokeColor={strokeColor} />
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
				<Progress percent={Math.round(genderRate * 1)} strokeWidth={10} strokeColor={strokeColor} />
			</div>
		</div>
	);
};

const PassengerAgeBar = ({ data = [], activeIndex = 0, onClick = null }) => {
	const handleClick = (index, item) => {
		if (onClick) {
			onClick(index, item);
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
							onClick={() => handleClick(index, item)}
						/>
					);
				}
				return (
					<PassengerAgeItem key={index} item={item} onClick={() => handleClick(index, item)} />
				);
			})}
		</div>
	);
};

@connect(({ loading, passengerAnalyze }) => ({
	loading,
	activeIndex: passengerAnalyze.activeIndex,
	activeContent: passengerAnalyze.activeContent,
	passengerAgeListByGender: passengerAnalyze.passengerAgeListByGender,
	lastPassengerAgeListByGender: passengerAnalyze.lastPassengerAgeListByGender,
	passengerDetailWithAgeAndGender: passengerAnalyze.passengerDetailWithAgeAndGender,
}), dispatch => ({
	updateActiveIndex: ({activeIndex}) => dispatch({ type: 'passengerAnalyze/updateActiveIndex', payload: {activeIndex} }),
	updateActiveContent: ({activeContent}) => dispatch({ type: 'passengerAnalyze/updateActiveContent', payload: {activeContent} }),
	getPassengerFlowAgeByGender: () => dispatch({ type: 'passengerAnalyze/getPassengerFlowAgeByGender' }),
	getPassengerFlowHistoryWithAgeAndGender: () => dispatch({ type: 'passengerAnalyze/getPassengerFlowHistoryWithAgeAndGender' })
}))
class PassengerInfo extends PureComponent {
	async componentDidMount() {
		const { getPassengerFlowAgeByGender, getPassengerFlowHistoryWithAgeAndGender } = this.props;
		await getPassengerFlowHistoryWithAgeAndGender();
		await getPassengerFlowAgeByGender();

		const {updateActiveIndex } = this.props;

		updateActiveIndex({
			activeIndex: 0
		});
	}

	activeBarClick = (index) => {
		const { updateActiveIndex } = this.props;
		updateActiveIndex({
			activeIndex: index
		});
	};

	render() {
		const { passengerAgeListByGender = [], lastPassengerAgeListByGender = [], loading, activeIndex, activeContent } = this.props;
		const lastData = lastPassengerAgeListByGender.find(item => item.gender === activeContent.gender && item.ageRangeCode === activeContent.ageRangeCode) || {};

		return (
			<div className={styles['passenger-info-wrapper']}>
				<Card
					bordered={false}
					loading={loading.effects['passengerAnalyze/getPassengerFlowAgeByGender'] || loading.effects['passengerAnalyze/getPassengerFlowHistoryWithAgeAndGender']}
				>
					<>
						<h4>{formatMessage({ id: 'passengerAnalyze.analyze' })}</h4>
						<div className={styles['passenger-info-content']}>
							<PassengerAgeBar
								data={passengerAgeListByGender}
								activeIndex={activeIndex}
								onClick={this.activeBarClick}
							/>
							<PassengerDetail data={activeContent} lastData={lastData} />
						</div>
					</>
				</Card>
			</div>
		);
	}
}

export default PassengerInfo;
