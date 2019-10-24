import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import { Card, Skeleton } from 'antd';
import moment from 'moment';
import { format } from '@konata9/milk-shake';
import LinePoint from '@/components/Charts/LinePoint';
import Bar from '@/components/Charts/Bar';
import { DASHBOARD } from './constants';
import styles from './DashBoard.less';

const {
	SEARCH_TYPE: { RANGE },
	TIME_TICKS,
} = DASHBOARD;

const CHART_MODE = {
	TRADE_TRANS: 'tradeTrans',
	TRADE_BAR: 'tradeBar',
	CUSTOMER_BAR: 'customerBar',
};

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

const CardTitle = ({ loading = true, mode = null }) => {
	const title = {
		[CHART_MODE.TRADE_BAR]: formatMessage({ id: 'trade.transfer.count.trend' }),
		[CHART_MODE.CUSTOMER_BAR]: formatMessage({ id: 'customer.count.trend' }),
		default: formatMessage({ id: 'trade.transfer.trend' }),
	};

	return (
		<Skeleton paragraph={false} loading={loading} active>
			<span>{title[mode] || title.default}</span>
		</Skeleton>
	);
};

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

@connect(
	({ ipcList, dashboard }) => ({
		ipcList,
		passengerOrderLoading: dashboard.passengerOrderLoading,
		passengerOrderList: dashboard.passengerOrderList,
		searchValue: dashboard.searchValue,
	}),
	dispatch => ({
		getShopIdFromStorage: () => dispatch({ type: 'global/getShopIdFromStorage' }),
		getShopListFromStorage: () => dispatch({ type: 'global/getShopListFromStorage' }),
	})
)
class SalseChart extends PureComponent {
	constructor(props) {
		super(props);
		this.chartRef = React.createRef();
	}

	async componentDidMount() {
		const { ipcList, getShopIdFromStorage, getShopListFromStorage } = this.props;
		const currentShopId = await getShopIdFromStorage();
		const shopList = await getShopListFromStorage();

		// console.log(shopList.filter(shop => shop.saas_exist === 1));
		const currentShopInfo = format('toCamel')(
			shopList.find(shop => format('toCamel')(shop).shopId === currentShopId) || {}
		);
		// console.log(currentShopInfo);
		this.hasFsDevice = ipcList.some(ipc => ipc.hasFaceid);
		this.saasExist = currentShopInfo.saasExist || 0;

		this.chartMode = CHART_MODE.TRADE_TRANS;
		if (this.hasFsDevice && !this.saasExist) {
			this.chartMode = CHART_MODE.CUSTOMER_BAR;
		} else if (!this.hasFsDevice && this.saasExist) {
			this.chartMode = CHART_MODE.TRADE_BAR;
		}
		console.log('has fs: ', this.hasFsDevice);
		console.log('has saas: ', this.saasExist);
		console.log('chart mode:', this.chartMode);
	}

	render() {
		const {
			searchValue: { rangeType, timeRangeStart, timeRangeEnd },
			passengerOrderLoading,
			passengerOrderList,
		} = this.props;
		const { current } = this.chartRef;
		const { clientWidth = null } = current || {};
		const chartWidth = Math.round(clientWidth * 0.95);

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
		let DataChart = () => <div />;

		if (this.chartMode === CHART_MODE.TRADE_BAR) {
			// 无 FS，有 SaaS => 交易笔数柱状图
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

			itemTpl = `
				<li class="g2-tooltip-list-item" data-index={index} style="color:#ffffff;">
					<div>${formatMessage({ id: 'salse.time' })}: {time}</div>
					<div>${formatMessage({ id: 'salse.count' })}: {orderCount}</div>
				</li>
			`;

			chartTip = [
				'time*orderCount',
				(time, orderCount) => ({
					time: formatXLabel(time, rangeType, timeRangeStart, timeRangeEnd),
					orderCount,
				}),
			];

			DataChart = () => (
				<Bar
					{...{
						chartStyle: {
							width: chartWidth,
							forceFit: false,
							scale: chartScale,
						},
						axis: {
							x: 'time',
							y: 'orderCount',
							xLabel: { formatter: val => formatXLabel(val, rangeType) },
						},
						tooltip: { itemTpl, useHtml: true },
						dataSource: passengerOrderList,
						barStyle: {
							barColor: '#22A3FF',
							barActive: true,
							position: 'time*orderCount',
							tooltip: chartTip,
						},
					}}
				/>
			);
		} else if (this.chartMode === CHART_MODE.CUSTOMER_BAR) {
			// 有 FS，无 SaaS => 客流柱状图
			const maxFlowCount =
				Math.max(...passengerOrderList.map(i => i.passengerFlowCount)) || 0;
			const flowTicks =
				maxFlowCount < 5
					? { ticks: [1, 2, 3, 4, 5] }
					: { tickInterval: Math.ceil(maxFlowCount / 5) };

			chartScale = {
				...chartScale,
				passengerFlowCount: {
					minLimit: 0,
					...flowTicks,
				},
			};

			itemTpl = `
			<li class="g2-tooltip-list-item" data-index={index} style="color:#ffffff;">
				<div>${formatMessage({ id: 'salse.time' })}: {time}</div>
				<div>${formatMessage({ id: 'customer.count' })}: {passengerFlowCount}</div>
			</li>
		`;

			chartTip = [
				'time*passengerFlowCount',
				(time, passengerFlowCount) => ({
					time: formatXLabel(time, rangeType, timeRangeStart, timeRangeEnd),
					passengerFlowCount,
				}),
			];

			DataChart = () => (
				<Bar
					{...{
						chartStyle: {
							width: chartWidth,
							forceFit: false,
							scale: chartScale,
						},
						axis: {
							x: 'time',
							y: 'passengerFlowCount',
							xLabel: { formatter: val => formatXLabel(val, rangeType) },
						},
						tooltip: { itemTpl, useHtml: true },
						dataSource: passengerOrderList,
						barStyle: {
							barColor: '#22A3FF',
							barActive: true,
							position: 'time*passengerFlowCount',
							tooltip: chartTip,
						},
					}}
				/>
			);
		} else {
			const passengerTicks = { minLimit: 0, maxLimit: 100, ticks: [0, 20, 40, 60, 80, 100] };
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

			DataChart = () => (
				<LinePoint
					{...{
						width: chartWidth,
						forceFit: false,
						data: passengerOrderList,
						scale: chartScale,
						tooltip: { itemTpl, useHtml: true },
						axis: {
							x: {
								name: 'time',
								label: {
									formatter: val =>
										formatXLabel(val, rangeType, timeRangeStart, timeRangeEnd),
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
							shape: '',
						},
						point: {
							position: 'time*passengerFlowRate',
							color: ['passengerFlowRate', '#25B347'],
							tooltip: chartTip,
						},
					}}
				/>
			);
		}

		return (
			<div ref={this.chartRef}>
				<Card
					loading={passengerOrderLoading}
					title={<CardTitle loading={passengerOrderLoading} mode={this.chartMode} />}
					className={`${styles['card-bar-wrapper']}  ${
						passengerOrderLoading ? '' : styles['salse-chart']
					}`}
				>
					{chartWidth && <DataChart />}
				</Card>
			</div>
		);
	}
}

export default SalseChart;
