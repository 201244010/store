export const OPCODE = {
	MESSAGE: '0x1001',
	NOTIFICATION: '0x1011',
	TRADE_NOTIFICATION: '0x1012',
	GET_AP_CONFIG: '0x3008',
	SET_AP_CONFIG: '0x3004',
	SET_SELF_REFRESH: '0x3005',
	SET_CLKSYNC: '0x3006',
	ROUTER_GET: '0x2116',
	CLIENT_LIST_GET: '0x2025',
	TRAFFIC_STATS_GET: '0x2040',
	SYSTEMTOOLS_RESTART: '0x2015',
	MESH_UPGRADE_START: '0x207a',
	MESH_UPGRADE_STATE: '0x207b',
	GET_ROUTES_DETAIL: '0x2116',
	QOS_SET : '0x2022',
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
