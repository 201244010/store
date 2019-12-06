import { customizeFetch } from '@/utils/fetch';
import {genService} from '@/services/index';

const fetchApi = customizeFetch('esl/api/device/ap');
const genBaseStationService = genService(fetchApi);

export default {
	fetchBaseStations: genBaseStationService('getList', options => ({
		keyword: options.keyword,
		status: options.status,
		page_num: options.current || 1,
		page_size: options.pageSize,
	})),
	getBaseStationDetail: genBaseStationService('getInfo'),
	deleteBaseStation: genBaseStationService('delete'),
	restartBaseStation: genBaseStationService('reboot'),
	changeBaseStationName: genBaseStationService('updateName'),
	deviceApHandler: genBaseStationService('getNetworkList')
};
