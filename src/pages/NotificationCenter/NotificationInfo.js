import React from 'react';
import { connect } from 'dva';
import { getLocationParam, unixSecondToDate } from '@/utils/utils';
import { Button, Divider, Card } from 'antd';
import styles from './Notification.less';
import { ACTION_MAP } from '@/constants/mqttActionMap';

@connect(
	state => ({
		notification: state.notification,
	}),
	dispatch => ({
		getNotificationInfo: payload =>
			dispatch({ type: 'notification/getNotificationInfo', payload }),
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

	handleAction = action => {
		if (action) {
			const handler = ACTION_MAP[action] || (() => null);
			handler();
		}
	};

	render() {
		const {
			notification: {
				notificationInfo: {
					title,
					description,
					receiveTime,
					majorButtonLink,
					majorButtonName,
					minorButtonLink,
					minorButtonName,
				},
			},
		} = this.props;
		return (
			<Card bordered={false}>
				<div className={styles['title-wrapper']}>
					<h1 className={styles['info-title']}>{title}</h1>
					<div className={styles['info-time']}>{unixSecondToDate(receiveTime)}</div>
				</div>
				<Divider />
				<div className={styles['content-wrapper']}>
					<p>{description}</p>
				</div>
				<div className={styles['button-bar']}>
					{minorButtonName && (
						<Button onClick={() => this.handleAction(minorButtonLink)}>
							{minorButtonName}
						</Button>
					)}
					{majorButtonName && (
						<Button
							style={{ marginLeft: minorButtonName ? '20px' : '0' }}
							type="primary"
							onClick={() => this.handleAction(majorButtonLink)}
						>
							{majorButtonName}
						</Button>
					)}
				</div>
			</Card>
		);
	}
}

export default Notification;
