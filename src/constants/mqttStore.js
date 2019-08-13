export const OPCODE = {
	MESSAGE: '0x1001',
	NOTIFICATION: '0x1011',
	GET_AP_CONFIG: '0x3008',
	SET_AP_CONFIG: '0x3004',
	ROUTER_GET: '0x2116',
	CLIENT_LIST_GET: '0x2025',
	TRAFFIC_STATS_GET: '0x2040',
	GET_ROUTES_DETAIL: '0x2116',
};

export const REGISTER_PUB_MSG = {
	opcode: OPCODE.MESSAGE,
	param: {
		source: 'WEB',
		client_id: '',
		bin_version: '',
		os_platform: '',
		country_code: 0,
	},
};
