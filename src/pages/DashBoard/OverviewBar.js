import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import { Card } from 'antd';
import { priceFormat } from '@/utils/utils';
import styles from './DashBoard.less';

const OverviewInfo = ({
	icon = null,
	title = null,
	content = null,
	subContent = null,
	loading = true,
	onClick = null,
}) => {
	const handleClick = e => {
		if (onClick) {
			onClick(e);
		}
	};

	return (
		<Card
			title={null}
			bordered={false}
			loading={loading}
			className={styles['overview-card']}
			onClick={handleClick}
		>
			<div className={styles['overview-info']}>
				<div className={styles['overview-icon']}>{icon}</div>
				<div className={styles['overview-content']}>
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
		overviewDeviceLoading: dashboard.overviewDeviceLoading,
		overviewIPCLoading: dashboard.overviewIPCLoading,
		overviewNetworkLoading: dashboard.overviewNetworkLoading,
		deviceOverView: dashboard.deviceOverView,
		ipcOverView: dashboard.ipcOverView,
		networkOverview: dashboard.networkOverview,
	}),
	dispatch => ({
		goToPath: (pathId, urlParams = {}) =>
			dispatch({ type: 'menu/goToPath', payload: { pathId, urlParams } }),
	})
)
class OverviewBar extends PureComponent {
	render() {
		const {
			overviewDeviceLoading = true,
			overviewIPCLoading = true,
			overviewNetworkLoading = true,
			deviceOverView: {
				eslTotalCount = '',
				eslPendingCount = '',
				eslFailedCount = '',
				apTotalCount = '',
			} = {},
			ipcOverView: { onLineCount = '', offLineCount = '' } = {},
			networkOverview: {
				onlineCount: deviceOnlineCount = '',
				offlineCount: deviceOfflineCount = '',
			},
			goToPath,
		} = this.props;

		return (
			<Card title={null} style={{ marginTop: '24px' }}>
				<div className={styles['overview-bar']}>
					<OverviewInfo
						{...{
							icon: <img src={require('@/assets/icon/AP.png')} />,
							loading: overviewDeviceLoading,
							title: formatMessage({ id: 'dashboard.overview.esl.push.total' }),
							content: eslTotalCount === '' ? '--' : priceFormat(eslTotalCount),
							subContent: (
								<span>
									{formatMessage({ id: 'dashboard.overview.ap.online' })}：
									{apTotalCount === '' ? '--' : apTotalCount}
								</span>
							),
							onClick: overviewDeviceLoading ? null : () => goToPath('baseStation'),
						}}
					/>
					<OverviewInfo
						{...{
							icon: <img src={require('@/assets/icon/ESL.png')} />,
							loading: overviewDeviceLoading,
							title: formatMessage({ id: 'dashboard.overview.esl.push' }),
							content: eslPendingCount === '' ? '--' : priceFormat(eslPendingCount),
							subContent: (
								<span>
									{formatMessage({ id: 'dashboard.overview.esl.push.failed' })}：
									{eslFailedCount === '' ? '--' : eslFailedCount}
								</span>
							),
							onClick: overviewDeviceLoading ? null : () => goToPath('electricLabel'),
						}}
					/>
					<OverviewInfo
						{...{
							icon: <img src={require('@/assets/icon/IPC.png')} />,
							title: formatMessage({ id: 'dashboard.overview.ipc.online' }),
							loading: overviewIPCLoading,
							content: onLineCount === '' ? '--' : priceFormat(onLineCount),
							subContent: (
								<span>
									{formatMessage({ id: 'dashboard.overview.ipc.offline' })}：
									{offLineCount === '' ? '--' : offLineCount}
								</span>
							),
							onClick: overviewIPCLoading ? null : () => goToPath('deviceList'),
						}}
					/>
					<OverviewInfo
						{...{
							icon: <img src={require('@/assets/icon/W1.png')} />,
							loading: overviewNetworkLoading,
							title: formatMessage({ id: 'dashboard.overview.device.online' }),
							content:
								deviceOnlineCount === '' ? '--' : priceFormat(deviceOnlineCount),
							subContent: (
								<span>
									{formatMessage({ id: 'dashboard.overview.device.offline' })}：
									{deviceOfflineCount === '' ? '--' : deviceOfflineCount}
								</span>
							),
							onClick: overviewNetworkLoading ? null : () => goToPath('network'),
						}}
					/>
				</div>
			</Card>
		);
	}
}

export default OverviewBar;