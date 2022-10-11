const mongoose = require('../db.js')

const Schema = mongoose.Schema

const Index = new Schema({

	token: { type: String, require: true, index: true },

	from_chat_id: { type: String, require: true, index: true },

	chat_id: { type: String, require: true, index: true },

	message_id: { type: String, default: '' },

	minute: { type: Number, default: 0 },

	nexttime: { type: Number, default: 0 },

	created_at: { type: Date },

  	updated_at: { type: Date }
},
{
	versionKey: false, timestamps: { createdAt:'created_at',updatedAt:'updated_at' }

})

module.exports = mongoose.model('admin_index', Index,'admin_index')