const mongoose = require('../db.js')

const Schema = mongoose.Schema

const Index = new Schema({

	username: { type: String, default: '' },

	chatname: { type: String, require: true, index: true },

	message_id: { type: String, default: '' },

	created_at: { type: Date },

  	updated_at: { type: Date }
},
{
	versionKey: false, timestamps: { createdAt:'created_at',updatedAt:'updated_at' }

})

module.exports = mongoose.model('admin_index', Index,'admin_index')