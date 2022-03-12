const axios = require('axios')

module.exports = {
	
	index: async (req, res, next) =>{

		const token = req.params.token

		console.log(req.body)

		return res.send('true')
	}
}