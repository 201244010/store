import React, { PureComponent } from 'react';
import { Row, Col } from 'antd';
import { formatMessage } from 'umi/locale';
import TopDataCard from '../Charts/TopDataCard/TopDataCard';
import styles from './index.less';

const TIME_TIP = {
	1: formatMessage({ id: 'databoard.passenger.yesterday.tip' }),
	2: formatMessage({ id: 'databoard.passenger.week.tip' }),
	3: formatMessage({ id: 'databoard.passenger.month.tip' }),
};

class OverviewCard extends PureComponent {
	handleAddToolTip = obj => {
		const { label } = obj;
		const { timeType } = this.props;
		let toolTipText = '';
		switch (label) {
			case 'passengerCount':
				toolTipText = `${TIME_TIP[timeType]}${formatMessage({
					id: 'databoaed.passenger.tip',
				})}`;
				break;
			case 'enteringRate':
				toolTipText = `${TIME_TIP[timeType]}${formatMessage({
					id: 'databoaed.entering.tip',
				})}`;
				break;
			case 'strangerCount':
				toolTipText = '';
				break;
			case 'regularCount':
				toolTipText = '';
				break;
			case 'avgFrequency':
				toolTipText = `${TIME_TIP[timeType]}${formatMessage({
					id: 'databoaed.frequency.tip',
				})}`;
				break;
			default:
				toolTipText = '';
				break;
		}
		return {
			...obj,
			toolTipText,
		};
	};

	render() {
		const {
			loading,
			passengerCount,
			enteringRate,
			strangerCount,
			regularCount,
			avgFrequency,
			timeType,
		} = this.props;
		// console.log('=======RTOverviewCard', RTPassengerCount, paymentTotalAmount );
		const firstRow = [passengerCount, strangerCount, regularCount, avgFrequency, enteringRate];
		console.log('=======card=====', firstRow, loading);
		return (
			<div className={styles.overview}>
				<Row gutter={24} className={styles['overview-row']}>
					{firstRow.map((item, index) => (
						<Col span={6} key={index} className={styles['col-row-5']}>
							<TopDataCard
								data={this.handleAddToolTip(item)}
								loading={loading}
								timeType={timeType}
								dataType={2}
							/>
						</Col>
					))}
				</Row>
			</div>
		);
	}
}
export default OverviewCard;
