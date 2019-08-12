import { customizeFetch } from '@/utils/fetch';

const fetchApi = customizeFetch('network/api');

export const handleNetworkEquipment = (api, options = {}) => {
	const opts = {
		body: {
			...options,
		},
	};

	return fetchApi(api, opts).then(response => response.json());
};
