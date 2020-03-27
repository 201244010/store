import React, { PureComponent } from 'react';
import { Row, Col } from 'antd';
import TopDataCard from '../Charts/TopDataCard/TopDataCard';
import styles from './index.less';

class OverviewCard extends PureComponent {

	render() {
		const {
			loading, passengerCount, enteringRate,
			regularCount, avgFrequency
		} = this.props;
		// console.log('=======RTOverviewCard', RTPassengerCount, paymentTotalAmount );
		const firstRow = [passengerCount, regularCount, enteringRate, avgFrequency];
		console.log('=======card=====', firstRow);
		return (
			<div className={styles.overview}>
				<Row gutter={24} className={styles['overview-row']}>
					{
						firstRow.map((item, index) => <Col span={6} key={index}><TopDataCard data={item} loading={loading} /></Col>)
					}
				</Row>
			</div>
		);
	}
}
export default OverviewCard;