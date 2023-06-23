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
	positions.forEach(position => {
		if (abilityPositions.includes(position))
		return true;
	});
	return false;
}
