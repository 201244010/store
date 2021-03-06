import { customizeFetch } from '@/utils/fetch';
import { ERROR_OK } from '@/constants/errorCode';

import CONFIG from '@/config';

const { IPC_SERVER } = CONFIG;
const request = customizeFetch('ipc/api/device', IPC_SERVER);
// const request = customizeFetch('ipc/api/device', 'localhost:8000');


const dataFormatter = (item) => ({
	deviceId: item.id,
	name: item.device_name,
	isOnline: item.active_status !== 0,
	type: item.model,
	img: item.cdn_address,
	sn: item.sn,
	binVersion: item.bin_version,
	checkTime: item.check_version_time
});

// return fetchApi('getList', opts).then(response => response.json());
export const getDeviceList = async () => {
	// const { shopId } = params;
	const list = request('getDetailList',{
		// body:{
		// 	company_id: companyId,
		// 	shopId: shopId
		// }

	}).then(async (response) => {
		const { data, code } = await response.json();
		if (code === ERROR_OK){
			// 获取到的list处理成统一格式输出。
			let ipcList = [];

			// console.log(data);
			const lists = Object.keys(data);

			lists.forEach(prop => {
				ipcList = ipcList.concat(data[prop]);
			});

			const result = ipcList.map(dataFormatter);

			return {
				code: ERROR_OK,
				data: result
			};
		}
		return response;

	});
	return list;
};

export const updateIPCName = ({ deviceId, deviceName }) => {
	const result = request('updateBaseInfo', {
		body: {
			device_id: deviceId,
			device_name: deviceName
		}
	}).then(response => {
		const data = response.json();
		return data;
	});

	return result;
};

export const unbind = ({ deviceId }) => {
	const result = request('unbind', {
		body: {
			device_id: deviceId
		}
	}).then(response => {
		const data = response.json();
		return data;
	});

	return result;
};

export const detectUpdate = ({ deviceId }) => {
	const result = request('firmware/detect', {
		body: {
			device_id: deviceId
		}
	}).then(async response => {
		const { code, data } = await response.json();
		if (code === ERROR_OK) {
			return {
				code,
				data:{
					version: data.latest_bin_version,
					needUpdate: data.upgrade_required === 1,
					url: data.url
				}

			};
		}

		return {
			code
		};
	});

	return result;
};
