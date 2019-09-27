import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import { Card } from 'antd';
import LinePoint from '@/components/Charts/LinePoint';

import styles from './passengerAnalyze.less';

@connect(({ passengerAnalyze, loading }) => ({
	loading,
	passengerFlowTrendList: passengerAnalyze.passengerFlowTrendList,
}))
class PassengerChart extends PureComponent {
	render() {
		const { passengerFlowTrendList, loading } = this.props;
		const timeTicks = passengerFlowTrendList.reduce((prev, cur) => {
			const { time } = cur;
			if (!prev.includes(time)) {
				prev.push(time);
			}
			return prev;
		}, []);

		const chartScale = {
			time: {
				ticks:
					timeTicks.length > 7
						? timeTicks.filter((_, index) => index % 2 === 0)
						: timeTicks,
			},
			count: {
				min: 0,
				minLimit: 0,
			},
		};

		const itemTpl = `
			<li class="g2-tooltip-list-item" data-index={index} style="color:#ffffff;">
				<div>${formatMessage({ id: 'passengerAnalyze.chart.date' })}: {time}</div>
				<div>${formatMessage({ id: 'passengerAnalyze.chart.passenger' })}: {passengerTypeDisplay}</div>
				<div>${formatMessage({ id: 'passengerAnalyze.chart.count' })}: {count}</div>
			</li>
		`;

		const chartTip = [
			'time*count*passengerTypeDisplay',
			(time, count, passengerTypeDisplay) => ({
				time,
				count,
				passengerTypeDisplay,
			}),
		];

		return (
			<div className={styles['passenger-chart-wrapper']}>
				<Card
					bordered={false}
					loading={loading.effects['passengerAnalyze/getPassengerFlowHistoryTrend']}
				>
					<h4 className={styles['chart-header']}>
						{formatMessage({ id: 'passengerAnalyze.trend' })}
					</h4>
					<LinePoint
						{...{
							data: passengerFlowTrendList,
							scale: chartScale,
							tooltip: { itemTpl, useHtml: true },
							height: 300,
							padding: ['10%', '5%'],
							legend: { position: 'top-right', offsetY: 25 },
							line: {
								position: 'time*count',
								color: ['passengerTypeDisplay', ['#25B347', '#FEDA75', '#01CC99']],
								shape: '',
							},
							point: {
								position: 'time*count',
								color: ['passengerTypeDisplay', ['#25B347', '#FEDA75', '#01CC99']],
								tooltip: chartTip,
							},
						}}
					/>
				</Card>
			</div>
		);
	}
}

export default PassengerChart;
