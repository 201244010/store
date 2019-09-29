import { format } from '@konata9/milk-shake';
import { customizeFetch } from '@/utils/fetch';
import CONFIG from '@/config';

const { API_ADDRESS } = CONFIG;

const request = customizeFetch('api/agreement', API_ADDRESS);


export const getLatestAgreement = (params) => {
	const { type, lang } = params;
	return request('getLatest', {
		body:{
			type,
			lang
		}
	}).then(
		async response => {
			const result = await response.json();
			return format('toCamel')(result);
		}
	);
};

export const acceptAgreement = (params) => request('accept', {
	body: format('toSnake')(params)
}).then(
	async response => {
		const result = await response.json();
		return format('toCamel')(result);
	}
);

