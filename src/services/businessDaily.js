import { customizeFetch } from '@/utils/fetch';

const fetchApi = customizeFetch('api/order');

export const handleBusiness = (api, options = {}) => {
	const opts = {
		body: {
			...options,
		},
	};

	return fetchApi(api, opts).then(response => response.json());
};
