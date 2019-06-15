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
			purchaseInfo,
		} = this.props;

		const { purchaseTypeList = [], totalAmount = 0, totalCount = 0 } = purchaseInfo;
		const divideBase = PAYMENT_TYPE.AMOUNT ? totalAmount : totalCount;

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
						{purchaseTypeList.map((info, index) => {
							const percent = Math.ceil(info[paymentType] / (divideBase || 1)) * 100;
							return (
								<div
									className={styles['chart-item']}
									key={index}
									style={{
										width: `${Math.floor(
											100 / (purchaseTypeList.length || 1)
										)}%`,
									}}
								>
									<Pie percent={percent} total={`${percent}%`} />
								</div>
							);
						})}
					</div>
				</Spin>
			</div>
		);
	}
}

export default FooterChart;
