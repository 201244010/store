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

export const getLatestPassengerFlow = options => {
	const opts = {
		method: 'POST',
		body: { ...format('toSnake')(options) },
	};

	return fetchApi('statistic/getLatest', opts)
		.then(response => response.json())
		.then(data => format('toCamel')(data));
};

export const getTimeRangePassengerFlow = options => {
	const opts = {
		method: 'POST',
		body: { ...format('toSnake')(options) },
	};

	return fetchApi('statistic/getByTimeRange', opts)
		.then(response => response.json())
		.then(data => format('toCamel')(data));
};

export const getHistoryPassengerFlow = options => {
	const opts = {
		method: 'POST',
		body: { ...format('toSnake')(options) },
	};

	return fetchApi('statistic/history/getList', opts)
		.then(response => response.json())
		.then(data => format('toCamel')(data));
};

export const getHistoryTimeRangePassengerFlow = options => {
	const opts = {
		method: 'POST',
		body: { ...format('toSnake')(options) },
	};

	return fetchApi('statistic/history/getListByTimeRange', opts)
		.then(response => response.json())
		.then(data => format('toCamel')(data));
};

export const getLatestOrderList = options => {
	const opts = {
		method: 'POST',
		body: { ...format('toSnake')(options) },
	};

	return fetchApi('statistic/order/getLatest', opts)
		.then(response => response.json())
		.then(data => format('toCamel')(data));
};

export const getTimeRangeOrderList = options => {
	const opts = {
		method: 'POST',
		body: { ...format('toSnake')(options) },
	};

	return fetchApi('statistic/order/getByTimeRange', opts)
		.then(response => response.json())
		.then(data => format('toCamel')(data));
};

export const getHistoryPassengerTypeCount = options => {
	const opts = {
		method: 'POST',
		body: { ...format('toSnake')(options) },
	};

	return fetchApi('statistic/history/getByTimeRange', opts)
		.then(response => response.json())
		.then(data => format('toCamel')(data));
};

export const getHistoryEnteringDistribution = options => {
	const opts = {
		method: 'POST',
		body: { ...format('toSnake')(options) },
	};

	return fetchApi('statistic/history/getEnteringDistribution', opts)
		.then(response => response.json())
		.then(data => format('toCamel')(data));
};

export const getHistoryFrequencyList = options => {
	const opts = {
		method: 'POST',
		body: { ...format('toSnake')(options) },
	};

	return fetchApi('statistic/history/getFrequencyList', opts)
		.then(response => response.json())
		.then(data => format('toCamel')(data));
};

export const getPassengerOverview = options => {
	const opts = {
		method: 'POST',
		body: { ...format('toSnake')(options) },
	};

	return fetchApi('statistic/history/getOverview', opts)
		.then(response => response.json())
		.then(data => format('toCamel')(data));
};