import sysEnv from './env';

const {
	location: { protocol },
} = window;

export const { env, country } = sysEnv;

/**
 * 总部下展示的菜单
 */
export const CompanyPermission = {
	companyView: [
		{ base: 'dashboard', path: '/dashboard' },
		{ base: 'dataAnalyze', path: '/dataAnalyze/passenger' },
		{ base: 'dataAnalyze', path: '/dataAnalyze/businessDaily' },
	],
	basicData: [
		'merchantManagement',
		'organizationManagement',
		'employeeManagement',
		'roleManagement',
	],
};

export const FIRST_MENU_ORDER = [
	'companyView',
	'dashboard',
	'dataAnalyze',
	'storeMonitor',
	'productManagement',
	'transManagement',
	'serviceManagement',
	'deviceManagement',
	'basicData',
];

export const SECOND_MENU_ORDER = ['ipcList', 'esl', 'network', 'iotAccess'];

export const HTTP_PREFIX = {
	'http:': 'https:',
	'https:': 'https:',
};

export const WEB_SOCKET_PREFIX = {
	'http:': 'wss:',
	'https:': 'wss:',
};

const SSO_ADDRESS = {
	dev: 'api.test.sunmi.com',
	test: 'api.test.sunmi.com',
	uat: 'api.uat.sunmi.com',
	onl: 'api.sunmi.com',
	local: '127.0.0.1:30001',
	// local: '10.10.168.228:30001',
};

const API_ADDRESS = {
	dev: 'store.dev.sunmi.com',
	test: 'store.test.sunmi.com',
	uat: 'store.uat.sunmi.com',
	onl: 'store.sunmi.com',
	local: '127.0.0.1:30001',
	// local: '10.10.168.228:30001',
};

const COUNTRY_ADDRESS = {
	china: API_ADDRESS[env],
	southAmerica: '',
};

// ipc专用的测试和开发地址
const IPC_ADDRESS = {
	dev: 'store.dev.sunmi.com',
	// test: '47.99.16.199:30401',
	test: 'store.test.sunmi.com',
};

const DES_KEY = {
	dev: 'NzI3MjQyNzEyMjI3d3l3bXh4a2oyNTI4MjIwMjE0OTIwMA==',
	test: 'NzI3MjQyNzEyMjI3d3l3bXh4a2oyNTI4MjIwMjE0OTIwMA==',
	onl: 'NzEyNTUyNTIzMTFqaWhleHhrajEwMjExMjE0MjE5',
	uat: 'NzEyNTUyNTIzMTFqaWhleHhrajEwMjExMjE0MjE5',
	local: 'NzEyNTUyNTIzMTFqaWhleHhrajEwMjExMjE0MjE5',
};

const DES_IV = {
	dev: 'Q0dZU0lrMTIzNDU2NzhqS01MV051eg==',
	test: 'Q0dZU0lrMTIzNDU2NzhqS01MV051eg==',
	onl: 'VGZNamFOeGY5ODc2NTQzMnpWbEV5aWFY',
	uat: 'VGZNamFOeGY5ODc2NTQzMnpWbEV5aWFY',
	local: 'VGZNamFOeGY5ODc2NTQzMnpWbEV5aWFY',
};

const MD5_TOKEN = {
	dev: 'QCItLCJ7J1dveW91eGlueGk2NjYhK14rOi0j',
	test: 'QCItLCJ7J1dveW91eGlueGk2NjYhK14rOi0j',
	onl: 'fX06fD8kYEppaGV3b2JveDE1fDtgKSZ+YCks',
	uat: 'fX06fD8kYEppaGV3b2JveDE1fDtgKSZ+YCks',
	local: 'fX06fD8kYEppaGV3b2JveDE1fDtgKSZ+YCks',
};

export default {
	SSO_ADDRESS: `${HTTP_PREFIX[protocol]}//${SSO_ADDRESS[env]}`,
	API_ADDRESS: `${HTTP_PREFIX[protocol]}//${API_ADDRESS[env]}`,
	DES_KEY: DES_KEY[env],
	DES_IV: DES_IV[env],
	MD5_TOKEN: MD5_TOKEN[env],

	IPC_SERVER: `${HTTP_PREFIX[protocol]}//${IPC_ADDRESS[env]}`,
	WEB_SOCKET_PREFIX: WEB_SOCKET_PREFIX[protocol] || 'wss:',
	COUNTRY_ADDRESS: COUNTRY_ADDRESS[country],
};
