"use strict";
var app = app || {};

app.Button = function(){

	//Ingame buttons 
	function Button(ctx,x,y,id,string,outerColor,innerColor,width,height,fontSize,doFunction)
	{
		this.id = id;
		this.ctx = ctx;
		this.string = string;
		this.outerColor = outerColor;
		this.innerColor = innerColor;
		this.x = x;
		this.y = y;
		if(id == "menu")
		{
			ctx.save();
			ctx.font = "bold " + app.utils.makeFont(fontSize, "sans-serif");
			this.width = ctx.measureText(string).width;
			this.height = ctx.measureText("M").width;
			ctx.restore();
		}
		else if(id == "practice")
		{	
			this.width = width;
			this.height = height;
		}
		this.fontSize = fontSize;
		this.utils = app.utils;
		this.drawLib = app.drawLib;
		this.centroid = this.utils.getCentroid(x,y,width,height);
		this.checked = false;
		this.hover = false;
		this.idle = false;
		this.released = true;
		this.doFunction = doFunction;
	};
	
	var b = Button.prototype;
	
		b.draw = function(ctx){

			if(this.id == "menu")
			{
				if(this.idle)
				{
					this.drawLib.drawTextButton(ctx,this.x,this.y,this.string,this.outerColor,this.fontSize);
				}
			 	else if(this.hover && !this.checked)
				{
					this.drawLib.drawTextButton(ctx,this.x,this.y,this.string,this.innerColor,this.fontSize + 2);
				}
				else
				{
				 	 this.drawLib.drawTextButton(ctx,this.x,this.y,this.string,this.innerColor,this.fontSize - 2);
				}
			}
			else if(this.id == "practice")
			{
				if(this.idle)
				{
					//drawGameButton: function(ctx,x,y,width,height,string,centroid,outerColor,innerColor,fontSize,sizeMultipler)
					this.drawLib.drawGameButton(ctx,this.x,this.y,this.width,this.height,this.string,this.centroid,this.outerColor,this.innerColor,this.fontSize,.75);
				}
			 	else if(this.hover && !this.checked)
				{
					this.drawLib.drawGameButton(ctx,this.x,this.y,this.width,this.height,this.string,this.centroid,this.outerColor,this.innerColor,this.fontSize + 4,.8);
				}
				else
				{
				 	this.drawLib.drawGameButton(ctx,this.x,this.y,this.width,this.height,this.string,this.centroid,this.outerColor,this.outerColor,this.fontSize,.75);
				}
			}
		};
		
		b.update = function(mouse){
			//Check if they are being clicked
			if(this.id == "menu")
			{
				this.buttonCheck(mouse,this.x - this.width/2,this.y - this.height/2,this.height,this.width)
			}
			else if(this.id == "practice")
			{
				this.buttonCheck(mouse,this.x - this.height/2,this.y,this.height,this.width + this.height);
			}
		};

		b.buttonCheck = function(mouse,x,y,height,width)
		{			
			//console.log(y);
			//mousecontains(x,y,height,width,mouseX,mouseY,leeway)
			if(this.utils.mouseContains(x,y,height,width,mouse.x,mouse.y,0))
			{
				//Mouse is within bounds of button
				//Check what is happening to the button
				this.buttonLogic();	
			}
			else
			{
				//Mouse is not near button
				this.hover = false;
				this.idle = true;
				this.checked = false;
			}
		};

		b.buttonLogic = function()
		{
			this.lastChecked;

			if(app.match.dragging)
			{
				console.log("clicked");
				this.checked = true;
				this.released = false;
				this.hover = false;
			}
			else
			{
				this.hover = true;
				this.released = true;
				this.checked = false;
			}
			
			if(this.released && !this.checked && this.lastChecked)
			{
				this.doFunction();
			}

			this.idle = false;
			
			this.lastChecked = this.checked;

		};
	
	// the "prototype" of this module
	return Button;
}(); 
