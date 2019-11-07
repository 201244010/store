import { format } from '@konata9/milk-shake';
import { customizeFetch } from '@/utils/fetch';
import CONFIG from '@/config';

const { API_ADDRESS } = CONFIG;

const request = customizeFetch('api/order', API_ADDRESS);
// const request = customizeFetch('api/order', 'http://localhost:8000');



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