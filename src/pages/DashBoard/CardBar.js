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
				query={{ maxWidth: 1280 }}
				render={() => <RiseDownTag label={d2d.label} content={d2d.content} />}
			/>

			<Media
				query={{ maxWidth: 1440, minWidth: 1281 }}
				render={() => (
					<div style={ringRateStyle}>
						<RiseDownTag label={d2d.label} content={d2d.content} />
						<RiseDownTag label={w2w.label} content={w2w.content} />
					</div>
				)}
			/>

			<Media
				query={{ minWidth: 1441 }}
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
		const totalSalse = {
			title: formatMessage({ id: 'dashBoard.total.sales' }),
			infoContent: formatMessage({ id: 'dashBoard.total.sales.info' }),
			content: priceFormat(parseFloat(126560).toFixed(2)),
			footer: (
				<RingRate
					d2d={{ label: formatMessage({ id: 'dashBoard.order.d2d' }), content: -0.5 }}
					w2w={{ label: formatMessage({ id: 'dashBoard.order.w2w' }), content: 0.65 }}
					m2m={{ label: formatMessage({ id: 'dashBoard.order.m2m' }), content: 0.31 }}
				/>
			),
		};

		const totalCount = {
			title: formatMessage({ id: 'dashBoard.total.count' }),
			infoContent: formatMessage({ id: 'dashBoard.total.count.info' }),
			content: 189,
			footer: (
				<RingRate
					d2d={{ label: formatMessage({ id: 'dashBoard.order.d2d' }), content: -0.5 }}
					w2w={{ label: formatMessage({ id: 'dashBoard.order.w2w' }), content: 0.65 }}
					m2m={{ label: formatMessage({ id: 'dashBoard.order.m2m' }), content: 0.31 }}
				/>
			),
		};

		const totalUnit = {
			title: formatMessage({ id: 'dashBoard.customer.unit.price' }),
			infoContent: formatMessage({ id: 'dashBoard.customer.unit.price.info' }),
			content: parseFloat(34.7).toFixed(2),
			footer: (
				<RingRate
					d2d={{ label: formatMessage({ id: 'dashBoard.order.d2d' }), content: -0.5 }}
					w2w={{ label: formatMessage({ id: 'dashBoard.order.w2w' }), content: 0.65 }}
					m2m={{ label: formatMessage({ id: 'dashBoard.order.m2m' }), content: 0.31 }}
				/>
			),
		};

		const totalRefund = {
			title: formatMessage({ id: 'dashBoard.total.refund.count' }),
			infoContent: formatMessage({ id: 'dashBoard.total.refund.count.info' }),
			content: 2,
			footer: (
				<RingRate
					d2d={{ label: formatMessage({ id: 'dashBoard.order.d2d' }), content: -0.5 }}
					w2w={{ label: formatMessage({ id: 'dashBoard.order.w2w' }), content: 0.65 }}
					m2m={{ label: formatMessage({ id: 'dashBoard.order.m2m' }), content: 0.31 }}
				/>
			),
		};

		return (
			<div>
				<Row gutter={24}>
					<Col span={6}>
						<DisplayCard {...totalSalse} />
					</Col>
					<Col span={6}>
						<DisplayCard {...totalCount} />
					</Col>
					<Col span={6}>
						<DisplayCard {...totalUnit} />
					</Col>
					<Col span={6}>
						<DisplayCard {...totalRefund} />
					</Col>
				</Row>
			</div>
		);
	}
}

export default CardBar;
