const schedule = require('node-schedule')

const db_admin_index = require('../../../model/admin/index')

const API = require('../api')

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

		const text_arr = message.text.split(' ')

		const command = text_arr[0]

		if(!command||(command.indexOf('/add_group')===-1)){

			return res.send('true')
		}

		const group = text_arr[1]

		if(!group||(group.indexOf('@')===-1)){

			return res.send('true')
		}

		const minute = text_arr[2]

		if(!minute||isNaN(minute)){

			return res.send('true')
		}

		const { message_id, chat } = message.reply_to_message,message

		console.log(command,group,minute,message_id,chat)

		await API.forwardMessage(token, { chat_id: group, from_chat_id: chat.id, message_id })

		return res.send('true')
	}
}