const axios = require('axios')

module.exports = {
	
	index: async (req, res, next) =>{

		const token = req.params.token

		console.log(token)

		console.log(req)

		return res.send('true')
	}
}