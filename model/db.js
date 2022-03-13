const mongoose = require('mongoose')

const config = require('../config.js')

const username = config.env.dbusername

const password = config.env.dbpassword

const dbport = config.env.dbport

const dbhost = config.env.dbhost

const dbname = config.env.dbname

let url = `mongodb://${dbhost}:${dbport}/${dbname}`

let opt = {
  	useNewUrlParser: true,
  	useCreateIndex: true,
  	useFindAndModify:false,
   	useUnifiedTopology: true
}

if (username) {
	
	url = `mongodb://${username}:${password}@${dbhost}:${dbport}/${dbname}`

	opt = {
		auth:{
			authSource:"admin"
		},
	  	useNewUrlParser: true,
	  	useCreateIndex: true,
	  	useFindAndModify:false,
	   	useUnifiedTopology: true
	}
}

/**
 * 连接
 */

const DB_URL = mongoose.connect(url, opt)

/**
 * 连接成功
 */
mongoose.connection.on('connected', function() {
  	console.log('Mongoose connection open to ' + DB_URL)
})

/**
 * 连接异常
 */
mongoose.connection.on('error', function(err) {
  	console.log('Mongoose connection error: ' + err)
})

/**
 * 连接断开
 */
mongoose.connection.on('disconnected', function() {
  	console.log('Mongoose connection disconnected')
})

module.exports = mongoose
