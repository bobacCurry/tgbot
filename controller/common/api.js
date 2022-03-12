const host = 'https://api.telegram.org/bot'

const axios = require('axios')

module.exports = {

	getMe: (bot,params = {}) => {

		const api = host + bot + '/getMe'

		return axios.get(api,{params})
	},
	getUpdates: (bot,params = {}) => {

		const api = host + bot + '/getUpdates'

		return axios.get(api,{params})
	},
	setWebhook: (bot,params = {}) => {

		const api = host + bot + '/setWebhook'

		return axios.get(api,{params})
	},
	deleteWebhook: (bot,params = {}) => {

		const api = host + bot + '/deleteWebhook'

		return axios.get(api,{params})
	},
	getWebhookInfo: (bot,params = {}) => {

		const api = host + bot + '/getWebhookInfo'

		return axios.get(api,{params})
	},
	getChat: (bot,params = {}) => {

		const api = host + bot + '/getChat'

		return axios.get(api,{params})
	},
	sendMessage: (bot,params = {}) => {

		const api = host + bot + '/sendMessage'

		return axios.get(api,{params})
	},
	sendPhoto: (bot,params = {}) => {

		const api = host + bot + '/sendPhoto'

		return axios.get(api,{params})
	},
	getChatMembersCount: (bot,params = {}) => {

		const api = host + bot + '/getChatMembersCount'

		return axios.get(api,{params})
	},
	getChatMembers:() => {

		const api = host + bot + '/getChatMembersCount'

		return axios.get(api,{params})
	}
}