const db_hh_config = require('../../../model/hh/config')

const db_hh_water = require('../../../model/hh/water')

const db_hh_super = require('../../../model/hh/super')

const db_hh_admin = require('../../../model/hh/admin')

const { botUrl, env: { ownerId } } = require('../../../config')

const moment = require('moment')

const axios = require('axios')

const API = require('../api')

const ROLELIST = ['owner','admin','operator']

const CURRENCYLIST = { 'CNY': '人民币','USDT': 'USDT','USD': '美元','PHP': '比索','MYR': '马币','THB': '泰铢' }

const CURRENCYCODE = { '人民币': 'CNY','u': 'USDT','USDT': 'USDT','美元': 'USD','比索': 'PHP','p': 'PHP','马币': 'MYR','泰铢': 'THB' }

const BOTLIST = [ 'xinlianbangbot', 'huanhuibot' ]

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

const isDate = (date) => {
	
	if(isNaN(date)&&!isNaN(Date.parse(date))){

	　　return true
	}

	return false
}

const start  = async (token,message_id,from,chat,text) => {

	const { id: uid, username, first_name, is_bot } = from

	const { id: cid, type } = chat

	if (!isGroup(type)) {

		await API.sendMessage(token, { chat_id: cid, text: '⚠️操作失败，该操作需要在群内进行' })

		return false
	}

	if (!await isAdmin(cid,username,first_name)) {

		await API.sendMessage(token, { chat_id: cid, text: '⚠️操作失败，需要管理员权限' })

		return false
	}

	try{

		const user = await db_hh_config.updateOne({ cid },{ start: true })

		await API.sendMessage(token, { chat_id: chat.id, text: '✅今日统计已开启' })

	}catch(err){

		await API.sendMessage(token, { chat_id: chat.id, text: '⚠️系统错误，请联系 @guevaratech' })

    	return false  	
    }

	return true

}

const close  = async (token,message_id,from,chat,text) => {

	const { id: uid, username, first_name, is_bot } = from

	const { id: cid, type } = chat

	if (!isGroup(type)) {

		await API.sendMessage(token, { chat_id: cid, text: '⚠️操作失败，该操作需要在群内进行' })

		return false
	}

	if (!await isAdmin(cid,username,first_name)) {

		await API.sendMessage(token, { chat_id: cid, text: '⚠️操作失败，需要管理员权限' })

		return false
	}

	try{

		const user = await db_hh_config.updateOne({ cid },{ start: false })

		await API.sendMessage(token, { chat_id: chat.id, text: '✅今日统计已关闭' })

	}catch(err){

		await API.sendMessage(token, { chat_id: chat.id, text: '⚠️系统错误，请联系 @guevaratech' })

    	return false  	
    }

	return true

}

