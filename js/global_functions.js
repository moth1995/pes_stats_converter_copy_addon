function CopyToClipboard(text){
	navigator.clipboard.writeText(text)
		.then(() => {
			console.log("Text copied to clipboard");
		})
		.catch((error) => {
			console.error("Error copying text to clipboard:", error);
		});
};

function MinorThan(value, compare){
	return value < compare ? compare : value;
}

function DivideIntegers(int1, int2){
	return Math.round(int1/int2);
}

function Average(numbers) {
	if (numbers.length === 0) {
	  return 0;
	}
	
	var sum = 0;
	for (var i = 0; i < numbers.length; i++) {
	  sum += numbers[i];
	}
	
	return sum / numbers.length;
  }
  

function GetRandomInt(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}

function FMToPESStat99(stat){
	stat = Math.round(stat);
    let minArray = [40,43,46,49,52,55,58,61,64,67,70,73,76,79,82,85,88,91,94,97];
    let maxArray = [43,46,49,52,55,58,61,64,67,70,73,76,79,82,85,88,91,94,97,100];
    let PESStat=GetRandomInt(minArray[stat - 1], maxArray[stat - 1]);
    return PESStat;
}

function FMToPESStat1To8(stat) {
	stat = Math.round(stat);
    let valuesArray = [1,2,3,3,3,4,4,4,5,5,5,6,6,6,7,7,7,8,8,8];
    return valuesArray[stat - 1];
}

function FMToPESStatAToC(stat) {
	stat = Math.round(stat);
	let valuesArray=['C','C','C','C','C','B','B','B','B','B','B','B','B','B','A','A','A','A','A','A'];
    return valuesArray[stat - 1];
}

function FMToPESPositions(position){
	switch (position) {
		case 'GK':
			return 'GK';
		case 'DC':
			return 'CBT';
		case 'DL':
		case 'DR':
			return 'SB';
		case 'DM':
			return 'DMF';
		case 'WBL':
		case 'WBR':
			return 'WB';
		case 'MC':
			return 'CMF';
		case 'ML':
		case 'MR':
			return 'SMF';
		case 'AMC':
			return 'AMF';
		case 'AML':
		case 'AMR':
			return 'WF';
		// There's no equivalent of SS on FM
		/*case 'LF':
		case 'RF':
		case 'CF':
			return 'SS';*/
		case 'ST':
			return 'CF';
		default:
			return position;
	}
}

function FMPositionStringToArray(positions){
	const trimmedString = positions.replace(/\s*,\s*/g, ",");
	const outputArray = trimmedString.split(",");
	return outputArray;
}

