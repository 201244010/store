import { customizeFetch } from '@/utils/fetch';
import { ERROR_OK } from '@/constants/errorCode';
// import { IPC_SERVER } from '@/config';
import CONFIG from '@/config';

const { IPC_SERVER } = CONFIG;

// console.log(IPC_SERVER);
// console.log(CONFIG);
const request = customizeFetch('ipc/api/device',IPC_SERVER);
// const request = customizeFetch('api/device/ipc');
// const fetchApi = customizeFetch('ipc/api/device',IPC_SERVER);

const dataFormatter = (item) => ({
		deviceId: item.id,
		name: item.device_name,
		isOnline: item.active_status !== 0,
		type: item.model,
		img:item.cdn_address,
		sn:item.sn
	});
// return fetchApi('getList', opts).then(response => response.json());
export const getDeviceList = async () =>  
	// const { shopId } = params;
	 request('getDetailList',{
		// body:{
		// 	company_id: companyId,
		// 	shop_id: shopId
		// }
	
	}).then(async (response) => {

		const { data, code } = await response.json();
		if (code === ERROR_OK){
			// 获取到的list处理成统一格式输出。
			let ipcList = [];

			// console.log(data);
			const lists = Object.keys(data);
			
			lists.forEach(prop => {
				ipcList = ipcList.concat(data[prop]);
			});

			const result = ipcList.map(dataFormatter);

			return {
				code: ERROR_OK,
				data: result
			};
		}
			return response;
		
	})
;

