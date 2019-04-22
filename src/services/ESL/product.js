import { customizeFetch } from '@/utils/fetch';
import { env, GROCERY_ADDRESS } from '@/config';

const fetchApi = customizeFetch('esl/api/product', GROCERY_ADDRESS[env]);

export const bindESL = options => {
    const opts = {
        method: 'POST',
        body: options,
    };

    return fetchApi('bindESL', opts).then(response => response.json());
};

export const unbindESL = options => {
    const opts = {
        method: 'POST',
        body: options,
    };

    return fetchApi('unbindEsl', opts).then(response => response.json());
};

export const flushESL = options => {
    const opts = {
        method: 'POST',
        body: options,
    };

    return fetchApi('flushEsl', opts).then(response => response.json());
};
