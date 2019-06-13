import React, { Component } from 'react';
import { formatMessage } from 'umi/locale';
import Media from 'react-media';
import { Row, Col, Radio, Skeleton } from 'antd';
import Charts from '@/components/Charts';
import { priceFormat } from '@/utils/utils';

import styles from './DashBoard.less';

const { Bar } = Charts;

const TwinList = props => {
	const { leftList, rightList } = props;
	return (
		<div className={styles['twin-list-wrapper']}>
			<ul className={styles['content-list']}>
				{leftList.map((item, index) => (
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
						<div className={styles['number-content']}>{priceFormat(item.quantity)}</div>
					</li>
				))}
			</ul>
			<ul className={styles['content-list']}>
				{rightList.map((item, index) => (
					<li key={index} className={styles['list-item']}>
						<div className={styles['label-wrapper']}>
							<div className={styles.rank}>{index + 6}</div>
							<div className={styles.label}>{item.name}</div>
						</div>
						<div className={styles['number-content']}>{priceFormat(item.quantity)}</div>
					</li>
				))}
			</ul>
		</div>
	);
};

const SingleList = props => {
	const { data } = props;
	return (
		<ul className={styles['content-list']}>
			{data.map((item, index) => (
				<li key={index} className={styles['list-item']}>
					<div className={styles['label-wrapper']}>
						<div
							className={`${styles.rank} ${index < 3 ? styles['rank-primary'] : ''}`}
						>
							{index + 1}
						</div>
						<div className={styles.label}>{item.name}</div>
					</div>
					<div className={styles['number-content']}>{priceFormat(item.quantity)}</div>
				</li>
			))}
		</ul>
	);
};

class ContentChart extends Component {
	render() {
		const { skuRankList, loading } = this.props;
		const rankLoading = loading.effects['dashBoard/fetchSKURankList'];

		return (
			<div className={styles['content-chart']}>
				<Media query={{ maxWidth: 1439 }}>
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
									style={rankLoading ? { padding: '24px' } : {}}
								>
									<Skeleton active loading={rankLoading}>
										<div className={styles['list-title']}>
											{formatMessage({ id: 'dashBoard.sku.rate' })}
										</div>
										{result ? (
											<TwinList
												leftList={skuRankList.slice(0, 5)}
												rightList={skuRankList.slice(5)}
											/>
										) : (
											<SingleList data={skuRankList} />
										)}
									</Skeleton>
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
