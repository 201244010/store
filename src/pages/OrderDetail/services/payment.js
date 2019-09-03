import { customizeFetch } from '@/utils/fetch';

const fetchApi = customizeFetch('api/payment');

/* 获取交易列表
返回订单号，金额，支付方式，时间 */
export const getList = (options = {}) => {
	const opt = {
		body: {
			...options,
		},
	};
	return fetchApi('getList', opt).then(response => response.json());
};

// 获取交易详情
export const getDetailList = (options = {}) => {
	const opt = {
		body: {
			...options,
		},
	};
	return fetchApi('getDetailList', opt).then(response => response.json());
};