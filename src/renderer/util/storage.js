import { storage } from "../../config"
import { isEmpty } from "../util"
import { unzip, zip } from "./sectet"

const { keyPrefix, zip: defaultUseZip } = storage
const sessionUserKey = 'SESS-USER'
const localPersonalSettingsKey = 'LOCAL-PERSONAL-SETTINGS'
const sessionTagsViewKey = 'SESS-TAGS-VIEW'
const sessionTableSeetingKey = 'SESS-TABLE-SEET'
const sessionTableWidthKey = "SESS-TABLE-WIDTH"

/**
 * 读取本地存储
 * @param key {string}        键名，自动加上统一前缀
 * @param storage {Storage}   window.sessionStorage或window.localStorage
 * @param useZip {boolean}    是否启用了压缩
 * @return {*|undefined}
 */
export function get(key, storage = window.sessionStorage, useZip = defaultUseZip) {
    let obj = storage.getItem(`${keyPrefix}${key}`)
    if (isEmpty(obj)) return undefined
    try {
        obj = JSON.parse(useZip ? unzip(obj) : obj)
    }
    catch (e) {
        console.error(`获取本地存储[${key}]失败`, e)
        obj = undefined
    }
    return obj
}

/**
 * 生成全局uuid
 * @returns 返回uuid
 */
function getuuid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    }
    return (s4() + s4() + "-" + s4() + "-" + s4() + "-" + s4() + "-" + s4() + s4() + s4()
    );
}

/**
 * 清除所有会话缓存
 * @returns 返回uuid
 */
export function removeAll(storage = window.sessionStorage) {
    storage.clear();
}


/**
 * 写入本地存储
 * @param key {string}        键名，自动加上统一前缀
 * @param obj                 需要写入本地存储的js对象
 * @param storage {Storage}   window.sessionStorage或window.localStorage
 * @param useZip {boolean}    是否启用了压缩
 */
export function set(key, obj, storage = window.sessionStorage, useZip = defaultUseZip) {
    const item = useZip ? zip(JSON.stringify(obj)) : JSON.stringify(obj)
    storage.setItem(`${keyPrefix}${key}`, item)
}

/**
 * 根据指定键名，移除本地存储对应项
 * @param key {string}       键名，自动加上统一前缀
 * @param storage {Storage}  window.sessionStorage或window.localStorage
 */
export function remove(key, storage = window.sessionStorage) {
    storage.removeItem(`${keyPrefix}${key}`)
}

/**
 * 获取表格设置，获取失败时会清除表格设置信息并返回一个空对象
 *@param id typefortable中的id
 * @return {object}
 */
export function getTableSet(id) {
    if (!id) return;
    let tableSet = get(sessionTableSeetingKey + id);
    if (isEmpty(tableSet)) {
        tableSet = []
        removeTableSet(id)
    }
    return tableSet
}

/**
 * 将表格信息持久化到sessionStorage，传入空值时将清除表格信息
 *
 * @param setData
 */
export function setTableSet(setData, id) {
    if (!id) return;
    isEmpty(setData) ? removeTableSet(id) : set(sessionTableSeetingKey + id, setData)
}

/**
 * 获取用户信息，获取失败时会清除用户信息并返回一个空对象
 *
 * @return {object}
 */
export function getUser() {
    let user = get(sessionUserKey)
    if (isEmpty(user)) {
        user = {
            token:'',
            _menus:null,
            lossDays:null,
            _employees: {
                id: null,
                workEID: null,
                name: null,
                isAdmin:null,
                avatar:null,
                telNumber:null
            },
            _company: {
                id: null,
                agentID: null,
                name: null
            }
        }
        removeUser()
    }
    return user
}

/**
 * 将表格列宽存储到缓存中
 *
 * @param tagsView
 */
export function setTableCellWidth(values) {
    let key = sessionTableWidthKey;
    removeTableWidth(key)
    set(key, values)
    return key;
}



/**
 * 获取列宽
 *
 * @return {array}
 */
export function getTableCellWidth() {
    let keys = sessionTableWidthKey;
    let queryData = get(keys);
    // if (isEmpty(queryData)) {
    //     queryData = [];
    //     removeTableWidth(keys);
    // }
    return queryData || [];
}


function removeTableWidth() {
    let keys = sessionTableWidthKey;
    remove(keys);
}



/**
 * 获取持久化后的查询参数
 *
 * @return {array}
 */
export function getQueryData(keys) {
    let queryData = get(keys);
    if (isEmpty(queryData)) {
        queryData = {};
        removeQueryData(keys);
    }
    return queryData;
}


/**
 * 将查询参数持久化到sessionStorage
 *
 * @param tagsView
 */
export function setQueryData(QueryData) {
    let keys = getuuid();
    isEmpty(QueryData) ? removeQueryData(keys) : set(keys, QueryData)
    return keys;
}

function removeQueryData(keys) {
    remove(keys);
}


/**
 * 将用户信息持久化到sessionStorage，传入空值时将清除用户信息
 *
 * @param user
 */
export function setUser(user) {

    isEmpty(user) ? removeUser() : set(sessionUserKey, user)
}

/**
 * 获取用户个性设置，获取失败时会清除设置信息并返回一个空对象
 *
 * @return {object}
 */
export function getLocalPersonalSettings() {
    let settings = get(localPersonalSettingsKey, window.localStorage)
    if (isEmpty(settings)) {
        settings = {}
        removeLocalPersonalSettings()
    }
    return settings;
}




/**
 * 将用户个性设置持久化到localStorage，传入空值时将清除设置信息
 *
 * @param settings
 */
export function setLocalPersonalSettings(settings) {
    isEmpty(settings)
        ? removeLocalPersonalSettings()
        : set(localPersonalSettingsKey, settings, window.localStorage)
}

/**
 * 获取持久化后的页签，获取失败时会清除持久化数据并返回一个空数组
 *
 * @return {array}
 */
export function getTagsView() {

    let tagsView = get(sessionTagsViewKey)
    if (isEmpty(tagsView)) {
        tagsView = []
        removeTagsView()
    }
    return tagsView
}

/**
 * 将页签持久化到sessionStorage，传入空值时将清除页签信息
 *
 * @param tagsView
 */
export function setTagsView(tagsView) {
    isEmpty(tagsView) ? removeTagsView() : set(sessionTagsViewKey, tagsView)
}

function removeUser() {
    remove(sessionUserKey)
}

function removeTableSet(id) {
    if (!id) return;
    remove(sessionTableSeetingKey + id);
}

function removeLocalPersonalSettings() {
    remove(localPersonalSettingsKey, window.localStorage)
}

function removeTagsView() {
    remove(sessionTagsViewKey)
}
