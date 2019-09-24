import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card } from 'antd';

import styles from './passengerAnalyze.less';

@connect(({ loading, passengerAnalyze }) => ({
	loading,
	passengerAgeListByGender: passengerAnalyze.passengerAgeListByGender,
	passengerDetailWithAgeAndGender: passengerAnalyze.passengerDetailWithAgeAndGender,
}))
class PassengerInfo extends PureComponent {
	render() {
		return (
			<div className={styles['passenger-info-wrapper']}>
				<Card bordered={false}>233</Card>
			</div>
		);
	}
}

export default PassengerInfo;
