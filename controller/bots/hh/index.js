const db_hh_config = require('../../../model/hh/config')

const db_hh_water = require('../../../model/hh/water')

const db_hh_super = require('../../../model/hh/super')

const db_hh_admin = require('../../../model/hh/admin')

const { botUrl, env: { ownerId } } = require('../../../config')

const axios = require('axios')

const API = require('../api')

const ROLELIST = ['owner','admin','operator']

const CURRENCYLIST = { 'CNY': '人民币','USDT': 'USDT','USD': '美元','PHP': '披索','MYR': '马币','THB': '泰铢' }

const isGroup = (type) => {

	if (type==='group'||type==='supergroup') {

		return true
	}

	return false
}

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



const isSuper = async (username) => {

	try{

		const sup = await db_hh_super.findOne({ username: username.toLowerCase() })

		if (!sup) {

			return false
		}

	}catch(err){

    	return false
    }

    return true
}

const isAdmin = async (cid,username,first_name) => {

	try{

		const admin = await db_hh_admin.findOne({ $and: [ { cid }, { $or: [ { name: username.toLowerCase() }, { name: first_name.toLowerCase() } ] } ] })

		if (!admin) {

			return false
		}

	}catch(err){

    	return false
    }

    return true	
}

const isOut = async (text) => {

	const money = text.split(' ')[0]

	if (isNaN(money)||Number(money)>0) {

		return false
	}

	return true
}

const isIn = async (text) => {

	const money = text.split(' ')[0]

	if (isNaN(money)||Number(money)<0) {

		return false
	}

	return true
}

const start = async (token,message_id,from,chat,text) => {

	const { id: uid, is_bot } = from

	const { id: cid, type } = chat

	const r_text = `
		
		换汇统计命令：\n

		1.添加管理：发送 <u><b>添加管理 @用户名</b></u>\n

		2.删除管理：发送 <u><b>删除管理 @用户名</b></u>\n

		⚠️添加的管理的行为必须在某一个群中进行\n
		
		3.设置费率：发送 <u><b>设置费率 X.XX</b></u> (例：设置费率 0.05)\n
		
		4.设置汇率：发送 <u><b>设置汇率 货币代码 汇率</b></u> (例：设置汇率 PHP 7.8)\n

		⚠️汇率 = 1RMB可以兑换的其他货币的值\n

		⚠️如不需要显示某货币汇率，请设置为0\n

		⚠️支持货币：人民币(RMB)、美元(USD)、披索(PHP)、马币(MYR)、泰铢(THB)、USDT(USDT)\n

		5.记录下发：发送 <u><b>下发 数量 货币代码</b></u>(例：下发 200000 PHP) 或者 <u><b>-数量 货币代码</b></u>(例：-200000 PHP)\n

		6.记录回款：发送 <u><b>回款 数量 货币代码</b></u>(例：回款 200000 PHP) 或者 <u><b>+数量 货币代码</b></u>(例：+200000 PHP)\n

		⚠️下发与回款，若不填写货币代码则默认为人民币(RMB)\n

		如有疑问请联系 @guevaratech
	`

	await API.sendMessage(token, { chat_id: cid, parse_mode: 'HTML', text: r_text })

	return true
}


// {
//   update_id: 958885954,
//   message: {
//     message_id: 54,
//     from: {
//       id: 1329463652,
//       is_bot: false,
//       first_name: 'alex',
//       username: 'ALEX1234QWER',
//       language_code: 'es'
//     },
//     chat: { id: -1001745712525, title: 'Bot', type: 'supergroup' },
//     date: 1647422782,
//     text: '添加超级 @GuevaraTech',
//     entities: [ [Object] ]
//   }


const addSuper = async (token,message_id,from,chat,text) => {

	const { id: uid, is_bot } = from

	if (is_bot) {

		return false
	}

	if (uid!==ownerId) {

		await API.sendMessage(token, { chat_id: chat.id, text: '⚠️操作失败，需要开发者权限' })

		return false
	}

	let username = text.split(' ')[1]

	if (!username) {

		await API.sendMessage(token, { chat_id: chat.id, text: '⚠️操作失败，用户名不存在' })

		return false
	}

	username = username.replace('@','')

	username = username.toLowerCase()

	try{

		const user = await db_hh_super.findOne({ username })

		if (user) {

			await API.sendMessage(token, { chat_id: chat.id, text: '⚠️操作失败，用户名已存在' })

			return false 
		}

		await db_hh_super.create({ username })

		await API.sendMessage(token, { chat_id: chat.id, text: '✅新增超级管理成功' })

	}catch(err){

		await API.sendMessage(token, { chat_id: chat.id, text: '⚠️系统错误，请联系 @guevaratech' })

    	return false  	
    }

	return true
}

