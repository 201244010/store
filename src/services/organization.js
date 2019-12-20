import { format } from '@konata9/milk-shake';
import { customizeFetch } from '@/utils/fetch';
import CONFIG from '@/config';

const { API_ADDRESS } = CONFIG;

const request = customizeFetch('api/organization', API_ADDRESS);
// const request = customizeFetch('api/organization', 'http://localhost:8000');


export const createOrganization = (params) =>
	request('create', {
		body: format('toSnake')(params)
	}).then(
		async response => {
			const result = await response.json();
			return format('toCamel')(result);
		}
	);


export const getOrgList = (params) =>
	request('getOrgList', {
		body: format('toSnake')(params)
	}).then(
		async response => {
			const result = await response.json();
			return format('toCamel')(result);
		}
	);

export const getLayerByUser = (params) =>
	request('getLayerByUser', {
		body: format('toSnake')(params)
	}).then(
		async response => {
			const result = await response.json();
			return format('toCamel')(result);
		}
	);

export const isDeprecatable = (params) =>
	request('isDeprecatable', {
		body: format('toSnake')(params)
	}).then(
		async response => {
			const result = await response.json();
			return format('toCamel')(result);
		}
	);

export const deprecate = (params) =>
	request('deprecate', {
		body: format('toSnake')(params)
	}).then(
		async response => {
			const result = await response.json();
			return format('toCamel')(result);
		}
	);

export const move = (params) =>
	request('move', {
		body: format('toSnake')(params)
	}).then(
		async response => {
			const result = await response.json();
			return format('toCamel')(result);
		}
	);

export const enable = () =>
	request('enable', {
		body: format('toSnake')(params)
	}).then(
		async response => {
			const result = await response.json();
			return format('toCamel')(result);
		}
	);
// export const getOrganizationTree = () =>
// 	request('getTree').then(
// 		async response => {
// 			const result = {
// 				pOrgId: 0,
// 				orgTag: 1,
// 				level: 0,
// 				path_link: 1,
// 				orgId: 1,
// 				orgName: '第一爷爷',
// 				businessStatus: 1,
// 				children: [
// 					{
// 						pOrgId: 1,
// 						orgTag: 1,
// 						level: 1,
// 						pathLink: '1.2',
// 						orgId: 2,
// 						orgName: '第一爸爸',
// 						businessStatus:1,
// 						children: [],
// 					},
// 					{
// 						pOrgId: 1,
// 						orgTag: 1,
// 						level: 1,
// 						pathLink: '1.3',
// 						orgId: 3,
// 						orgName: '第二爸爸',
// 						businessStatus:1,
// 						children: [{
// 							pOrgId: 1,
// 							orgTag: 1,
// 							level: 2,
// 							pathLink: '1.3.4',
// 							orgId: 4,
// 							orgName: '第一儿子',
// 							businessStatus:1,
// 							children: [],
// 						}],
// 					},
// 				]
// 			};
// 			return {
// 				code: 1,
// 				data: result,
// 			};
// 		}
// 	);