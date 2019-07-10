import { customizeFetch } from '@/utils/fetch';

const fetchApi = customizeFetch('esl/api/template');

export const fetchScreenTypes = options => {
	const opts = {
		method: 'POST',
		body: options,
	};

	return fetchApi('getScreenTypeList', opts).then(response => response.json());
};

export const fetchColors = options => {
	const opts = {
		method: 'POST',
		body: options,
	};

	return fetchApi('getColourList', opts).then(response => response.json());
};

export const fetchBindFields = options => {
	const opts = {
		method: 'POST',
		body: options,
	};

	return fetchApi('getBindableProductFieldList', opts).then(response => response.json());
};

export const fetchTemplatesByESLCode = options => {
	const opts = {
		method: 'POST',
		body: options,
	};

	return fetchApi('getNameList', opts).then(response => response.json());
};

export const createTemplate = options => {
	const opts = {
		method: 'POST',
		body: options,
	};

	return fetchApi('create', opts).then(response => response.json());
};

export const fetchTemplates = options => {
	const opts = {
		method: 'POST',
		body: options,
	};

	return fetchApi('getList', opts).then(response => response.json());
};

export const saveAsDraft = options => {
	const opts = {
		method: 'POST',
		body: options,
	};

	return fetchApi('saveAsDraft', opts).then(response => response.json());
};

export const fetchTemplateDetail = options => {
	const opts = {
		method: 'POST',
		body: options,
	};

	return fetchApi('getInfo', opts).then(response => response.json());
};

export const uploadImage = options => {
	const opts = {
		method: 'POST',
		body: options,
	};

	return fetchApi('uploadImage', opts).then(response => response.json());
};

export const deleteTemplate = options => {
	const opts = {
		method: 'POST',
		body: options,
	};

	return fetchApi('delete', opts).then(response => response.json());
};

export const renameTemplate = options => {
	const opts = {
		method: 'POST',
		body: options,
	};

	return fetchApi('rename', opts).then(response => response.json());
};

export const applyTemplate = options => {
	const opts = {
		method: 'POST',
		body: options,
	};

	return fetchApi('apply', opts).then(response => response.json());
};

export const cloneTemplate = options => {
	const opts = {
		method: 'POST',
		body: options,
	};

	return fetchApi('clone', opts).then(response => response.json());
};
