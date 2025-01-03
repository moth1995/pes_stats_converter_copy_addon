class PES21Player{

	constructor(){
		this.playerSkills = "";
		this.COMPlayingStyles = "";
		this.playingStyle = "";
		this.positionsNumbers = [0,0,0,0,0,0,0,0,0,0,0,0,0];
	}

	NameToShirtName(name) {
		const nameParts = name.split(' ');
		const lastName = nameParts[nameParts.length - 1].toUpperCase();
	
		// Replace characters that the PES editor doesn't recognize
		const translationMap = {
			'Á': 'A', 'À': 'A', 'É': 'E', 'È': 'E', 'Í': 'I', 'Ì': 'I',
			'Ó': 'O', 'Ò': 'O', 'Ú': 'U', 'Ù': 'U', 'Ü': 'U', 'Ñ': 'N', 'Ć': 'C',
			'Â': 'A', 'Ä': 'A', 'Ê': 'E', 'Ë': 'E', 'Î': 'I', 'Ï': 'I',
			'Ô': 'O', 'Ö': 'O', 'Û': 'U', 'Ü': 'U', 'Ç': 'C', 'Å': 'A', 'Ã' : 'A',
		};
	
		const translatedLastName = Array.from(lastName, char => translationMap[char] || char).join('');
	
		let formattedLastName = translatedLastName;	
		return formattedLastName;
	}

	PSDString(){
		return `Name: ${this.name}
Shirt Name: ${this.shirtName}
Nationality: ${this.nationality}
Age: ${this.age}
Foot: ${this.foot}
Registered Position: ${this.registeredPosition}
Positions: ${this.positions}

APPEARANCE:
Height: ${this.height} cm
Weight: ${this.weight} kg

STATS:
Offensive Awareness: ${this.offensiveAwareness}
Ball Control: ${this.ballControl}
Dribbling: ${this.dribbling}
Tight Possession: ${this.tightPossession}
Low Pass: ${this.lowPass}
Lofted Pass: ${this.loftedPass}
Finishing: ${this.finishing}
Header: ${this.heading}
Place Kicking: ${this.placeKicking}
Curl: ${this.curl}
Speed: ${this.speed}
Acceleration: ${this.acceleration}
Kicking Power: ${this.kickingPower}
Jump: ${this.jump}
Physical Contact: ${this.physicalContact}
Balance: ${this.balance}
Stamina: ${this.stamina}
Defence Awareness: ${this.defensiveAwareness}
Ball Winning: ${this.ballWinning}
Aggression: ${this.aggression}
GK Awareness: ${this.gkAwareness}
GK Catching: ${this.gkCatching}
GK Clearing: ${this.gkClearing}
GK Reflexes: ${this.gkReflexes}
GK Reach: ${this.gkReach}
Weak Foot Usage: ${this.weakFootUsage}
Weak Foot Accuracy: ${this.weakFootAccuracy}
Form: ${this.form}
Injury Tolerance: ${this.injuryTolerance}

CARD PLAYER SKILL:
${this.playerSkills}
CARD STYLE COM:
${this.COMPlayingStyles}
PLAYING STYLE:
${this.playingStyle}
`;
	}

	CSVString(){
		let foot = this.foot == "L" ? "True": "False";

		this.positions.forEach(position => {

			let positionNoStar = position.replace("*", "");
			let index = this.PES21PosToNum(positionNoStar);
			this.positionsNumbers[index] = 1;

			if (position.indexOf("*") > -1){
				this.positionsNumbers[index] = 2;
			}

		});

		return `;\
${this.name};\
${this.name};\
${this.shirtName};\
${this.shirtName};\
-1;\
${this.PES21NationToNum(this.nationality)};\
0;\
${this.height};\
${this.weight};\
${this.age};\
${foot};\
${this.PES21PlayingStyleToNumber(this.playingStyle)};\
${this.PES21PosToNum(this.registeredPosition)};\
${this.positionsNumbers.join(";")};\
${this.offensiveAwareness};\
${this.ballControl};\
${this.dribbling};\
${this.tightPossession};\
${this.lowPass};\
${this.loftedPass};\
${this.finishing};\
${this.heading};\
${this.placeKicking};\
${this.curl};\
${this.speed};\
${this.acceleration};\
${this.kickingPower};\
${this.jump};\
${this.physicalContact};\
${this.balance};\
${this.stamina};\
${this.defensiveAwareness};\
${this.ballWinning};\
${this.aggression};\
${this.gkAwareness};\
${this.gkCatching};\
${this.gkClearing};\
${this.gkReflexes};\
${this.gkReach};\
${this.weakFootUsage};\
${this.weakFootAccuracy};\
${this.form};\
${this.injuryTolerance};\
3;\
2;\
${this.CSVSkillEvaluator(this.trickster)};\
${this.CSVSkillEvaluator(this.mazingRun)};\
${this.CSVSkillEvaluator(this.speedingBullet)};\
${this.CSVSkillEvaluator(this.incisiveRun)};\
${this.CSVSkillEvaluator(this.longBallExpert)};\
${this.CSVSkillEvaluator(this.earlyCross)};\
${this.CSVSkillEvaluator(this.longRanger)};\
${this.CSVSkillEvaluator(this.scissorsFeint)};\
${this.CSVSkillEvaluator(this.doubleTouch)};\
${this.CSVSkillEvaluator(this.flipFlap)};\
${this.CSVSkillEvaluator(this.marseilleTurn)};\
${this.CSVSkillEvaluator(this.sombrero)};\
${this.CSVSkillEvaluator(this.crossOverTurn)};\
${this.CSVSkillEvaluator(this.cutBehindAndTurn)};\
${this.CSVSkillEvaluator(this.scotchMove)};\
${this.CSVSkillEvaluator(this.stepOneBallControl)};\
${this.CSVSkillEvaluator(this.headingPlayerSkill)};\
${this.CSVSkillEvaluator(this.longRangeDrive)};\
${this.CSVSkillEvaluator(this.chipShotControl)};\
${this.CSVSkillEvaluator(this.longRangeShooting)};\
${this.CSVSkillEvaluator(this.knuckleShots)};\
${this.CSVSkillEvaluator(this.dippingShot)};\
${this.CSVSkillEvaluator(this.risingShots)};\
${this.CSVSkillEvaluator(this.acrobaticFinishing)};\
${this.CSVSkillEvaluator(this.heelTrick)};\
${this.CSVSkillEvaluator(this.firstTimeShot)};\
${this.CSVSkillEvaluator(this.oneTouchPass)};\
${this.CSVSkillEvaluator(this.throughPassing)};\
${this.CSVSkillEvaluator(this.weightedPass)};\
${this.CSVSkillEvaluator(this.pinpointCrossing)};\
${this.CSVSkillEvaluator(this.outsideCurler)};\
${this.CSVSkillEvaluator(this.rabona)};\
${this.CSVSkillEvaluator(this.noLookPass)};\
${this.CSVSkillEvaluator(this.lowLoftedPass)};\
${this.CSVSkillEvaluator(this.gkLowPunt)};\
${this.CSVSkillEvaluator(this.gkHighPunt)};\
${this.CSVSkillEvaluator(this.longThrow)};\
${this.CSVSkillEvaluator(this.gkLongThrow)};\
${this.CSVSkillEvaluator(this.penaltySpecialist)};\
${this.CSVSkillEvaluator(this.gkPenaltySaver)};\
${this.CSVSkillEvaluator(this.gamesmanship)};\
${this.CSVSkillEvaluator(this.manMarking)};\
${this.CSVSkillEvaluator(this.trackBack)};\
${this.CSVSkillEvaluator(this.interception)};\
${this.CSVSkillEvaluator(this.acrobaticClear)};\
${this.CSVSkillEvaluator(this.captaincy)};\
${this.CSVSkillEvaluator(this.superSub)};\
${this.CSVSkillEvaluator(this.fightingSpirit)};\
0;\
0;\
1;\
1;\
1;\
1;\
1;\
1;\
1;\
1;\
0;\
0;\
01/01/0001 00:00:00;\
01/01/0001 00:00:00;\
0;\
0;\
False;\
${foot};\
False;\
False;\
False;\
False;\
False;\
False;\
False;\
False;\
False;\
False;\
False;\
False;\
False;\
False;\
False;\
False;\
False;\
0;\
False;\
-1;\
0;\
0;\
0;\
0;\
0;\
False;\
0;`;
	}

	CSVSkillEvaluator(skill){
		return skill > 0 ? "True" : "False";
	}

	PES21PlayingStyleToNumber(playingStyle){
		switch (playingStyle) {
			case "":
				return 0;
			case "Goal Poacher":
				return 1;
			case "Dummy Runner":
				return 2;
			case "Fox in the Box":
				return 3;
			case "Prolific Winger":
				return 4;
			case "Classic No. 10":
				return 5;
			case "Hole Player":
				return 6;
			case "Box-to-Box":
				return 7;
			case "Anchor Man":
				return 8;
			case "The Destroyer":
				return 9;
			case "Extra Frontman":
				return 10;
			case "Offensive Full-back":
				return 11;
			case "Defensive Full-back":
				return 12;
			case "Target Man":
				return 13;
			case "Creative Playmaker":
				return 14;
			case "Build Up":
				return 15;
			case "Offensive Goalkeeper":
				return 16;
			case "Defensive Goalkeeper":
				return 17;
			case "Roaming Flank":
				return 18;
			case "Cross Specialist":
				return 19;
			case "Orchestrator":
				return 20;
			case "Full-back Finisher":
				return 21;
			default:
				return 0;
		}
	}

	PES21PosToNum(position) {
		switch (position) {
			case "GK":
				return 0;
			case "CB":
				return 1;
			case "LB":
				return 2;
			case "RB":
				return 3;
			case "DMF":
				return 4;
			case "CMF":
				return 5;
			case "LMF":
				return 6;
			case "RMF":
				return 7;
			case "AMF":
				return 8;
			case "LWF":
				return 9;
			case "RWF":
				return 10;
			case "SS":
				return 11;
			case "CF":
				return 12;
			default:
				return 0;
		}
	}

	PES21NationToNum(nation) {
		return PES21_COUNTRY_MAP[nation] !== undefined ? PES21_COUNTRY_MAP[nation] : 0;
	}
	

	FromFIFA17To23Player(fifaPlayer){
		return "";
	}

	FromFMPlayer(fmPlayer){
		let FMPositions = FMPositionStringToArray(fmPlayer.info["Position(s)"]);
		console.log(FMPositions);
		//this.registeredPosition = FMPositions.includes("AMC") &&FMPositions.includes("ST") ? "SS" : FMToPES21Positions(FMPositions[0]);
		let isSS = FMPositions.includes("AMC") &&FMPositions.includes("ST");
		this.positions = [];
		for (let index = 0; index < FMPositions.length; index++) {
			/*
			if (this.registeredPosition != FMToPES21Positions(FMPositions[index])){
				this.positions.push(FMToPES21Positions(FMPositions[index]));
			}
			*/
			let position = (fmPlayer.positionType[index] === "Natural" ? "*" : "") + FMToPES21Positions(FMPositions[index]);
			this.positions.push(position);

		}
		if (isSS){
			if (fmPlayer.positionType[FMPositions.indexOf("AMC")] === "Natural" && fmPlayer.positionType[FMPositions.indexOf("ST")] === "Natural")
				this.positions.push("*SS");
			else{
				this.positions.push("SS");
			}
		}
		let positionWeight = {};
		this.positions.forEach(position => {
			if (position.includes("*")){
				let weight = PES21GetPositionWeight(position, fmPlayer);
				positionWeight[position] = weight;
			}
		});
		console.log(positionWeight);
		this.registeredPosition = (Object.keys(positionWeight).reduce((a, b) => positionWeight[a] > positionWeight[b] ? a : b)).replace("*", "");
		console.log(this.registeredPosition);
		this.currentAbility = parseInt(fmPlayer.ability);
		this.name = fmPlayer.info["Name"];
		this.shirtName = this.NameToShirtName(this.name);
		this.age = parseInt(fmPlayer.info["Age"]);
		this.nationality = fmPlayer.nationality;
		this.foot = fmPlayer.info["Foot"] == "Left" ? "L" : "R" ;

		this.height = parseInt(fmPlayer.info["Height"]);
		this.weight = parseInt(fmPlayer.info["Weight"]);

		this.injuryTolerance = FMToPES21Stat1To3(fmPlayer.stats["Natural Fitness"]);
		this.form = FMToPES21Stat1To8(fmPlayer.stats["Natural Fitness"]);

		switch(fmPlayer.info["Foot"]){
			case "Only":
				this.weakFootUsage = 2;
				this.weakFootAccuracy = 2;
				break;
			case "Right":
			case "Left":
				this.weakFootUsage = 3;
				this.weakFootAccuracy = 3;
				break;
			case "Both":
				this.weakFootUsage = 4;
				this.weakFootAccuracy = 4;
				break;
		}

		if (this.registeredPosition == "GK"){
			this.offensiveAwareness = FMStatTOPES21(Average([fmPlayer.stats["Anticipation"], fmPlayer.stats["Technique"], fmPlayer.stats["Off the Ball"], fmPlayer.stats["Off the Ball"]]), maxStatsTable.find(row => row.position === this.registeredPosition).offensiveAwareness, minStatsTable.find(row => row.position === this.registeredPosition).offensiveAwareness, this.currentAbility);
			this.ballControl = FMStatTOPES21(Average([fmPlayer.stats["Flair"], fmPlayer.stats["Flair"], fmPlayer.stats["Technique"], fmPlayer.stats["Technique"]]), maxStatsTable.find(row => row.position === this.registeredPosition).ballControl, minStatsTable.find(row => row.position === this.registeredPosition).ballControl, this.currentAbility);
			this.dribbling = FMStatTOPES21(Average([fmPlayer.stats["First Touch"], fmPlayer.stats["First Touch"], fmPlayer.stats["Flair"], fmPlayer.stats["Flair"]]), maxStatsTable.find(row => row.position === this.registeredPosition).dribbling, minStatsTable.find(row => row.position === this.registeredPosition).dribbling, this.currentAbility);
			this.tightPossession = FMStatTOPES21(Average([fmPlayer.stats["Eccentricity"], fmPlayer.stats["Eccentricity"], fmPlayer.stats["Technique"], fmPlayer.stats["Technique"], fmPlayer.stats["Strength"], fmPlayer.stats["Agility"], fmPlayer.stats["Balance"]]), maxStatsTable.find(row => row.position === this.registeredPosition).tightPossession, minStatsTable.find(row => row.position === this.registeredPosition).tightPossession, this.currentAbility);
			this.lowPass = FMStatTOPES21(Average([fmPlayer.stats["Passing"], fmPlayer.stats["Passing"], fmPlayer.stats["Passing"], fmPlayer.stats["Technique"], fmPlayer.stats["Composure"]]), maxStatsTable.find(row => row.position === this.registeredPosition).lowPass, minStatsTable.find(row => row.position === this.registeredPosition).lowPass, this.currentAbility);
			this.loftedPass = FMStatTOPES21(Average([fmPlayer.stats["Throwing"], fmPlayer.stats["Throwing"], fmPlayer.stats["Passing"], fmPlayer.stats["Passing"], fmPlayer.stats["Technique"]]), maxStatsTable.find(row => row.position === this.registeredPosition).loftedPass, minStatsTable.find(row => row.position === this.registeredPosition).loftedPass, this.currentAbility);
			this.finishing = FMStatTOPES21(Average([fmPlayer.stats["Technique"], fmPlayer.stats["Technique"], fmPlayer.stats["Technique"], fmPlayer.stats["Composure"], fmPlayer.stats["Composure"]]), maxStatsTable.find(row => row.position === this.registeredPosition).finishing, minStatsTable.find(row => row.position === this.registeredPosition).finishing, this.currentAbility);
			this.heading = FMStatTOPES21(Average([fmPlayer.stats["Technique"], fmPlayer.stats["Technique"], fmPlayer.stats["Technique"], fmPlayer.stats["Jumping Reach"]]), maxStatsTable.find(row => row.position === this.registeredPosition).heading, minStatsTable.find(row => row.position === this.registeredPosition).heading, this.currentAbility);
			this.placeKicking = FMStatTOPES21(Average([fmPlayer.stats["Free Kick Taking"], fmPlayer.stats["Free Kick Taking"], fmPlayer.stats["Technique"], fmPlayer.stats["Penalty Taking"]]), maxStatsTable.find(row => row.position === this.registeredPosition).placeKicking, minStatsTable.find(row => row.position === this.registeredPosition).placeKicking, this.currentAbility);
			this.curl = FMStatTOPES21(Average([fmPlayer.stats["Technique"], fmPlayer.stats["Technique"], fmPlayer.stats["Flair"], fmPlayer.stats["Flair"]]), maxStatsTable.find(row => row.position === this.registeredPosition).curl, minStatsTable.find(row => row.position === this.registeredPosition).curl, this.currentAbility);
			this.speed = FMStatTOPES21(Average([fmPlayer.stats["Pace"], fmPlayer.stats["Pace"], fmPlayer.stats["Pace"], fmPlayer.stats["Acceleration"]]), maxStatsTable.find(row => row.position === this.registeredPosition).speed, minStatsTable.find(row => row.position === this.registeredPosition).speed, this.currentAbility);
			this.acceleration = FMStatTOPES21(Average([fmPlayer.stats["Acceleration"], fmPlayer.stats["Acceleration"], fmPlayer.stats["Acceleration"], fmPlayer.stats["Agility"], fmPlayer.stats["Pace"]]), maxStatsTable.find(row => row.position === this.registeredPosition).acceleration, minStatsTable.find(row => row.position === this.registeredPosition).acceleration, this.currentAbility);
			this.kickingPower = FMStatTOPES21(Average([fmPlayer.stats["Throwing"], fmPlayer.stats["Throwing"], fmPlayer.stats["Strength"], fmPlayer.stats["Strength"]]), maxStatsTable.find(row => row.position === this.registeredPosition).kickingPower, minStatsTable.find(row => row.position === this.registeredPosition).kickingPower, this.currentAbility);
			this.jump = FMStatTOPES21(Average([fmPlayer.stats["Jumping Reach"], fmPlayer.stats["Jumping Reach"], fmPlayer.stats["Jumping Reach"], fmPlayer.stats["Strength"], fmPlayer.stats["Agility"]]), maxStatsTable.find(row => row.position === this.registeredPosition).jump, minStatsTable.find(row => row.position === this.registeredPosition).jump, this.currentAbility);
			this.physicalContact = FMStatTOPES21(Average([fmPlayer.stats["Strength"], fmPlayer.stats["Strength"], fmPlayer.stats["Strength"], fmPlayer.stats["Strength"], fmPlayer.stats["Balance"]]), maxStatsTable.find(row => row.position === this.registeredPosition).physicalContact, minStatsTable.find(row => row.position === this.registeredPosition).physicalContact, this.currentAbility);
			this.balance = FMStatTOPES21(Average([fmPlayer.stats["Balance"], fmPlayer.stats["Balance"], fmPlayer.stats["Balance"], fmPlayer.stats["Agility"], fmPlayer.stats["Agility"]]), maxStatsTable.find(row => row.position === this.registeredPosition).balance, minStatsTable.find(row => row.position === this.registeredPosition).balance, this.currentAbility);
			this.stamina = FMStatTOPES21(Average([fmPlayer.stats["Stamina"], fmPlayer.stats["Stamina"], fmPlayer.stats["Stamina"], fmPlayer.stats["Natural Fitness"], fmPlayer.stats["Work Rate"]]), maxStatsTable.find(row => row.position === this.registeredPosition).stamina, minStatsTable.find(row => row.position === this.registeredPosition).stamina, this.currentAbility);
			this.defensiveAwareness = FMStatTOPES21(Average([fmPlayer.stats["Positioning"], fmPlayer.stats["Positioning"], fmPlayer.stats["Rushing Out (Tendency)"], fmPlayer.stats["Bravery"]]), maxStatsTable.find(row => row.position === this.registeredPosition).defensiveAwareness, minStatsTable.find(row => row.position === this.registeredPosition).defensiveAwareness, this.currentAbility);
			this.ballWinning = FMStatTOPES21(Average([fmPlayer.stats["Eccentricity"], fmPlayer.stats["Eccentricity"], fmPlayer.stats["Aggression"], fmPlayer.stats["Aggression"], fmPlayer.stats["Bravery"], fmPlayer.stats["Bravery"]]), maxStatsTable.find(row => row.position === this.registeredPosition).ballWinning, minStatsTable.find(row => row.position === this.registeredPosition).ballWinning, this.currentAbility);
			this.aggression = FMStatTOPES21(Average([fmPlayer.stats["Aggression"], fmPlayer.stats["Aggression"], fmPlayer.stats["Aggression"], fmPlayer.stats["Determination"], fmPlayer.stats["Work Rate"], fmPlayer.stats["Work Rate"]]), maxStatsTable.find(row => row.position === this.registeredPosition).aggression, minStatsTable.find(row => row.position === this.registeredPosition).aggression, this.currentAbility);
			this.gkAwareness = FMStatTOPES21(Average([fmPlayer.stats["Positioning"], fmPlayer.stats["Positioning"], fmPlayer.stats["Rushing Out (Tendency)"], fmPlayer.stats["One on Ones"], fmPlayer.stats["Command of Area"]]), maxStatsTable.find(row => row.position === this.registeredPosition).gkAwareness, minStatsTable.find(row => row.position === this.registeredPosition).gkAwareness, this.currentAbility);
			this.gkCatching = FMStatTOPES21(Average([fmPlayer.stats["Handling"], fmPlayer.stats["Handling"], fmPlayer.stats["Handling"], fmPlayer.stats["Aerial Reach"], fmPlayer.stats["Aerial Reach"]]), maxStatsTable.find(row => row.position === this.registeredPosition).gkCatching, minStatsTable.find(row => row.position === this.registeredPosition).gkCatching, this.currentAbility);
			this.gkClearing = FMStatTOPES21(Average([fmPlayer.stats["Kicking"], fmPlayer.stats["Kicking"], fmPlayer.stats["Kicking"], fmPlayer.stats["Kicking"], fmPlayer.stats["First Touch"]]), maxStatsTable.find(row => row.position === this.registeredPosition).gkClearing, minStatsTable.find(row => row.position === this.registeredPosition).gkClearing, this.currentAbility);
			this.gkReflexes = FMStatTOPES21(Average([fmPlayer.stats["Reflexes"], fmPlayer.stats["Reflexes"], fmPlayer.stats["Reflexes"], fmPlayer.stats["Agility"], fmPlayer.stats["Natural Fitness"]]), maxStatsTable.find(row => row.position === this.registeredPosition).gkReflexes, minStatsTable.find(row => row.position === this.registeredPosition).gkReflexes, this.currentAbility);
			this.gkReach = FMStatTOPES21(Average([fmPlayer.stats["Aerial Reach"], fmPlayer.stats["Aerial Reach"], fmPlayer.stats["Agility"], fmPlayer.stats["Agility"], fmPlayer.stats["Jumping Reach"]]), maxStatsTable.find(row => row.position === this.registeredPosition).gkReach, minStatsTable.find(row => row.position === this.registeredPosition).gkReach, this.currentAbility);
		} else {
			//field players
			this.offensiveAwareness = FMStatTOPES21(Average([fmPlayer.stats["Anticipation"], fmPlayer.stats["Finishing"], fmPlayer.stats["Off the Ball"], fmPlayer.stats["Off the Ball"]]), maxStatsTable.find(row => row.position === this.registeredPosition).offensiveAwareness, minStatsTable.find(row => row.position === this.registeredPosition).offensiveAwareness, this.currentAbility);
			this.ballControl = FMStatTOPES21(Average([fmPlayer.stats["First Touch"], fmPlayer.stats["First Touch"], fmPlayer.stats["Dribbling"], fmPlayer.stats["Technique"]]), maxStatsTable.find(row => row.position === this.registeredPosition).ballControl, minStatsTable.find(row => row.position === this.registeredPosition).ballControl, this.currentAbility);
			this.dribbling = FMStatTOPES21(Average([fmPlayer.stats["Dribbling"], fmPlayer.stats["Dribbling"], fmPlayer.stats["Dribbling"], fmPlayer.stats["Flair"]]), maxStatsTable.find(row => row.position === this.registeredPosition).dribbling, minStatsTable.find(row => row.position === this.registeredPosition).dribbling, this.currentAbility);
			this.tightPossession = FMStatTOPES21(Average([fmPlayer.stats["Dribbling"], fmPlayer.stats["Dribbling"], fmPlayer.stats["Dribbling"], fmPlayer.stats["Technique"], fmPlayer.stats["Strength"], fmPlayer.stats["Agility"], fmPlayer.stats["Balance"]]), maxStatsTable.find(row => row.position === this.registeredPosition).tightPossession, minStatsTable.find(row => row.position === this.registeredPosition).tightPossession, this.currentAbility);
			this.lowPass = FMStatTOPES21(Average([fmPlayer.stats["Passing"], fmPlayer.stats["Passing"], fmPlayer.stats["Passing"], fmPlayer.stats["Technique"], fmPlayer.stats["Composure"]]), maxStatsTable.find(row => row.position === this.registeredPosition).lowPass, minStatsTable.find(row => row.position === this.registeredPosition).lowPass, this.currentAbility);
			this.loftedPass = FMStatTOPES21(Average([fmPlayer.stats["Crossing"], fmPlayer.stats["Crossing"], fmPlayer.stats["Passing"], fmPlayer.stats["Passing"], fmPlayer.stats["Technique"]]), maxStatsTable.find(row => row.position === this.registeredPosition).loftedPass, minStatsTable.find(row => row.position === this.registeredPosition).loftedPass, this.currentAbility);
			this.finishing = FMStatTOPES21(Average([fmPlayer.stats["Finishing"], fmPlayer.stats["Finishing"], fmPlayer.stats["Finishing"], fmPlayer.stats["Composure"], fmPlayer.stats["Technique"]]), maxStatsTable.find(row => row.position === this.registeredPosition).finishing, minStatsTable.find(row => row.position === this.registeredPosition).finishing, this.currentAbility);
			this.heading = FMStatTOPES21(Average([fmPlayer.stats["Heading"], fmPlayer.stats["Heading"], fmPlayer.stats["Finishing"], fmPlayer.stats["Jumping Reach"]]), maxStatsTable.find(row => row.position === this.registeredPosition).heading, minStatsTable.find(row => row.position === this.registeredPosition).heading, this.currentAbility);
			this.placeKicking = FMStatTOPES21(Average([fmPlayer.stats["Free Kick Taking"], fmPlayer.stats["Free Kick Taking"], fmPlayer.stats["Corners"], fmPlayer.stats["Penalty Taking"]]), maxStatsTable.find(row => row.position === this.registeredPosition).placeKicking, minStatsTable.find(row => row.position === this.registeredPosition).placeKicking, this.currentAbility);
			this.curl = FMStatTOPES21(Average([fmPlayer.stats["Technique"], fmPlayer.stats["Technique"], fmPlayer.stats["Flair"], fmPlayer.stats["Flair"]]), maxStatsTable.find(row => row.position === this.registeredPosition).curl, minStatsTable.find(row => row.position === this.registeredPosition).curl, this.currentAbility);
			this.speed = FMStatTOPES21(Average([fmPlayer.stats["Pace"], fmPlayer.stats["Pace"], fmPlayer.stats["Pace"], fmPlayer.stats["Acceleration"]]), maxStatsTable.find(row => row.position === this.registeredPosition).speed, minStatsTable.find(row => row.position === this.registeredPosition).speed, this.currentAbility);
			this.acceleration = FMStatTOPES21(Average([fmPlayer.stats["Acceleration"], fmPlayer.stats["Acceleration"], fmPlayer.stats["Acceleration"], fmPlayer.stats["Agility"], fmPlayer.stats["Pace"]]), maxStatsTable.find(row => row.position === this.registeredPosition).acceleration, minStatsTable.find(row => row.position === this.registeredPosition).acceleration, this.currentAbility);
			this.kickingPower = FMStatTOPES21(Average([fmPlayer.stats["Long Shots"], fmPlayer.stats["Long Shots"], fmPlayer.stats["Strength"], fmPlayer.stats["Strength"]]), maxStatsTable.find(row => row.position === this.registeredPosition).kickingPower, minStatsTable.find(row => row.position === this.registeredPosition).kickingPower, this.currentAbility);
			this.jump = FMStatTOPES21(Average([fmPlayer.stats["Jumping Reach"], fmPlayer.stats["Jumping Reach"], fmPlayer.stats["Jumping Reach"], fmPlayer.stats["Heading"], fmPlayer.stats["Agility"]]), maxStatsTable.find(row => row.position === this.registeredPosition).jump, minStatsTable.find(row => row.position === this.registeredPosition).jump, this.currentAbility);
			this.physicalContact = FMStatTOPES21(Average([fmPlayer.stats["Strength"], fmPlayer.stats["Strength"], fmPlayer.stats["Strength"], fmPlayer.stats["Strength"], fmPlayer.stats["Balance"]]), maxStatsTable.find(row => row.position === this.registeredPosition).physicalContact, minStatsTable.find(row => row.position === this.registeredPosition).physicalContact, this.currentAbility);
			this.balance = FMStatTOPES21(Average([fmPlayer.stats["Balance"], fmPlayer.stats["Balance"], fmPlayer.stats["Balance"], fmPlayer.stats["Agility"], fmPlayer.stats["Agility"]]), maxStatsTable.find(row => row.position === this.registeredPosition).balance, minStatsTable.find(row => row.position === this.registeredPosition).balance, this.currentAbility);
			this.stamina = FMStatTOPES21(Average([fmPlayer.stats["Stamina"], fmPlayer.stats["Stamina"], fmPlayer.stats["Stamina"], fmPlayer.stats["Natural Fitness"], fmPlayer.stats["Work Rate"]]), maxStatsTable.find(row => row.position === this.registeredPosition).stamina, minStatsTable.find(row => row.position === this.registeredPosition).stamina, this.currentAbility);
			this.defensiveAwareness = FMStatTOPES21(Average([fmPlayer.stats["Positioning"], fmPlayer.stats["Positioning"], fmPlayer.stats["Marking"], fmPlayer.stats["Tackling"]]), maxStatsTable.find(row => row.position === this.registeredPosition).defensiveAwareness, minStatsTable.find(row => row.position === this.registeredPosition).defensiveAwareness, this.currentAbility);
			this.ballWinning = FMStatTOPES21(Average([fmPlayer.stats["Tackling"], fmPlayer.stats["Tackling"], fmPlayer.stats["Tackling"], fmPlayer.stats["Aggression"], fmPlayer.stats["Marking"], fmPlayer.stats["Bravery"]]), maxStatsTable.find(row => row.position === this.registeredPosition).ballWinning, minStatsTable.find(row => row.position === this.registeredPosition).ballWinning, this.currentAbility);
			this.aggression = FMStatTOPES21(Average([fmPlayer.stats["Aggression"], fmPlayer.stats["Aggression"], fmPlayer.stats["Aggression"], fmPlayer.stats["Determination"], fmPlayer.stats["Work Rate"], fmPlayer.stats["Bravery"]]), maxStatsTable.find(row => row.position === this.registeredPosition).aggression, minStatsTable.find(row => row.position === this.registeredPosition).aggression, this.currentAbility);
			this.gkAwareness = 40;
			this.gkCatching = 40;
			this.gkClearing = 40;
			this.gkReflexes = 40;
			this.gkReach = 40;
		}

		//CARD PLAYER SKILL

		if (this.finishing >= 86 && this.balance >= 80){
			this.acrobaticFinishing = 1;
			this.playerSkills += "*Acrobatic Finishing" + "\n";
		} else{
			this.acrobaticFinishing = 0;
		}
		if (fmPlayer.stats["LEADERSHIP"] >= 13){
			this.captaincy = 1;
			this.playerSkills += "*Captaincy" + "\n";
		} else {
			this.captaincy = 0;
		}
		if (this.finishing >= 86 && this.ballControl >= 83){
			this.chipShotControl = 1;
			this.playerSkills += "*Chip Shot Control" + "\n";
		} else{
			this.chipShotControl = 0;
		}
		if (this.dribbling >= 83 && this.ballControl >= 85){
			this.crossOverTurn = 1;
			this.playerSkills += "*Cross Over Turn" + "\n";
		} else{
			this.crossOverTurn = 0;
		}
		if (this.dribbling >= 82 && this.ballControl >= 84){
			this.cutBehindAndTurn = 1;
			this.playerSkills += "*Cut Behind And Turn" + "\n";
		} else{
			this.cutBehindAndTurn = 0;
		}
		if (this.finishing >= 85 && this.kickingPower >= 80){
			this.dippingShot = 1;
			this.playerSkill += "*Dipping Shot" + "\n";
		} else{
			this.dippingShots = 0;
		}
		if (this.dribbling >= 79 && this.ballControl >= 84){
			this.doubleTouch = 1;
			this.playerSkills += "*Double Touch" + "\n";
		} else{
			this.doubleTouch = 0;
		}

		if (fmPlayer.stats["Aggression"] >= 14 && fmPlayer.stats["Teamwork"] >= 14 && fmPlayer.stats["Work Rate"] >= 14 && fmPlayer.stats["Bravery"] >= 14) {
			this.fightingSpirit = 1;
			this.playerSkills += "*Fighting Spirit" + "\n";
		} else {
			this.fightingSpirit = 0;
		}
		
		if (this.offensiveAwareness >= 83 && this.finishing >= 82) {
			this.firstTimeShot = 1;
			this.playerSkills += "*First Time Shot" + "\n";
		} else {
			this.firstTimeShot = 0;
		}
		
		if (this.ballControl >= 76 && this.dribbling >= 79) {
			this.flipFlap = 1;
			this.playerSkills += "*Flip Flap" + "\n";
		} else {
			this.flipFlap = 0;
		}
		
		if (this.acceleration >= 80 && this.balance >= 82 && this.dribbling >= 81) {
			this.gamesmanship = 1;
			this.playerSkills += "*Gamesmanship" + "\n";
		} else {
			this.gamesmanship = 0;
		}
		
		if (fmPlayer.stats["Kicking"] >= 14 && fmPlayer.stats["Strength"] >= 14) {
			this.gkHighPunt = 1;
			this.playerSkills += "*GK High Punt" + "\n";
		} else {
			this.gkHighPunt = 0;
		}
		
		if (fmPlayer.stats["Kicking"] >= 14) {
			this.gkLongThrow = 1;
			this.playerSkills += "*GK Long Throw" + "\n";
		} else {
			this.gkLongThrow = 0;
		}
		
		if (fmPlayer.stats["Throwing"] >= 14) {
			this.gkLowPunt = 1;
			this.playerSkills += "*GK Low Punt" + "\n";
		} else {
			this.gkLowPunt = 0;
		}
		
		if (fmPlayer.stats["Decisions"] >= 14 && fmPlayer.stats["Reflexes"] >= 14) {
			this.gkPenaltySaver = 1;
			this.playerSkills += "*GK Penalty Saver" + "\n";
		} else {
			this.gkPenaltySaver = 0;
		}
		
		if (fmPlayer.stats["Jumping Reach"] >= 14 && fmPlayer.stats["Heading"] >= 14) {
			this.headingPlayerSkill = 1;
			this.playerSkills += "*Heading" + "\n";
		} else {
			this.headingPlayerSkill = 0;
		}
		
		if (this.acrobaticFinishing >= 1 && this.finishing >= 85) {
			this.heelTrick = 1;
			this.playerSkills += "*Heel Trick" + "\n";
		} else {
			this.heelTrick = 0;
		}
		
		if (this.defensiveAwareness >= 85 && this.ballWinning >= 85) {
			this.interception = 1;
			this.playerSkills += "*Interception" + "\n";
		} else {
			this.interception = 0;
		}
		
		if (this.finishing >= 85 && this.placeKicking >= 75) {
			this.knuckleShots = 1;
			this.playerSkills += "*Knuckle Shots" + "\n";
		} else {
			this.knuckleShots = 0;
		}
		
		if (fmPlayer.stats["Flair"] >= 14 && fmPlayer.stats["Technique"] >= 14 && fmPlayer.stats["Long Shots"] >= 10) {
			this.longRangeDrive = 1;
			this.playerSkills += "*Long Range Drive" + "\n";
		} else {
			this.longRangeDrive = 0;
		}
		
		if (fmPlayer.stats["Long Throws"] >= 14) {
			this.longThrow = 1;
			this.playerSkills += "*Long Throw" + "\n";
		} else {
			this.longThrow = 0;
		}
		
		if (this.loftedPass >= 86) {
			this.lowLoftedPass = 1;
			this.playerSkills += "*Low Lofted Pass" + "\n";
		} else {
			this.lowLoftedPass = 0;
		}
		
		if (fmPlayer.stats["Marking"] >= 15) {
			this.manMarking = 1;
			this.playerSkills += "*Man Marking" + "\n";
		} else {
			this.manMarking = 0;
		}
		
		if (this.ballControl >= 77 && this.dribbling >= 78) {
			this.marseilleTurn = 1;
			this.playerSkills += "*Marseille Turn" + "\n";
		} else {
			this.marseilleTurn = 0;
		}
		
		if (fmPlayer.stats["Long Shots"] >= 13) {
			this.longRangeShooting = 1;
			this.playerSkills += "*Long Range Shooting" + "\n";
		} else {
			this.longRangeShooting = 0;
		}

		if (this.lowPass >= 85 && this.ballControl >= 80) {
			this.oneTouchPass = 1;
			this.playerSkills += "*One Touch Pass" + "\n";
		} else {
			this.oneTouchPass = 0;
		}

		if (this.oneTouchPass >= 1 && this.offensiveAwareness >= 80) {
			this.noLookPass = 1;
			this.playerSkills += "*No Look Pass" + "\n";
		} else {
			this.noLookPass = 0;
		}
		
		if (this.loftedPass >= 80 && this.finishing >= 80) {
			this.outsideCurler = 1;
			this.playerSkills += "*Outside Curler" + "\n";
		} else {
			this.outsideCurler = 0;
		}
		
		if (fmPlayer.stats["Penalty Taking"] >= 14) {
			this.penaltySpecialist = 1;
			this.playerSkills += "*Penalty Specialist" + "\n";
		} else {
			this.penaltySpecialist = 0;
		}
		
		if (this.offensiveAwareness >= 80 && this.loftedPass >= 85) {
			this.pinpointCrossing = 1;
			this.playerSkills += "*Pinpoint Crossing" + "\n";
		} else {
			this.pinpointCrossing = 0;
		}
		
		if (this.lowPass >= 75 && this.loftedPass >= 75 && this.finishing >= 75) {
			this.rabona = 1;
			this.playerSkills += "*Rabona" + "\n";
		} else {
			this.rabona = 0;
		}
		
		if (this.finishing >= 85 && this.ballControl >= 80) {
			this.risingShots = 1;
			this.playerSkills += "*Rising Shots" + "\n";
		} else {
			this.risingShots = 0;
		}
		
		if (this.ballControl >= 75 && this.dribbling >= 82) {
			this.scissorsFeint = 1;
			this.playerSkills += "*Scissors Feint" + "\n";
		} else {
			this.scissorsFeint = 0;
		}
		
		if (this.dribbling >= 75 && this.ballControl >= 80) {
			this.scotchMove = 1;
			this.playerSkills += "*Scotch Move" + "\n";
		} else {
			this.scotchMove = 0;
		}
		
		if (fmPlayer.stats["Flair"] >= 14 && fmPlayer.stats["Technique"] >= 14) {
			this.sombrero = 1;
			this.playerSkills += "*Sombrero" + "\n";
		} else {
			this.sombrero = 0;
		}
		
		if (this.ballControl >= 84) {
			this.stepOneBallControl = 1;
			this.playerSkills += "*Step On Skill control" + "\n";
		} else {
			this.stepOneBallControl = 0;
		}
		
		if (this.finishing >= 80 && this.acceleration >= 80 && this.stamina >= 65) {
			this.superSub = 1;
			this.playerSkills += "*Super Sub" + "\n";
		} else {
			this.superSub = 0;
		}
		
		if (this.lowPass >= 83 && this.loftedPass >= 83 && this.curl >= 75) {
			this.throughPassing = 1;
			this.playerSkills += "*Through Passing" + "\n";
		} else {
			this.throughPassing = 0;
		}
		
		if (this.ballWinning >= 85 && this.stamina >= 85) {
			this.trackBack = 1;
			this.playerSkills += "*Track Back" + "\n";
		} else {
			this.trackBack = 0;
		}
		
		if (this.loftedPass >= 85 && this.curl >= 75) {
			this.weightedPass = 1;
			this.playerSkills += "*Weighted Pass" + "\n";
		} else {
			this.weightedPass = 0;
		}
		
		if (this.defensiveAwareness >= 85 && this.jump >= 85) {
			this.acrobaticClear = 1;
			this.playerSkills += "*Acrobatic Clear" + "\n";
		} else {
			this.acrobaticClear = 0;
		}
		
		// CARD STYLE COM

		if (
			(this.registeredPosition === "LB" ||
			  this.registeredPosition === "RB" ||
			  this.registeredPosition === "RMF" ||
			  this.registeredPosition === "LMF" ||
			  this.registeredPosition === "AMF") &&
			  fmPlayer.stats["Crossing"] >= 14
		  	) {
			this.earlyCross = 1;
			this.COMPlayingStyles += "*Early Cross" + "\n";
		} else {
			this.earlyCross = 0;
		}
		  
		if (this.registeredPosition === "RWF" || this.registeredPosition === "LWF") {
			this.incisiveRun = 1;
			this.COMPlayingStyles += "*Incisive Run" + "\n";
		} else {
			this.incisiveRun = 0;
		}
		
		if (this.loftedPass >= 88) {
			this.longBallExpert = 1;
			this.COMPlayingStyles += "*Long Ball Expert" + "\n";
		} else {
			this.longBallExpert = 0;
		}
		
		if (fmPlayer.stats["Long Shots"] >= 13) {
			this.longRanger = 1;
			this.COMPlayingStyles += "*Long Ranger" + "\n";
		} else {
			this.longRanger = 0;
		}
		
		if (this.dribbling >= 85) {
			this.mazingRun = 1;
			this.COMPlayingStyles += "*Mazing Run" + "\n";
		} else {
			this.mazingRun = 0;
		}
		
		if (fmPlayer.stats["Pace"] >= 14 && fmPlayer.stats["Acceleration"] >= 14) {
			this.speedingBullet = 1;
			this.COMPlayingStyles += "*Speeding Bullet" + "\n";
		} else {
			this.speedingBullet = 0;
		}
		
		if (this.dribbling >= 84 && this.speed >= 84) {
			this.trickster = 1;
			this.COMPlayingStyles += "*Trickster" + "\n";
		} else {
			this.trickster = 0;
		}

		// PLAYING STYLES

		this.playingStyle = PES21GetPlayingStyle(fmPlayer.roles, this.registeredPosition);

		//return this.PSDString();
	}

	FromPESMasterPlayer(pesMasterPlayer){
		return "";
	}
}
