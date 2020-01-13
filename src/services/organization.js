import { format } from '@konata9/milk-shake';
import { customizeFetch } from '@/utils/fetch';
import CONFIG from '@/config';

const { API_ADDRESS } = CONFIG;

const request = customizeFetch('api/organization', API_ADDRESS);
// const request = customizeFetch('api/organization', 'http://localhost:8000');

export const getOrgList = (params) =>
	request('getList', {
		body: format('toSnake')(params)
	}).then(
		async response => {
			const result = await response.json();
			return format('toCamel')(result);
		}
	);

export const getOrganizationInfo = (params) =>
	request('getInfo', {
		body: format('toSnake')(params)
	}).then(
		async response => {
			const result = await response.json();
			return format('toCamel')(result);
		}
	);

export const createOrganization = (params) =>
	request('create', {
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

export const getLayer = () =>
	request('getLayer', {
	}).then(
		async response => {
			const result = await response.json();
			return format('toCamel')(result);
		}
	);

export const isDeprecatable = (params) =>
	request('checkDisabled', {
		body: format('toSnake')(params)
	}).then(
		async response => {
			const result = await response.json();
			return format('toCamel')(result);
		}
	);

export const deprecate = (params) =>
	request('disable', {
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

export const enable = (params) =>
	request('enable', {
		body: format('toSnake')(params)
	}).then(
		async response => {
			const result = await response.json();
			return format('toCamel')(result);
		}
	);

export const updateOrganization = (params) =>
	request('update', {
		body: format('toSnake')(params)
	}).then(
		async response => {
			const result = await response.json();
			return format('toCamel')(result);
		}
	);

export const getOrganizationTree = (params) =>
	request('getLayerByUser', {
		body: format('toSnake')(params)
	}).then(
		async response => {
			const result = await response.json();
			return format('toCamel')(result);
		}
	);
