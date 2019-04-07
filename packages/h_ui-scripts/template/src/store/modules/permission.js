import {asyncRouterMap, constantRouterMap} from '@/router'
import Layout from '@/views/frame/Layout.vue'
import MainIndex from '@/views/mainIndex.vue'

const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: [],
    searchRoute: []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.routers = [...constantRouterMap.concat(routers)]
      state.addRouters = [...routers]
    },
    SEARCH_ROUTE: (state, data) => {
      state.searchRoute = data
    }
  },
  actions: {
    // 根据服务端菜单生成路由
    GenerateRoutes ({commit}, data) {
      return new Promise(resolve => {
        const { roles } = data
        let accessedRouters
        if (roles.indexOf('admin') >= 0) {
          accessedRouters = asyncRouterMap
        } else {
          accessedRouters = filterAsyncRouter(asyncRouterMap, roles)
        }
        commit('SET_ROUTERS', accessedRouters);
        resolve();
      })
    }
  }
}
export default permission
function hasPermission(roles, route) {
  if (route.meta && route.meta.role) {
    return roles.some(role => route.meta.role.indexOf(role) >= 0)
  } else {
    return true
  }
}
function filterAsyncRouter(asyncRouterMap, roles) {
  const accessedRouters = asyncRouterMap.filter(route => {
    if (hasPermission(roles, route)) {
      if (route.children && route.children.length) {
        route.children = filterAsyncRouter(route.children, roles)
      }
      return true
    }
    return false
  })
  return accessedRouters
}
