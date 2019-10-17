import { format } from '@konata9/milk-shake';
import { customizeFetch } from '@/utils/fetch';

const fetchApi = customizeFetch('api/passengerFlow');

export const handlePassengerFlowManagement = (api, options = {}) => {
	const opts = {
		body: {
			...options,
		},
	};

	return fetchApi(api, opts).then(response => response.json());
};

export const getPassengerFlowHistory = options => {
	const opts = {
		method: 'POST',
		body: { ...format('toSnake')(options) },
	};

	return fetchApi('statistic/getHistory', opts)
		.then(response => response.json())
		.then(data => format('toCamel')(data));
};

export const getPassengerFlowHistoryTrend = options => {
	const opts = {
		body: { ...format('toSnake')(options) },
	};

	return fetchApi('statistic/history/getList', opts)
		.then(response => response.json())
		.then(data => format('toCamel')(data));
};

export const getPassengerFlowAgeByGender = options => {
	const opts = {
		body: { ...format('toSnake')(options) },
	};

	return fetchApi('statistic/age/getHistoryByGender', opts)
		.then(response => response.json())
		.then(data => format('toCamel')(data));
};

export const getPassengerFlowHistoryWithAgeAndGender = options => {
	const opts = {
		body: { ...format('toSnake')(options) },
	};

	return fetchApi('statistic/age/getHistoryWithAgeAndGender', opts)
		.then(response => response.json())
		.then(data => format('toCamel')(data));
};
