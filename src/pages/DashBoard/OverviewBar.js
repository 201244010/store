import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import { Card, Icon } from 'antd';
import { priceFormat } from '@/utils/utils';
import styles from './DashBoard.less';

const OverviewInfo = ({
	icon = null,
	title = null,
	content = null,
	subContent = null,
	loading = false,
}) => (
	<Card title={null} bordered={false} loading={loading} className={styles['overview-card']}>
		<div className={styles['overview-info']}>
			<div className={styles['overview-icon']}>{icon && <Icon type={icon} />}</div>
			<div className={styles['overview-content']}>
				<div className={styles['content-title']}>{title}</div>
				<div className={styles.content}>{content}</div>
				<div className={styles['sub-content']}>{subContent}</div>
			</div>
		</div>
	</Card>
);

@connect(state => ({
	dashboard: state.dashboard,
}))
class OverviewBar extends PureComponent {
	render() {
		const {
			dashboard: {
				overviewDeviceLoading = true,
				overviewIPCLoading = true,
				overviewNetworkLoading = true,
				deviceOverView: {
					eslTotalCount = '',
					eslPendingCount = '',
					apTotalCount = '',
				} = {},
				ipcOverView: { onLineCount = '', offLineCount = '' } = {},
				networkOverview: {
					onlineCount: deviceOnlineCount = '',
					offlineCount: deviceOfflineCount = '',
				},
			},
		} = this.props;

		return (
			<Card title={null} className={styles['card-bar-wrapper']}>
				<div className={styles['overview-bar']}>
					<OverviewInfo
						{...{
							icon: 'smile',
							loading: overviewDeviceLoading,
							title: formatMessage({ id: 'dashboard.overview.ap.online' }),
							content: apTotalCount === '' ? '--' : apTotalCount,
						}}
					/>
					<OverviewInfo
						{...{
							icon: 'smile',
							loading: overviewDeviceLoading,
							title: formatMessage({ id: 'dashboard.overview.esl.push.total' }),
							content: eslTotalCount === '' ? '--' : priceFormat(eslTotalCount),
							subContent: (
								<span>
									{formatMessage({ id: 'dashboard.overview.esl.push' })}：
									{eslPendingCount === '' ? '--' : priceFormat(eslPendingCount)}
								</span>
							),
						}}
					/>
					<OverviewInfo
						{...{
							icon: 'smile',
							title: formatMessage({ id: 'dashboard.overview.ipc.online' }),
							loading: overviewIPCLoading,
							content: onLineCount === '' ? '--' : priceFormat(onLineCount),
							subContent: (
								<span>
									{formatMessage({ id: 'dashboard.overview.ipc.offline' })}：
									{offLineCount === '' ? '--' : offLineCount}
								</span>
							),
						}}
					/>
					<OverviewInfo
						{...{
							icon: 'smile',
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
						}}
					/>
				</div>
			</Card>
		);
	}
}

export default OverviewBar;
