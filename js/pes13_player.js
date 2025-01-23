class PES13Player extends PESPlayer {

  constructor() {
    super();

    this.positionsNumbers = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

    this.classicN10Positions = ["CMF", "AMF"];
    this.anchorManPositions = ["DMF", "CMF"];
    this.tricksterPositions = ["RMF", "LMF", "RWF", "LWF", "SS"];
    this.dartingRunPositions = ["RMF", "LMF", "RWF", "LWF", "SS"];
    this.mazingRunPositions = ["RMF", "LMF", "RWF", "LWF", "SS"];
    this.pinPointPassPositions = ["CB", "RB", "LB", "DMF", "CMF"];
    this.earlyCrossPositions = ["RB", "LB", "RMF", "LMF", "RWF", "LWF"];
    this.boxToBoxPositions = ["DMF", "CMF", "RMF", "LMF", "AMF"];
    this.incisiveRunPositions = ["RB", "LB", "RMF", "LMF", "RWF", "LWF"];
    this.longRangerPositions = ["CB", "RB", "LB", "DMF", "CMF", "AMF", "RMF", "LMF"];
    this.enforcerPositions = ["DMF", "CMF"];
    this.goalPoacherPositions = ["SS", "CF"];
    this.dummyRunnerPositions = ["SS", "CF"];
    this.freeRoamingPositions = ["CMF", "AMF", "RMF", "LMF"];
    this.talismanPositions = ["CMF", "RMF", "LMF", "AMF"];
    this.foxInTheBoxPositions = ["CF"];
    this.offensiveFullbackPositions = ["CB", "RB", "LB"];
    this.trackBackPositions = ["SS", "CF"];

    this.indexCards = "";

    this.s01OneTouch = 0;
    this.s02OutsideCurve = 0;
    this.s03LongThrow = 0;
    this.s04SuperSub = 0;
    this.s05SpeedMerchant = 0;
    this.s06LongRangeDrive = 0;
    this.s07ShoulderFeintSkills = 0;
    this.s08TurningSkills = 0;
    this.s09RouletteSkills = 0;
    this.s10FlipFlapSkills = 0;
    this.s11FlickingSkills = 0;
    this.s12ScissorsSkills = 0;
    this.s13StepOnSkills = 0;
    this.s14DeftTouchSkills = 0;
    this.s15KnuckleShot = 0;
    this.s16JumpingVolley = 0;
    this.s17ScissorKick = 0;
    this.s18HeelFlick = 0;
    this.s19WeightedPass = 0;
    this.s20DoubleTouch = 0;
    this.s21RunAround = 0;
    this.s22Sombrero = 0;
    this.s23Drag180 = 0;
    this.s24LungingTackle = 0;
    this.s25DivingHeader = 0;
    this.s26GkLongThrow = 0;
    this.p01ClassicNo10 = 0;
    this.p02AnchorMan = 0;
    this.p03Trickster = 0;
    this.p04DartingRun = 0;
    this.p05MazingRun = 0;
    this.p06PinpointPass = 0;
    this.p07EarlyCross = 0;
    this.p08BoxToBox = 0;
    this.p09IncisiveRun = 0;
    this.p10LongRanger = 0;
    this.p11Enforcer = 0;
    this.p12GoalPoacher = 0;
    this.p13DummyRunner = 0;
    this.p14FreeRoaming = 0;
    this.p15Talisman = 0;
    this.p16FoxInTheBox = 0;
    this.p17OffensiveSideback = 0;
    this.p18TrackBack = 0;

  }

  PES13PosToNum(position) {
    switch (position) {
      case "GK":
        return 0;
      case "SW":
        return 1;
      case "CB":
        return 2;
      case "LB":
        return 3;
      case "RB":
        return 4;
      case "DMF":
        return 5;
      case "CMF":
        return 6;
      case "LMF":
        return 7;
      case "RMF":
        return 8;
      case "AMF":
        return 9;
      case "LWF":
        return 10;
      case "RWF":
        return 11;
      case "SS":
        return 12;
      case "CF":
        return 13;
      default:
        return 0;
    }
  }


  FromFMPlayer(fmPlayer) {
    super.FromFMPlayer(fmPlayer);

    let FMPositions = FMPositionStringToArray(fmPlayer.info["Position(s)"]);
    console.log(FMPositions);
    this.registeredPosition = FMPositions.includes("AMC") && FMPositions.includes("ST") ? "SS" : FMToPES21Positions(FMPositions[0]);
    this.positions = [];

    for (let index = 0; index < FMPositions.length; index++) {
      let pos = FMToPES21Positions(FMPositions[index]);
      if (this.registeredPosition != pos && !(this.positions.includes(pos))) {
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

  PositionsInIndexCardPositions(IndexCardPositions) {
    for (let index = 0; index < this.positions.length; index++) {
      if (IndexCardPositions.includes(this.positions[index]))
        return true;
    }
    return false;
  }

  PES13GetIndexCardsFromFM(fmPlayer) {

    if (
      (this.classicN10Positions.includes(this.registeredPosition)
        || this.PositionsInIndexCardPositions(this.classicN10Positions))
      && this.playmaking
    ) {
      this.indexCards += "P01 - Classic No.10" + "\n";
      this.p01ClassicNo10 = 1;
    }

    if (
      (this.anchorManPositions.includes(this.registeredPosition)
        || this.PositionsInIndexCardPositions(this.anchorManPositions))
      && fmPlayer.stats["Work Rate"] < 12
    ) {
      this.indexCards += "P02 - Anchor Man" + "\n";
      this.p02AnchorMan = 1;
    }

    if (
      (this.mazingRunPositions.includes(this.registeredPosition)
        || this.PositionsInIndexCardPositions(this.mazingRunPositions))
      && fmPlayer.stats["Dribbling"] >= 16
    ) {
      this.indexCards += "P05 - Mazing Run" + "\n";
      this.p05MazingRun = 1;
    }

    if (
      (this.pinPointPassPositions.includes(this.registeredPosition)
        || this.PositionsInIndexCardPositions(this.pinPointPassPositions))
      && fmPlayer.stats["Passing"] >= 16
    ) {
      this.indexCards += "P06 - Pinpoint Pass" + "\n";
      this.p06PinpointPass = 1;
    }

    if (
      (this.earlyCrossPositions.includes(this.registeredPosition)
        || this.PositionsInIndexCardPositions(this.earlyCrossPositions))
      && fmPlayer.stats["Crossing"] >= 16
    ) {
      this.indexCards += "P07 - Early Cross" + "\n";
      this.p07EarlyCross = 1;
    }

    if (
      (this.boxToBoxPositions.includes(this.registeredPosition)
        || this.PositionsInIndexCardPositions(this.boxToBoxPositions))
      && fmPlayer.stats["Work Rate"] >= 16
    ) {
      this.indexCards += "P08 - Box to Box" + "\n";
      this.p08BoxToBox = 1;
    }

    if (
      (this.longRangerPositions.includes(this.registeredPosition)
        || this.PositionsInIndexCardPositions(this.longRangerPositions))
      && fmPlayer.stats["Long Shots"] >= 16
    ) {
      this.indexCards += "P10 - Long Ranger" + "\n";
      this.p10LongRanger = 1;
    }

    if (
      (this.enforcerPositions.includes(this.registeredPosition)
        || this.PositionsInIndexCardPositions(this.enforcerPositions))
      && fmPlayer.stats["Aggression"] >= 16
    ) {
      this.indexCards += "P11 - Enforcer" + "\n";
      this.p11Enforcer = 1;
    }

    if (
      (this.goalPoacherPositions.includes(this.registeredPosition)
        || this.PositionsInIndexCardPositions(this.goalPoacherPositions))
      && this.lines
    ) {
      this.indexCards += "P12 - Goal Poacher" + "\n";
      this.p12GoalPoacher = 1;
    }

    if (
      (this.freeRoamingPositions.includes(this.registeredPosition)
        || this.PositionsInIndexCardPositions(this.freeRoamingPositions))
      && this.lines
    ) {
      this.indexCards += "P14 - Free Roaming" + "\n";
      this.p14FreeRoaming = 1;
    }

    if (
      (this.talismanPositions.includes(this.registeredPosition)
        || this.PositionsInIndexCardPositions(this.talismanPositions))
      && fmPlayer.stats["Leadership"] >= 16
    ) {
      this.indexCards += "P15 - Talisman" + "\n";
      this.p15Talisman = 1;
    }

    if (
      (this.trackBackPositions.includes(this.registeredPosition)
        || this.PositionsInIndexCardPositions(this.trackBackPositions))
      && fmPlayer.stats["Work Rate"] >= 16
    ) {
      this.indexCards += "P18 - Track Back" + "\n";
      this.p18TrackBack = 1;
    }

    if (
      this.oneTouchPass
    ) {
      this.indexCards += "S01 - 1-Touch Play" + "\n";
      this.s01OneTouch = 1;
    }

    if (
      this.outside
    ) {
      this.indexCards += "S02 - Outside Curve" + "\n";
      this.s02OutsideCurve = 1;
    }

    if (
      fmPlayer.stats["Long Throws"] >= 16
    ) {
      this.indexCards += "S03 - Long Throw" + "\n";
      this.s03LongThrow = 1;
    }

    if (
      Average([fmPlayer.stats["Long Shots"], fmPlayer.stats["Long Shots"]]) >= 16
    ) {
      this.indexCards += "S05 - Speed Merchant" + "\n";
      this.s05SpeedMerchant = 1;
    }

    if (
      this.sliding
    ) {
      this.indexCards += "S24 - Lunging Tackle" + "\n";
      this.s24LungingTackle = 1;
    }
  }

  PSDString() {
    return `Name: ${this.name}
Shirt Name: ${this.shirtName}
Nationality: ${this.nationality}
Age: ${clamp(15, 46, this.age)}
Foot: ${this.foot}
Side: ${this.favouredSide}
Positions: ${this.registeredPosition}*${this.positions.length > 0 ? "," : ""}${this.positions}

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

  CSVString() {

    this.positions.forEach(position => {
      let index = this.PES13PosToNum(position);
      this.positionsNumbers[index] = 1;
    });
    let regPosIndex = this.PES13PosToNum(this.registeredPosition);
    this.positionsNumbers[regPosIndex] = 1;

    return `,\
${this.name},\
${this.shirtName},\
${this.name},\
2,\
0,\
${clamp(15, 46, this.age)},\
${this.nation},\
${this.foot},\
${clamp(40, 123, this.weight)},\
${clamp(148, 205, this.height)},\
${this.condition},\
${this.weakFootAccuracy},\
${this.weakFootFrequency},\
${this.injuryTolerance},\
1,\
0,\
${this.positionsNumbers},\
${this.registeredPosition},\
${LimitStat99(this.attack)},\
${LimitStat99(this.defence)},\
${LimitStat99(this.header)},\
${LimitStat99(this.dribbleAccuracy)},\
${LimitStat99(this.shortPassAccuracy)},\
${LimitStat99(this.shortPassSpeed)},\
${LimitStat99(this.longPassAccuracy)},\
${LimitStat99(this.longPassSpeed)},\
${LimitStat99(this.shotAccuracy)},\
${LimitStat99(this.freeKickAccuracy)},\
${LimitStat99(this.curling)},\
${LimitStat99(this.technique)},\
${LimitStat99(this.goalkeeping)},\
${LimitStat99(this.response)},\
${LimitStat99(this.explosivePower)},\
${LimitStat99(this.dribbleSpeed)},\
${LimitStat99(this.topSpeed)},\
${LimitStat99(this.balance)},\
${LimitStat99(this.stamina)},\
${LimitStat99(this.shotPower)},\
${LimitStat99(this.jump)},\
${LimitStat99(this.tenacity)},\
${LimitStat99(this.teamwork)},\
${this.s01OneTouch},\
${this.s02OutsideCurve},\
${this.s03LongThrow},\
${this.s04SuperSub},\
${this.s05SpeedMerchant},\
${this.s06LongRangeDrive},\
${this.s07ShoulderFeintSkills},\
${this.s08TurningSkills},\
${this.s09RouletteSkills},\
${this.s10FlipFlapSkills},\
${this.s11FlickingSkills},\
${this.s12ScissorsSkills},\
${this.s13StepOnSkills},\
${this.s14DeftTouchSkills},\
${this.s15KnuckleShot},\
${this.s16JumpingVolley},\
${this.s17ScissorKick},\
${this.s18HeelFlick},\
${this.s19WeightedPass},\
${this.s20DoubleTouch},\
${this.s21RunAround},\
${this.s22Sombrero},\
${this.s23Drag180},\
${this.s24LungingTackle},\
${this.s25DivingHeader},\
${this.s26GkLongThrow},\
${this.p01ClassicNo10},\
${this.p02AnchorMan},\
${this.p03Trickster},\
${this.p04DartingRun},\
${this.p05MazingRun},\
${this.p06PinpointPass},\
${this.p07EarlyCross},\
${this.p08BoxToBox},\
${this.p09IncisiveRun},\
${this.p10LongRanger},\
${this.p11Enforcer},\
${this.p12GoalPoacher},\
${this.p13DummyRunner},\
${this.p14FreeRoaming},\
${this.p15Talisman},\
${this.p16FoxInTheBox},\
${this.p17OffensiveSideback},\
${this.p18TrackBack},\
${this.attackAwareness},\
${this.defenceAwareness},\
1,\
1,\
Default,\
0,\
131,\
0,\
4317,\
0,\
0,\
0,\
0,\
1,\
1,\
1,\
1,\
0,\
0,\
,\
99,`;
  }

}