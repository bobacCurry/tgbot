const axios = require('axios')

const { botUrl, env } = require('../config')

if (!process.argv[2]) {

	console.log('please input the token')

	process.exit(1)
}

const token = process.argv[2]

const main = async () => {

	try{

		console.log(`${botUrl}${token}/getWebhookInfo`)

		const { data } = await axios.post(`${botUrl}${token}/getWebhookInfo`)

		console.log(data)

		process.exit(1)


	}catch(err){

		console.log(err)
		
		process.exit(1)
	}
}

main()