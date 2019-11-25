import { customizeFetch } from '@/utils/fetch';
import { genService } from '@/services/index';

const fetchApi = customizeFetch('esl/api/device/esl');
const fetchDeviceApi = customizeFetch('esl/api/device');
const genEslService = genService(fetchApi);
const genDeviceService = genService(fetchDeviceApi);

export default {
	fetchElectricLabels: genEslService('getList', options => ({
		page_num: options.current,
		page_size: options.pageSize,
		keyword: options.keyword,
		status: options.status,
		sort_key: options.sort_key,
		desc: options.desc
	})),
	fetchESLDetails: genEslService('getInfo'),
	changeTemplate: genEslService('changeTemplate'),
	deleteESL: genEslService('delete'),
	fetchFlashModes: genEslService('getFlashModeList'),
	flashLed: genEslService('flashLed'),
	getBindInfo: genEslService('getBindInfo'),
	fetchDeviceOverview: genDeviceService('getOverview'),
	refreshFailedImage: genEslService('repushFailedImage'),
	setScanTime: genEslService('setScanTime'),
	getSwitchScreenInfo: genEslService('getSwitchScreenInfo'),
	switchScreen: genEslService('switchScreen'),
	getScreenPushInfo: genEslService('getScreenPushInfo'),
};
