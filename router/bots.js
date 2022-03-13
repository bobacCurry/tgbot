const express = require('express')

const router = express.Router()

const bots = require('../controller/bots/hh/index.js')

router.post('/hh/:token', bots.index)

module.exports = router