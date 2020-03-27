import React, { PureComponent } from 'react';
import { Row, Col } from 'antd';
import TopDataCard from '../Charts/TopDataCard/TopDataCard';
import styles from './index.less';

class OverviewCard extends PureComponent {

	render() {
		const {
			loading, RTEnteringRate, RTPassengerCount, RTDeviceCount,
			paymentTotalAmount, paymentTotalCount, transactionRate, timeType
		} = this.props;
		console.log('=======RTOverviewCard', RTPassengerCount, paymentTotalAmount, loading );
		const firstRow = [RTPassengerCount, RTEnteringRate, RTDeviceCount];
		const secondRow = [paymentTotalAmount, paymentTotalCount, transactionRate];

		return (
			<div className={styles.overview}>
				<Row gutter={24} className={styles['overview-row']}>
					{
						firstRow.map((item, index) =>
							<Col span={8} key={`1-${index}`}>
								<TopDataCard data={item} timeType={timeType} loading={loading} dataType={1} />
							</Col>)
					}
				</Row>
				<Row gutter={24} className={styles['overview-row']}>
					{
						secondRow.map((item, index) =>
							<Col span={8} key={`2-${index}`}>
								<TopDataCard data={item} timeType={timeType} loading={loading} dataType={1} />
							</Col>)
					}
				</Row>
			</div>
		);
	}
}
export default OverviewCard;