const delSuper = async (token,message_id,from,chat,text) => {

	const { id: uid, is_bot } = from

	if (is_bot) {

		return false
	}

	if (uid!==ownerId) {

		await API.sendMessage(token, { chat_id: chat.id, text: '⚠️操作失败，需要开发者权限' })

		return false
	}

	let username = text.split(' ')[1]

	if (!username) {

		await API.sendMessage(token, { chat_id: chat.id, text: '⚠️操作失败，用户名不存在' })

		return false
	}

	username = username.replace('@','')

	username = username.toLowerCase()

	try{

		await db_hh_super.deleteOne({ username })

		await API.sendMessage(token, { chat_id: chat.id, text: '✅删除超级管理成功' })

	}catch(err){

		await API.sendMessage(token, { chat_id: chat.id, text: '⚠️系统错误，请联系 @guevaratech' })

    	return false  	
    }

    return true

}

const addAdmin = async (token,message_id,from,chat,text) => {

	const { id: uid, username, is_bot } = from

	const { id: cid, type } = chat

	if (is_bot) {

		return false
	}

	if (!isGroup(type)) {

		await API.sendMessage(token, { chat_id: cid, text: '⚠️操作失败，该操作需要在群内进行' })

		return false
	}

	const sup = await db_hh_super.findOne({ username: username.toLowerCase() })

	if (!sup) {

		await API.sendMessage(token, { chat_id: cid, text: '⚠️操作失败，需要超级管理权限，请联系 @guevaratech' })

		return false
	}

	let name = text.split(' ')[1]

	if (!name) {

		await API.sendMessage(token, { chat_id: chat.id, text: '⚠️操作失败，请选择用户' })

		return false
	}

	name = name.replace('@','')

	name = name.toLowerCase()

	try{

		const admin = await db_hh_admin.findOne({ cid, name })

		if (admin) {

			await API.sendMessage(token, { chat_id: cid, text: '⚠️操作失败，该管理已存在，请勿重复添加' })

			return false
		}

		await db_hh_admin.create({ cid, name, super: sup._id })

		await API.sendMessage(token, { chat_id: cid, text: '✅新增管理成功' })

	}catch(err){

		await API.sendMessage(token, { chat_id: chat.id, text: '⚠️系统错误，请联系 @guevaratech' })

    	return false  	
    }

	return true
}

const delAdmin = async (token,message_id,from,chat,text) => {

	const { id: uid, username, is_bot } = from

	const { id: cid, type } = chat

	if (is_bot) {

		return false
	}

	if (!isGroup(type)) {

		await API.sendMessage(token, { chat_id: cid, text: '⚠️操作失败，该操作需要在群内进行' })

		return false
	}

	const sup = await db_hh_super.findOne({ username: username.toLowerCase() })

	if (!sup) {

		await API.sendMessage(token, { chat_id: cid, text: '⚠️操作失败，需要超级管理权限，请联系 @guevaratech' })

		return false
	}

	let name = text.split(' ')[1]

	if (!name) {

		await API.sendMessage(token, { chat_id: chat.id, text: '⚠️操作失败，请选择用户' })

		return false
	}

	name = name.replace('@','')

	name = name.toLowerCase()

	try{

		await db_hh_admin.deleteOne({ cid, name })

		await API.sendMessage(token, { chat_id: cid, text: '✅删除管理成功' })

	}catch(err){

		await API.sendMessage(token, { chat_id: chat.id, text: '⚠️系统错误，请联系 @guevaratech' })

    	return false  	
    }

	return true
}

const getAdmin = async (token,message_id,from,chat,text) => {

	const { id: uid, username, is_bot } = from

	const { id: cid, type } = chat

	if (is_bot) {

		return false
	}

	if (!isGroup(type)) {

		await API.sendMessage(token, { chat_id: cid, text: '⚠️操作失败，该操作需要在群内进行' })

		return false
	}

	const sup = await db_hh_super.findOne({ username: username.toLowerCase() })

	if (!sup) {

		await API.sendMessage(token, { chat_id: cid, text: '⚠️操作失败，需要超级管理权限，请联系 @guevaratech' })

		return false
	}

	try{

		const admins = await db_hh_admin.find({ cid },{ name: 1 })

		let adminText = ''

		for (var i = admins.length - 1; i >= 0; i--) {

			adminText = adminText + '@' + admins[i].name + '\n\n'
		}

		await API.sendMessage(token, { chat_id: cid, text: adminText?adminText:'暂未设置管理员' })

	}catch(err){

		await API.sendMessage(token, { chat_id: chat.id, text: '⚠️系统错误，请联系 @guevaratech' })

    	return false
    }

	return true
}

const setCharge = async (token,message_id,from,chat,text) => {

	const { id: uid, username, first_name, is_bot } = from

	const { id: cid, type } = chat

	if (!await isAdmin(cid,username,first_name)) {

		await API.sendMessage(token, { chat_id: cid, text: '⚠️操作失败，需要管理员权限' })

		return false
	}

	let charge = text.split(' ')[1]

	if (isNaN(charge)) {

		await API.sendMessage(token, { chat_id: cid, text: '⚠️操作失败，费率必须为数字' })

		return false
	}

	try{

		const chat = await db_hh_config.findOne({ cid })

		if (chat) {

			await db_hh_config.updateOne({ cid }, { charge })

		}else{

			await db_hh_config.create({ cid, charge })
		}

		await API.sendMessage(token, { chat_id: cid, text: '✅费率配置成功' })

	}catch(err){

		await API.sendMessage(token, { chat_id: chat.id, text: '⚠️系统错误，请联系 @guevaratech' })

    	return false  	
    }

	return true
}

