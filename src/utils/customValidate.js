import { formatMessage } from 'umi/locale';
import * as RegExp from '@/constants/regexp';

const passwordValidate = (rule, value, callback) => {
  if (!value) {
    callback(formatMessage({ id: 'password.validate.isEmpty' }));
  } else if (value.length < 8) {
    callback(formatMessage({ id: 'password.validate.inLength' }));
  } else if (!RegExp.password.test(value)) {
    callback(formatMessage({ id: 'password.validate.isFormatted' }));
  } else {
    callback();
  }
};

const confirmValidate = (rule, value, callback, extra) => {
  const { getFieldValue } = extra;
  if (!value) {
    callback(formatMessage({ id: 'confirm.validate.isEmpty' }));
  } else if (getFieldValue('password') !== value) {
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

const validatorList = {
  password: passwordValidate,
  confirm: confirmValidate,
  mail: mailValidate,
};

export function customValidate(params) {
  const { field, rule, value, callback, extra } = params;
  const validateFunction = validatorList[field];
  validateFunction(rule, value, callback, extra);
}
