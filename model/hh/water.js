const mongoose = require('../db.js')

const Schema = mongoose.Schema

const Water = new Schema({

	gid: { type: Number, default: 0 },

	uid: { type: Number, default: 0 },

	charge: { type: Number, default: 0 },

	rate: { type: Number, default: 0 },

	current: { type: String, default: '' },

	in: { type: Number, default: 0 },

	out: { type: Number, default: 0 },

	created_at: { type: Date },

  	updated_at: { type: Date } 
},
{

	versionKey: false, timestamps: { createdAt:'created_at',updatedAt:'updated_at' }

})

module.exports = mongoose.model('hh_water', Water,'hh_water')