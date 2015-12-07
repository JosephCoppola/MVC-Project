/*
loader.js
variable 'app' is in global scope - i.e. a property of window.
app is our single global object literal - all other functions and properties of 
the game will be properties of app.
*/
"use strict";

// if app exists use the existing copy
// else create a new object literal
var app = app || {};


app.KEYBOARD = {

};

app.keydown = {};

app.queue

window.onload = function(){
	console.log("window.onload called");
	app.match.app = app;
	app.match.levels = app.levelsFile;
	app.match.drawLib = app.drawLib;
	app.match.utils = app.utils;
	app.match.buttonControls = app.buttonControls;

	app.queue = new createjs.LoadQueue(false);
	app.queue.installPlugin(createjs.Sound);

	app.queue.on("complete",function(){
		app.match.init();
	});

	app.queue.loadManifest([
		{id: "soundtrack", src: "sounds/soundtrack.mp3"},
	]);
	
}