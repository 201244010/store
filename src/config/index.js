export const env = process.env.UMI_ENV;

const SSO_ADDRESS = {
    dev: 'test.api.sunmi.com',
    test: 'test.api.sunmi.com',
    uat: 'uat.api.sunmi.com',
    onl: 'api.sunmi.com',
};

const API_ADDRESS = {
    dev: 'dev-store.sunmi.com:30301',
    test: 'test-store.sunmi.com:30301',
    uat: 'uat-store.sunmi.com:443',
    onl: 'store.sunmi.com:443',
};

const DES_KEY = {
    development: 'wywmxxkj',
    dev: 'wywmxxkj',
    test: 'wywmxxkj',
    demo: 'wywmxxkj',
    production: 'jihexxkj',
    onl: 'jihexxkj',
    uat: 'jihexxkj',
};

const DES_IV = {
    development: '12345678',
    dev: '12345678',
    test: '12345678',
    demo: '12345678',
    production: '98765432',
    onl: '98765432',
    uat: '98765432',
};

const MD5_TOKEN = {
    development: 'Woyouxinxi666',
    dev: 'Woyouxinxi666',
    test: 'Woyouxinxi666',
    demo: 'Woyouxinxi666',
    production: 'Jihewobox15',
    onl: 'Jihewobox15',
    uat: 'Jihewobox15',
};

export default {
    SSO_ADDRESS: SSO_ADDRESS[env],
    API_ADDRESS: API_ADDRESS[env],
    DES_KEY: DES_KEY[env],
    DES_IV: DES_IV[env],
    MD5_TOKEN: MD5_TOKEN[env],
};
