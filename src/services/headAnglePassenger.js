import { format } from '@konata9/milk-shake';
import { customizeFetch } from '@/utils/fetch';

const fetchApi = customizeFetch('api/passengerFlow/company/statistic/history');

export const getHeadPassengerByRegular = ( options = {}) => {
	const opts = {
		method: 'POST',
		body: { ...format('toSnake')(options) },
	};
	
	return fetchApi('ageRegular/getByDate', opts)
		.then(response => response.json())
		.then(data => format('toCamel')(data));
};

export const getHeadPassengerByGender = ( options = {}) => {
	const opts = {
		method: 'POST',
		body: { ...format('toSnake')(options) },
	};
	
	return fetchApi('ageGender/getByDate', opts)
		.then(response => response.json())
		.then(data => format('toCamel')(data));
};

export const getHeadShopListByRegular = ( options = {}) => {
	const opts = {
		method: 'POST',
		body: { ...format('toSnake')(options) },
	};
	
	return fetchApi('ageRegular/branch/getByDate', opts)
		.then(response => response.json())
		.then(data => format('toCamel')(data));
};

export const getHeadShopListByGender = ( options = {}) => {
	const opts = {
		method: 'POST',
		body: { ...format('toSnake')(options) },
	};
	
	return fetchApi('ageGender/branch/getByDate', opts)
		.then(response => response.json())
		.then(data => format('toCamel')(data));
};