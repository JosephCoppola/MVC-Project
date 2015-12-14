var controllers = require('./controllers');
var mid = require('./middleware');

var router = function(app){
	app.get("/login",mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
	app.post("/login",mid.requiresSecure, mid.requiresLogout, controllers.Account.login);
	app.get("/signup",mid.requiresSecure, mid.requiresLogout, controllers.Account.signupPage);
	app.post("/signup",mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);
	app.get("/logout",mid.requiresLogin, controllers.Account.logout);
	app.get("/maker",mid.requiresLogin, controllers.Level.makerPage);
	app.post("/maker",mid.requiresLogin, controllers.Level.make);
	app.get("/play", controllers.Level.playPage);
	app.get("/levels",mid.requiresLogin, controllers.Level.levelsPage);
	app.get("/leaders",controllers.Leaderboard.leaderPage);
	app.post("/leaders",controllers.Leaderboard.makeLeader);
	app.get("/",mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
};

module.exports = router;