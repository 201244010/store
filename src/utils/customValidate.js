import { formatMessage } from 'umi/locale';
import * as RegExp from '@/constants/regexp';

const passwordValidate = (rule, value, callback, extra) => {
  const { messageId = {} } = extra;
  const { isEmpty, inLength, isFormatted } = messageId;
  if (!value) {
    callback(formatMessage({ id: isEmpty || 'password.validate.isEmpty' }));
  } else if (value.length < 8) {
    callback(formatMessage({ id: inLength || 'password.validate.inLength' }));
  } else if (!RegExp.password.test(value)) {
    callback(formatMessage({ id: isFormatted || 'password.validate.isFormatted' }));
  } else {
    callback();
  }
};

const confirmValidate = (rule, value, callback, extra) => {
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

const productionDate = (rule, value, callback) => {
  if (!value) {
    callback();
  } else if (!RegExp.production_date.test(value)) {
    callback(formatMessage({ id: 'product.production_date.isFormatted' }));
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

const validatorList = {
  password: passwordValidate,
  confirm: confirmValidate,
  mail: mailValidate,
  seq_num: productSqeNum,
  bar_code: productBarCode,
  production_date: productionDate,
  price: productPrice,
  promote_price: productPrice,
  vip: productPrice,
};

export function customValidate(params) {
  const { field, rule, value, callback, extra } = params;
  const validateFunction = validatorList[field];
  validateFunction(rule, value, callback, extra);
}
