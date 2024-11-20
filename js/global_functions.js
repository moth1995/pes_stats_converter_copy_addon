function CopyToClipboard(text){
	navigator.clipboard.writeText(text)
		.then(() => {
			console.log("Text copied to clipboard");
		})
		.catch((error) => {
			console.error("Error copying text to clipboard:", error);
		});
};

const PES5_CSV_COLUMNS = "ID,NAME,SHIRT_NAME,NATIONALITY,AGE,STRONG FOOT,INJURY TOLERANCE,REGISTERED POSITION,FAVOURED SIDE,GK  0,CWP  2,CBT  3,SB  4,DMF  5,WB  6,CMF  7,SMF  8,AMF  9,WF 10,SS  11,CF  12,ATTACK,DEFENSE,BALANCE,STAMINA,TOP SPEED,ACCELERATION,RESPONSE,AGILITY,DRIBBLE ACCURACY,DRIBBLE SPEED,SHORT PASS ACCURACY,SHORT PASS SPEED,LONG PASS ACCURACY,LONG PASS SPEED,SHOT ACCURACY,SHOT POWER,SHOT TECHNIQUE,FREE KICK ACCURACY,CURLING,HEADING,JUMP,TECHNIQUE,AGGRESSION,MENTALITY,GOAL KEEPING,TEAM WORK,CONSISTENCY,CONDITION / FITNESS,WEAK FOOT ACCURACY,WEAK FOOT FREQUENCY,DRIBBLING,TACTICAL DRIBBLE,POSITIONING,REACTION,PLAYMAKING,PASSING,SCORING,1-1 SCORING,POST PLAYER,LINES,MIDDLE SHOOTING,SIDE,CENTRE,PENALTIES,1-TOUCH PASS,OUTSIDE,MARKING,SLIDING,COVERING,D-LINE CONTROL,PENALTY STOPPER,1-ON-1 STOPPER,LONG THROW,HEIGHT,WEIGHT";
const PES13_CSV_COLUMNS = "INDEX,NAME,SHIRTNAME,JAPANESE PLAYER NAME,SPACING,COMMENTARY,AGE,NATIONALITY,FOOT,WEIGHT,HEIGHT,FORM,WEAK FOOT ACCURACY,WEAK FOOT FREQUENCY,INJURY TOLERANCE,GROWTH TYPE,MARKET PRICE,GK 0,SW 1,CB 2,LB 3,RB 4,DMF 5,CMF 6,LMF 7,RMF 8,AMF 9,LWF 10,RWF 11,SS 12,CF 13,POSITION,ATTACK,DEFENCE,HEADER ACCURACY,DRIBBLE ACCURACY,SHORT PASS ACCURACY,SHORT PASS SPEED,LONG PASS ACCURACY,LONG PASS SPEED,SHOT ACCURACY,PLACE KICKING,SWERVE,BALL CONTROLL,GOAL KEEPING SKILLS,RESPONSE,EXPLOSIVE POWER,DRIBBLE SPEED,TOP SPEED,BODY BALANCE,STAMINA,KICKING POWER,JUMP,TENACITY,TEAMWORK,S01 1-TOUCH PLAY,S02 OUTSIDE CURVE,S03 LONG THROW,S04 SUPER-SUB,S05 SPEED MERCHANT,S06 LONG RANGE DRIVE,S07 SHOULDER FEINT SKILLS,S08 TURNING SKILLS,S09 ROULETTE SKILLS,S10 FLIP FLAP SKILLS,S11 FLICKING SKILLS,S12 SCISSORS SKILLS,S13 STEP ON SKILLS,S14 DEFT TOUCH SKILLS,S15 KNUCKLE SHOT,S16 JUMPING VOLLEY,S17 SCISSOR KICK,S18 HEEL FLICK,S19 WEIGHTED PASS,S20 DOUBLE TOUCH,S21 RUN AROUND,S22 SOMBRERO,S23 180 DRAG,S24 LUNGING TACKLE,S25 DIVING HEADER,S26 GK LONG THROW,P01 CLASSIC NO.10,P02 ANCHOR MAN,P03 TRICKSTER,P04 DARTING RUN,P05 MAZING RUN,P06 PINPOINT PASS,P07 EARLY CROSS,P08 BOX TO BOX,P09 INCISIVE RUN,P10 LONG RANGER,P11 ENFORCER,P12 GOAL POACHER,P13 DUMMY RUNNER,P14 FREE ROAMING,P15 TALISMAN,P16 FOX IN THE BOX,P17 OFFENSIVE SIDEBACK,P18 TRACK BACK,ATTACK AWARENESS,DEFENCE AWARENESS,SKIN COLOR,SKIN TEXTURE,FACE MODE,LINKED FACE,FACE SLOT,LINKED HAIR,HAIR SLOT,BOOTS,UNTUCKED SHIRT,TIGHT KIT,GLOVES,DRIBBLE STYLE,FREE KICK STYLE,PENALTY KICK STYLE,DROP KICK STYLE,GOAL CELEBRATION STYLE #1,GOAL CELEBRATION STYLE #2,CLUB TEAM,NUMBER,NATIONAL TEAM";
const PES21_CSV_COLUMNS = "Id;Name;JapName;Shirt;ShirtNational;Commentary;Country;Country2;Height;Weight;Age;Foot;PlayingStyle;POS;GK;CB;LB;RB;DMF;CMF;LMF;RMF;AMF;LWF;RWF;SS;CF;OffensiveAwareness;BallControl;Dribbling;TightPossession;LowPass;LoftedPass;Finishing;Heading;PlaceKicking;Curl;Speed;Acceleration;KickingPower;Jump;PhysicalContact;Balance;Stamina;DefensiveAwareness;BallWinning;Aggression;GKAwareness;GKCatching;GKClearing;GKReflexes;GKReach;WeakFootUsage;WeakFootAcc;Form;InjuryResistance;Reputation;PlayingAttitude;Trickster;MazingRun;SpeedingBullet;IncisiveRun;LongBallExpert;EarlyCross;LongRanger;ScissorsFeint;DoubleTouch;FlipFlap;MarseilleTurn;Sombrero;CrossOverTurn;CutBehindAndTurn;ScotchMove;StepOnSkillcontrol;HeadingSpecial;LongRangeDrive;Chipshotcontrol;LongRangeShot;KnuckleShot;DippingShots;RisingShots;AcrobaticFinishing;HeelTrick;FirstTimeShot;OneTouchPass;ThroughPassing;WeightedPass;PinpointCrossing;OutsideCurler;Rabona;NoLookPass;LowLoftedPass;GKLowPunt;GKHighPunt;LongThrow;GKLongThrow;PenaltySpecialist;GKPenaltySaver;Gamesmanship;ManMarking;TrackBack;Interception;AcrobaticClear;Captaincy;SuperSub;FightingSpirit;Celebration1;Celebration2;DribblingHunching;DribblingArmMove.;RunningHunching;RunningArmMovement;CornerKicks;FreeKicks;PenaltyKick;DribbleMotion;YouthClub;OwnerClub;ContractUntil;LoanUntil;MarketValue;NationalCaps;Legend;Hand;WinnerGoldenBall;EditName;EditBasics;EditPosition;EditPositions;EditAbilities;EditPlayerSkills;EditPlayingStyle;EditCOMPlayingStyles;EditMovements;Edit1;Edit2;Edit3;Edit4;Edit5;Edit6;Edit7;Value1;Value2;Value3;Value2020_1;Value2020_2;Appearance;ListBoots;ListGloves;InEditFile;OverallStats";

