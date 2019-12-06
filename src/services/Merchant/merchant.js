import { format } from '@konata9/milk-shake';
import { customizeFetch } from '@/utils/fetch';

const fetchApi = customizeFetch('api/company');

export const companyCreate = (options = {}) => {
	const opts = {
		body: { ...format('toSnake')(options) },
	};
	return fetchApi('create', opts).then(response => response.json());
};

export const companyGetInfo = (options = {}) => {
	const opts = {
		body: { ...format('toSnake')(options) },
	};
	return fetchApi('getInfo', opts).then(response => response.json());
};

export const companyUpdate = (options = {}) => {
	const opts = {
		body: { ...format('toSnake')(options) },
	};
	return fetchApi('update', opts).then(response => response.json());
};

export const getCompanyList = (options = {}) => {
	const opts = {
		body: {
			page_size: 99,
			...format('toSnake')(options),
		},
	};
	return fetchApi('getList', opts).then(response => response.json());
};

export const initialCompany = (options = {}) => {
	const opts = {
		body: { ...format('toSnake')(options) },
	};
	return fetchApi('initSetup', opts).then(response => response.json());
};

export const getAuthMenu = (options = {}) => {
	const opts = {
		body: { ...format('toSnake')(options) },
	};
	return fetchApi('menu/getList', opts).then(response => response.json());
};
