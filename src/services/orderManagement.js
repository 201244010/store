import { format } from '@konata9/milk-shake';
import { customizeFetch } from '@/utils/fetch';

const fetchApi = customizeFetch('api/trade/order');

const SORT = {
	SORT_VALUE: 'descend',
	IS_DESCEND: 'DESC',
	IS_ASCEND: 'ASC',
};


export const getOrderList = (options = {}) => {
	const { sortType } = options;
	const opt = {
		body: {
			...options,
			sortType: sortType === SORT.SORT_VALUE ? SORT.IS_DESCEND : SORT.IS_ASCEND
		},
	};
	const requestOpt = format('toSnake')(opt);
	return fetchApi('getList', requestOpt).then(response => response.json());
};

export const getOrderDetail = (options = {}) => {
	const opt = {
		body: {
			...options,
		},
	};
	return fetchApi('getInfo', opt).then(response => response.json());
};

export const cancelOrder = (options = {}) => {
	const opt = {
		body: {
			...options,
		},
	};
	return fetchApi('cancel', opt).then(response => response.json());
};