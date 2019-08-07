import { customizeFetch } from '@/utils/fetch';

const fetchApi = customizeFetch('api/user');

export const login = (type, options = {}) => {
	const opts = {
		body: {
			...options,
			// TODO 临时修改，以后会修正
			app_type: 2,
		},
	};
	return fetchApi(type, opts, false).then(response => response.json());
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

export const refreshStoreToken = (options = {}) => {
	const opts = {
		body: {
			...options,
		},
	};
	return fetchApi('refreshStoreToken', opts).then(response => response.json());
};

export const checkImgCode = (options = {}) => {
	const opts = {
		body: {
			...options,
		},
	};
	return fetchApi('checkImgCode', opts).then(response => response.json());
};

export const resetPassword = (options = {}) => {
	const opts = {
		body: {
			...options,
		},
	};
	return fetchApi('resetPassword', opts).then(response => response.json());
};

export const getUserInfo = () => fetchApi('getUserinfo').then(response => response.json());

export const updateUsername = (options = {}) => {
	const opts = {
		body: {
			...options,
		},
	};
	return fetchApi('updateUsername', opts).then(response => response.json());
};

export const changePassword = (options = {}) => {
	const opts = {
		body: {
			...options,
		},
	};
	return fetchApi('changePassword', opts).then(response => response.json());
};

export const updatePhone = (options = {}) => {
	const opts = {
		body: {
			...options,
		},
	};
	return fetchApi('updatePhone', opts).then(response => response.json());
};

export const updateIcon = (options = {}) => {
	const opts = {
		body: {
			...options,
		},
	};
	return fetchApi('updateIcon', opts).then(response => response.json());
};

export const checkUserExist = (options = {}) => {
	const opts = { body: { ...options } };
	return fetchApi('isUserExist', opts).then(response => response.json());
};

export const createEmqToken = () => {
	const opts = { body: { source: 'WEB' } };
	return fetchApi('createEmqToken', opts).then(response => response.json());
};
