const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const http = require('http')
const app = express()
const httpServer = http.Server(app)
const router = require('./router')
const log = require('./middleware/errorLog')
const PORT = 6666

const config = require('./config.js')

app.use('/static', express.static(path.join(__dirname, 'static')))

app.use(bodyParser.json({ limit: '10mb' }))

app.use(bodyParser.urlencoded({ extended: true,limit: '10mb' }))

router(app)

app.use(log)

app.all('*', (req, res) => {

  	return res.status(404).send({ code: 0,msg: '未找到匹配的路由' })

})

// 创建http服务器

httpServer.listen(PORT, () => {

  	console.log('HTTP Server is running on: http', PORT)

})