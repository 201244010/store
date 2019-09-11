import { format } from '@konata9/milk-shake';
import { customizeFetch } from '@/utils/fetch';
import CONFIG from '@/config';

const { IPC_SERVER } = CONFIG;
const request = customizeFetch('ipc/api/face/group', IPC_SERVER);
const request1 = customizeFetch('ipc/api/face', IPC_SERVER);
const range = customizeFetch('ipc/api/face/age', IPC_SERVER);

// 获取照片列表
export const readPhotoList = async (params) => {
	const body = format('toSnake')(params);
	return request('getFaceList',{
		body: {
			...body
		}
	}).then(
		async response => {
			const json = await response.json();
			return format('toCamel')(json);
		});
};

// 获取人脸库
export const getLibrary = async () => (
	request('getList',{
	}).then(async response => {
		const json = await response.json();
		return format('toCamel')(json);
	})
);

// 移库
export const move = async (params) => {
	const body = format('toSnake')(params);
	return request('move',{
		body: {
			...body
		}
	}).then(
		response => response.json()
	);
};

// 删除
export const deletePhoto = async (params) => {
	const body = format('toSnake')(params);
	return request1('delete',{
		body: {
			...body
		}
	}).then(
		response => response.json()
	);
};

// 保存照片
export const saveFile = async (params) => {
	const body = format('toSnake')(params);
	return request('saveFaceList', {
		body: {
			...body
		}
	}).then(
		async response => {
			const json = await response.json();
			return format('toCamel')(json);
		}
	);
};

// 获取年龄列表
export const getRange = async () => (
	range('getRangeList').then(
		async response => {
			const json = await response.json();
			return format('toCamel')(json);

		}
	)
);



// 编辑
export const editInfo = async  (params) => {
	const body = format('toSnake')(params);
	// console.log(body);
	return request1('update', {
		body: {
			...body
		}
	}).then(
		response => response.json()
	);
};

/* upload发请求
	需要判断不同的环境，dev/test来发送不同的请求
 */
// export const handleUpload =  groupId => {
// 	const token = CookieUtil.getCookieByKey(CookieUtil.TOKEN_KEY) || '';
// 	const companyId = CookieUtil.getCookieByKey(CookieUtil.COMPANY_ID_KEY) || '';
// 	const shopId = CookieUtil.getCookieByKey(CookieUtil.SHOP_ID_KEY) || '';
// 	// let IP = '47.96.240.44:35150';
// 	// switch (env) {
// 	// 	case 'dev': IP = '47.96.240.44:35150';break;
// 	// 	case 'test': IP = '47.99.16.199:30401';break;
// 	// 	default: break;
// 	// }


// 	return {
// 		action: `http://${IPC_SERVER}/ipc/api/face/group/uploadFace`,
// 		data: file => (format('toSnake')({
// 			name: file.name,
// 			companyId,
// 			shopId,
// 			groupId
// 		})),
// 		headers: { authorization: `Bearer ${token}` }
// 	};
// };

export const handleUpload = async (params) => {
	const body = format('toSnake')(params);
	return request('uploadFace', {
		body: {
			...body
		}
	}).then(
		async response => {
			const json = await response.json();
			return format('toCamel')(json);
		}
	);
};

export const handleResponse =  fileList => {
	let answer;
	if(Array.isArray(fileList)) {
		answer = fileList.map(item => format('toCamel')(item));
	} else {
		answer = format('toCamel')(fileList);
	}
	return answer;
};