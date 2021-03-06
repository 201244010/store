import { message } from 'antd';
import { formatMessage } from 'umi/locale';
import router from 'umi/router';
import { fetch } from 'whatwg-fetch';
import { format } from '@konata9/milk-shake';
import CONFIG from '@/config';
import { cbcEncryption, idDecode, md5Encryption } from '@/utils/utils';
import { USER_NOT_LOGIN } from '@/constants/errorCode';
import * as CookieUtil from '@/utils/cookies';

// import 'abortcontroller-polyfill/dist/abortcontroller-polyfill-only';

const { API_ADDRESS, MD5_TOKEN } = CONFIG;
const ERR_INTERNET_DISCONNECTED = 9999;
const GATEWAY_ERR = 9998;

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

// const abortableFetch = ('signal' in new Request('')) ? window.fetch : fetch;
// export const controller = new AbortController();

const unAuthHandler = () => {
	CookieUtil.clearCookies();
	window.location.href = `${window.location.origin}/user/login?redirect=${encodeURIComponent(
		window.location.pathname
	)}`;
};

const noAuthhandler = () => {
	router.push('/exception/403');
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
	const md5Token = idDecode(MD5_TOKEN, 'symbol');
	const md5Key = md5Encryption(md5Token);
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

	formData.params =
		Object.keys(tempParams).length === 0 ? '' : paramsEncode(tempParams, formData.isEncrypted);
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

const customizeParams = (options = {}, toSnake = true) => {
	const companyId = CookieUtil.getCookieByKey(CookieUtil.COMPANY_ID_KEY) || '';
	const shopId = CookieUtil.getCookieByKey(CookieUtil.SHOP_ID_KEY) || '';

	// const opts =  format('toSnake')({
	// 	companyId,
	// 	shopId,
	// 	...options.body,
	// });
	let opts = {};
	if (toSnake) {
		opts = format('toSnake')({
			companyId,
			shopId,
			...options.body,
		});
	} else {
		opts = {
			...format('toSnake')({
				companyId,
				shopId,
			}),
			...options.body,
		};
	}

	const formattedParams = normalizeParams(opts);
	return formatParams(formattedParams || {});
};

const fetchHandler = async (url, opts) => {
	try {
		const response = await fetch(url, opts);
		return response;
	} catch (err) {
		return new Response(JSON.stringify({ code: ERR_INTERNET_DISCONNECTED }));
	}
};

export const customizeFetch = (service = 'api', base, toSnake) => {
	const baseUrl = base || API_ADDRESS;
	return async (api, options = {}, withAuth = true) => {
		const customizedParams = customizeParams(options, toSnake);
		const token = CookieUtil.getCookieByKey(CookieUtil.TOKEN_KEY) || '';
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

		const url = `${baseUrl}/${service}/${api}`;
		// const response = await fetch(url, opts);
		let response = await fetchHandler(url, opts);
		// console.log(response);

		if (response.status !== 200) {
			if (response.status === 401) {
				unAuthHandler();
			} else if (response.status === 403) {
				noAuthhandler();
			} else if (response.status === 502) {
				response = new Response(JSON.stringify({ code: GATEWAY_ERR }));
			}
		}

		const result = await response.clone().json();
		if (result.code === ERR_INTERNET_DISCONNECTED) {
			message.error(formatMessage({ id: 'app.network.disconnect' }));
		} else if (result.code === USER_NOT_LOGIN) {
			unAuthHandler();
		}

		// if (result.code !== ERROR_OK) {
		// 	if (ALERT_NOTICE_MAP[result.code]) {
		// 		message.error(formatMessage({ id: ALERT_NOTICE_MAP[result.code] }));
		// 	} else {
		// 		// message.error('操作错误');
		// 	}
		// }

		return response;
	};
};
