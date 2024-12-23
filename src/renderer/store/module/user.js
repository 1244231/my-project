import { createMutations } from "../util"
import { emptyOrDefault, arrayemptyOrDefault } from "../../util"
import { getUser, setUser, setTagsView, removeAll } from "@/util/storage"
// import { tagsViewMutations } from "qdt-admin-layout"
import { logins, getnewtoken } from "../../api/Login";


//刷新时从本地存储中获取用户信息
const logininfo = getUser();


const state = {
    //是否在退出的过程中，避免重复弹框
    prepareLogout: false,
    /*用户基本信息*/
    empid: emptyOrDefault(logininfo._employees.id),
    workEID: emptyOrDefault(logininfo._employees.workEID),
    name: emptyOrDefault(logininfo._employees.name),
    cmpid: emptyOrDefault(logininfo._company.id),
    cmpname: emptyOrDefault(logininfo._company.name),
    agentID: emptyOrDefault(logininfo._company.agentID),
    isAdmin: emptyOrDefault(logininfo._employees.isAdmin),
    avatar: emptyOrDefault(logininfo._employees.avatar),
    telNumber: emptyOrDefault(logininfo._employees.telNumber),
    token: emptyOrDefault(logininfo.token),
    menu: arrayemptyOrDefault(logininfo._menus),
    lossDays: emptyOrDefault(logininfo.lossDays)
}

const mutations = createMutations(state, true)

const actions = {
    async login({ commit }, userInfo) {
        removeAll();
        let data = {
            TelNumber: userInfo.telNumber,
            PassWord: userInfo.passWord,
            CompanyID: userInfo.companyID,
        };
        let res = await logins(data);
        let { token = "", _menus: menu = [], lossDays = 0,
            _employees: { id: empid = "", workEID = "", name = "", avatar = "", telNumber = "", isAdmin = 0 } = {},
            _company: { id: cmpid = "", name: cmpname = "", agentID = "" } = {},
            _cellWidths = []
        } = res.data
        commit('$all', { token, menu, empid, name, workEID, avatar, telNumber, cmpname, cmpid, agentID, isAdmin, lossDays })
        setUser(res.data)
        return Promise.resolve()
    },

    // logout({ commit, state, dispatch }) {
    //     if (state.prepareLogout) return Promise.reject();
    //     commit('prepareLogout', true)
    //     removeAll();
    //     return Promise.all([
    //         dispatch('removeUser'),
    //         tagsViewMutations.delAllTagAndCache()

    //     ])
    //         .then(() => window.location.reload())
    //         .finally(() => commit('prepareLogout', false))
    // },

    //刷新本地存储中保存的用户数据
    refresh({ state }) {
        setUser(state)
    },

    // token刷新
    async refreshtoken({ commit }) {
        let user = getUser(data);
        if (!user.token) return Promise.resolve(false);
        let { data } = await getnewtoken(user.token) || {};
        if (!data) return Promise.resolve(false);
        user.token = data;
        setUser(user);
        commit('token', data);
        return Promise.resolve(data)
    },

    removeUser({ commit }) {
        commit('$all', { menu: [] });
        setUser();
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}
