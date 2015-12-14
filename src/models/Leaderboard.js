var mongoose = require('mongoose');
var _ = require('underscore');

var LeaderboardModel;

var LeaderboardSchema = new mongoose.Schema({

	name:{
		type: String,
		required: true	
	},
	
	score:{
		type: Number,
		required: true	
	},

	createdData: {
		type: Date,
		default: Date.now
	}
});

LeaderboardSchema.methods.toAPI = function() {
	return {
		name: this.name,
		score: this.score
	};
};

LeaderboardSchema.statics.getAllLeaders = function(callback)
{
	return LeaderboardModel.find({}).sort({score: -1}).exec(callback);
};

LeaderboardModel = mongoose.model('Leaderboard',LeaderboardSchema);

module.exports.LeaderboardModel = LeaderboardModel;
module.exports.LeaderboardSchema = LeaderboardSchema;