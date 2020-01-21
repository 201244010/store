import { customizeFetch } from '@/utils/fetch';

const fetchApi = customizeFetch('esl/api/product');

export const bindESL = options => {
	const opts = {
		method: 'POST',
		body: options,
	};

	return fetchApi('bindESL', opts).then(response => response.json());
};

export const unbindESL = options => {
	const opts = {
		method: 'POST',
		body: options,
	};

	return fetchApi('unbindEsl', opts).then(response => response.json());
};

export const batchUnbindESL = options => {
	const opts = {
		method: 'POST',
		body: options,
	};

	return fetchApi('batchUnbindEsl', opts).then(response => response.json());
};

export const flushESL = options => {
	const opts = {
		method: 'POST',
		body: options,
	};

	return fetchApi('flushEsl', opts).then(response => response.json());
};

export const batchFlushESL = options => {
	const opts = {
		method: 'POST',
		body: options,
	};

	return fetchApi('batchFlushEsl', opts).then(response => response.json());
};
