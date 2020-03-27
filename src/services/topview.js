import { format } from '@konata9/milk-shake';
import { customizeFetch } from '@/utils/fetch';

const fetchApiPassengerFlow = customizeFetch('api/passengerFlow/company/statistic');
const fetchApiOrder = customizeFetch('api/order/company/statistic');
const fetchApiIPC = customizeFetch('ipc/api/device/company');
const fetchApiSaas = customizeFetch('api/shop/saas/company');
const fetchApiDevice = customizeFetch('api/device/company');

export const handleTopViewPassengerFlow = (api, options = {}) => {
	const opts = {
		body: {
			...options,
		},
	};

	return fetchApiPassengerFlow(api, opts).then(response => response.json());
};

export const handleTopViewOrder = (api, options = {}) => {
	const opts = {
		body: {
			...options,
		},
	};

	return fetchApiOrder(api, opts).then(response => response.json());
};

export const getCompanySaasInfo = options => {
	// api/shop/saas/company/getAuthorizeInfo
	const opts = {
		body: { ...format('toSnake')(options) },
	};

	return fetchApiSaas('getAuthorizeInfo', opts)
		.then(response => response.json())
		.then(data => format('toCamel')(data));
};

export const getCompanyIPCList = options => {
	const opts = {
		body: { ...format('toSnake')(options) },
	};

	return fetchApiIPC('getList', opts)
		.then(response => response.json())
		.then(data => format('toCamel')(data));
};

// /api/device/company/status/getOverview

export const getDeviceOverView = options => {
	const opts = {
		body: { ...format('toSnake')(options) },
	};

	return fetchApiDevice('status/getOverview', opts)
		.then(response => response.json())
		.then(data => format('toCamel')(data));
};
