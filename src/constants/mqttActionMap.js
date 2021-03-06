import { convertArrayPrams } from '@/utils/utils';

export const ACTION_MAP = {
	'GET-AP-LIST': ({ handlers: { goToPath } }) => goToPath('baseStation'),
	'notif-ap-offline-btn1': ({ handlers: { goToPath } }) => goToPath('baseStation'),
	'notif-motion-detect-btn1': ({ params }) => {
		const { url = null, device_model = null } = convertArrayPrams(params);
		return {
			action: 'showMotionVideo',
			payload: { url, ipcType: device_model },
		};
	},
	'notif-motion-detect-btn2': ({
		handlers: { goToPath, removeNotification },
		extra: { from = null, key = null } = {},
	}) => {
		if (from === 'mqtt') {
			removeNotification(key);
		} else {
			goToPath('notificationList');
		}
	},
};
