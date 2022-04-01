const schedule = require('node-schedule')

const db_hh_config = require('../model/hh/config')

const log = require('../controller/common/log')

let reset_hh_start = schedule.scheduleJob('0 0 0 * * *', async () => {

	try{

		await db_hh_config.updateMany({},{ start: false })

	}catch(e){

		log.cron_record(e)
	}
})