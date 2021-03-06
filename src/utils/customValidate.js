import { formatMessage } from 'umi/locale';
import * as RegExp from '@/constants/regexp';

const passwordValidate = (rule, value, callback, extra = {}) => {
	const { messageId = {}, compare = false } = extra;
	const { isEmpty, inLength, isFormatted } = messageId;
	if (!value) {
		callback(formatMessage({ id: isEmpty || 'password.validate.isEmpty' }));
	} else if (value.length < 8) {
		callback(formatMessage({ id: inLength || 'password.validate.inLength' }));
	} else if (!RegExp.password.test(value)) {
		callback(formatMessage({ id: isFormatted || 'password.validate.isFormatted' }));
	} else if (compare) {
		const { getFieldValue, compareField } = extra;
		if (getFieldValue(compareField) === value) {
			callback(formatMessage({ id: 'password.new.old.isEqual' }));
		} else {
			callback();
		}
	} else {
		callback();
	}
};

const confirmValidate = (rule, value, callback, extra = {}) => {
	const { getFieldValue, compareField = 'password' } = extra;
	if (!value) {
		callback(formatMessage({ id: 'confirm.validate.isEmpty' }));
	} else if (getFieldValue(compareField) !== value) {
		callback(formatMessage({ id: 'confirm.validate.isEqual' }));
	} else {
		callback();
	}
};

const mailValidate = (rule, value, callback) => {
	if (!value) {
		callback(formatMessage({ id: 'mail.validate.isEmpty' }));
	} else if (!RegExp.mail.test(value)) {
		callback(formatMessage({ id: 'mail.validate.isFormatted' }));
	} else {
		callback();
	}
};

const phoneValidate = (rule, value, callback) => {
	if (!value) {
		callback();
	} else if (!RegExp.cellphone.test(value) && !RegExp.telephone.test(value)) {
		callback(formatMessage({ id: 'cellphone.validate.isFormatted' }));
	} else {
		callback();
	}
};

const productSqeNum = (rule, value, callback) => {
	if (!value) {
		callback();
	} else if (!RegExp.normalInput.test(value)) {
		callback(formatMessage({ id: 'product.seq_num.isFormatted' }));
	} else {
		callback();
	}
};

const productBarCode = (rule, value, callback) => {
	if (!value) {
		callback();
	} else if (!RegExp.normalInput.test(value)) {
		callback(formatMessage({ id: 'product.bar_code.isFormatted' }));
	} else {
		callback();
	}
};

const expireTime = (rule, value, callback) => {
	if (!value) {
		callback();
	} else if (!RegExp.productionDate.test(value)) {
		callback(formatMessage({ id: 'product.expire_time.isFormatted' }));
	} else {
		callback();
	}
};

const productPrice = (rule, value, callback) => {
	if (!value) {
		callback();
	} else if (!RegExp.productPrice.test(value)) {
		callback(formatMessage({ id: 'product.price.isFormatted' }));
	} else {
		callback();
	}
};

const otherPrice = (rule, value, callback) => {
	if (value && !RegExp.productPrice.test(value)) {
		callback(formatMessage({ id: 'product.price.isFormatted' }));
	} else {
		callback();
	}
};

const pluCodeValidate = (rule, value, callback) => {
	if (!RegExp.pluCode.test(value)) {
		callback(formatMessage({ id: 'basicData.weightProduct.PLU.formatError' }));
	} else {
		callback();
	}
};

const productWeightValidate = (rule, value, callback, extra) => {
	const { messageId = null } = extra || {};
	if (value && !RegExp.productWeight.test(value)) {
		callback(formatMessage({ id: messageId || 'basicData.weightProduct.weight.formatError' }));
	} else {
		callback();
	}
};

const dateNumberValidate = (rule, value, callback, extra) => {
	const { messageId = null } = extra || {};
	if (value && !RegExp.dateNumber.test(value)) {
		callback(formatMessage({ id: messageId || 'basicData.weightProduct.date.formatError' }));
	} else {
		callback();
	}
};

const validatorList = {
	password: passwordValidate,
	confirm: confirmValidate,
	mail: mailValidate,
	seq_num: productSqeNum,
	bar_code: productBarCode,
	expire_time: expireTime,
	price: productPrice,
	promote_price: otherPrice,
	member_price: otherPrice,
	telephone: phoneValidate,
	pluCode: pluCodeValidate,
	productWeight: productWeightValidate,
	dateNumber: dateNumberValidate,
};

export function customValidate(params) {
	const { field, rule, value, callback, extra } = params;
	const validateFunction = validatorList[field];
	validateFunction(rule, value, callback, extra);
}
