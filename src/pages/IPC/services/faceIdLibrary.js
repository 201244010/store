import { customizeFetch } from '@/utils/fetch';
import { ERROR_OK } from '@/constants/errorCode';
import CONFIG from '@/config';

const { IPC_SERVER } = CONFIG;

// const fetchApi = customizeFetch('api/face/databaset',IPC_SERVER);
const request = customizeFetch('ipc/api/face/group', IPC_SERVER);

const dataSerializer = (item) => ({
	// id: item.id || undefined,
	group_id: item.id || undefined,
	name: item.name,

	threshold: item.threshold,
	period: item.period*24*60*60,
	mark: item.remarks || '',
	count: item.amount,
	capacity: item.capacity,

	target_id: item.target,
	alarm_notified: item.warning ? 1 : 0
});

const dataFormatter = (item, index) => ({
	id: item.group_id || index + 1,
	name: item.group_name,
	type: item.type,
	threshold: item.threshold,
	period: item.period/24/60/60,
	remarks: item.mark || '',
	amount: item.count || 0,
	capacity: item.capacity,
	target: item.target_group_id || '',
	lastupdate: item.last_modified_time,
	warning: item.alarm_notified === 1
});

export const createLibrary = async (params) => {
	// const { userId, shopId, faceidList } = params;
	// const { companyId, shopId, faceidList } = params;
	const { faceidList } = params;
	const list = faceidList.map((item) => {
		const type = item.isDefault ? item.type : 5;
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

		return {
			code
		};

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
			const result = data.group_list.map(dataFormatter);
			// console.log(result);
			return {
				code: ERROR_OK,
				data: result
			};
		}
		return {
			code
		};

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
		return {
			code
		};

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
			group_id: libraryId
		}
	}).then(async (response) => {
		const { errcode, code } = await response.json();
		if (errcode === 0 || code === ERROR_OK) {
			return {
				code: ERROR_OK
			};
		}
		return {
			code
		};

	});
};