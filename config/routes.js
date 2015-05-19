module.exports = function(app){

	console.log("Loading routes");
	//home route
	var home = require('../app/controllers/home');
	app.get('/', home.index);
};
