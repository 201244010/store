import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import { Card, Skeleton } from 'antd';
import moment from 'moment';
import LinePoint from '@/components/Charts/LinePoint';
import Bar from '@/components/Charts/Bar';
import { DASHBOARD } from './constants';
import { salseChartToolTipStyle } from './chartStyle';
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

const formatXLabel = (value, rangeType, timeRangeStart, timeRangeEnd) => {
	if (rangeType === RANGE.TODAY) {
		const t = parseInt(value, 10);
		return t > 9 ? `${t}:00` : `0${t}:00`;
	}

	if (rangeType === RANGE.WEEK) {
		return formatMessage({ id: `common.week.${value}` });
	}

	if (rangeType === RANGE.MONTH) {
		return moment()
			.startOf('month')
			.add(value - 1, 'day')
			.format('MM/DD');
	}

	if (rangeType === RANGE.FREE) {
		if (moment(timeRangeStart).isSame(timeRangeEnd, 'day')) {
			const t = parseInt(value, 10);
			return t > 9 ? `${t}:00` : `0${t}:00`;
		}
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
			searchValue: { rangeType, timeRangeStart, timeRangeEnd },
			passengerOrderLoading,
			passengerOrderList,
		} = this.props;
		const fsDevice = ipcList.some(ipc => ipc.hasFaceid);

		let chartScale = {
			time: {
				...(TIME_SCALE[rangeType] || {
					ticks: passengerOrderList
						.filter((_, index) => {
							const len = passengerOrderList.length;
							if (len < 10) {
								return true;
							}

							if (len < 40) {
								return index % 2 === 0;
							}

							return index % 3 === 0;
						})
						.map(item => item.time),
				}),
			},
		};
		let chartTip = {};
		let itemTpl = '';
		if (fsDevice) {
			const maxFlowRate = Math.max(
				...passengerOrderList.map(order => order.passengerFlowRate || 0)
			);

			const passengerTicks =
				maxFlowRate > 100
					? {}
					: { minLimit: 0, maxLimit: 100, ticks: [0, 20, 40, 60, 80, 100] };

			chartScale = {
				...chartScale,
				passengerFlowRate: passengerTicks,
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
					time: formatXLabel(time, rangeType, timeRangeStart, timeRangeEnd),
					passengerFlowRate,
					orderCount,
					passengerFlowCount,
				}),
			];
		} else {
			const maxOrderCount = Math.max(...passengerOrderList.map(i => i.orderCount)) || 0;
			const orderTicks =
				maxOrderCount < 5
					? { ticks: [1, 2, 3, 4, 5] }
					: { tickInterval: Math.ceil(maxOrderCount / 5) };

			chartScale = {
				...chartScale,
				orderCount: {
					minLimit: 0,
					...orderTicks,
				},
			};
		}

		return (
			<Card
				loading={passengerOrderLoading}
				title={<CardTitle loading={passengerOrderLoading} fsDevice={fsDevice} />}
				className={`${styles['card-bar-wrapper']}  ${
					passengerOrderLoading || !fsDevice ? '' : styles['salse-chart']
				}`}
			>
				{fsDevice ? (
					passengerOrderList.length > 0 && (
						<LinePoint
							{...{
								data: passengerOrderList,
								scale: chartScale,
								tooltip: { itemTpl, useHtml: true },
								axis: {
									x: {
										name: 'time',
										label: {
											formatter: val =>
												formatXLabel(
													val,
													rangeType,
													timeRangeStart,
													timeRangeEnd
												),
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
					)
				) : (
					<Bar
						{...{
							chartStyle: {
								scale: chartScale,
							},
							axis: {
								x: 'time',
								y: 'orderCount',
								xLabel: { formatter: val => formatXLabel(val, rangeType) },
							},
							dataSource: passengerOrderList,
							barStyle: {
								barActive: true,
								position: 'time*orderCount',
								tooltip: [
									'time*orderCount',
									(time, orderCount) => ({
										name: `${formatMessage({
											id: 'salse.time',
										})}:${formatXLabel(
											time,
											rangeType,
											timeRangeStart,
											timeRangeEnd
										)}`,
										value: orderCount,
									}),
								],
							},
							toolTipStyle: salseChartToolTipStyle,
						}}
					/>
				)}
			</Card>
		);
	}
}

export default SalseChart;
