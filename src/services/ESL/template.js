import { customizeFetch } from '@/utils/fetch';
import { env, GROCERY_ADDRESS } from '@/config';

const fetchApi = customizeFetch('esl/api/template', GROCERY_ADDRESS[env]);

export const fetchTemplatesByESLCode = options => {
    const opts = {
        method: 'POST',
        body: options,
    };

    return fetchApi('getNameList', opts).then(response => response.json());
};
