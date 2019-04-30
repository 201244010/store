import { customizeFetch } from '@/utils/fetch';

const fetchApi = customizeFetch('api/shop');

// 获得列表数据项
export const getList = (options = {}) => {
    const opt = {
        body: {
            page_size: 999,
            ...options,
        },
    };
    return fetchApi('getList', opt).then(response => response.json());
};

// 提交新建门店接口
export const createStore = (options = {}) => {
    const opt = {
        body: {
            ...options,
        },
    };
    return fetchApi('create', opt).then(response => response.json());
};

// 查看门店信息
export const storeInformation = (options = {}) => {
    const opt = {
        body: {
            ...options,
        },
    };
    return fetchApi('getInfo', opt).then(response => response.json());
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
    return fetchApi('getShopTypeList', opt).then(response => response.json());
};

export const getRegionList = (options = {}) => {
    const opt = {
        body: { ...options },
    };
    return fetchApi('getRegionList', opt).then(response => response.json());
};
