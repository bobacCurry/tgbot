const mongoose = require('../db.js')

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

	created_at: { type: Date },

  	updated_at: { type: Date } 
},
{

	versionKey: false, timestamps: { createdAt:'created_at',updatedAt:'updated_at' }

})

module.exports = mongoose.model('hh_water', Water,'hh_water')