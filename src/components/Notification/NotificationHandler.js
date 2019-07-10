import React from 'react';
import { Button, Modal } from 'antd';
import VideoPlayComponent from '@/pages/IPC/component/VideoPlayComponent';
import { formatMessageTemplate, convertArrayPrams } from '@/utils/utils';

const ACTION_MAP = {
	'GET-AP-LIST': ({ handlers: { goToPath } }) => goToPath('baseStation'),
	'notif-ap-offline-btn1': ({ handlers: { goToPath } }) => goToPath('baseStation'),
	'notif-motion-detect-btn1': ({ params }) => {
		const { url = null, device_model: ipcType = null } = convertArrayPrams(params);
		const modal = Modal.info({
			title: '',
			content: (
				<VideoPlayComponent
					playing
					watchVideoClose={() => {
						if (modal) {
							modal.destroy();
						}
					}}
					videoUrl={url}
					ipcType={ipcType}
				/>
			),
			okButtonProps: { style: { dispaly: 'none' } },
		});
	},
	'notif-motion-detect-btn2': ({
		handlers: { goToPath = null, removeNotification = null } = {},
		extra: { from = null, key = null } = {},
	}) => {
		if (from === 'mqtt' && removeNotification) {
			removeNotification(key);
		} else {
			goToPath('notificationList');
		}
	},
};

const NotificationHandler = props => {
	const {
		buttonName = null,
		buttonParams = null,
		handlers = {},
		extra = {},
		type = null,
		style = {},
	} = props;

	const handleAction = () => {
		if (buttonName) {
			const hander = ACTION_MAP[buttonName] || (() => null);
			hander({ handlers, params: buttonParams, extra });
		}
	};

	return (
		<Button type={type} style={style} onClick={handleAction}>
			{formatMessageTemplate(buttonName)}
		</Button>
	);
};

export default NotificationHandler;
