import { format } from '@konata9/milk-shake';
import { customizeFetch } from '@/utils/fetch';
import CONFIG from '@/config';

const { IPC_SERVER } = CONFIG;
const request = customizeFetch('ipc/api/device', IPC_SERVER);
// const request2 = customizeFetch('ipc/api/storage','localhost:8000');

export const getServiceInfo = async (params) => request('getStorageList', {

	body: format('toSnake')(params)

}).then(async (response) => {

	const result = await response.json();
	return format('toCamel')(result);
});
