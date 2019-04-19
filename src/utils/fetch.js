// import { message } from 'antd';
import { env, API_ADDRESS, MD5_TOKEN } from '@/config';
import { cbcEncryption, md5Encryption } from '@/utils/utils';
import Storage from '@konata9/storage.js';

// const codeMessage = {
//   400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
//   401: '用户没有权限（令牌、用户名、密码错误）。',
//   403: '用户得到授权，但是访问是被禁止的。',
//   404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
//   406: '请求的格式不可得。',
//   410: '请求的资源被永久删除，且不会再得到的。',
//   422: '当创建一个对象时，发生一个验证错误。',
//   500: '服务器发生错误，请检查服务器。',
//   502: '网关错误。',
//   503: '服务不可用，服务器暂时过载或维护。',
//   504: '网关超时。',
//   default: '未知错误，请联系网站管理员',
// };

const unAuthHandler = () => {
    Storage.clear('session');
    window.location.href = `${window.location.origin}/user/login?redirect=${encodeURIComponent(
        window.location.pathname
    )}`;
};

// const errHandlerList = {
//   401: unAuthHandler,
//   default: () => null,
// };

export function paramsEncode(params, encryption) {
    const paramsString = JSON.stringify(params);
    return encryption ? cbcEncryption(paramsString) : paramsString;
}

export function getParamsSign(formData) {
    const md5Key = md5Encryption(MD5_TOKEN[env]);
    const { params, isEncrypted, timeStamp, randomNum } = formData;
    const signString = params + isEncrypted + timeStamp + randomNum + md5Key;
    return md5Encryption(signString);
}

const normalizeParams = params => {
    const formData = {};
    const tempParams = { ...params };
    formData.timeStamp = Math.floor(new Date().getTime() / 1000);
    formData.randomNum = Math.floor((Math.random() + 1) * 10 ** 9);
    formData.isEncrypted = tempParams.isEncrypted ? 1 : 0;
    delete tempParams.isEncrypted;

    if (tempParams.file) {
        formData.file = tempParams.file;
        delete tempParams.file;
    }

    if (tempParams.icon) {
        formData.icon = tempParams.icon;
        delete tempParams.icon;
    }

    const formParams =
        Object.keys(tempParams).length === 0 ? '' : paramsEncode(tempParams, formData.isEncrypted);

    formData.params = formParams;
    formData.sign = getParamsSign(formData);
    formData.lang = 'zh';
    return formData;
};

const formatParams = (options = {}) => {
    const formData = new FormData();
    Object.keys(options).forEach(key => {
        formData.append(key, options[key]);
    });

    return formData;
};

const customizeParams = (options = {}) => {
    const opts = {
        company_id: Storage.get('__company_id__') || 111,
        shop_id: Storage.get('__shop_id__') || 666,
        ...options.body,
    };

    const formattedParams = normalizeParams(opts);
    return formatParams(formattedParams || {});
};

export const customizeFetch = (service = 'api', base) => {
    const baseUrl = base || API_ADDRESS[env];
    return async (api, options = {}, withAuth = true) => {
        const customizedParams = customizeParams(options);
        const token = Storage.get('__token__') || '';
        const opts = {
            method: options.method || 'POST',
            headers: {
                ...options.headers,
            },
            body: customizedParams,
        };

        if (withAuth && token) {
            opts.headers = {
                ...opts.headers,
                Authorization: `Bearer ${token}`,
            };
        }

        const url = `//${baseUrl}/${service}/${api}`;
        const response = await fetch(url, opts);

        if (response.status === 401) {
            // const errHandler = errHandlerList[`${response.status}`] || errHandlerList.default;
            // const errMessage = codeMessage[response.status] || codeMessage.default;
            // message.error(errMessage);
            // errHandler();
            unAuthHandler();
        }

        return response;
    };
};
