const axios = require('axios')

const { botUrl, env } = require('../config')

const TYPELIST = ['admin','hh'] 

if (!process.argv[2]) {

	console.log('please input the token')

	process.exit(1)
}

if (!process.argv[3]) {

	console.log('please input the type')

	process.exit(1)
}


const token = process.argv[2]

const type = TYPELIST[process.argv[3]]

const main = async () => {

	try{

		const url = env.apiUrl + 'bots/' + type + '/' + token

		const allowed_updates = ['message','inline_query','callback_query','chat_join_request']

		const form = { url, allowed_updates }

		const { data } = await axios.post(`${botUrl}${token}/setWebhook`,form)

		console.log(data)

		process.exit(1)

	}catch(err){

		console.log(err)
		
		process.exit(1)
	}
}

main()