import { customizeFetch } from '@/utils/fetch';
import { getLocationParam } from '@/utils/utils';
import { ERROR_OK } from '@/constants/errorCode';

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
	const studioType = getLocationParam('type');
	if (studioType === 'alone') {
		const templateInfo = localStorage.getItem(getLocationParam('id'));
		return Promise.resolve({
			code: ERROR_OK,
			data: {
				template_info: JSON.parse(templateInfo)
			}
		});
	}
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

export const fetchScreenNameList = options => {
	const opts = {
		method: 'POST',
		body: options,
	};

	return fetchApi('getScreenNameList', opts).then(response => response.json());
};

export const uploadTemplate = options => {
	const studioType = getLocationParam('type');
	if (studioType === 'alone') {
		const templateInfo = localStorage.getItem(getLocationParam('id'));
		return Promise.resolve({
			code: ERROR_OK,
			data: {
				template_info: JSON.parse(templateInfo)
			}
		});
	}

	const opts = {
		method: 'POST',
		body: options,
	};

	return fetchApi('upload', opts).then(response => response.json());
};
