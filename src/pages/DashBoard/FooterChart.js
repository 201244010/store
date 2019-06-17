import React, { Component } from 'react';
import { formatMessage } from 'umi/locale';
import { Radio, Spin } from 'antd';
import Charts from '@/components/Charts';
import { DASHBOARD } from './constants';
import styles from './DashBoard.less';

const { Pie } = Charts;
const {
	SEARCH_TYPE: { PAYMENT_TYPE },
	PIE_COLOR,
} = DASHBOARD;

class FooterChart extends Component {
	handleRadioChange = e => {
		const { setSearchValue } = this.props;
		const {
			target: { value },
		} = e;

		setSearchValue({
			paymentType: value,
		});
	};

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
						<Radio.Group value={paymentType} onChange={this.handleRadioChange}>
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
							const percent = Math.round(
								(info[paymentType] / (divideBase || 1)) * 100
							);
							const pieLegend = (
								<>
									<div className={styles['chart-title']}>
										{info.purchaseTypeName}
									</div>
									<div className={styles['chart-data']}>
										{paymentType === PAYMENT_TYPE.AMOUNT
											? `¥${info[paymentType]}`
											: info[paymentType]}
									</div>
								</>
							);

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
									<Pie
										percent={percent}
										total={percent}
										hasLegend
										legend={pieLegend}
										pieStyle={{ color: PIE_COLOR[index] }}
									/>
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
