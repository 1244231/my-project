import axios from 'axios'
import { Notification } from 'element-ui'
import store from '@/store'
import cancelRequest from './cancel-request.js'

// import { gettoken } from '../store'
var apiPrefix = "http://testeasyway.ezhisoft.com:9942/api/v1";
const instance = axios.create({
    baseURL: apiPrefix,
    timeout: 120000,
    changeOrigin: true,
})

instance.interceptors.request.use(
    config => {
        if (store.state.user.token) {
            config.headers['Authorization'] = 'Bearer ' + store.state.user.token
        }
        return config
    },
    error => Promise.reject(error)
)

instance.interceptors.response.use(
    response => {
        const res = response.data, { responseType = 'json' } = response.config
        if (typeof response.config.data === 'string') {
            // response里面返回的config.data是个字符串对象
            response.config.data = JSON.parse(response.config.data)
        }

        if (!('status' in res) || res.status == false) {
            Notification.error({
                title: '错误',
                message: res.message || "网络错误"
            })
            // 属于是token 真正过期了 
            // if (response.headers["token-expired"])
            // store.dispatch("user/logout")
            return Promise.reject(res.message)
        }
        // 移除成功请求记录
        return responseType === 'json' ? res : response
    },

    async error => {
        cancelRequest.removeRequestKey(error.config || {})
        if (error.response.status === 401) {
            if (error.response.headers["token-expired"]) {
                try {
                    if (!isRefreshing) {
                        isRefreshing = true;
                        requests = [];
                        await store.dispatch("user/refreshtoken");
                    } else {
                        return new Promise((resolve) => {
                            requests.push(() => resolve(instance()))
                        })
                    }
                } catch (error) { }
                finally { isRefreshing = false }

                return instance(error.response.config);
            }
            Notification.error({
                title: '错误',
                message: "登录状态失效，两秒后将跳转至登录页面"
            })

            setTimeout(() => {
                store.dispatch("user/logout");
                return romise.reject(error.message)
            }, 2000);

        }
        if (axios.isCancel(error)) return
        error && Notification.error({
            title: '错误',
            message: error.response.data || "网络错误"
        })

        return Promise.reject(error)
    }
)

export default instance
