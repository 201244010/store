import { customizeFetch } from '@/utils/fetch';

const fetchApi = customizeFetch('api/notification');

export const handleNotifiCation = (api, options = {}) => {
    const opts = {
        body: {
            ...options,
        },
    };

    return fetchApi(api, opts).then(response => response.json());
};
