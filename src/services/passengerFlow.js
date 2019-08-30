import { customizeFetch } from '@/utils/fetch';

const fetchApi = customizeFetch('api/passengerFlow');

export const handlePassengerFlowManagement = (api, options = {}) => {
	const opts = {
		body: {
			...options,
		},
	};

	return fetchApi(api, opts).then(response => response.json());
};
