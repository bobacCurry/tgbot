const schedule = require('node-schedule')

const db_admin_index = require('../../../model/admin/index')

module.exports = {

	index: async (req, res, next) =>{

		const token = req.params.token

		const { message } = req.body

		console.log(message)

		return res.send('true')
	}
}