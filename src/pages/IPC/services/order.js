import { format } from '@konata9/milk-shake';
import { customizeFetch } from '@/utils/fetch';
import CONFIG from '@/config';

const { API_ADDRESS } = CONFIG;

const request = customizeFetch('api/trade/order', API_ADDRESS);
// const request = customizeFetch('api/trade/order', 'http://localhost:8000');

export const order = (params) => {

	console.log(params);

	// params: { productList } (productNo, deviceSN, productCnt, orderSource)
	return request('create', {
		body: format('toSnake')(params)
	}).then(
		async response => {
			// console.log(response);
			const result = await response.json();
			console.log(result);
			return format('toCamel')(result);
		}
	);
};

export const getOrderInfo = (params) => request('getInfo', {
	body: format('toSnake')(params)
}).then(
	async response => {
		const result = await response.json();
		return format('toCamel')(result);
	}
);
