import React, { PureComponent } from 'react';
import { Card, Radio } from 'antd';
import SingleLine from '../Charts/Line/SingleLine';
import styles from './index.less';

const TAB = {
	AMOUNT: 'amount',
	COUNT: 'count',
	RATE: 'rate',
};

class TransactionTrend extends PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			currentTab: TAB.AMOUNT
		};
	}

	handleSwitchTab = (e) => {
		const {
			target: { value },
		} = e;
		this.setState({
			currentTab: value
		});
	}

	render() {
		const { amountList, countList, transactionRateList, loading, timeType} = this.props;
		const { currentTab } = this.state;
		const amountChartOption = {
			timeType,
			data: amountList,
			lineColor: ['value', 'rgb(255,129,51)'],
			area: {
				// 是否填充面积
				show: true,
				color: ['l (90) 0:rgba(255,129,51, 1) 1:rgba(255,129,51,0)'],
				type: 'area',
				position: 'time*value',
			},
			linesize: 4,
			// innerTitle: 'chart title area=true',
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
		};
		const rateChartOption = {
			timeType,
			data: transactionRateList,
			lineColor: ['value', 'rgb(255,188,80)'],
			area: {
				// 是否填充面积
				show: false,
				color: ['l (90) 0:rgba(255,188,80, 1) 1:rgba(255,188,80,0.1)'],
				type: 'area',
				position: 'time*value',
			},
			linesize: 3,
			// innerTitle: 'chart title area=true',
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
		};
		const countChartOption = {
			timeType,
			data: countList,
			lineColor: 'l(270) 0:rgba(255,161,102,1) 1:rgba(255,129,51,1)',
			type: 'interval',
			// innerTitle: 'Bar AxisX：时间维度',
			lineActive: [
				true,
				{
					highlight: true,
					style: {
						fill: 'l(270) 0:rgba(255,161,102,1) 1:rgba(255,129,51,1)',
					},
				},
			],
		};
		return(
			<Card
				bordered={false}
				className={styles['line-chart-wrapper']}
				title="经营趋势"
				loading={loading}
				extra={
					<Radio.Group
						value={currentTab}
						onChange={this.handleSwitchTab}
					>
						<Radio.Button className={styles['chart-tab']} value={TAB.AMOUNT}>
							销售额
						</Radio.Button>
						<Radio.Button className={styles['chart-tab']} value={TAB.COUNT}>
							交易笔数
						</Radio.Button>
						<Radio.Button className={styles['chart-tab']} value={TAB.RATE}>
							转化率
						</Radio.Button>
					</Radio.Group>}
			>
				{
					currentTab === TAB.AMOUNT ? <SingleLine {...amountChartOption} /> : ''
				}
				{
					currentTab === TAB.COUNT ? <SingleLine {...countChartOption} /> : ''
				}
				{
					currentTab === TAB.RATE ? <SingleLine {...rateChartOption} /> : ''
				}
			</Card>
		);
	}
}
export default TransactionTrend;