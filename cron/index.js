const schedule = require('node-schedule')

const db_hh_config = require('../model/hh/config')

const db_admin_index = require('../model/admin/index')

const log = require('../controller/common/log')

const API = require('../controller/bots/api')

let reset_hh_start = schedule.scheduleJob('0 0 0 * * *', async () => {

	try{

		await db_hh_config.updateMany({},{ start: false })

	}catch(e){

		log.cron_record(e)
	}
})

let admin_push = schedule.scheduleJob('*/5 * * * * *', async () => {

	try{

		const nowtime = (new Date()).getTime()

		const push = await db_admin_index.findOne({ minute: { $gt: 0 }, nexttime: { $lt: nowtime } })

		if(push){

			const { _id, token, from_chat_id, chat_id, message_id, minute } = push

			const nexttime = nowtime + minute*60*1000

			await db_admin_index.updateOne({ _id }, { nexttime })

			await API.forwardMessage(token, { from_chat_id, chat_id, message_id })
		}

		return

	}catch(e){

		log.cron_record(e)
	}
})