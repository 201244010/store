import React, { Component } from 'react';
import { formatMessage } from 'umi/locale';
import { Row, Col } from 'antd';
import DisplayCard from '@/components/DisplayCard';
import styles from './DashBoard.less';

class DashBoardContent extends Component {
	render() {
		const totalSalse = {
			title: formatMessage({ id: 'dashBoard.total.sales' }),
			infoContent: formatMessage({ id: 'dashBoard.total.sales.info' }),
			content: 126560,
			footer: (
				<div>日环比</div>
			),
		};

		const totalCount = {
			title: formatMessage({ id: 'dashBoard.total.count' }),
			infoContent: formatMessage({ id: 'dashBoard.total.count.info' }),
			content: 189,
			footer: (
				<div>日环比</div>
			),
		};

		const totalUnit = {
			title: formatMessage({ id: 'dashBoard.total.unit' }),
			infoContent: formatMessage({ id: 'dashBoard.total.unit.info' }),
			content: 34,
			footer: (
				<div>日环比</div>
			),
		};

		const totalRefund = {
			title: formatMessage({ id: 'dashBoard.refund.sales' }),
			infoContent: formatMessage({ id: 'dashBoard.total.refund.info' }),
			content: 2,
			footer: (
				<div>日环比</div>
			),
		};

		return (
			<div className={styles['display-content']}>
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
			</div>
		);
	}
}

export default DashBoardContent;