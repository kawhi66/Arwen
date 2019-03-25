module.exports = function (file) {
  return  resolve => require(['@/views/bizViews/' + file + '.vue'], resolve)
}