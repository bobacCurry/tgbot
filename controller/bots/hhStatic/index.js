const axios = require('axios')

const ROLELIST = ['admin','','']

module.exports = {
	
	index: async (req, res, next) =>{

		const token = req.params.token

		const { update_id, message: { message_id, from, chat, text, entities } } = req.body

		console.log(message_id, from, chat, text, entities)

		return res.send('true')
	}
}