export const ERROR_OK = 1;
export const ORDER_OK = 1;
export const MQTT_RES_OK = 0;
export const TOKEN_EXPIRE = -2;

export const SHOW_VCODE = 2;
export const VCODE_ERROR = 3;
export const SEND_TOO_FAST = 3;
export const MOBILE_ERROR = 201;
export const MOBILE_BINDED = 204;

export const USER_EXIST = 1;
export const SSO_BINDED = 1;
export const USER_NOT_EXIST = 3603;
export const USER_NOT_LOGIN = 5028;
export const TEMPLATE_BOUND_ESL = 5340;
export const TEMPLATE_NAME_USED = 5346;

export const EMPLOYEE_BINDED = 5406;

export const EMPLOYEE_NUMBER_BINDED = 5403;

export const PRODUCT_SEQ_EXIST = 5051;
export const PRODUCT_PLU_EXIST = 5000;
export const STORE_EXIST = 5034;
export const ERR_FIRMWARE_EXIST = 5801;
export const ERR_FIRMWARE_VERSION_LOWER = 5802;

export const ERR_ROLE_NAME_EXIST = 5036;
export const ERR_ROLE_USED = 5037;

export const NONE_IMPORTED_RECORD = 5013;

export const ERR_AGREEMENT_NOT_ACCEPT = 5410;
export const ERR_AGREEMENT_NOT_LATEST = 5411;
export const ERR_SSO_USER_NOT_IN_COMPANY = 5400;


export const ERR_IPC_NOT_EXIST = 5501;
export const ORDER_COMPLETED = 5503;
export const UNBIND_CODE = 5510;

export const SWITCH_SCEEN_NO_DELETE = 5347;

export const NO_ANALYZE_DATA = 5087;

export const ERR_SERVICE_SUBSCRIBE_ERROR = 5420;
export const ERR_FREE_SERVICE_USED = 5422;

export const ERR_DELETE_ROLE_WITH_EMPLOYEE = 5430;
export const ERR_DELETE_DEFAULT_ROLE_DENIED = 5431;

export const ALERT_NOTICE_MAP = {
	'2': 'alert.code.error',
	'3': 'alert.code.send.fast',
	// '309': 'alert.code.send.fast',
	'1001': 'alert.mail.existed',
	'2000': 'alert.code.error',
	'2003': 'alert.code.error',
	'3603': 'alert.mobile.not.registered',
	'3603-mail': 'alert.mail.not.registered',
	'3603-mobile': 'alert.mobile.not.registered',
	'3603-other': 'alert.other.not.registered',
	'201': 'alert.account.error',
	'208': 'alert.code.expired',
	'216': 'alert.mobile.existed',
	[TEMPLATE_BOUND_ESL]: 'alert.template.bound.esl',
	[TEMPLATE_NAME_USED]: 'alert.template.name.used',
	[ERR_ROLE_NAME_EXIST]: 'alert.role.name.exist',
	[ERR_ROLE_USED]: 'alert.role.used',
	[ERR_DELETE_ROLE_WITH_EMPLOYEE]: 'alert.role.with.employee',
	[ERR_DELETE_DEFAULT_ROLE_DENIED]: 'alert.role.default.nodelete'
};

export const ALERT_ROLE_MAP = {
	[USER_NOT_EXIST]: 'alert.role.not.exist',
	[ERR_SSO_USER_NOT_IN_COMPANY]: 'alert.sso.not.company',
};

export const ALTERT_TRADE_MAP = {
	[ORDER_COMPLETED]: 'pay.order.completed',
};
