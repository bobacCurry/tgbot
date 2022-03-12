const express = require('express')

const router = express.Router()

const bots = require('../controller/bots/hh_static/index.js')

router.post('/hh_static/:token', bots.index)

module.exports = router