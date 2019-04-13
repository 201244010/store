import { customizeFetch } from '@/utils/fetch';
import Storage from '@konata9/storage.js';

const fetchApi = customizeFetch('product');

export const fetchProductList = options => {
  const opts = {
    method: 'POST',
    body: {
      page_num: options.current,
      page_size: options.pageSize || Storage.get('goodsPageSize'),
    },
  };

  return fetchApi('getList', opts).then(response => response.json());
};

export const searchGoodsList = options => {
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

export const getProductDetail = options => {
  const opts = {
    method: 'POST',
    body: {
      ...options,
    },
  };

  return fetchApi('getInfo', opts).then(response => response.json());
};

export const createProduct = options => {
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

export const updateProduct = options => {
  const opts = {
    method: 'POST',
    body: {
      ...options,
    },
  };

  return fetchApi('update', opts).then(response => response.json());
};

export const uploadProducts = options => {
  const opts = {
    method: 'POST',
    body: {
      ...options,
    },
  };

  return fetchApi('uploadProducts', opts).then(response => response.json());
};

export const bindEsl = options => {
  const opts = {
    method: 'POST',
    body: {
      ...options,
    },
  };

  return fetchApi('bindEsl', opts).then(response => response.json());
};

export const unbindEsl = options => {
  const opts = {
    method: 'POST',
    body: {
      ...options,
    },
  };

  return fetchApi('unbindEsl', opts).then(response => response.json());
};

export const getBindEsl = options => {
  const opts = {
    method: 'POST',
    body: {
      ...options,
    },
  };

  return fetchApi('getBindEsl', opts).then(response => response.json());
};

export const flushEsl = options => {
  const opts = {
    method: 'POST',
    body: {
      ...options,
    },
  };

  return fetchApi('flushEsl', opts).then(response => response.json());
};

export const changeMode = options => {
  const opts = {
    method: 'POST',
    body: {
      ...options,
    },
  };

  return fetchApi('changeMode', opts).then(response => response.json());
};

export const importFileCheck = options => {
  const opts = {
    method: 'POST',
    body: {
      ...options,
    },
  };

  return fetchApi('fileImport', opts).then(response => response.json());
};
