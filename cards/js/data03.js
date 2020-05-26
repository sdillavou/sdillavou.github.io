$(document).ready(function() {

// 1-10 of each color (blue, red, green, orange, yellow, purple)
regularCards = [
	[1, "red", "play", 0],
	[2, "red", "play", 0],
	[3, "red", "play", 0],
	[4, "red", "play", 0],
	[5, "red", "play", 0],
	[6, "red", "play", 0],
	[7, "red", "play", 0],
	[8, "red", "play", 0],
	[9, "red", "play", 0],
	[10,"red", "play", 0],

	[1, "blue", "play", 0],
	[2, "blue", "play", 0],
	[3, "blue", "play", 0],
	[4, "blue", "play", 0],
	[5, "blue", "play", 0],
	[6, "blue", "play", 0],
	[7, "blue", "play", 0],
	[8, "blue", "play", 0],
	[9, "blue", "play", 0],
	[10,"blue", "play", 0],

	[1, "green", "play", 0],
	[2, "green", "play", 0],
	[3, "green", "play", 0],
	[4, "green", "play", 0],
	[5, "green", "play", 0],
	[6, "green", "play", 0],
	[7, "green", "play", 0],
	[8, "green", "play", 0],
	[9, "green", "play", 0],
	[10,"green", "play", 0],

	[1, "orange", "play", 0],
	[2, "orange", "play", 0],
	[3, "orange", "play", 0],
	[4, "orange", "play", 0],
	[5, "orange", "play", 0],
	[6, "orange", "play", 0],
	[7, "orange", "play", 0],
	[8, "orange", "play", 0],
	[9, "orange", "play", 0],
	[10,"orange", "play", 0],

	[1, "yellow", "play", 0],
	[2, "yellow", "play", 0],
	[3, "yellow", "play", 0],
	[4, "yellow", "play", 0],
	[5, "yellow", "play", 0],
	[6, "yellow", "play", 0],
	[7, "yellow", "play", 0],
	[8, "yellow", "play", 0],
	[9, "yellow", "play", 0],
	[10,"yellow", "play", 0],

	[1, "purple", "play", 0],
	[2, "purple", "play", 0],
	[3, "purple", "play", 0],
	[4, "purple", "play", 0],
	[5, "purple", "play", 0],
	[6, "purple", "play", 0],
	[7, "purple", "play", 0],
	[8, "purple", "play", 0],
	[9, "purple", "play", 0],
	[10,"purple", "play", 0]
];

// 10 special cards	
specialCards = [
	["wild", "special" ,"play", 0],
	["wild", "special" ,"play", 0],
	["any 8", "special" ,"play", 0],
	["1, 2, or 3", "special" ,"play", 0],
	["mud", "special" ,"flag", 0],
	["fog", "special" ,"flag", 0],
	["deserter", "special" ,"change", 0],
	["redeploy", "special" ,"change", 0],
	["traitor", "special" ,"change", 0],
	["scout", "special" , "scout", 0]
];

playerField = [
	[],[],[],[],[],[],[],[],[]
];

computerField = [
	[],[],[],[],[],[],[],[],[]
];

discardPile = [];

flags = [
	["center",""],
	["center",""],
	["center",""],
	["center",""],
	["center",""],
	["center",""],
	["center",""],
	["center",""],
	["center",""]
];

});
