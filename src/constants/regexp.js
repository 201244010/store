export const password = /^(?=.*[a-zA-Z])(?=.*\d)[\s\S]{8,30}$/;
// export const mail = /^[\w\d_-]+@[\w\d_-]+(\.[\w\d_-]+)+$/;
export const mail = /^[a-zA-Z0-9_+.-]+@([a-zA-Z0-9-]+\.)+[a-zA-Z0-9]{2,4}/;
export const productionDate = /^\d{0,4}$/;
// 匹配所有 ascii 字符
export const normalInput = /^[a-zA-Z\\u0021-\\u007E]+$/;
// export const productPrice = /^([0-9]{1,6})(\.[0-9]{0,2})?$/;
export const productPrice = /^([0-9]{1,6})(\.[0-9]{1,2}){0,1}$/;
export const cellphone = /^[1][356789][0-9]{9}$/;
export const telephone = /^([0-9]{3,4}-)?([2-9][0-9]{2,7}-?)+([-#][0-9]{1,4}){0,}$/;
export const phone = /^([1][356789][0-9]{9})|((0\d{2}-\d{8}(-\d{1,4})?)|(0\d{3}-\d{7,8}(-\d{1,4})?))$/;

export const money = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;

export const pluCode = /^[0-9]{0,20}$/;
export const productWeight = /^([0-9]{1,5})(\.[0-9]{0,3})?$/;
export const dateNumber = /^-?\d{1,2}$/;
export const employeeNumber = /^[\d\w]+$/;

// 首字母不为空格
export const spaceInput = /^\S.*/;

// 匹配emoji
export const emojiInput = /[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF][\u200D|\uFE0F]|[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF]|[0-9|*|#]\uFE0F\u20E3|[0-9|#]\u20E3|[\u203C-\u3299]\uFE0F\u200D|[\u203C-\u3299]\uFE0F|[\u2122-\u2B55]|\u303D|[A9|AE]\u3030|\uA9|\uAE|\u3030/ig;