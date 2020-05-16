$(document).ready(function() {

	var searchBars
	var widthBase;
	var buttonWidth;
	var buttonHeight;
	var searchWidth;
	var searchFont;
	var searchHeight;
	var spacing;
	var timeColor = "white";
	var timeBackground = "#807050";
	var pIndex = -1;
	var sites;
	var storedInfo;
	var isWorking = false;
	var isIE = (navigator.appName == "Microsoft Internet Explorer");
	var isFirefoxSafari = (navigator.appName == "Netscape");
	var error1 = false;
	var buttonPadWidth;
	var buttonRatio;

/* (A) load link information from local storage, then insert into HTML (#box). If doesn't exist, go to Homepage2B*/

	
	try{
		sites = JSON.parse(localStorage.sites);
		storedInfo = JSON.parse(localStorage.storedInfo);
		sites[19][4];
		storedInfo[2] = 3;
	} catch(err) {
		window.location.href = 'HomePage2B.html';
		error1 = true;
	}
	if(!error1){
		try{
			searchBars = JSON.parse(localStorage.searchBars);
		} catch(err) {
			window.location.href = 'HomePage3.html';
		}
	}



	sites = sortSites(sites,true);
	
	$("#box").html(extract(sites,storedInfo));

/* (B) Initiate css sizes, date and time, and search bar/buttons, update every second */
	var countersOn = false;
	
	setSize();
	defineDateTime();
	setInterval(defineDateTime, 1000);

	if(storedInfo[7] !== 0){
		if(storedInfo[7]==1){$('#box').css({"left":-$(window).width()});}
		else{$('#box').css({"left":$(window).width()});}
		$('#box').animate({"left":0},400);
		storedInfo[7] = 0;
		localStorage.storedInfo = JSON.stringify(storedInfo);
		}

/* (C) Clicking anywhere on the site */


	//add to counters within local storage when link is clicked
	$(document).on('click',"html",function(event) {
		for (var i = 0; i < sites.length; i++) {
			if (event.target.id == sites[i][2]) {
				sites[i][4] = sites[i][4] + 1;
				localStorage.sites = JSON.stringify(sites);
			}
		}
	});
	
	//click on #time
	$(document).on('click',"#time",function(){
		$('#box').animate({"left":$(window).width()},400);
		setTimeout(function()
		{window.location.href = 'HomePage3.html';},300);
	});

	$(document).on('click',"#date",function(){
		$('#box').animate({"left":-$(window).width()},400);
		setTimeout(function()
		{window.location.href = 'HomePage2B.html';},300);
		});
		
		
/* (D) Change search bar and highlighted button with keys and clicks */
		
	//switch to appropriate search bar when search icon is clicked
	$(document).on('click','.button',function(event) {
		for (var i = 0; i < 7; i++) {
			if (event.target.id == searchBars[i][1]) {
				go(searchBars[i][3]);
			}
		}
	});

	$("html").keyup(function(e){
		if(e.keyCode == 16) {if(countersOn){showCounters();}}
	});

	//change search bar and highlighted button with left and right keys
	$("html").keydown(function(e) {
		if (e.keyCode == 37) {  go((storedInfo[2]+6)%7); } 					//left arrow
		if (e.keyCode == 39) {  go((storedInfo[2]+8)%7); } 					//right arrow
		if (e.keyCode == 16) { if(!countersOn){showCounters(); }}

		var winHeight = $(window).height();
		if (e.keyCode == 38) {												//up arrow
			
			if(e.altKey) {
				if(storedInfo[1]) {storedInfo[4] = storedInfo[4]+10; setSize();localStorage.storedInfo = JSON.stringify(storedInfo);}
				else {storedInfo[5] = storedInfo[5]+10; setSize();localStorage.storedInfo = JSON.stringify(storedInfo);}
			}else{
				if(!isWorking && storedInfo[1] == false){
					isWorking = true;
					$('#box').animate({"top":winHeight},300);
					setTimeout(function(){
						storedInfo[1]=true;
						$("#box").html(extract(sites,storedInfo)); //put sites in order into html
			
						setSize();
						defineDateTime();
						$('#box').css("top",(-winHeight));
						$('#box').animate({"top":0},300);
						
						localStorage.storedInfo = JSON.stringify(storedInfo);
						setTimeout(function() {isWorking = false;},350);
					},330);
				}
			}
	
		}
		if (e.keyCode == 40) {												//down arrow
			if(e.altKey) {
				if(storedInfo[1]) {storedInfo[4] = storedInfo[4]-10; setSize();localStorage.storedInfo = JSON.stringify(storedInfo);}
				else {storedInfo[5] = storedInfo[5]-10; setSize();localStorage.storedInfo = JSON.stringify(storedInfo);}
			}else{
				if(!isWorking && storedInfo[1] == true){
					isWorking = true;
					$('#box').animate({"top":-winHeight},300);
					setTimeout(function(){
						storedInfo[1]=false;
						$("#box").html(extract(sites,storedInfo)); //put sites in order into html

						setSize();
						defineDateTime();
						$('#box').css("top",(winHeight));
						$('#box').animate({"top":0},300);
						
						localStorage.storedInfo = JSON.stringify(storedInfo);
						setTimeout(function() {isWorking = false;},350);
					},330);
				}
			}

		}
	});

	
	/* (B) Functions */
	
	//updates clock and date
	function defineDateTime() {
		var currentTime = new Date();
		if (currentTime.getMinutes() < 10) var a = "0" + currentTime.getMinutes();
		else var a = currentTime.getMinutes();
		$("#time").html(((((currentTime.getHours() + 11) % 12) + 1) + ":" + a)+'<div id="arrow1" class="arrow"><img src="arrow.png"></div>');
		$("#date").html((currentTime.getMonth() + 1) + "/" + currentTime.getDate()+'<div id="arrow2" class="arrow"><img src="arrow2.png"></div>');
		var arrowWidth = spacing*4;
		$(".arrow img").css({"width":arrowWidth, "height":arrowWidth, "top":-arrowWidth-spacing/2, "z-index":pIndex});
		$("#arrow1 img").css({"left":spacing});
		$("#arrow2 img").css({"left":widthBase-arrowWidth-spacing});
	}

	//Sets sizes of visible/invisible elements to match window 
	function setSize() {
	
				setTimeColor();
				
				if(typeof storedInfo[5] == undefined) { storedInfo[5] = 120; }
				storedInfo[5] = range(storedInfo[5],90,10*Math.ceil(($(window).width()/9)/10));
				if(typeof storedInfo[4] == undefined) { storedInfo[4] = 130; }
				storedInfo[4] = range(storedInfo[4],110,10*Math.ceil(($(window).width()/7)/10));
				
				var box2Width;
				var buttonPadding;
				
				if(storedInfo[1]) {
					widthBase = storedInfo[4];
					spacing = Math.round(widthBase * .04);
					buttonPadding = spacing;
					searchWidth = widthBase * 4 + spacing*4;
					box2Width = widthBase * 4 + spacing * 3;
					buttonWidth = Math.round((box2Width-6*buttonPadding)/7);
					buttonRatio = .5;
				} else { 
					widthBase = storedInfo[5];
					spacing = Math.round(widthBase*.04);
					buttonPadding = spacing;
					searchWidth = widthBase * 5 + spacing * 5;
					box2Width = widthBase * 5 + spacing * 4;
					buttonWidth = Math.round((box2Width-6*buttonPadding)/7);
					buttonRatio = .5;
					$("#box2").css({"margin-left":widthBase+spacing});
				}
				var heightBase = Math.round(widthBase*1);
				
				
				buttonHeight = buttonWidth*buttonRatio;
				
				$(".buttonpadder").css({
					"height": buttonHeight
				});
				
				//adjusts button padding widths to whole numbers, so that edges align on far right.
				var totalPaddingWidth = box2Width - buttonWidth*7;
				var totalPadding = 0;
				for(var i=0; i<6; i++){
					$("#buttonpadder"+i).css({	"width": Math.round((totalPaddingWidth-totalPadding)/(6-i))	});
					totalPadding = totalPadding+Math.round((totalPaddingWidth-totalPadding)/(6-i));
				}
				
				
	
				
				if(storedInfo[1]) {
					searchHeight = range(Math.round(buttonWidth / 2.4), 16, 32);
				} else { 
					searchHeight = range(Math.round(buttonWidth / 3), 16, 32);
				}
				
				searchFont = Math.round(searchHeight*2/3.5);
				
				
				if(storedInfo[1]) {
					$("#box").css({"width": (widthBase + spacing) * 4 ,  "height": ((heightBase + spacing) * 3) +spacing*8+buttonHeight+buttonPadding+searchHeight});
					$("#box2").css({"float":"left"});
				} else { 
					$("#box").css({"width": (widthBase + spacing) * 7 ,  "height": ((heightBase + spacing)*4)+spacing*8+buttonHeight+buttonPadding+searchHeight});
					$("#box2").css({"float":"left"});
				}
				
				$(".imgbox").css({
					"width": (widthBase+heightBase)/2,
					"height": heightBase,
					"padding-left": (widthBase-heightBase)/2,
					"margin-top":spacing,
					"margin-right":spacing
				});
				$(".fakeimg").css({
					"width": widthBase,
					"height": heightBase,
					"line-height": heightBase  +    "px",
					"margin-top":spacing,
					"margin-right":spacing,
					"font-size": widthBase*.3
				});
				
				$("#box img").css({
					"width": heightBase,
					"height": heightBase
				});
				$("p").css({
					"margin-left": widthBase*.05,
					"margin-top": widthBase*.02,
					"font-size": Math.round(range(widthBase*.2,10,18)),
					"z-index": pIndex
				});	

				$("#box").css({"margin-top": ($(window).height() - $("#box").height()) / 2.5});

				$("#box").css({
					"padding-top":spacing*2,
					"padding-right":spacing*2,
					"padding-left":spacing*3,

					"padding-bottom":spacing*3
				});

				$("#time").css({"color":timeColor, "background":timeBackground});
				$("#date").css({"color":timeColor, "background":timeBackground});

				$(".button").css({
					"width": buttonWidth,
					"height": buttonHeight
				});
				
				var buttonImageHeight = buttonHeight;
				var buttonImageWidth = buttonHeight/.8;
				var buttonImageBorder = (buttonWidth-buttonImageWidth)/2;
				
				$(".button img").css({
					"width": buttonImageWidth,
					"height": buttonImageHeight,
					"margin-left":buttonImageBorder,
				});
				
				$("#searcher").css({
					"height": searchHeight,
					"width": searchWidth,
					"margin-top": buttonPadding
				});
				
				$("#box2").css({
					"margin-bottom":spacing/2,
					"margin-top":spacing*8,
				});
				
				$(".coverup").css({ //dimensions only apply to large homepage
					"width":(widthBase*7+spacing*7-searchWidth)/2,
					"height":buttonHeight+searchHeight+buttonPadding+spacing*6,
					"bottom":0,
				});
				
				$("#coverup1").css({
					"left":0
				});
				
				$("#coverup2").css({
					"right":0
				});
				
				$("#coverup0").css({ //bar separating search from links
					"width":"100%",
					"height":spacing*2,
					"bottom":buttonHeight+searchHeight+buttonPadding+spacing*6,
					"left":0
				});
			
				
				go(storedInfo[2]);
			
		
	}


	/* (C) Functions */
	
	//changes site matrix a into HTML code
	function extract(a,b) {
		var x = '<a href="HomePage4.html"><div id="coverup0" class="coverup"></div></a>';
		if(b[1]){
			for (var i = 1; i < 6; i++) {
				x = x + stitch(a[i]); }
			x = x + '<a href="javascript:;"><div id="time" class="fakeimg"></div></a>';
			x = x + '<a href="javascript:;"><div id="date" class="fakeimg"></div></a>';
			for (var i = 6; i < 11; i++) {
				x = x + stitch(a[i]); }
		}
		else {
			x = x + '<div id="coverup1" class="coverup"></div><div id="coverup2" class="coverup"></div>';
			for (var i = 1; i < 11; i++) {
				x = x + stitch(a[i]); }
			x = x + '<a href="javascript:;"><div id="time" class="fakeimg"></div></a>';
			for (var i = 11; i < 14; i++) {
				x = x + stitch(a[i]); }
			for (var i = 14; i < 17; i++) {
				x = x + stitch(a[i]); }
			x = x + '<a href="javascript:;"><div id="date" class="fakeimg"></div></a>';
			for (var i = 17; i < Math.min(27,a.length); i++) {
				x = x + stitch(a[i]); }
		}		
		x = addSearches(x);
		x = x + '<div id="searcher"></div>';
		return x;
		
	}

	//building block function for extract()
	function stitch(a) {
			return '<div id="'+a[2]+'" class="imgbox" style="background:' + a[1] + '"><p>'
			+a[4]+'</p><a href="' + a[2] + '"><image src="' + a[3] + '" id="' + a[2] + '"></a></div>';
	}
	
	//building block function for extract()  [adds search buttons]
	function addSearches(x) {
		x = x + '<div id="box2">';
		for(var j = 0; j<7; j++){
			for(var i = 0; i<7; i++){
				if(searchBars[i][3]==j){
					x = x + '<div id="'+searchBars[i][1]+'button" class="button"><image id="'+searchBars[i][1]+'" src="'+searchBars[i][1]+'.png"></div>';
					if(i<7-1){	x = x+ '<div id="buttonpadder'+i+'" class="buttonpadder"></div>'; }
				
				}
			}
		}
		return x;
	}
	
	//sorts sites, also tags small list with 2, large with 1, extras with 0
	function sortSites(x,fixing) {
		x = x.sort(function(a, b) {
		if (a[0] > b[0]) {return -1;}
		else if (a[0] < b[0]) {return 1;}
		else if (a[4] < b[4]) {return 1;}
		else if (a[4] > b[4]) {return -1;}
		else {return 0;}
		});
		if(fixing){
		for(var i = 1; i<11; i++){x[i][0] = 2-(i-11)/100;}
		for(var i = 11; i<27; i++){x[i][0] = 1-(i-27)/100;}
		for(var i = 27; i<x.length; i++){x[i][0] = 0-(i-27)/100;}}
		return x;
	}
	
	//base function for changing search bar
	function go(bTag) {
		var array = [''];
		for(var i = 0; i<7; i++) {
			if(bTag == searchBars[i][3]) {array = searchBars[i];}
		}
		$("#searcher").html('<FORM method=GET action="' + array[0] + '">\
			<INPUT TYPE=text id="search:'+array[1]+'" class="searchbar" placeholder="' + array[4] + '" name=' + array[2] + ' size=50 maxlength=255\
			style="font-size:' + searchFont + 'px; height:' + searchHeight + 'px; width:' + (searchWidth-spacing) + 'px; padding:0px; margin:0px;"></FORM>');
		$("input[type='text']:first", document.forms[0]).focus();
		$(".button img").css({"background":"#807050"});
		$("#"+array[1]).css({"background":"black"});
		storedInfo[2] = array[3];
	}
	
	function setTimeColor(){
		timeColor = "#807050"; timeBackground = "#F5F2DF"; pIndex = -1;
		if(countersOn){timeColor = "#EAE1C2"; timeBackground = "#807050"; pIndex = 1;}
	}
	
	//returns the input unless outside of min-max range, then returns min or max
	function range(input,min,max) {
		if(min > max) { var x = min; min = max; max = x;}
		return Math.max(Math.min(input,max),min);
	}
	
	//toggle counters from clicks
	function showCounters(){
		countersOn = !countersOn;
		setTimeColor();
		$("p").css({"z-index": pIndex});
		$(".arrow").css({"z-index": pIndex});
		$("#time").css({"color":timeColor, "background":timeBackground});
		$("#date").css({"color":timeColor, "background":timeBackground});
		}
	
});
