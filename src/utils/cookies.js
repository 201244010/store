import Cookies from 'js-cookie';
import TypeCheck from '@konata9/typecheck.js';

const COOKIE_EXPIRE_DAY = 1;
export const SHOP_ID_KEY = '__shop_id__';
export const COMPANY_ID_KEY = '__company_id__';
export const USER_INFO_KEY = '__userInfo__';
export const TOKEN_KEY = '__token__';
export const GOODS_PAGE_SIZE_KEY = '__goods_page_size__';
export const COMPANY_LIST_KEY = '__company_list__';
export const SHOP_LIST_KEY = '__shop_list__';
export const USER_PERMISSION = '__user_permission__';

const keyMap = {
	[SHOP_ID_KEY]: SHOP_ID_KEY,
	[COMPANY_ID_KEY]: COMPANY_ID_KEY,
	[USER_INFO_KEY]: USER_INFO_KEY,
	[TOKEN_KEY]: TOKEN_KEY,
	[GOODS_PAGE_SIZE_KEY]: GOODS_PAGE_SIZE_KEY,
	[COMPANY_LIST_KEY]: COMPANY_LIST_KEY,
	[SHOP_LIST_KEY]: SHOP_LIST_KEY,
	[USER_PERMISSION]: USER_PERMISSION,
};

export const setCookieByKey = (key, value) => {
	if (['object', 'array'].includes(TypeCheck(value))) {
		Cookies.set(keyMap[key], JSON.stringify(value), { expires: COOKIE_EXPIRE_DAY });
	} else {
		Cookies.set(keyMap[key], value, { expires: COOKIE_EXPIRE_DAY });
	}
};

export const getCookieByKey = key => {
	const value = Cookies.get(keyMap[key]);
	let ret;
	try {
		ret = JSON.parse(value);
	} catch (e) {
		ret = value;
	}

	return ret;
};

export const removeCookieByKey = key => {
	Cookies.remove(key);
};

export const clearCookies = () => {
	Object.keys(keyMap).forEach(key => {
		removeCookieByKey(key);
	});
};
