import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import { Card, Icon, Divider } from 'antd';
import { priceFormat } from '@/utils/utils';
import { DASHBOARD } from './constants';
import styles from './DashBoard.less';

const {
	SEARCH_TYPE: { RANGE },
} = DASHBOARD;

const SalseInfo = ({
	title = null,
	icon = null,
	content = null,
	subContent = null,
	loading = false,
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
				<div className={styles['salse-icon']}>
					{icon && <Icon type={icon} style={{ fontSize: '24px' }} />}
				</div>
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
	state => ({
		dashboard: state.dashboard,
	}),
	dispatch => ({
		goToPath: (pathId, urlParams = {}) =>
			dispatch({ type: 'menu/goToPath', payload: { pathId, urlParams } }),
	})
)
class SalseBar extends PureComponent {
	render() {
		const {
			dashboard: {
				passengerFlowLoading,
				totalAmountLoading,
				totalCountLoading,
				passengerFlow: { latestCount = '--', earlyCount = '--' },
				totalAmount: { totalAmount, dayAmount, weekAmount, monthAmount },
				totalCount: { totalCount, dayCount, weekCount, monthCount },
				searchValue: { rangeType = RANGE.TODAY } = {},
			},
			goToPath,
		} = this.props;

		const totalAmountStore = {
			[RANGE.TODAY]: dayAmount,
			[RANGE.WEEK]: weekAmount,
			[RANGE.MONTH]: monthAmount,
			[RANGE.FREE]: totalAmount,
		};

		const totalCountStore = {
			[RANGE.TODAY]: dayCount,
			[RANGE.WEEK]: weekCount,
			[RANGE.MONTH]: monthCount,
			[RANGE.FREE]: totalCount,
		};

		return (
			<Card title={null}>
				<div className={styles['salse-bar']}>
					<SalseInfo
						{...{
							icon: 'pay-circle',
							title: formatMessage({ id: 'salse.total' }),
							content:
								totalAmountStore[rangeType] || totalAmountStore[rangeType] === 0
									? priceFormat(
										parseFloat(totalAmountStore[rangeType]).toFixed(2)
									  )
									: '--',
							loading: totalAmountLoading,
							// TODO 暂时先隐去
							// subContent: <span>{formatMessage({ id: 'yesterday' })}: 7009.00</span>,
							onClick: () => goToPath('tradeDetail'),
						}}
					/>
					<Divider type="vertical" />
					<SalseInfo
						{...{
							icon: 'wallet',
							title: formatMessage({ id: 'salse.count' }),
							content:
								totalCountStore[rangeType] !== ''
									? totalCountStore[rangeType]
									: '--',
							loading: totalCountLoading,
							// TODO 暂时隐去
							// subContent: <span>{formatMessage({ id: 'yesterday' })}: 7009.00</span>,
							onClick: () => goToPath('tradeDetail'),
						}}
					/>
					<Divider type="vertical" />
					<SalseInfo
						{...{
							icon: 'user',
							title: formatMessage({ id: 'shop.customers' }),
							content: latestCount === '--' ? '--' : priceFormat(latestCount),
							subContent:
								rangeType === RANGE.FREE ? (
									<></>
								) : (
									<span>
										{formatMessage({ id: 'yesterday' })}:{' '}
										{earlyCount === '--' ? '--' : priceFormat(earlyCount)}
									</span>
								),
							loading: passengerFlowLoading,
						}}
					/>
					<Divider type="vertical" />
					<SalseInfo
						{...{
							icon: 'bank',
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
