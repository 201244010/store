import React, { PureComponent } from 'react';
import { formatMessage } from 'umi/locale';
import { connect } from 'dva';
import { Card, Progress } from 'antd';
import PassengerDetail from './PassengerDetail';
import styles from './passengerAnalyze.less';

const PassengerAgeItemActive = () => (
	<div className={`${styles['age-item']} ${styles['age-item-active']}`}>
		<div className={styles['age-icon']}>
			<img src={require('@/assets/icon/totalAmount.png')} />
		</div>
		<div className={styles['age-content']}>
			<div className={styles.title}>男 25~36</div>
			<div className={styles['progress-wrapper']}>
				<Progress percent={30} />
			</div>
		</div>
	</div>
);

const PassengerAgeItem = () => (
	<div className={styles['age-item']}>
		<div className={styles.title}>男 25~36</div>
		<div className={styles['progress-wrapper']}>
			<Progress percent={30} />
		</div>
	</div>
);

const PassengerAgeBar = () => (
	<div className={styles['agebar-wrapper']}>
		<PassengerAgeItemActive />
		<PassengerAgeItem />
	</div>
);

@connect(({ loading, passengerAnalyze }) => ({
	loading,
	passengerAgeListByGender: passengerAnalyze.passengerAgeListByGender,
	passengerDetailWithAgeAndGender: passengerAnalyze.passengerDetailWithAgeAndGender,
}))
class PassengerInfo extends PureComponent {
	render() {
		return (
			<div className={styles['passenger-info-wrapper']}>
				<Card bordered={false}>
					<>
						<h4>{formatMessage({ id: 'passengerAnalyze.analyze' })}</h4>
						<div className={styles['passenger-info-content']}>
							<PassengerAgeBar />
							<PassengerDetail />
						</div>
					</>
				</Card>
			</div>
		);
	}
}

export default PassengerInfo;
