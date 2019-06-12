import { customizeFetch } from '@/utils/fetch';
import moment from 'moment';

const fetchApi = customizeFetch('api/monitor/esl');

function getTimestamp(time) {
	if(typeof(time) === 'string'){
		return Math.round(moment(time).valueOf()/ 1000);
	}
	if( time instanceof moment ){
		return Math.round(time.valueOf()/ 1000);
	}
	return '';
}

export const fetchCommunications = (options = {}) => {
	const opts = {
		method: 'POST',
		body: {
			keyword: options.keyword,
			reason: options.reason,
			result: options.result,
			start_time: getTimestamp(options.startTime),
			end_time: getTimestamp(options.endTime),
			page_num: options.current || 1,
			page_size: options.pageSize,
		},
	};

	return fetchApi('getCommList', opts).then(response => response.json());
};
