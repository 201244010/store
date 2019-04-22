import { customizeFetch } from '@/utils/fetch';

const fetchApi = customizeFetch('esl/api/template');

export const fetchTemplatesByESLCode = options => {
    const opts = {
        method: 'POST',
        body: options,
    };

    return fetchApi('getNameList', opts).then(response => response.json());
};
