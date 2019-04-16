export const password = /((?=.*\d)(?=.*\D)|(?=.*[a-zA-Z])(?=.*[^a-zA-Z]))(?!^.*[\u4E00-\u9FA5].*$)^\S{8,30}$/;
export const mail = /^[\w\d_-]+@[\w\d_-]+(\.[\w\d_-]+)+$/;
export const production_date = /^\d{0,4}$/;
// 匹配所有 ascii 字符
export const normalInput = /[\\x00-\\xff]+/;
export const productPrice = /^([0-9]{1,6})(\.[0-9]{0,2})?$/;
