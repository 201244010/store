import { customizeFetch } from '@/utils/fetch';

const fetchApi = customizeFetch('api/store');

export const login = (type, options = {}) => {
  const opts = {
    body: {
      ...options,
    },
  };

  return fetchApi(type, opts).then(response => response.json());
};

export const logout = () => fetchApi('logout').then(response => response.json());

export const register = (options = {}) => {
  const opts = {
    body: {
      ...options,
    },
  };

  return fetchApi('register', opts).then(response => response.json());
};
