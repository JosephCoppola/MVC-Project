var _ = require('underscore');
var models = require('../models');

var Domo = models.Domo;

var makerPage = function(req,res){
	res.render('app');
};

var makeDomo = function(req, res){
	
	if(!req.body.name || !req.body.age){
		return res.status(400).json({error:"Both name and age are required"});
	}
	
	var domoData = {
		name: req.body.name,
		age: req.body.age,
		owner: req.session.account._id
	};
	
	var newDomo = new Domo.DomoModel(domoData);
	
	newDomo.save(function(err) {
		if(err){
			console.log(err);
			return res.status(400).json({error:"An error occured"});
		}
		
		res.json({redirect: "/maker"});
	});
};

module.exports.makerPage = makerPage;
module.exports.make = makeDomo;