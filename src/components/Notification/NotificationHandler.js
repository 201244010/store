import React from 'react';
import { Button, Modal } from 'antd';
import ModalPlayer from '@/components/VideoPlayer/ModalPlayer';

import { formatMessageTemplate, convertArrayPrams } from '@/utils/utils';
import ipcTypes from '@/constants/ipcTypes';

const palyMotion = ({ params }) => {
	const { url = null, device_model: ipcType = null } = convertArrayPrams(params);
	const { pixelRatio = '16:9' } = ipcTypes[ipcType];
	const modal = Modal.info({
		title: '',
		content: (
			<ModalPlayer
				visible
				onClose={() => {
					if (modal) {
						modal.destroy();
					}
				}}
				videoUrl={url}
				pixelRatio={pixelRatio}
			/>
		),
		okButtonProps: { style: { dispaly: 'none' } },
	});
};

const ACTION_MAP = {
	'GET-AP-LIST': ({ handlers: { goToPath } }) => goToPath('baseStation'),
	'notif-device-esl-ap-offline-btn1': ({ handlers: { goToPath } }) => goToPath('baseStation'),
	'notif-ap-offline-btn1': ({ handlers: { goToPath } }) => goToPath('baseStation'),
	'notif-system-task-erp-btn1': ({ handers: { goToPath } }) => goToPath('productList'),
	'notif-device-ipc-motion-detect-video-btn1': palyMotion,
	'notif-device-ipc-motion-detect-audio-btn1': palyMotion,
	'notif-motion-detect-btn1': palyMotion,
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
