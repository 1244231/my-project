import pako from 'pako'

/**
 * 解压字符串
 *
 * @param b64Data {string} base64编码的字符串
 * @return {string}
 */
export function unzip(b64Data) {
    let strData = window.atob(b64Data)
    const charData = strData.split('').map(x => x.charCodeAt(0))
    const binData = new Uint8Array(charData)
    const data = pako.inflate(binData)
    strData = String.fromCharCode.apply(null, new Uint16Array(data))
    return decodeURIComponent(strData)
}

/**
 * 压缩字符串
 *
 * @param str {string}
 * @return {string}
 */
export function zip(str) {
    const binaryString = pako.gzip(encodeURIComponent(str), {to: 'string'})
    return window.btoa(binaryString)
}
