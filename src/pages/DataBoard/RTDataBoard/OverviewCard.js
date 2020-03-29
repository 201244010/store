import React, { PureComponent } from 'react';
import { Row, Col } from 'antd';
import { formatMessage } from 'umi/locale';
import TopDataCard from '../Charts/TopDataCard/TopDataCard';
import styles from './index.less';

const TIME_TIP = {
	1: formatMessage({ id: 'databoard.realtime.day.tip'}),
	2: formatMessage({ id: 'databoard.realtime.week.tip'}),
	3: formatMessage({ id: 'databoard.realtime.month.tip'}),
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
			case 'deviceCount':
				toolTipText = formatMessage({ id: 'databoaed.device.tip'});
				break;
			case 'totalAmount':
				toolTipText = `${TIME_TIP[timeType]}${formatMessage({ id: 'databoaed.amount.tip'})}`;
				break;
			case 'totalCount':
				toolTipText = `${TIME_TIP[timeType]}${formatMessage({ id: 'databoaed.count.tip'})}`;
				break;
			case 'transactionRate':
				toolTipText = `${TIME_TIP[timeType]}${formatMessage({ id: 'databoaed.transaction.rate.tip'})}`;
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
			loading, RTEnteringRate, RTPassengerCount, RTDeviceCount,
			paymentTotalAmount, paymentTotalCount, transactionRate, timeType, goToPath,
			startQueryTime, endQueryTime
		} = this.props;
		console.log('=======RTOverviewCard', RTPassengerCount, paymentTotalAmount, loading );
		const firstRow = [RTPassengerCount, RTEnteringRate, RTDeviceCount];
		// const secondRow = [paymentTotalAmount, paymentTotalCount, transactionRate];

		return (
			<div className={styles.overview}>
				<Row gutter={24} className={styles['overview-row']}>
					{
						firstRow.map((item, index) =>
							<Col span={8} key={`1-${index}`}>
								<TopDataCard data={this.handleAddToolTip(item)} timeType={timeType} loading={loading} dataType={1} />
							</Col>)
					}
				</Row>
				<Row gutter={24} className={styles['overview-row']}>
					<Col span={8}>
						<TopDataCard
							{...{
								data: this.handleAddToolTip(paymentTotalAmount),
								timeType,
								loading,
								dataType: 1,
								onClick: () =>
									goToPath('orderDetail', {
										timeRangeStart: startQueryTime,
										timeRangeEnd: endQueryTime,
									}),
							}}
						/>
					</Col>
					<Col span={8}>
						<TopDataCard
							{...{
								data: this.handleAddToolTip(paymentTotalCount),
								timeType,
								loading,
								dataType: 1,
								onClick: () =>
									goToPath('orderDetail', {
										timeRangeStart: startQueryTime,
										timeRangeEnd: endQueryTime,
									}),
							}}
						/>
					</Col>
					<Col span={8}>
						<TopDataCard data={this.handleAddToolTip(transactionRate)} timeType={timeType} loading={loading} dataType={1} />
					</Col>
				</Row>
			</div>
		);
	}
}
export default OverviewCard;