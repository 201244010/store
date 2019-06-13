import { customizeFetch } from '@/utils/fetch';

const fetchApi = customizeFetch('api/payment');

export const handleDashBoard = (api, options = {}) => {
	const opts = {
		body: {
			...options,
		},
	};

	return fetchApi(api, opts).then(response => response.json());
};
