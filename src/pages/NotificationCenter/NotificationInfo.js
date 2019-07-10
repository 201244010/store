import React from 'react';
import { connect } from 'dva';
import { getLocationParam, unixSecondToDate, formatMessageTemplate } from '@/utils/utils';
import { Divider, Card } from 'antd';
import NotificationHandler from '@/components/Notification/NotificationHandler';
import styles from './Notification.less';

@connect(
	state => ({
		notification: state.notification,
	}),
	dispatch => ({
		getNotificationInfo: payload =>
			dispatch({ type: 'notification/getNotificationInfo', payload }),
		goToPath: (pathId, urlParams = {}) =>
			dispatch({ type: 'menu/goToPath', payload: { pathId, urlParams } }),
	})
)
class Notification extends React.Component {
	componentDidMount() {
		const msgId = getLocationParam('msgId');
		const { getNotificationInfo } = this.props;
		getNotificationInfo({
			msgId,
		});
	}

	render() {
		const {
			notification: {
				notificationInfo: {
					title = '',
					content = '',
					receiveTime = null,
					majorButtonLink = null,
					majorButtonName = null,
					minorButtonLink = null,
					minorButtonName = null,
				} = {},
			} = {},
			goToPath,
		} = this.props;

		return (
			<Card bordered={false}>
				<div className={styles['title-wrapper']}>
					<h1 className={styles['info-title']}>
						{title !== '' ? formatMessageTemplate(title) : ''}
					</h1>
					<div className={styles['info-time']}>
						{receiveTime ? unixSecondToDate(receiveTime) : null}
					</div>
				</div>
				<Divider />
				<div className={styles['content-wrapper']}>
					<p>{content ? formatMessageTemplate(content) : ''}</p>
				</div>
				<div className={styles['button-bar']}>
					{minorButtonName && (
						<NotificationHandler
							{...{
								buttonName: minorButtonName,
								buttonParams: minorButtonLink,
								handlers: { goToPath },
							}}
						/>
					)}
					{majorButtonName && (
						<NotificationHandler
							{...{
								buttonName: majorButtonName,
								buttonParams: majorButtonLink,
								handlers: { goToPath },
								type: 'primary',
								style: { marginLeft: minorButtonName ? '20px' : '0' },
							}}
						/>
					)}
				</div>
			</Card>
		);
	}
}

export default Notification;
