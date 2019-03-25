import fetch from '@/api/httpFetch.js'
export function getDict(pageinfo, form) {
  Object.assign(pageinfo, form)
  return fetch.get("/getDictList", { params: pageinfo })
}
export function addDict(form) {
  return fetch.post("/bizframe/dict/doAdd.json", form)
}
export function updateDict(form) {
  return fetch.post("/bizframe/dict/doModify.json", form)
}
export function delDict(id) {
  return fetch.post("/bizframe/bizframe/dict/remove.json", { id })
}

