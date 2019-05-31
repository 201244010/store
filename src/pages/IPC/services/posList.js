import CONFIG from '@/config';
import { customizeFetch } from '@/utils/fetch';
import { ERROR_OK } from '@/constants/errorCode';

const { IPC_SERVER } = CONFIG;
// const IPC_SERVER = 'localhost:8000';

const request = customizeFetch('ipc/api/audit/device', IPC_SERVER);

const dataFormater = (data) => {
	const { ipc_device_list: list } = data;
	return list.map((item) => {
		const { name, id, sn, payment_device_list: pos } =  item;

		let posList = [];
		if (pos) {
			posList = pos.map((posItem) => {
				const { sn: posSn, name: posName, status, img_path: src } = posItem;
				return {
					sn: posSn,
					name: posName,
					status,
					src
				};
			});
		};

		return {
			name,
			id,
			sn,
			posList
		};
	});
};

export const getPOSList = async () => {
	const list = request('getIpcList').then(async (response) => {
		const { data, code } = await response.json();

		if(code === ERROR_OK){
			const result = dataFormater(data);
			return {
				code: ERROR_OK,
				data: result
			};
		}
		return response;
	});

	return list;
};

export const checkSN = async ({ ipcId, posSN }) => {
	const result = request('checkSn', {
		body: {
			ipc_device_id: ipcId,
			payment_sn: posSN
		}
	}).then(async (response) => {
		const { code, msg } = await response.json();
		if(code === ERROR_OK){
			return {
				code: ERROR_OK,
			};
		}
		return {
			code,
			msg
		};
	});

	return result;
};



// const posFormatter = (data) => {
// 	const { device_list } = data;
// 	return device_list.map((device) => {
// 		const { name, id, sn, status, device_img } = device;
// 		return {
// 			name,
// 			id,
// 			sn,
// 			status,
// 			src: device_img
// 		};
// 	});
// };

export const addPos = async ({ ipcId, snList }) => {
	const result = request('add', {
		body: {
			ipc_device_id: ipcId,
			payment_sn_list: snList
		}
	}).then(async (response) => {
		const { msg, code } = await response.json();
		// console.log('data',data);
		// if(code === ERROR_OK){
		// 	return {
		// 		code: ERROR_OK,
		// 		data: posFormatter(data)
		// 	};
		// }
		return {
			code,
			msg
		};
	});
	return result;
};

const serializePosInfo = (posList) => {
	const result = posList.map((pos) => ({
		sn: pos.sn,
		height: pos.height,
		width: pos.width,
		x_coor: pos.left,
		y_coor: pos.top
	}));
	// console.log('serializePosInfo', result);
	return result;
};

export const bindPos = async ({ ipcId, posList }) => {
	// console.log('bindPos: ', ipcId, posList);
	const result = request('bind', {
		body: {
			ipc_device_id: ipcId,
			bind_info_list: serializePosInfo(posList)
		}
	}).then(async (response) => {
		const { code } = await response.json();
		// console.log(code);
		return {
			code
		};
	});
	return result;
};

export const adjustPos = async ({ ipcId, posList }) => {
	// console.log('bindPos: ', ipcId, posList);
	const result = request('adjustScreen', {
		body: {
			ipc_device_id: ipcId,
			bind_info_list: serializePosInfo(posList)
		}
	}).then(async (response) => {
		const { code } = await response.json();
		// console.log(code);
		return {
			code
		};
	});
	return result;
};

export const unbindPos = async ({ ipcId, posSN }) => {
	const result = request('unbind', {
		body: {
			ipc_device_id: ipcId,
			payment_sn: posSN
		}
	}).then(async (response) => {
		const { code } = await response.json();
		if(code === ERROR_OK){
			return {
				code: ERROR_OK,
			};
		}
		return response;
	});
	return result;
};

export const updatePos = async ({ ipcId, posInfo }) => {
	const result = request('update', {
		body: {
			ipc_device_id: ipcId,
			...serializePosInfo([posInfo])[0]
		}
	}).then(async (response) => {
		const { code } = await response.json();
		if(code === ERROR_OK){
			return {
				code: ERROR_OK,
			};
		}
		return response;
	});
	return result;
};

export const deletePos = async ({ ipcId, posSN }) => {
	const result = request('delete', {
		body: {
			ipc_device_id: ipcId,
			payment_sn: posSN
		}
	}).then(async (response) => {
		const { code } = await response.json();
		if(code === ERROR_OK){
			return {
				code: ERROR_OK,
			};
		}
		return response;
	});
	return result;
};

export const sendCode = ({posSN}) => {
	const result = request('sendVerificationCode', {
		body: {
			// verification_code: '',
			payment_sn: posSN
		}
	}).then(async (response) => {
		const { code } = await response.json();
		if(code === ERROR_OK){
			return {
				code: ERROR_OK,
			};
		}
		return response;
	});
	return result;
};

export const verifyCode = ({ code: msgCode, posSN }) => {
	const result = request('verifyVerificationCode', {
		body: {
			verification_code: msgCode,
			payment_sn: posSN
		}
	}).then(async (response) => {
		const { code, msg } = await response.json();
		return {
			code,
			msg
		};
	});
	return result;
};


const posFormater = (list) => {
	const d = list.map((item) => {
		const { id, sn, name, status: verified, img_path: src } = item;
		return {
			id, sn, name, verified, src
		};
	});
	return d;
};
export const getPaymentDeviceList = ({ ipcId }) => {
	const list = request('getPaymentDeviceList', {
		body: {
			ipc_device_id: ipcId
		}
	}).then(async (response) =>{
		const { data, code } = await response.json();

		if(code === ERROR_OK) {
			const result = data.payment_device_list;
			return {
				code: ERROR_OK,
				data: posFormater(result)
			};
		}

		return response;
	});
	return list;
};


export const getVerifyStatusList = async ({ipcId}) => {
	const list = request('getVerifyStatusList', {
		body: {
			ipc_device_id: ipcId
		}
	}).then(async (response) =>{
		const { data, code } = await response.json();

		if(code === ERROR_OK) {
			const result = data.payment_device_list;
			return {
				code: ERROR_OK,
				data: posFormater(result)
			};
		}
		return response;
	});
	return list;
};

const bindedFormater = (list) => {
	const d = list.map((item) => {
		const { sn, width, height, x_coor: left , y_coor: top } = item;
		return {
			sn, width, height, left, top
		};
	});
	return d;
};

export const getBoundList = async ({ipcId}) => {
	const list = request('getBoundList', {
		body: {
			ipc_device_id: ipcId
		}
	}).then(async (response) =>{
		const { data, code } = await response.json();

		if(code === ERROR_OK) {
			const result = data.payment_device_list;
			return {
				code: ERROR_OK,
				data: bindedFormater(result)
			};
		}
		return {
			code
		};
	});
	return list;
};