const compression = require('compression')
const express = require('express')
const app = express()

app.use(compression())
app.use(express.static(process.env.ARWEN_DEPLOY_PATH))

app.listen(process.env.ARWEN_DEPLOY_PORT)
