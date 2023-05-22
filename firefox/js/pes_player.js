class PESPlayer{

	constructor(){
		this.EXP_Value = 1.179;
		this.EXP_ID_Value = 1.405;
		this.specialAbilitiesString = "";
	}

	ConvertPosition(position){
		switch (position) {
			case 'GK':
				return 'GK';
			case 'CB':
				return 'CBT';
			case 'LB':
			case 'RB':
				return 'SB';
			case 'CDM':
				return 'DMF';
			case 'LWB':
			case 'RWB':
				return 'WB';
			case 'CM':
				return 'CMF';
			case 'LM':
			case 'RM':
				return 'SMF';
			case 'CAM':
				return 'AMF';
			case 'LW':
			case 'RW':
				return 'WF';
			case 'LF':
			case 'RF':
			case 'CF':
				return 'SS';
			case 'ST':
				return 'CF';
			default:
				return position;
		}
	}

	NameToShirtName(name) {
		const nameParts = name.split(' ');
		const lastName = nameParts[nameParts.length - 1].toUpperCase();
	
		// Replace characters that the PES editor doesn't recognize
		const translationMap = {
			'Á': 'A', 'À': 'A', 'É': 'E', 'È': 'E', 'Í': 'I', 'Ì': 'I',
			'Ó': 'O', 'Ò': 'O', 'Ú': 'U', 'Ù': 'U', 'Ü': 'U', 'Ñ': 'N', 'Ć': 'C',
			'Â': 'A', 'Ä': 'A', 'Ê': 'E', 'Ë': 'E', 'Î': 'I', 'Ï': 'I',
			'Ô': 'O', 'Ö': 'O', 'Û': 'U', 'Ü': 'U', 'Ç': 'C', 'Å': 'A'
		};
	
		const translatedLastName = Array.from(lastName, char => translationMap[char] || char).join('');
	
		let formattedLastName = translatedLastName;
		if (formattedLastName.length > 16) {
			formattedLastName = formattedLastName.slice(0, 15);
		} else if (formattedLastName.length < 5) {
			formattedLastName = formattedLastName.split('').join('  ');
		} else if (formattedLastName.length < 9) {
			formattedLastName = formattedLastName.split('').join(' ');
		}
	
		return formattedLastName;
	}

	CalculateConsistency(average) {

		if (average > 93) return 8;
		else if (average > 86) return 7;
		else if (average > 80) return 6;
		else if (average > 69) return 5;
		else if (average > 60) return 4;
		else return 3;

	}

	CalculateCondition(average){
		if (average > 93) return 8;
		else if (average > 86) return 7;
		else if (average > 80) return 6;
		else if (average > 69) return 5;
		else if (average > 60) return 4;
		else return 3;
	}
	  
	GetWeekFoot(weakFoot, average){
		if (weakFoot == 5) return 8;
		else if (weakFoot == 4 && average >= 85) return 7;
		else if (weakFoot == 4) return 6;
		else if (weakFoot == 3) return 5;
		else if (weakFoot == 2 && average >= 65) return 4;
		else if (weakFoot == 2) return 3;
		else if (weakFoot ==1) return 2;
	}

	PSDString(){
		return `Name: ${this.name}
Shirt Name: ${this.shirtName}
Nationality: ${this.nationality}
Age: ${this.age}
Foot: ${this.foot}
Side: ${this.favouredSide}
Positions: ${this.registeredPosition}*${this.positions.length>0 ? "," : "" }${this.positions}
Injury Tolerance: ${this.injuryTolerance}

APPEARANCE:
Height: ${this.height} cm
Weight: ${this.weight} kg


STATS:
Attack: ${this.attack}
Defence: ${this.defence}
Balance: ${this.balance}
Stamina: ${this.stamina}
Top Speed: ${this.topSpeed}
Acceleration: ${this.acceleration}
Response: ${this.response}
Agility: ${this.agility}
Dribble Accuracy: ${this.dribbleAccuracy}
Dribble Speed: ${this.dribbleSpeed}
Short Pass Accuracy: ${this.shortPassAccuracy}
Short Pass Speed: ${this.shortPassSpeed}
Long Pass Accuracy: ${this.longPassAccuracy}
Long Pass Speed: ${this.longPassSpeed}
Shot Accuracy: ${this.shotAccuracy}
Shot Power: ${this.shotPower}
Shot Technique: ${this.shotTechnique}
Free Kick Accuracy: ${this.freeKickAccuracy}
Curling: ${this.curling}
Header: ${this.header}
Jump: ${this.jump}
Technique: ${this.technique}
Aggression: ${this.aggression}
Mentality: ${this.mentality}
Keeper Skills: ${this.goalkeeping}
Teamwork: ${this.teamwork}
Consistency: ${this.consistency}
Condition/Fitness: ${this.condition}
Weak Foot Accuracy: ${this.weakFootAccuracy}
Weak Foot Frequency: ${this.weakFootFrequency}

SPECIAL ABILITIES:
${this.specialAbilitiesString}
`;
	}

	FromFIFA20_23Player(fifaPlayer){
		this.registeredPosition = this.ConvertPosition(fifaPlayer.posicionReg);
		this.positions = [];
		let sidePositions = ["RW", "LW", "RM", "LM", "RWB", "LWB", "RB", "LB"];
		let sideCounter = 0;
		for (let index = 0; index < fifaPlayer.posiciones.length; index++) {
			if (sidePositions.includes(fifaPlayer.posiciones[index]))
				sideCounter++;
			if (fifaPlayer.posiciones[index] != fifaPlayer.posicionReg)
				this.positions.push(this.ConvertPosition(fifaPlayer.posiciones[index]));
		}
		this.name = fifaPlayer.name;
		this.shirtName = this.NameToShirtName(this.name);
		this.age = fifaPlayer.age;
		this.nationality = fifaPlayer.nationality;
		this.foot = fifaPlayer.preferedFoot == "Right" ? "R" : "L" ;
		this.favouredSide = GetFavSide(fifaPlayer.posiciones, false);

		this.height = parseInt(fifaPlayer.height);
		this.weight = parseInt(fifaPlayer.weight);

		this.injuryTolerance = "B";
		if (fifaPlayer.traits.includes("Solid Player")) {
			this.injuryTolerance = "A";
		}
		else if (fifaPlayer.traits.includes("Injury Prone")) {
			this.injuryTolerance = "C";
		}
	
		this.consistency = this.CalculateConsistency(Math.floor((fifaPlayer.power["Stamina"] + fifaPlayer.overall)/2));
		this.condition = this.CalculateCondition(Math.floor((fifaPlayer.power["Stamina"] + fifaPlayer.mentality["Composture"])/2));

		this.weakFootFrequency = this.GetWeekFoot(fifaPlayer.weakFoot, Math.floor((fifaPlayer.movement["Balance"] + fifaPlayer.mentality["Composture"])/2));
		this.weakFootAccuracy =  this.GetWeekFoot(fifaPlayer.weakFoot, Math.floor((fifaPlayer.skill["Dribbling"], fifaPlayer.skill["Ball Control"], fifaPlayer.mentality["Vision"])/3));

		if (this.registeredPosition == "GK"){
			//convertion formula for GK
			let positioning = MinorThan(fifaPlayer.mentality["Positioning"], 30);
			let attackEXP = positioning;
			this.attack = 10 + DivideIntegers(attackEXP, this.EXP_ID_Value);
			
			let gkPositioning = MinorThan(fifaPlayer.goalkeeping["GK Positioning"], 60);
			let gkDiving = MinorThan(fifaPlayer.goalkeeping["GK Diving"], 60);
			let defenceEXP = Average([gkPositioning, gkDiving]) + fifaPlayer.internationalReputation;
			this.defence = 25 + DivideIntegers(defenceEXP, this.EXP_ID_Value);
			
			let strenght = MinorThan(fifaPlayer.power["Strength"], 60);
			let weightEXP = this.weight - 100;
			let balanceEXP = strenght * 0.1 + gkPositioning * 0.3 + weightEXP * 0.6;
			this.balance = 15 + DivideIntegers(balanceEXP, this.EXP_Value);
			if (fifaPlayer.traits.includes("Comes for crosses")){
				let balance = Math.round(this.balance + this.balance * 0.3);
				this.balance = balance > 99 ? 99 : balance;
			}
				
			
			let staminaEXP = MinorThan(fifaPlayer.power["Stamina"], 60);
			this.stamina = 15 + DivideIntegers(staminaEXP, this.EXP_Value);
			
			let topSpeedEXP = MinorThan(fifaPlayer.movement["Sprint speed"], 55);
			this.topSpeed = 15 + DivideIntegers(topSpeedEXP, this.EXP_Value);
			
			let accelerationEXP = MinorThan(fifaPlayer.movement["Acceleration"], 55);
			this.acceleration = 15 + DivideIntegers(accelerationEXP, this.EXP_Value);
			
			let responseEXP= fifaPlayer.goalkeeping["GK Reflexes"] + fifaPlayer.internationalReputation;
			this.response = 25 + DivideIntegers(responseEXP, this.EXP_ID_Value);

			let agility = MinorThan(fifaPlayer.movement["Agility"], 45);
			let agilityEXP = Average([agility, fifaPlayer.goalkeeping["GK Diving"]]);
			this.agility = 15 + DivideIntegers(agilityEXP, this.EXP_Value);
			
			let dribbling = MinorThan(fifaPlayer.skill["Dribbling"], 45);
			let ballControl = MinorThan(fifaPlayer.skill["Ball control"], 45);
			let dribbleAccuracyEXP = Average([dribbling, ballControl]) + fifaPlayer.internationalReputation;
			this.dribbleAccuracy = 25 + DivideIntegers(dribbleAccuracyEXP, this.EXP_ID_Value);

			let sprintSpeed = MinorThan(fifaPlayer.movement["Sprint speed"], 50);
			let dribbleSpeedEXP = Average([dribbling, sprintSpeed]);
			this.dribbleSpeed = 15 + DivideIntegers(dribbleSpeedEXP, this.EXP_Value);
			
			let shortPassing = MinorThan(fifaPlayer.attacking["Short passing"], 50);
			let shortPassAccuracyEXP = shortPassing + fifaPlayer.internationalReputation;
			this.shortPassAccuracy = 25 + DivideIntegers(shortPassAccuracyEXP, this.EXP_ID_Value);

			let shotPower = MinorThan(fifaPlayer.power["Shot power"], 60);
			let shortPassSpeedEXP = Average([shortPassing, shotPower]);
			this.shortPassSpeed = 15 + DivideIntegers(shortPassSpeedEXP, this.EXP_Value);
			
			let longPassing = MinorThan(fifaPlayer.skill["Long passing"], 45);
			let crossing = MinorThan(fifaPlayer.attacking["Crossing"], 45);
			let longPassAccuracyEXP = Average([longPassing, crossing, fifaPlayer.goalkeeping["GK Kicking"]]) + fifaPlayer.internationalReputation;
			this.longPassAccuracy = 25 + DivideIntegers(longPassAccuracyEXP, this.EXP_ID_Value);

			let longPassSpeedEXP = Average([crossing, shotPower, fifaPlayer.goalkeeping["GK Kicking"]]);
			this.longPassSpeed = 15 + DivideIntegers(longPassSpeedEXP, this.EXP_Value);

			let finishing = MinorThan(fifaPlayer.attacking["Finishing"], 50);
			let shotAccuracyEXP = finishing + fifaPlayer.internationalReputation;
			this.shotAccuracy = 25 + DivideIntegers(shotAccuracyEXP, this.EXP_ID_Value);

			let shotPowerEXP = MinorThan(fifaPlayer.goalkeeping["GK Kicking"], 60);
			this.shotPower = 15 + DivideIntegers(shotPowerEXP, this.EXP_Value);

			let volleys = MinorThan(fifaPlayer.attacking["Volleys"], 30);
			let longShots = MinorThan(fifaPlayer.power["Long shots"], 35);
			let shotTechniqueEXP = Average([volleys, longShots, ballControl]);
			this.shotTechnique = 15 + DivideIntegers(shotTechniqueEXP, this.EXP_Value);

			let fkAccuracy = MinorThan(fifaPlayer.skill["FK Accuracy"], 40);
			let freeKickAccuracyEXP = fkAccuracy + fifaPlayer.internationalReputation;
			this.freeKickAccuracy = 25 + DivideIntegers(freeKickAccuracyEXP, this.EXP_ID_Value);

			let curve = MinorThan(fifaPlayer.skill["Curve"], 40);
			let curlingEXP = curve;
			this.curling = 15 + DivideIntegers(curlingEXP, this.EXP_Value);

			let headingAccuracy = MinorThan(fifaPlayer.attacking["Heading accuracy"], 41);
			let headerEXP = headingAccuracy + fifaPlayer.internationalReputation;
			this.header = 25 + DivideIntegers(headerEXP, this.EXP_ID_Value);

			let jumping = MinorThan(fifaPlayer.power["Jumping"], 60);
			let jumpEXP = Average([jumping, fifaPlayer.goalkeeping["GK Diving"], fifaPlayer.goalkeeping["GK Diving"]]);
			this.jump = 15 + DivideIntegers(jumpEXP, this.EXP_Value);

			let techniqueEXP = ballControl + fifaPlayer.internationalReputation;
			this.technique = 25 + DivideIntegers(techniqueEXP, this.EXP_ID_Value);

			let reactions = MinorThan(fifaPlayer.movement["Reactions"], 53);
			let aggressionEXP = Average([reactions, positioning]);
			this.aggression = 15 + DivideIntegers(aggressionEXP, this.EXP_ID_Value);
			
			let composure = MinorThan(fifaPlayer.mentality["Composure"], 50);
			let mentalityEXP = Average([reactions, composure]) + fifaPlayer.internationalReputation;
			this.mentality = 25 + DivideIntegers(mentalityEXP, this.EXP_ID_Value);

			let gkHandling = MinorThan(fifaPlayer.goalkeeping["GK Handling"], 60);
			let goalkeepingEXP = Average([gkHandling, gkDiving]) + fifaPlayer.internationalReputation
			this.goalkeeping = 25 + DivideIntegers(goalkeepingEXP, this.EXP_ID_Value);
			
			let teamworkEXP = Average([fifaPlayer.mentality["Vision"], composure, reactions]) + fifaPlayer.internationalReputation;
			this.teamwork = 25 + DivideIntegers(teamworkEXP, this.EXP_ID_Value);

		}
		else{
			// rest of players
			
			let positioning = fifaPlayer.mentality["Positioning"];
			let attackExtraPoints = 25;
			if (this.registeredPosition =="CBT"){
				attackExtraPoints = 20;
				if (positioning < 30){
					positioning = 30;
				}
				else if (positioning < 50) {
					positioning = 50;
				}
			}

			let attackEXP = DivideIntegers(positioning + positioning + fifaPlayer.movement["Reactions"], 3) + fifaPlayer.internationalReputation;
			this.attack = attackExtraPoints + DivideIntegers(attackEXP, this.EXP_ID_Value); 

			let defensiveAwareness = MinorThan(fifaPlayer.defending["Defensive awareness"], 20);
			let standingTackle = MinorThan(fifaPlayer.defending["Standing tackle"], 20);
			let defenceEXP = DivideIntegers(defensiveAwareness * 2 + standingTackle, 3);
			let tempDefence = 25 + DivideIntegers(defenceEXP, this.EXP_ID_Value) + fifaPlayer.internationalReputation;
			this.defence = this.registeredPosition =="CBT" ? tempDefence : 15 + DivideIntegers(tempDefence, 1.238);

			let strenght = MinorThan(fifaPlayer.power["Strength"], 60);
			let balance = MinorThan(fifaPlayer.movement["Balance"], 60);
			let balanceEXP = strenght > balance ? strenght : DivideIntegers(strenght + balance, 2);
			this.balance = 15 + DivideIntegers(balanceEXP, this.EXP_Value);

			let stamina = MinorThan(fifaPlayer.power["Stamina"], 63);
			let staminaEXP = stamina + fifaPlayer.internationalReputation;
			this.stamina = 25 + DivideIntegers(staminaEXP, this.EXP_ID_Value);

			let topSpeedEXP = fifaPlayer.movement["Sprint speed"];
			this.topSpeed = MinorThan(15 + DivideIntegers(topSpeedEXP, this.EXP_Value), 60);

			let accelerationEXP = fifaPlayer.movement["Acceleration"];
			this.acceleration = MinorThan(15 + DivideIntegers(accelerationEXP, this.EXP_Value), 60); 

			let interceptions = MinorThan(fifaPlayer.mentality["Interceptions"], 53);
			let reactions = MinorThan(fifaPlayer.movement["Reactions"], 53);
			let responseEXP = reactions > interceptions ? reactions : interceptions
			this.response = 25 + DivideIntegers(responseEXP + fifaPlayer.internationalReputation, this.EXP_ID_Value);

			let agility = MinorThan(fifaPlayer.movement["Agility"], 50);
			let acceleration = MinorThan(fifaPlayer.movement["Acceleration"], 60);
			let agilityEXP = (agility + acceleration)/2;
			this.agility = 15 + DivideIntegers(agilityEXP, this.EXP_Value);
			
			let dribbling = MinorThan(fifaPlayer.skill["Dribbling"], 55);
			let ballControl = MinorThan(fifaPlayer.skill["Ball control"], 55);
			let dribbleAccuracyEXP = (dribbling + ballControl)/2 + fifaPlayer.internationalReputation;
			this.dribbleAccuracy = 25 + DivideIntegers(dribbleAccuracyEXP, this.EXP_ID_Value);

			let sprintSpeed = MinorThan(fifaPlayer.movement["Sprint speed"], 50);
			let dribbleSpeedEXP = (dribbling + sprintSpeed)/2;
			this.dribbleSpeed = 15 + DivideIntegers(dribbleSpeedEXP, this.EXP_Value);

			let shortPassing = MinorThan(fifaPlayer.attacking["Short passing"], 50);
			let shortPassAccuracyEXP = shortPassing + fifaPlayer.internationalReputation;
			this.shortPassAccuracy = 25 + DivideIntegers(shortPassAccuracyEXP, this.EXP_ID_Value);

			let shotPower = MinorThan(fifaPlayer.power["Shot power"], 60);
			let shortPassSpeedEXP = (shortPassing + shotPower)/2;
			this.shortPassSpeed = 15 + DivideIntegers(shortPassSpeedEXP, this.EXP_Value);

			let longPassing = MinorThan(fifaPlayer.skill["Long passing"], 45);
			let crossing = MinorThan(fifaPlayer.attacking["Crossing"], 45);
			let longPassAccuracyEXP = (longPassing + crossing)/2 + fifaPlayer.internationalReputation;
			this.longPassAccuracy = 25 + DivideIntegers(longPassAccuracyEXP, this.EXP_ID_Value);

			let longPassSpeedEXP = (crossing + shotPower)/2;
			this.longPassSpeed = 15 + DivideIntegers(longPassSpeedEXP, this.EXP_Value);

			let finishing = MinorThan(fifaPlayer.attacking["Finishing"], 50);
			let shotAccuracyEXP = finishing + fifaPlayer.internationalReputation;
			this.shotAccuracy = 25 + DivideIntegers(shotAccuracyEXP, this.EXP_ID_Value);

			let shotPowerEXP = shotPower;
			this.shotPower = 15 + DivideIntegers(shotPowerEXP, this.EXP_Value);

			let volleys = MinorThan(fifaPlayer.attacking["Volleys"], 50);
			let longShots = MinorThan(fifaPlayer.power["Long shots"], 50);
			let shotTechniqueEXP = (volleys + longShots + ballControl)/3;
			this.shotTechnique = 15 + DivideIntegers(shotTechniqueEXP, this.EXP_Value);

			let fkAccuracy = MinorThan(fifaPlayer.skill["FK Accuracy"], 50);
			let freeKickAccuracyEXP = fkAccuracy + fifaPlayer.internationalReputation;
			this.freeKickAccuracy = 25 + DivideIntegers(freeKickAccuracyEXP, this.EXP_ID_Value);

			let curve = MinorThan(fifaPlayer.skill["Curve"], 55);
			let curlingEXP = curve;
			this.curling = 15 + DivideIntegers(curlingEXP, this.EXP_Value);

			let headingAccuracy = MinorThan(fifaPlayer.attacking["Heading accuracy"], 50);
			let headerEXP = headingAccuracy + fifaPlayer.internationalReputation;
			this.header = 25 + DivideIntegers(headerEXP, this.EXP_ID_Value);

			let jumping = MinorThan(fifaPlayer.power["Jumping"], 60);
			let jumpEXP = jumping;
			this.jump = 15 + DivideIntegers(jumpEXP, this.EXP_Value);

			let techniqueEXP = ballControl + fifaPlayer.internationalReputation;
			this.technique = 25 + DivideIntegers(techniqueEXP, this.EXP_ID_Value);

			let aggressionEXP = reactions + fifaPlayer.internationalReputation;
			this.aggression = 25 + DivideIntegers(aggressionEXP, this.EXP_ID_Value);

			if (this.registeredPosition == "CBT"){
				aggressionEXP = (reactions + positioning)/2;
				this.aggression = 15 + DivideIntegers(aggressionEXP, this.EXP_Value); 	
			}

			let aggression = MinorThan(fifaPlayer.mentality["Aggression"], 45);

			let mentalityEXP = (aggression + stamina)/2 + fifaPlayer.internationalReputation;
			this.mentality = 25 + DivideIntegers(mentalityEXP, this.EXP_ID_Value);

			this.goalkeeping = 50;

			let teamworkEXP = DivideIntegers(fifaPlayer.mentality["Vision"] + positioning + aggression, 3);
			this.teamwork = 25 + DivideIntegers(teamworkEXP + fifaPlayer.internationalReputation, this.EXP_ID_Value);

			if (this.registeredPosition == "CBT" || this.registeredPosition == "DMF"){
				teamworkEXP = DivideIntegers(fifaPlayer.mentality["Composure"] + aggression, 2);
				this.teamwork = 25 + DivideIntegers(teamworkEXP + fifaPlayer.internationalReputation, this.EXP_ID_Value);
			}
		}
		// Special abilities
		if (fifaPlayer.skillMoves > 3 ||
			fifaPlayer.traits.includes("Technical dribbler (AI)") ||
			fifaPlayer.traits.includes("Speed dribbler (AI)")) {
			this.dribbling = 1;
			this.specialAbilitiesString += "* Dribbling" + "\n";
		} else {
			this.dribbling = 0;
		}
		
		if (fifaPlayer.traits.includes("Flair")) {
			this.tacticalDribble = 1;
			this.specialAbilitiesString += "* Tactical dribble" + "\n";
		} else {
			this.tacticalDribble = 0;
		}
		
		if (fifaPlayer.mentality["Positioning"] > 85) {
			this.positioning = 1;
			this.specialAbilitiesString += "* Positioning" + "\n";
		} else {
			this.positioning = 0;
		}
		
		if (Average([fifaPlayer.movement["Acceleration"], fifaPlayer.movement["Reactions"]]) > 85) {
			this.reaction = 1;
			this.specialAbilitiesString += "* Reaction" + "\n";
		} else {
			this.reaction = 0;
		}
		
		if (fifaPlayer.traits.includes("Playmaker (AI)")) {
			this.playmaking = 1;
			this.specialAbilitiesString += "* Playmaking" + "\n";
		} else {
			this.playmaking = 0;
		}

		if (Average([fifaPlayer.attacking["Short passing"], fifaPlayer.mentality["Vision"]]) > 85) {
			this.passing = 1;
			this.specialAbilitiesString += "* Passing" + "\n";
		} else {
			this.passing = 0;
		}
		
		if (Average([fifaPlayer.movement["Reactions"], fifaPlayer.attacking["Finishing"]]) > 85) {
			this.scoring = 1;
			this.specialAbilitiesString += "* Scoring" + "\n";
		} else {
			this.scoring = 0;
		}
		
		if (Average([fifaPlayer.mentality["Composure"], fifaPlayer.attacking["Finishing"]]) > 85) {
			this.oneOnOneScoring = 1;
			this.specialAbilitiesString += "* 1-1 Scoring" + "\n";
		} else {
			this.oneOnOneScoring = 0;
		}
		
		if (fifaPlayer.posicionReg == "ST" && fifaPlayer.traits.includes("Power header") && fifaPlayer.power["Strength"]>85 ) {
			this.postPlayer = 1;
			this.specialAbilitiesString += "* Post player" + "\n";
		} else {
			this.postPlayer = 0;
		}
		
		if (fifaPlayer.traits.includes("Beat offside trap") ||
			fifaPlayer.playerSpecialties.includes("Complete Forward") || 
			fifaPlayer.playerSpecialties.includes("Complete Defender")
		) {
			this.lines = 1;
			this.specialAbilitiesString += "* Lines" + "\n";
		} else {
			this.lines = 0;
		}
		
		if (fifaPlayer.traits.includes("Long shot taker (AI)") || fifaPlayer.playerSpecialties.includes("Distance Shooter")) {
			this.middleShooting = 1;
			this.specialAbilitiesString += "* Middle shooting" + "\n";
		} else {
			this.middleShooting = 0;
		}

		if ((fifaPlayer.traits.includes("Technical dribbler (AI)") && sideCounter > 2) || fifaPlayer.traits.includes("Early crosser")) {
			this.side = 1;
			this.specialAbilitiesString += "* Side" + "\n";
		} else {
			this.side = 0;
		}

		if (fifaPlayer.traits.includes("Playmaker (AI)") && fifaPlayer.mentality["Vision"] > 80 && fifaPlayer.mentality["Positioning"] > 80) {
			this.centre = 1;
			this.specialAbilitiesString += "* Centre" + "\n";
		} else {
			this.centre = 0;
		}

		if (Average([fifaPlayer.mentality["Composure"], fifaPlayer.mentality["Penalties"]]) > 80) {
			this.penalties = 1;
			this.specialAbilitiesString += "* Penalties" + "\n";
		} else {
			this.penalties = 0;
		}

		if (fifaPlayer.skillMoves>3 && fifaPlayer.attacking["Short passing"]>83) {
			this.oneTouchPass = 1;
			this.specialAbilitiesString += "* 1-Touch pass" + "\n";
		} else {
			this.oneTouchPass = 0;
		}

		if (fifaPlayer.traits.includes("Outside foot shot") && fifaPlayer.skill["Ball control"] * 0.3 + fifaPlayer.skill["Curve"] * 0.7 >= 85) {
			this.outside = 1;
			this.specialAbilitiesString += "* Outside" + "\n";
		} else {
			this.outside = 0;
		}

		if (Average([fifaPlayer.defending["Defensive awareness"], fifaPlayer.mentality["Aggression"]]) > 85) {
			this.marking = 1;
			this.specialAbilitiesString += "* Marking" + "\n";
		} else {
			this.marking = 0;
		}

		if (Average([fifaPlayer.mentality["Composure"], fifaPlayer.defending["Standing tackle"]]) > 85) {
			this.sliding = 1;
			this.specialAbilitiesString += "* Sliding" + "\n";
		} else {
			this.sliding = 0;
		}

		if (Average([fifaPlayer.mentality["Interceptions"], fifaPlayer.defending["Standing tackle"]]) > 85) {
			this.covering = 1;
			this.specialAbilitiesString += "* Covering" + "\n";
		} else {
			this.covering = 0;
		}

		if (fifaPlayer.traits.includes("Leadership" && fifaPlayer.posicionReg =="CB")) {
			this.dLineControl = 1;
			this.specialAbilitiesString += "* D-Line control" + "\n";
		} else {
			this.dLineControl = 0;
		}

		if (Average([fifaPlayer.goalkeeping["GK Handling"], fifaPlayer.goalkeeping["GK Reflexes"]])>80) {
			this.penaltyStopper = 1;
			this.specialAbilitiesString += "* Penalty stopper" + "\n";
		} else {
			this.penaltyStopper = 0;
		}

		if (fifaPlayer.traits.includes("Saves with feet")) {
			this.oneOnOneStopper = 1;
			this.specialAbilitiesString += "* 1-On-1 stopper" + "\n";
		} else {
			this.oneOnOneStopper = 0;
		}

		if (fifaPlayer.traits.includes("Long throw-in") || fifaPlayer.traits.includes("Giant throw-in")) {
			this.longThrow = 1;
			this.specialAbilitiesString += "* Long throw" + "\n";
		} else {
			this.longThrow = 0;
		}
		
		return this.PSDString();
	}

	FromFMPlayer(fmPlayer){
		let FMPositions = FMPositionStringToArray(fmPlayer.info["Position"]);
		this.registeredPosition = FMPositions.includes("AMC") &&FMPositions.includes("ST") ? "SS" : FMToPESPositions(FMPositions[0]);
		this.positions = [];
		let sidePositions = [
			"DL",
			"DR",
			"WBL",
			"WBR",
			"ML",
			"MR",
			"AML",
			"AMR",
		];
		let centerPositions = [
			"DC",
			"MC",
			"DM",
			"AMC",
			"ST",
		];

		let sideCounter = 0;
		let centerCounter = 0;

		for (let index = 0; index < FMPositions.length; index++) {
			if (this.registeredPosition != FMToPESPositions(FMPositions[index])){
				this.positions.push(FMToPESPositions(FMPositions[index]));
				if (sidePositions.includes(FMPositions[index]))
					sideCounter++;
				if (centerPositions.includes(FMPositions[index]))
					centerCounter++;
			}
		}
		this.name = fmPlayer.info["Name"];
		this.shirtName = this.NameToShirtName(this.name);
		this.age = parseInt(fmPlayer.info["Age"]);
		this.nationality = fmPlayer.nationality;
		this.foot = fmPlayer.info["Foot"] == "Left" ? "L" : "R" ;
		this.favouredSide = GetFavSide(FMPositions, true);

		this.height = parseInt(fmPlayer.info["Length"]);
		this.weight = parseInt(fmPlayer.info["Weight"]);

		this.injuryTolerance = FMToPESStatAToC((fmPlayer.stats["Stamina"] + fmPlayer.stats["Natural Fitness"]) / 2);

		if (this.registeredPosition == "GK"){
			this.attack = 30;
			this.defence = FMToPESStat99((fmPlayer.stats["Positioning"] + fmPlayer.stats["Command of Area"])/2);
			this.balance = FMToPESStat99((fmPlayer.stats["Balance"] + fmPlayer.stats["Command of Area"])/2);
			this.stamina = Math.round((FMToPESStat99(15) + FMToPESStat99(fmPlayer.stats["Stamina"])) / 2);
			this.topSpeed = FMToPESStat99(fmPlayer.stats["Pace"]);
			this.acceleration = FMToPESStat99(fmPlayer.stats["Acceleration"]);
			this.response = FMToPESStat99(fmPlayer.stats["Reflexes"] * 0.8 + fmPlayer.stats["Anticipation"] * 0.2);
			this.agility = FMToPESStat99((fmPlayer.stats["Agility"] + fmPlayer.stats["Aerial Reach"]) / 2);
			this.dribbleAccuracy = FMToPESStat99((fmPlayer.stats["Flair"] + fmPlayer.stats["First Touch"]) / 2);
			this.dribbleSpeed = FMToPESStat99((fmPlayer.stats["Flair"] + fmPlayer.stats["First Touch"] + fmPlayer.stats["Pace"]) / 3);
			this.shortPassAccuracy = FMToPESStat99(fmPlayer.stats["Passing"]);
			this.shortPassSpeed = FMToPESStat99(fmPlayer.stats["Passing"] * 0.8 + fmPlayer.stats["First Touch"] * 0.2);
			this.longPassAccuracy = FMToPESStat99(fmPlayer.stats["Kicking"]);
			this.longPassSpeed = FMToPESStat99(fmPlayer.stats["Kicking"] * 0.8 + fmPlayer.stats["First Touch"] * 0.2);
			this.shotAccuracy = 45;
			this.shotPower = FMToPESStat99(fmPlayer.stats["Kicking"]);
			this.shotTechnique = 45;
			this.freeKickAccuracy = FMToPESStat99(fmPlayer.stats["Kicking"] * 0.4 + fmPlayer.stats["Flair"] * 0.6);
			this.curling = 45;
			this.header = 55;
			this.jump = FMToPESStat99((fmPlayer.stats["Jumping Reach"] + fmPlayer.stats["Aerial Reach"]) / 2);
			this.technique = FMToPESStat99(fmPlayer.stats["Flair"]);
			this.aggression = FMToPESStat99((fmPlayer.stats["Positioning"] * 0.7 + fmPlayer.stats["Anticipation"] * 0.3));
			this.mentality = FMToPESStat99((fmPlayer.stats["Rushing Out (Tendency)"] * 0.25 + fmPlayer.stats["One on Ones"] * 0.5 + fmPlayer.stats["Composure"] * 0.25));
			this.goalkeeping = FMToPESStat99(fmPlayer.stats["Handling"] * 0.4 + fmPlayer.stats["Aerial Reach"] * 0.4 + fmPlayer.stats["Command of Area"] * 0.2);
			this.teamwork = FMToPESStat99(fmPlayer.stats["Communication"]);
			this.consistency = FMToPESStat1To8(fmPlayer.stats["Determination"]);
			this.condition = FMToPESStat1To8(fmPlayer.stats["Natural Fitness"]);
			this.weakFootAccuracy = FMToPESStat1To8((2 + fmPlayer.stats["Kicking"]) / 2);
			this.weakFootFrequency = FMToPESStat1To8(fmPlayer.stats["Decisions"]);						
		}
		else{
			//field players
			this.attack = FMToPESStat99((fmPlayer.stats["Off the Ball"] * 0.7) + (fmPlayer.stats["Anticipation"] * 0.3));
			if (this.registeredPosition == "CBT" || this.registeredPosition == "CWP" || this.registeredPosition == "DMF") {
				if (this.attack < 70 && this.attack > 0) {
					this.attack = this.attack - 10;
				} else if (this.attack < 86 && this.attack >= 70) {
					this.attack = this.attack - 15;
				} else if (this.attack < 100 && this.attack >= 86) {
					this.attack = this.attack - 20;
				}
			}
			this.defence = FMToPESStat99((fmPlayer.stats["Anticipation"] * 0.1) + (fmPlayer.stats["Marking"] * 0.3) + (fmPlayer.stats["Positioning"] * 0.5) + (fmPlayer.stats["Tackling"] * 0.1));
			if (
				this.registeredPosition == "SMF" || 
				this.registeredPosition == "AMF" || 
				this.registeredPosition == "WF" || 
				this.registeredPosition == "SS" || 
				this.registeredPosition == "CF"
			) {
				if (this.defense < 70 && this.defense > 0) {
						this.defense = this.defense - 10;
					} else if (this.defense < 86 && this.defense >= 70) {
						this.defense = this.defense - 15;
					} else if (this.defense < 100 && this.defense >= 86) {
						this.defense = this.defense - 20;
					}
			}
			this.balance = FMToPESStat99((fmPlayer.stats["Balance"] + fmPlayer.stats["Strength"]) / 2);
			this.stamina = Math.round((FMToPESStat99(15) + FMToPESStat99(fmPlayer.stats["Stamina"])) / 2);
			this.topSpeed = FMToPESStat99(fmPlayer.stats["Pace"]);
			this.acceleration = FMToPESStat99(fmPlayer.stats["Acceleration"]);
			this.response = FMToPESStat99(fmPlayer.stats["Anticipation"]);
			this.agility = FMToPESStat99(fmPlayer.stats["Agility"]);
			this.dribbleAccuracy = FMToPESStat99((fmPlayer.stats["Dribbling"] + fmPlayer.stats["First Touch"]) / 2);
			this.dribbleSpeed = FMToPESStat99((fmPlayer.stats["Dribbling"] * 0.5) + (fmPlayer.stats["Acceleration"] * 0.25) + (fmPlayer.stats["Pace"] * 0.25));
			this.shortPassAccuracy = FMToPESStat99(fmPlayer.stats["Passing"]);
			this.shortPassSpeed = FMToPESStat99((fmPlayer.stats["Passing"] + fmPlayer.stats["Technique"]) / 2);
			this.longPassAccuracy = FMToPESStat99((fmPlayer.stats["Crossing"] + fmPlayer.stats["Passing"]) / 2);
			this.longPassSpeed = FMToPESStat99((fmPlayer.stats["Crossing"] + fmPlayer.stats["Passing"] + fmPlayer.stats["Technique"]) / 3);
			this.shotAccuracy = FMToPESStat99((fmPlayer.stats["Finishing"] + fmPlayer.stats["Composure"]) / 2);
			this.shotPower = FMToPESStat99((fmPlayer.stats["Long Shots"] * 0.7) + (fmPlayer.stats["Finishing"] * 0.3));
			this.shotTechnique = FMToPESStat99((fmPlayer.stats["Finishing"] + fmPlayer.stats["First Touch"] + fmPlayer.stats["Technique"]) / 3)
			this.freeKickAccuracy = FMToPESStat99(fmPlayer.stats["Free Kick Taking"]);
			this.curling = FMToPESStat99((fmPlayer.stats["Free Kick Taking"] + fmPlayer.stats["Corners"]) / 2);
			this.header = FMToPESStat99(fmPlayer.stats["Heading"]);
			this.jump = FMToPESStat99(fmPlayer.stats["Jumping Reach"]);
			this.technique = FMToPESStat99((fmPlayer.stats["Flair"] + fmPlayer.stats["Technique"]) / 2);
			this.aggression = FMToPESStat99((fmPlayer.stats["Vision"] * 0.5) + (fmPlayer.stats["Off the Ball"] * 0.5));
			this.mentality = FMToPESStat99((fmPlayer.stats["Work Rate"] * 0.7) + (fmPlayer.stats["Bravery"] * 0.3));
			this.goalkeeping = 50;
			this.teamwork = FMToPESStat99(fmPlayer.stats["Teamwork"]);
			this.consistency = FMToPESStat1To8(fmPlayer.stats["Determination"]);
			this.condition = FMToPESStat1To8(fmPlayer.stats["Natural Fitness"]);
			this.weakFootAccuracy = FMToPESStat1To8((((fmPlayer.stats["Finishing"] + fmPlayer.stats["First Touch"] + fmPlayer.stats["Technique"]) / 3) + fmPlayer.stats["Finishing"]) / 2);
			this.weakFootFrequency = FMToPESStat1To8(fmPlayer.stats["Decisions"]);
		}
		// Special abilities
		if (fmPlayer.stats["Dribbling"] > 15) {
			this.dribbling = 1;
			this.specialAbilitiesString += "* Dribbling" + "\n";
		} else {
			this.dribbling = 0;
		}
		
		if (fmPlayer.stats["Balance"] > 15) {
			this.tacticalDribble = 1;
			this.specialAbilitiesString += "* Tactical dribble" + "\n";
		} else {
			this.tacticalDribble = 0;
		}
		
		if ((fmPlayer.stats["Vision"] + fmPlayer.stats["Off the Ball"]) / 2 > 15) {
			this.positioning = 1;
			this.specialAbilitiesString += "* Positioning" + "\n";
		} else {
			this.positioning = 0;
		}
		
		if (fmPlayer.stats["Off the Ball"] > 15) {
			this.reaction = 1;
			this.specialAbilitiesString += "* Reaction" + "\n";
		} else {
			this.reaction = 0;
		}
		
		if (fmPlayer.stats["Leadership"] > 15) {
			this.playmaking = 1;
			this.specialAbilitiesString += "* Playmaking" + "\n";
		} else {
			this.playmaking = 0;
		}
		
		if (fmPlayer.stats["Concentration"] > 15) {
			this.passing = 1;
			this.specialAbilitiesString += "* Passing" + "\n";
		} else {
			this.passing = 0;
		}
		
		if (fmPlayer.stats["Anticipation"] > 15) {
			this.scoring = 1;
			this.specialAbilitiesString += "* Scoring" + "\n";
		} else {
			this.scoring = 0;
		}
		
		if ((fmPlayer.stats["Composure"] + fmPlayer.stats["Finishing"]) / 2 > 15) {
			this.oneOnOneScoring = 1;
			this.specialAbilitiesString += "* 1-1 Scoring" + "\n";
		} else {
			this.oneOnOneScoring = 0;
		}
		
		if ((fmPlayer.stats["Strength"] + fmPlayer.stats["Teamwork"]) / 2 > 15) {
			this.postPlayer = 1;
			this.specialAbilitiesString += "* Post player" + "\n";
		} else {
			this.postPlayer = 0;
		}
		
		if (fmPlayer.stats["Decisions"] > 15) {
			this.lines = 1;
			this.specialAbilitiesString += "* Lines" + "\n";
		} else {
			this.lines = 0;
		}
		
		if (fmPlayer.stats["Long Shots"] > 15) {
			this.middleShooting = 1;
			this.specialAbilitiesString += "* Middle shooting" + "\n";
		} else {
			this.middleShooting = 0;
		}
		if (sideCounter > 2) {
			this.side = 1;
			this.specialAbilitiesString += "* Side" + "\n";
		} else {
			this.side = 0;
		}
		
		if (centerCounter > 2) {
			this.centre = 1;
			this.specialAbilitiesString += "* Centre" + "\n";
		} else {
			this.centre = 0;
		}
		if (fmPlayer.stats["Penalty Taking"] > 15) {
			this.penalties = 1;
			this.specialAbilitiesString += "* Penalties" + "\n";
		} else {
			this.penalties = 0;
		}
		
		if ((fmPlayer.stats["Technique"] + fmPlayer.stats["Passing"]) / 2 > 15) {
			this.oneTouchPass = 1;
			this.specialAbilitiesString += "* 1-Touch pass" + "\n";
		} else {
			this.oneTouchPass = 0;
		}

		if (fmPlayer.stats["Technique"] > 15) {
			this.outside = 1;
			this.specialAbilitiesString += "* Outside" + "\n";
		} else {
			this.outside = 0;
		}
		
		if (fmPlayer.stats["Marking"] > 15) {
			this.marking = 1;
			this.specialAbilitiesString += "* Marking" + "\n";
		} else {
			this.marking = 0;
		}
		
		if (fmPlayer.stats["Tackling"] > 15) {
			this.sliding = 1;
			this.specialAbilitiesString += "* Sliding" + "\n";
		} else {
			this.sliding = 0;
		}
		if (fmPlayer.stats["Positioning"] > 15) {
			this.covering = 1;
			this.specialAbilitiesString += "* Covering" + "\n";
		} else {
			this.covering = 0;
		}
		
		if ((fmPlayer.stats["Composure"] + fmPlayer.stats["Leadership"]) / 2 > 15) {
			this.dLineControl = 1;
			this.specialAbilitiesString += "* D-Line control" + "\n";
		} else {
			this.dLineControl = 0;
		}
		
		if ((fmPlayer.stats["Composure"] + fmPlayer.stats["One on Ones"]) / 2 > 15) {
			this.penaltyStopper = 1;
			this.specialAbilitiesString += "* Penalty stopper" + "\n";
		} else {
			this.penaltyStopper = 0;
		}
		
		if (fmPlayer.stats["One on Ones"] > 15) {
			this.oneOnOneStopper = 1;
			this.specialAbilitiesString += "* 1-On-1 stopper" + "\n";
		} else {
			this.oneOnOneStopper = 0;
		}
		
		if (fmPlayer.stats["Long Throws"] > 15) {
			this.longThrow = 1;
			this.specialAbilitiesString += "* Long throw" + "\n";
		} else {
			this.longThrow = 0;
		}
		return this.PSDString();
	}
}
