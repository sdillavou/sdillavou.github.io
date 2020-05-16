$(document).ready(function() {
/* (A) Create or load (from cookie) link information, then insert into HTML (#box) */

	var widthBase;
	var spacing;
	var helpCounter = 4;
	

	var sites = JSON.parse(localStorage.sites);
	var storedInfo = JSON.parse(localStorage.storedInfo);
		
	//sorts sites
	sites = sortSites(sites);


	//create local storage with sites[][]
	localStorage.sites = JSON.stringify(sites);	
	localStorage.storedInfo = JSON.stringify(storedInfo);
	
	redoHTML(); //put sites in order into html
	setSize();



	//Sets sizes of visible/invisible elements to match window if windowArea changes
	function setSize() {

		for (var i = 1; i < 2; i++) {

			widthBase = 50;

			spacing = Math.round(Math.max(widthBase*.8 / 18, 3));
			paddingLeft = Math.round(Math.max((widthBase - widthBase*.8) / 2, 0));
			
			$(".imgbox").css({
				"width": (widthBase),
				"margin-top": spacing,
				"margin-right": spacing/2,
				"margin-left": spacing/2,
			});

			$(".imgbox img").css({
				"width": widthBase*.8,
				"height": widthBase*.8,
				"margin":0,
				"padding":0,
				"margin-left":paddingLeft
			});
			
			$("p").css({
				"margin-left": Math.round(.06*widthBase),
				"margin-top": Math.round(.02*widthBase*.8),
				"font-size": Math.round(range(widthBase*.8/5+2,14,22)*.5)
			});	


			$("#box").css({
				"width": 1000,
				"height":450,
				"margin-top":150
			});
			
		}
	}


	/* (C) Functions */
	

	//changes site matrix sites into HTML code
	function redoHTML() {
		var x = '';
		sites = sortSites(sites);
		for (var i = 1; i < sites.length; i++) {
			x = x + '<div id="'+sites[i][2]+'" class="imgbox" style="background:' + sites[i][1] +
			'; height:'+(sites[i][4]*2)+'px; left:'+(((i+19)%20)*50)+'px; bottom:'+(-((i-(i+19)%20)/20)*100+350)+'px"><p style="color:black'+
			';">'+sites[i][4]+'</p><image src="' + sites[i][3] + '" id="' + sites[i][2] + '"></div>';	
		}
	
		$("#box").html(x);
		
	}
	
	
		//sorts sites
	function sortSites(x) {
		x = x.sort(function(a, b) {
			if (a[0] > b[0]) {return -1;}
			else if (a[0] < b[0]) {return 1;}
			else {return 0;}
		});
		for(var i = 1; i<x.length; i++){x[i][0] = x.length-i;}
		return x;
	}

	
	//returns the input unless outside of min-max range, then returns min or max
	function range(input,min,max) {
		if(min > max) { var x = min; min = max; max = x;}
		return Math.max(Math.min(input,max),min);
	}
	
	function toHomePage() {
		localStorage.sites = JSON.stringify(sites);
		localStorage.storedInfo = JSON.stringify(storedInfo);
		$("#box").animate({"left":+$(window).width()*1.2},400);
		$("#helpDiv").animate({"left":+$(window).width()*1.2},400);
		setTimeout(function(){window.location.href = 'index.html';},300);
			}

	


	

		

});