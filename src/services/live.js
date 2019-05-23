import { customizeFetch } from '@/utils/fetch';
import { ERROR_OK } from '@/constants/errorCode';
import CONFIG from '@/config';

const { IPC_SERVER } = CONFIG;

const request = customizeFetch('ipc/api/media/stream', IPC_SERVER);

export const getLiveUrl = ({ clientId, sn }) =>
	request('start', {
		body: {
			// company_id: companyId,
			// shop_id:shopId,
			client_id: clientId,
			sn,
		},
	}).then(async response => {
		const {
			code,
			data: { url, stream_id, resolution },
		} = await response.json();
		if (code === ERROR_OK) {
			return {
				code: ERROR_OK,
				data: {
					url,
					streamId: stream_id,
					resolution,
				},
			};
		}
		return response;
	});

export const stopLive = ({ streamId, sn }) =>
	request('stop', {
		body: {
			stream_id: streamId,
			sn,
		},
	}).then(async response => {
		const { code } = await response.json();
		if (code === ERROR_OK) {
			return {
				code: ERROR_OK,
			};
		}
		return response;
	});
