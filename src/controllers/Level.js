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

var makeLevel = function(req, res){
	
	console.log(req.body.levelArray);
	
	var levelData = {
		levelArray: req.body.levelArray.toString(),
		owner: req.session.account._id
	};
	
	var newDomo = new Level.LevelModel(levelData);
	
	newDomo.save(function(err) {
		if(err){
			console.log(err);
			return res.status(400).json({error:"An error occured"});
		}
		
		res.json({redirect: "/maker"});
	});
};

module.exports.makerPage = makerPage;
module.exports.make = makeLevel;