function AddPlayer(playerData) {
	chrome.storage.local.get(['playersData'], function(result) {
		let playersData = result.playersData || [];

		if (playersData.length == 0) {
			playersData.push(PES5_CSV_COLUMNS);
		}

		playersData.push(playerData);
		chrome.storage.local.set({ playersData: playersData }, function() {
			console.log('Player PES5 added to array5');
		});
	});
}

function AddPlayer13(player13Data) {
	console.log(player13Data)
	chrome.storage.local.get(['players13Data'], function(result) {
		let players13Data = result.players13Data || [];

		if (players13Data.length == 0) {
			players13Data.push(PES13_CSV_COLUMNS);
		}

		players13Data.push(player13Data);
		console.log(players13Data);
		chrome.storage.local.set({ players13Data: players13Data }, function() {
			console.log('Player PES13 added to array13');
		});
	});
}

function AddPlayer21(player21Data) {
	chrome.storage.local.get(['players21Data'], function(result) {
		let players21Data = result.players21Data || [];

		if (players21Data.length == 0) {
			players21Data.push(PES21_CSV_COLUMNS);
		}

		players21Data.push(player21Data);
		chrome.storage.local.set({ players21Data: players21Data }, function() {
			console.log('Player PES21 added to array21');
		});
	});
}

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
	const trimmedString = positions.replace(/,\s*/g, ",");
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
	if (num < min) return min;
	else if (num > max) return max;
	return num;
}

