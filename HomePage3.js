$(document).ready(function() {

	var widthBase;
	var spacing;
	var helpCounter = 3;

	var helpVector = ['<p4>Welcome!</p4><br>Use the left and right arrow keys or those little handy arrow buttons to flip through help. Alt with the up or down arrow rescales the page.'
							+'<br><br>This is the (other) BackPage to your HomePage. Back here, you can drag search tiles to add or remove them from your HomePage,'
							+' and/or change their order.<br><br><p4>1/3</p4>'+'<img id="x" class="x" src="x.png">'+'<img id="y" class="x x2" src="arrow2.png">'+'<img id="z" class="x x2" src="arrow.png">',
						'Drag tiles and drop them where you want them: tiles you move on this page will be reflected on your HomePage.'
							+" The seven top, black outlined search tiles determine the search options you'll have available.<br>Choose wisely."
							+'<br><br>You can return to the HomePage itself by pressing the arrow icon below, or the Right Arrow Key outside of help.<br><br><p4>2/3</p4>'+'<img id="x" class="x" src="x.png">'+'<img id="y" class="x x2" src="arrow2.png">'+'<img id="z" class="x x2" src="arrow.png">',
						"In addition to the keyboard shortcut, the + and - icons on the left scale the tiles when pressed."
							+"<br><br>Well, we've taught you all you need.<br><br>You're on your own now... again... young one..."
							+"<br><br>...Click '?' to close and reopen help.<br><br><p4>3/3</p4>"+'<img id="x" class="x" src="x.png">'+'<img id="y" class="x x2" src="arrow2.png">'+'<img id="z" class="x x2" src="arrow.png">',''];
	
	var searchBars = [
		["http://youtube.com/results", "YouTube", "search_query", 0,"YouTube"],
		["http://images.google.com/images", "GoogleImages", "q", 1,"Google Images"],
		["http://www.yelp.com/search?", "Yelp", "find_desc", 2,"Yelp"],
		["http://www.google.com/search", "Google", "q", 3,"Google"],
		["http://www.wolframalpha.com/input/", "WolframAlpha", "i", 4,"Wolfram Alpha"],
		["http://maps.google.com/maps", "GoogleMaps", "q", 5,"Google Maps"],
		["http://www.imdb.com/find", "IMDb", "q", 6,"International Movie Database"],
		["http://en.wikipedia.org/w/index.php?", "Wikipedia", "search", 7,"Wikipedia"],
		["http://www.bing.com/search", "Bing", "q", 7,"Bing"],
		["http://www.facebook.com/search/results.php","Facebook","q",7,"Facebook"],
		["http://www.amazon.com/exec/obidos/external-search","Amazon","keyword",7,"Amazon"],
		["http://translate.google.com/translate_t","GoogleTranslate","text",7,"Google Translate"]
		];

	try{
		var cookiesearchBars = JSON.parse(localStorage.searchBars);
		for(var i = 0; i < searchBars.length; i++) {
			for(var j = 0; j < cookiesearchBars.length; j++) {
				if(searchBars[i][0] == cookiesearchBars[j][0]){
					searchBars[i][3] = cookiesearchBars[j][3];}
			}
		}

	}
	catch(err) { helpCounter=0;} //if searchBars is stored wrong or not stored
	
	//sorts searchBars
	searchBars = sortsearchBars(searchBars,true);

	//create local storage with searchBars[][]
	localStorage.searchBars = JSON.stringify(searchBars);	

	var storedInfo = JSON.parse(localStorage.storedInfo);
	localStorage.storedInfo = JSON.stringify(storedInfo);

	addSearches();
	setSize();
	
	if(storedInfo[7] != -1){ //if coming from another page, fly in from left.
		$('#box').css({"left":-$(window).width()});
		$('#box').animate({"left":0},400);
		storedInfo[7] = -1;
		localStorage.storedInfo = JSON.stringify(storedInfo);
	}

	$("html").keydown(function(e) {
		if (e.keyCode == 37) {	//left arrow key
			setHelp(-1);
		} else if (e.keyCode == 16) { //shift key
		
		} else if (e.keyCode == 38 ) { //up arrow key
			if(e.altKey) { storedInfo[3] = storedInfo[3]+10; setSize();}
		}  else if (e.keyCode == 40 ) { //down arrow key
			if(e.altKey) { storedInfo[3] = storedInfo[3]-10; setSize();}
		} else if (e.keyCode == 39) { //right arrow key
			if(helpCounter == 3){toHomePage();}
			else{ setHelp(1); }
		}
	});

	$(document).on('click','#topbox1',function(event) {
		storedInfo[3] = storedInfo[3]+10; setSize();
	});
	
	$(document).on('click','#topbox2',function(event) {
		storedInfo[3] = storedInfo[3]-10; setSize();
	});

	$(document).on('click','#topbox3',function(event) {
		toHomePage();
	});

	$(document).on('click','#topbox4',function(event) {
		setHelp(0);
	});

	$(document).on('click','#x',function(event) {
		setHelp(0);
	});

	$(document).on('click','#y',function(event) {
		setHelp(1);
	});

	$(document).on('click','#z',function(event) {
		setHelp(-1);
	});


	
	
	function setSize(){
		widthBase = range(storedInfo[3],50,10*Math.ceil(($(window).width()/10)/10));
		storedInfo[3] = widthBase;
		spacing = Math.round((Math.max(widthBase*.8 / 18, 3))/2)*2;
			
		$(".button img").css({
			"width":widthBase,
			"height":widthBase*.8,
			"margin":spacing/2,
			"padding":"0"
		});

		$(".button").css({
			"width":widthBase+spacing,
			"height":widthBase*.8+spacing,
			"margin":spacing/2,
		});

		$("#box").css({
			"width":widthBase*7+spacing*14,
			"height":(widthBase*.8+spacing)*Math.ceil(searchBars.length/7)+spacing*2,
			"padding":spacing*2
		});

		$("#box").css({
			"margin-top":($(window).height()-$("#box").height())/2.3
		});

		$("#topbox1").css({
			"top": widthBase*.8/2+spacing*3.5-widthBase*.2,
			"left": -widthBase*.4-spacing*2,
			"height":widthBase*.8/2 ,
			"width":widthBase*.8/2 
		});

		$("#topbox2").css({
			"top": widthBase*.8*1.5+spacing*5.5-widthBase*.2,
			"left": -widthBase*.4-spacing*2,
			"height":widthBase*.8/2 ,
			"width":widthBase*.8/2 
		});


		$("#topbox3").css({
			"top": widthBase*.8/2+spacing*3.5-widthBase*.2,
			"left": widthBase*7+spacing*14+spacing*6,
			"height":widthBase*.8/2 ,
			"width":widthBase*.8/2 
		});

		$("#topbox4").css({
			"top": widthBase*.8*1.5+spacing*5.5-widthBase*.2,
			"left": widthBase*7+spacing*14+spacing*6,
			"height":widthBase*.8/2 ,
			"width":widthBase*.8/2 
		});

		$(".topbox img").css({
			"width": widthBase*.8/2 - (spacing*2),
			"height": widthBase*.8/2 - (spacing*2),
			"padding": spacing,
			"margin": "0px"
		});

		
		localStorage.storedInfo = JSON.stringify(storedInfo);
		localStorage.searchBars = JSON.stringify(searchBars);
		setDrag();
		setHelp();
	}

	//going home!
	function toHomePage() {
		localStorage.searchBars = JSON.stringify(searchBars);
		$("#box").animate({"left":-$(window).width()*1.2},400);
		$("#helpDiv").animate({"left":-$(window).width()*1.2},400);
		setTimeout(function(){window.location.href = 'index.html';},300);
	}

	//building block function for extract()  [adds search buttons]
	function addSearches() {
		var x = '';
		var background;
		searchBars = sortsearchBars(searchBars,true);

		x = x + addTopBox('javascript:;',1,'#807050','plus.png');
		x = x + addTopBox('javascript:;',2,'#807050','minus.png');
		x = x + addTopBox('javascript:;',3,'#807050','arrow2.png');
		x = x + addTopBox('javascript:;',4,'#807050','questionmark.png');

		for(var i = 0; i<7; i++){
			background='black';
			x = x + '<div id="'+searchBars[i][1]+'" class="button" style="background:'+background+'"><image id="'+searchBars[i][1]+'" src="'+searchBars[i][1]+'.png"></div>';
		}
		for(var i = 7; i<searchBars.length; i++){
			background = '#807050';
			x = x + '<div id="'+searchBars[i][1]+'" class="button" style="background:'+background+'"><image id="'+searchBars[i][1]+'" src="'+searchBars[i][1]+'.png"></div>';
		}
		$("#box").html(x);
	}

	function sortsearchBars(x,fixing) {
		x = x.sort(function(a, b) {

			if (a[3] < b[3]) {return -1;}
			else if (a[3] > b[3]) {return 1;}
			else {return 0;}
		});
		if(fixing){
			for(var i = 0; i<x.length; i++){x[i][3] = i;}
		}
		return x;
	}

	//returns the input unless outside of min-max range, then returns min or max
	function range(input,min,max) {
		if(min > max) { var x = min; min = max; max = x;}
		return Math.max(Math.min(input,max),min);
	}

	function addTopBox(targetLink,divNum,backgroundColor,imgName){
		return '<a href="'+targetLink+
		'"><div id="topbox'+divNum+'" class="topbox" style="background:'+
		backgroundColor+'"><img src="'+imgName+'"></div></a>';
	}


	function setDrag() {
		$(".button").draggable({zIndex:999,
			start: function() {},
			stop: function() {addSearches(); setSize();} });

		$(".button").droppable({
			drop: function(event,ui) {
				var dragDiv;
				var dropDiv;
				for (var i = 0; i < searchBars.length; i++) {
					if ($(this).attr('id') == searchBars[i][1]) { dropDiv = i;}
					if ($(ui.draggable).attr('id') == searchBars[i][1]) { dragDiv = i;}
				}
				if(dragDiv>dropDiv){searchBars[dragDiv][3]=searchBars[dropDiv][3]-.0001; }
				else{searchBars[dragDiv][3]=searchBars[dropDiv][3]+.0001;}
				addSearches();
				setSize();
			},
			over: function(event,ui) {
				$(this).css({"outline-style":"solid"});
			},
			out: function(event,ui) {
				$(this).css({"outline-style":"none"});
			}

		});
	}
	
	function setHelp(move){
		if(move == 0) {
			if(helpCounter == 3) { helpCounter = 0;}
			else { helpCounter = 3;}
		} else if(move > 0) {
			if(helpCounter<2){helpCounter++;}
		} else if(move < 0) {
			if(helpCounter>0){helpCounter = helpCounter - 1;}
		}
		
		$("#helpDiv").html(helpVector[helpCounter]);
		$("#helpDiv").css({
			"position":"absolute",
			"width":widthBase*4+spacing*6,
			"text-align":"center",
			"font-size": Math.round(widthBase*.8/5),
			"top":($(window).height()-$("#box").height())/2.3-widthBase*.2,
			"margin-left":($(window).width()-widthBase*4-spacing*12)/2
		});

		if(helpCounter == 3) {$("#helpDiv").css({"padding":0,"height":0,"border-style":"none"});}
		else {$("#helpDiv").css({"padding":spacing*3,"height":"auto","border-style":"solid"});}

		$(".x").css({
			"width": Math.sqrt(widthBase)*2.5
		});

		$("#x").css({
			"top": -Math.sqrt(widthBase)*2.5*3/5,
			"right":-Math.sqrt(widthBase)*2.5*3/5
		});

		$(".x2").css({
			"bottom": Math.round(widthBase*.8/5)*.7,
		});
		
		$("#y").css({
			"right": widthBase*1.7
		});

		$("#z").css({
			"left": widthBase*1.7
		});
	}

});
