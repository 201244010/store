import { customizeFetch } from '@/utils/fetch';
import {genService} from '@/services/index';

const fetchApi = customizeFetch('api/pos/device');
const genPosService = genService(fetchApi);

export default {
	getPosList: genPosService('getList'),
	getBaseInfo: genPosService('getBaseInfo'),
	getWarrantyInfo: genPosService('getWarrantyInfo'),
};
