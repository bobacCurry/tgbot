const log = require('../controller/common/log.js')


module.exports = function(error, req, res, next) {

	if (error) {

		log.write(error)

		return res.status(500).send({ success: false, msg: error.message })
	}
}