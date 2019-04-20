import CryptoJS from 'crypto-js/crypto-js';
import moment from 'moment';
import { env, DES_KEY, DES_IV } from '@/config';

const STR_BASE = [
    'a',
    'b',
    'c',
    'd',
    'e',
    'f',
    'g',
    'h',
    'i',
    'j',
    'k',
    'l',
    'm',
    'n',
    'o',
    'p',
    'q',
    'r',
    's',
    't',
    'u',
    'v',
    'w',
    'x',
    'y',
    'z',
    'A',
    'B',
    'C',
    'D',
    'E',
    'F',
    'G',
    'H',
    'I',
    'J',
    'K',
    'L',
    'M',
    'N',
    'O',
    'P',
    'Q',
    'R',
    'S',
    'T',
    'U',
    'V',
    'W',
    'X',
    'Y',
    'Z',
];

/* eslint no-useless-escape:0 import/prefer-default-export:0 */
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;

export function isUrl(path) {
    return reg.test(path);
}

export function maskPhone(phone, maskPos) {
    const { maskStart, maskEnd } = maskPos;
    return phone
        .split('')
        .map((num, index) => {
            if (index >= maskStart && index <= maskEnd) {
                return '*';
            }

            return num;
        })
        .join('');
}

export const formatEmpty = (data, blank = '') => {
    const copyData = Object.assign({}, data);
    const keys = Object.keys(copyData);
    keys.forEach((item) => {
        copyData[item] = copyData[item] || blank;
    });

    return copyData;
};

export const unixSecondToDate = (second, formatStr = 'YYYY-MM-DD HH:mm:ss') =>
    moment.unix(second).isValid()
        ? moment
              .unix(second)
              .local()
              .format(formatStr)
        : null;

export const dateStrFormat = (date, format = 'YYYY-MM-DD HH:mm:ss') =>
    date ? moment(date).format(format) : undefined;

/**
 * DES CBC加密
 * @param source
 * @returns {*|string}
 */
export const encryption = source => {
    const message = CryptoJS.enc.Utf8.parse(source);
    const keyHex = CryptoJS.enc.Utf8.parse(DES_KEY[env]);
    const iv = CryptoJS.enc.Utf8.parse(DES_IV[env]);
    const encrypted = CryptoJS.DES.encrypt(message, keyHex, {
        iv,
        mode: CryptoJS.mode.CBC,
    });

    return CryptoJS.enc.Base64.stringify(encrypted.ciphertext);
};

export const cbcEncryption = source => {
    const message = CryptoJS.enc.Utf8.parse(source);
    const keyHex = CryptoJS.enc.Utf8.parse(DES_KEY[env]);
    const ivHex = CryptoJS.enc.Utf8.parse(DES_IV[env]);
    return CryptoJS.DES.encrypt(message, keyHex, {
        iv: ivHex,
        mode: CryptoJS.mode.CBC,
    }).toString();
};

export const md5Encryption = message => CryptoJS.MD5(message).toString();

export const typeCheck = obj => {
    const typeStr = Object.prototype.toString.call(obj);
    return typeStr.toLowerCase().slice(8, typeStr.length - 1);
};

/**
 * 获取 location 中 search 参数
 * @returns {string}
 */
export const getLocationParams = () => {
    const {
        location: { search },
    } = window;
    if (!search) {
        return '';
    }
    const result = {};
    search
        .slice(1)
        .split('&')
        .map(param => {
            const [key, value] = param.split('=');
            result[key] = value;
            return null;
        });
    return result;
};

export const getLocationParam = key => {
    const params = getLocationParams();
    return params[key];
};

export const getMixBase = (min = 5, max = 10) => {
    const range = Math.round(Math.random() * (max - min)) + min;
    let result = '';
    for (let i = 0; i < range; i += 1) {
        const pos = Math.round(Math.random() * STR_BASE.length - 1);
        result += STR_BASE[pos];
    }
    return result;
};

export const idEncode = id => {
    const [leftPad, rightPad] = [getMixBase(), getMixBase()];
    return window.btoa(leftPad + id + rightPad);
};

export const idDecode = encodeStr => window.atob(encodeStr).match(/(\d+)/g)[0];

export const hideSinglePageCheck = (totalCount, hideLimit = 10) =>
    parseInt(totalCount, 10) <= hideLimit;

const compareSubVersion = (base, target) => {
    if (parseInt(target, 10) > parseInt(base, 10)) {
        return 'higher';
    }

    if (parseInt(target, 10) < parseInt(base, 10)) {
        return 'lower';
    }

    return 'equal';
};

export const compareVersion = (base, target) => {
    const baseVersion = base.split('.');
    const targetVersion = target.split('.');

    if (baseVersion.length !== targetVersion.length) {
        return new Error('version format error');
    }

    const [baseFirst, baseSecond, baseThird] = baseVersion;
    const [targetFirst, targetSecond, targetThird] = targetVersion;
    const [resultFirst, resultSecond, resultThird] = [
        compareSubVersion(baseFirst, targetFirst),
        compareSubVersion(baseSecond, targetSecond),
        compareSubVersion(baseThird, targetThird),
    ];

    if (resultFirst !== 'equal') {
        return resultFirst;
    }

    if (resultSecond !== 'equal') {
        return resultSecond;
    }

    return resultThird;
};

export const snakeToCamel = snake =>
    snake
        .split('_')
        .filter(word => !!word)
        .map((word, index) => (index > 0 ? word[0].toUpperCase() + word.slice(1) : word))
        .join('');

export const camelToSnake = camel => {
    let snake = camel;
    camel.match(/[A-Z]/g).forEach(char => {
        snake = snake.replace(char, `_${char.toLowerCase()}`);
    });
    return snake;
};

export const paramsDeserialization = params => {
    const deserializedParams = {};
    Object.keys(params)
        .map(key => ({ snake: key, camel: snakeToCamel(key) }))
        .forEach(mapping => {
            deserializedParams[mapping.camel] = params[mapping.snake];
        });

    return deserializedParams;
};

export const paramsSerialization = params => {
    const serializedParams = {};
    Object.keys(params)
        .map(key => ({ snake: camelToSnake(key), camel: key }))
        .forEach(mapping => {
            serializedParams[mapping.snake] = params[mapping.camel];
        });

    return serializedParams;
};
