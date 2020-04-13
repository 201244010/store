/* 首页或客流趋势，检查是否异常 */
import { customizeFetch } from '@/utils/fetch';
import CONFIG from '@/config';

const { IPC_SERVER } = CONFIG;

/*
// 查询company_id下的saas
export const getCompanySaasList = (options = {}) => {
	const fetchApi = customizeFetch('api/shop', null, true, false); // false不需要shopId

	const opts = {
		body: {
			...options,
		},
	};

	return fetchApi('saas/company/getAuthorizeInfo', opts).then(response => response.json());
};
*/
// 查询shop_id下的saas
export const getShopSaasList = (options = {}) => {
	const fetchApi = customizeFetch('api/shop', null, true, true); // 需要shopId

	const opts = {
		body: {
			...options,
		},
	};

	return fetchApi('saas/getAuthorizeInfo', opts).then(response => response.json());
};

/*
// 查询company_id下的设备
export const getCompanyDevices = (options = {}) => {
	const fetchApi = customizeFetch('ipc/api', null, true, false); // false不需要shopId
	const opts = {
		body: {
			...options,
		},
	};

	return fetchApi('device/company/getList', opts).then(response => response.json());
};
*/

export const getShopDevices = (options = {}) => {
	const fetchApi = customizeFetch('ipc/api/device', IPC_SERVER);
	const opts = {
		body: {
			...options,
		},
	};
	return fetchApi('getDetailList', opts).then(response => response.json());
};