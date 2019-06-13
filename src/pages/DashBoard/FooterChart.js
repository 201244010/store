import React, { Component } from 'react';
import { formatMessage } from 'umi/locale';
import { Radio, Spin } from 'antd';
import Charts from '@/components/Charts';
import { DASHBOARD } from './constants';
import styles from './DashBoard.less';

const { Pie } = Charts;
const {
	SEARCH_TYPE: { PAYMENT_TYPE },
} = DASHBOARD;

class FooterChart extends Component {
	render() {
		const {
			searchValue: { paymentType },
			chartLoading,
		} = this.props;

		return (
			<div className={styles['footer-chart-wrapper']}>
				<div className={styles['title-wrapper']}>
					<div className={styles['chart-title']}>
						{formatMessage({ id: 'dashBoard.payment' })}
					</div>
					<div className={styles['title-btn-bar']}>
						<Radio.Group value={paymentType}>
							<Radio.Button value={PAYMENT_TYPE.AMOUNT}>
								{formatMessage({ id: 'dashBoard.order.sales' })}
							</Radio.Button>
							<Radio.Button value={PAYMENT_TYPE.COUNT}>
								{formatMessage({ id: 'dashBoard.order.count' })}
							</Radio.Button>
						</Radio.Group>
					</div>
				</div>

				<Spin spinning={chartLoading}>
					<div className={styles['content-wrapper']}>
						<div className={styles['chart-item']}>
							<Pie
								animate={false}
								percent={28}
								total="28%"
								height={128}
								lineWidth={2}
							/>
						</div>
						<div className={styles['chart-item']}>
							<Pie
								animate={false}
								percent={28}
								total="28%"
								height={128}
								lineWidth={2}
							/>
						</div>
						<div className={styles['chart-item']}>
							<Pie
								animate={false}
								percent={28}
								total="28%"
								height={128}
								lineWidth={2}
							/>
						</div>
						<div className={styles['chart-item']}>
							<Pie
								animate={false}
								percent={28}
								total="28%"
								height={128}
								lineWidth={2}
							/>
						</div>
						<div className={styles['chart-item']}>
							<Pie
								animate={false}
								percent={28}
								total="28%"
								height={128}
								lineWidth={2}
							/>
						</div>
					</div>
				</Spin>
			</div>
		);
	}
}

export default FooterChart;
