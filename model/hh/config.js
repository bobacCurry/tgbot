const mongoose = require('../db.js')

const Schema = mongoose.Schema

const moment = require('moment')

const Config = new Schema({

	cid: { type: Number, required: true, index: true },

	charge: { type: Number, default: 0 },

	rate_CNY: { type: Number, default: 1 },

	rate_USDT: { type: Number, default: 0 },

	rate_USD: { type: Number, default: 0 },

	rate_PHP: { type: Number, default: 0 },

	rate_MYR: { type: Number, default: 0 },

	rate_THB: { type: Number, default: 0 },

	created_at: { type: Date, default: moment().add(8, 'hours').format('YYYY-MM-DD HH:mm:ss') },

  	updated_at: { type: Date, default: moment().add(8, 'hours').format('YYYY-MM-DD HH:mm:ss') } 
},
{

	versionKey: false

})

module.exports = mongoose.model('hh_config', Config,'hh_config')