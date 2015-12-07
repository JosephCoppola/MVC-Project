
"use strict";
var app = app || {};

app.buttonControls = function(){

	function difficulty(dif)
	{
		app.match.difficulty = !dif;
		
		if(!dif)
		{
			for(var i = 0; i < app.match.practiceButtons.length; i++)
			{
				if(app.match.practiceButtons[i].string == "Easy")
				{
					app.match.practiceButtons[i] = new app.Button(app.match.ctx,50,25,"practice","Hard","#DB0000","red",100,50,30,function(){app.buttonControls.difficulty(app.match.difficulty)});
				}
			}
		}
		else
		{
			for(var i = 0; i < app.match.practiceButtons.length; i++)
			{
				if(app.match.practiceButtons[i].string == "Hard")
				{
					app.match.practiceButtons[i] = new app.Button(app.match.ctx,50,25,"practice","Easy","green","#029B26",100,50,30,function(){app.buttonControls.difficulty(app.match.difficulty)});
				}
			}
		}
		console.log(app.match.difficulty);
	}

	function practiceMode()
	{
		app.match.gameState = 1; 
	}

	function playMode()
	{
		app.match.gameState = 2;
	}
	
	function howTo()
	{
		app.match.gameState = 4;
	}

	function skipColor()
	{
		app.match.colorMatches = app.utils.setRandomColorAnswer();
	}

	function pause()
	{
		app.match.paused = !app.match.paused;
	}

	function quit()
	{
		app.match.gameState = 0;
		app.match.resetGameGlobals(); 
	}
	
	// the "public interface" of this module
	return{
		difficulty : difficulty,
		practiceMode : practiceMode,
		playMode : playMode,
		skipColor : skipColor,
		pause : pause,
		quit : quit,
		howTo : howTo,
	};
}(); 