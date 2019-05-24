const OPCODE = {
	MESSAGE: '0x1001',
	NOTIFICATION: '0x1011',
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
