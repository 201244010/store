import { customizeFetch } from '@/utils/fetch';
import Storage from '@konata9/storage.js';

const fetchApi = customizeFetch('product');

export const fetchProductList = (options = {}) => {
  const opts = {
    method: 'POST',
    body: {
      page_num: options.current,
      page_size: options.pageSize || Storage.get('goodsPageSize'),
    },
  };

  return fetchApi('getList', opts).then(response => response.json());
};

export const searchGoodsList = (options = {}) => {
  const opts = {
    method: 'POST',
    body: {
      ...options,
      page_num: options.current,
      page_size: options.pageSize || Storage.get('goodsPageSize'),
    },
  };

  return fetchApi('search', opts).then(response => response.json());
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
