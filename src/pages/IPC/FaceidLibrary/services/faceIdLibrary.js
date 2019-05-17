import { customizeFetch } from '@/utils/fetch';
import { ERROR_OK } from '@/constants/errorCode';
import CONFIG from '@/config';

const { IPC_SERVER } = CONFIG;

// const fetchApi = customizeFetch('api/face/databaset',IPC_SERVER);
const request = customizeFetch('api/face/database', IPC_SERVER);

const dataSerializer = (item) => ({
	id: item.id,
	name: item.name,

	threshold: item.threshold,
	period: item.period,

	mark: item.remarks || '',
	count: item.amount,
	capacity: item.capacity,

	target_name: item.target
});

const dataFormatter = (item, index) => ({
	id: item.id || index + 1,
	name: item.name,
	isDefault: !!((item.type === 0 || item.type === 1)),
	threshold: item.threshold,
	period: item.period,
	remarks: item.mark || '',
	amount: item.count || 0,
	capacity: item.capacity,
	target: item.target_name || '',
	lastupdate: item.last_modified_time
});

export const createLibrary = async (params) => {
	// const { userId, shopId, faceidList } = params;
	// const { companyId, shopId, faceidList } = params;
	const { faceidList } = params;
	const list = faceidList.map((item) => {
		const type = item.isDefault ? item.type : 3;
		const target = dataSerializer(item);
		return {
			...target,
			type
		};
	});

	return request('create', {
		body: {
			// user_id: userId,
			// company_id: companyId,
			// shop_id: shopId,
			facedb_list: [...list]
		}
	}).then(async (response) => {
		const { code } = await response.json();
		if (code === ERROR_OK) {
			// const result = data.facedb_list.map(dataFormatter);
			return {
				code: ERROR_OK
			};
		}
		return response;

	});
};

export const readLibrary = async () =>
	// const { userId, shopId } = params;
	// const { shopId, companyId } = params;
	request('getList', {
		// method: 'post',
		// requestType: 'form',
		body: {
			// user_id: userId,
			// company_id: companyId,
			// shop_id: shopId
		}
	}).then(async (response) => {
		// console.log(await response.json());
		const { errcode, code, data } = await response.json();
		if (errcode === 0 || code === ERROR_OK) {
			// const { data } = response;
			const result = data.facedb_list.map(dataFormatter);
			// console.log(result);
			return {
				code: ERROR_OK,
				data: result
			};
		}
		return response;

	})
	;

export const updateLibrary = async (params) => {
	// const { userId, shopId, library } = params;
	// const { shopId, library, companyId } = params;
	const { library } = params;
	const target = dataSerializer(library);
	return request('update', {
		// method: 'post',
		// requestType: 'form',
		body: {
			// user_id: userId,
			// company_id: companyId,
			// shop_id: shopId,
			...target
		}
	}).then(async (response) => {
		const { errcode, code } = await response.json();
		// console.log(errcode);
		if (errcode === 0 || code === ERROR_OK) {
			return {
				code: ERROR_OK
			};
		}
		return response;

	});
};

export const deleteLibrary = async (params) => {

	// const { userId, shopId, libraryId } = params;
	// const { shopId, libraryId, companyId } = params;
	const { libraryId } = params;
	return request('delete', {
		// method: 'post',
		// requestType: 'form',
		body: {
			// user_id: userId,
			// company_id: companyId,
			// shop_id: shopId,
			id: libraryId
		}
	}).then(async (response) => {
		const { errcode, code } = await response.json();
		if (errcode === 0 || code === ERROR_OK) {
			return {
				code: ERROR_OK
			};
		}
		return response;

	});
};