export const password = /((?=.*\d)(?=.*\D)|(?=.*[a-zA-Z])(?=.*[^a-zA-Z]))(?!^.*[\u4E00-\u9FA5].*$)^\S{8,30}$/;
export const mail = /^[\w\d_-]+@[\w\d_-]+(\.[\w\d_-]+)+$/;
