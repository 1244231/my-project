import axios from 'axios'
import { Notification } from 'element-ui'
import { gettoken } from '../store'

var apiPrefix = "";
const instance = axios.create({
    baseURL: apiPrefix,
    timeout: 120000,
    changeOrigin: true,
})

instance.interceptors.request.use(
    config => {
        gettoken().then(value => {
            config.headers['Authorization'] = 'Bearer ' + value
            return config
        })

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
        // 移除成功请求记录
        return responseType === 'json' ? res : response
    },
    async error => {
        if (error.response.status === 401) {
            Notification.error({
                title: '错误',
                message: "登录状态失效，两秒后将跳转至登录页面"
            })

            setTimeout(() => {
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
