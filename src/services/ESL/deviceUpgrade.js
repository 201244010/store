import { customizeFetch } from '@/utils/fetch';

const fetchAPAPI = customizeFetch('esl/api/device/ap/firmware');
const fetchESLAPI = customizeFetch('esl/api/device/esl/firmware');

export const handleAPAction = (api, options = {}) => {
	const opts = {
		body: {
			...options,
		},
	};

	return fetchAPAPI(api, opts).then(response => response.json());
};

export const handleESLAction = (api, options = {}) => {
	const opts = {
		body: { ...options },
	};
	return fetchESLAPI(api, opts).then(response => response.json());
};
