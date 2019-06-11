import { customizeFetch } from '@/utils/fetch';

const fetchApi = customizeFetch('api/role');

export const handleRoleManagement = (api, options = {}) => {
	const opts = {
		body: {
			...options,
		},
	};

	return fetchApi(api, opts).then(response => response.json());
};
