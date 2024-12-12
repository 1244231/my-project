/**
 * 根据传入值的类型，返回基础起始值
 *
 * @param v
 * @return {boolean|{}|string|*[]|number|null}
 */
export function getInitialValue(v) {
    if (v === undefined || v === null) return null
    if (typeof v === 'string') return ''
    if (typeof v === 'boolean') return false
    if (typeof v === 'number') return 0
    if (typeof v === 'object') return {}
    if (Array.isArray(v)) return []
}


/**
 * 判断是否为空值，undefined、null、'' 都视为空值
 *
 * @param str         不定参数
 * @return {boolean}  若为空值，返回true，否则返回false
 */
export function isEmpty(...str) {
    return str.some(i => i === undefined || i === null || i === '')
}


/**
 * 当传入空值时，返回默认值
 *
 * @param v             传入值
 * @param defaultValue  当传入值为空值(使用{@link #isEmpty}判断)时，返回的值
 * @return {string|*}
 */
export function emptyOrDefault(v, defaultValue = '') {
    return isEmpty(v) ? defaultValue : v
}