let fs = require("fs");

let path = require('path');

let date = new Date()

let year = date.getFullYear()

let month = date.getMonth() + 1

let day = date.getDate()

let hour = date.getHours()

let minute = date.getMinutes()

let second = date.getSeconds()

let time = hour + ':' + minute + ':' + second

let file = path.join(__dirname, "../../log/" + year + '-' + month + '-' + day + '-error.log')

let cron_file = path.join(__dirname, "../../log/" + year + '-' + month + '-' + day + '-cron.log')

module.exports = {

	write: (error)=>{
	
		fs.writeFile(file, time + ':' + error + '\n', { flag: 'a' },(err)=>{
	
			if (err) {
	
					console.log(err)
	
				}
			}
		)
	},
	cron_record: async (error) => {
		fs.writeFileSync(cron_file, time + ':' + error + '\n', { flag: 'a' },(e)=>{
			console.log(e)
		})
	}
}