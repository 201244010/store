import React from 'react';
import { connect } from 'dva';
import { getLocationParam } from '@/utils/utils';
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
                notificationInfo: { title, description },
            },
        } = this.props;
        return (
            <div className={styles.wrapper}>
                <h1>{title}</h1>
                <p>{description}</p>
            </div>
        );
    }
}

export default Notification;
