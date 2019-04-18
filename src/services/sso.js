import { customizeFetch } from '@/utils/fetch';
import { SSO_ADDRESS, env } from '@/config/index';

const fetchApi = customizeFetch('api/sso/app/sso/1.0/?service=', SSO_ADDRESS[env]);

export const sendCode = (options = {}) => {
    const opts = {
        body: {
            language: 'zh',
            imgCode: '',
            key: '',
            ...options,
        },
    };

    return fetchApi('sendcode', opts, false).then(response => response.json());
};

export const verifyCode = (options = {}) => {
    const opts = {
        body: {
            ...options,
        },
    };

    return fetchApi('verifycode', opts, false).then(response => response.json());
};

export const checkUser = (options = {}) => {
    const opts = {
        body: {
            ...options,
            language: 'zh_cn',
        },
    };

    return fetchApi('checkusername', opts, false).then(response => response.json());
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

    return fetchApi('getimgcaptcha', opts, false).then(response => response.json());
};
