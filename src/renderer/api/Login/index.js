import http from "../request"
// 登录
export const logins = (data = {}) => http.post('/logins/login', data);
export const sendverificationcode = (data = {}) => http.post('/logins/sendverificationcode', data);
export const importhhdata = (data = {}) => http.post('/logins/importhhdata', data);