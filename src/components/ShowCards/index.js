import React from 'react';
import styles from './index.less';
import { formatMessage } from 'umi/locale';
import { priceFormat } from '@/utils/utils';
import { DASHBOARD } from '@/pages/DashBoard/constants';

const {
	SEARCH_TYPE: { RANGE },
} = DASHBOARD;

const TEXT = {
	TOTAL_AMOUNT: formatMessage({ id: 'dashboard.total.sales' }),
	TOTAL_AMOUNT_INFO: formatMessage({ id: 'dashboard.total.sales.info' }),
	TOTAL_COUNT: formatMessage({ id: 'dashboard.total.count' }),
	TOTAL_COUNT_INFO: formatMessage({ id: 'dashboard.total.count.info' }),
	TOTAL_REFUND: formatMessage({ id: 'dashboard.total.refund.count' }),
	TOTAL_REFUND_INFO: formatMessage({ id: 'dashboard.total.refund.count.info' }),
	AVG_UNIT: formatMessage({ id: 'dashboard.customer.unit.price' }),
	AVG_UNIT_INFO: formatMessage({ id: 'dashboard.customer.unit.price.info' }),
	D2D: formatMessage({ id: 'dashboard.order.d2d' }),
	W2W: formatMessage({ id: 'dashboard.order.w2w' }),
	M2M: formatMessage({ id: 'dashboard.order.m2m' }),
};

