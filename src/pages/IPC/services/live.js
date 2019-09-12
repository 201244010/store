import { customizeFetch } from '@/utils/fetch';
import { ERROR_OK } from '@/constants/errorCode';
import CONFIG from '@/config';

const { IPC_SERVER } = CONFIG;
// const IPC_SERVER = 'localhost:8000';

const requestStream = customizeFetch('ipc/api/media/stream', IPC_SERVER);
const requestVideo = customizeFetch('ipc/api/media/video', IPC_SERVER);

export const getLiveUrl = ({ deviceId, clientId, resolution}) => {
	const result = requestStream('live/start', {
		body: {
			device_id: deviceId,
			client_id: clientId,
			resolution
		}
	}).then(async (response) => {
		const { code, data: { url, stream_id: streamId } } = await response.json();
		if (code === ERROR_OK) {
			return {
				code: ERROR_OK,
				data: {
					url,
					streamId,
					resolution
				}
			};
		}
		return {
			code
		};
	});
	return result;
};
// export const getLiveUrl = ({ clientId, sn }) => {
// 	const result = requestStream('start', {
// 		body: {
// 			client_id: clientId,
// 			sn
// 		}
// 	}).then(async (response) => {
// 		const { code, data: { url, stream_id: streamId, resolution } } = await response.json();
// 		if (code === ERROR_OK) {
// 			return {
// 				code: ERROR_OK,
// 				data: {
// 					url,
// 					streamId,
// 					resolution
// 				}
// 			};
// 		}
// 		return {
// 			code
// 		};
// 	});

// 	return result;
// };

// export const stopLive = ({ streamId, sn }) => {
// 	const result = requestStream('stop', {
// 		body: {
// 			stream_id: streamId,
// 			sn
// 		}
// 	}).then(async (response) => {
// 		const { code } = await response.json();
// 		if (code === ERROR_OK) {
// 			return {
// 				code: ERROR_OK,
// 			};
// 		}
// 		return response;
// 	});
// 	return result;
// };


export const getTimeSlots = ({ deviceId, timeStart, timeEnd }) => {
	const result = requestVideo('getTimeSlots', {
		body: {
			device_id: deviceId,
			start_time: timeStart,
			end_time: timeEnd
		}
	}).then(async response => {
		const { code, data } = await response.json();
		if (code === ERROR_OK) {
			return {
				code: ERROR_OK,
				data
			};
		}
		return {
			code
		};
	});
	return result;
};

export const startPublish = ({ clientId, deviceId, timeStart }) => {
	const result = requestVideo('startPublish', {
		body: {
			client_id: clientId,
			device_id: deviceId,
			start_time: timeStart,
			// end_time: timeEnd
		}
	}).then(async response => {
		const { code, data: { url } } = await response.json();
		if (code === ERROR_OK) {
			return {
				code: ERROR_OK,
				data: url
			};
		}
		return {
			code
		};
	});
	return result;
};

export const stopPublish = ({ clientId, deviceId }) => {
	const result = requestVideo('stopPublish', {
		body: {
			client_id: clientId,
			device_id: deviceId
		}
	}).then(async response => {
		const { code } = await response.json();
		return {
			code
		};
	});
	return result;
};
