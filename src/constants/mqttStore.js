export const OPCODE = {
	MESSAGE: '0x1001',
	NOTIFICATION: '0x1011',
	GET_AP_CONFIG: '0x3008',
	SET_SCAN_PERIOD: '0x3004',
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
