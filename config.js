const fs = require('fs')

let env = fs.readFileSync('./.env', 'utf-8') // 环境配置

env = JSON.parse(env)

let botUrl = "https://api.telegram.org/bot"

module.exports = { env, botUrl }