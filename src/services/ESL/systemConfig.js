import { customizeFetch } from '@/utils/fetch';

const fetchApi = customizeFetch('esl/api/device/esl/switchScreen');

export const fetchDisplayConfig = options => {
	const opts = {
		method: 'POST',
		body: options,
	};

	return fetchApi('getConfig', opts).then(response => response.json());
};

export const updateScreenName = options => {
	const opts = {
		method: 'POST',
		body: options,
	};

	return fetchApi('updateScreenName', opts).then(response => response.json());
};

export const updateTemplateConfig = options => {
	const opts = {
		method: 'POST',
		body: options,
	};

	return fetchApi('updateTemplateConfig', opts).then(response => response.json());
};
