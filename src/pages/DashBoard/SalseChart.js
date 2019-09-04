import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import { Card, Skeleton } from 'antd';
import LinePoint from '@/components/Charts/LinePoint';
import { DASHBOARD } from './constants';

import styles from './DashBoard.less';

const {
	SEARCH_TYPE: { RANGE },
	TIME_TICKS,
} = DASHBOARD;

const TIME_SCALE = {
	[RANGE.TODAY]: {
		ticks: [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24],
	},
	[RANGE.WEEK]: {
		ticks: [1, 2, 3, 4, 5, 6, 7],
	},
	[RANGE.MONTH]: {
		ticks: TIME_TICKS.MONTH,
	},
};

const CardTitle = ({ loading = true, fsDevice = null }) => (
	<Skeleton paragraph={false} loading={loading} active>
		<span>
			{fsDevice
				? formatMessage({ id: 'trade.transfer.trend' })
				: formatMessage({ id: 'trade.transfer.count.trend' })}
		</span>
	</Skeleton>
);

const formatXLabel = (value, rangeType) => {
	if (rangeType === RANGE.TODAY) {
		const t = parseInt(value, 10);
		return t > 9 ? `${t}:00` : `0${t}:00`;
	}

	if (rangeType === RANGE.WEEK) {
		return formatMessage({ id: `common.week.${value}` });
	}

	return value;
};

@connect(({ ipcList, dashboard }) => ({
	ipcList,
	passengerOrderLoading: dashboard.passengerOrderLoading,
	passengerOrderList: dashboard.passengerOrderList,
	searchValue: dashboard.searchValue,
}))
class SalseChart extends PureComponent {
	render() {
		const {
			ipcList = [],
			searchValue: { rangeType },
			passengerOrderLoading,
			passengerOrderList,
		} = this.props;
		const fsDevice = ipcList.find(ipc => ipc.type.indexOf('FS') > -1);

		let chartScale = {};
		let chartTip = {};
		let itemTpl = '';
		if (fsDevice) {
			chartScale = {
				passengerFlowRate: {
					minLimit: 0,
					maxLimit: 100,
					ticks: [0, 20, 40, 60, 80, 100],
				},
				time: {
					...(TIME_SCALE[rangeType] || []),
				},
			};

			itemTpl = `
				<li class="g2-tooltip-list-item" data-index={index} style="color:#ffffff;">
					<div>${formatMessage({ id: 'salse.time' })}: {time}</div>
					<div>${formatMessage({ id: 'salse.count' })}: {orderCount}</div>
					<div>${formatMessage({ id: 'shop.customers' })}: {passengerFlowCount}</div>
					<div>${formatMessage({ id: 'trade.transfer' })}: {passengerFlowRate}%</div>
				</li>
			`;

			chartTip = [
				'time*passengerFlowRate*orderCount*passengerFlowCount',
				(time, passengerFlowRate, orderCount, passengerFlowCount) => ({
					time: time > 9 ? `${time}:00` : `0${time}:00`,
					passengerFlowRate,
					orderCount,
					passengerFlowCount,
				}),
			];
		}

		return (
			<Card
				loading={passengerOrderLoading}
				title={<CardTitle loading={passengerOrderLoading} fsDevice={fsDevice} />}
				className={`${styles['card-bar-wrapper']}  ${
					passengerOrderLoading ? '' : styles['salse-chart']
				}`}
			>
				{passengerOrderList.length > 0 && (
					<LinePoint
						{...{
							data: passengerOrderList,
							scale: chartScale,
							tooltip: { itemTpl, useHtml: true },
							axis: {
								x: {
									name: 'time',
									label: {
										formatter: val => formatXLabel(val, rangeType),
									},
								},
								y: {
									name: 'passengerFlowRate',
									label: {
										formatter: val => `${val}%`,
									},
								},
							},
							line: {
								position: 'time*passengerFlowRate',
								color: ['passengerFlowRate', '#25B347'],
								tooltip: chartTip,
							},
							point: {
								position: 'time*passengerFlowRate',
								color: ['passengerFlowRate', '#25B347'],
								tooltip: chartTip,
							},
						}}
					/>
				)}
			</Card>
		);
	}
}

export default SalseChart;
