const mongoose = require('../db.js')

const Schema = mongoose.Schema

const User = new Schema({

	//userid
	uid: { type: Number, default: 0 },

	//chatid
	cid: { type: Number, default: 0 },

	//role 0 无效 1 操作员 2 管理员
	role: { type: Number, default: 0 },

	//author 授权人
	author: { type: Number, default: 0 },

	//type 群类型
	type: { type: String, default: '' },

	//管理员过期时间
	expire: { type: Number, default: 0 },

	//是否通过
	pass: { type: Boolean, default: false },

	created_at: { type: Date },

  	updated_at: { type: Date }
},
{

	versionKey: false, timestamps: { createdAt:'created_at',updatedAt:'updated_at' }

})

module.exports = mongoose.model('hh_user', User,'hh_user')