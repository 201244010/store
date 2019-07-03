import { customizeFetch } from '@/utils/fetch';

const fetchApi = customizeFetch('api/employee');

export const handleEmployee = (api, options = {}) => {
	const opts = {
		body: {
			...options,
		},
	};

	return fetchApi(api, opts).then(response => response.json());
};
