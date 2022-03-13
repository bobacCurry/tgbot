const mongoose = require('../db.js')

const Schema = mongoose.Schema

const User = new Schema({

	uid: { type: Number, default: 0 },

	gid: { type: Number, default: 0 },

	//role 0 无效 1 操作员 2 管理员 3 拥有人

	role: { type: Number, default: 0 },

	//author 授权人

	author: { type: Number, default: 0 },

	//type 群类型

	type: { type: String, default: '' },

	expire:: { type: Number, default: 0 },

	created_at: { type: Date },

  	updated_at: { type: Date }
},
{

	versionKey: false, timestamps: { createdAt:'created_at',updatedAt:'updated_at' }

})

module.exports = mongoose.model('hh_user', User,'hh_user')