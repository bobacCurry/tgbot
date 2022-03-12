const express = require('express')

const router = express.Router()

const bots = require('../controller/bots/hhStatic/index.js')

router.post('/hhStatic/:token', bots.index)

module.exports = router