import { customizeFetch } from '@/utils/fetch';

// TODO 等待后端接口

const fetchApi = customizeFetch('api/device/ap', '47.96.240.44:30301');

export const fetchBaseStations = options => {
    const opts = {
        method: 'POST',
        body: {
            keyword: options.keyword,
            status: options.status || -1,
            page_num: options.current,
            page_size: options.pageSize,
        },
    };

    return fetchApi('getList', opts).then(response => response.json());
};

export const getBaseStationDetail = options => {
    const opts = {
        method: 'POST',
        body: {
            ...options,
        },
    };

    return fetchApi('getInfo', opts).then(response => response.json());
};

export const deleteBaseStation = options => {
    const opts = {
        method: 'POST',
        body: {
            ...options,
        },
    };

    return fetchApi('delete', opts).then(response => response.json());
};
