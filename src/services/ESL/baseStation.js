import { customizeFetch } from '@/utils/fetch';

const fetchApi = customizeFetch('esl/api/device/ap');

export const fetchBaseStations = (options = {}) => {
	const opts = {
		method: 'POST',
		body: {
			keyword: options.keyword,
			status: options.status,
			page_num: options.current || 1,
			page_size: options.pageSize,
		},
	};

	return fetchApi('getList', opts).then(response => response.json());
};

export const getBaseStationDetail = options => {
	const opts = {
		method: 'POST',
		body: {
			...options,
		},
	};

	return fetchApi('getInfo', opts).then(response => response.json());
};

export const deleteBaseStation = options => {
	const opts = {
		method: 'POST',
		body: {
			...options,
		},
	};

	return fetchApi('delete', opts).then(response => response.json());
};

export const restartBaseStation = options => {
	const opts = {
		method: 'POST',
		body: { ...options },
	};
	return fetchApi('reboot', opts).then(response => response.json());
};

export const changeBaseStationName = options => {
	const opts = {
		method: 'POST',
		body: { ...options },
	};
	return fetchApi('updateName', opts).then(response => response.json());
};
