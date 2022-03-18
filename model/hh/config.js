const mongoose = require('../db.js')

const Schema = mongoose.Schema

const Config = new Schema({

	cid: { type: Number, required: true, index: true },

	charge: { type: Number, default: 0 },

	rate_usdt: { type: Number, default: 0 },

	rate_usd: { type: Number, default: 0 },

	rate_php: { type: Number, default: 0 },

	rate_myr: { type: Number, default: 0 },

	rate_thb: { type: Number, default: 0 },

	created_at: { type: Date },

  	updated_at: { type: Date } 
},
{

	versionKey: false, timestamps: { createdAt:'created_at',updatedAt:'updated_at' }

})

module.exports = mongoose.model('hh_config', Config,'hh_config')