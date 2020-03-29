import React, { PureComponent } from 'react';
import { Card } from 'antd';
import { formatMessage } from 'umi/locale';
import SingleLine from '../Charts/Line/SingleLine';

import styles from './index.less';

class PassengerTrend extends PureComponent {
	render() {
		const { passengerFlowList, loading, timeType } = this.props;
		console.log('PassengerTrend:', passengerFlowList);
		const chartOption = {
			timeType,
			data: passengerFlowList,
			linePosition: ['time*value'],
			lineColor: ['name', ['#4B7AFA', '#FFBC50', '#00BC7D']],
			area: {
				show: true,
				color: [
					'name',
					[
						'l (90) 0:rgba(75,122,250, 1) 1:rgba(75,122,250,0.1)',
						'l (90) 0:rgba(255,188,80, 1) 1:rgba(255,188,80, 0.1)',
						'l (90) 0:rgba(0,188,125, 1) 1:rgba(0,188,125, 0.1)',
					],
				],
				type: 'area',
				position: 'time*value',
			},
			lineSize: 3,
			innerTitle: '',
			chartScale: {
				time: {
					type: 'linear',
					nice: false,
					min: 0,
					// tickInterval: 2,
				},
				value: {
					type: 'linear',
					nice: true,
					min: 0,
				},
			},
			type: 'line',
			legend: {
				position: 'top-right',
				offsetX: 0,
				offsetY: 0,
				custom: false,
				marker: 'circle',
				itemFormatter: val => formatMessage({ id: `databoard.data.${val}` }), // val 为每个图例项的文本值
			},
		};
		return (
			<Card
				bordered={false}
				className={styles['line-chart-wrapper']}
				title={formatMessage({ id: 'databoard.passenger.trend.title' })}
				loading={loading}
			>
				<SingleLine {...chartOption} />
			</Card>
		);
	}
}
export default PassengerTrend;
