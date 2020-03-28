import React, { PureComponent } from 'react';
import { Row, Col } from 'antd';
import { formatMessage } from 'umi/locale';
import TopDataCard from '../Charts/TopDataCard/TopDataCard';
import styles from './index.less';

const TIME_TIP = {
	1: formatMessage({ id: 'databoard.passenger.yesterday.tip'}),
	2: formatMessage({ id: 'databoard.passenger.week.tip'}),
	3: formatMessage({ id: 'databoard.passenger.month.tip'}),
};

class OverviewCard extends PureComponent {

	handleAddToolTip = (obj) => {
		const { label } = obj;
		const { timeType } = this.props;
		let toolTipText = '';
		switch(label) {
			case 'passengerCount':
				toolTipText = `${TIME_TIP[timeType]}${formatMessage({ id: 'databoaed.passenger.tip'})}`;
				break;
			case 'enteringRate':
				toolTipText = `${TIME_TIP[timeType]}${formatMessage({ id: 'databoaed.entering.tip'})}`;
				break;
			case 'regularCount':
				toolTipText = `${TIME_TIP[timeType]}${formatMessage({ id: 'databoaed.regular.tip'})}`;
				break;
			case 'avgFrequency':
				toolTipText = `${TIME_TIP[timeType]}${formatMessage({ id: 'databoaed.frequency.tip'})}`;
				break;
			default: break;
		}
		return {
			...obj,
			toolTipText,
		};
	}

	render() {
		const {
			loading, passengerCount, enteringRate,
			regularCount, avgFrequency, timeType,
		} = this.props;
		// console.log('=======RTOverviewCard', RTPassengerCount, paymentTotalAmount );
		const firstRow = [passengerCount, regularCount, enteringRate, avgFrequency];
		console.log('=======card=====', firstRow, loading);
		return (
			<div className={styles.overview}>
				<Row gutter={24} className={styles['overview-row']}>
					{
						firstRow.map((item, index) =>
							<Col span={6} key={index}>
								<TopDataCard data={this.handleAddToolTip(item)} loading={loading} timeType={timeType} dataType={2} />
							</Col>)
					}
				</Row>
			</div>
		);
	}
}
export default OverviewCard;