const express = require('express')

const router = express.Router()

const bots = require('../controller/bots/index.js')

router.post('/:token', bots.index)

module.exports = router