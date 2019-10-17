import { format } from '@konata9/milk-shake';
import { customizeFetch } from '@/utils/fetch';
import CONFIG from '@/config';

const { API_ADDRESS } = CONFIG;
// const LOCAL_SERVER = 'localhost:8000';
const request = customizeFetch('ipc/api/face/history/arrival', API_ADDRESS);
// const localRequest = customizeFetch('api/face/history/arrival', LOCAL_SERVER);


export const getArrivalList = (params) => {
	const { deviceId, faceId, pageNum, pageSize } = params;
	return request('getList', {
		body: {
			device_id: deviceId,
			face_id: faceId,
			page_num: pageNum,
			page_size: pageSize
		}
	}).then(
		async response => {
			const result = await response.json();
			return format('toCamel')(result);
		}
	);
};




export const deleteArrivalItem = (params) => {
	const { historyIdList } = params;
	return request('delete',{
		body: {
			history_id_list:historyIdList
		}
	}).then(
		async response => {
			const result = await response.json();
			return format('toCamel')(result);
		}
	);
};