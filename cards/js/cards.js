$(document).ready(function() {

	STATE = {
		selectedCard: null,
		selectedField: null
	}

	WINNER = "none";

	//Shuffle

	for(var i=0; i<regularCards.length; i++){
		regularCards[i][3] = Math.random();
	}

	regularCards = regularCards.sort(function(a, b) {
		if (a[3] > b[3]) {return 1;}
		else if (a[3] < b[3]) {return -1;}
		else {return 0;}
	});

	specialCards = specialCards.sort(function(a, b) {
		if (a[3] > b[3]) {return 1;}
		else if (a[3] < b[3]) {return -1;}
		else {return 0;}
	});

	//Deal

	playerHand = regularCards.slice(0,7);
	computerHand = regularCards.slice(7,14);
	regularCards = regularCards.slice(14,regularCards.length);

/*
playerField[0][0] = regularCards[0];
playerField[0][1] = regularCards[0];
playerField[2][0] = regularCards[0];
playerField[0][2] = regularCards[0];
playerField[1][1] = regularCards[0];
playerField[1][0] = regularCards[0];
*/


	display();


	function display(){
		//visualize hand
		for(var i = 0; i < 7; i++) {
			if(Array.isArray(playerHand[i])){
				$("#player-slot-"+(i+1)).html('<div class="card color-'+playerHand[i][1]+'">'+playerHand[i][0]+'</div>');
			} else {
				$("#player-slot-"+(i+1)).html('');
			}
		}
		//visualize player and computer field

		$(".flag").removeClass("mud");
		$(".flag").removeClass("fog");
		$(".flagSpace").html('');
		$(".playerFieldSpace").css({"background":"none"});
		$(".handSpace .card").css({"border-color":"black"});
		
		for(var i=0; i<9; i++) {

			$("#"+flags[i][0]+"-line-space-"+(i+1)).html('<div class="flag '+flags[i][1]+'"></div>');

			for(var j=0; j<3; j++){
				if(Array.isArray(playerField[i][j])){
					$("#player-field-slot-"+(i+1)+"-"+(j+1)).html('<div class="card color-'+playerField[i][j][1]+'">'+playerField[i][j][0]+'</div>');
				} else {
					$("#player-field-slot-"+(i+1)+"-"+(j+1)).html('');
				}

				if(Array.isArray(computerField[i][j])){
					$("#computer-field-slot-"+(i+1)+"-"+(j+1)).html('<div class="card color-'+computerField[i][j][1]+'">'+computerField[i][j][0]+'</div>');
				} else {
					$("#computer-field-slot-"+(i+1)+"-"+(j+1)).html('');
				}

			}
		}
		//visualize decks
		$("#special-cards").html(specialCards.length);
		$("#regular-cards").html(regularCards.length);



		//Click on a card in the hand
		$(".card").on("click.selectCard", function(event) {

			if($(event.target).attr('class').indexOf("stack") < 0){
				//isn't a card stack
				if($(event.target).closest(".space").attr('class').indexOf("handSpace") >= 0){
					//is a hand card
					$(".handSpace .card").css({"border-color":"black"});
					$(event.target).css({"border-color":"white"});
					var slotID = $(event.target).closest('.slot').attr('id');
					STATE.selectedCard = parseInt(slotID.substr(slotID.length-1))-1;
				} 
			}
		});

		//Click on a slot on the player's side
		$(".playerFieldSpace").on("click.selectDestination", function(event) {
			var fieldID = $(event.target).closest('.playerFieldSpace').attr('id');
			var selectedField = parseInt(fieldID.substr(fieldID.length-1))-1;

			if(!(Array.isArray(playerField[selectedField][0])&&Array.isArray(playerField[selectedField][1])&&Array.isArray(playerField[selectedField][2]))){
				//if selected field doesn't have three cards already
				if(flags[selectedField][0] == "center"){
					//if flag is unclaimed
					$(".playerFieldSpace").css({"background":"none"});
					$("#"+fieldID).css({"background":"white"});
					STATE.selectedField = selectedField;		
				}
			}
		});	

		//Click on draw stack (end turn)
		$(".stack").on("click.selectStack", function(event) {
			var stackID = $(event.target).attr('id');

			if(!(STATE.selectedField == null || STATE.selectedCard == null)) {
				//card and field are selected

				var goToSlot = 2; //assume third slot
				if(!Array.isArray(playerField[STATE.selectedField][1])){
					goToSlot = 1; //if second slot is empty go there
				}
				if(!Array.isArray(playerField[STATE.selectedField][0])){
					goToSlot = 0; //if first slot is empty go there
				}

				playerField[STATE.selectedField][goToSlot] = playerHand[STATE.selectedCard];
				
				//draw card if deck isn't empty
				if(Array.isArray(regularCards[0])){
					playerHand[STATE.selectedCard] = regularCards[0];
					regularCards = regularCards.slice(1,regularCards.length);
				} else {
					playerHand[STATE.selectedCard] = null;
				}
				
				//claim flags for the computer
				flagClaim("computer");
				alertVictory();

				//computer plays and draws a card
				computerTurn();

				//reset selected field/card and redisplay
				STATE.selectedCard = null;
				STATE.selectedField = null;
				flagClaim("player");
				display();
				alertVictory();

			} else {

				//allow turn pass if no legal play
				if(!isLegalPlay("player")){
					//claim flags for the computer
					flagClaim("computer");
					//computer plays and draws a card
					computerTurn();
					//reset selected field/card and redisplay
					STATE.selectedCard = null;
					STATE.selectedField = null;
					flagClaim("player");
					display();

				}
			}
		});	


	}

	//computer plays a card and draws a card
	function computerTurn() {

		//allow turn only if there is a legal play
		if(isLegalPlay("computer")){
			var computerPlay = aiEngine(); //return [flag #, card # in hand]

			var goToSlot = 2; //assume third slot
			if(!Array.isArray(computerField[computerPlay.flagNum][1])){
				goToSlot = 1; //if second slot is empty go there
			}
			if(!Array.isArray(computerField[computerPlay.flagNum][0])){
				goToSlot = 0; //if first slot is empty go there
			}

			computerField[computerPlay.flagNum][goToSlot] = computerHand[computerPlay.cardNum];

			//draw card if deck isn't empty
			if(Array.isArray(regularCards[0])){
				computerHand[computerPlay.cardNum] = regularCards[0];
				regularCards = regularCards.slice(1,regularCards.length);
			} else {
				computerHand[computerPlay.cardNum] = null;
			}
		}
	
	}


	function aiEngine() {
		var output = {
			cardNum: 0,
			flagNum: 0
		}

		output.cardNum = Math.floor(Math.random()*7);
		//redo select card if slot is empty (for when deck runs out)
		while(!Array.isArray(computerHand[output.cardNum])) {
			output.flagNum = Math.floor(Math.random()*7);

		}


		output.flagNum = Math.floor(Math.random()*9);
		//redo select flag if flag is full or claimed
		while(Array.isArray(computerField[output.flagNum][2]) || flags[output.flagNum][0] != "center") {
			output.flagNum = Math.floor(Math.random()*9);
		}

		return output;
	}

	function flagClaim(turn) {
		if(turn == "player") {
			for(var i = 0; i<9; i++){
				if(flags[i][0] == "center" && Array.isArray(playerField[i][2])) {
					//this flag is unclaimed and full on player's side
					var remainingCards = playerHand.concat(computerHand).concat(regularCards);

					if(directScore(playerField[i].slice(0)) >= scoreFlag(computerField[i].slice(0), remainingCards.slice(0))){
						//player flag score is >= max computer flag score
						flags[i][0] = "player";
					}

				}
			}
		} else {
			for(var i = 0; i<9; i++){
				if(flags[i][0] == "center" && Array.isArray(computerField[i][2])) {
					//this flag is unclaimed and full on computer's side
					var remainingCards = computerHand.concat(playerHand).concat(regularCards);

					if(directScore(computerField[i].slice(0)) >= scoreFlag(playerField[i].slice(0), remainingCards.slice(0))){
						//computer flag score is >= max player flag score
						flags[i][0] = "computer";
					}

				}
			}
		}
		checkForVictory();
	}

	function scoreFlag(inputFlag, potentialCards) {
		//determine how many slots are full
		var unfilledSlot = null;
		if(!Array.isArray(inputFlag[0])) {
			unfilledSlot = 0;
		} else if(!Array.isArray(inputFlag[1])) {
			unfilledSlot = 1;
		} else if(!Array.isArray(inputFlag[2])) {
			unfilledSlot = 2;
		}


		if(unfilledSlot == null){


			return directScore(inputFlag);

		} else {
			//cycle through possibilities
			var score = 0;
			for(var i=0; i<potentialCards.length-2+unfilledSlot; i++) {
				var dummyFlag = inputFlag.slice(0);
				//calculate score recursively, keeping highest score
				dummyFlag[unfilledSlot] = potentialCards[i];
				score = Math.max(scoreFlag(dummyFlag, potentialCards.slice(i+1)), score);
			}

			return score;
		}


	}


	//calculate score of a full flag side
	function directScore(inputFlag) {

		//sum three cards and divide by 100 (subscore)
		var score = (inputFlag[0][0] + inputFlag[1][0] + inputFlag[2][0])*.01;

		//add points for type of formation
		if(inputFlag[0][0] == inputFlag[1][0] && inputFlag[1][0] == inputFlag[2][0]){
			//three of a kind
			score = score + 4;
		}
		if(inputFlag[0][1] == inputFlag[1][1] && inputFlag[1][1] == inputFlag[2][1]){
			//flush
			score = score + 3;
		}
		if(Math.max(inputFlag[0][0], inputFlag[1][0], inputFlag[2][0]) - Math.min(inputFlag[0][0], inputFlag[1][0], inputFlag[2][0]) == 2){
			//range is 2
			if(inputFlag[0][0] != inputFlag[1][0] && inputFlag[1][0] != inputFlag[2][0] && inputFlag[0][0] != inputFlag[2][0]) {
				//straight (range of 2 and no pairs)
				score = score + 2;	
			}	
		}
		return score;
	}

	function checkForVictory(){
		//check for 3 in a row
		for(var i=0; i<7; i++){
			if(flags[i][0] != "center" && flags[i][0] == flags[i+1][0] && flags[i][0] == flags[i+2][0]){
				if(flags[i][0] == "player"){
					WINNER = "player";
				} else {
					WINNER = "computer";
				}
			}
		}
		//check for majority (5)
		var playerFlags = 0;
		var computerFlags = 0;
		for(var i=0; i<9; i++){
			if(flags[i][0] == "computer"){
				computerFlags++;
			}
			if(flags[i][0] == "player"){
				playerFlags++;
			}
		}
		if(playerFlags >=5){
			WINNER = "player";
		}
		if(computerFlags >=5){
			WINNER = "computer";
		}
	}

	function alertVictory() {
		if(WINNER != "none"){
			alert(WINNER + " wins! click ok to refresh.");
			location.reload(); 
		}
	}

	function isLegalPlay(identifier) {
		var legalPlay = false;
		var array = computerField;
		if(identifier == "player") {
			array = playerField;
		}

		for(var i=0; i<9; i++){
			if(!Array.isArray(array[i][2]) && flags[i][0] == "center"){
				//flag has empty spot and is unclaimed
				legalPlay = true;
			}
		}

		return legalPlay
	}
	
});
