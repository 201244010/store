import React, { Component } from 'react';
import { formatMessage } from 'umi/locale';
import Media from 'react-media';
import { Col, Row } from 'antd';
import RiseDownTag from '@/components/Tag/RiseDownTag';
import DisplayCard from '@/components/DisplayCard';

import { priceFormat } from '@/utils/utils';

const ringRateStyle = {
	display: 'flex',
	justifyContent: 'space-between',
};

const TEXT = {
	TOTAL_AMOUNT: formatMessage({ id: 'dashBoard.total.sales' }),
	TOTAL_AMOUNT_INFO: formatMessage({ id: 'dashBoard.total.sales.info' }),
	TOTAL_COUNT: formatMessage({ id: 'dashBoard.total.count' }),
	TOTAL_COUNT_INFO: formatMessage({ id: 'dashBoard.total.count.info' }),
	TOTAL_REFUND: formatMessage({ id: 'dashBoard.total.refund.count' }),
	TOTAL_REFUND_INFO: formatMessage({ id: 'dashBoard.total.refund.count.info' }),
	AVG_UNIT: formatMessage({ id: 'dashBoard.customer.unit.price' }),
	AVG_UNIT_INFO: formatMessage({ id: 'dashBoard.customer.unit.price.info' }),
	D2D: formatMessage({ id: 'dashBoard.order.d2d' }),
	W2W: formatMessage({ id: 'dashBoard.order.w2w' }),
	M2M: formatMessage({ id: 'dashBoard.order.m2m' }),
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

			totalAmount: {
				totalAmount: amount,
				dayRate: dayRateAmount,
				weekRate: weekRateAmount,
				monthRate: monthRateAmount,
			},

			totalCount: {
				totalCount,
				dayRate: dayRateCount,
				weekRate: weekRateCount,
				monthRate: monthRateCount,
			},

			avgUnitSale: {
				aus,
				dayRate: dayRateAvg,
				weekRate: weekRateAvg,
				monthRate: monthRateAvg,
			},

			totalRefund: {
				refundCount,
				dayRate: dayRateRefund,
				weekRate: weekRateRefund,
				monthRate: monthRateRefund,
			},
		} = this.props;

		const totalAmountCard = {
			loading: totalAmountLoading,
			title: TEXT.TOTAL_AMOUNT,
			infoContent: TEXT.TOTAL_AMOUNT_INFO,
			content: amount || amount === 0 ? priceFormat(parseFloat(amount).toFixed(2)) : '--',
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

		const totalCountCard = {
			loading: totalCountLoading,
			title: TEXT.TOTAL_COUNT,
			infoContent: TEXT.TOTAL_COUNT_INFO,
			content: totalCount !== '' ? totalCount : '--',
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

		const avgUnitSaleCard = {
			loading: avgUnitLoading,
			title: TEXT.AVG_UNIT,
			infoContent: TEXT.AVG_UNIT_INFO,
			content: aus || aus === 0 ? parseFloat(aus).toFixed(2) : '--',
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

		const totalRefundCard = {
			loading: totalRefundLoading,
			title: TEXT.TOTAL_REFUND,
			infoContent: TEXT.TOTAL_REFUND_INFO,
			content: refundCount !== '' ? refundCount : '--',
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
		);
	}
}

export default CardBar;
