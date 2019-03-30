import axios from 'axios'
import config from './config'
import store from '../store'
import router from '../router'
import hui from 'h_ui/dist/h_ui.min.js'
import Cookies from 'js-cookie'
const httpFetch = axios.create(config)
// request拦截器
httpFetch.interceptors.request.use(config => {
  return config
}, error => {
  //console.log(error)
  Promise.reject(error)
})
httpFetch.interceptors.response.use(response => {
  // ie中res.data返回为string类型，chorme为obj类型
  if (response.data && typeof response.data == 'string') {
    response.data = JSON.parse(response.data)
  } 
  if (response.data && (response.data[window.LOCAL_CONFIG.RIGHT_KEY] == -1 || response.data[window.LOCAL_CONFIG.RIGHT_KEY] == -2 ||response.data[window.LOCAL_CONFIG.RIGHT_KEY] == -3)  || !response) {
    let text = ''
    if (document.getElementsByTagName('html')[0].className == '') {
      document.getElementsByTagName('html')[0].className = 'theme-default'
    }
    if (response.data[window.LOCAL_CONFIG.RIGHT_KEY] == -1) {
      text = '对不起,您缺少访问权限'
    } else if (response.data[window.LOCAL_CONFIG.RIGHT_KEY] == -2) {
      text = '页面已经失效,请先登录'
    } else {
      text = '当前服务端登录验证出错,请重新登录'
    }
    hui.hMsgBox.confirm({
      title: "确认登录",
      content: text,
      onOk: () => {
        store.dispatch('Logout').then(() => {
          // router.push({ path: '/login' })
          location.reload()
        })
      },
      onCancle: () => {
      }
    })
    if (response.data && response.data[window.LOCAL_CONFIG.RIGHT_KEY] == -5) {
      //锁屏状态，不能请求
      hui.hMessag.info('请解锁！')
      store.dispatch('lockscreen')
      return
    }
  } else {
    return response
  }
}, error => {
  //.log(error)
  Promise.reject(error)
})

export default httpFetch
