// ship.js
// Dependencies: 
// Description: singleton object that is a module of app
// properties of the ship and what it needs to know how to do go here

"use strict";

// if app exists use the existing copy
// else create a new object literal
var app = app || {};

// the 'ship' object literal is now a property of our 'app' global variable
app.drawLib = {
		menuBackground : new Array( 
			{color:"red", stopPercent:0},
 			{color:"purple", stopPercent:.2},
 			{color:"aqua", stopPercent:.4},
 			{color:"yellow", stopPercent:.6},
 			{color:"green", stopPercent:.8}),

		gameBackground : new Array(
			{color:"rgba(170,0,0,.8)", drawCall:2, radius:1 * 200},
			{color:"rgba(0,170,0,.8)", drawCall:1, radius:2 * 200},
			{color:"rgba(0,0,170,.8)", drawCall:0, radius:3 * 200}),

		clear : function(ctx,x,y,w,h){
			ctx.clearRect(x,y,w,h);
		},

		drawCorrectAnimation: function(ctx,correctCounter,WIDTH)
		{
			//Correct Animation
			if(correctCounter == 50 || correctCounter == 150 || correctCounter == 250)
			{
				this.color = "green";
				this.guessColor = "green";
			}
			else if(correctCounter == 0 || correctCounter == 100 || correctCounter == 200)
			{
				this.color = "black";
				this.guessColor = "black";
			}			
			
			this.feedbackColor(ctx,WIDTH * 2/3,200,60,this.color);
			
			if(correctCounter >= 150)
			{
				var rgbMatches = app.match.colorMatches;
				var radius = app.utils.mapValue(correctCounter,150,300,0,60);
				this.guessColor = "rgb(" + rgbMatches[0] + "," + rgbMatches[1] + "," + rgbMatches[2] + ")"; 
				this.feedbackColor(ctx,WIDTH * 1/3,200,radius,this.guessColor);
			}
			else
			{
				this.feedbackColor(ctx,WIDTH * 1/3,200,60,this.guessColor);
			}
		},
		
		drawScore: function(ctx,x,y,score,fontSize)
		{
			var string = "Correct Guesses: " + score;

			ctx.save();

			ctx.font = "bold " + app.utils.makeFont(fontSize, "sans-serif");

			var stringWidth = ctx.measureText(string).width;

			//White background
			ctx.fillStyle = "rgba(255,255,255,.5";
			ctx.fillRect(x - stringWidth/2 - 2.5,y - ctx.measureText("M").width/2 - 2.5,stringWidth + 5,ctx.measureText("M").width + 5);

			ctx.fillStyle = "black";
			//Global utils
			ctx.textAlign="center";
			ctx.textBaseline = "middle";
			
			ctx.fillText(string,x,y);
			ctx.restore();
		},

		drawTime: function(ctx,x,y,time,fontSize)
		{
			var string = "Time: " + time;

			ctx.save();

			ctx.font = "bold " + app.utils.makeFont(fontSize, "sans-serif");

			var stringWidth = ctx.measureText(string).width;

			//White background
			ctx.fillStyle = "rgba(255,255,255,.5";
			ctx.fillRect(x - stringWidth/2 - 2.5,y - ctx.measureText("M").width/2 - 2.5,stringWidth + 5,ctx.measureText("M").width + 5);

			ctx.fillStyle = "black";
			//Global utils
			ctx.textAlign="center";
			ctx.textBaseline = "middle";
			
			ctx.fillText(string,x,y);
			ctx.restore();
		},

		drawMenuBackground: function(ctx,w,h)
		{
			ctx.save();

			this.rect(ctx,(w/4 + 15),h/6 - 5,290,160,"white");
			this.rect(ctx,(w/4 + 20),h/6,280,150,"black");
			ctx.font = "bold " + app.utils.makeFont(50, "sans-serif");
			ctx.fillStyle = "white";
			ctx.fillText("Match",w/2,h/6 + 25);

			this.rect(ctx,(w/4 + 15),(h * 1/3 - 25),290,(h * 3/4) - (h * 1/4) + 50,"white");
			this.rect(ctx,(w/4 + 20),(h * 1/3 - 20),280,(h * 3/4) - (h * 1/4) + 40,"black");

			ctx.globalCompositeOperation = "overlay";
			var gradient = ctx.createRadialGradient(w/2,h/2,0,w/2,w/2,550);
			

			for (var i=0; i < this.menuBackground.length; i++) 
			{     
		   		var tempColorStop = this.menuBackground[i];     
		   		var tempColor = tempColorStop.color;     
		   		var tempStopPercent = tempColorStop.stopPercent;     
		   		gradient.addColorStop(tempStopPercent,tempColor);    
		   		tempStopPercent += .003;     
		   		if (tempStopPercent > 1)
		   		{
		       		tempStopPercent = 0;
		       		tempColorStop.color = "rgb(" + app.utils.setRandomColorAnswer() + ")";
		   		}
		   		tempColorStop.stopPercent = tempStopPercent;;
		   		this.menuBackground[i] = tempColorStop;
			}

			ctx.fillStyle = gradient;
			ctx.fillRect(0,0,w,h);
			ctx.restore();
		},

		drawPracticeBackground: function(ctx,w,h,alphas)
		{
			this.gameBackground[0].color = "rgba(170,0,0," + alphas[0] + ")";
			this.gameBackground[1].color = "rgba(0,170,0," + alphas[1] + ")";
			this.gameBackground[2].color = "rgba(0,0,170," + alphas[2] + ")";

			ctx.save();
			//ctx.globalCompositeOperation = "overlay";

			for(var j=0; j < this.gameBackground.length; j++)
			{
				this.gameBackground[j].radius--;
				if(this.gameBackground[j].radius < 0)
				{
					this.gameBackground[j].radius = 3 * 200;
				}

				if(this.gameBackground[j].radius >= 0 && this.gameBackground[j].radius < 1 * 200)
				{
					this.gameBackground[j].drawCall = 2;
				}
				else if(this.gameBackground[j].radius >= 1 * 200 && this.gameBackground[j].radius < 2 * 200)
				{
					this.gameBackground[j].drawCall = 1;
				}
				else
				{
					this.gameBackground[j].drawCall = 0;
				}

				var circle = [];

				for(var i=0; i < this.gameBackground.length; i++)
				{
					if(this.gameBackground[i].drawCall == j)
					{
						circle.color = this.gameBackground[i].color;
						circle.radius = this.gameBackground[i].radius;
					}
				}

				ctx.fillStyle = "white";
				ctx.beginPath();
				ctx.arc(w/2,h/2,circle.radius + 5,0,2*Math.PI,false);
				ctx.fill();

				ctx.fillStyle = circle.color;
				ctx.beginPath();
				ctx.arc(w/2,h/2,circle.radius,0,2*Math.PI,false);
				ctx.fill();
			}

			ctx.restore();
		},
	 
		rect: function(ctx,x,y,w,h,col){
			ctx.save();
			ctx.fillStyle = col;
			ctx.fillRect(x,y,w,h);
			ctx.restore();
		},
		
		//Slider that will be made in canvas using initial x and y
		//with a set width of 100. Then depending on the current value the slider
		//will draw the rect where necessary
		slider: function(ctx,x,y,col,currVal){
			ctx.save();
			ctx.strokeStyle = "black";
			ctx.lineWidth = 8;
			ctx.beginPath();
			ctx.moveTo(x,y);
			ctx.lineTo(x+150,y);
			ctx.stroke();
			ctx.restore();
			this.rect(ctx,currVal,y - 7.5,15,15,col);
		},
		
		//Elements that will be drawn to the screen
		feedbackColor: function(ctx,x,y,r,col){
			ctx.save();
			ctx.fillStyle = col;
			ctx.beginPath();
			ctx.arc(x,y,r,0,2*Math.PI,false);
			ctx.fill();
			ctx.restore();
		},
		
		//Ingame Buttons
		drawGameButton: function(ctx,x,y,width,height,string,centroid,outerColor,innerColor,fontSize,sizeMultipler){
			var innerWidth = width * sizeMultipler;
			var innerHeight = height * sizeMultipler;
			var innerX = centroid[0] - innerWidth/2;
			var innerY = centroid[1] - innerHeight/2;
			ctx.save();
			//Outer
			ctx.fillStyle = outerColor;
			ctx.fillRect(x,y,width,height);
			ctx.beginPath();
			ctx.arc(x,y + height/2,height/2,0,2*Math.PI,false);
			ctx.fill();
			ctx.beginPath();
			ctx.arc(x + width,y + height/2,height/2,0,2*Math.PI,false);
			ctx.fill();
			//Inner 
			ctx.fillStyle = innerColor;
			ctx.fillRect(innerX,innerY,innerWidth,innerHeight);
			ctx.beginPath();
			ctx.arc(innerX,innerY + innerHeight/2,innerHeight/2,0,2*Math.PI,false);
			ctx.fill();
			ctx.beginPath();
			ctx.arc(innerX + innerWidth,innerY + innerHeight/2,innerHeight/2,0,2*Math.PI,false);
			ctx.fill();

			ctx.fillStyle = "black";
			//Global utils
			ctx.font = "bold " + app.utils.makeFont(fontSize, "sans-serif");
			ctx.textAlign="center";
			ctx.textBaseline = "middle";
			ctx.fillText(string,x + width/2,y + height/2);
			ctx.restore();
		},

		drawTextButton: function(ctx,x,y,string,fillStyle,fontSize)
		{
			ctx.font = "bold " + app.utils.makeFont(fontSize, "sans-serif");
			ctx.textAlign="center";
			ctx.textBaseline = "middle";
			ctx.fillStyle = fillStyle;
			ctx.fillText(string,x,y);
		},
	};