import { customizeFetch } from '@/utils/fetch';
import { ERROR_OK } from '@/constants/errorCode';
import moment from 'moment';

import CONFIG from '@/config';

// const IPC_SERVER = 'localhost:8000';
const { IPC_SERVER } = CONFIG;

const request = customizeFetch('ipc/api/payment', IPC_SERVER);
const requestVideo = customizeFetch('ipc/api/audit', IPC_SERVER);



const dataFormatter = (item) => {

	const purchaseTime = moment.unix(item.purchase_time).format('YYYY-MM-DD HH:mm');
	// const purchaseTime = moment.unix(item.start_time).format('YYYY-MM-DD HH:mm');
	const totalPrice = (Math.floor(item.amount*100)/100).toFixed(2);
	// 后面取或的都是现在接口还没有的，但是页面已经使用上了。
	return {
		key: item.id,
		ipcName: item.ipc_device_name,
		paymentDeviceName: item.payment_device_name,
		purchaseTime,
		totalPrice,
		paymentMethod: item.purchase_type || '',
		orderId: item.id,
		orderNo: item.order_no,
		paymentDeviceSn: item.payment_device_sn,
		// ipcDeviceType: item.ipc_device_type || 'FS1',

		// ipcId: item.ipc_device_Id,
		// paymentDeviceId: item.payment_device_Id,
		details: item.details
	};
};
// const deviceDataFormatter = (item) => ({
// 	deviceId:item.id,
// 	deviceName:item.device_name
// });

const paymentDeviceDataFormatter = (item) => ({
	deviceId:item.id,
	deviceName:item.device_name
});

const paymemtDetailFormatter = (item) => ({
	name: item.name,
	// perPrice: item.original_price,
	quantity: item.quantity,
	// promotePrice: item.promote_price
});

export const getTradeVideos = async (params) => {
	const { keyword, ipcId, startTime, endTime, posSN, currentPage, pageSize } = params;

	return request('getList',{
		body:{
			time_range_start: startTime,
			time_range_end: endTime,
			ipc_device_id: ipcId,
			// payment_device_id: paymentDeviceId,
			payment_device_sn: posSN,
			keyword,
			page_num: currentPage,
			page_size: pageSize
		}
	}).then(async(response) => {
		const { data, code } = await response.json();
		if (code === ERROR_OK){
			const list = data.order_list.map(dataFormatter);
			const total = data.total_count;
			return {
				code: ERROR_OK,
				data: {
					list,
					total
				}
			};
		}
		return response;
	});
};

export const getPaymentDetailList = async (params) => {
	const { orderId } = params;
	return request('getDetailList',{
		body:{
			order_id:orderId
		}
	}).then(async(response) => {
		const { data, code } = await response.json();
		if (code === ERROR_OK){
			const result = data.detail_list.map(paymemtDetailFormatter);
			// console.log(result);
			return {
				code: ERROR_OK,
				data: result
			};
		}
		return response;
	});
};


// export const getVideo = async ({ orderNo }) => {
// 	const info = requestVideo('getVideo',{
// 		body:{
// 			order_no: orderNo
// 		}
// 	}).then(async(response) => {
// 		const { data, code } = await response.json();
// 		if (code === ERROR_OK){
// 			// console.log(data);
// 			return {
// 				code: ERROR_OK,
// 				data: {
// 					address: data.address,
// 					id: data.video_id
// 				}
// 			};
// 		}
// 		return {
// 			code
// 		};
// 	});

// 	return info;
// };
const videoInfoFormatter = (list) => {
	const data = list.map(item => ({
		orderNo: item.order_no,
		url: item.address
	}));
	return data;
};

export const getVideo = async ({ orderNoList }) => {
	const info = requestVideo('getVideo',{
		body:{
			order_no_list: orderNoList
		}
	}).then(async(response) => {
		const { data, code } = await response.json();
		if (code === ERROR_OK){
			// console.log(data);
			return {
				code: ERROR_OK,
				data: {
					list: videoInfoFormatter(data)
				}
			};
		}
		return {
			code
		};
	});

	return info;
};

export const getPaymentDeviceList = async (params) =>{
	const { ipcDeviceId } = params;
	return request('payment/getList',{
		body:{
			ipc_device_id : ipcDeviceId
		}
	}).then(async(response) => {
		const { data, code } = await response.json();;
		if (code === ERROR_OK){
			const result = data.device_list.map(paymentDeviceDataFormatter);
			return {
				code: ERROR_OK,
				data: result
			};
		}
		return response;
	});
};

// export const getIpcList = async () => {
// 	const list = request('getList').then(async (response) =>{
// 		const { code, data } = await response.json();
// 		if(code === ERROR_OK){
// 			const result = data.device_list.map(deviceDataFormatter);
// 			return {
// 				code: ERROR_OK,
// 				data:result
// 			};
// 		}
// 		return response;
// 	});
// 	return list;
// };
