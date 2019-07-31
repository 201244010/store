import CryptoJS from 'crypto-js/crypto-js';
import moment from 'moment';
import CONFIG from '@/config';
import { formatMessage } from 'umi/locale';

const { DES_KEY, DES_IV } = CONFIG;

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

const NUM_BASE = [
	0,
	1,
	2,
	3,
	4,
	5,
	6,
	7,
	8,
	9,
	10,
	11,
	12,
	13,
	14,
	15,
	16,
	17,
	18,
	19,
	20,
	21,
	22,
	23,
	24,
	25,
	26,
	27,
	28,
	29,
	30,
];
const SYMBOL_BASE = [
	'~',
	'`',
	'!',
	'@',
	'#',
	'$',
	'%',
	'^',
	'&',
	'*',
	'(',
	')',
	'-',
	'+',
	'=',
	'{',
	'}',
	'|',
	'\\',
	':',
	';',
	'"',
	'\'',
	'<',
	'>',
	',',
	'.',
	'?',
	'/',
];

/* eslint no-useless-escape:0 import/prefer-default-export:0 */
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;

export function isUrl(path) {
	return reg.test(path);
}

export function maskPhone(phone = '', maskPos) {
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
	keys.forEach(item => {
		copyData[item] = copyData[item] || blank;
	});

	return copyData;
};

export const formatEmptyWithoutZero = (data, blank = '') => {
	const copyData = Object.assign({}, data);
	const keys = Object.keys(copyData);
	keys.forEach(item => {
		copyData[item] = !copyData[item] && copyData[item] !== 0 ? blank : copyData[item];
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

const mixBaseStore = {
	alphabet: STR_BASE,
	number: NUM_BASE,
	symbol: SYMBOL_BASE,
};

export const getMixBase = (min = 5, max = 10, base = 'alphabet') => {
	const range = Math.round(Math.random() * (max - min)) + min;
	const mixBase = mixBaseStore[base];
	let result = '';
	for (let i = 0; i < range; i += 1) {
		const pos = Math.round(Math.random() * mixBase.length - 1);
		result += mixBase[pos];
	}
	return result;
};

export const idEncode = (id, min = 5, max = 10, base = 'alphabet') => {
	const [leftPad, rightPad] = [getMixBase(min, max, base), getMixBase(min, max, base)];
	return window.btoa(leftPad + id + rightPad);
};

export const idDecode = (encodeStr, seed = 'alphabet') => {
	const decodeStr = window.atob(encodeStr);

	if (seed === 'alphabet') {
		return decodeStr.match(/(\d+)/g)[0];
	}

	if (seed === 'number') {
		return decodeStr.match(/([a-zA-Z]+)/g)[0];
	}

	return decodeStr.match(/([a-zA-Z0-9]+)/g)[0];
};

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

/**
 * DES CBC加密
 * @param source
 * @returns {*|string}
 */
export const encryption = source => {
	const desKey = idDecode(DES_KEY, 'number');
	const desIv = idDecode(DES_IV, 'alphabet');
	const message = CryptoJS.enc.Utf8.parse(source);
	const keyHex = CryptoJS.enc.Utf8.parse(desKey);
	const iv = CryptoJS.enc.Utf8.parse(desIv);
	const encrypted = CryptoJS.DES.encrypt(message, keyHex, {
		iv,
		mode: CryptoJS.mode.CBC,
	});

	return CryptoJS.enc.Base64.stringify(encrypted.ciphertext);
};

export const cbcEncryption = source => {
	const desKey = idDecode(DES_KEY, 'number');
	const desIv = idDecode(DES_IV, 'alphabet');
	const message = CryptoJS.enc.Utf8.parse(source);
	const keyHex = CryptoJS.enc.Utf8.parse(desKey);
	const ivHex = CryptoJS.enc.Utf8.parse(desIv);
	return CryptoJS.DES.encrypt(message, keyHex, {
		iv: ivHex,
		mode: CryptoJS.mode.CBC,
	}).toString();
};

export const md5Encryption = message => CryptoJS.MD5(message).toString();

export const formatTimeMessage = datetime => {
	const currentStamp = Math.round(new Date() / 1000);
	const momentNow = moment.unix(currentStamp);
	const timeDiff = currentStamp - datetime;
	const momentTime = moment.unix(datetime);
	let currentTime = '';
	if (momentNow.isSame(momentTime, 'year')) {
		if (timeDiff < 3600) {
			currentTime = momentTime.fromNow();
		} else if (momentNow.isSame(momentTime, 'day')) {
			currentTime = momentTime.format('a hh:mm');
		} else {
			currentTime = momentTime.format('MM/DD a hh:mm');
		}
	} else {
		currentTime = momentTime.format('YYYY/MM/DD');
	}

	return currentTime;
};

export const filterObject = obj => {
	const ret = {};
	Object.keys(obj)
		.filter(key => obj[key] !== undefined)
		.forEach(key => {
			ret[key] = obj[key];
		});
	return ret;
};

export const getRandomString = () =>
	Math.random()
		.toString(36)
		.substring(2);

export const priceFormat = (price, dotPos = 3) => {
	const isNagtive = Number(price) < 0;
	const priceString = `${price}`;
	const priceStr = isNagtive ? priceString.slice(1) : priceString;

	const [round, decimal] = priceStr.split('.');
	if (round.length < 4) {
		return `${isNagtive ? '-' : ''}${priceStr}`;
	}

	const reverseRound = round.split('').reverse();
	const reversedRound = reverseRound.reduce((prev, cur, index) => {
		if (index % dotPos === 0) {
			return (cur = `${cur},${prev}`);
		}

		return (cur += prev);
	});

	return decimal
		? `${isNagtive ? '-' : ''}${reversedRound}.${decimal}`
		: `${isNagtive ? '-' : ''}${reversedRound}`;
};

export const analyzeMessageTemplate = message => {
	const [messageId, values] = message.split(':');
	let valueList = [];

	if (values) {
		valueList = values.split('&').map(item => {
			const [key, value] = item.split('=');
			if (key.indexOf('decode-') > -1) {
				return {
					key: `##${key.replace('decode-', '')}##`,
					value: formatMessage({ id: `${messageId}-${value}` }),
				};
			}
			return {
				key: `##${key}##`,
				value,
			};
		});
	}

	return {
		messageId,
		valueList,
	};
};

export const replaceTemplateWithValue = ({ messageId, valueList = [] }) => {
	if (!messageId) {
		console.error('messageId can not be null.');
		return null;
	}

	console.log('messageId: ', messageId);
	console.log('valueList: ', valueList);
	const message = formatMessage({ id: messageId });
	if (valueList.length === 0) {
		return message;
	}

	return valueList.reduce((prev, cur) => prev.replace(cur.key, cur.value), message);
};

export const formatMessageTemplate = message =>
	replaceTemplateWithValue(analyzeMessageTemplate(message));

export const convertArrayPrams = (str, sperator = '&') => {
	const obj = {};
	str.split(sperator).forEach(item => {
		const [key, value] = item.split('=');
		obj[key] = value;
	});

	return obj;
};
