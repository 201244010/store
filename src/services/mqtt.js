// import MQTT from 'mqtt';
import { customizeFetch } from '@/utils/fetch';
// import { MESSAGE_TYPE } from '@/constants';

// TODO 等待 emp api
const fetchApi = customizeFetch('api/emq/token');

// const config = {
//     qos: 0,
// };
//
// const messages = {
//     id: 0,
// };
//
// const client = {
//     connecting: false,
//     connected: false,
// };

export const getServerInfo = (options = {}) => {
    const opts = {
        body: {
            ...options,
        },
    };
    return fetchApi('create', opts);
};

export const connectServer = () => {};
