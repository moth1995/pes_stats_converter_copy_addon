export class PESPlayer{

	constructor(){
		this.EXP_Value = 1.179;
		this.EXP_ID_Value = 1.405;
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

	GetFavSide(positions) {
		let favSide = 'B';
		let bothSides = 0;
		let leftSide = 0;
		let rightSide = 0;
	  
		for (let index = 0; index < positions.length; index++) {
			if (positions[index][0] === 'L') {
				leftSide++;
			} else if (positions[index][0] === 'R') {
				rightSide++;
			} else {
				bothSides++;
			}
		}
	  
		if (bothSides > leftSide && bothSides > rightSide) {
			favSide = 'B';
		} else if (leftSide > bothSides && leftSide > rightSide) {
			favSide = 'L';
		} else if (rightSide > bothSides && rightSide > leftSide) {
			favSide = 'R';
		}
	  
		return favSide;
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

	MinorThan(value, compare){
		return value < compare ? compare : value;
	}

	DivideIntegers(int1, int2){
		return Math.floor(int1/int2);
	}

	PSDString(){
		return `Name: ${this.name}
Shirt Name: ${this.shirtName}
Nationality: ${this.nationality}
Age: ${this.age}
Foot: ${this.foot}
Side: ${this.favouredSide}
Positions: ${this.registeredPosition}${this.positions.length>0 ? "," : "" }${this.positions}
Injury Tolerance: ${this.injuryTolerance}

APPEARANCE:
Height: ${this.height} cm
Weight: ${this.weight} kg`;
	}

	FromFIFAPlayer(fifaPlayer){
		
		this.registeredPosition = this.ConvertPosition(fifaPlayer.posicionReg) + "*";
		this.positions = [];
		for (let index = 0; index < fifaPlayer.posiciones.length; index++) {
			if (fifaPlayer.posiciones[index] != fifaPlayer.posicionReg)
				this.positions.push(this.ConvertPosition(fifaPlayer.posiciones[index]));
		}
		this.name = fifaPlayer.name;
		this.shirtName = this.NameToShirtName(this.name);
		this.age = fifaPlayer.age;
		this.nationality = fifaPlayer.nationality;
		this.foot = fifaPlayer.preferedFoot == "Right" ? "R" : "L" ;
		this.favouredSide = this.GetFavSide(fifaPlayer.posiciones);

		this.height = fifaPlayer.height;
		this.weight = fifaPlayer.weight;

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
			let attackEXP = this.DivideIntegers(positioning * 2 + fifaPlayer.movement["Reactions"], 3) + fifaPlayer.internationalRepuration;
			this.attack = attackExtraPoints + this.DivideIntegers(attackEXP, this.EXP_ID_Value); 

			let defensiveAwareness = this.MinorThan(fifaPlayer.defending["Defensive awareness"], 20);
			let standingTackle = this.MinorThan(fifaPlayer.defending["Standing Tackle"], 20);
			let defenceEXP = this.DivideIntegers(defensiveAwareness * 2 + standingTackle, 3);
			let tempDefence = 25 + this.DivideIntegers(defenceEXP, this.EXP_ID_Value) + fifaPlayer.internationalRepuration;
			this.defence = this.registeredPosition =="CBT" ? tempDefence : 15 + this.DivideIntegers(tempDefence, 1.238);

			let strenght = this.MinorThan(fifaPlayer.power["Strenght"], 60);
			let balance = this.MinorThan(fifaPlayer.movement["Balance"], 60);
			let balanceEXP = strenght > balance ? strenght : this.DivideIntegers(strenght + balance, 2);
			this.balance = 15 + this.DivideIntegers(balanceEXP, this.EXP_Value);

			let stamina = this.MinorThan(fifaPlayer.power["Stamina"], 63);
			let staminaEXP = stamina + fifaPlayer.internationalRepuration;
			this.stamina = 25 + this.DivideIntegers(staminaEXP, this.EXP_ID_Value);

			let topSpeedEXP = fifaPlayer.movement["Sprint speed"];
			this.topSpeed = this.MinorThan(15 + this.DivideIntegers(topSpeedEXP, this.EXP_Value), 60);

			let accelerationEXP = fifaPlayer.movement["Acceleration"];
			this.acceleration = this.MinorThan(15 + this.DivideIntegers(accelerationEXP, this.EXP_Value), 60); 

			let interceptions = this.MinorThan(fifaPlayer.mentality["Interceptions"], 53);
			let reactions = this.MinorThan(fifaPlayer.movement["Reactions"], 53);
			let responseEXP = reactions > interceptions ? reactions : interceptions
			this.response = 25 + responseEXP + this.DivideIntegers(fifaPlayer.internationalRepuration, this.EXP_ID_Value);

			/*
			Agility EXP : Average of Agility + Acceleration
			Agility = 15 + Agility EXP / EXP_value 
			123 you can use just Agility, but i prefer to combine it with Acceleration, both have best results imo
			Exclamation if Agility < 50, set 50 and if Acceleration < 60, set 60

			Dribble Accuracy EXP : Average of Dribbling + Ball Control + International Reputation
			Dribble Accuracy = 25 + Dribble Accuracy EXP / EXP_IDvalue
			123 Most importand stat is Dribbling, but you can use also the affect of ball control, there are plenty of cases with low Dribbling in fifa so with Ball Control will produce more reasonable results
			Exclamation if Dribbling / Ball Control < 55, set 55

			Dribble Speed EXP: Average of Dribbling + Sprint Speed
			Dribble Speed = 15 + Dribble Speed EXP / EXP_value 
			123 Definitelly most relative attributes to calculate this
			Exclamation if Dribbling < 55, set 55 and Sprint Speed < 50, set 50

			Short Pass Accuracy EXP: Short Passing + International Reputation
			Short Pass Accuracy = 25 + Short Pass Accuracy EXP / EXP_IDvalue

			Exclamation if Short Passing < 50 set 50

			Short Pass Speed EXP : average of Short Passing + Shot Power
			Short Pass Speed = 15 + Short Pass Speed EXP / EXP_value 
			123 I see the only good way to find good result. Combine the accuracy with players kick power.
			Exclamation if Short Passing < 50, set 50 and Shot Power < 60 set 60

			Long Pass Accuracy EXP: average of Long Passing + Crossing + International Reputation
			Long Pass Accuracy = 25 + Long Pass Accuracy EXP / EXP_IDvalue

			123 Long Passing should be the same value, but also we have take in count Crossing.
			Exclamation if Long Passing < 45 set 45 and Crossing < 45 set 45

			Long Pass Speed EXP: average of Crossing + Shot Power
			Long Pass Speed EXP = 15 + Long Pass Speed EXP / EXP_value 
			123 Those 2 values can produce the result we want
			Exclamation Shot Power < 55 set 55

			Shot Accuracy EXP: Finishing + International Reputation
			Shot Accuracy = 25 + Shot Accuracy EXP / EXP_IDvalue

			Exclamation if Finishing < 50 set 50

			Shot Power EXP: Shot Power
			Shot Power = 15 + Shot Power EXP / EXP_value 
			Exclamation if Shot Power < 63 set 63

			Shot Technique EXP: Average of Volleys, Long Shots, Ball Control
			Shot Technique = 15 + Shot Technique EXP / EXP_value 
			Exclamation if Volleys < 50 set 50, Long Shots < 50 set 50 

			Free Kick Accuracy EXP: FK Accuracy + International Reputation
			Free Kick Accuracy = 25 + Free Kick Accuracy EXP / EXP_IDvalue

			Exclamation if FK Accuracy <50 set 50

			Curling EXP: Curve
			Curling = 15 + Curling EXP / EXP_value 
			Exclamation if Curve < 55 set 55

			Header EXP: Heading Accuracy + International Reputation
			Header = 25 + Header EXP / EXP_IDvalue
			Exclamation if Heading Accuracy <= 50 set 50

			Jump EXP: Jumping
			Jump = 15 + Jump EXP / EXP_value 
			Exclamation if Jumping < 60 set 60

			Technique EXP: Ball Control + International Reputation
			Technique = 25 + Technique EXP / EXP_IDvalue
			Exclamation if Ball Control < 55 set 55

			Aggression EXP (all positions except CB): Reactions + International Reputation
			Aggression= 25 + Aggression EXP / EXP_IDvalue

			123 fifa's aggressions value is not the same to use in pes, fifa's is related with aggression of defencive duties despite in pes6 uses for attacking duties, so only reactions can help us to set a value.

			Aggression EXP (only for CB): Average of Reactions, Positioning
			Aggression = 15 + Aggression EXP / EXP_value 
			123 Positioning is not actually related, but i use this to seperate defenders and avoid high values, positioning in fifa describes players with attacking roles.

			Mentality EXP: Average of Aggression, Stamina + International Reputation
			Mentality = 25 + Mentality EXP / EXP_IDvalue
			123 Players with High mentality are tireless, so stamina and aggression is best combination imo.
			Exclamation if Aggression < 45 set 45 and Stamina < 60 set 60

			Keeper Skills: 50

			Teamwork EXP (all except CB/DM): Average of Vision, Positioning, Aggression
			Teamwork = 25 + Teamwork EXP + International Reputation / EXP_IDvalue

			Exclamation if Positioning < 55 set 55 and Aggression < 50 set 50
			Teamwork EXP (only CB,DM): Average of Composure, Aggression
			Teamwork = 25 + Teamwork EXP + International Reputation / EXP_IDvalue
			Exclamation if Aggression < 50 set 50 
			*/

		}
		return this.PSDString();
	}
}