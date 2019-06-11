import React, { Component } from 'react';
import { formatMessage } from 'umi/locale';
import Media from 'react-media';
import { Row, Col, Radio } from 'antd';
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
									<div className={styles['title-wrapper']}>
										<div className={styles['bar-title']}>
											{formatMessage({ id: 'dashBoard.trade.time' })}
										</div>
										<div className={styles['bar-radio']}>
											<Radio.Group defaultValue={0}>
												<Radio.Button value={0}>
													{formatMessage({ id: 'dashBoard.order.sales' })}
												</Radio.Button>
												<Radio.Button value={1}>
													{formatMessage({ id: 'dashBoard.order.count' })}
												</Radio.Button>
											</Radio.Group>
										</div>
									</div>
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
											<li key={index} className={styles['list-item']}>
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
