import React, { Component } from 'react';
import { formatMessage } from 'umi/locale';
import Media from 'react-media';
import { Row, Col } from 'antd';
import Charts from '@/components/Charts';
import { priceFormat } from '@/utils/utils';

import styles from './DashBoard.less';

const { Bar } = Charts;

const data = [
	{ name: '可口可乐', count: 23333 },
	{ name: '可口可乐', count: 23333 },
	{ name: '可口可乐', count: 23333 },
	{ name: '可口可乐', count: 23333 },
	{ name: '可口可乐', count: 23333 },
	{ name: '可口可乐', count: 23333 },
	{ name: '可口可乐', count: 23333 },
	{ name: '可口可乐', count: 23333 },
	{ name: '可口可乐', count: 23333 },
	{ name: '可口可乐', count: 23333 },
];

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
									<div className={styles['list-title']}>
										{formatMessage({ id: 'dashBoard.sku.rate' })}
									</div>
									<ul className={styles['content-list']}>
										{data.map((item, index) => (
											<li className={styles['list-item']}>
												<div className={styles['label-wrapper']}>
													<div
														className={`${styles.rank} ${
															index < 3 ? styles['rank-primary'] : ''
														}`}
													>
														{index + 1}
													</div>
													<div className={styles.label}>{item.name}</div>
												</div>
												<div className={styles['number-content']}>
													{priceFormat(item.count)}
												</div>
											</li>
										))}
									</ul>
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
