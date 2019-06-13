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

const RingRate = props => {
	const { d2d = {}, w2w = {}, m2m = {} } = props;
	return (
		<>
			<Media
				query={{ maxWidth: 1439 }}
				render={() => <RiseDownTag label={d2d.label} content={d2d.content} />}
			/>

			<Media
				query={{ minWidth: 1440, maxWidth: 1919 }}
				render={() => (
					<div style={ringRateStyle}>
						<RiseDownTag label={d2d.label} content={d2d.content} />
						<RiseDownTag label={w2w.label} content={w2w.content} />
					</div>
				)}
			/>

			<Media
				query={{ minWidth: 1920 }}
				render={() => (
					<div style={ringRateStyle}>
						<RiseDownTag label={d2d.label} content={d2d.content} />
						<RiseDownTag label={w2w.label} content={w2w.content} />
						<RiseDownTag label={m2m.label} content={m2m.content} />
					</div>
				)}
			/>
		</>
	);
};

class CardBar extends Component {
	render() {
		const { totalLoading } = this.props;
		const {
			totalAmount: {
				totalAmount: amount,
				dayRate: dayRateAmount,
				weekRage: weekRateAmount,
				monthRate: monthRateAmount,
			},
		} = this.props;

		const totalAmountCard = {
			loading: totalLoading,
			title: formatMessage({ id: 'dashBoard.total.sales' }),
			infoContent: formatMessage({ id: 'dashBoard.total.sales.info' }),
			content: amount ? priceFormat(parseFloat(amount).toFixed(2)) : '--',
			footer: (
				<RingRate
					d2d={{
						label: formatMessage({ id: 'dashBoard.order.d2d' }),
						content: dayRateAmount,
					}}
					w2w={{
						label: formatMessage({ id: 'dashBoard.order.w2w' }),
						content: weekRateAmount,
					}}
					m2m={{
						label: formatMessage({ id: 'dashBoard.order.m2m' }),
						content: monthRateAmount,
					}}
				/>
			),
		};

		const {
			totalCount: {
				totalCount,
				dayRate: dayRateCount,
				weekRage: weekRateCount,
				monthRate: monthRateCount,
			},
		} = this.props;

		const totalCountCard = {
			loading: totalLoading,
			title: formatMessage({ id: 'dashBoard.total.count' }),
			infoContent: formatMessage({ id: 'dashBoard.total.count.info' }),
			content: totalCount,
			footer: (
				<RingRate
					d2d={{
						label: formatMessage({ id: 'dashBoard.order.d2d' }),
						content: dayRateCount,
					}}
					w2w={{
						label: formatMessage({ id: 'dashBoard.order.w2w' }),
						content: weekRateCount,
					}}
					m2m={{
						label: formatMessage({ id: 'dashBoard.order.m2m' }),
						content: monthRateCount,
					}}
				/>
			),
		};

		const {
			avgUnitSale: {
				aus,
				dayRate: dayRateAvg,
				weekRage: weekRateAvg,
				monthRate: monthRateAvg,
			},
		} = this.props;

		const avgUnitSaleCard = {
			loading: totalLoading,
			title: formatMessage({ id: 'dashBoard.customer.unit.price' }),
			infoContent: formatMessage({ id: 'dashBoard.customer.unit.price.info' }),
			content: aus ? parseFloat(aus).toFixed(2) : '--',
			footer: (
				<RingRate
					d2d={{
						label: formatMessage({ id: 'dashBoard.order.d2d' }),
						content: dayRateAvg,
					}}
					w2w={{
						label: formatMessage({ id: 'dashBoard.order.w2w' }),
						content: weekRateAvg,
					}}
					m2m={{
						label: formatMessage({ id: 'dashBoard.order.m2m' }),
						content: monthRateAvg,
					}}
				/>
			),
		};

		const {
			totalRefund: {
				refundCount,
				dayRate: dayRateRefund,
				weekRage: weekRateRefund,
				monthRate: monthRateRefund,
			},
		} = this.props;

		const totalRefundCard = {
			loading: totalLoading,
			title: formatMessage({ id: 'dashBoard.total.refund.count' }),
			infoContent: formatMessage({ id: 'dashBoard.total.refund.count.info' }),
			content: refundCount || '--',
			footer: (
				<RingRate
					d2d={{
						label: formatMessage({ id: 'dashBoard.order.d2d' }),
						content: dayRateRefund,
					}}
					w2w={{
						label: formatMessage({ id: 'dashBoard.order.w2w' }),
						content: weekRateRefund,
					}}
					m2m={{
						label: formatMessage({ id: 'dashBoard.order.m2m' }),
						content: monthRateRefund,
					}}
				/>
			),
		};

		return (
			<div>
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
