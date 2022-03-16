const db_hh_config = require('../../../model/hh/config')

const db_hh_water = require('../../../model/hh/water')

const db_hh_user = require('../../../model/hh/user')

const { botUrl, env: { ownerId } } = require('../../../config')

const axios = require('axios')

const API = require('../api')

const ROLELIST = ['owner','admin','operator']

const CURRENCY = { 'RMB': '人民币','USDT': 'USDT','USD': '美元','PHP': '披索','MYR': '马币','THB': '泰铢' }

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

		1.添加管理：发送 <b>添加管理 <i>@用户名</i></b>\n

		2.删除管理：发送 <b>删除管理 <i>@用户名</i></b>\n

		⚠️添加的管理的行为必须在某一个群中进行\n
		
		3.设置费率：发送 <b>设置费率 <i>X.XX</i></b> (例：设置费率 0.05)\n
		
		4.设置汇率：发送 <b>设置汇率 <i>货币代码</i> <i>汇率</i></b> (例：设置汇率 PHP 7.8)\n

		⚠️汇率 = 1RMB可以兑换的其他货币的值\n

		⚠️如不需要显示某货币汇率，请设置为0\n

		⚠️支持货币：人民币(RMB)、美元(USD)、披索(PHP)、马币(MYR)、泰铢(THB)、USDT(USDT)\n

		5.记录下发：发送 <b>下发 <i>数量</i> <i>货币代码</i></b>(例：下发 200000 PHP) 或者 <b>-<i>数量</i> <i>货币代码</i></b>(例：-200000 PHP)\n

		6.记录回款：发送 <b>回款 <i>数量</i> <i>货币代码</i></b>(例：回款 200000 PHP) 或者 <b>+<i>数量</i> <i>货币代码</i></b>(例：+200000 PHP)\n

		⚠️下发与回款，若不填写货币代码则默认为人民币(RMB)\n

		如有疑问请联系 @guevaratech
	`

	await API.sendMessage(token, { chat_id: cid, parse_mode: 'HTML', text: r_text })

	return true
}

const addSuper = async (token,message_id,from,chat,text) => {

	const { id: uid, is_bot } = from

	if (is_bot) {

		return false
	}

	if (uid!==ownerId) {

		return false
	}



}

const delSuper = async (token,message_id,from,chat,text) => {

	console.log(from,chat,text,1)
}

const addAdmin = async (token,message_id,from,chat,text) => {

	const { id: uid, is_bot } = from

	if (is_bot) {

		return false
	}

	if (uid!==ownerId) {

	}

	return true
}

const delAdmin = async (token,message_id,from,chat,text) => {

	console.log(from,chat,text,2)
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

		if (await isCommand(text,'添加管理')) {

			await addAdmin(token,message_id,from,chat,text)
		}

		if (await isCommand(text,'删除管理')) {

			await delAdmin(token,message_id,from,chat,text)
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