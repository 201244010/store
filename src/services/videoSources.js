import { customizeFetch } from '@/utils/fetch';
import CONFIG from '@/config';

const { IPC_SERVER } = CONFIG;


const request = customizeFetch('ipc/api/media',IPC_SERVER);

export const readVideoSources = async (params) => {
	const { deviceId, timeStart, timeEnd } = params;
	const result = await request('getVideoList', {
		method: 'post',
		body: {
			device_id: deviceId,
			start_time: timeStart,
			end_time: timeEnd
		}
	}).then(async (response) => {
		// console.log(response);
		const json = await response.json();
		return json;
	});

	return result;
};