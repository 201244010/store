import { customizeFetch } from '@/utils/fetch';

const fetchApi = customizeFetch('esl/api/device/esl');
const fetchDeviceApi = customizeFetch('esl/api/device');

export const fetchElectricLabels = options => {
	const opts = {
		method: 'POST',
		body: {
			page_num: options.current,
			page_size: options.pageSize,
			keyword: options.keyword,
			status: options.status,
			sort_key: options.sort_key,
			desc: options.desc
		},
	};

	return fetchApi('getList', opts).then(response => response.json());
};

export const fetchESLDetails = options => {
	const opts = {
		method: 'POST',
		body: options,
	};

	return fetchApi('getInfo', opts).then(response => response.json());
};

export const changeTemplate = options => {
	const opts = {
		method: 'POST',
		body: options,
	};

	return fetchApi('changeTemplate', opts).then(response => response.json());
};

export const deleteESL = options => {
	const opts = {
		method: 'POST',
		body: options,
	};

	return fetchApi('delete', opts).then(response => response.json());
};

export const fetchFlashModes = options => {
	const opts = {
		method: 'POST',
		body: options,
	};

	return fetchApi('getFlashModeList', opts).then(response => response.json());
};

export const flashLed = options => {
	const opts = {
		method: 'POST',
		body: options,
	};

	return fetchApi('flashLed', opts).then(response => response.json());
};

export const getBindInfo = options => {
	const opts = {
		method: 'POST',
		body: options,
	};
	return fetchApi('getBindInfo', opts).then(response => response.json());
};

export const fetchDeviceOverview = () => {
	const opts = {
		method: 'POST',
		body: {},
	};

	return fetchDeviceApi('getOverview', opts).then(response => response.json());
};

export const refreshFailedImage = () => {
	const opts = {
		method: 'POST',
		body: {},
	};
	return fetchApi('repushFailedImage', opts).then(response => response.json());
};

export const setScanTiem = options => {
	const opts = {
		method: 'POST',
		body: options,
	};
	return fetchApi('setScanTime', opts).then(response => response.json());
};
