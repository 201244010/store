import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import { Card } from 'antd';
import LinePoint from '@/components/Charts/LinePoint';
import styles from './DashBoard.less';

const data = [
	{
		month: 'Jan',
		city: 'Tokyo',
		temperature: 7,
	},
	{
		month: 'Feb',
		city: 'Tokyo',
		temperature: 6.9,
	},
	{
		month: 'Mar',
		city: 'Tokyo',
		temperature: 9.5,
	},
	{
		month: 'Apr',
		city: 'Tokyo',
		temperature: 14.5,
	},
	{
		month: 'May',
		city: 'Tokyo',
		temperature: 18.4,
	},
	{
		month: 'Jun',
		city: 'Tokyo',
		temperature: 21.5,
	},
	{
		month: 'Jul',
		city: 'Tokyo',
		temperature: 25.2,
	},
	{
		month: 'Aug',
		city: 'Tokyo',
		temperature: 26.5,
	},
	{
		month: 'Sep',
		city: 'Tokyo',
		temperature: 23.3,
	},
	{
		month: 'Oct',
		city: 'Tokyo',
		temperature: 18.3,
	},
	{
		month: 'Nov',
		city: 'Tokyo',
		temperature: 13.9,
	},
	{
		month: 'Dec',
		city: 'Tokyo',
		temperature: 9.6,
	},
];

@connect(state => ({
	ipcList: state.ipcList,
}))
class SalseChart extends PureComponent {
	render() {
		const { ipcList = [] } = this.props;
		console.log(ipcList);

		return (
			<Card
				title={formatMessage({ id: 'trade.transfer.trend' })}
				className={`${styles['card-bar-wrapper']} ${styles['salse-chart']}`}
			>
				<LinePoint
					{...{
						data,
						axis: {
							x: { name: 'temperature' },
							y: { name: 'month' },
						},
						line: {
							position: 'month*temperature',
							color: 'city',
						},
						point: {
							position: 'month*temperature',
							color: 'city',
						},
					}}
				/>
			</Card>
		);
	}
}

export default SalseChart;
