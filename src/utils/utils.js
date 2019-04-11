import CryptoJS from 'crypto-js/crypto-js';
import { env, DES_KEY, DES_IV } from '@/config';

/* eslint no-useless-escape:0 import/prefer-default-export:0 */
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;

export function isUrl(path) {
  return reg.test(path);
}

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
