import React from 'react';
import { connect } from 'dva';
import { getLocationParam, unixSecondToDate } from '@/utils/utils';
import { Divider } from 'antd';
import styles from './Notification.less';

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

	render() {
		const {
			notification: {
				notificationInfo: { title, description, receiveTime },
			},
		} = this.props;
		return (
			<div className={styles['info-wrapper']}>
				<div className={styles['title-wrapper']}>
					<h1 className={styles['info-title']}>{title}</h1>
					<div className={styles['info-time']}>{unixSecondToDate(receiveTime)}</div>
				</div>
				<Divider />
				<div className={styles['content-wrapper']}>
					<p>{description}</p>
				</div>
			</div>
		);
	}
}

export default Notification;
