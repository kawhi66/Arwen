import fetch from './httpFetch.js'
import Cookies from 'js-cookie'
export function reLogin (username, password) {
  let data = {
      username,
      password
    }
  return fetch.get('/reLogin', data)
}
export function login (username, password, checkcode) {
  let data = {
      username,
      password,
      checkcode,
    }
  return fetch.get('/login')
}
function  convertTreeData(rows, attributes) {
  var keyNodes = {}, parentKeyNodes = {};
  for (var i = 0; i < rows.length; i++) {
    var row = rows[i];
    row.id = row[attributes.id];
    row.parentId = row[attributes.parentId];
    row.title = row[attributes.title] ? row[attributes.title] : null
    row.url  = row[attributes.url] ? row[attributes.url]: null
    row.icon = row[attributes.icon]? row[attributes.url]: null
    row.children = [];

    keyNodes[row.id] = row;

    if (parentKeyNodes[row.parentId]) { parentKeyNodes[row.parentId].push(row); }
    else { parentKeyNodes[row.parentId] = [row]; }

    var children = parentKeyNodes[row.id];
    if (children) { row.children = children; }

    var pNode = keyNodes[row.parentId];
    if (pNode) { pNode.children.push(row); }
  }
  return parentKeyNodes[attributes.rootParentId];
}

export function getMenuList(token) {
  // return fetch.get("/getMenuList")
  return new Promise((resolve, reject) => {
    fetch.get('/getMenuListSimp').then(res => {
      if (res && res.data.length >0) {
        const data = convertTreeData(res.data, {
          id: 'menu_id',
          title: 'menu_name',
          parentId:'menu_parent_id',
          icon: 'menu_icon',
          url: 'menu_url',
          rootParentId: 'BIZFRAME'
        })
        resolve({'data': data})
      }
    })
  })
}

export function changePwd(oldPwd, newPwd) {
  let sessionId = Cookies.get('Admin-Token')
  return new Promise((resolve, reject) => {
    getKeys().then(res => {
      key1 = res.data.key1
      key2 = res.data.key2
      key3 = res.data.key3
      oldPwd = BizSecurity.DES.encrypt(oldPwd, key1, key2, key3)
      newPwd = BizSecurity.DES.encrypt(newPwd, key1, key2, key3)
      const data = {
        oldPwd,
        newPwd
      }
      resolve(fetch.post('/changePwd.json'))
    })
  })
}

export function logout() {
  return fetch.get("/logout")
}