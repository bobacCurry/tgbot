const mongoose = require('../db.js')

const moment = require('moment')

const Schema = mongoose.Schema

const Water = new Schema({

	cid: { type: Number, required: true, index: true },

	uid: { type: Number, required: true, index: true },

	name: { type: String, required: true },

	charge: { type: Number, default: 0 },

	rate: { type: Number, default: 0 },

	currency: { type: String, default: '' },

	money: { type: Number, default: 0 },
	//in or out
	io: { type: String, required: true, index: true },

	created_at: { type: Date, default: moment().format('YYYY-MM-DD HH:mm:ss') },

  	updated_at: { type: Date, default: moment().format('YYYY-MM-DD HH:mm:ss') } 
},
{

	versionKey: false

})

module.exports = mongoose.model('hh_water', Water,'hh_water')