const help = async (token,message_id,from,chat,text) => {

	const { id: uid, is_bot } = from

	const { id: cid, type } = chat

	const r_text = `

		<b>欢迎使用自助统计机器人！</b>
		
		换汇统计命令：\n

		1.添加管理：发送 <u><b>添加管理 @用户名</b></u>\n

		2.删除管理：发送 <u><b>删除管理 @用户名</b></u>\n

		⚠️添加的管理的行为必须在某一个群中进行\n
		
		3.设置费率：发送 <u><b>设置费率 X.XX</b></u> (例：设置费率 0.05)\n
		
		4.设置汇率：发送 <u><b>设置汇率 货币代码 汇率</b></u> (例：设置汇率 PHP 7.8)\n

		⚠️汇率 = 1RMB可以兑换的其他货币的值\n

		⚠️如不需要显示某货币汇率，请设置为0\n

		⚠️支持货币：人民币(RMB)、美元(USD)、比索(PHP)、马币(MYR)、泰铢(THB)、USDT(USDT)\n

		5.记录下发：发送 <u><b>下发 数量 货币代码</b></u>(例：下发 200000 PHP) 或者 <u><b>-数量 货币代码</b></u>(例：-200000 PHP)\n

		6.记录入款：发送 <u><b>入款 数量 货币代码</b></u>(例：入款 200000 PHP) 或者 <u><b>+数量 货币代码</b></u>(例：+200000 PHP)\n

		⚠️下发与入款，若不填写货币代码则默认为人民币(RMB)\n

		7.获取账单: 发送 <u><b>获取账单 日期（年-月-日）</b></u>(例：获取账单 2022-2-22)\n

		⚠️获取账单后可以填写某日日期获取该日流水，如不填写日期，则默认获取今日账单\n

		8.清空账单: 发送 <u><b>清空账单</b></u> 将清空今天的账单

		9.开启统计: 发送 <u><b>开启统计</b></u> 将开始统计今天的数据

		10.关闭统计: 发送 <u><b>关闭统计</b></u> 将停止统计今天的数据

		11.显示小数: 发送 <u><b>显示小数</b></u> 显示小数点

		12.不显示小数: 发送 <u><b>不显示小数</b></u> 不显示小数

		13.清空账单: 发送 <u><b>清空账单</b></u> 将清空今日账单

		14.重置设置: 发送 <u><b>重置设置</b></u> 将重置统计设置

		如有疑问请联系 @guevaratech
	`

	try{

		await API.sendMessage(token, { chat_id: cid, parse_mode: 'HTML', text: r_text })

	}catch(err){

		await API.sendMessage(token, { chat_id: chat.id, text: '⚠️系统错误，请联系 @guevaratech' })

    	return false  	
    }

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


const showPoint = async (token,message_id,from,chat,point) => {

	const { id: uid, username, first_name, is_bot } = from

	const { id: cid, type } = chat

	if (!isGroup(type)) {

		await API.sendMessage(token, { chat_id: cid, text: '⚠️操作失败，该操作需要在群内进行' })

		return false
	}

	if (!await isAdmin(cid,username,first_name)) {

		await API.sendMessage(token, { chat_id: cid, text: '⚠️操作失败，需要管理员权限' })

		return false
	}

	try{

		await db_hh_config.updateOne({ cid }, { point })

		if (point) {

			await API.sendMessage(token, { chat_id: cid, text: '✅显示小数点' })
		
		}else{

			await API.sendMessage(token, { chat_id: cid, text: '✅不显示小数点' })
		}

	}catch(err){

		await API.sendMessage(token, { chat_id: chat.id, text: '⚠️系统错误，请联系 @guevaratech' })

    	return false  	
    }
}

const setCharge = async (token,message_id,from,chat,text) => {

	const { id: uid, username, first_name, is_bot } = from

	const { id: cid, type } = chat

	if (!isGroup(type)) {

		await API.sendMessage(token, { chat_id: cid, text: '⚠️操作失败，该操作需要在群内进行' })

		return false
	}

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

const reset = async (token,message_id,from,chat) => {

	const { id: uid, username, first_name, is_bot } = from

	const { id: cid, type } = chat

	if (!isGroup(type)) {

		await API.sendMessage(token, { chat_id: cid, text: '⚠️操作失败，该操作需要在群内进行' })

		return false
	}

	if (!await isAdmin(cid,username,first_name)) {

		await API.sendMessage(token, { chat_id: cid, text: '⚠️操作失败，需要管理员权限' })

		return false
	}

	try{

		await db_hh_config.update({ cid },{ charge: 0, rate_CNY: 1, rate_USDT: 0, rate_USD:0, rate_PHP: 0, rate_MYR:0, rate_THB: 0, point: false })

		await API.sendMessage(token, { chat_id: cid, text: '✅重置设置成功' })

	}catch(err){

		await API.sendMessage(token, { chat_id: chat.id, text: '⚠️系统错误，请联系 @guevaratech' })

    	return false  	
    }

	return true

}

const setRate = async (token,message_id,from,chat,text) => {

	const { id: uid, username, first_name, is_bot } = from

	const { id: cid, type } = chat

	if (!isGroup(type)) {

		await API.sendMessage(token, { chat_id: cid, text: '⚠️操作失败，该操作需要在群内进行' })

		return false
	}

	if (!await isAdmin(cid,username,first_name)) {

		await API.sendMessage(token, { chat_id: cid, text: '⚠️操作失败，需要管理员权限' })

		return false
	}

	let currency = text.split(' ')[1]

	let rate = text.split(' ')[2]

	currency = CURRENCYLIST[currency]?currency:CURRENCYCODE[currency]

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

	const { id: cid, type } = chat

	if (!isGroup(type)) {

		await API.sendMessage(token, { chat_id: cid, text: '⚠️操作失败，该操作需要在群内进行' })

		return false
	}

	if (!await isAdmin(cid,username,first_name)) {

		await API.sendMessage(token, { chat_id: cid, text: '⚠️操作失败，需要管理员权限' })

		return false
	}

	if (!CURRENCYLIST[currency]) {

		await API.sendMessage(token, { chat_id: cid, text: '⚠️操作失败，货币为未知货币' })

		return false
	}

	if (isNaN(money)) {

		await API.sendMessage(token, { chat_id: cid, text: '⚠️操作失败，请输入正确的数量' })

		return false
	}

	try{

		const config  = await db_hh_config.findOne({ cid })

		if (!config) {

			await API.sendMessage(token, { chat_id: cid, text: '⚠️操作失败，未设置该币种汇率，请先设置汇率' })

			return false	
		}

		if (!config.start) {

			await API.sendMessage(token, { chat_id: cid, text: '⚠️操作失败，请先开启统计' })

			return false	
		}

		const rate = config[`rate_${currency}`]

		if (!rate) {

			await API.sendMessage(token, { chat_id: cid, text: '⚠️操作失败，未设置该币种汇率，请先设置汇率' })

			return false
		}

		const charge = config['charge']

		const name = username?`@${username}`:`@${first_name}`

		const created_at = updated_at = moment().add(8, 'hours').format('YYYY-MM-DD HH:mm:ss')

		await db_hh_water.create({ cid, uid, name, charge, rate, currency, money, io, created_at, updated_at })

		await getWater(token,message_id,from,chat,'')

	}catch(err){

		await API.sendMessage(token, { chat_id: chat.id, text: '⚠️系统错误，请联系 @guevaratech' })

    	return false
    }

	return true
}

const getWater = async (token,message_id,from,chat,text) => {

	const { id: uid, username, first_name, is_bot } = from

	const { id: cid, type } = chat

	if (!isGroup(type)) {

		await API.sendMessage(token, { chat_id: cid, text: '⚠️操作失败，该操作需要在群内进行' })

		return false
	}

	if (!await isAdmin(cid,username,first_name)) {

		await API.sendMessage(token, { chat_id: cid, text: '⚠️操作失败，需要管理员权限' })

		return false
	}

	let start = text.split(' ')[1]?text.split(' ')[1]:moment().add(8, 'hours').format('YYYY-MM-DD')

	if (!isDate(start)) {

		await API.sendMessage(token, { chat_id: cid, text: '⚠️操作失败，请输入正确的日期格式：年-月-日' })

		return false
	}

	let end = moment(start).add(1, 'days').format('YYYY-MM-DD')

	try{

		const water = await db_hh_water.find({ cid, created_at: { $gte: start, $lt: end } },{ name:1, currency:1, money:1, io:1, created_at:1 })

		const config  = await db_hh_config.findOne({ cid })

		let water_in = []

		let water_out = []

		let count_in = 0

		let count_out = 0

		let in_total = 0

		let out_total = 0

		const point = config.point ? 2 : 0

		for (let i = water.length - 1; i >= 0; i--) {

			if (water[i].io==='i') {

				count_in++

				let money_i = 0

				water_in.push(`${moment(water[i].created_at).format('HH:mm:ss')} ${water[i].money} ${CURRENCYLIST[water[i].currency]}`)

				if (config[`rate_${water[i].currency}`]) {

					let _rate = config[`rate_${water[i].currency}`]

					if (water[i].currency==='PHP') {

						let _rate = Number((1/config[`rate_${water[i].currency}`]).toFixed(6))
					}

					money_i = (water[i].money*_rate)
				}

				in_total += money_i

			}

			if (water[i].io==='o') {

				count_out++

				let money_o = 0

				water_out.push(`${moment(water[i].created_at).format('HH:mm:ss')} ${water[i].money} ${CURRENCYLIST[water[i].currency]}`).toFixed(point)

				if (config[`rate_${water[i].currency}`]) {

					let _rate = config[`rate_${water[i].currency}`]

					if (water[i].currency==='PHP') {

						let _rate = Number((1/config[`rate_${water[i].currency}`]).toFixed(6))
					}

					money_o = water[i].money*_rate
				}

				out_total += Number(money_o)
			}
		}

		in_total = in_total.toFixed(point)

		const charge = config.charge

		const out_should = in_total/(1+charge)

		const out_need = out_should - out_total

		let out_total_array = []

		let out_should_array = []

		let out_need_array = []

		let rate_array = []

		for (let currency in CURRENCYLIST) {
			
			let rate = config[`rate_${currency}`]

			let _rate = rate

			if (rate) {

				if (currency!=='PHP') {

					_rate = Number((1/rate).toFixed(6))
				}

				if (currency!=='CNY') {

					rate_array.push(`${CURRENCYLIST[currency]}(${currency})汇率：${rate}`)
				}

				out_total_array.push(`${(out_total*_rate).toFixed(point)}${CURRENCYLIST[currency]}`)

				out_should_array.push(`${(out_should*_rate).toFixed(point)}${CURRENCYLIST[currency]}`)

				out_need_array.push(`${(out_need*_rate).toFixed(point)}${CURRENCYLIST[currency]}`)
			}
		}

		let water_text = '入款（' + count_in + '笔）：\n\n'+ water_in.join('\n\n') + '\n\n出款（' + count_out + '笔）：\n\n' + water_out.join('\n\n') + '\n\n费率：' + charge + '\n\n' + rate_array.join('\n\n') + '\n\n总入款：' + in_total + '人民币\n\n应下发：' + out_should_array.join(' | ') + '\n\n总下发：' + out_total_array.join(' | ') + '\n\n余下发：' + out_need_array.join(' | ')

		await API.sendMessage(token, { chat_id: cid, text: water_text })

	}catch(err){

		console.log(err)

		await API.sendMessage(token, { chat_id: chat.id, text: '⚠️系统错误，请联系 @guevaratech' })

    	return false
    }

    return true
}

const clearWater = async (token,message_id,from,chat) => {

	const { id: uid, username, first_name, is_bot } = from

	const { id: cid, type } = chat

	if (!isGroup(type)) {

		await API.sendMessage(token, { chat_id: cid, text: '⚠️操作失败，该操作需要在群内进行' })

		return false
	}

	if (!await isAdmin(cid,username,first_name)) {

		await API.sendMessage(token, { chat_id: cid, text: '⚠️操作失败，需要管理员权限' })

		return false
	}

	let start = moment().format('YYYY-MM-DD')

	let end = moment(start).add(1, 'days').format('YYYY-MM-DD')

	try{

		await db_hh_water.deleteMany({ cid, created_at: { $gte: start, $lt: end } })

		await API.sendMessage(token, { chat_id: cid, text: '✅清空账单成功' })

		await getWater(token,message_id,from,chat,'')

	}catch(err){

		await API.sendMessage(token, { chat_id: chat.id, text: '⚠️系统错误，请联系 @guevaratech' })

    	return false
	}

	return true
}

module.exports = {
	
	index: async (req, res, next) =>{

		const token = req.params.token

		const { update_id, message: { message_id, from, chat, text, entities, new_chat_member } } = req.body

		if (new_chat_member&&(BOTLIST.indexOf(new_chat_member.username)!==-1)) {

			await db_hh_config.deleteMany({ cid: chat.id })

			await db_hh_water.deleteMany({ cid: chat.id })

			await db_hh_admin.deleteMany({ cid: chat.id })

			await db_hh_config.create({ cid: chat.id })

			await help(token,message_id,from,chat,text)
		}

		if (!text) {

			return res.send('true')
		}

		if (await isCommand(text,'/help')||await isCommand(text,'/start')) {

			await help(token,message_id,from,chat,text)
		}

		else if (await isCommand(text,'/run')||await isCommand(text,'开启统计')) {

			await start(token,message_id,from,chat,text)
		}

		else if (await isCommand(text,'/stop')||await isCommand(text,'关闭统计')) {

			await close(token,message_id,from,chat,text)
		}

		else if (await isCommand(text,'/bill')||await isCommand(text,'获取账单')){

			await getWater(token,message_id,from,chat,text)
		}

		else if (await isCommand(text,'/clear')||await isCommand(text,'清空账单')) {

			await clearWater(token,message_id,from,chat)
		}

		else if (await isCommand(text,'/reset')||await isCommand(text,'重置设置')) {

			await reset(token,message_id,from,chat)
		}

		else if (await isCommand(text,'/point')||await isCommand(text,'显示小数')) {

			await showPoint(token,message_id,from,chat,true)
		}

		else if (await isCommand(text,'/no_point')||await isCommand(text,'不显示小数')) {

			await showPoint(token,message_id,from,chat,false)
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
		
		} 

		else if (await isCommand(text,'查询管理')) {

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

			let currency = text.split(' ')[2]?text.split(' ')[2]:'CNY'

			currency = CURRENCYLIST[currency]?currency:CURRENCYCODE[currency]

			await setWater(token,message_id,from,chat,money,currency,'o')
		}

		else if (await isCommand(text,'入款')) {

			const money = text.split(' ')[1]

			let currency = text.split(' ')[2]?text.split(' ')[2]:'CNY'

			currency = CURRENCYLIST[currency]?currency:CURRENCYCODE[currency]

			await setWater(token,message_id,from,chat,money,currency,'i')
		}

		else if (await isCommand(text,'-')) {

			const money = 0 - text.split(' ')[0]

			let currency = text.split(' ')[1]?text.split(' ')[1]:'CNY'

			currency = CURRENCYLIST[currency]?currency:CURRENCYCODE[currency]

			await setWater(token,message_id,from,chat,money,currency,'o')
		}

		else if (await isCommand(text,'+')) {

			const money = text.split(' ')[0]

			let currency = text.split(' ')[1]?text.split(' ')[1]:'CNY'

			currency = CURRENCYLIST[currency]?currency:CURRENCYCODE[currency]

			await setWater(token,message_id,from,chat,money,currency,'i')
		}

		return res.send('true')
	}
}