import { customizeFetch } from '@/utils/fetch';
import { ERROR_OK } from '@/constants/errorCode';
import CONFIG from '@/config';

const { IPC_SERVER } = CONFIG;
const request = customizeFetch('api/shop/member', IPC_SERVER);

export const getMemberStatus = () => {
	const status = request('getService').then((response) => {
		const { code, data } = response.json();

		if (code === ERROR_OK) {
			return {
				code,
				data
			};
		}

		return {
			code
		};
	});
	return status;
};

export const startMember = () => {
	const status = request('storage/start')
		.then((response) => response.json());
	return status;
};

export const stopMember = () => {
	const status = request('storage/stop')
		.then((response) => response.json());
	return status;
};