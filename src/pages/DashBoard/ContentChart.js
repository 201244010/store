import React, { PureComponent } from 'react';
import { formatMessage } from 'umi/locale';
import moment from 'moment';
import Media from 'react-media';
import { Row, Col, Radio, Skeleton } from 'antd';
import Charts from '@/components/Charts';
import { priceFormat } from '@/utils/utils';
import { DASHBOARD } from './constants';

import styles from './DashBoard.less';

const {
	SEARCH_TYPE: { TRADE_TIME, RANGE },
	TIME_TICKS,
} = DASHBOARD;

const { Bar } = Charts;

const TwinList = props => {
	const { leftList, rightList } = props;
	return (
		<div className={styles['twin-list-wrapper']}>
			<ul className={styles['content-list']}>
				{leftList.map((item, index) => (
					<li key={index} className={styles['list-item']}>
						<div className={styles['label-wrapper']}>
							<div
								className={`${styles.rank} ${
									index < 3 ? styles['rank-primary'] : ''
								}`}
							>
								{index + 1}
							</div>
							<div className={styles.label}>{item.name}</div>
						</div>
						<div className={styles['number-content']}>{priceFormat(item.quantity)}</div>
					</li>
				))}
			</ul>
			<ul className={styles['content-list']}>
				{rightList.map((item, index) => (
					<li key={index} className={styles['list-item']}>
						<div className={styles['label-wrapper']}>
							<div className={styles.rank}>{index + 6}</div>
							<div className={styles.label}>{item.name}</div>
						</div>
						<div className={styles['number-content']}>{priceFormat(item.quantity)}</div>
					</li>
				))}
			</ul>
		</div>
	);
};

const SingleList = props => {
	const { data } = props;
	return (
		<ul className={styles['content-list']}>
			{data.map((item, index) => (
				<li key={index} className={styles['list-item']}>
					<div className={styles['label-wrapper']}>
						<div
							className={`${styles.rank} ${index < 3 ? styles['rank-primary'] : ''}`}
						>
							{index + 1}
						</div>
						<div className={styles.label}>{item.name}</div>
					</div>
					<div className={styles['number-content']}>{priceFormat(item.quantity)}</div>
				</li>
			))}
		</ul>
	);
};

const timeScales = {
	[RANGE.TODAY]: {
		ticks: TIME_TICKS.HOUR,
	},
	[RANGE.WEEK]: { tickCount: 7 },
	[RANGE.MONTH]: { ticks: TIME_TICKS.MONTH },
};

export const formatTime = (time, rangeType) => {
	const timeData = moment.unix(time).local();

	if (rangeType === RANGE.TODAY) {
		return timeData.format('HH:mm');
	}

	if (rangeType === RANGE.WEEK) {
		return timeData.format('ddd');
	}

	if (rangeType === RANGE.MONTH) {
		return timeData.format('D');
	}

	return timeData.format('M/D');
};

class ContentChart extends PureComponent {
	constructor(props) {
		super(props);
		this.timer = null;
		this.state = {
			switchLoading: false,
		};
	}

	componentWillUnmount() {
		clearTimeout(this.timer);
	}

	handleRadioChange = e => {
		const { setSearchValue } = this.props;
		const {
			target: { value },
		} = e;

		this.setState({
			switchLoading: true,
		});

		this.timer = setTimeout(() => {
			clearTimeout(this.timer);
			this.setState({ switchLoading: false });
			setSearchValue({
				tradeTime: value,
			});
		}, 500);
	};