const setRate = async (token,message_id,from,chat,text) => {

	const { id: uid, username, first_name, is_bot } = from

	const { id: cid, type } = chat

	if (!await isAdmin(cid,username,first_name)) {

		await API.sendMessage(token, { chat_id: cid, text: '⚠️操作失败，需要管理员权限' })

		return false
	}

	let currency = text.split(' ')[1]

	let rate = text.split(' ')[2]

	if (!currency||!CURRENCYLIST[currency]) {

		await API.sendMessage(token, { chat_id: cid, text: '⚠️操作失败，货币为未知货币' })

		return false
	}

	if (currency==='CNY') {

		await API.sendMessage(token, { chat_id: cid, text: '⚠️操作失败，人民币为默认货币' })

		return false
	}

	if (isNaN(rate)) {

		await API.sendMessage(token, { chat_id: cid, text: '⚠️操作失败，汇率必须为数字' })

		return false
	}

	try{

		let update = {}

		update[`rate_${currency}`] = rate

		const chat = await db_hh_config.findOne({ cid })

		if (chat) {

			await db_hh_config.updateOne({ cid }, update)

		}else{

			await db_hh_config.create({ cid, ...update })
		}

		await API.sendMessage(token, { chat_id: cid, text: '✅汇率配置成功' })

	}catch(err){

		await API.sendMessage(token, { chat_id: chat.id, text: '⚠️系统错误，请联系 @guevaratech' })

    	return false  	
    }

	return true
}

const setWater = async (token,message_id,from,chat,money,currency,io) => {

	const { id: uid, username, first_name, is_bot } = from

	const { id: cid } = chat

	if (!await isAdmin(cid,username,first_name)) {

		await API.sendMessage(token, { chat_id: cid, text: '⚠️操作失败，需要管理员权限' })

		return false
	}

	if (!CURRENCYLIST[currency]) {

		await API.sendMessage(token, { chat_id: cid, text: '⚠️操作失败，货币为未知货币' })

		return false
	}

	if (isNaN(money)) {

		await API.sendMessage(token, { chat_id: cid, text: '⚠️操作失败，请输入记录数量' })

		return false
	}

	try{

		const config  = await db_hh_config.findOne({ cid })

		const rate = config[`rate_${currency}`]

		const charge = config['charge']

		const name = username?`@${username}`:`@${first_name}`

		await db_hh_water.create({ cid, uid, name, charge, rate, currency, money, io })

		await API.sendMessage(token, { chat_id: cid, text: '✅数据录入成功' })

	}catch(err){

		await API.sendMessage(token, { chat_id: chat.id, text: '⚠️系统错误，请联系 @guevaratech' })

    	return false
    }

	return true
}

module.exports = {
	
	index: async (req, res, next) =>{

		const token = req.params.token

		const { update_id, message: { message_id, from, chat, text, entities } } = req.body

		console.log(req.body)

		if (!text) {

			return res.send('true')
		}

		if (await isCommand(text,'/start')) {

			await start(token,message_id,from,chat,text)
		} 

		else if (await isCommand(text,'添加超级')) {

			await addSuper(token,message_id,from,chat,text)
		} 

		else if (await isCommand(text,'删除超级')) {

			await delSuper(token,message_id,from,chat,text)
		} 

		else if (await isCommand(text,'添加管理')) {

			await addAdmin(token,message_id,from,chat,text)		
		} 

		else if (await isCommand(text,'删除管理')) {

			await delAdmin(token,message_id,from,chat,text)
		
		} else if (await isCommand(text,'查询管理')) {

			await getAdmin(token,message_id,from,chat,text)
		}

		else if (await isCommand(text,'设置费率')) {

			await setCharge(token,message_id,from,chat,text)
		}

		else if (await isCommand(text,'设置汇率')) {

			await setRate(token,message_id,from,chat,text)
		}

		else if (await isCommand(text,'下发')) {

			const money = text.split(' ')[1]

			const currency = text.split(' ')[2]?text.split(' ')[2]:'CNY'

			await setWater(token,message_id,from,chat,money,currency,'o')
		}

		else if (await isCommand(text,'回款')) {

			const money = text.split(' ')[1]

			const currency = text.split(' ')[2]?text.split(' ')[2]:'CNY'

			await setWater(token,message_id,from,chat,money,currency,'i')
		}

		else if (await isOut(text)) {

			const money = text.split(' ')[0]

			const currency = text.split(' ')[1]?text.split(' ')[1]:'CNY'

			await setWater(token,message_id,from,chat,money,currency,'o')
		}

		else if (await isIn(text)) {

			const money = text.split(' ')[0]

			const currency = text.split(' ')[1]?text.split(' ')[1]:'CNY'

			await setWater(token,message_id,from,chat,money,currency,'i')
		}

		return res.send('true')
	}
}