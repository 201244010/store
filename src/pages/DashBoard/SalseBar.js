import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import { Card, Divider } from 'antd';
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

const SalseInfo = ({
	title = null,
	icon = null,
	content = null,
	subContent = null,
	loading = true,
	onClick = null,
	action = true,
}) => {
	const handleClick = () => {
		if (onClick) {
			onClick();
		}
	};

	return (
		<Card
			className={`${styles['salse-card']} ${action ? styles['width-action'] : ''}`}
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
				yesterdayAmount,
				lastWeekAmount,
				lastMonthAmount,
			},
			totalCount: {
				totalCount,
				dayCount,
				weekCount,
				monthCount,
				yesterdayCount,
				lastWeekCount,
				lastMonthCount,
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

		const earlyAmountStore = {
			[RANGE.TODAY]: yesterdayAmount,
			[RANGE.WEEK]: lastWeekAmount,
			[RANGE.MONTH]: lastMonthAmount,
		};

		const totalCountStore = {
			[RANGE.TODAY]: dayCount,
			[RANGE.WEEK]: weekCount,
			[RANGE.MONTH]: monthCount,
			[RANGE.FREE]: totalCount,
		};

		const earlyCountStore = {
			[RANGE.TODAY]: yesterdayCount,
			[RANGE.WEEK]: lastWeekCount,
			[RANGE.MONTH]: lastMonthCount,
		};

		const tradeRate =
			latestCount === 0
				? 0
				: parseInt((totalCountStore[rangeType] / latestCount) * 100, 10) > 100
					? parseFloat(100).toFixed(2)
					: parseFloat((totalCountStore[rangeType] / latestCount) * 100).toFixed(2);

		const lastTradeRate =
			earlyCountStore[rangeType] === 0
				? 0
				: parseInt((earlyCountStore[rangeType] / earlyCount) * 100, 10) > 100
					? parseFloat(100).toFixed(2)
					: parseFloat((earlyCountStore[rangeType] / earlyCount) * 100).toFixed(2);

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
							subContent:
								rangeType === RANGE.FREE ? (
									<></>
								) : (
									<span>
										{passengerFlowMessage[rangeType]}：{' '}
										{earlyAmountStore[rangeType] === '--'
											? '--'
											: priceFormat(earlyAmountStore[rangeType])}
									</span>
								),
							onClick: () =>
								goToPath('orderDetail', {
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
							subContent:
								rangeType === RANGE.FREE ? (
									<></>
								) : (
									<span>
										{passengerFlowMessage[rangeType]}：{' '}
										{earlyCountStore[rangeType] === '--'
											? '--'
											: priceFormat(earlyCountStore[rangeType])}
									</span>
								),
							onClick: () =>
								goToPath('orderDetail', {
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
										{passengerFlowMessage[rangeType]}：{' '}
										{earlyCount === '--' ? '--' : priceFormat(earlyCount)}
									</span>
								),
							loading: passengerFlowLoading,
							onClick: () => goToPath('faceLog'),
						}}
					/>
					<Divider type="vertical" />
					<SalseInfo
						{...{
							icon: <img src={require('@/assets/icon/square.png')} />,
							title: formatMessage({ id: 'trade.transfer' }),
							content: `${tradeRate}%`,
							subContent:
								rangeType === RANGE.FREE ? (
									<></>
								) : (
									<span>
										{/* 临时方案，等待云端更新接口后计算昨日值 */}
										{passengerFlowMessage[rangeType]}： {lastTradeRate}%
									</span>
								),
							loading: passengerFlowLoading || totalCountLoading,
							action: false,
						}}
					/>
				</div>
			</Card>
		);
	}
}

export default SalseBar;
