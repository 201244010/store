import { customizeFetch } from '@/utils/fetch';
import CONFIG from '@/config';

const { SSO_ADDRESS } = CONFIG;

const fetchApi = customizeFetch('api/sso/app/sso/1.0/?service=', SSO_ADDRESS, false);

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
			width: '76',
			height: '30',
			fontSize: '16',
			...options,
		},
	};

	return fetchApi('getimgcaptcha', opts, false).then(response => response.json());
};
