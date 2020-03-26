import React, { PureComponent } from 'react';
import { Row, Col } from 'antd';
import TopDataCard from '../Charts/TopDataCard/TopDataCard';
import styles from './index.less';

class OverviewCard extends PureComponent {

	render() {
		const {
			loading, RTEnteringRate, RTPassengerCount,
			paymentTotalAmount, paymentTotalCount, transactionRate,
		} = this.props;
		console.log('=======RTOverviewCard', RTPassengerCount, paymentTotalAmount );
		const firstRow = [RTPassengerCount, RTEnteringRate];
		const secondRow = [paymentTotalAmount, paymentTotalCount, transactionRate];

		return (
			<div className={styles.overview}>
				<Row gutter={24} className={styles['overview-row']}>
					{
						firstRow.map((item, index) => <Col span={8} key={`1-${index}`}><TopDataCard data={item} loading={loading} /></Col>)
					}
				</Row>
				<Row gutter={24} className={styles['overview-row']}>
					{
						secondRow.map((item, index) => <Col span={8} key={`2-${index}`}><TopDataCard data={item} loading={loading} /></Col>)
					}
				</Row>
			</div>
		);
	}
}
export default OverviewCard;