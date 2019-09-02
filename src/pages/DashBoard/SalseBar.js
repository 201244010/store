import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import { Card, Icon, Divider } from 'antd';
import styles from './DashBoard.less';

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
		const { goToPath } = this.props;

		return (
			<Card title={null}>
				<div className={styles['salse-bar']}>
					<SalseInfo
						{...{
							icon: 'pay-circle',
							title: formatMessage({ id: 'salse.total' }),
							content: 6560.0,
							subContent: <span>{formatMessage({ id: 'yesterday' })}: 7009.00</span>,
							onClick: () => goToPath('tradeDetail'),
						}}
					/>
					<Divider type="vertical" />
					<SalseInfo
						{...{
							icon: 'wallet',
							title: formatMessage({ id: 'salse.total' }),
							content: 6560.0,
							subContent: <span>{formatMessage({ id: 'yesterday' })}: 7009.00</span>,
							onClick: () => goToPath('tradeDetail'),
						}}
					/>
					<Divider type="vertical" />
					<SalseInfo
						{...{
							icon: 'user',
							title: formatMessage({ id: 'salse.total' }),
							content: 6560.0,
							subContent: <span>{formatMessage({ id: 'yesterday' })}: 7009.00</span>,
						}}
					/>
					<Divider type="vertical" />
					<SalseInfo
						{...{
							icon: 'bank',
							title: formatMessage({ id: 'salse.total' }),
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
