// cancel-request.js
import axios from 'axios'
import qs from 'qs'
import md5 from 'js-md5';

let pendingRequest = new Map();

// 根据请求信息生成唯一标识key post验证相同请求 避免表单重复提交
const geterateReqKey = (config) => {
    const { url, data = {}, param = {} } = config || {};
    if (!url) return;
    let { isSaveM = false, notCheckRequire = false } = data;

    const obj = !isSaveM || !notCheckRequire ? { param, url, data } : { url };
    if (!isSaveM || !notCheckRequire) {
        if (typeof data === 'string')
            obj.data = JSON.parse(data)
        if (typeof param === 'string')
            obj.param = JSON.parse(param)
    }
    const sign = md5(qs.stringify(obj)).toUpperCase(); // 这样才能区分是不是同接口且同参数
    return sign;
}

const addPendingRequest = (config) => {
    const requestKey = geterateReqKey(config);
    const { data = {} } = config || {};
    let { isSaveM = false, notCheckRequire = false } = data;
    config.cancelToken =
        config.cancelToken ||
        new axios.CancelToken(cancel => {
            if (!pendingRequest.has(requestKey)) {
                // 把请求取消方法作为 map 值存起来
                pendingRequest.set(requestKey, cancel);
                return;
            }
            if (isSaveM && notCheckRequire) return;
            cancel();
        });
}


// 检查是否存在重复请求，若存在则取消前一次请求
const removePendingRequest = (config) => {
    let { data = {} } = config || {};
    let { isSaveM = false, notCheckRequire = false } = data;
    if (!isSaveM || !notCheckRequire) return;
    const requestKey = geterateReqKey(config);
    if (pendingRequest.has(requestKey)) {
        const cancel = pendingRequest.get(requestKey)
        cancel(requestKey);
        removeRequestKey(config);
    }
}


// 从pendingRequest中删除对应的key
const removeRequestKey = (config) => {
    const requestKey = geterateReqKey(config);
    pendingRequest.delete(requestKey);
}

const clearRequestMap = () => {
    pendingRequest.clear();
}

export default {
    addPendingRequest,
    removePendingRequest,
    removeRequestKey,
    clearRequestMap
}