	render() {
		const {
			searchValue: { tradeTime, rangeType },
			orderList,
			skuRankList,
			barLoading,
			skuLoading,
		} = this.props;
		const { switchLoading } = this.state;

		const dataList = orderList.map(data => ({
			time: formatTime(data.time, rangeType),
			[tradeTime]: data[tradeTime],
		}));

		const chartToolTip = [
			`time*${tradeTime}`,
			(time, value) => ({
				title: `${formatMessage({
					id: 'dashboard.trade.date',
				})}: ${time} ${
					[RANGE.MONTH, RANGE.FREE].includes(rangeType)
						? formatMessage({ id: 'dashboard.trade.date.unit' })
						: ''
				}`,
				name: `${
					tradeTime === TRADE_TIME.AMOUNT
						? formatMessage({
							id: 'dashboard.trade.amount',
						  })
						: formatMessage({
							id: 'dashboard.trade.count',
						  })
				}: ${value}`,
			}),
		];

		const toolTipStyle = {
			'g2-tooltip': {
				background: 'rgba(48,53,64,0.70)',
				'box-shadow': '0 2px 8px 0 rgba(0,0,0,0.15)',
				'border-radius': '2px',
				color: '#ffffff',
			},
			'g2-tooltip-marker': {
				display: 'none',
			},
		};

		const chartScale = {
			time: timeScales[rangeType] || {
				ticks: dataList
					.filter((_, index) => {
						const len = dataList.length;
						if (len > 10 && len < 40) {
							return index % 2 === 0;
						}
						return index % 3 === 0;
					})
					.map(item => item.time),
			},
			[TRADE_TIME.AMOUNT]: {
				minLimit: 0,
				tickCount: 6,
			},
			[TRADE_TIME.COUNT]: {
				minLimit: 0,
				// tickCount: 6,
			},
		};

		return (
			<div className={styles['content-chart']}>
				<Media query={{ maxWidth: 1439 }}>
					{result => (
						<Row gutter={result ? 0 : 24}>
							<Col span={result ? 24 : 18}>
								<div
									className={styles['bar-wrapper']}
									style={barLoading || switchLoading ? { padding: '24px' } : {}}
								>
									<Skeleton active loading={barLoading || switchLoading}>
										<div className={styles['title-wrapper']}>
											<div className={styles['bar-title']}>
												{formatMessage({ id: 'dashboard.trade.time' })}
											</div>
											<div className={styles['bar-radio']}>
												<Radio.Group
													value={tradeTime}
													onChange={this.handleRadioChange}
												>
													<Radio.Button value={TRADE_TIME.AMOUNT}>
														{formatMessage({
															id: 'dashboard.order.sales',
														})}
													</Radio.Button>
													<Radio.Button value={TRADE_TIME.COUNT}>
														{formatMessage({
															id: 'dashboard.order.count',
														})}
													</Radio.Button>
												</Radio.Group>
											</div>
										</div>
										<div className={styles['bar-wrapper']}>
											<Bar
												{...{
													chartStyle: {
														scale: chartScale,
													},
													axis: { x: 'time', y: tradeTime },
													dataSource: dataList,
													barStyle: {
														barActive: [
															true,
															{
																style: {
																	fill: '#FF8133',
																	shadowColor: 'red',
																	shadowBlur: 1,
																	opacity: 0,
																},
															},
														],
														position: `time*${tradeTime}`,
														tooltip: chartToolTip,
													},
													toolTipStyle,
												}}
											/>
										</div>
									</Skeleton>
								</div>
							</Col>
							<Col span={result ? 24 : 6}>
								<div
									className={`${styles['list-wrapper']} ${
										result ? styles['list-wrapper-top'] : ''
									}`}
									style={skuLoading ? { padding: '24px' } : {}}
								>
									<Skeleton active loading={skuLoading}>
										<div className={styles['list-title']}>
											{formatMessage({ id: 'dashboard.sku.rate' })}
										</div>
										{result ? (
											<TwinList
												leftList={skuRankList.slice(0, 5)}
												rightList={skuRankList.slice(5)}
											/>
										) : (
											<SingleList data={skuRankList} />
										)}
									</Skeleton>
								</div>
							</Col>
						</Row>
					)}
				</Media>
			</div>
		);
	}
}

export default ContentChart;
