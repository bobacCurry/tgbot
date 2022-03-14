const db_hh_config = require('../../../model/hh/config')

const db_hh_water = require('../../../model/hh/water')

const db_hh_user = require('../../../model/hh/user')

const { botUrl, env: { ownerId } } = require('../../../config')

const axios = require('axios')

const API = require('../api')

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

const start = async (token,message_id,from,chat,text) => {

	const { id: uid, is_bot } = from

	const { id: cid, type } = chat

	const r_text = `
		换汇统计命令：\n
		1.申请成为管理员：发送 <u>申请管理员</u>\n
		2.申请成为操作员：发送 <u>申请操作员</u>\n
		3.获取操作员申请：发送 <u>操作员申请</u>\n
		4.获取操作员列表：发送 <u>操作员列表</u>\n
		5.设置费率：发送 <u>设置费率 X.XX</u> (例：设置费率 0.05)\n
		6.设置汇率：发送 <u>设置汇率 币种X 汇率Y</u> (例：设置汇率 PHP 7.8)\n
		
		汇率 = 1RMB可以兑换的其他币种的值\n

		支持币种：人民币(RMB)、美元(USD)、披索(PHP)、马币(MYR)、泰铢(THB)、USDT(USDT)\n

		7.记录下发：发送 <u>下发 XXX Y币种</u>(默认为人民币) 或者 <u>-XXX Y币种</u>(默认为人民币)\n

		8.记录回款：发送 <u>回款 XXX Y币种</u>(默认为人民币) 或者 <u>+XXX Y币种</u>(默认为人民币)\n
	`

	await API.sendMessage(token, { chat_id: cid, parse_mode: 'HTML', text: r_text })

	return true
}

const applyAdmin = async (token,message_id,from,chat,text) => {

	const { id: uid, is_bot } = from

	if (is_bot) {

		return false
	}
}

const getApplyAdmin = async (token,message_id,from,chat,text) => {

	console.log(from,chat,text,1)
}

const setAdmin = async (token,message_id,from,chat,text) => {

	const { id: uid, is_bot } = from

	if (is_bot) {

		return false
	}

	if (id!==ownerId) {

	}

	return true
}

const delAdmin = async (token,message_id,from,chat,text) => {

	console.log(from,chat,text,2)
}

const applyOperator = async (token,message_id,from,chat,text) => {
	

	const { id: uid, is_bot } = from

	if (is_bot) {

		return false
	}

	return
}

const getApplyOperator = async (token,message_id,from,chat,text) => {
	
	console.log(from,chat,text,3)	
}

const setOperator = async (token,message_id,from,chat,text) => {
	
	const { id: uid, is_bot } = from

	const { id: cid, type } = chat

}

const delOperator = async (token,message_id,from,chat,text) => {

	console.log(from,chat,text,4)
}

const setRate = async (token,message_id,from,chat,text) => {

	console.log(from,chat,text,5)	
}

const setCharge = async (token,message_id,from,chat,text) => {

	console.log(from,chat,text,6)
}

const setOut = async (token,message_id,from,chat,text) => {

	console.log(from,chat,text,7)
}

const setIn = async (token,message_id,from,chat,text) => {

	console.log(from,chat,text,8)
}

module.exports = {
	
	index: async (req, res, next) =>{

		const token = req.params.token

		const { update_id, message: { message_id, from, chat, text, entities } } = req.body

		console.log(req.body)

		if (await isCommand(text,'/start')) {

			await start(token,message_id,from,chat,text)
		}

		if (await isCommand(text,'申请管理员')) {

			await applyAdmin(token,message_id,from,chat,text)
		}

		if (await isCommand(text,'获取管理员')) {

			await getApplyAdmin(token,message_id,from,chat,text)
		}

		if (await isCommand(text,'设置管理员')) {

			await setAdmin(token,message_id,from,chat,text)
		}

		if (await isCommand(text,'删除管理员')) {

			await delAdmin(token,message_id,from,chat,text)
		}

		if (await isCommand(text,'申请操作员')) {

			await applyOperator(token,message_id,from,chat,text)
		}

		if (await isCommand(text,'设置操作员')) {

			await setOperator(token,message_id,from,chat,text)
		}

		if (await isCommand(text,'删除操作员')) {

			await delOperator(token,message_id,from,chat,text)
		}

		if (await isCommand(text,'设置费率')) {

			await setRate(token,message_id,from,chat,text)
		}

		if (await isCommand(text,'设置汇率')) {

			await setCharge(token,message_id,from,chat,text)
		}

		if (await isCommand(text,'下发')) {

			await setOut(token,message_id,from,chat,text)
		}

		if (await isCommand(text,'回款')) {

			await setIn(token,message_id,from,chat,text)
		}

		if (await isOut(text)) {

			await setOut(token,message_id,from,chat,text)
		}

		if (await isIn(text)) {

			await setIn(token,message_id,from,chat,text)
		}

		return res.send('true')
	}
}