import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import { Card, Divider } from 'antd';
import RiseDownTag from '@/components/Tag/RiseDownTag';
import { priceFormat } from '@/utils/utils';
import { DASHBOARD } from './constants';
import styles from './DashBoard.less';

const {
	SEARCH_TYPE: { RANGE },
} = DASHBOARD;

const passengerFlowMessage = {
	[RANGE.TODAY]: formatMessage({ id: 'yesterday' }),
	[RANGE.WEEK]: formatMessage({ id: 'lastWeek' }),
	[RANGE.MONTH]: formatMessage({ id: 'lastMonth' }),
};

const rateMessage = {
	[RANGE.TODAY]: formatMessage({ id: 'dashboard.order.d2d' }),
	[RANGE.WEEK]: formatMessage({ id: 'dashboard.order.w2w' }),
	[RANGE.MONTH]: formatMessage({ id: 'dashboard.order.m2m' }),
};

const SalseInfo = ({
	title = null,
	icon = null,
	content = null,
	subContent = null,
	loading = true,
	onClick = null,
}) => {
	const handleClick = () => {
		if (onClick) {
			onClick();
		}
	};

	return (
		<Card
			className={styles['salse-card']}
			bordered={false}
			loading={loading}
			onClick={handleClick}
		>
			<div className={styles['salse-info']}>
				<div className={styles['salse-icon']}>{icon}</div>
				<div className={styles['salse-content']}>
					<div className={styles['content-title']}>{title}</div>
					<div className={styles.content}>{content}</div>
					<div className={styles['sub-content']}>{subContent}</div>
				</div>
			</div>
		</Card>
	);
};

@connect(
	({ dashboard }) => ({
		passengerFlowLoading: dashboard.passengerFlowLoading,
		totalAmountLoading: dashboard.totalAmountLoading,
		totalCountLoading: dashboard.totalCountLoading,
		passengerFlow: dashboard.passengerFlow,
		totalAmount: dashboard.totalAmount,
		totalCount: dashboard.totalCount,
		searchValue: dashboard.searchValue,
	}),
	dispatch => ({
		goToPath: (pathId, urlParams = {}) =>
			dispatch({ type: 'menu/goToPath', payload: { pathId, urlParams } }),
	})
)
class SalseBar extends PureComponent {
	render() {
		const {
			passengerFlowLoading,
			totalAmountLoading,
			totalCountLoading,
			passengerFlow: { latestCount = '--', earlyCount = '--' },
			totalAmount: {
				totalAmount,
				dayAmount,
				weekAmount,
				monthAmount,
				dayRate: dayRateAmount,
				weekRate: weekRateAmount,
				monthRate: monthRateAmount,
			},
			totalCount: {
				totalCount,
				dayCount,
				weekCount,
				monthCount,
				dayRate: dayRateCount,
				weekRate: weekRateCount,
				monthRate: monthRateCount,
			},
			searchValue: { rangeType = RANGE.TODAY, startQueryTime, endQueryTime } = {},
			goToPath,
		} = this.props;

		const totalAmountStore = {
			[RANGE.TODAY]: dayAmount,
			[RANGE.WEEK]: weekAmount,
			[RANGE.MONTH]: monthAmount,
			[RANGE.FREE]: totalAmount,
		};

		const totalAmountRate = {
			[RANGE.TODAY]: dayRateAmount,
			[RANGE.WEEK]: weekRateAmount,
			[RANGE.MONTH]: monthRateAmount,
		};

		const totalCountStore = {
			[RANGE.TODAY]: dayCount,
			[RANGE.WEEK]: weekCount,
			[RANGE.MONTH]: monthCount,
			[RANGE.FREE]: totalCount,
		};

		const totalCountRate = {
			[RANGE.TODAY]: dayRateCount,
			[RANGE.WEEK]: weekRateCount,
			[RANGE.MONTH]: monthRateCount,
		};

		return (
			<Card title={null}>
				<div className={styles['salse-bar']}>
					<SalseInfo
						{...{
							icon: <img src={require('@/assets/icon/totalAmount.png')} />,
							title: formatMessage({ id: 'salse.total' }),
							content:
								totalAmountStore[rangeType] || totalAmountStore[rangeType] === 0
									? priceFormat(
										parseFloat(totalAmountStore[rangeType]).toFixed(2)
									  )
									: '--',
							loading: totalAmountLoading,
							// TODO 等云端修改接口，临时方案
							subContent:
								rangeType === RANGE.FREE ? (
									<></>
								) : (
									<RiseDownTag
										label={rateMessage[rangeType]}
										content={totalAmountRate[rangeType]}
									/>
								),
							onClick: () =>
								goToPath('tradeDetail', {
									timeRangeStart: startQueryTime,
									timeRangeEnd: endQueryTime,
								}),
						}}
					/>
					<Divider type="vertical" />
					<SalseInfo
						{...{
							icon: <img src={require('@/assets/icon/tradeCount.png')} />,
							title: formatMessage({ id: 'salse.count' }),
							content:
								totalCountStore[rangeType] !== ''
									? totalCountStore[rangeType]
									: '--',
							loading: totalCountLoading,
							// TODO 等云端修改接口，临时方案
							subContent:
								rangeType === RANGE.FREE ? (
									<></>
								) : (
									<RiseDownTag
										label={rateMessage[rangeType]}
										content={totalCountRate[rangeType]}
									/>
								),
							onClick: () =>
								goToPath('tradeDetail', {
									timeRangeStart: startQueryTime,
									timeRangeEnd: endQueryTime,
								}),
						}}
					/>
					<Divider type="vertical" />
					<SalseInfo
						{...{
							icon: <img src={require('@/assets/icon/passengerFlow.png')} />,
							title: formatMessage({ id: 'shop.customers' }),
							content: latestCount === '--' ? '--' : priceFormat(latestCount),
							subContent:
								rangeType === RANGE.FREE ? (
									<></>
								) : (
									<span>
										{passengerFlowMessage[rangeType]}:{' '}
										{earlyCount === '--' ? '--' : priceFormat(earlyCount)}
									</span>
								),
							loading: passengerFlowLoading,
						}}
					/>
					<Divider type="vertical" />
					<SalseInfo
						{...{
							icon: <img src={require('@/assets/icon/square.png')} />,
							title: formatMessage({ id: 'area.effect' }),
							content: 6560.0,
							subContent: <span>{formatMessage({ id: 'yesterday' })}: 7009.00</span>,
						}}
					/>
				</div>
			</Card>
		);
	}
}

export default SalseBar;
