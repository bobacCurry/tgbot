const schedule = require('node-schedule')

const db_admin_index = require('../../../model/admin/index')

module.exports = {

	index: async (req, res, next) =>{

		const token = req.params.token

		const { message } = req.body

		if(!message.reply_to_message){

			return res.send('true')
		}

		if(!message.text){

			return res.send('true')
		}

		console.log(message.reply_to_message,message.text)

		return res.send('true')
	}
}