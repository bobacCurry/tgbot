const bots =  require('./bots')

module.exports = function(app) {

	app.use('/bots', bots)
}