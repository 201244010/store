export const ERROR_OK = 1;
export const TOKEN_EXPIRE = -2;

export const SHOW_VCODE = 2;
export const VCODE_ERROR = 3;
export const SEND_TOO_FAST = 3;
export const MOBILE_ERROR = 201;
export const MOBILE_BINDED = 204;

export const USER_EXIST = 1;
export const USER_NOT_EXIST = 3603;
export const USER_NOT_LOGIN = 5028;
export const TEMPLATE_BOUND_ESL = 5340;
export const TEMPLATE_NAME_USED = 5346;

export const PRODUCT_SEQ_EXIST = 5051;

export const ERR_FIRMWARE_EXIST = 5801;
export const ERR_FIRMWARE_VERSION_LOWER = 5802;

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
};
