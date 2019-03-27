const getters = {
  token: state => state.user.token,
  optAuths: state => state.user.optAuths,
  permission_routers: state => state.permission.routers,
  addRouters: state => state.permission.addRouters,
  searchRoute: state => state.permission.searchRoute,
  lock: state => state.app.lock,
  sidebar: state => state.app.sidebar,
  activeIndex: state => state.app.activeIndex,
  menusRoot: state => state.app.menusRoot, //有多个子系统
  menusNoRoot: state => state.app.menusNoRoot,
  visitedViews: state => state.app.visitedViews,
  roles: state => state.user.roles,
  fullScreen: state => state.app.fullScreen
}
export default getters