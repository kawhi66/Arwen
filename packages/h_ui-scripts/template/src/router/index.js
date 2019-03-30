import Vue from 'vue'
import Router from 'vue-router'
const _import = require('./_import_' + process.env.NODE_ENV);
import Login from '@/views/login'
import MainIndex from '@/views/mainIndex'
import Layout from '@/views/frame/Layout.vue'
/* biz */
const Bizsetdict = _import('bizMenu/bizSysManager/bizSetDict');
const Demo1 = _import('bizMenu/bizSysManager/demo1');
const Demo2 = _import('bizMenu/bizSysManager/demo2');

/* dashboard */
const Analysis = _import('dashboard/analysis');
const Monitor = _import('dashboard/monitor');
const Workplace = _import('dashboard/workplace');
/* form */
const BasicForm = _import('form/basicForm');
const stepForm = _import('form/stepForm');
const AdvancedForm = _import('form/advancedForm');
/* list */
const TableList = _import('list/tablelist');
const BasicList = _import('list/basiclist');
const CardList = _import('list/cardlist');
const Articles = _import('list/articles');
const Projects = _import('list/projects');
const Application = _import('list/application');
/* result */
const Basic = _import('profile/basic');
const Advanced = _import('profile/advanced');
/* result */
const Success = _import('result/success');
const Fail = _import('result/fail');
/* error page */
const Err403 = _import('error/403');
const Err404 = _import('error/404');
const Err500 = _import('error/500');
const BigDataSelect = _import('demo/bigDataSelect');
const BigDataTable = _import('demo/bigDataTable');
const TableSearch = _import('demo/tableSearch');
const TableSelect = _import('demo/tableSelect');
Vue.use(Router)

/* 路由模板 */
const rout = {
  template: '<router-view></router-view>'
}
/* 常量路由 */
export const constantRouterMap = [
  {
    path: '/login',
    component: Login,
    hidden: true
  },
  { 
    path: '/',
    name: '首页',
    redirect: '/MainIndex',
    component: Layout,
    hidden: true,
    children: [
      {path: 'mainIndex', component: MainIndex, name: '首页 '}
    ]
  },
  
]

/* 异步路由 */
export const asyncRouterMap = [
  {
    path: '/bizMenu',
    redirect: '/bizMenu/bizSysManager',
    component: Layout,
    name: 'bizMenu',
    icon: 'android-wifi',
    children: [
      {path: 'bizSetDict', component: Bizsetdict, name: 'bizSetDict '},
      {path: 'demo1', component: Demo1, name: 'demo1 '},
      {path: 'demo2', component: Demo2, name: 'demo2 '},
    ]
  },
  {
    path: '/dashboard',
    redirect: '/dashboard/analysis',
    component: Layout,
    name: 'dashboard',
    icon: 'android-wifi',
    children: [
      {path: 'analysis', component: Analysis, name: '分析页 '},
      {path: 'monitor', component: Monitor, name: '监控页 '},
      {path: 'workplace', component: Workplace, name: '工作台 '},
    ]
  },
  {
    path: '/form',
    redirect: '/form/basic-form',
    component: Layout,
    icon: 'activity',
    name: '表单页',
    children: [
      {path: 'basic-form', component: BasicForm, name: '基础表单 '},
      {path: 'step-form', component: stepForm, name: '分步表单 '},
      {path: 'advanced-form', component: AdvancedForm, name: '高级表单 '},
    ]
  },
  {
    path: '/list',
    redirect: '/list/table-list',
    component: Layout,
    icon: 'createtask',
    name: '列表页',
    children: [
      {path: 'table-list', component: TableList, name: '查询表格 '},
      {path: 'basic-list', component: BasicList, name: '标准列表 '},
      {path: 'card-list', component: CardList, name: '卡片列表 '},
      {path: 'search', component: rout, name: '搜索列表 ',children: [
        {path: 'articles', component: Articles, name: '搜索列表(文章)'},
        {path: 'projects', component: Projects, name: '搜索列表(项目)'},
        {path: 'application', component: Application, name: '搜索列表(应用)'},
      ]}
    ]
  },
  {
    path: '/profile',
    redirect: '/profile/basic',
    component: Layout,
    name: '详情页',
    icon: 'compose',
    children: [
      {path: 'basic', component: Basic, name: '基础详情页'},
      // {path: 'advanced', component: Advanced, name: '高级详情页 '}
    ]
  },
  {
    path: '/demo',
    redirect: '/demo/bigDataSelect',
    component: Layout,
    name: '典型业务场景',
    icon: 'checkmark-circled',
    children: [
      {path: 'bigDataSelect', component: BigDataSelect, name: '下拉控件大数据情况'},
      {path: 'bigDataTable', component: BigDataTable, name: '表格没有分页且数据情况'},
      {path: 'tableSelect', component: TableSelect, name: '自定义表格列表'},
      {path: 'tableSearch', component: TableSearch, name: '自定义表格分类查询'}
    ]
  },
  {
    path: '/result',
    redirect: '/result/success',
    component: Layout,
    name: '结果页',
    icon: 'checkmark-circled',
    children: [
      {path: 'success', component: Success, name: '成功'},
      {path: 'fail', component: Fail, name: '失败'}
    ]
  },
  {
    path: '/exception',
    redirect: '/exception/403',
    component: Layout,
    icon: 'warning',
    name: '异常页',
    children: [
      {path: '403', component: Err403, name: '403'},
      {path: '404', component: Err404, name: '404'},
      {path: '500', component: Err500, name: '500'}
    ]
  },
]

const router = new Router({
  // mode: 'history',
  scrollBehavior: () => ({y: 0}),
  routes: constantRouterMap
})

export default router
