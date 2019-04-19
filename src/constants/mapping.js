export const STATION_STATES = {
    0: 'esl.device.ap.status.inactivated',
    1: 'esl.device.ap.status.online',
    2: 'esl.device.ap.status.offline',
};

export const PRODUCT_BASIC = {
    seq_num: null,
    bar_code: null,
    name: null,
    alias: null,
    // 特殊 因为 type 在 GO 中关键字
    Type: null,
    unit: null,
    spec: null,
    area: null,
    level: null,
    brand: null,
    expire_time: null,
    qr_code: null,
};

export const PRODUCT_BASIC_EXTRA = {
    extra_info: null,
};

export const PRODUCT_PRICE = {
    price: null,
    promote_price: null,
    member_price: null,
};

export const PRODUCT_PRICE_EXTRA = {
    extra_price_info: null,
};
