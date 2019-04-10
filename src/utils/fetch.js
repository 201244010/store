import { message } from 'antd';
import { API_ADDRESS } from '@/config';

// 采用 UMI 框架的 UMI_ENV 来做区分
const env = process.env.UMI_ENV;
const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
  default: '未知错误，请联系网站管理员',
};

// 将最终送出的参数变为 formData 形式（参考自 ESL ）
const formatParams = (options = {}) => {
  const formData = new FormData();
  Object.keys(options).forEach(key => {
    formData.append(key, options.key);
  });

  return formData;
};

// TODO 为中间参数处理留下空间，具体等云端接口（如参数加密、sign 等）（参考自 ESL）
const customizeParams = (options = {}) => formatParams(options.body || {});

export const customizeFetch = (service = 'api') => {
  const baseUrl = API_ADDRESS[env];
  return async (api, options = {}) => {
    const customizedParams = customizeParams(options);
    const opts = {
      method: options.method || 'POST',
      headers: {
        ...options.headers,
      },
      body: customizedParams,
    };

    const url = `//${baseUrl}/${service}/${api}`;
    const response = fetch(url, opts);

    if (response.status !== 200) {
      // TODO 通用错误的处理 如 4xx、5xx 等交互确定方式
      const errMessage = codeMessage[response.status] || codeMessage.default;
      message.error(errMessage);
    }

    return response;
  };
};
