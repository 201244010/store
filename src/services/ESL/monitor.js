import { customizeFetch } from '@/utils/fetch';

const fetchApi = customizeFetch('/esl/api/monitor/esl');

export const fetchCommunications = (options = {}) => {
	const opts = {
		method: 'POST',
		body: {
			start_time: options.startTime,
			end_time: options.endTime,
			page_num: options.current || 1,
			page_size: options.pageSize,
		},
	};

	return fetchApi('getCommList', opts).then(response => response.json());
};
