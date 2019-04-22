import { customizeFetch } from '@/utils/fetch';
import { env, GROCERY_ADDRESS } from '@/config';

const fetchApi = customizeFetch('esl/api/device/esl', GROCERY_ADDRESS[env]);

export const fetchElectricLabels = options => {
    const opts = {
        method: 'POST',
        body: {
            page_num: options.current,
            page_size: options.pageSize,
            keyword: options.keyword,
            status: options.status || -1,
        },
    };

    return fetchApi('getList', opts).then(response => response.json());
};

export const fetchESLDetails = options => {
    const opts = {
        method: 'POST',
        body: options,
    };

    return fetchApi('getInfo', opts).then(response => response.json());
};

export const changeTemplate = options => {
    const opts = {
        method: 'POST',
        body: options,
    };

    return fetchApi('changeTemplate', opts).then(response => response.json());
};

export const deleteESL = options => {
    const opts = {
        method: 'POST',
        body: options,
    };

    return fetchApi('delete', opts).then(response => response.json());
};

export const flashLed = options => {
    const opts = {
        method: 'POST',
        body: options,
    };

    return fetchApi('flashLed', opts).then(response => response.json());
};

export const getBindInfo = options => {
    const opts = {
        method: 'POST',
        body: options,
    };
    return fetchApi('getBindInfo', opts).then(response => response.json());
};
