import { format } from '@konata9/milk-shake';
import { customizeFetch } from '@/utils/fetch';

const fetchApi = customizeFetch('api/service/subscription');

export const getServiceList = (options = {}) => {
	options = format('toSnake')(options);
	const opt = {
		body: {
			...options,
		},
	};
	return fetchApi('getList', opt).then(response => response.json());
};

export const getServiceDetail = (options = {}) => {
	const opt = {
		body: {
			...options,
		},
	};
	return fetchApi('getInfo', opt).then(response => response.json());
};