const gkHeightTable = {
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
const playersHeightTable = {
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

function heightTo99Stat(height, isGK){
	if (isGK) {
		if (height in gkHeightTable) {
		  	return gkHeightTable[height];
		} else {
			stat = height < 175 ? 95 : 55
		  	return stat;
		}
	}

	if (height in playersHeightTable) {
		return playersHeightTable[height];
	} else {
		stat = height < 165 ? 95 : 55
		return stat;
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
	let maxKey = "";
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

function getPlayingStyle(role, position) {
	const styleRules = {
		"Goalkeeper Defensive": ["goalkeeper defensive"],
		"Goalkeeper Offensive": ["sweeper keeper"],
		"The Destroyer": ["libero", "centre-back", "central defender", "ball-winning midfielder"],
		"Build Up": ["ball playing defender"],
		"Extra Frontman": ["no-nonsense centreback", "wide centre-back"],
		"Full Back Finisher": ["complete wing-back", "inverted wing-back"],
		"Offensive Full Back": ["full-back", "fing-back"],
		"Defensive Full Back": ["no-nonsense full-back"],
		"Orchestrator": ["roaming playmaker", "deep-lying playmaker", "regista", "half-back"],
		"Box To Box": ["segundo volante", "defensive midfielder", "box to box midfielder", "central midfielder", "carrilero", "defensive winger"],
		"Anchor Man": ["anchor man"],
		"Hole Player": ["mezzala", "advanced playmaker", "wide playmaker", "wide midfielder", "second striker"],
		"Classic N.10": ["roaming playmaker", "trequartista"],
		"Cross Specialist": ["winger", "wide target man"],
		"Roaming Flank": ["inverted winger", "inside forward"],
		"Creative Playmaker": ["advanced playmaker", "attacking midfielder", "raumdeuter", "trequartista"],
		"Dummy Runner": ["enganche", "deep lying forward", "false nine", "trequartista"],
		"Prolific Winger": ["winger"],
		"Goal Poacher": ["complete forward", "poacher", "target man", "pressing forward"],
		"Fox In The Box": ["advanced forward", "complete forward"],
		"Target Man": ["deep lying forward", "target man"]
	};
	const styleRulesByPosition = {
		"GK": ["Goalkeeper Defensive", "Goalkeeper Offensive"],
		"CB": ["The Destroyer", "Build Up", "Extra Frontman"],
		"RB": ["Full Back Finisher", "Offensive Full Back", "Defensive Full Back"],
		"LB": ["Full Back Finisher", "Offensive Full Back", "Defensive Full Back"],
		"DMF": ["Orchestrator", "Box To Box", "The Destroyer", "Anchor Man"],
		"CMF": ["Hole Player", "Classic N.10", "Orchestrator", "Box To Box", "The Destroyer"],
		"RMF": ["Cross Specialist", "Roaming Flank", "Hole Player", "Box To Box"],
		"LMF": ["Cross Specialist", "Roaming Flank", "Hole Player", "Box To Box"],
		"AMF": ["Hole Player", "Creative Playmaker", "Dummy Runner", "Classic N.10"],
		"RWF": ["Roaming Flank", "Creative Playmaker", "Prolific Winger", "Cross Specialist"],
		"LWF": ["Roaming Flank", "Creative Playmaker", "Prolific Winger", "Cross Specialist"],
		"SS": ["Creative Playmaker", "Goal Poacher", "Dummy Runner", "Hole Player", "Classic N.10"],
		"CF": ["Fox In The Box", "Target Man", "Goal Poacher", "Dummy Runner"],
	};
	let positionStyles = styleRulesByPosition[position];
	for (const style of positionStyles) {
		console.log(style);
        if (styleRules[style].includes(role)) {
            return style;
        }
    }
    return "";
}

function PES21GetPlayingStyle(FMBestSuitableRoles, pesPosition){
	let role = GetMaxKeyFromObject(FMBestSuitableRoles).toLowerCase();
	console.log("role before replace", role);
	role = role.replace(/(\s+\(\w+\))/, "");
	console.log("role after replace", role);
	let playingStyle = getPlayingStyle(role, pesPosition);
	
	return playingStyle;
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

const PES21_COUNTRY_MAP = {
    'None': 0,
    'Afghanistan': 1,
    'Bahrain': 2,
    'Bangladesh': 3,
    'Bhutan': 4,
    'Brunei': 5,
    'Cambodia': 6,
    'China': 7,
    'Hong Kong': 8,
    'India': 9,
    'Indonesia': 10,
    'Iran': 11,
    'Iraq': 12,
    'Japan': 13,
    'Jordan': 14,
    'North Korea': 15,
    'South Korea': 16,
    'Kuwait': 17,
    'Laos': 18,
    'Lebanon': 19,
    'Macao': 20,
    'Malaysia': 21,
    'Maldives': 22,
    'Mongolia': 23,
    'Myanmar': 24,
    'Nepal': 25,
    'Oman': 26,
    'Pakistan': 27,
    'Palestine': 28,
    'Philippines': 29,
    'Qatar': 30,
    'Saudi Arabia': 31,
    'Singapore': 32,
    'Sri Lanka': 33,
    'Syria': 34,
    'Thailand': 36,
    'Uae': 37,
    'Vietnam': 38,
    'Yemen': 39,
    'Kyrgyz Republic': 40,
    'Tajikistan': 41,
    'Turkmenistan': 42,
    'East Timor': 43,
    'Algeria': 44,
    'Angola': 45,
    'Benin': 46,
    'Botswana': 47,
    'Burkina Faso': 48,
    'Burundi': 49,
    'Cameroon': 50,
    'Cape Verde': 51,
    'Central African Rep.': 52,
    'Chad': 53,
    'The Comoros': 54,
    'Congo Dr': 55,
    'Côte d\'Ivoire': 56,
    'Djibouti': 57,
    'Egypt': 58,
    'Equatorial Guinea': 59,
    'Eritrea': 60,
    'Ethiopia': 61,
    'Gabon': 62,
    'Republic of the Gambia': 63,
    'Ghana': 64,
    'Guinea': 65,
    'Guinea-Bissau': 66,
    'Kenya': 67,
    'Lesotho': 68,
    'Liberia': 69,
    'Libya': 70,
    'Madagascar': 71,
    'Malawi': 72,
    'Mali': 73,
    'Mauritania': 74,
    'Mauritius': 75,
    'Morocco': 76,
    'Mozambique': 77,
    'Namibia': 78,
    'Niger': 79,
    'Nigeria': 80,
    'Rwanda': 81,
    'Sao Tomé and Principe': 82,
    'Senegal': 83,
    'Seychelles': 84,
    'Sierra Leone': 85,
    'Somalia': 86,
    'South Africa': 87,
    'Sudan': 88,
    'Swaziland': 89,
    'Tanzania': 90,
    'Togo': 91,
    'Tunisia': 92,
    'Uganda': 93,
    'Zambia': 94,
    'Zimbabwe': 95,
    'Congo': 98,
    'Réunion': 100,
    'Anguilla': 103,
    'Antiqua and Barbuda': 104,
    'Aruba': 105,
    'The Bahamas': 106,
    'Barbados': 107,
    'Belize': 108,
    'Bermuda': 109,
    'Canada': 110,
    'Cayman Islands': 111,
    'Costa Rica': 112,
    'Cuba': 113,
    'Dominica': 114,
    'Dominican Republic': 115,
    'El Salvador': 116,
    'Grenada': 117,
    'Guadeloupe': 118,
    'Guatemala': 119,
    'Haiti': 120,
    'Honduras': 121,
    'Jamaica': 122,
    'Martinique': 123,
    'Mexico': 124,
    'Montserrat': 125,
    'Netherlands Antilles': 126,
    'Nicaragua': 127,
    'Panama': 128,
    'Puerto Rico': 129,
    'Saint Kitts and Nevis': 130,
    'Saint Lucia': 131,
    'St Vincent and Grenadines': 132,
    'Trinidad and Tobago': 133,
    'Turks and Caicos Is.': 134,
    'United States': 135,
    'British Virgin Islands': 136,
    'U.S. Virgin Islands': 137,
    'French Guiana': 138,
    'Suriname': 139,
    'Curaçao': 140,
    'Argentina': 144,
    'Bolivia': 145,
    'Brazil': 146,
    'Chile': 147,
    'Colombia': 148,
    'Ecuador': 149,
    'Paraguay': 150,
    'Peru': 151,
    'Uruguay': 152,
    'Venezuela': 153,
    'Gyuana': 159,
    'American Samoa': 161,
    'Australia': 162,
    'Cook Islands': 163,
    'Fiji': 164,
    'New Caledonia': 165,
    'New Zealand': 166,
    'Papua New Guinea': 167,
    'Samoa': 168,
    'Solomon Islands': 169,
    'Tahiti': 170,
    'Tonga': 171,
    'Vanuatu': 172,
    'Guam': 176,
    'Palau': 184,
    'Israel': 189,
    'Turkey': 190,
    'Albania': 191,
    'Andorra': 192,
    'Armenia': 193,
    'Austria': 194,
    'Azerbaijan': 195,
    'Belarus': 196,
    'Belgium': 197,
    'Bosnia and Herzegovina': 198,
    'Bulgaria': 199,
    'Croatia': 200,
    'Cyprus': 201,
    'Czech Republic': 202,
    'Denmark': 203,
    'England': 204,
    'Estonia': 205,
    'Faroe Islands': 206,
    'Finland': 207,
    'France': 208,
    'Georgia': 209,
    'Germany': 210,
    'Greece': 211,
    'Hungary': 212,
    'Iceland': 213,
    'Republic of Ireland': 214,
    'Italy': 215,
    'Kazakhstan': 216,
    'Latvia': 217,
    'Liechtenstein': 218,
    'Lithuania': 219,
    'Luxembourg': 220,
    'Macedonia': 221,
    'Malta': 222,
    'Moldova': 223,
    'Netherlands': 224,
    'Northern Ireland': 225,
    'Norway': 226,
    'Poland': 227,
    'Portugal': 228,
    'Romania': 229,
    'Russia': 230,
    'San Marino': 231,
    'Scotland': 232,
    'Slovakia': 234,
    'Slovenia': 235,
    'Spain': 236,
    'Sweden': 237,
    'Switzerland': 238,
    'Ukraine': 239,
    'Uzbekistan': 240,
    'Wales': 241,
    'Gibraltar': 245,
    'Monaco': 250,
    'Others': 260,
    'Taiwan': 298,
    'Serbia': 303,
    'Montenegro': 304,
    'Sint Maarten': 310,
    'Kosovo': 311,
    'South Sudan': 312
};