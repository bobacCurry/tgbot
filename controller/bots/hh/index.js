const axios = require('axios')

const ROLELIST = ['owner','admin','operator']

const CURRENTS = { 'RMB': '人民币','USDT': 'USDT','USD': '美元','PHP': '披索','MYR': '马币','THB': '泰铢' }

const isCommand  = async (text,command) => {

	if (!text||!text.trim()||!command||!command.trim()) {

		return false
	}

	const position =  text.indexOf(command)

	if (position===0) {

		return true
	}

	return false
}

const isOut = async (text) => {

	if (isNaN(text)||Number(text)>0) {

		return false

	}

	return true
}

const isIn = async (text) => {

	if (isNaN(text)||Number(text)<0) {

		return false

	}

	return true
}

const setAdmin = async (from,chat,text) => {

	console.log(from,chat,text)
}

const delAdmin = async (from,chat,text) => {

	console.log(from,chat,text)
}

const setOperator = async (from,chat,text) => {
	
	console.log(from,chat,text)	
}

const delOperator = async (from,chat,text) => {

	console.log(from,chat,text)
}

const setRate = async (from,chat,text) => {

	console.log(from,chat,text)	
}

const setCharge = async (from,chat,text) => {

	console.log(from,chat,text)	
}

const setOut = async (from,chat,text) => {

	console.log(from,chat,text)
}

const setIn = async (from,chat,text) => {

	console.log(from,chat,text)
}

module.exports = {
	
	index: async (req, res, next) =>{

		const token = req.params.token

		const { update_id, message: { message_id, from, chat, text } } = req.body

		if (isCommand(text,'set_admin')) {

			await setAdmin(from,chat,text)
		}

		if (isCommand(text,'del_admin')) {

			await delAdmin(from,chat,text)
		}

		if (isCommand(text,'set_operator')) {

			await setOperator(from,chat,text)
		}

		if (isCommand(text,'del_operator')) {

			await delOperator(from,chat,text)
		}

		if (isCommand(text,'set_rate')) {

			await setRate(from,chat,text)
		}

		if (isCommand(text,'set_charge')) {

			await setCharge(from,chat,text)
		}

		if (isOut(text)) {

			await setOut(from,chat,text)
		}

		if (isIn(text)) {

			await setIn(from,chat,text)
		}

		return res.send('true')
	}
}