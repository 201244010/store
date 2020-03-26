import React, { PureComponent } from 'react';
import { Card, Row, Col } from 'antd';
import TopDataCard from '../Charts/TopDataCard/TopDataCard';
import styles from './index.less';

class OverviewCard extends PureComponent {

	render() {
		const { loading, RTPassengerCount } = this.props;

		return (
			<div className={styles.overview}>
				<Row gutter={24} className={styles['overview-row']}>
					<Col span={8}>
						{/* <Card className={styles['overview-card']} loading={loading}>test</Card> */}
						<TopDataCard data={RTPassengerCount} />
					</Col>
					<Col span={8}>
						{/* <TopDataCard /> */}
						{/* <Card className={styles['overview-card']} loading={loading}>test</Card> */}
					</Col>
					<Col span={8}>
						{/* <TopDataCard /> */}
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