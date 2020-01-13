import { format } from '@konata9/milk-shake';
import { customizeFetch } from '@/utils/fetch';

const fetchApi = customizeFetch('api/shop');

// 获得列表数据项
export const getList = (options = {}) => {
	const opt = {
		body: {
			...options,
		},
	};
	return fetchApi('getList', opt)
		.then(response => response.json())
		.then(res => format('toCamel')(res));
};

// 提交新建门店接口
export const createStore = (options = {}) => {
	const opt = {
		body: {
			...options,
		},
	};
	return fetchApi('create', opt)
		.then(response => response.json())
		.then(res => format('toCamel')(res));
};

// 查看门店信息
export const storeInformation = (options = {}) => {
	const opt = {
		body: {
			...options,
		},
	};
	return fetchApi('getInfo', opt)
		.then(response => response.json())
		.then(res => format('toCamel')(res));
};

// 修改门店信息接口
export const alterStore = (options = {}) => {
	const opt = {
		body: {
			...options,
		},
	};
	return fetchApi('update', opt).then(response => response.json());
};

export const getShopTypeList = (options = {}) => {
	const opt = {
		body: {
			...options,
		},
	};
	return fetchApi('getShopTypeList', opt).then(response => response.json()).then(res => format('toCamel')(res));;
};

export const getRegionList = (options = {}) => {
	const opt = {
		body: { ...options },
	};
	return fetchApi('getRegionList', opt).then(response => response.json()).then(res => format('toCamel')(res));;
};

export const getSaasBindInfo = (options = {}) => {
	const opt = {
		body: { ...options },
	};
	return fetchApi('getSaasBindInfo', opt).then(response => response.json());
};

export const getImportedErpInfo = (options = {}) => {
	const opt = {
		body: { ...options },
	};

	return fetchApi('getSaasDetailInfo', opt).then(response => response.json());
};

export const getAuthKey = (options = {}) => {
	const opts = {
		body: { ...format('toSnake')(options) },
	};

	return fetchApi('saas/getAuthKey', opts)
		.then(response => response.json())
		.then(data => format('toCamel')(data));
};
