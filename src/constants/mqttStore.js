const OPCODE = {
    MESSAGE: '0x1001',
};

export const RESISTER_PUB_MSG = {
    opcode: OPCODE.MESSAGE,
    param: {
        source: 'WEB',
        client_id: '',
        bin_version: '',
        os_platform: '',
        country_code: 0,
    },
};
