import { customizeFetch } from '@/utils/fetch';

const fetchApi = customizeFetch('api/product');

export const getProductOverView = (options = {}) => {
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

export const deleteProduct = ({ id }) => {
    const opts = {
        method: 'POST',
        body: {
            product_id: id,
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

// TODO 获取 erp 对接平台列表的接口
export const getERPPlatformList = (options = {}) => {
    const opts = {
        method: 'POST',
        body: {
            ...options,
        },
    };

    return fetchApi('', opts).then(response => response.json());
};

// TODO 进行 ERP 对接并抽取数据
export const erpImport = (options = {}) => {
    const opts = {
        method: 'POST',
        body: {
            ...options,
        },
    };

    return fetchApi('', opts).then(response => response.json());
};
