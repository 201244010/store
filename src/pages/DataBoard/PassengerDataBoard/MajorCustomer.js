import React, { PureComponent } from 'react';
import { Card, Row, Col } from 'antd';
import MainCustomerCard from '../Charts/MainCustomerCard';

import styles from './index.less';

const LAYOUT_SPAN = {
	0: 24,
	1: 24,
	2: 12,
	3: 8,
};

class MajorCustomer extends PureComponent {
	render() {
		const { majorList, loading, timeType } = this.props;
		console.log('=========主力客群======', majorList);
		return (
			<Card title="主力客群" className={styles['major-chart-wrapper']} loading={loading}>
				<Row gutter={24}>
					{majorList.map((item, index) => (
						<Col span={LAYOUT_SPAN[majorList.length]} key={index}>
							<MainCustomerCard {...item} timeType={timeType} />
						</Col>
					))}
				</Row>
			</Card>
		);
	}
}
export default MajorCustomer;
