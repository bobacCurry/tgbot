const schedule = require('node-schedule')

const db_admin_index = require('../../../model/admin/index')

const API = require('../api')

module.exports = {

	index: async (req, res, next) =>{

		try{

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

			const chat_info = await API.getChat(token, { chat_id: group })

			console.log(chat_info)

			return res.send('true')

			const minute = text_arr[2]

			if(!minute||isNaN(minute)){

				return res.send('true')
			}

			const { message_id, chat } = message.reply_to_message

			await db_admin_index.create({ chat_id: group, from_chat_id: chat.id, message_id, minute })

			await API.sendMessage(token, { chat_id: chat.id, text: '自动广告已添加' })

			// await API.forwardMessage(token, { chat_id: group, from_chat_id: chat.id, message_id })

			return res.send('true')

		}catch(e){

			console.log(e)

			return res.send('true')
		}
	}
}