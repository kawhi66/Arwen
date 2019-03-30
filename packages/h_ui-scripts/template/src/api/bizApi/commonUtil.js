import fetch from '../httpFetch.js'
/**
 * 获取组织树
 */
export function getOrgTree() {
    return fetch.get("/bizframe/selector/orgTree.json")
}

/**
 * 根据类型获取类别树
 *  0 : 数据字典
 *  1 : 系统参数
 *  2 : 标准字段
 *  3 : 系统资源
 *  4 : 系统菜单
 *  5 : 子系统
 */
export function getKindTree(kindType) {
    // return fetch.get("/bizframe/selector/kindTree.json?kindType="+kindType)
     return fetch.get("/getKindTree")
}

/**
 * 获取类别所有树
 */
export function getAllKindTree() {
    return fetch.get("/bizframe/selector/allKindTree.json")
}
  
/**
 * 获取数据字典
 * @param {字典名} dictName 
 */

export function getDicts(dictName) {
    return fetch.get("/bizframe/dict/getDicts.json?dictName=" + dictName)
}

/**
 * post方式发送请求方法
 * @param {*参数} params 
 * @param {*请求url} url 
 */
export function post(params,url) {
    return fetch.post(url, params)
}
/**
 * get方式发送请求方法
 * @param {*参数} params 
 * @param {*请求url} url 
 */
export function get(params,url) {
    return fetch.get(url, {params})
}
/**
 *  获取权限列表
 */
export function getPermissionMenuTree () {
  return fetch.get("/bizframe/permissionList.json")
}
/**
 *  提交权限列表
 * @param {*参数} data 
 */
export function submitPermission (data) {
  return fetch.post("/bizframe/permissionList.json", data)
}