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
	
