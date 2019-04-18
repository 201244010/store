import { customizeFetch } from '@/utils/fetch';

const fetchApi = customizeFetch('api/company');

export const companyCreate = (options = {}) => {
  const opts = {
    body: {
      ...options,
    },
  };
  return fetchApi('create', opts).then(response => response.json());
};

export const companyGetInfo = (options = {}) => {
  const opts = {
    body: {
      ...options,
    },
  };
  return fetchApi('getInfo', opts).then(response => response.json());
};

export const companyUpdate = (options = {}) => {
  const opts = {
    body: {
      ...options,
    },
  };
  return fetchApi('update', opts).then(response => response.json());
};
