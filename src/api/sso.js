import { customizeFetch } from '@/utils/fetch';

const fetchApi = customizeFetch('api/sso/app/sso/1.0/?service=', 'dev.api.sunmi.com');

export const sendCode = (options = {}) => {
  const opts = {
    body: {
      ...options,
      language: 'zh',
      imgCode: '',
      key: '',
    },
  };

  return fetchApi('sendcode', opts).then(response => response.json());
};

export const verifyCode = (options = {}) => {
  const opts = {
    body: {
      ...options,
    },
  };

  return fetchApi('verifycode', opts).then(response => response.json());
};

export const checkUser = (options = {}) => {
  const opts = {
    body: {
      ...options,
      language: 'zh_cn',
    },
  };

  console.log(opts);

  return fetchApi('checkusername', opts).then(response => response.json());
};

export const getImageCode = (options = {}) => {
  const opts = {
    body: {
      width: '112',
      height: '40',
      fontSize: '18',
      ...options,
    },
  };

  return fetchApi('getimgcaptcha', opts).then(response => response.json());
};
