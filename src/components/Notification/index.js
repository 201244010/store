import React from 'react';
import { notification } from 'antd';
import NotificationHandler from './NotificationHandler';
import { formatMessageTemplate } from '@/utils/utils';
import styles from './notification.less';

notification.config({
	top: 65,
});

const ipcNotifHandler = valueList => {
	valueList.forEach(item => {
		if (item.key === '##device_name##' && item.value === '') {
			item.value = 'My Camera';
		}
	});
	return valueList;
};

const templateHandler = {
	'notif-device-ipc-tf-card-detect-tf-capable-desc': ipcNotifHandler,
	'notif-device-ipc-tf-card-detect-tf-non-exist-desc': ipcNotifHandler,
	'notif-device-ipc-ota-desc': ipcNotifHandler,
	'notif-device-ipc-motion-detect-video-desc': ipcNotifHandler,
	'notif-device-ipc-motion-detect-audio-desc': ipcNotifHandler,
	'notif-device-ipc-motion-detect-video-audio-desc': ipcNotifHandler,
	'notif-device-ipc-on/offline-desc': ipcNotifHandler,
	'notif-device-ipc-tf-card-detect-desc': ipcNotifHandler,
	'notif-device-ipc-tf-card-detect-tf-exist-desc': ipcNotifHandler,
	'notif-device-ipc-tf-card-detect-tf-non-capable-desc': ipcNotifHandler,
};

export const Title = props => {
	const { title = '' } = props;
	return <div className={styles.title}>{title !== '' ? formatMessageTemplate(title) : ''}</div>;
};

export const Description = props => {
	const { description = '', btnOptions = {}, handlers = {}, extra = {} } = props;
	const {
		majorButtonName = null,
		majorButtonLink = null,
		minorButtonName = null,
		minorButtonLink = null,
	} = btnOptions;

	return (
		<div className={styles['description-wrapper']}>
			<div>
				{description !== ''
					? formatMessageTemplate(description, { handlers: templateHandler })
					: ''}
			</div>
			{Object.keys(btnOptions).length > 0 && (
				<div className={styles['btn-wrapper']}>
					{minorButtonName && (
						<NotificationHandler
							{...{
								buttonName: minorButtonName,
								buttonParams: minorButtonLink,
								handlers,
								extra,
							}}
						/>
					)}
					{majorButtonName && (
						<NotificationHandler
							{...{
								buttonName: majorButtonName,
								buttonParams: majorButtonLink,
								handlers,
								extra,
								type: 'primary',
								style: { marginLeft: '15px' },
							}}
						/>
					)}
				</div>
			)}
		</div>
	);
};

const notificationType = {
	0: 'success',
	1: 'info',
	2: 'warning',
	3: 'error',
};

export const displayNotification = props => {
	const { data = {}, key, closeAction, handlers = {} } = props;
	const {
		title,
		description,
		level,
		major_button_name: majorButtonName,
		major_button_link: majorButtonLink,
		minor_button_name: minorButtonName,
		minor_button_link: minorButtonLink,
	} = data;

	const status = notificationType[level] || 'info';

	notification[status]({
		key,
		message: <Title {...{ title }} />,
		description: (
			<Description
				{...{
					description,
					handlers,
					extra: { key },
					btnOptions: {
						majorButtonName,
						majorButtonLink,
						minorButtonName,
						minorButtonLink,
					},
				}}
			/>
		),
		onClose: () => closeAction(key),

		// 测试时用
		duration: 8,
	});
};
