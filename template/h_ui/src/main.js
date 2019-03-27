// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import hui from 'h_ui/dist/h_ui.min.js'
import 'h_ui/dist/h_ui.min.css'
import './style/main.scss'// 开发theme时修改main.scss中引入的custom.scss

import hCharts from 'h_charts'
import {getMenuList} from './api/login.js'

Vue.prototype.LOCAL_CONFIG = window.LOCAL_CONFIG

Vue.config.productionTip = false

Vue.use(hui)
Vue.use(hCharts)
const whiteList = ['/login']

Vue.config.debug = true
// permissiom judge
function hasPermission(roles, permissionRoles) {
  if (roles.indexOf('admin') >= 0) return true; // admin权限 直接通过
  if (!permissionRoles) return true;
  return roles.some(role => permissionRoles.indexOf(role) >= 0)
}
/* 页面刷新前进行权限校验 */
router.beforeEach((to, from, next) => {
/* 开启页面加载进度提示 */
  hui.hLoadingBar.start()
  if (store.getters.roles.length === 0) { // 判断当前用户是否已拉取完user_info信息
    store.dispatch('GetInfo').then(res => { // 拉取user_info
      const roles =['admin'];
      store.dispatch('GenerateRoutes', { roles }).then(() => { // 生成可访问的路由表
        router.addRoutes(store.getters.addRouters) // 动态添加可访问路由表
        next({ ...to }); // hack方法 确保addRoutes已完成
      })
    })
  } else {
    // 没有动态改变权限的需求可直接next() 删除下方权限判断 
    if (hasPermission(store.getters.roles, to.meta.role)) {
      next();//
    } else {
      next({ path: '/401', query: { noGoBack: true } });
    }
    // 可删 ↑
  }
  // if (store.getters.token) { //有token，证明已登录
  //   if (to.path === '/login') {
  //     next({path: '/'}) 
  //   } else {
  //     if (store.getters.roles.length === 0) { // 判断当前用户是否已拉取完user_info信息
  //       store.dispatch('GetInfo').then(res => { // 拉取user_info
  //         const roles =['admin'];
  //         store.dispatch('GenerateRoutes', { roles }).then(() => { // 生成可访问的路由表
  //           router.addRoutes(store.getters.addRouters) // 动态添加可访问路由表
  //           next({ ...to }); // hack方法 确保addRoutes已完成
  //         })
  //       })
  //     } else {
  //       // 没有动态改变权限的需求可直接next() 删除下方权限判断 
  //       if (hasPermission(store.getters.roles, to.meta.role)) {
  //         next();//
  //       } else {
  //         next({ path: '/401', query: { noGoBack: true } });
  //       }
  //       // 可删 ↑
  //     }
  //   }
  // } else {
  //   if (whiteList.indexOf(to.path) !== -1) {
  //     next()
  //   } else {
  //     next('./login')
  //     hui.hLoadingBar.finish()
  //   }
  // } 
})
router.afterEach(() => {
  hui.hLoadingBar.finish()
})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
