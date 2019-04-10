import { customizeFetch } from '@/utils/fetch';

const fetchApi = customizeFetch('api/store');

export const login = (options = {}) => {
  console.log(options);
  const opts = {
    body: {
      ...options,
    },
  };

  return fetchApi('login', opts).then(response => response.json());
};
