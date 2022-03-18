const mongoose = require('../db.js')

const Schema = mongoose.Schema

const Admin = new Schema({

	cid: { type: Number, required: true, index: true },

	name: { type: String, default: '', index: true },

	super: { type: Schema.Types.ObjectId, ref: 'hh_super', required: true },

	created_at: { type: Date },

  	updated_at: { type: Date }
},
{
	versionKey: false, timestamps: { createdAt:'created_at',updatedAt:'updated_at' }

})

module.exports = mongoose.model('hh_admin', Admin,'hh_admin')