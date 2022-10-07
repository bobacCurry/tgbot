const express = require('express')

const router = express.Router()

const hh = require('../controller/bots/hh/index.js')

const admin = require('../controller/bots/hh/index.js')

router.post('/hh/:token', hh.index)

router.post('/admin/:token', admin.index)

module.exports = router