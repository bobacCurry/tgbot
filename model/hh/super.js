const mongoose = require('../db.js')

const Schema = mongoose.Schema

const Super = new Schema({

	//username
	username: { type: String, required: true, index: true },

	//管理员过期时间
	expire: { type: Number, default: 0 },

	created_at: { type: Date },

  	updated_at: { type: Date }
},
{
	versionKey: false, timestamps: { createdAt:'created_at',updatedAt:'updated_at' }

})

module.exports = mongoose.model('hh_super', Super,'hh_super')