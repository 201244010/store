import { customizeFetch } from '@/utils/fetch';

// TODO 等待消息中心 URL
const fetchApi = customizeFetch('api/notification');

export const handleNotifiCation = (api, options = {}) => {
    const opts = {
        body: {
            ...options,
        },
    };

    return fetchApi(api, opts).then(response => response.json());
};
