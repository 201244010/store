import React, { PureComponent } from 'react';
import { Card, Row, Col } from 'antd';
import MainCustomerCard from '../Charts/MainCustomerCard';

import styles from './index.less';

class MajorCustomer extends PureComponent {
	render() {
		const { majorList, loading } = this.props;
		console.log('=========主力客群======', majorList);
		return(
			<Card title="主力客群" className={styles['major-chart-wrapper']} loading={loading}>
				<Row gutter={24}>
					{
						majorList.map((item,index) => <Col span={8} key={index}><MainCustomerCard {...item} /></Col>)
					}
				</Row>
			</Card>
		);
	}
}
export default MajorCustomer;