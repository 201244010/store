import { customizeFetch } from '@/utils/fetch';
import { ERROR_OK } from '@/constants/errorCode';
import CONFIG from '@/config';

const { IPC_SERVER } = CONFIG;

const request = customizeFetch('ipc/api/device', IPC_SERVER);

export const getSdStatus = async params => {
    // console.log('come in get status');
    const { userId, deviceId } = params;
    return request('getSdStatus', {
        body: {
            device_id: deviceId,
            user_id: userId,
            // shop_id: shopId
        },
    }).then(async response => {
        const { code, data } = await response.json();

        if (code === ERROR_OK) {
            const status = data.sd_status_code;
            return {
                code: ERROR_OK,
                status,
            };
        }
        return response;
    });
};
