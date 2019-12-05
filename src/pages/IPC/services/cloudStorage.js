import { format } from '@konata9/milk-shake';
import { customizeFetch } from '@/utils/fetch';
// import CONFIG from '@/config';

// const { API_ADDRESS } = CONFIG;

// const request = customizeFetch('ipc/api/storage', API_ADDRESS);
const request = customizeFetch('ipc/api/storage', 'http://localhost:8000');


export const getStorageIpcList = (params) => 
	// params:{ deviceId } or params:{}
	// getStorageList
	request('getStorageList', { 
		body: format('toSnake')(params)
	}).then(
		async response => {
			const result = await response.json();
			return format('toCamel')(result);
		}
	);


