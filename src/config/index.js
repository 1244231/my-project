const isDev = process.env.NODE_ENV === 'development'
module.exports = {

    //本地存储配置
    storage: {
        //键名前缀
        keyPrefix: 'GCC-',

        //读写时是否进行压缩的默认值
        zip: !isDev
    }
}
