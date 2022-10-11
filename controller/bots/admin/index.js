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

		const { message_id, chat } = message.reply_to_message

		try{

			const text_arr = message.text.split(' ')

			const command = text_arr[0]

			if(!command||(command.indexOf('/add_group')===-1)){

				return res.send('true')
			}

			const group = text_arr[1]

			if(!group||(group.indexOf('@')===-1)){

				return res.send('true')
			}

			await API.getChat(token, { chat_id: group })

			const minute = text_arr[2]

			if(isNaN(minute)){

				return res.send('true')
			}

			const exies = await db_admin_index.findOne({ chat_id: group })

			if(exies){

				await db_admin_index.updateOne({ chat_id: group }, { from_chat_id: chat.id, message_id, minute })

			}else{

				await db_admin_index.create({ token, chat_id: group, from_chat_id: chat.id, message_id, minute })
			}

			await API.sendMessage(token, { chat_id: chat.id, text: '✅自动广告已更新' })

			return res.send('true')

		}catch({ response }){

			if(response.data&&(response.data.error_code==400)){

				await API.sendMessage(token, { chat_id: chat.id, text: '❌转发群组不存在' })
			}

			return res.send('true')
		}
	}
}