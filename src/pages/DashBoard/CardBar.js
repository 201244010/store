import React, { Component } from 'react';
import { formatMessage } from 'umi/locale';
import Media from 'react-media';
import { Col, Row } from 'antd';
import RiseDownTag from '@/components/Tag/RiseDownTag';
import DisplayCard from '@/components/DisplayCard';

import { priceFormat } from '@/utils/utils';
import { DASHBOARD } from '@/pages/DashBoard/constants';
import styles from './DashBoard.less';

const {
	SEARCH_TYPE: { RANGE },
} = DASHBOARD;

const ringRateStyle = {
	width: '100%',
	display: 'flex',
	justifyContent: 'space-between',
};

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

const RingRate = props => {
	const { d2d = {}, w2w = {}, m2m = {} } = props;
	return (
		<div style={ringRateStyle}>
			<RiseDownTag label={d2d.label} content={d2d.content} />
			<Media
				query={{ minWidth: 1440 }}
				render={() => <RiseDownTag label={w2w.label} content={w2w.content} />}
			/>
			<Media
				query={{ minWidth: 1920 }}
				render={() => <RiseDownTag label={m2m.label} content={m2m.content} />}
			/>
		</div>
	);
};

class CardBar extends Component {
	render() {
		const {
			totalAmountLoading,
			totalCountLoading,
			totalRefundLoading,
			avgUnitLoading,

			searchValue: { rangeType } = {},
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
			loading: totalAmountLoading,
			title: TEXT.TOTAL_AMOUNT,
			infoContent: TEXT.TOTAL_AMOUNT_INFO,
			content:
				totalAmountStore[rangeType] || totalAmountStore[rangeType] === 0
					? priceFormat(parseFloat(totalAmountStore[rangeType]).toFixed(2))
					: '--',
			footer: (
				<RingRate
					d2d={{
						label: TEXT.D2D,
						content: dayRateAmount,
					}}
					w2w={{
						label: TEXT.W2W,
						content: weekRateAmount,
					}}
					m2m={{
						label: TEXT.M2M,
						content: monthRateAmount,
					}}
				/>
			),
		};

		const totalCountStore = {
			[RANGE.TODAY]: dayCount,
			[RANGE.WEEK]: weekCount,
			[RANGE.MONTH]: monthCount,
			[RANGE.FREE]: totalCount,
		};
		const totalCountCard = {
			loading: totalCountLoading,
			title: TEXT.TOTAL_COUNT,
			infoContent: TEXT.TOTAL_COUNT_INFO,
			content: totalCountStore[rangeType] !== '' ? totalCountStore[rangeType] : '--',
			footer: (
				<RingRate
					d2d={{
						label: TEXT.D2D,
						content: dayRateCount,
					}}
					w2w={{
						label: TEXT.W2W,
						content: weekRateCount,
					}}
					m2m={{
						label: TEXT.M2M,
						content: monthRateCount,
					}}
				/>
			),
		};

		const ausSaleStore = {
			[RANGE.TODAY]: dayUnitSale,
			[RANGE.WEEK]: weekUnitSale,
			[RANGE.MONTH]: monthUnitSale,
			[RANGE.FREE]: aus,
		};

		const avgUnitSaleCard = {
			loading: avgUnitLoading,
			title: TEXT.AVG_UNIT,
			infoContent: TEXT.AVG_UNIT_INFO,
			content:
				ausSaleStore[rangeType] || ausSaleStore[rangeType] === 0
					? parseFloat(ausSaleStore[rangeType]).toFixed(2)
					: '--',
			footer: (
				<RingRate
					d2d={{
						label: TEXT.D2D,
						content: dayRateAvg,
					}}
					w2w={{
						label: TEXT.W2W,
						content: weekRateAvg,
					}}
					m2m={{
						label: TEXT.M2M,
						content: monthRateAvg,
					}}
				/>
			),
		};

		const refundCountStore = {
			[RANGE.TODAY]: dayRefund,
			[RANGE.WEEK]: weekRefund,
			[RANGE.MONTH]: monthRefund,
			[RANGE.FREE]: refundCount,
		};
		const totalRefundCard = {
			loading: totalRefundLoading,
			title: TEXT.TOTAL_REFUND,
			infoContent: TEXT.TOTAL_REFUND_INFO,
			content: refundCountStore[rangeType] !== '' ? refundCountStore[rangeType] : '--',
			footer: (
				<RingRate
					d2d={{
						label: TEXT.D2D,
						content: dayRateRefund,
					}}
					w2w={{
						label: TEXT.W2W,
						content: weekRateRefund,
					}}
					m2m={{
						label: TEXT.M2M,
						content: monthRateRefund,
					}}
				/>
			),
		};

		return (
			<div className={styles['card-bar-wrapper']}>
				<Row gutter={24}>
					<Col span={6}>
						<DisplayCard {...totalAmountCard} />
					</Col>
					<Col span={6}>
						<DisplayCard {...totalCountCard} />
					</Col>
					<Col span={6}>
						<DisplayCard {...avgUnitSaleCard} />
					</Col>
					<Col span={6}>
						<DisplayCard {...totalRefundCard} />
					</Col>
				</Row>
			</div>
		);
	}
}

export default CardBar;
