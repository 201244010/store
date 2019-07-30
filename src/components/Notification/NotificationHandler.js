import React from 'react';
import { Button, Modal } from 'antd';
// import ModalPlayer from '@/components/VideoPlayer/ModalPlayer';
import VideoPlayComponent from '@/pages/IPC/component/VideoPlayComponent';

import { formatMessageTemplate, convertArrayPrams } from '@/utils/utils';
// import ipcTypes from '@/constants/ipcTypes';

const palyMotion = ({ params }) => {
	const { url = null, device_model: ipcType = null } = convertArrayPrams(params);
	// const { pixelRatio = '16:9' } = ipcTypes[ipcType] || {};
	const modal = Modal.info({
		title: '',
		content: (
			<>
				{url && (
					<VideoPlayComponent
						playing
						onClose={() => {
							if (modal) {
								modal.destroy();
							}
						}}
						videoUrl={url}
						ipcType={ipcType}
						// pixelRatio={pixelRatio}
					/>
				)}
			</>
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
	// 需格式化
	'notif-device-ipc-tf-card-detect-tf-exist-btn1': async ({
		handlers: { formatSdCard, goToPath, removeNotification, getSdStatus },
		params,
		extra,
	}) => {
		const deviceSn = params.split('&')[0].split('=')[1];
		const status = await getSdStatus(deviceSn);
		if (status === 1) {
			formatSdCard(deviceSn);
		}
		goToPath('ipcManagement', { sn: deviceSn });
		if (removeNotification) {
			const { key } = extra;
			removeNotification(key);
		}
	},
	// TF卡拔出
	'notif-device-ipc-tf-card-detect-tf-non-exist-btn1': ({
		handlers: { goToPath, removeNotification },
		params,
		extra,
	}) => {
		const deviceSn = params.split('&')[0].split('=')[1];
		goToPath('ipcManagement', { sn: deviceSn });
		if (removeNotification) {
			const { key } = extra;
			removeNotification(key);
		}
	},
	// TF卡可用
	'notif-device-ipc-tf-card-detect-tf-capable-btn1': ({
		handlers: { goToPath, removeNotification },
		params,
		extra,
	}) => {
		const deviceSn = params.split('&')[0].split('=')[1];
		goToPath('ipcManagement', { sn: deviceSn });
		if (removeNotification) {
			const { key } = extra;
			removeNotification(key);
		}
	},
	// TF卡不可用
	'notif-device-ipc-tf-card-detect-tf-non-capable-btn1': ({
		handlers: { goToPath, removeNotification },
		params,
		extra,
	}) => {
		const deviceSn = params.split('&')[0].split('=')[1];
		goToPath('ipcManagement', { sn: deviceSn });
		if (removeNotification) {
			const { key } = extra;
			removeNotification(key);
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
