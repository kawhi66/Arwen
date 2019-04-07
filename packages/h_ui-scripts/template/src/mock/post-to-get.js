module.exports = function (req, res, next) {
  req.method = 'GET'
  console.log('///////////')
  console.log(req)
  next()
}
