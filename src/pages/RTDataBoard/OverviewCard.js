import React, { PureComponent } from 'react';
import { Card, Row, Col } from 'antd';
import styles from './index.less';

class OverviewCard extends PureComponent {

	render() {
		const { loading } = this.props;

		return (
			<div className={styles.overview}>
				<Row gutter={24} className={styles['overview-row']}>
					<Col span={8}>
						<Card className={styles['overview-card']} loading={loading}>test</Card>
					</Col>
					<Col span={8}>
						<Card className={styles['overview-card']} loading={loading}>test</Card>
					</Col>
					<Col span={8}>
						<Card className={styles['overview-card']} loading={loading}>test</Card>
					</Col>
				</Row>
				<Row gutter={24} className={styles['overview-row']}>
					<Col span={8}>
						<Card className={styles['overview-card']} loading={loading}>test</Card>
					</Col>
					<Col span={8}>
						<Card className={styles['overview-card']} loading={loading}>test</Card>
					</Col>
					<Col span={8}>
						<Card className={styles['overview-card']} loading={loading}>test</Card>
					</Col>
				</Row>
			</div>
		);
	}
}
export default OverviewCard;