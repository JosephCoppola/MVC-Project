var _ = require('underscore');
var models = require('../models');

var Level = models.Level;

var colors = ["rgb(22, 47, 31)","rgb(9, 34, 67)","rgb(52, 62, 28)","rgb(4, 74, 30)","rgb(9, 49, 100)"];
var secondaryColors = ["rgb(30, 86, 51)","rgb(31, 52, 78)","rgb(140, 154, 105)","rgb(81, 118, 95)","rgb(76, 90, 107)"];

var makerPage = function(req,res){
	
	console.log(req.session);
	
	Level.LevelModel.findByOwner(req.session.account._id,function(err,docs){
		
		if(err)
		{
			console.log(err);
			return res.status(400).json({error:"An error occurred"});
		}
		
		var colorIndex = Math.floor(Math.random() * 5);
		
		var _pageColors = {primary:colors[colorIndex],secondary:secondaryColors[colorIndex]};
		
		res.render('app', {csrfToken: req.csrfToken(), domos:docs, pageColors:_pageColors, user:req.session.account.username});
	});
};

var playPage = function(req,res){
	res.render('match');
}

var levelsPage = function(req,res){
	
	Level.LevelModel.getAllLevels(function(err,docs){
		console.log(docs);
		
		var colorIndex = Math.floor(Math.random() * 5);
		
		var _pageColors = {primary:colors[colorIndex],secondary:secondaryColors[colorIndex]};
		
		res.render('levels',{pageColors:_pageColors});
	});
}

var makeLevel = function(req, res){
	
	console.log(req.body.levelArray);
	
	var levelData = {
		levelArray: req.body.levelArray.toString(),
		owner: req.session.account._id,
		creator: req.session.accound.username
	};
	
	var newLevel = new Level.LevelModel(levelData);
	
	newLevel.save(function(err) {
		if(err){
			console.log(err);
			return res.status(400).json({error:"An error occured"});
		}
		
		res.json({redirect: "/maker"});
	});
};

module.exports.playPage = playPage;
module.exports.makerPage = makerPage;
module.exports.levelsPage = levelsPage;
module.exports.make = makeLevel;