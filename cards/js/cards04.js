/*

	Version tracking:

	04	AI plays based on percentage of future options on a flag
		that will beat the opponent's best possible hand on that flag.
		Scenarios are generated giving random future cards to computer
		and to player and results are summed across scenarios, potential
		plays, and each flag in each play/scenario.

		Additional weight is given to the flag being played on, and a
		weight is given to the max computer score of the flag played on
		being > (>= if player's flag is unfilled) the max score of the
		player in that scenario.

		Only basic game (no special cards).
	
		AI does not take flag order into account.

*/

$(document).ready(function() {

	STATE = {
		selectedCard: null,
		selectedField: null,
		playerHandSize: 7,
		computerHandSize: 7
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

	//show game on screen, set up click triggers
	setUp();


	function setUp(){
		
		visualize();


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

		//Click on special stack
		$("#special-cards").on("click.selectStack", function(event) {
//			alert(JSON.stringify(computerHand));
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
					playerHand = sortHand(playerHand);
					STATE.playerHandSize = STATE.playerHandSize - 1;
				}
				
				//claim flags for the computer
				flagClaim("computer");
				alertVictory();

				//computer plays and draws a card
				var computerOutput = computerTurn();

				//reset selected field/card and redisplay
				STATE.selectedCard = null;
				STATE.selectedField = null;
				flagClaim("player");
				setUp();

				//highlight computer's last played card
				if(computerOutput != null) {
					$(".computerFieldSpace .card").css({"border-color":"black"});
					$("#computer-field-slot-"+(computerOutput.flagNum+1)+"-"+(computerOutput.slotNum+1)+" .card").css({"border-color":"white"});
				}

				alertVictory();

			} else {

				//allow turn pass if no legal play

				legalPlay = false;
				for(var i=0; i<9; i++){
					if(!Array.isArray(playerField[i][2]) && flags[i][0] == "center"){
						//flag has empty spot and is unclaimed
						legalPlay = true;
					}
				}

				if(!legalPlay){
					alert('there is no legal play - passing turn to computer');
					//claim flags for the computer
					flagClaim("computer");
					//computer plays and draws a card
					computerTurn();
					//reset selected field/card and redisplay
					STATE.selectedCard = null;
					STATE.selectedField = null;
					flagClaim("player");
					setUp();

				}
			}
		});	


	}

	function visualize() {
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
	}

	//computer plays a card and draws a card
	function computerTurn() {

		//prohibit turn if no legal play
		legalPlay = false;
		for(var i=0; i<9; i++){
			if(!Array.isArray(computerField[i][2]) && flags[i][0] == "center"){
				//flag has empty spot and is unclaimed
				legalPlay = true;
			}
		}

		if(legalPlay){

			var computerPlay = aiEngine(); //return [flag #, card # in hand]

			computerPlay.slotNum = 2; //assume third slot
			if(!Array.isArray(computerField[computerPlay.flagNum][1])){
				computerPlay.slotNum = 1; //if second slot is empty go there
			}
			if(!Array.isArray(computerField[computerPlay.flagNum][0])){
				computerPlay.slotNum = 0; //if first slot is empty go there
			}

			computerField[computerPlay.flagNum][computerPlay.slotNum] = computerHand[computerPlay.cardNum];

			//draw card if deck isn't empty
			if(Array.isArray(regularCards[0])){
				computerHand[computerPlay.cardNum] = regularCards[0];
				regularCards = regularCards.slice(1,regularCards.length);
			} else {
				computerHand[computerPlay.cardNum] = null;
				computerHand = sortHand(computerHand);
				STATE.computerHandSize = STATE.computerHandSize - 1;
			}
			return computerPlay;
		}

		return null;
	
	}


	function aiEngine() {

		$("#special-cards").html('0%');

		var output = {
			cardNum: 0,
			flagNum: 0,
			slotNum: 0,
			maxScore: -10000 // negative to ensure this value will not persist
		}

		//number of shuffle scenarios checked
		var randomChecks = Math.min(Math.floor(1000/(regularCards.length*2 + 14)),30);

		

		flagRange1 = 0;
		flagRange2 = 9;

		//check for flags about to be claimed by player - dump card there if flag will be claimed.
		for(var i = 0; i<9; i++){
			if(flags[i][0] == "center" && Array.isArray(playerField[i][2])) {
				//this flag is unclaimed and full on player's side
				var remainingCards = playerHand.concat(computerHand).concat(regularCards);

				if(directScore(playerField[i].slice(0)) >= scoreFlag(computerField[i].slice(0), remainingCards.slice(0))){
					//player flag score is >= max computer flag score, computer will play there this turn.
					flagRange1 = i;
					flagRange2 = i+1;
				}
			}
		}

		$("#special-cards").html('12%');

		//generate best play by cycling through all possible plays, and picking the
		//one that yields the highest odds of winning each flag on the field combined
		for(var c=0; c<7; c++){ 					//7 cards
			if(Array.isArray(computerHand[c])){ 	//if card exists
				for(var f=flagRange1; f<flagRange2; f++) { 			//9 flags (unless one about to be claimed by player)
					if(!Array.isArray(computerField[f][2]) && flags[f][0] == "center") { //flag  is not full or claimed

						//scoring variable
						var max = 0;

						for(var s=0; s<randomChecks; s++){ //shuffle deck to check {randomChecks} times
							
							//duplicate deck including player hand (don't shuffle real one)
							var randomDeck = regularCards.slice(0);
							randomDeck = randomDeck.concat(playerHand.slice(0, STATE.playerHandSize));

							//shuffle duplicate deck (cards computer 'cant see')
							for(var i=0; i<randomDeck.length; i++){
								randomDeck[i][3] = Math.random();
							}
							randomDeck = randomDeck.sort(function(a, b) {
								if (a[3] > b[3]) {return 1;}
								else if (a[3] < b[3]) {return -1;}
								else {return 0;}
							});

							//generate cards player/computer will get in this scenario



							var computerPotentialCards = randomDeck.slice(0, Math.ceil((randomDeck.length-STATE.playerHandSize)*.5));
							computerPotentialCards = computerPotentialCards.concat(computerHand.slice(0,c)).concat(computerHand.slice(c+1,STATE.computerHandSize)); //add cards in hand minus card to play
							var playerPotentialCards = randomDeck.slice(Math.floor((randomDeck.length-STATE.playerHandSize)*.5), randomDeck.length);

							if(s==0 && regularCards.length == 0) {
								alert(JSON.stringify(computerPotentialCards));
								alert(JSON.stringify(playerPotentialCards));
							}

							for(var checkFlag = 0; checkFlag <9; checkFlag++){
								if(flags[checkFlag][0] == "center") {
									//calculate percentage of victory for each unclaimed flag

									//calculate max player score for this flag
									var playerScore = scoreFlag(playerField[checkFlag].slice(0), playerPotentialCards);

									//get flag to check
									var targetFlag = computerField[checkFlag].slice(0);

									var multiplier = 1;

									if(checkFlag == f){ //special case when flag is the one played on
										//add card to flag
										targetFlag[determineEmptySlot(targetFlag)] = computerHand[c].slice(0);
										//double importance of this flag in weighting scheme
										multiplier = 2;

										//put weight of 4 on whether or not computer's max score > (>=) player max score
										//if player's flag is full, computer's score must beat player's.
										if(Array.isArray(playerField[checkFlag][2])){
											max = max + 4 * (playerScore < scoreFlag(targetFlag, computerPotentialCards));
										} else { //if player's flag is not full, score can equal (computer could fill first)
											max = max + 4 * (playerScore <= scoreFlag(targetFlag, computerPotentialCards));

										}
									}

									//calculate percentage of winning this flag in this scenario, sum with other flags percentages.
									var withPlay = scoreCheckFlag(targetFlag, computerPotentialCards, playerScore);
									max = max + multiplier*(withPlay.victories/withPlay.possibilities);
								}

							}
							
						}
						//this option is the best so far?
						if(max > output.maxScore){
							output.cardNum = c;
							output.flagNum = f;
							output.maxScore = max;
						}
					}
				}
			}
			$("#special-cards").html(Math.floor((c+2)*12.5) + "%"); //FIGURE OUT HOW TO DISPLAY 
		}

		//RANDOM GENERATOR FOR CARD PLACEMENT
/*		output.cardNum = Math.floor(Math.random()*7);
		//redo select card if slot is empty (for when deck runs out)
		while(!Array.isArray(computerHand[output.cardNum])) {
			output.flagNum = Math.floor(Math.random()*7);

		}


		output.flagNum = Math.floor(Math.random()*9);
		//redo select flag if flag is full or claimed
		while(Array.isArray(computerField[output.flagNum][2]) || flags[output.flagNum][0] != "center") {
			output.flagNum = Math.floor(Math.random()*9);
		}
*/
		return output;
	}

	function flagClaim(turn) {
		if(turn == "player") { //claim flags for player
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
		} else { //claim flags for computer
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

	//find max score of a flag given remaining potential cards
	function scoreFlag(inputFlag, potentialCards) {
		//determine how many slots are full
		var unfilledSlot = determineEmptySlot(inputFlag);

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

	//find number of potential formations and of potential victories versus a given score for a flag
	function scoreCheckFlag(inputFlag, potentialCards, checkScore) {
		//determine how many slots are full
		var unfilledSlot = determineEmptySlot(inputFlag);

		if(unfilledSlot == null){
			// return a win if score beats checkScore
			var wins = {
				victories: 0 + (directScore(inputFlag) >= checkScore), //equals should be there?
				possibilities: 1
			}
			return wins;

		} else {
			//cycle through possibilities
			var wins = {
				victories: 0,
				possibilities: 0
			}

			for(var i=0; i<potentialCards.length-2+unfilledSlot; i++) {
				var dummyFlag = inputFlag.slice(0);
				//calculate score recursively, adding victories vs checkScore
				dummyFlag[unfilledSlot] = potentialCards[i];
				var dummyWins = scoreCheckFlag(dummyFlag, potentialCards.slice(i+1),checkScore)
				wins.victories = wins.victories + dummyWins.victories;
				wins.possibilities = wins.possibilities + dummyWins.possibilities;
			}

			//return victories and possibilities
			return wins;
		}
	}

	//return which slot in a flag is empty - null if none
	function determineEmptySlot(inputFlag) {
		var unfilledSlot = null;
		if(!Array.isArray(inputFlag[0])) {
			unfilledSlot = 0;
		} else if(!Array.isArray(inputFlag[1])) {
			unfilledSlot = 1;
		} else if(!Array.isArray(inputFlag[2])) {
			unfilledSlot = 2;
		}

		return unfilledSlot;
	}


	//calculate score of a full flag side
	function directScore(inputFlag){

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

	function sortHand(participantHand) {

		participantHand = participantHand.sort(function(a, b) {
			if (!Array.isArray(a)) {return 1;}
			else if (!Array.isArray(b)) {return -1;}
			else {return 0;}
		});

		return participantHand;
	}
	
});
