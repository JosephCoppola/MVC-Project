"use strict";


var app = app || {};

app.match = {
	// CONSTANT properties
    WIDTH : 640, 
    HEIGHT: 480,
	SLIDERPADDING: 20,

	//Module
	app: undefined,
	//Array of RGB values i,i+1,i+2 is R,G,B
	colorMatches : [],
	//Canvas and ctx ref
    canvas: undefined,
    ctx: undefined,
    //Helper scripts
	drawLib: undefined,
	utils: undefined,
	buttonControls : undefined, 
	levels : undefined,
	dt: 1/60.0,
	//Holds Slider Values
	rgbValues : [],
	//Button arrays for various game states
	practiceButtons : [],
	menuButtons : [],
	pauseButtons : [],
	playButtons : [],
	//Array to hold levels and completed levels
	levelsArray : [],
	completedLevels : [],
	//Alpha values used to draw practice mode background
	backgroundAlphas : [],
	//Slider Logic
	dragging : false,
	selectedSlider : undefined,
	//Correct Logic
	correct : false,
	correctCounter : 0,
	correctGuesses : 0,
	mousePos : [],
	//Difficulty true: hard false: easy
	difficulty : true,
	//0 Menu, 1 Practice Matching, 2 Orbital Matching
	gameState : undefined,
	paused : false,
	//Time
	gTime : 0,
	elapsed : 0,
	
    // methods
	init : function() {
			console.log("app.match.init() called");
			// declare properties
			this.canvas = document.querySelector('canvas');
			this.canvas.width = this.WIDTH;
			this.canvas.height = this.HEIGHT;
			this.ctx = this.canvas.getContext('2d');
			this.rgbValues = [0,0,0];
			
			this.image = new Image();
			this.image.src = "ProgressPics/HowtoPlayPractice.png";
			
			this.gameState = 0;

			this.levelsArray = app.utils.loadLevels(this.levels.allLevels);
			
			this.practiceButtons[0] = new app.Button(this.ctx,50,25,"practice","Hard","#DB0000","red",100,50,30,function(){app.buttonControls.difficulty(app.match.difficulty)});
			this.practiceButtons[1] = new app.Button(this.ctx,50,this.HEIGHT - 70,"practice","Skip","green","#009900",100,50,30,function(){app.buttonControls.skipColor()});
			this.practiceButtons[2] = new app.Button(this.ctx,this.WIDTH - 150,this.HEIGHT - 70,"practice","Pause","#0000cc","blue",100,50,30,function(){app.buttonControls.pause()});
			
			this.playButtons[0] = new app.Button(this.ctx,this.WIDTH - 150,this.HEIGHT - 70,"practice","Pause","#0000cc","blue",100,50,30,function(){app.buttonControls.pause()});

			this.menuButtons[0] = new app.Button(this.ctx,this.WIDTH * 1/2,this.HEIGHT * 1/3,"menu","Play Mode","white","yellow",100,50,35,function(){app.buttonControls.playMode()});
			this.menuButtons[1] = new app.Button(this.ctx,this.WIDTH * 1/2,(this.HEIGHT * 1/3) + (this.HEIGHT * 1/4) ,"menu","Practice Mode","white","yellow",100,50,35,function(){app.buttonControls.practiceMode()});
			this.menuButtons[2] = new app.Button(this.ctx,this.WIDTH * 1/2,(this.HEIGHT * 1/3) + (this.HEIGHT * 1/2),"menu","How To Play","white","yellow",100,50,35,function(){app.buttonControls.howTo()});

			this.pauseButtons[0] = new app.Button(this.ctx,this.WIDTH * 1/2 - 50,this.HEIGHT * 1/3,"practice","Resume","green","#009900",100,50,25,function(){app.buttonControls.pause()});
			this.pauseButtons[1] = new app.Button(this.ctx,this.WIDTH * 1/2 - 50,this.HEIGHT * 1/3 + 75,"practice","Quit","#DB0000","red",100,50,25,function(){app.buttonControls.quit()});
			
			this.returnButton = new app.Button(this.ctx,this.WIDTH * 1/2 - 50,this.HEIGHT * 1/3,"practice","Return","#DB0000","red",100,50,25,function(){app.buttonControls.quit()});
			this.returnButton2 = new app.Button(this.ctx,this.WIDTH * 4/5,0 + 15,"menu","Return","black","yellow",100,50,25,function(){app.buttonControls.quit()});

			this.canvas.onmousedown = this.doMouseDown;
			this.canvas.onmouseup = this.doMouseUp;
			this.canvas.onmousemove = this.doMouseMove;
			this.canvas.onmouseout = this.doMouseOut;
			//window.onblur = function(){if(app.match.gameState != 0){app.match.paused = true; app.match.canvas.onmousedown = app.match.doMouseDown; app.match.canvas.onmousemove = app.match.doMouseMove;}};
			
			//Set initial guess
			this.colorMatches = this.utils.setRandomColorAnswer();
			//Set initial alphas
			this.backgroundAlphas = this.utils.checkAnswer(this.colorMatches,this.rgbValues,0,this.difficulty).alphas;
			
			this.soundtrack = createjs.Sound.play("soundtrack",{loop:-1,volume:0.4});

			this.update();
	},

	resetGameGlobals: function(){
		this.paused = false;
		this.correctCounter = 0;
		this.correctGuesses = 0;
		this.dragging = false;
		this.selectedSlider = undefined;
		this.rgbValues = [0,0,0];
		this.gTime = 0;
		this.elapsed = 0;
		//Set initial guess
		this.colorMatches = this.utils.setRandomColorAnswer();
		//Set initial alphas MAYBE ANOTHER INTIAL FUNCTION?
		this.backgroundAlphas = this.utils.checkAnswer(this.colorMatches,this.rgbValues,0,this.difficulty).alphas;
	},
	
	//GAME LOOP
	update: function(){
		requestAnimationFrame(this.update.bind(this));
		
		//Main Menu
		if(this.gameState == 0)
		{
			this.drawLib.clear(this.ctx,0,0,this.WIDTH,this.HEIGHT);

			//Draw menu background
			this.drawLib.drawMenuBackground(this.ctx,this.WIDTH,this.HEIGHT);

			//NEED FUNCTION Check buttons
			for(var i=0; i < this.menuButtons.length;i++)
			{
				this.menuButtons[i].update(this.mousePos);
			}

			this.drawGUI(this.ctx);

			this.ctx.save();
			this.ctx.fillStyle = "black";
			this.ctx.font="20px Georgia";
			this.ctx.fillText("Made by Joe Coppola",this.WIDTH - 100,this.HEIGHT - 35);
			this.ctx.fillText("Game still under construction! Expect regular updates!",this.WIDTH - 242,this.HEIGHT - 15);
			this.ctx.restore();
		}
		//Practice Mode
		else if(this.gameState == 1)
		{
			//Not paused
			if(!this.paused)
			{
				this.updateGame();
			
				this.drawLib.clear(this.ctx,0,0,this.WIDTH,this.HEIGHT);

				this.drawLib.drawPracticeBackground(this.ctx,this.WIDTH,this.HEIGHT,this.backgroundAlphas);

				this.drawGame();

				for(var i=0; i < this.practiceButtons.length;i++)
				{
					this.practiceButtons[i].update(this.mousePos);
				}
			}
			else //Paused
			{
				for(var i=0; i < this.pauseButtons.length;i++)
				{
					this.pauseButtons[i].update(this.mousePos);
				}
			}

			this.drawGUI(this.ctx);
		}
		//Play Mode
		else if(this.gameState == 2)
		{
			//Not paused
			if(!this.paused)
			{
				if(this.levelsArray.length == 0)
				{
					this.gameState = 3;
					return;
				}

				this.updateGame();
			
				this.drawLib.clear(this.ctx,0,0,this.WIDTH,this.HEIGHT);

				this.drawLib.drawPracticeBackground(this.ctx,this.WIDTH,this.HEIGHT,this.backgroundAlphas);

				this.drawGame();

				for(var i=0; i < this.playButtons.length;i++)
				{
					this.playButtons[i].update(this.mousePos);
				}

				this.elapsed++;

				this.gTime = parseInt(this.elapsed * this.dt);
			}
			else //paused
			{
				for(var i=0; i < this.pauseButtons.length;i++)
				{
					this.pauseButtons[i].update(this.mousePos);
				}
			}

			this.drawGUI(this.ctx);
		}
		else if(this.gameState == 3)
		{
			this.drawLib.clear(this.ctx,0,0,this.WIDTH,this.HEIGHT);

			this.ctx.save();
			this.ctx.fillStyle = "black";
			this.ctx.font="20px Georgia";
			this.ctx.fillText("You have completed all the levels, more coming soon!",this.WIDTH/2 - 230,this.HEIGHT/2);
			this.ctx.restore();
			
			this.returnButton.update(this.mousePos);
			this.returnButton.draw(this.ctx);
		}
		else if(this.gameState == 4)
		{
			this.drawLib.clear(this.ctx,0,0,this.WIDTH,this.HEIGHT);
			this.ctx.drawImage(this.image,0,0);
			this.returnButton2.update(this.mousePos);
			this.returnButton2.draw(this.ctx);
		}
	},
		
	drawGUI: function(ctx){
	//GUI drawing here	

		if(this.gameState == 0)
		{
			for(var i=0;i < this.menuButtons.length;i++)
			{
				this.menuButtons[i].draw(ctx);
			}
		}
		else if(this.gameState == 1)
		{
			//CorrectGuesses
			//drawScore: function(ctx,x,y,score,fontsize)
			this.drawLib.drawScore(this.ctx,this.WIDTH * .76,this.HEIGHT * .1,this.correctGuesses,27);
			
			for(var i=0; i < this.practiceButtons.length;i++)
			{
				this.practiceButtons[i].draw(ctx);
			}

			if(this.paused)
			{	
				ctx.save();
				ctx.fillStyle = "white";
				ctx.fillRect(this.WIDTH * 1/2 - 100,this.HEIGHT * 1/3 - 35,200,200);
				ctx.fillStyle = "rgba(0,0,255,.8)";
				ctx.fillRect(this.WIDTH * 1/2 - 100,this.HEIGHT * 1/3 - 35,200,200);
				ctx.fillRect(this.WIDTH * 1/2 - 90,this.HEIGHT * 1/3 - 25,180,180);
				ctx.restore();

				for(var i=0; i < this.pauseButtons.length;i++)
				{
					this.pauseButtons[i].draw(ctx);
				}
			}
		}
		else if(this.gameState == 2)
		{
			this.drawLib.drawScore(this.ctx,this.WIDTH * .76,this.HEIGHT * .1,this.correctGuesses,27);
			this.drawLib.drawTime(this.ctx,this.WIDTH * .12,this.HEIGHT * .1,this.levelsArray[0].remainingTime,27);

			for(var i=0; i < this.playButtons.length;i++)
			{
				this.playButtons[i].draw(ctx);
			}

			if(this.paused)
			{	
				ctx.save();
				ctx.fillStyle = "white";
				ctx.fillRect(this.WIDTH * 1/2 - 100,this.HEIGHT * 1/3 - 35,200,200);
				ctx.fillStyle = "rgba(0,0,255,.8)";
				ctx.fillRect(this.WIDTH * 1/2 - 100,this.HEIGHT * 1/3 - 35,200,200);
				ctx.fillRect(this.WIDTH * 1/2 - 90,this.HEIGHT * 1/3 - 25,180,180);
				ctx.restore();

				for(var i=0; i < this.pauseButtons.length;i++)
				{
					this.pauseButtons[i].draw(ctx);
				}
			}
		}
	},
	
	updateGame: function(){
		var correctAndAlphas = [];

		if(this.gameState == 1)
		{
			if(this.difficulty)
			{
				//If Hard checking the answer
				//ADJUST LEEWAY FOR HARD MODE
				correctAndAlphas = this.utils.checkAnswer(this.colorMatches,this.rgbValues,5,this.difficulty);
			}
			else
			{
				correctAndAlphas = this.utils.checkAnswer(this.colorMatches,this.rgbValues,10,this.difficulty);
			}
		}
		//Check for play mode
		else if(this.gameState == 2)
		{
			//Update level, check answer
			if(this.levelsArray[0].update(this.gTime))
			{
				//Ran out of time
				this.gameState = 3;
				return;
			}

			//If level is completed
			if(this.levelsArray[0].completed)
			{
				if(this.levelsArray.Count == 0)
				{
					return;
				}
				//Splice off finished level, add to completed list
				this.completedLevels.push(this.levelsArray.splice(0,1));

				//NEED CHECK FOR REMAINING LEVELS

				this.elapsed = 0;
				this.colorMatches = [this.levelsArray[0].colors[0],this.levelsArray[0].colors[1],this.levelsArray[0].colors[2]];
				return;
				//correctAndAlphas = {correct:false,alphas:[.3,.3,.3]};
			}
			else
			{
				correctAndAlphas = this.utils.checkAnswer(this.levelsArray[0].colors,this.rgbValues,15,this.difficulty);
			}
		}

		//Set correct if not already correct, used for radius animation
		//of Practice GUESS Feedback color circle in drawLib 
		if(!this.correct)
		{
			this.correct = correctAndAlphas.correct;
		}

		//Background Alphas set by correctAndAlphas.alphas
		this.backgroundAlphas = correctAndAlphas.alphas;
		
		//Last Frame of correct animation
		if(this.correct && this.correctCounter == 300)
		{
			this.canvas.onmousemove = this.doMouseMove;
			this.canvas.onmousedown = this.doMouseDown;
			this.correct = false;
			this.correctCounter = 0;
		}

		//First frame of correct answer
		if(this.correct && this.correctCounter == 0)
		{
			this.correctGuesses++;

			for(var i = 0; i < this.rgbValues.length; i++)
			{
				this.rgbValues[i] = 0;
			}

			if(this.gameState == 1)
			{
				this.colorMatches = this.utils.setRandomColorAnswer();
			}
			else if(this.gameState == 2)
			{
				//If level is complete
				if(!this.levelsArray[0].completed)
				{
					this.levelsArray[0].colors.splice(0,3);
					this.colorMatches = [this.levelsArray[0].colors[0],this.levelsArray[0].colors[1],this.levelsArray[0].colors[2]];
				}
			}
		}
	},
	
	//Draw sprites for the practice mode
	drawGame: function(){
		//Draw sliders
		for(var i = 1; i < 4; i++) {
			
			var sliderColor;
			
			switch(i)
			{
				case 1: 
					sliderColor = "red"; 
					break;
				case 2: 
					sliderColor = "green"; 
					break;
				case 3: 
					sliderColor = "blue"; 
					break;
				default: 
					break;
			}
			
			this.drawLib.slider(this.ctx,this.utils.findSliderXStart(i),380,sliderColor,app.utils.mapValue(this.rgbValues[i - 1],0,255,this.utils.findSliderXStart(i),this.utils.findSliderXEnd(i)));
		}
		
		//Draw color circles
		//If correct
		if(this.correct)
		{
			//Prevent input during correct animation
			this.canvas.onmousemove = null;
			this.canvas.onmousedown = null;
			this.drawLib.drawCorrectAnimation(this.ctx,this.correctCounter,this.WIDTH);	

			this.correctCounter++;
		}
		else
		{
			if(this.gameState == 1)
			{
				//If hard mode
				if(this.difficulty)
				{
					//Draw the two circles
					this.drawLib.feedbackColor(this.ctx,this.WIDTH * 1/3,200,60,this.utils.makeColor(this.colorMatches[0],this.colorMatches[1],this.colorMatches[2]));
					this.drawLib.feedbackColor(this.ctx,this.WIDTH * 2/3,200,60,this.utils.makeColor(parseInt(this.rgbValues[0]),parseInt(this.rgbValues[1]),parseInt(this.rgbValues[2])));
				}
				else
				{
					//Draw the two circles next to each other
					this.drawLib.feedbackColor(this.ctx,this.WIDTH * 1/3 + 75,200,60,this.utils.makeColor(this.colorMatches[0],this.colorMatches[1],this.colorMatches[2]));
					this.drawLib.feedbackColor(this.ctx,this.WIDTH * 2/3 - 75,200,60,this.utils.makeColor(parseInt(this.rgbValues[0]),parseInt(this.rgbValues[1]),parseInt(this.rgbValues[2])));
				}
			}
			else if(this.gameState == 2)
			{
				//Draw the two circles
				this.drawLib.feedbackColor(this.ctx,this.WIDTH * 1/3,200,60,this.utils.makeColor(this.levelsArray[0].colors[0],this.levelsArray[0].colors[1],this.levelsArray[0].colors[2]));
				this.drawLib.feedbackColor(this.ctx,this.WIDTH * 2/3,200,60,this.utils.makeColor(parseInt(this.rgbValues[0]),parseInt(this.rgbValues[1]),parseInt(this.rgbValues[2])));
			}
		}
	},
	
	//All mouse functions
	doMouseDown: function(e){
		app.match.dragging = true;
		var mouse = {}
		mouse.x = e.pageX - e.target.offsetLeft;
		mouse.y = e.pageY - e.target.offsetTop;

		if(!app.match.paused)
		{
			for(var i = 1; i < 4; i++)
			{
				//Check which slider is selected
				if(app.utils.mouseContains(app.utils.mapValue(app.match.rgbValues[i - 1],0,255,app.utils.findSliderXStart(i),app.utils.findSliderXEnd(i)),380,15,15,mouse.x,mouse.y,5))
				{
					if(i==1)
					{
						//console.log("1");
						app.match.selectedSlider = 1;
					}
					else if(i==2)
					{
						//console.log("2");
						app.match.selectedSlider = 2;
					}
					else
					{
						//console.log("3");
						app.match.selectedSlider = 3;
					}
				}
			}
		}
	},	
	
	doMouseMove: function(e){

		var mouse = app.match.getMouse(e);

		if(!app.match.paused)
		{
			if(app.match.dragging)
			{
				if(app.match.selectedSlider == 1)
				{
					if(mouse.x > app.utils.findSliderXStart(1) && mouse.x < app.utils.findSliderXEnd(1))
					{
						app.match.rgbValues[0] = app.utils.mapValue(mouse.x,app.utils.findSliderXStart(1),app.utils.findSliderXEnd(1),0,255);
					}
				}
				else if(app.match.selectedSlider == 2)
				{
					if(mouse.x > app.utils.findSliderXStart(2) && mouse.x < app.utils.findSliderXEnd(2))
					{
						app.match.rgbValues[1] = app.utils.mapValue(mouse.x,app.utils.findSliderXStart(2),app.utils.findSliderXEnd(2),0,255);
					}
				}
				else if(app.match.selectedSlider == 3)
				{
					if(mouse.x > app.utils.findSliderXStart(3) && mouse.x < app.utils.findSliderXEnd(3))
					{
						app.match.rgbValues[2] = app.utils.mapValue(mouse.x,app.utils.findSliderXStart(3),app.utils.findSliderXEnd(3),0,255);
					}
				}
			}
		}

		app.match.mousePos = mouse;
	},

	doMouseUp: function(e){
		app.match.dragging = false;
		app.match.selectedSlider = undefined;
	},
	
	doMouseOut: function(e){
		app.match.dragging = false;
		app.selectedSlider = undefined;
	},
	
	getMouse: function(e){
		var mouse = {}
		var rect = app.match.canvas.getBoundingClientRect();
		mouse.x = e.clientX - rect.left;
		mouse.y = e.clientY - rect.top;
		return mouse;
	},
}; // end app.match