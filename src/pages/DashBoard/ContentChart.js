import React, { Component } from 'react';
import Media from 'react-media';
import { Row, Col } from 'antd';
import Charts from '@/components/Charts';
import ContentList from '@/components/ContentList';
import styles from './DashBoard.less';

const { Bar } = Charts;

class ContentChart extends Component {
	render() {
		return (
			<div className={styles['content-chart']}>
				<Media query={{ maxWidth: 1280 }}>
					{result => (
						<Row gutter={result ? 0 : 24}>
							<Col span={result ? 24 : 18}>
								<div className={styles['bar-wrapper']}>
									<Bar />
								</div>
							</Col>
							<Col span={result ? 24 : 6}>
								<div
									className={`${styles['list-wrapper']} ${
										result ? styles['list-wrapper-top'] : ''
									}`}
								>
									<ContentList />
								</div>
							</Col>
						</Row>
					)}
				</Media>
			</div>
		);
	}
}

export default ContentChart;
