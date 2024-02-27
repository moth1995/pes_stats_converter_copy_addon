class PES13Player extends PESPlayer{

    constructor() {
        super();

        this.classicN10Positions = ["CMF", "AMF"];
        this.anchorManPositions = ["DMF", "CMF"];
        this.tricksterPositions = ["RMF", "LMF", "RWF", "LWF", "SS"];
        this.dartingRunPositions = ["RMF" , "LMF" , "RWF" , "LWF" , "SS"];
        this.mazingRunPositions = ["RMF", "LMF", "RWF", "LWF", "SS"];
        this.pinPointPassPositions = ["CB", "RB", "LB", "DMF", "CMF"];
        this.earlyCrossPositions = ["RB", "LB", "RMF", "LMF", "RWF", "LWF"];
        this.boxToBoxPositions = ["DMF", "CMF", "RMF", "LMF", "AMF"];
        this.incisiveRunPositions = ["RB", "LB", "RMF", "LMF", "RWF", "LWF"];
        this.longRangerPositions = ["CB", "RB", "LB", "DMF", "CMF", "AMF", "RMF", "LMF"];
        this.enforcerPositions = ["DMF", "CMF"];
        this.goalPoacherPositions = ["SS" , "CF"];
        this.dummyRunnerPositions = ["SS", "CF"];
        this.freeRoamingPositions = ["CMF", "AMF", "RMF", "LMF"];
        this.talismanPositions = ["CMF", "RMF", "LMF", "AMF"];
        this.foxInTheBoxPositions = ["CF"];
        this.offensiveFullbackPositions = ["CB", "RB", "LB"];
        this.trackBackPositions = ["SS", "CF"];

        this.indexCards = "";

    }

    FromFMPlayer(fmPlayer){
        super.FromFMPlayer(fmPlayer);

		let FMPositions = FMPositionStringToArray(fmPlayer.info["Position"]);
		this.registeredPosition = FMPositions.includes("AMC") && FMPositions.includes("ST") ? "SS" : FMToPES21Positions(FMPositions[0]);
		this.positions = [];

		for (let index = 0; index < FMPositions.length; index++) {
            let pos = FMToPES21Positions(FMPositions[index]);
			if (this.registeredPosition != pos && !(this.positions.includes(pos))){
				this.positions.push(pos);
			}
		}

        this.explosivePower = Average([FMToPESStat99(fmPlayer.stats["Acceleration"]), FMToPESStat99(fmPlayer.stats["Agility"])]);
        this.tenacity = Average([FMToPESStat99(fmPlayer.stats["Leadership"]), FMToPESStat99(fmPlayer.stats["Determination"])]);

        let rushingOut = 0;
        let workRate = fmPlayer.stats["Work Rate"];

        try {
            rushingOut = fmPlayer.stats["Rushing Out (Tendency)"];
        } catch (error) {
            rushingOut = 0
        }

        switch (this.registeredPosition) {
            case "GK":
                this.defenceAwareness = 2;
                if (rushingOut < 6)
                    this.attackAwareness = 1;
                else if (rushingOut < 15)
                    this.attackAwareness = 2;
                else this.attackAwareness = 3;
                break;
            case "CB":
            case "DMF":
                if (workRate < 6) {
                    this.attackAwareness = 1;
                    this.defenceAwareness = 2;
                } else if (workRate < 12) {
                    this.attackAwareness = 1;
                    this.defenceAwareness = 3;
                } else if (workRate < 15) {
                    this.attackAwareness = 2;
                    this.defenceAwareness = 3;
                } else {
                    this.attackAwareness = 3;
                    this.defenceAwareness = 3;
                }
                break;
            case "RB":
            case "LB":
            case "RMF":
            case "LMF":
                if (workRate < 6) {
                    this.attackAwareness = 2;
                    this.defenceAwareness = 1;
                } else if (workRate < 12) {
                    this.attackAwareness = 2;
                    this.defenceAwareness = 2;
                } else if (workRate < 15) {
                    this.attackAwareness = 3;
                    this.defenceAwareness = 2;
                } else {
                    this.attackAwareness = 3;
                    this.defenceAwareness = 3;
                }
                break;
            case "CMF":
                if (workRate < 6) {
                    this.attackAwareness = 1;
                    this.defenceAwareness = 1;
                } else if (workRate < 15) {
                    this.attackAwareness = 2;
                    this.defenceAwareness = 2;
                } else {
                    this.attackAwareness = 3;
                    this.defenceAwareness = 3;
                }
                break;
            case "AMF":
            case "RWF":
            case "LWF":
            case "SS":
            case "CF":
                if (workRate < 6) {
                    this.attackAwareness = 2;
                    this.defenceAwareness = 1;
                } else if (workRate < 12) {
                    this.attackAwareness = 3;
                    this.defenceAwareness = 1;
                } else if (workRate < 15) {
                    this.attackAwareness = 3;
                    this.defenceAwareness = 2;
                } else {
                    this.attackAwareness = 3;
                    this.defenceAwareness = 3;
                }
                break;
            default:
                this.attackAwareness = 2;
                this.defenceAwareness = 2;
                break;
        }

        this.PES13GetIndexCardsFromFM(fmPlayer);
    }

    PositionsInIndexCardPositions(IndexCardPositions){
        for (let index = 0; index < this.positions.length; index++) {
            if (IndexCardPositions.includes(this.positions[index]))
                return true;
        }
        return false;
    }

    PES13GetIndexCardsFromFM(fmPlayer){

        if (
            (this.classicN10Positions.includes(this.registeredPosition)
            || this.PositionsInIndexCardPositions(this.classicN10Positions))
            && this.playmaking
        ){
            this.indexCards += "P01 - Classic No.10" + "\n";
        }

        if (
            (this.anchorManPositions.includes(this.registeredPosition)
            || this.PositionsInIndexCardPositions(this.anchorManPositions))
            && fmPlayer.stats["Work Rate"] < 12
        ){
            this.indexCards += "P02 - Anchor Man" + "\n";
        }
        
        if (
            (this.mazingRunPositions.includes(this.registeredPosition) 
            || this.PositionsInIndexCardPositions(this.mazingRunPositions))
            && fmPlayer.stats["Dribbling"] >= 16
        ){
            this.indexCards += "P05 - Mazing Run" + "\n";
        }
        
        if (
            (this.pinPointPassPositions.includes(this.registeredPosition)
            || this.PositionsInIndexCardPositions(this.pinPointPassPositions))
            && fmPlayer.stats["Passing"] >= 16
        ){
            this.indexCards += "P06 - Pinpoint Pass" + "\n";
        }

        if(
            (this.earlyCrossPositions.includes(this.registeredPosition)
            || this.PositionsInIndexCardPositions(this.earlyCrossPositions))
            && fmPlayer.stats["Crossing"] >= 16
        ){
            this.indexCards += "P07 - Early Cross" + "\n";
        }

        if(
            (this.boxToBoxPositions.includes(this.registeredPosition)
            || this.PositionsInIndexCardPositions(this.boxToBoxPositions))
            && fmPlayer.stats["Work Rate"] >= 16
        ){
            this.indexCards += "P08 - Box to Box" + "\n";
        }

        if(
            (this.longRangerPositions.includes(this.registeredPosition)
            || this.PositionsInIndexCardPositions(this.longRangerPositions))
            && fmPlayer.stats["Long Shots"] >= 16
        ){
            this.indexCards += "P10 - Long Ranger" + "\n";
        }

        if(
            (this.enforcerPositions.includes(this.registeredPosition)
            || this.PositionsInIndexCardPositions(this.enforcerPositions))
            && fmPlayer.stats["Aggression"] >= 16
        ){
            this.indexCards += "P11 - Enforcer" + "\n";
        }

        if(
            (this.goalPoacherPositions.includes(this.registeredPosition)
            || this.PositionsInIndexCardPositions(this.goalPoacherPositions))
            && this.lines
        ){
            this.indexCards += "P12 - Goal Poacher" + "\n";
        }

        if(
            (this.freeRoamingPositions.includes(this.registeredPosition)
            || this.PositionsInIndexCardPositions(this.freeRoamingPositions))
            && this.lines
        ){
            this.indexCards += "P14 - Free Roaming" + "\n";
        }

        if(
            (this.talismanPositions.includes(this.registeredPosition)
            || this.PositionsInIndexCardPositions(this.talismanPositions))
            && fmPlayer.stats["Leadership"] >= 16
        ){
            this.indexCards += "P15 - Talisman" + "\n";
        }

        if(
            (this.trackBackPositions.includes(this.registeredPosition)
            || this.PositionsInIndexCardPositions(this.trackBackPositions))
            && fmPlayer.stats["Work Rate"] >= 16
        ){
            this.indexCards += "P18 - Track Back" + "\n";
        }

        if(
            this.oneTouchPass
        ){
            this.indexCards += "S01 - 1-Touch Play" + "\n";
        }

        if(
            this.outside
        ){
            this.indexCards += "S02 - Outside Curve" + "\n";
        }

        if(
            fmPlayer.stats["Long Throws"] >= 16
        ){
            this.indexCards += "S03 - Long Throw" + "\n";
        }

        if(
            Average([fmPlayer.stats["Long Shots"], fmPlayer.stats["Long Shots"]]) >= 16
        ){
            this.indexCards += "S05 - Speed Merchant" + "\n";
        }

        if(
            this.sliding
        ){
            this.indexCards += "S24 - Lunging Tackle" + "\n";
        }
    }
    
    PSDString(){
		return `Name: ${this.name}
Shirt Name: ${this.shirtName}
Nationality: ${this.nationality}
Age: ${clamp(15, 46, this.age)}
Foot: ${this.foot}
Side: ${this.favouredSide}
Positions: ${this.registeredPosition}*${this.positions.length>0 ? "," : "" }${this.positions}

APPEARANCE
Height: ${clamp(148, 205, this.height)} cm
Weight: ${clamp(40, 123, this.weight)} kg

TECHNIQUE
Attack: ${LimitStat99(this.attack)}
Defence: ${LimitStat99(this.defence)}
Header Accuracy: ${LimitStat99(this.header)}
Dribble Accuracy: ${LimitStat99(this.dribbleAccuracy)}
Short Pass Accuracy: ${LimitStat99(this.shortPassAccuracy)}
Short Pass Speed: ${LimitStat99(this.shortPassSpeed)}
Long Pass Accuracy: ${LimitStat99(this.longPassAccuracy)}
Long Pass Speed: ${LimitStat99(this.longPassSpeed)}
Shot Accuracy: ${LimitStat99(this.shotAccuracy)}
Place Kicking: ${LimitStat99(this.freeKickAccuracy)}
Swerve: ${LimitStat99(this.curling)}
Ball Controll: ${LimitStat99(this.technique)}
Goal Keeping Skills: ${LimitStat99(this.goalkeeping)}
Weak Foot Accuracy: ${this.weakFootAccuracy}
Weak Foot Frequency: ${this.weakFootFrequency}

SPEED
Response: ${LimitStat99(this.response)}
Explosive Power: ${LimitStat99(this.explosivePower)}
Dribble Speed: ${LimitStat99(this.dribbleSpeed)}
Top Speed: ${LimitStat99(this.topSpeed)}

PHYSICAL
Body Balance: ${LimitStat99(this.balance)}
Stamina: ${LimitStat99(this.stamina)}
Kicking Power: ${LimitStat99(this.shotPower)}
Jump: ${LimitStat99(this.jump)}
Injury Tolerance: ${this.injuryTolerance}

RESISTANCE
Attack Awareness: ${this.attackAwareness}
Defence Awareness: ${this.defenceAwareness}
Form: ${this.condition}
Tenacity: ${LimitStat99(this.tenacity)}
Teamwork: ${LimitStat99(this.teamwork)}

PLAYER INDEX CARDS
${this.indexCards}
`;
	}

}