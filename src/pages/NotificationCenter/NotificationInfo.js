import React from 'react';
import { connect } from 'dva';
import { Divider, Card } from 'antd';
import { getLocationParam, unixSecondToDate, formatMessageTemplate } from '@/utils/utils';
import NotificationHandler from '@/components/Notification/NotificationHandler';
import styles from './Notification.less';

const ipcNotifHandler = valueList => {
	valueList.forEach(item => {
		if (item.key === '##device_name##' && item.value === '') {
			item.value = 'My Camera';
		}
	});
	return valueList;
};

const handlers = {
	'notif-motion-detect-content': ipcNotifHandler,
	'notif-device-ipc-ota-content': ipcNotifHandler,
	'notif-device-ipc-motion-detect-video-content': ipcNotifHandler,
	'notif-device-ipc-motion-detect-audio-content': ipcNotifHandler,
	'notif-device-ipc-motion-detect-video-audio-content': ipcNotifHandler,
	'notif-device-ipc-on/offline-content': ipcNotifHandler,
	'notif-device-ipc-tf-card-detect-content': ipcNotifHandler,
	'notif-device-ipc-tf-card-detect-tf-exist-content': ipcNotifHandler,
	'notif-device-ipc-tf-card-detect-tf-non-exist-content': ipcNotifHandler,
	'notif-device-ipc-tf-card-detect-tf-capable-content': ipcNotifHandler,
	'notif-device-ipc-tf-card-detect-tf-non-capable-content': ipcNotifHandler,
};
const option = {
	handlers,
};

@connect(
	state => {
		const result = {
			notification: state.notification,
		};
		return result;
	},
	dispatch => ({
		getNotificationInfo: payload =>
			dispatch({ type: 'notification/getNotificationInfo', payload }),
		goToPath: (pathId, urlParams = {}, anchorId) => dispatch({ type: 'menu/goToPath', payload: { pathId, urlParams, anchorId } }),
		formatSdCard: sn => {
			dispatch({ type: 'sdcard/formatSdCard', sn });
		},
		getSdStatus: async sn => {
			const status = await dispatch({
				type: 'sdcard/getSdStatus',
				sn,
			});
			return status;
		},
		getCurrentCompanyId: () => dispatch({ type: 'global/getCompanyIdFromStorage' }),
		getCurrentShopId: () => dispatch({ type: 'global/getShopIdFromStorage' }),
		getStoreNameById: shopId =>
			dispatch({ type: 'store/getStoreNameById', payload: { shopId } }),
		getCompanyNameById: companyId =>
			dispatch({ type: 'merchant/getCompanyNameById', payload: { companyId } }),
		getStoreList: payload => dispatch({ type: 'store/getStoreList', payload }),
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
			formatSdCard,
			getSdStatus,
			getCurrentCompanyId,
			getCurrentShopId,
			getStoreNameById,
			getCompanyNameById,
			getStoreList,
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
					<p>{content ? formatMessageTemplate(content, option) : ''}</p>
				</div>
				<div className={styles['button-bar']}>
					{minorButtonName && (
						<NotificationHandler
							{...{
								buttonName: minorButtonName,
								buttonParams: minorButtonLink,
								handlers: {
									goToPath,
									formatSdCard,
									getSdStatus,
									getCurrentCompanyId,
									getCurrentShopId,
									getStoreNameById,
									getCompanyNameById,
								},
							}}
						/>
					)}
					{majorButtonName && (
						<NotificationHandler
							{...{
								buttonName: majorButtonName,
								buttonParams: majorButtonLink,
								handlers: {
									goToPath,
									formatSdCard,
									getSdStatus,
									getCurrentCompanyId,
									getCurrentShopId,
									getStoreNameById,
									getCompanyNameById,
									getStoreList,
								},
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
