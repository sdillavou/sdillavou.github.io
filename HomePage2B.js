$(document).ready(function() {

	var widthBase;
	var ratio;
	var spacing;
	var nohelp = 6;
	var helpCounter = nohelp;
	var colorsOn = false;
	var storedSites = [];
	
	//contents of popup box which is either help or adding a new link
	var helpVector = 	['<p4>Welcome to HomePage Beta!</p4><br>Use the left and right arrow keys or those little handy arrow buttons to flip through help. Alt with the up or down arrow rescales the page.'
							+'<br><br>This is the BackPage to your HomePage. Back here, you can drag link tiles to add or remove them from your HomePage,'
							+' and/or change their order.<br><br><p4>1/6</p4>'+'<img id="x" class="x" src="x.png">'
							+'<img id="y" class="x x2" src="arrow2.png">'+'<img id="z" class="x x2" src="arrow.png">',
						'Drag tiles and drop them where you want them: tiles you move on this page will be reflected on your HomePage.'
							+' Your small (top left) and large (top right) HomePages are previewed on this page. Hold Shift to preview your pages in glorious full color.'
							+'<br><br>You can also return to the real thing by pressing the arrow icon in the top left, or the Left Arrow Key outside of help.<br><br><p4>2/6</p4>'
							+'<img id="x" class="x" src="x.png">'+'<img id="y" class="x x2" src="arrow2.png">'+'<img id="z" class="x x2" src="arrow.png">',
						"Tiles are color-coded on this page to reflect where they'll show up: black tiles will appear on your small and large HomePage,"
							+" while brown tiles will only appear on the large version. Beige tiles will not appear on the HomePage. And yes, the black tiles are all shown twice. "
							+"You can drag and drop either version. No biggie.<br><br>Tiles recolor when moved into a different area. Try it out!<br><br><p4>3/6</p4>"
							+'<img id="x" class="x" src="x.png">'+'<img id="y" class="x x2" src="arrow2.png">'+'<img id="z" class="x x2" src="arrow.png">',
						"Counters in top left corners of tiles track the number of times you've used them on your HomePage. You can reset them by pressing the 0's icon below. "
							+"Beige tiles won't lose their count just because they're not on the HomePage. Yeah. We got your back.<br><br>But wait, what's the little plus icon doing at the bottom? And why can't I drag it? Slow down, big fella! Read on...<br><br><p4>4/6</p4>"
							+'<img id="x" class="x" src="x.png">'+'<img id="y" class="x x2" src="arrow2.png">'+'<img id="z" class="x x2" src="arrow.png">',
						"So, nobody's perfect - there are probably some links you want that aren't on this site already. Luckily for you, all you need to do to fix that is to reprogram the entire site! "
							+"OR you could find an image, put it in the HomePage folder, then click that little plus icon below. Go! Try! "
							+"<br>Oh, also, if you've got some sites you've added in this way that you don't want anymore, click the reset icon (circular arrows) at the top left.<br><br><p4>5/6</p4>"
							+'<img id="x" class="x" src="x.png">'+'<img id="y" class="x x2" src="arrow2.png">'+'<img id="z" class="x x2" src="arrow.png">',
						"Updates to this site may be frequent or extremely rare. We're fickle. Functionality we hope (emphasis on hope) to add in the future includes:<br><br>"
							+"Nicer looking help.<br>More user-friendly site adding/removing.<br>Help on main page.<br>Alchemy.<br><br>"
							+"You're on your own now, young one.<br>(Click '?' to close and reopen help.)<br><br><p4>6/6</p4>"
							+'<img id="x" class="x" src="x.png">'+'<img id="y" class="x x2" src="arrow2.png">'+'<img id="z" class="x x2" src="arrow.png">',
						'',
						"Don't see a link you want? Add it!"+'<br><br><FORM METHOD="LINK" ACTION="HomePage2B.html"><p3>Website URL: </p3>http://<p3><INPUT TYPE="text" NAME="..website.." class="formform">'+
						'<br><br>Image File Name: <INPUT TYPE="text" NAME="..image.." class="formform"><br><br>Link Background Color: <INPUT TYPE="text" NAME="..color.." class="formform">'+
						'<br><br><INPUT TYPE="submit" VALUE="Add Link" style="margin-top:10px"></p3></FORM>'+
							'<img id="x" class="x" src="x.png">'
						];

	var storedInfo = ['hi',true,3,110,150,130,110,1];  //[nothing, small list?, search value, baseWidth3, baseWidth 1 short , baseWidth 1 long, baseWidth2, fly in for HomePage?]

	//Check for appropriate stored cookie to load HTML, if not, create HTML
	var sites = [
		[99999,'','THIS MUST NOT MATCH ANYTHING ELSE HYA765','',99999],
		[0, '#F90101', 'http://mail.google.com', 'gmail.png',0], //[ordering # (0,1,2), color, target, picture, # clicks]
		[0, '#3B5998', 'https://www.facebook.com/', 'facebook2.png',0],
		[0, '#fe5600', 'http://www.reddit.com/', 'reddit.png',0],
		[0, '#393939', 'http://www.nytimes.com', 'nytimes.png',0],
		[0, '#884400', 'http://www.1channel.ch/', 'letmewatchthis1.png',0],
		[0, '#ffd90b', 'http://grooveshark.com/', 'grooveshark.png',0],
		[0, '#931f90', 'http://www.free-tv-video-online.me/', 'freetv.png',0],
		[0, '#7ac142', 'http://www.mint.com/', 'mint.png',0],
		[0, '#B9090B', 'http://movies.netflix.com/WiHome', 'netflix1.png',0],
		[0, '#4099FF', 'https://twitter.com/', 'twitter.png',0],
		[0, '#0266C8', 'https://www.google.com/calendar/', 'cal.png',0],
		[0, '#ec1a22', 'http://www.cnn.com/', 'cnn.png',0],
		[0, '#00319f', 'http://www.weather.com/', 'weather.png',0],
		[0, '#ff2700', 'http://www.ted.com/', 'ted.png',0],
		[0, '#1dc74e', 'http://www.stumbleupon.com/', 'stumbleupon.png',0],
		[0, '#86b9ff', 'http://www.thedailyshow.com/full-episodes', 'daily.png',0],
		[0, '#fc9b00', 'http://www.amazon.com', 'amazon2.png',0],
		[0, '#B31B1B', 'https://www.facebook.com/groups/434539073238059/', 'herrenhaus.png',0],
		[0, '#77b530', 'http://www.hulu.com/', 'hulu.png',0],
		[0, '#F2B50F', 'https://drive.google.com/', 'googledrive.png',0],
		[0, 'gray', 'http://www.hbogo.com/#home/', 'hbogo.png',0],
		[0, '#953e4d', 'http://www.750words.com', '750.png',0],
		[0, '#aac9ff', 'http://www.smbc-comics.com/', 'smbc.png',0],
		[0, '#fb2400', 'https://www.bankofamerica.com/', 'bank.png',0],
		[0, '#c1af3e', 'https://www.facebook.com/groups/2203563997/', 'GoL.png',0],
		[0, '#00693e', 'http://www.theonion.com/', 'onion.png',0],
		[0, '#4040c0', 'http://www.nfl.com/', 'nfl1.png',0],
		[0, '#cf1515', 'http://mlb.mlb.com/index.jsp', 'mlb1.png',0],
		[0, '#4040c0', 'http://www.nhl.com/', 'nhl1.png',0],
		[0, '#cf1515', 'http://www.nba.com/', 'nba1.png',0],
		[0, '#ff3200', 'http://www.fandango.com/02420_movietimes', 'fandango.png',0],
		[0, '#aeeb93', 'http://projecteuler.net/login', 'euler.png',0],
		[0, 'brown', 'http://football.fantasysports.yahoo.com', 'yahooFootball.png',0],
		[0, '#336799', 'http://www.pandora.com/', 'pandora.png',0],
		[0, '#C92228', 'http://www.pinterest.com', 'pinterest.png',0],
		[0, '#004da2', 'https://www.usaa.com/', 'usaa.png',0],
		[0, '#f8dc39', 'http://newyork.ucbtheatre.com', 'ucb.png',0],
		[0, '#00b159', 'http://www.hopstop.com', 'hopstop.png',0],
		[0, '#003466', 'https://www.paypal.com', 'paypal.png',0],
		[0, '#00243a', 'http://www.orbitz.com', 'orbitz.png',0],
		[0, '#cc3333', 'https://plus.google.com', 'googleplus.png',0],
		[0, '#007bb6', 'http://www.linkedin.com', 'linkedin.png', 0],
		[0, '#56bbe7', 'https://www.americanexpress.com', 'amex.png', 0],
		[0, '#927332', 'file:///Users/Sam/Documents/Random%20Creation/HomePage/Site/HomePage.html', 'site.png',0],
		[0, '#b70040', 'https://www.marriott.com/rewards/rewards-program.mi', 'marriott.png', 0],
		[0, '#03507c', 'http://www.amtrak.com/guest-rewards', 'amtrak.png', 0],
		[0, '#ff3399', 'http://www.popsugar.com', 'popsugar.png', 0],
		[0, '#cc3568', 'http://nutritiondata.self.com/', 'selfnutritiondata.png', 0],
		[0, '#2360a5', 'http://www.mta.info', 'mta.png', 0],
		[0, '#006dc9', 'http://www.dropbox.com', 'dropbox.png', 0]

	];
	
	var urlCheck = document.URL.indexOf('.html?..website..=');

	try{storedSites = JSON.parse(localStorage.storedSites);}
	catch(err) { helpCounter = 0;} //if sites is stored wrong or not stored
	

	if(urlCheck != -1){
		urlCheck2 = document.URL.indexOf('&..image..=');
		urlCheck3 = document.URL.indexOf('&..color..=');
		var addWebsite = document.URL.substring(urlCheck+18,urlCheck2);
		var addImage = document.URL.substring(urlCheck2+11,urlCheck3);
		var addColor = document.URL.substring(urlCheck3+11);
		storedSites.push([0, addColor, "http://"+addWebsite, addImage, 0]);
		localStorage.storedSites = JSON.stringify(storedSites);
		window.location.href = 'HomePage2B.html';
	}

	for(var i = 0; i < storedSites.length; i++){ //add stored sites to sites
		sites.push(storedSites[i]); }
	
	//if cookie exists already, take click counts from sites that are in above matrix
	try{
		var cookieSites = JSON.parse(localStorage.sites);
		var cookiestoredInfo = JSON.parse(localStorage.storedInfo);
		storedInfo[1] = cookiestoredInfo[1];
		for(var i = 1; i < sites.length; i++) {
			for(var j = 1; j < cookieSites.length; j++) {
				if(sites[i][2] == cookieSites[j][2]){
					if(typeof cookieSites[j][0] != 'number') {cookieSites[j][0] = 0;}
					if(typeof cookieSites[j][4] != 'number') {cookieSites[j][4] = 0;}
					sites[i][0] = cookieSites[j][0];
					sites[i][4] = cookieSites[j][4];}
			}
		}
		storedInfo[5] = cookiestoredInfo[5];
		storedInfo[6] = cookiestoredInfo[6];
		storedInfo[4] = cookiestoredInfo[4];	
		storedInfo[7] = cookiestoredInfo[7];
	}
	catch(err) { helpCounter = 0;} //if sites is stored wrong or not stored
	
	//sorts sites
	sites = sortSites(sites);


	//create local storage with sites[][]
	localStorage.sites = JSON.stringify(sites);	
	localStorage.storedInfo = JSON.stringify(storedInfo);
	
	redoHTML(colorsOn); //put sites in order into html
	windowArea = 0; //initialize windowArea
	setSize();
	
	if(storedInfo[7] != 1){ //if coming from another page, fly in from right.
		$('#box').css({"left":$(window).width()});
		$('#box').animate({"left":0},400);
		storedInfo[7] = 1;
		localStorage.storedInfo = JSON.stringify(storedInfo);
	}
		
	$(document).on('click','#topbox1',function(event) {
		localStorage.storedInfo = JSON.stringify(storedInfo);
		toHomePage();
	});
		

	$(document).on('click','#topbox2',function(event) {
		setHelp(0);
	});

	$(document).on('click','#x',function(event) {
		if(helpCounter == nohelp+1){setHelp("+");}
		else{setHelp(0);}
	});

	$(document).on('click','#y',function(event) {
		setHelp(1);
	});

	$(document).on('click','#z',function(event) {
		setHelp(-1);
	});
	
	$(document).on('click','#topbox3',function(event) {
		if(confirm('This will reset all click counters.')){
			for(var i = 1; i < sites.length; i++){ sites[i][4] = 0; }
			localStorage.sites = JSON.stringify(sites);
			redoHTML(colorsOn); //put sites in order into html
			setSize();
		}
	});
	
	$(document).on('click','#topbox4',function(event) {
		if(confirm('This will remove all custom-added links.')){
			resetStoredSites();
			setSize();
	}
	});
	
	$(document).on('click','#topbox5',function(event) {
		setHelp("+");
	});
		
	$("html").keydown(function(e) {
		if (e.keyCode == 37) {	//left arrow key
			if(helpCounter < nohelp){
				setHelp(-1);
			} else if (helpCounter >= nohelp){ toHomePage();}
		} else if (e.keyCode == 16) { //shift key
			if(helpCounter != nohelp+1){ //not if entering new link
				colorsOn = true;
				redoHTML(colorsOn); //put sites with color into html
				setSize();
			}
		} else if (e.keyCode == 38 ) { //up arrow key
			if(e.altKey) { storedInfo[6] = storedInfo[6]+5; setSize();}
			
		}  else if (e.keyCode == 40 ) { //down arrow key
			if(e.altKey) { storedInfo[6] = storedInfo[6]-5; setSize();}
			
		} else if (e.keyCode == 39) { //right arrow key
			setHelp(1);
		}
	});

	$("html").keyup(function(e) {
		if (e.keyCode == 16) { //shift key
			if(helpCounter != nohelp+1){ //not if entering new link
				colorsOn = false;
				redoHTML(colorsOn); //put sites with color into html
				setSize();
			}
		} 
	});


	//Sets sizes of visible/invisible elements to match window if windowArea changes
	function setSize() {

		for (var i = 1; i < 4; i++) {

			widthBase = range(storedInfo[6],50,5*Math.ceil($(window).width()/13.5)/5);
			storedInfo[6] = widthBase;
			ratio = 1;

			spacing = Math.round(Math.max(widthBase*ratio / 18, 3));
			paddingLeft = Math.round(Math.max((widthBase - widthBase*ratio) / 2, 0));
			
			$(".imgbox").css({
				"width": (widthBase),
				"height": (widthBase*ratio),
				"margin-top": spacing,
				"margin-right": spacing/2,
				"margin-left": spacing/2
			});

			$(".blankbox").css({
				"width": (widthBase ),
				"height": (widthBase*ratio ),
				"margin-top": spacing,
				"margin-right": spacing/2,
				"margin-left": spacing/2
			});

	
			
			$(".imgbox img").css({
				"width": widthBase*ratio,
				"height": widthBase*ratio,
				"margin":0,
				"padding":0,
				"margin-left":paddingLeft
			});
			
			$("p").css({
				"margin-left": Math.round(.06*widthBase),
				"margin-top": Math.round(.02*widthBase*ratio),
				"font-size": Math.round(range(widthBase*ratio/5+2,14,22))
			});	


			$("p2").css({
				"position":"absolute",
				"font-size": widthBase*ratio/4+2,
				"width":"100%",
				"margin-top": (widthBase*ratio -widthBase*ratio/4-2)/2,
				"text-align":"center"
			});	

			$(".topbox").css({
				"top": (widthBase*ratio*.2),
				"left": (widthBase*.2),
				"height":widthBase*ratio*.6 ,
				"width":widthBase*ratio*.6 ,
			});
		
			$(".topbox img").css({
				"width": widthBase*ratio*.6 - (spacing*2),
				"height": widthBase*ratio*.6 - (spacing*2),
				"padding": spacing,
				"margin": 0
			});


			$("#blankbox1").css({
				"top": - widthBase*ratio*1.2+spacing		
			});

			$("#blankbox2").css({
				"top": - widthBase*ratio*1.2+spacing,
				"left": spacing*2.5+widthBase+spacing
			});

			$("#blankbox3").css({
				"top": - widthBase*ratio*1.2+spacing,
				"left": spacing*2.5+(widthBase+spacing)*2		
			});

			$("#blankbox4").css({
				"top": - widthBase*ratio*1.2+spacing,
				"left": spacing*2.5+(widthBase+spacing)*3		
			});


			$("#boxA").css({
				"width": (widthBase + spacing) * 4,
				"height": (widthBase*ratio+spacing)*3 ,
				"margin-top": widthBase*ratio*.5+widthBase*ratio+spacing,
				"margin-right": widthBase*.5,
				"padding":spacing*2.5,
				"padding-top":spacing*2,
				"padding-bottom":spacing*3		
			});
			
			$("#boxB").css({
				"width": (widthBase + spacing) * 7,
				"height": "auto",
				"margin-top": widthBase*.5,
				"padding":spacing*2.5,
				"padding-top":spacing*2,
				"padding-bottom":spacing*3
			});

			$("#box").css({
				"width": $("#boxA").outerWidth()+$("#boxB").outerWidth()+spacing*13
			});
			
			var numBoxes = Math.round($(window).width()/(widthBase+spacing)*(.85));
			$("#boxC").css({
				"width": widthBase * numBoxes + spacing*numBoxes,
				"margin-top":widthBase*ratio*.5,
				"margin-left": ($("#box").width()-widthBase*numBoxes-spacing*(numBoxes+5))/2,
				"padding":spacing*2,
				"padding-right":spacing*2.5,
				"padding-left":spacing*2.5
			});

			

		}
	
		localStorage.sites = JSON.stringify(sites);
		localStorage.storedInfo = JSON.stringify(storedInfo);
		localStorage.storedSites = JSON.stringify(storedSites);
		setDrag();
		setHelp(null);
	}




	//changes site matrix sites into HTML code
	function redoHTML(isColored) {
		var x = '';
		sites = sortSites(sites);
		x = x + addblankbox('javascript:;',1,'#DAD1AA','arrow.png');
		x = x + addblankbox('javascript:;',2,'#DAD1AA','questionmark.png');
		x = x + addblankbox('javascript:;',3,'#DAD1AA','zeros.png');
		x = x + addblankbox('javascript:;',4,'#DAD1AA','refresh.png');
		for (var i = 1; i < 6; i++) {	x = colorCode(sites,x,i,"imgbox",isColored);	}
		x = x + '<div class = "blankbox"></div>'
		x = x + '<div class = "blankbox"></div>'
		for (var i = 6; i < 11; i++) {	x = colorCode(sites,x,i,"imgbox",isColored);	}
	
		
		
		
		
		$("#boxA").html(x);
		x = '';
		for (var i = 1; i < 11; i++) {	x = colorCode(sites,x,i,"imgbox",isColored);	}
		x = x + '<div class = "blankbox"></div>'
		for (var i = 11; i < 17; i++) {	x = colorCode(sites,x,i,"imgbox",isColored);	}
		x = x + '<div class = "blankbox"></div>'
		for (var i = 17; i < 27; i++) {	x = colorCode(sites,x,i,"imgbox",isColored);	}
		$("#boxB").html(x);
		x = '';
		for (var i = 27; i < sites.length; i++) {	x = colorCode(sites,x,i,"imgbox",isColored);}

		x = x + addblankbox('javascript:;',5,'#DAD1AA','plus.png');
		
		$("#boxC").html(x);
		x='';
		


	

		
	}
	
	function addblankbox(targetLink,divNum,backgroundColor,imgName){
		return '<div id="blankbox'+divNum+'" class="blankbox"><a href="'+targetLink+
		'"><div id="topbox'+divNum+'" class="topbox" style="background:'+
		backgroundColor+'"><img src="'+imgName+'"></div></a></div>';
	}

	//building block function for extract(), converts sites matrix elements into HTML
	function stitch(a, colorHex, textColor, i,className) {
		return '<div id="'+a[i][2]+'" class="'+className+'" style="background:' + colorHex +
		'"><p style="color:'+textColor+';">'+a[i][4]+'</p><image src="' + a[i][3] + '" id="' + a[i][2] + '"></div>';
	}

	//building block function using stitch() for extract(), gives appropriate colors to links based on sorted sites
	function colorCode(unsortedArray, stringInput, i, className,isColored) {
			if(isColored){stringInput = stringInput + stitch(unsortedArray, unsortedArray[i][1], "black",i,className); }
			else{
				if(i<11) {stringInput = stringInput + stitch(unsortedArray, "#000000", "white",i,className); }
				else if (i<27) {stringInput = stringInput + stitch(unsortedArray, "#807050", "black",i,className);  }
				else {	stringInput = stringInput + stitch(unsortedArray, "#DAD1AA", "black",i,className); }
			}
		return stringInput;
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

	function setDrag() {
		$(".imgbox").draggable({zIndex:999,
			start: function() {},
			stop: function() {redoHTML(colorsOn); setSize();} });

		$(".imgbox").droppable({
			drop: function(event,ui) {
				var dragDiv;
				var dropDiv;
				for (var i = 0; i < sites.length; i++) {
					if ($(this).attr('id') == sites[i][2]) { dropDiv = i;}
					if ($(ui.draggable).attr('id') == sites[i][2]) { dragDiv = i;}
				}
				if(dragDiv>dropDiv){sites[dragDiv][0]=sites[dropDiv][0]+.000001; }
				else{sites[dragDiv][0]=sites[dropDiv][0]-.000001;}
				redoHTML(colorsOn);
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
	
		if(move === "+") {
			if(helpCounter == nohelp+1) {helpCounter = nohelp}
			else {helpCounter = nohelp+1}
		}else if(move == 0) {
			if(helpCounter == nohelp || helpCounter == nohelp+1) { helpCounter = 0;} //if help is not up (no box or input form)
			else { helpCounter = nohelp;}
		} else if(move > 0) {
			if(helpCounter<nohelp-1){helpCounter++;}
		} else if(move < 0) {
			if(helpCounter>0){helpCounter = helpCounter - 1;}
		}
		
		$("#helpDiv").html(helpVector[helpCounter]);
		$("#helpDiv").css({
			"position":"absolute",
			"width":widthBase*5+spacing*6,
			"text-align":"center",
			"font-size": Math.round(widthBase*ratio/5),
			"margin-top":widthBase*ratio*2,
			"margin-left":($(window).width()-widthBase*5-spacing*15)/2
		});

		if(helpCounter == nohelp) {  //no helpdiv
			$("#helpDiv").css({"padding":0,"height":0,"border-style":"none"});
		}else { //helpdiv visible
			$("#helpDiv").css({"padding":spacing*3,"height":"auto","border-style":"solid"});
		
			if(helpCounter == nohelp+1) {  //adding link form
				$(".formform").css({
					"width": widthBase*2,
					"font-size": Math.round(widthBase*ratio/5),});
			}
				
			$(".x").css({
				"width": Math.sqrt(widthBase)*2.5
			});

			$("#x").css({
				"top": -Math.sqrt(widthBase)*2.5*3/5,
				"right":-Math.sqrt(widthBase)*2.5*3/5
			});

			$(".x2").css({
				"bottom": Math.round(widthBase*ratio/5)*.7,
			});
			
			$("#y").css({
				"right": widthBase*1.7
			});

			$("#z").css({
				"left": widthBase*1.7
			});
				
			
		}
	}
		
	function resetStoredSites() {
		storedSites = [];
		localStorage.storedSites = JSON.stringify(storedSites);
		window.location.href = 'HomePage2B.html';
	}

});