const axios = require('axios')

const { botUrl } = require('../config')

const token = '1405193578:AAGBuI8Hacqw3Cr2chF69rFhy7h84eS4Epw'

const main = async () => {

	try{

		const params = { chat_id: 1745712525 }

		const { data } = await axios.post(`${botUrl}${token}/getChat`,params)

		console.log(data)

		process.exit(1)

	}catch({ response }){

		console.log(response.data)
		
		process.exit(1)
	}
}

main()