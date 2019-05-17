import { customizeFetch } from '@/utils/fetch';
import { ERROR_OK } from '@/constants/errorCode';
import CONFIG from '@/config';

const { IPC_SERVER } = CONFIG;

const request = customizeFetch('ipc/api/device', IPC_SERVER);

export const getSdStatus = async (params) => {
	const { deviceId } = params;
	return request('getSdStatus', {
		body: {
			device_id: deviceId
		}

	}).then(async (response) => {
		const { code, data } = await response.json();

		if (code === ERROR_OK) {
			const status = data.sd_status_code;
			// console.log('-----------------');
			// console.log(status);
			return {
				code: ERROR_OK,
				status
			};

		}
		return response;

	});
};