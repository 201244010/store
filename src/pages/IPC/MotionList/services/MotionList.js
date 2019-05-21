import { customizeFetch } from '@/utils/fetch';
import { ERROR_OK } from '@/constants/errorCode';
import moment from 'moment';
import CONFIG from '@/config';

const { IPC_SERVER } = CONFIG;

const request = customizeFetch('ipc/api/device/motion', IPC_SERVER);
const fetch = customizeFetch('ipc/api/device', IPC_SERVER);

const dataFormatter = item => {
    const detectedTime = moment.unix(item.detect_time).format('YYYY-MM-DD HH:mm:ss');
    return {
        key: item.id,
        name: item.device_name,
        detectedTime,
        detectedSource: item.source,
        video: {
            video: item.cdn_address,
            sn: item.sn,
        },
    };
};

const deviceDataFormatter = item => ({
    deviceId: item.id,
    deviceName: item.device_name,
});

export const getMotionList = async params => {
    const { startTime, endTime, deviceId, source } = params;
    return request('getList', {
        body: {
            // company_id:companyId,
            // shop_id:shopId,
            time_range_start: startTime,
            time_range_end: endTime,
            id: deviceId,
            source,
        },
    }).then(async response => {
        const { data, code } = await response.json();
        if (code === ERROR_OK) {
            const result = data.motion_list.map(dataFormatter);
            return {
                code: ERROR_OK,
                data: result,
            };
        }
        return response;
    });
};

export const getIpcList = async () => {
    const list = fetch('getList').then(async response => {
        const { code, data } = await response.json();
        console.log(data);
        if (code === ERROR_OK) {
            const result = data.device_list.map(deviceDataFormatter);
            console.log(result);
            return {
                code: ERROR_OK,
                data: result,
            };
        }
        return response;
    });

    return list;
};