function GetFavSide(positions, useLastChar){
		
	let favSide = 'B';
	let bothSides = 0;
	let leftSide = 0;
	let rightSide = 0;
  
	for (let index = 0; index < positions.length; index++) {
		if (useLastChar){
			if (positions[index].slice(-1) === 'L') {
				leftSide++;
			} else if (positions[index].slice(-1) === 'R') {
				rightSide++;
			} else {
				bothSides++;
			}	
		}
		else{
			if (positions[index][0] === 'L') {
				leftSide++;
			} else if (positions[index][0] === 'R') {
				rightSide++;
			} else {
				bothSides++;
			}	
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

function EfootballInjuryResistance(injury){
	switch(injury){
		case "Low":
			return "C";
		case "Medium":
			return "B";
		case "High":
			return "A";
	}
}

function EfootballCondition(condition){
	switch(condition){
		case "A":
			return 8;
		case "B":
			return 7;
		case "C":
			return 6;
		case "D":
			return 5;
		case "E":
			return 4;
	}
}

function EfootballWeakFoot(weakFoot, ballControl){
	switch(weakFoot){
		case "Slightly Low":
		case "Almost Never":
			return ballControl<75 ? 1 : 2;
		case "Medium":
		case "Rarely":
			return ballControl<75 ? 3 : 4;
		case "High":
		case "Occasionally":
			return ballControl<75 ? 5 : 6;
		case "Very High":
		case "Regularly":
			return ballControl<75 ? 7 : 8;
	}
}

function EfootballToPESPosition(position){
	switch (position) {
		case "CB":
			return "CBT";
		case "RB":
		case "LB":
			return "SB";
		case "RMF":
		case "LMF":
			return "SMF";
		case "RWF":
		case "LWF":
			return "WF";
		default:
			return position;
	}
}

function LimitStat99(stat) {
	return stat <= 99 ? Math.round(stat) : 99;
}
	
function clamp(min, max, num) {
	if (num < min) {
		  return min;
	} else if (num > max) {
		  return max;
	} else {
	  	return num;
	}
}

function heightTo99Stat(height, isGK){
	gkTable = {
		175 : 95,
		176 : 94,
		177 : 93,
		178 : 92,
		179 : 91,
		180 : 90,
		181 : 89,
		182 : 88,
		183 : 87,
		184 : 86,
		185 : 85,
		186 : 84,
		187 : 83,
		188 : 82,
		189 : 81,
		190 : 80,
		191 : 79,
		192 : 78,
		193 : 77,
		194 : 76,
		195 : 75,
		196 : 74,
		197 : 73,
		198 : 72,
		199 : 71,
		200 : 70,
		201 : 69,
		202 : 68,
		203 : 67,
		204 : 66,
		205 : 65
	}
	playersTable = {
		165 : 95,
		166 : 94,
		167 : 93,
		168 : 92,
		169 : 91,
		170 : 90,
		171 : 89,
		172 : 88,
		173 : 87,
		174 : 86,
		175 : 85,
		176 : 84,
		177 : 83,
		178 : 82,
		179 : 81,
		180 : 80,
		181 : 79,
		182 : 78,
		183 : 77,
		184 : 76,
		185 : 75,
		186 : 74,
		187 : 73,
		188 : 72,
		189 : 71,
		190 : 70,
		191 : 69,
		192 : 68,
		193 : 67,
		194 : 66,
		195 : 65,
		196 : 64,
		197 : 63,
		198 : 62,
		199 : 61,
		200 : 60,
		201 : 59,
		202 : 58,
		203 : 57,
		204 : 56,
		205 : 55,
	}
	if (isGK) {
		if (height in gkTable) {
		  	return gkTable[height];
		} else {
			stat = height < 175 ? 95 : 55
		  	return stat;
		}
	} else {
		if (height in playersTable) {
			return playersTable[height];
		} else {
			stat = height < 165 ? 95 : 55
		  	return stat;
		}
	}
}

function hasSpecialAbility(abilityPositions, registeredPosition, positions){
	if (abilityPositions.includes(registeredPosition))
		return true;
	for (let index = 0; index < positions.length; index++) {
		let position = positions[index];
		if (abilityPositions.includes(position))
			return true;
	}
	return false;
}

function FMToPES21Positions(position){
	switch (position) {
		case 'GK':
			return 'GK';
		case 'DC':
			return 'CB';
		case 'DL':
			return 'LB'
		case 'DR':
			return 'RB';
		case 'DM':
			return 'DMF';
		case 'WBL':
			return 'LB'
		case 'WBR':
			return 'RB';
		case 'MC':
			return 'CMF';
		case 'ML':
			return 'LMF';
		case 'MR':
			return 'RMF';
		case 'AMC':
			return 'AMF';
		case 'AML':
			return 'LWF';
		case 'AMR':
			return 'RWF';
		case 'ST':
			return 'CF';
		default:
			return position;
	}
}

function CAPoints(ca){
	ca = ca * 2;
	if (ca <= 90) return -10;
	else if (ca <= 100) return -9;
	else if (ca <= 110) return -8;
	else if (ca <= 120) return -7;
	else if (ca <= 130) return -6;
	else if (ca <= 140) return -5;
	else if (ca <= 150) return -4;
	else if (ca <= 160) return -3;
	else if (ca <= 170) return -2;
	else if (ca <= 180) return -1;
	else return 1;
}

function FMStatTOPES21(statFromFormula, max, min, ca){
	let caPoints = CAPoints(ca);
	return Math.round(clamp(40, 99, (max-min)/20 * (statFromFormula) + min + caPoints));
}

function FMToPES21Stat1To3(stat) {
	stat = Math.round(stat);
	if (stat<8) return 1;
	else if(stat<15) return 2;
	else return 3;
}

function FMToPES21Stat1To8(stat) {
	stat = Math.round(stat);
	if (stat<4) return 2;
	else if(stat<7) return 3;
	else if(stat<10) return 4;
	else if(stat<13) return 5;
	else if(stat<16) return 6;
	else if(stat<19) return 7;
	else return 8;
}

function GetMaxKeyFromObject(data){
	let maxKey = null;
	let maxValue = -Infinity;

	for (const key in data) {
	const value = data[key];
	if (value > maxValue) {
		maxValue = value;
		maxKey = key;
	}
	}
	console.log("Clave con el valor más alto:", maxKey);
	console.log("Valor más alto:", maxValue);
	return maxKey;
}

function PES21GetPlayingStyle(FMBestSuitableRoles){
	let role = GetMaxKeyFromObject(FMBestSuitableRoles);
	let playingStyle = "";
	switch (role) {
		case "Goalkeeper Defensive":
			playingStyle = "GOALKEEPER DEFENSIVE";
			break;
		case "Sweeper Keeper (Defensive)":
		case "Sweeper Keeper (Attack)":
		case "Sweeper Keeper (Support)":
			playingStyle = "GOALKEEPER OFFENSIVE";
			break;
		case "Libero (Attack)":
		case "Libero (Support)":
		case "Centre-back (Cover)":
		case "Deep-lying Playmaker (Defend)":
		case "Centre-back (Stopper)":
		case "Central Defender (Defend)":
		case "Bal-winning Midfielder (Support)":
		case "Bal-winning Midfielder (Defend)":
			playingStyle = "THE DESTROYER";
			break;
		case "Ball Playing Defender (Cover)":
		case "Ball Playing Defender (Stopper)":
		case "Ball Playing Defender (Defend)":
			playingStyle = "BUILD UP";
			break;
		case "No-Nonsense Centreback (Cover)":
		case "No-Nonsense Centreback (Stopper)":
		case "No-Nonsense Centreback (Defend)":
		case "Wide Centre-back (Defend)":
		case "Wide Centre-back (Support)":
		case "Wide Centre-back (Attack)":
			playingStyle = "EXTRA FRONTMAN";
			break;
		case "Complete Wing-Back (Attack)":
		case "Complete Wing-back (Support)":
		case "Inverted Wing-back (Attack)":
		case "Inverted Wing-back (Defend)":
		case "Inverted Wing-back (Support)":
			playingStyle = "FULL BACK FINISHER";
			break;

		default:
		break;
	}
}

function PES21GetPositionWeight(position, fmPlayer){
	switch (position) {
		case "*GK":
			return fmPlayer.stats["Decisions"] * 0.1 + 
				fmPlayer.stats["Agility"] * 0.09 + 
				fmPlayer.stats["Handling"] * 0.12 + 
				fmPlayer.stats["Reflexes"] * 0.12;
		case "*CB":
			return fmPlayer.stats["Marking"] * 0.1 + 
				fmPlayer.stats["Decisions"] * 0.13 + 
				fmPlayer.stats["Positioning"] * 0.1 + 
				fmPlayer.stats["Acceleration"] * 0.09 + 
				fmPlayer.stats["Jumping Reach"] * 0.08 + 
				fmPlayer.stats["Pace"] * 0.08 +
				fmPlayer.stats["Strength"] * 0.08;
		case "*RB":
		case "*LB":
			return fmPlayer.stats["Tackling"] * 0.07 +
				fmPlayer.stats["Concentration"] * 0.07 +
				fmPlayer.stats["Decisions"] * 0.13 +
				fmPlayer.stats["Positioning"] * 0.14 +
				fmPlayer.stats["Acceleration"] * 0.15 +
				fmPlayer.stats["Agility"] * 0.07 +
				fmPlayer.stats["Pace"] * 0.14 ;
		case "*DMF":
			return fmPlayer.stats["Tackling"] * 0.1 +
				fmPlayer.stats["Decisions"] * 0.11 +
				fmPlayer.stats["Acceleration"] * 0.12 +
				fmPlayer.stats["Agility"] * 0.07 +
				fmPlayer.stats["Pace"] * 0.08 +
				fmPlayer.stats["Strength"] * 0.07;
		case "*RMF":
		case "*LMF":
			return fmPlayer.stats["Acceleration"] * 0.26 +
				fmPlayer.stats["Agility"] * 0.07 +
				fmPlayer.stats["Pace"] * 0.20 +
				fmPlayer.stats["Stamina"] * 0.05;
		case "*CMF":
			return fmPlayer.stats["Passing"] * 0.1 +
				fmPlayer.stats["Decisions"] * 0.07 +
				fmPlayer.stats["Vision"] * 0.11 +
				fmPlayer.stats["Acceleration"] * 0.12 +
				fmPlayer.stats["Agility"] * 0.07 +
				fmPlayer.stats["Pace"] * 0.1;
		case "*RWF":
		case "*LWF":
			return fmPlayer.stats["Dribbling"] * 0.07 +
				fmPlayer.stats["Acceleration"] * 0.28 +
				fmPlayer.stats["Agility"] * 0.05 +
				fmPlayer.stats["Pace"] * 0.28;
		case "*AMF":
			return fmPlayer.stats["Passing"] * 0.06 +
				fmPlayer.stats["Vision"] * 0.09 +
				fmPlayer.stats["Acceleration"] * 0.23 +
				fmPlayer.stats["Pace"] * 0.13;
		case "*SS":
			return fmPlayer.stats["Finishing"] * 0.08 +
				fmPlayer.stats["Acceleration"] * 0.24 +
				fmPlayer.stats["Pace"] * 0.17 +
				fmPlayer.stats["Strength"] * 0.06;
		case "*CF":
			return fmPlayer.stats["Heading"] * 0.13 +
				fmPlayer.stats["Acceleration"] * 0.17 +
				fmPlayer.stats["Jumping Reach"] * 0.12 +
				fmPlayer.stats["Pace"] * 0.1;
		default:
			return -1;
	}
}
