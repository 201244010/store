import { customizeFetch } from '@/utils/fetch';

const fetchApi = customizeFetch('api/product');

export const fetchProductOverview = (options = {}) => {
	const opts = {
		method: 'POST',
		body: {
			...options,
		},
	};

	return fetchApi('getOverview', opts).then(response => response.json());
};

export const fetchProductList = (options = {}) => {
	const opts = {
		method: 'POST',
		body: {
			keyword: options.keyword,
			status: options.status || -1,
			page_num: options.current,
			page_size: options.pageSize,
		},
	};

	return fetchApi('getList', opts).then(response => response.json());
};

export const getProductDetail = (options = {}) => {
	const opts = {
		method: 'POST',
		body: {
			...options,
		},
	};

	return fetchApi('getInfo', opts).then(response => response.json());
};

export const createProduct = (options = {}) => {
	const opts = {
		method: 'POST',
		body: {
			...options,
		},
	};

	return fetchApi('create', opts).then(response => response.json());
};

export const deleteProduct = ({ product_id_list }) => {
	const opts = {
		method: 'POST',
		body: {
			product_id_list,
		},
	};

	return fetchApi('delete', opts).then(response => response.json());
};

export const updateProduct = (options = {}) => {
	const opts = {
		method: 'POST',
		body: {
			...options,
		},
	};

	return fetchApi('update', opts).then(response => response.json());
};

export const getERPPlatformList = (options = {}) => {
	const opts = {
		method: 'POST',
		body: {
			...options,
		},
	};

	return fetchApi('getSaasList', opts).then(response => response.json());
};

export const checkSaasInfo = (options = {}) => {
	const opts = {
		method: 'POST',
		body: {
			...options,
		},
	};
	return fetchApi('checkSaasInfoAvailable', opts).then(response => response.json());
};

export const erpImport = (options = {}) => {
	const opts = {
		method: 'POST',
		body: {
			...options,
		},
	};

	return fetchApi('import', opts).then(response => response.json());
};

export const importByExcel = (options = {}) => {
	const opts = {
		method: 'POST',
		body: {
			...options,
		},
	};

	return fetchApi('importByExcel', opts).then(response => response.json());
};

export const downloadExcelTemplate = (options = {}) => {
	const opts = {
		method: 'POST',
		body: {
			...options,
		},
	};

	return fetchApi('downloadTemplate', opts).then(response => response.json());
};
