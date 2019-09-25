import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import { Card } from 'antd';
import { SalseInfo } from '@/pages/DashBoard/SalseBar';
import styles from './passengerAnalyze.less';

@connect(({ passengerAnalyze, loading }) => ({
	loading,
	passengerFlowCount: passengerAnalyze.passengerFlowCount,
}))
class PassengerData extends PureComponent {
	render() {
		const {
			passengerFlowCount: { totalCount, regularCount, strangerCount, memberCount },
			// loading,
		} = this.props;

		return (
			<div className={styles['passenger-bar-wrapper']}>
				<Card bordered={false}>
					<div className={styles['passenger-bar']}>
						<SalseInfo
							{...{
								icon: <img src={require('@/assets/icon/passenger.png')} />,
								title: formatMessage({ id: 'passengerAnalyze.comein' }),
								loading: false,
								content: totalCount,
							}}
						/>
						<SalseInfo
							{...{
								icon: <img src={require('@/assets/icon/stranger.png')} />,
								title: formatMessage({ id: 'passengerAnalyze.stranger' }),
								loading: false,
								content: strangerCount,
							}}
						/>
						<SalseInfo
							{...{
								icon: <img src={require('@/assets/icon/regular.png')} />,
								title: formatMessage({ id: 'passengerAnalyze.regular' }),
								loading: false,
								content: regularCount,
							}}
						/>
						<SalseInfo
							{...{
								icon: <img src={require('@/assets/icon/member.png')} />,
								title: formatMessage({ id: 'passengerAnalyze.member' }),
								loading: false,
								content: memberCount,
							}}
						/>
					</div>
				</Card>
			</div>
		);
	}
}

export default PassengerData;
