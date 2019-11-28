import { format } from '@konata9/milk-shake';
import { customizeFetch } from '@/utils/fetch';
import CONFIG from '@/config';
import { ERROR_OK } from '@/constants/errorCode';

const { IPC_SERVER } = CONFIG;
const request = customizeFetch('ipc/api/storage', IPC_SERVER);
// const request2 = customizeFetch('ipc/api/storage','localhost:8000');

export const getServiceInfo = async (params) => {
	const { deviceId } = params;

	return request('getList', {
		body: {
			device_id: deviceId
		}
	}).then(async (response) => {
		const { code, data } = await response.json();
		if (code === ERROR_OK) {
			const { deviceList } = format('toCamel')(data);
			const { status, validTime } = format('toCamel')(deviceList[0]);
			return {
				code,
				data: {
					status,
					validTime
				}
			};
		}
		return {
			code
		};
	});
};