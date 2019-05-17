import { customizeFetch } from '@/utils/fetch';

const fetchAP_API = customizeFetch('esl/api/device/ap/firmware');
const fetchESL_API = customizeFetch('esl/api/device/esl/firmware');

export const handleAPAction = (api, options = {}) => {
    const opts = {
        body: {
            ...options,
        },
    };

    return fetchAP_API(api, opts).then(response => response.json());
};

export const handleESLAction = (api, options = {}) => {
    const opts = {
        body: { ...options },
    };
    return fetchESL_API(api, opts).then(response => response.json());
};
