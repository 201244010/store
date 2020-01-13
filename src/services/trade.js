import { customizeFetch } from '@/utils/fetch';

const fetchApi = customizeFetch('api/trade');

export const handleTradeManagement = (api, options = {}) => {
	const opts = {
		body: {
			...options,
		},
	};

	return fetchApi(api, opts).then(response => response.json());
};
