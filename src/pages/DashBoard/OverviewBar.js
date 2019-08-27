import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import { Card, Icon } from 'antd';
import styles from './DashBoard.less';

const OverviewInfo = ({ icon = null, title = null, content = null, subContent = null }) => (
	<Card title={null} bordered={false}>
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

@connect()
class OverviewBar extends PureComponent {
	render() {
		return (
			<Card title={null} className={styles['card-bar-wrapper']}>
				<div className={styles['overview-bar']}>
					<OverviewInfo
						{...{
							icon: 'smile',
							title: formatMessage({ id: 'dashboard.overview.ap.online' }),
							content: 2333,
							subContent: (
								<span>
									{formatMessage({ id: 'dashboard.overview.ap.offline' })}：0
								</span>
							),
						}}
					/>
					<OverviewInfo
						{...{
							icon: 'smile',
							title: formatMessage({ id: 'dashboard.overview.ap.online' }),
							content: 2333,
							subContent: (
								<span>
									{formatMessage({ id: 'dashboard.overview.ap.offline' })}：0
								</span>
							),
						}}
					/>
					<OverviewInfo
						{...{
							icon: 'smile',
							title: formatMessage({ id: 'dashboard.overview.ap.online' }),
							content: 2333,
							subContent: (
								<span>
									{formatMessage({ id: 'dashboard.overview.ap.offline' })}：0
								</span>
							),
						}}
					/>
					<OverviewInfo
						{...{
							icon: 'smile',
							title: formatMessage({ id: 'dashboard.overview.ap.online' }),
							content: 2333,
							subContent: (
								<span>
									{formatMessage({ id: 'dashboard.overview.ap.offline' })}：0
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
