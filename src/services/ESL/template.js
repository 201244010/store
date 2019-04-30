import { customizeFetch } from '@/utils/fetch';

const fetchApi = customizeFetch('esl/api/template');

export const fetchTemplatesByESLCode = options => {
    const opts = {
        method: 'POST',
        body: options,
    };

    return fetchApi('getNameList', opts).then(response => response.json());
};

export const fetchTemplates = options => {
    const opts = {
        method: 'POST',
        body: options,
    };

    return fetchApi('getList', opts).then(response => response.json());
};

export const saveAsDraft = (options) => {
    const opts = {
        method: 'POST',
        body: options
    };

    return fetchApi('saveAsDraft', opts).then(response => response.json());
};

export const fetchTemplateDetail = (options) => {
    const opts = {
        method: 'POST',
        body: options
    };

    return fetchApi('getInfo', opts).then(response => response.json());
};

export const uploadImage = (options) => {
    const opts = {
        method: 'POST',
        body: options
    };

    return fetchApi('uploadImage', opts).then(response => response.json());
};
