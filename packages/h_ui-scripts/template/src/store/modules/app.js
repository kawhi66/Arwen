import Cookies from 'js-cookie'
const app = {
  state: {
    lock: '',
    activeIndex: 0, // 当前激活根菜单
    sidebar: { // 是否展开菜单栏
      /* !+Cookies.get('sidebarStatus') 会将其他数字转换为false, 将数字0转换为true */
      opened: !+Cookies.get('sidebarStatus')
    },
    menusRoot: [], // 有多个子系统
    menusNoRoot: [], // 仅有一个系统[没有头部菜单],
    visitedViews: [{name: '首页', path: '/mainIndex'}], // 已打开视图,
    fullScreen: false

  },
  mutations: {
    FULLSCREEN: state => {
      state.fullScreen = true
    },
    UNFULLSCREEN: state => {
      state.fullScreen = false
    },
    LOCKSCREEN: state=> {
      state.lock = true
      Cookies.set('lock', true)
    },
    UNLOCKSCREEN: state => {
      state.lock = false
      Cookies.set('lock', false)
    },
    TOGGLE_SIDEBAR: state => {
      if (state.sidebar.opened) {
        Cookies.set('sidebarStatus', 1)
      } else {
        Cookies.set('sidebarStatus', 0)
      }
      state.sidebar.opened = !state.sidebar.opened
    },
    ACTIVE_ROOTINDEX: (state, index) => {
      state.activeIndex = index
    },
    SET_MENUS_ROOT: (state, data) => {
      state.menusRoot = data
    },
    SET_MENUS_NO_ROOT: (state, data) => {
      state.menusNoRoot = data
    },
    ADD_VISITED_VIEWS: (state, view) => {
      if (state.visitedViews.some(v => v.path === view.path)) return
      state.visitedViews.push({name: view.name, path: view.path})
    },
    DEL_CUR_VISITED_VIEWS: (state, view) => {
      let index
      /* entires返回一个迭代器，它返回数组的键/值对。 */
     /* for of循环功能相似，不同的是每次循环它提供的不是序号而是值。 */
      for (const [i, v] of state.visitedViews.entries()) {
        if (v.path === view.path) {
          index = i
          break
        }
      }
      state.visitedViews.splice(index, 1)
    },
    DEL_ALL_VISITED_VIEWS: (state, view) => {
      state.visitedViews = [{name: '首页', path: '/mainIndex'}]
    },
    DEL_OTHER_VISITED_VIEWS: (state, view) => {
      state.visitedViews = [{name: '首页', path: '/mainIndex'}, view]
    },
  },
  actions: {
    fullscreen: ({commit}) => {
      commit('FULLSCREEN')
    },
    unfullscreen: ({commit}) => {
      commit('UNFULLSCREEN')
    },
    lockscreen: ({commit}) => {
      commit('LOCKSCREEN')
    },
    unlockscreen: ({commit}) => {
      commit('UNLOCKSCREEN')
    },
    ToggleSidebar: ({commit}) => {
      commit('TOGGLE_SIDEBAR')
    },
    ActiveRootIndex ({commit}, data) {
      commit('ACTIVE_ROOTINDEX', data)
    },
    GenerateMenuByMenus ({commit}, data) {
      let menus = JSON.parse(window.sessionStorage.getItem('menus'))
      if (menus && menus.length > 0 && data && data.length > 0) {
        // menusType: '0' 无topMenu
        // menusType: '1' 有topMenu
        // 保证生成菜单与生成路由操作统一数据对象
        if (window.sessionStorage.getItem('menusType') == '1') {
          commit('SET_MENUS_ROOT', data)
        } else {
          commit('SET_MENUS_NO_ROOT', data)
        }
      } else {
        if (data && data.length > 0) {
          // menu.parentCode === 'BIZFRAME //头部根路径
          let newMenu = data.filter(menu => { return !menu.hidden && menu.parentId == window.LOCAL_CONFIG.MENUS_ROOT_NAME })
          // window.sessionStorage.setItem('menus', JSON.stringify(newMenu))
          if (newMenu.length > 0) {
            window.sessionStorage.setItem('menus', JSON.stringify(newMenu))
            window.sessionStorage.setItem('menusType', '1')
            commit('SET_MENUS_ROOT', newMenu)
          } else {
            window.sessionStorage.setItem('menusType', '0')
            // commit('SET_MENUS_NO_ROOT', newMenu)
            window.sessionStorage.setItem('menus', JSON.stringify(data))
            commit('SET_MENUS_NO_ROOT', data)
          }
        }
      }
    },
    addVisitedViews: ({commit}, view) => {
      commit('ADD_VISITED_VIEWS', view)
    },
    delCurVisitedViews: ({commit}, view) => {
      commit('DEL_CUR_VISITED_VIEWS', view)
    },
    delAllVisitedViews: ({commit}, view) => {
      commit('DEL_ALL_VISITED_VIEWS', view)
    },
    delOtherVisitedViews: ({commit}, view) => {
      commit('DEL_OTHER_VISITED_VIEWS', view)
    },
  }
}
export default app