const axios = require('axios')

const { botUrl } = require('../config')

const token = '1405193578:AAGBuI8Hacqw3Cr2chF69rFhy7h84eS4Epw'

const main = async () => {

	try{

		const params = { chat_id: 1815214666 }

		const { data } = await axios.post(`${botUrl}${token}/getChat`,params)

		console.log(data)

		process.exit(1)

	}catch(err){

		console.log(err)
		
		process.exit(1)
	}
}

main()