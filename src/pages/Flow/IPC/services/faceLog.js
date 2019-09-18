import { format } from '@konata9/milk-shake';
import { customizeFetch } from '@/utils/fetch';
import CONFIG from '@/config';

const { API_ADDRESS } = CONFIG;
// const LOCAL_SERVER = 'localhost:8000';
const request = customizeFetch('ipc/api/face/history', API_ADDRESS);
// const localRequest = customizeFetch('api/face/history', LOCAL_SERVER);

export const getFaceLogList = (params) => {
	const { age, gender, groupId, name, pageNum, pageSize, faceId } = params;
	return request('getList', {
		body:{
			age_range_code: age,
			gender,
			group_id: groupId,
			name,
			page_num: pageNum,
			page_size: pageSize,
			face_id: faceId
		}
	}).then(
		async response => {
			const result = await response.json();
			return format('toCamel')(result);
		}
	);
};

