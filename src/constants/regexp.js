export const password = /((?=.*\d)(?=.*\D)|(?=.*[a-zA-Z])(?=.*[^a-zA-Z]))(?!^.*[\u4E00-\u9FA5].*$)^\S{8,30}$/;
export const mail = /^[\w\d_-]+@[\w\d_-]+(\.[\w\d_-]+)+$/;
export const production_date = /^\d{0,4}$/;
// 匹配所有 ascii 字符
export const normalInput = /^[a-zA-Z\\u0021-\\u007E]+$/;
export const productPrice = /^([0-9]{1,6})(\.[0-9]{0,2})?$/;
export const cellphone = /^[1][356789][0-9]{9}$/;
export const telephone = /^(0\d{2}-\d{8}(-\d{1,4})?)|(0\d{3}-\d{7,8}(-\d{1,4})?)$/;
export const phone = /^([1][356789][0-9]{9})|((0\d{2}-\d{8}(-\d{1,4})?)|(0\d{3}-\d{7,8}(-\d{1,4})?))$/;
