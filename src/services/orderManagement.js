import { format } from '@konata9/milk-shake';
import { customizeFetch } from '@/utils/fetch';

const fetchApi = customizeFetch('api/trade/order');

export const getOrderList = (options = {}) => {
	options = format('toSnake')(options);
	const opt = {
		body: {
			...options,
		},
	};
	return fetchApi('getList', opt).then(response => response.json());
};

export const getOrderDetail = (options = {}) => {
	const opt = {
		body: {
			...options,
		},
	};
	return fetchApi('getInfo', opt).then(response => response.json());
};

export const cancelOrder = (options = {}) => {
	const opt = {
		body: {
			...options,
		},
	};
	return fetchApi('cancel', opt).then(response => response.json());
};