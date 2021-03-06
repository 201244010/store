export const DEFAULT_PAGE_SIZE = 10;
export const DEFAULT_PAGE_LIST_SIZE = ['10', '20', '50', '100'];

export const TABLE_SCROLL_X = 1080;
export const QUERY_INTERVAL = 1000;
export const DURATION_TIME = 1;

export const STATUS = {
	INIT: 'init',
	CREATE: 'create',
	UPDATE: 'update',
	DELETE: 'delete',
};

export const MENU_PREFIX = {
	USER: '',
	ESL: '',
	ESL_ELECTRIC_LABEL: '/esl/electricLabel',
	ESL_BASE_STATION: '/esl/baseStation',
	DEVICE_UPGRADE: '/esl/deviceUpgrade',
	NOTIFICATION: '/notification',
	// PRODUCT: '/basicData/productManagement/list',
	PRODUCT: '/product/list',
	// MERCHANT: '/basicData/merchantManagement',
	MERCHANT: '/company/merchantManagement',
	STORE: '/basicData/organizationManagement',
	// STORE: '/company/storeManagement',
	ROLE: '/roleManagement',
};

export const KEY = {
	ENTER: 13,
	BACKSPACE: 8,
	DELETE: 46,
	KEY_C: 67,
	KEY_V: 86,
	KEY_X: 88,
	KEY_Y: 89,
	KEY_Z: 90,
	KEY_LEFT: 37,
	KEY_UP: 38,
	KEY_RIGHT: 39,
	KEY_DOWN: 40,
};

export const MESSAGE_TYPE = {
	EVENT: 'event',
	REQUEST: 'request',
	RESPONSE: 'response',
};

export const RECONNECT_LIMIT = 10;

export const OPERATION_CODE = {
	REGISTER: '0x1001',
};

export const MAIL_LIST = {
	'qq.com': 'http://mail.qq.com',
	'gmail.com': 'http://mail.google.com',
	'sina.com': 'http://mail.sina.com.cn',
	'163.com': 'http://mail.163.com',
	'126.com': 'http://mail.126.com',
	'yeah.net': 'http://www.yeah.net/',
	'sohu.com': 'http://mail.sohu.com/',
	'tom.com': 'http://mail.tom.com/',
	'139.com': 'http://mail.10086.cn/',
	'hotmail.com': 'http://www.hotmail.com',
	'live.com': 'http://login.live.com/',
	'live.cn': 'http://login.live.com/',
	'live.com.cn': 'http://login.live.com/',
	'189.com': 'http://webmail16.189.cn/webmail/',
	'yahoo.com.cn': 'http://login.yahoo.com',
	'yahoo.cn': 'http://login.yahoo.com',
	'eyou.com': 'http://login.yahoo.com',
	'21cn.com': 'http://mail.21cn.com/',
	'188.com': 'http://www.188.com/',
	'foxmail.com': 'http://mail.qq.com/cgi-bin/loginpage?t=fox_loginpage',
	'sunmi.com': 'http://mail.sunmi.com/',
};

export const AVATA_IMG = {
	0: {
		icon: 'check-circle',
		color: 'green',
	},
	1: {
		icon: 'info-circle',
		color: 'blue',
	},
	2: {
		icon: 'info-circle',
		color: '#faad14',
	},
	3: {
		icon: 'close-circle',
		color: 'red',
	},
};

export const USER_PERMISSION_LIST = '__user_permission_list__';

export const TIME = {
	SECOND: 1,
	MINUTE: 60,
	HOUR: 60 * 60,
	DAY: 24 * 60 * 60,
	HALF_HOUR: 30 * 60,
};

export const ONE_DAY_TIMESTAMP = 1000 * 60 * 60 * 24;
