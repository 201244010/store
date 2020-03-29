import { format } from '@konata9/milk-shake';
import { customizeFetch } from '@/utils/fetch';

const fetchApi = customizeFetch('api/device');

export const getDeviceOverview = options => {
	const opts = {
		method: 'POST',
		body: { ...format('toSnake')(options) },
	};

	return fetchApi('shop/status/getOverview', opts)
		.then(response => response.json())
		.then(data => format('toCamel')(data));
};