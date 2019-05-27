import router from 'umi/router';
import { MENU_PREFIX } from '@/constants/index';

export const ACTION_MAP = {
	'GET-AP-LIST': () => router.push(MENU_PREFIX.ESL_BASE_STATION),
};