export default class ShowCards extends React.Component {
	render() {
		const {
			range,
			totalAmount: {
				totalAmount,
				dayAmount,
				weekAmount,
				monthAmount,
				dayRate: dayRateAmount,
				weekRate: weekRateAmount,
				monthRate: monthRateAmount,
			},

			totalCount: {
				totalCount,
				dayCount,
				weekCount,
				monthCount,
				dayRate: dayRateCount,
				weekRate: weekRateCount,
				monthRate: monthRateCount,
			},

			avgUnitSale: {
				aus,
				dayUnitSale,
				weekUnitSale,
				monthUnitSale,
				dayRate: dayRateAvg,
				weekRate: weekRateAvg,
				monthRate: monthRateAvg,
			},

			totalRefund: {
				refundCount,
				dayRefund,
				weekRefund,
				monthRefund,
				dayRate: dayRateRefund,
				weekRate: weekRateRefund,
				monthRate: monthRateRefund,
			},
		} = this.props;

		const totalAmountStore = {
			[RANGE.TODAY]: dayAmount,
			[RANGE.WEEK]: weekAmount,
			[RANGE.MONTH]: monthAmount,
			[RANGE.FREE]: totalAmount,
		};

		const totalAmountCard = {
			title: TEXT.TOTAL_AMOUNT,
			infoContent: TEXT.TOTAL_AMOUNT_INFO,
			content:
				totalAmountStore[range] || totalAmountStore[range] === 0
					? priceFormat(parseFloat(totalAmountStore[range]).toFixed(2))
					: '--',
			footer: {
				d2d: {
					label: TEXT.D2D,
					content: dayRateAmount !== '' ? dayRateAmount : '--',
					compare:
						dayRateAmount !== '' ? (parseFloat(dayRateAmount) > 0 ? 1 : 0) : -1,
				},
				w2w: {
					label: TEXT.W2W,
					content: weekRateAmount !== '' ? weekRateAmount : '--',
					compare:
						weekRateAmount !== '' ? (parseFloat(weekRateAmount) > 0 ? 1 : 0) : -1,
				},
				m2m: {
					label: TEXT.M2M,
					content: monthRateAmount !== '' ? monthRateAmount : '--',
					compare:
						monthRateAmount !== '' ? (parseFloat(monthRateAmount) > 0 ? 1 : 0) : -1,
				}
			},
		};

		const totalCountStore = {
			[RANGE.TODAY]: dayCount,
			[RANGE.WEEK]: weekCount,
			[RANGE.MONTH]: monthCount,
			[RANGE.FREE]: totalCount,
		};
		const totalCountCard = {
			title: TEXT.TOTAL_COUNT,
			infoContent: TEXT.TOTAL_COUNT_INFO,
			content: totalCountStore[range] !== '' ? totalCountStore[range] : '--',
			footer: {
				d2d: {
					label: TEXT.D2D,
					content: dayRateCount !== '' ? dayRateCount : '--',
					compare: dayRateCount !== '' ? (parseFloat(dayRateCount) > 0 ? 1 : 0) : -1,
				},
				w2w: {
					label: TEXT.W2W,
					content: weekRateCount !== '' ? weekRateCount : '--',
					compare:
						weekRateCount !== '' ? (parseFloat(weekRateCount) > 0 ? 1 : 0) : -1,
				},
				m2m: {
					label: TEXT.M2M,
					content: monthRateCount !== '' ? monthRateCount : '--',
					compare:
						monthRateCount !== '' ? (parseFloat(monthRateCount) > 0 ? 1 : 0) : -1,
				}
			},
		};

		const ausSaleStore = {
			[RANGE.TODAY]: dayUnitSale,
			[RANGE.WEEK]: weekUnitSale,
			[RANGE.MONTH]: monthUnitSale,
			[RANGE.FREE]: aus,
		};

		const avgUnitSaleCard = {
			title: TEXT.AVG_UNIT,
			infoContent: TEXT.AVG_UNIT_INFO,
			content:
				ausSaleStore[range] || ausSaleStore[range] === 0
					? parseFloat(ausSaleStore[range]).toFixed(2)
					: '--',
			footer: {
				d2d: {
					label: TEXT.D2D,
					content: dayRateAvg !== '' ? dayRateAvg : '--',
					compare: dayRateAvg !== '' ? (parseFloat(dayRateAvg) > 0 ? 1 : 0) : -1,
				},
				w2w: {
					label: TEXT.W2W,
					content: weekRateAvg !== '' ? weekRateAvg : '--',
					compare: weekRateAvg !== '' ? (parseFloat(weekRateAvg) > 0 ? 1 : 0) : -1,
				},
				m2m: {
					label: TEXT.M2M,
					content: monthRateAvg !== '' ? monthRateAvg : '--',
					compare: monthRateAvg !== '' ? (parseFloat(monthRateAvg) > 0 ? 1 : 0) : -1,
				}
			},		
		};

		const refundCountStore = {
			[RANGE.TODAY]: dayRefund,
			[RANGE.WEEK]: weekRefund,
			[RANGE.MONTH]: monthRefund,
			[RANGE.FREE]: refundCount,
		};
		const totalRefundCard = {
			title: TEXT.TOTAL_REFUND,
			infoContent: TEXT.TOTAL_REFUND_INFO,
			content: refundCountStore[range] !== '' ? refundCountStore[range] : '--',
			footer: {
				d2d: {
					label: TEXT.D2D,
					content: dayRateRefund !== '' ? dayRateRefund : '--',
					compare:
						dayRateRefund !== '' ? (parseFloat(dayRateRefund) > 0 ? 1 : 0) : -1,
				},
				w2w: {
					label: TEXT.W2W,
					content: weekRateRefund !== '' ? weekRateRefund : '--',
					compare:
						weekRateRefund !== '' ? (parseFloat(weekRateRefund) > 0 ? 1 : 0) : -1,
				},
				m2m: {
					label: TEXT.M2M,
					content: monthRateRefund !== '' ? monthRateRefund : '--',
					compare:
						monthRateRefund !== '' ? (parseFloat(monthRateRefund) > 0 ? 1 : 0) : -1,
				}
			},			
		};

		const info = [totalAmountCard, avgUnitSaleCard, totalCountCard, totalRefundCard];
		return (
			<div className={styles['show-cards']}>
				{info.map(item => (
					<Card
						key={item.title}
						title={item.title}
						num={item.content}
						dayTitle={item.footer.d2d.label}
						dayNum={item.footer.d2d.content}
						dayCompare={item.footer.d2d.compare}
						weekTitle={item.footer.w2w.label}
						weekNum={item.footer.w2w.content}
						weekCompare={item.footer.w2w.compare}
						monthTitle={item.footer.m2m.label}
						monthNum={item.footer.m2m.content}
						monthCompare={item.footer.m2m.compare}
					/>
				))}
			</div>
		);
	}
}
const Card = props => {
	const {
		title,
		dayTitle,
		dayNum,
		dayCompare,
		weekTitle,
		weekNum,
		weekCompare,
		monthTitle,
		monthNum,
		monthCompare,
	} = props;
	let { num = '0' } = props;
	num = num.toString().replace(/,/g, '');
	let showUnit = false;

	if (parseFloat(num) >= 10000) {
		num = (parseFloat(num) / 10000).toFixed(2);
		showUnit = true;
	}
	return (
		<div className={styles['card-border']}>
			<div className={styles.card}>
				<div className={styles['card-left']}>
					<div className={styles['card-left-title']}>{title}</div>
					<div className={styles['card-left-num']}>
						{num}
						{showUnit ? (
							<span
								style={{
									display: 'inline-block',
									marginLeft: 4,
									fontFamily: 'PingFangSC-light',
									fontSize: '24px',
								}}
							>
								万
							</span>
						) : (
							''
						)}
					</div>
				</div>
				<div className={styles['card-right']}>
					<div className={styles['card-right-count']}>
						<div className={styles['card-right-title']}>{dayTitle}</div>
						<div className={styles['card-right-num']}>
							{dayNum}%
							<span
								className={styles.compare}
								style={{
									background:
										dayCompare !== -1
											? `url(${
												dayCompare === 1
													? require('./ic_up.svg')
													: require('./ic_down.svg')
											  })`
											: 'transparent',
								}}
							/>
						</div>
					</div>
					<div className={styles['card-right-count']}>
						<div className={styles['card-right-title']}>{weekTitle}</div>
						<div className={styles['card-right-num']}>
							{weekNum}%
							<span
								className={styles.compare}
								style={{
									background:
										weekCompare !== -1
											? `url(${
												weekCompare === 1
													? require('./ic_up.svg')
													: require('./ic_down.svg')
											  })`
											: 'transparent',
								}}
							/>
						</div>
					</div>
					<div className={styles['card-right-count']}>
						<div className={styles['card-right-title']}>{monthTitle}</div>
						<div className={styles['card-right-num']}>
							{monthNum}%
							<span
								className={styles.compare}
								style={{
									background:
										monthCompare !== -1
											? `url(${
												monthCompare === 1
													? require('./ic_up.svg')
													: require('./ic_down.svg')
											  })`
											: 'transparent',
								}}
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
