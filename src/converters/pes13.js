"use strict";

/**
 * Converter producing PES 13 output (PSD text or CSV) from scraped FIFA or
 * Football Manager player data. Extends PESPlayer and adds PES13-specific
 * index cards, resistances, and CSV layout.
 */
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
    this.longRangerPositions = [
      "CB",
      "RB",
      "LB",
      "DMF",
      "CMF",
      "AMF",
      "RMF",
      "LMF",
    ];
    this.enforcerPositions = ["DMF", "CMF"];
    this.goalPoacherPositions = ["SS", "CF"];
    this.dummyRunnerPositions = ["SS", "CF"];
    this.freeRoamingPositions = ["CMF", "AMF", "RMF", "LMF"];
    this.talismanPositions = ["CMF", "RMF", "LMF", "AMF"];
    this.foxInTheBoxPositions = ["CF"];
    this.offensiveFullbackPositions = ["CB", "RB", "LB"];
    this.trackBackPositions = ["SS", "CF"];

    this.indexCards = "";

    this.explosivePower = 0;
    this.tenacity = 0;

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

    /** @type {number} */
    this.attackAwareness = 0;
    /** @type {number} */
    this.defenceAwareness = 0;
  }

  /**
   * Map a PES13 position code to its editor slot number.
   * @param {string} position - PES13 position code.
   * @returns {number} The slot number, or 0 when unmapped.
   */
  pes13PosToNum(position) {
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

  /**
   * Fill PES13 stats from a scraped SoFIFA player.
   * @param {FIFAPlayer} fifaPlayer
   * @returns {void}
   */
  fromFIFA17To23Player(fifaPlayer) {
    super.fromFIFA17To23Player(fifaPlayer);

    this.nationality =
      fifaPlayer.nationality in pes13Nationalities
        ? pes13Nationalities[fifaPlayer.nationality]
        : "Free Nationality";

    this.explosivePower = average([this.acceleration, this.agility]);
    this.tenacity = this.mentality;

    this.registeredPosition = fifaToPes21Positions(
      fifaPlayer.registeredPosition,
    );

    this.positions = [];

    for (let index = 0; index < fifaPlayer.positions.length; index++) {
      let pos = fifaToPes21Positions(fifaPlayer.positions[index]);
      if (!this.positions.includes(pos) && pos != this.registeredPosition) {
        this.positions.push(pos);
      }
    }

    this.attackAwareness = 2;
    this.defenceAwareness = 2;

    this.getIndexCardsFromSofifa(fifaPlayer);
  }

  /**
   * Derive the PES13 skill/play index cards from a SoFIFA player.
   * @param {FIFAPlayer} sofifaPlayer - The scraped SoFIFA player.
   * @returns {void}
   */
  getIndexCardsFromSofifa(sofifaPlayer) {
    if (
      (this.classicN10Positions.includes(this.registeredPosition) ||
        this.positionsInIndexCardPositions(this.classicN10Positions)) &&
      stringInArray(sofifaPlayer.playerSpecialties, SOFIFA_SPECIALITY.PLAYMAKER)
    ) {
      this.indexCards += "P01 - Classic No.10" + "\n";
      this.p01ClassicNo10 = 1;
    }

    if (
      (this.tricksterPositions.includes(this.registeredPosition) ||
        this.positionsInIndexCardPositions(this.tricksterPositions)) &&
      (stringInArray(sofifaPlayer.traits, SOFIFA_PLAYSTYLE.TRICKSTER) ||
        stringInArray(sofifaPlayer.traits, SOFIFA_PLAYSTYLE.TRICKSTER_PLUS))
    ) {
      this.indexCards += "P03 - Trickster" + "\n";
      this.p03Trickster = 1;
    }

    if (
      (this.dartingRunPositions.includes(this.registeredPosition) ||
        this.positionsInIndexCardPositions(this.dartingRunPositions)) &&
      stringInArray(sofifaPlayer.playerSpecialties, SOFIFA_SPECIALITY.SPEEDSTER)
    ) {
      this.indexCards += "P04 - Darting Run" + "\n";
      this.p04DartingRun = 1;
    }

    if (
      (this.mazingRunPositions.includes(this.registeredPosition) ||
        this.positionsInIndexCardPositions(this.mazingRunPositions)) &&
      (stringInArray(
        sofifaPlayer.playerSpecialties,
        SOFIFA_SPECIALITY.DRIBBLER,
      ) ||
        stringInArray(sofifaPlayer.traits, SOFIFA_PLAYSTYLE.TECHNICAL) ||
        stringInArray(sofifaPlayer.traits, SOFIFA_PLAYSTYLE.TECHNICAL_PLUS))
    ) {
      this.indexCards += "P05 - Mazing Run" + "\n";
      this.p05MazingRun = 1;
    }

    if (
      (this.pinPointPassPositions.includes(this.registeredPosition) ||
        this.positionsInIndexCardPositions(this.pinPointPassPositions)) &&
      (stringInArray(sofifaPlayer.traits, SOFIFA_PLAYSTYLE.LONG_BALL_PASS) ||
        stringInArray(
          sofifaPlayer.traits,
          SOFIFA_PLAYSTYLE.LONG_BALL_PASS_PLUS,
        ) ||
        stringInArray(sofifaPlayer.traits, SOFIFA_PLAYSTYLE.INCISIVE_PASS) ||
        stringInArray(sofifaPlayer.traits, SOFIFA_PLAYSTYLE.INCISIVE_PASS_PLUS))
    ) {
      this.indexCards += "P06 - Pinpoint Pass" + "\n";
      this.p06PinpointPass = 1;
    }

    if (
      (this.earlyCrossPositions.includes(this.registeredPosition) ||
        this.positionsInIndexCardPositions(this.earlyCrossPositions)) &&
      (stringInArray(
        sofifaPlayer.playerSpecialties,
        SOFIFA_SPECIALITY.CROSSER,
      ) ||
        stringInArray(sofifaPlayer.traits, SOFIFA_PLAYSTYLE.WHIPPED_CROSS) ||
        stringInArray(sofifaPlayer.traits, SOFIFA_PLAYSTYLE.WHIPPED_CROSS_PLUS))
    ) {
      this.indexCards += "P07 - Early Cross" + "\n";
      this.p07EarlyCross = 1;
    }

    if (
      (this.boxToBoxPositions.includes(this.registeredPosition) ||
        this.positionsInIndexCardPositions(this.boxToBoxPositions)) &&
      stringInArray(sofifaPlayer.playerSpecialties, SOFIFA_SPECIALITY.ENGINE)
    ) {
      this.indexCards += "P08 - Box to Box" + "\n";
      this.p08BoxToBox = 1;
    }

    if (
      (this.longRangerPositions.includes(this.registeredPosition) ||
        this.positionsInIndexCardPositions(this.longRangerPositions)) &&
      stringInArray(
        sofifaPlayer.playerSpecialties,
        SOFIFA_SPECIALITY.DISTANCE_SHOOTER,
      )
    ) {
      this.indexCards += "P10 - Long Ranger" + "\n";
      this.p10LongRanger = 1;
    }

    if (
      (this.goalPoacherPositions.includes(this.registeredPosition) ||
        this.positionsInIndexCardPositions(this.goalPoacherPositions)) &&
      stringInArray(sofifaPlayer.playerSpecialties, SOFIFA_SPECIALITY.POACHER)
    ) {
      this.indexCards += "P12 - Goal Poacher" + "\n";
      this.p12GoalPoacher = 1;
    }

    if (
      stringInArray(sofifaPlayer.traits, SOFIFA_PLAYSTYLE.FIRST_TOUCH) ||
      stringInArray(sofifaPlayer.traits, SOFIFA_PLAYSTYLE.FIRST_TOUCH_PLUS)
    ) {
      this.indexCards += "S01 - 1-Touch Play" + "\n";
      this.s01OneTouch = 1;
    }

    if (
      stringInArray(sofifaPlayer.traits, SOFIFA_PLAYSTYLE.TRIVELA) ||
      stringInArray(sofifaPlayer.traits, SOFIFA_PLAYSTYLE.TRIVELA_PLUS)
    ) {
      this.indexCards += "S02 - Outside Curve" + "\n";
      this.s02OutsideCurve = 1;
    }

    if (
      stringInArray(sofifaPlayer.traits, SOFIFA_PLAYSTYLE.LONG_THROW) ||
      stringInArray(sofifaPlayer.traits, SOFIFA_PLAYSTYLE.LONG_THROW_PLUS)
    ) {
      this.indexCards += "S03 - Long Throw" + "\n";
      this.s03LongThrow = 1;
    }

    if (
      stringInArray(sofifaPlayer.traits, SOFIFA_PLAYSTYLE.ACROBATIC) ||
      stringInArray(sofifaPlayer.traits, SOFIFA_PLAYSTYLE.ACROBATIC_PLUS)
    ) {
      this.indexCards += "S17 - Scissor Kick" + "\n";
      this.s17ScissorKick = 1;
    }

    if (
      stringInArray(sofifaPlayer.traits, SOFIFA_PLAYSTYLE.RAPID) ||
      stringInArray(sofifaPlayer.traits, SOFIFA_PLAYSTYLE.RAPID_PLUS)
    ) {
      this.indexCards += "S21 - Run Around" + "\n";
      this.s21RunAround = 1;
    }

    if (
      stringInArray(sofifaPlayer.traits, SOFIFA_PLAYSTYLE.SLIDE_TACKLE) ||
      stringInArray(sofifaPlayer.traits, SOFIFA_PLAYSTYLE.SLIDE_TACKLE_PLUS)
    ) {
      this.indexCards += "S24 - Lunging Tackle" + "\n";
      this.s24LungingTackle = 1;
    }

    if (
      this.registeredPosition === "GK" &&
      (stringInArray(sofifaPlayer.traits, SOFIFA_PLAYSTYLE.FAR_THROW) ||
        stringInArray(sofifaPlayer.traits, SOFIFA_PLAYSTYLE.FAR_THROW_PLUS))
    ) {
      this.indexCards += "S26 - GK Long Throw" + "\n";
      this.s26GkLongThrow = 1;
    }
  }

  /**
   * Fill PES13 stats from a scraped FMInside player.
   * @param {FMPlayer} fmPlayer
   * @returns {void}
   */
  fromFMPlayer(fmPlayer) {
    super.fromFMPlayer(fmPlayer);

    this.nationality =
      fmPlayer.nationality in pes13Nationalities
        ? pes13Nationalities[fmPlayer.nationality]
        : "Free Nationality";

    let FMPositions = fmPositionStringToArray(fmPlayer.info[FM_INFO.POSITIONS]);
    debugLog("pes13:fm", "positions", FMPositions);
    this.registeredPosition =
      FMPositions.includes("AMC") && FMPositions.includes("ST")
        ? "SS"
        : fmToPes21Positions(FMPositions[0]);
    this.positions = [];

    for (let index = 0; index < FMPositions.length; index++) {
      let pos = fmToPes21Positions(FMPositions[index]);
      if (this.registeredPosition != pos && !this.positions.includes(pos)) {
        this.positions.push(pos);
      }
    }

    this.explosivePower = average([
      fmToPesStat99(fmPlayer.stats[FM_STAT.ACCELERATION]),
      fmToPesStat99(fmPlayer.stats[FM_STAT.AGILITY]),
    ]);
    this.tenacity = average([
      fmToPesStat99(fmPlayer.stats[FM_STAT.LEADERSHIP]),
      fmToPesStat99(fmPlayer.stats[FM_STAT.DETERMINATION]),
    ]);

    let rushingOut = 0;
    let workRate = fmPlayer.stats[FM_STAT.WORK_RATE];

    try {
      rushingOut = fmPlayer.stats[FM_STAT.RUSHING_OUT_TENDENCY];
    } catch (error) {
      rushingOut = 0;
    }

    switch (this.registeredPosition) {
      case "GK":
        this.defenceAwareness = 2;
        if (rushingOut < 6) this.attackAwareness = 1;
        else if (rushingOut < 15) this.attackAwareness = 2;
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

    this.pes13GetIndexCardsFromFm(fmPlayer);
  }

  /**
   * Whether the player qualifies for an index card gated to these positions.
   * @param {string[]} IndexCardPositions - Positions allowed the card.
   * @returns {boolean} True if the player qualifies by position.
   */
  positionsInIndexCardPositions(IndexCardPositions) {
    for (let index = 0; index < this.positions.length; index++) {
      if (IndexCardPositions.includes(this.positions[index])) return true;
    }
    return false;
  }

  /**
   * Derive the PES13 skill/play index cards from a Football Manager player.
   * @param {FMPlayer} fmPlayer - The scraped FM player.
   * @returns {void}
   */
  pes13GetIndexCardsFromFm(fmPlayer) {
    if (
      (this.classicN10Positions.includes(this.registeredPosition) ||
        this.positionsInIndexCardPositions(this.classicN10Positions)) &&
      this.playmaking
    ) {
      this.indexCards += "P01 - Classic No.10" + "\n";
      this.p01ClassicNo10 = 1;
    }

    if (
      (this.anchorManPositions.includes(this.registeredPosition) ||
        this.positionsInIndexCardPositions(this.anchorManPositions)) &&
      fmPlayer.stats[FM_STAT.WORK_RATE] < 12
    ) {
      this.indexCards += "P02 - Anchor Man" + "\n";
      this.p02AnchorMan = 1;
    }

    if (
      (this.mazingRunPositions.includes(this.registeredPosition) ||
        this.positionsInIndexCardPositions(this.mazingRunPositions)) &&
      fmPlayer.stats[FM_STAT.DRIBBLING] >= 16
    ) {
      this.indexCards += "P05 - Mazing Run" + "\n";
      this.p05MazingRun = 1;
    }

    if (
      (this.pinPointPassPositions.includes(this.registeredPosition) ||
        this.positionsInIndexCardPositions(this.pinPointPassPositions)) &&
      fmPlayer.stats[FM_STAT.PASSING] >= 16
    ) {
      this.indexCards += "P06 - Pinpoint Pass" + "\n";
      this.p06PinpointPass = 1;
    }

    if (
      (this.earlyCrossPositions.includes(this.registeredPosition) ||
        this.positionsInIndexCardPositions(this.earlyCrossPositions)) &&
      fmPlayer.stats[FM_STAT.CROSSING] >= 16
    ) {
      this.indexCards += "P07 - Early Cross" + "\n";
      this.p07EarlyCross = 1;
    }

    if (
      (this.boxToBoxPositions.includes(this.registeredPosition) ||
        this.positionsInIndexCardPositions(this.boxToBoxPositions)) &&
      fmPlayer.stats[FM_STAT.WORK_RATE] >= 16
    ) {
      this.indexCards += "P08 - Box to Box" + "\n";
      this.p08BoxToBox = 1;
    }

    if (
      (this.longRangerPositions.includes(this.registeredPosition) ||
        this.positionsInIndexCardPositions(this.longRangerPositions)) &&
      fmPlayer.stats[FM_STAT.LONG_SHOTS] >= 16
    ) {
      this.indexCards += "P10 - Long Ranger" + "\n";
      this.p10LongRanger = 1;
    }

    if (
      (this.enforcerPositions.includes(this.registeredPosition) ||
        this.positionsInIndexCardPositions(this.enforcerPositions)) &&
      fmPlayer.stats[FM_STAT.AGGRESSION] >= 16
    ) {
      this.indexCards += "P11 - Enforcer" + "\n";
      this.p11Enforcer = 1;
    }

    if (
      (this.goalPoacherPositions.includes(this.registeredPosition) ||
        this.positionsInIndexCardPositions(this.goalPoacherPositions)) &&
      this.lines
    ) {
      this.indexCards += "P12 - Goal Poacher" + "\n";
      this.p12GoalPoacher = 1;
    }

    if (
      (this.freeRoamingPositions.includes(this.registeredPosition) ||
        this.positionsInIndexCardPositions(this.freeRoamingPositions)) &&
      this.lines
    ) {
      this.indexCards += "P14 - Free Roaming" + "\n";
      this.p14FreeRoaming = 1;
    }

    if (
      (this.talismanPositions.includes(this.registeredPosition) ||
        this.positionsInIndexCardPositions(this.talismanPositions)) &&
      fmPlayer.stats[FM_STAT.LEADERSHIP] >= 16
    ) {
      this.indexCards += "P15 - Talisman" + "\n";
      this.p15Talisman = 1;
    }

    if (
      (this.trackBackPositions.includes(this.registeredPosition) ||
        this.positionsInIndexCardPositions(this.trackBackPositions)) &&
      fmPlayer.stats[FM_STAT.WORK_RATE] >= 16
    ) {
      this.indexCards += "P18 - Track Back" + "\n";
      this.p18TrackBack = 1;
    }

    if (this.oneTouchPass) {
      this.indexCards += "S01 - 1-Touch Play" + "\n";
      this.s01OneTouch = 1;
    }

    if (this.outside) {
      this.indexCards += "S02 - Outside Curve" + "\n";
      this.s02OutsideCurve = 1;
    }

    if (fmPlayer.stats[FM_STAT.LONG_THROWS] >= 16) {
      this.indexCards += "S03 - Long Throw" + "\n";
      this.s03LongThrow = 1;
    }

    if (
      average([
        fmPlayer.stats[FM_STAT.LONG_SHOTS],
        fmPlayer.stats[FM_STAT.LONG_SHOTS],
      ]) >= 16
    ) {
      this.indexCards += "S05 - Speed Merchant" + "\n";
      this.s05SpeedMerchant = 1;
    }

    if (this.sliding) {
      this.indexCards += "S24 - Lunging Tackle" + "\n";
      this.s24LungingTackle = 1;
    }
  }

  /**
   * Render the player as PSD clipboard text.
   * @returns {string} The PSD text block.
   */
  psdString() {
    return `Name: ${this.name}
Shirt Name: ${this.shirtName}
Nationality: ${this.nationality}
Age: ${clamp(15, 46, this.age)}
Foot: ${this.foot}
Side: ${this.favouredSide}
Positions: ${this.registeredPosition}*${this.positions.length > 0 ? "," : ""}${
      this.positions
    }

APPEARANCE
Height: ${clamp(148, 205, this.height)} cm
Weight: ${clamp(40, 123, this.weight)} kg

TECHNIQUE
Attack: ${limitStat99(this.attack)}
Defence: ${limitStat99(this.defence)}
Header Accuracy: ${limitStat99(this.header)}
Dribble Accuracy: ${limitStat99(this.dribbleAccuracy)}
Short Pass Accuracy: ${limitStat99(this.shortPassAccuracy)}
Short Pass Speed: ${limitStat99(this.shortPassSpeed)}
Long Pass Accuracy: ${limitStat99(this.longPassAccuracy)}
Long Pass Speed: ${limitStat99(this.longPassSpeed)}
Shot Accuracy: ${limitStat99(this.shotAccuracy)}
Place Kicking: ${limitStat99(this.freeKickAccuracy)}
Swerve: ${limitStat99(this.curling)}
Ball Controll: ${limitStat99(this.technique)}
Goal Keeping Skills: ${limitStat99(this.goalkeeping)}
Weak Foot Accuracy: ${this.weakFootAccuracy}
Weak Foot Frequency: ${this.weakFootFrequency}

SPEED
Response: ${limitStat99(this.response)}
Explosive Power: ${limitStat99(this.explosivePower)}
Dribble Speed: ${limitStat99(this.dribbleSpeed)}
Top Speed: ${limitStat99(this.topSpeed)}

PHYSICAL
Body Balance: ${limitStat99(this.balance)}
Stamina: ${limitStat99(this.stamina)}
Kicking Power: ${limitStat99(this.shotPower)}
Jump: ${limitStat99(this.jump)}
Injury Tolerance: ${this.injuryTolerance}

RESISTANCE
Attack Awareness: ${this.attackAwareness}
Defence Awareness: ${this.defenceAwareness}
Form: ${this.condition}
Tenacity: ${limitStat99(this.tenacity)}
Teamwork: ${limitStat99(this.teamwork)}

PLAYER INDEX CARDS
${this.indexCards}
`;
  }

  /**
   * Render the player as a single PES13 CSV row.
   * @returns {string} The comma-separated row.
   */
  csvString() {
    this.positions.forEach((position) => {
      let index = this.pes13PosToNum(position);
      this.positionsNumbers[index] = 1;
    });
    let regPosIndex = this.pes13PosToNum(this.registeredPosition);
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
${limitStat99(this.attack)},\
${limitStat99(this.defence)},\
${limitStat99(this.header)},\
${limitStat99(this.dribbleAccuracy)},\
${limitStat99(this.shortPassAccuracy)},\
${limitStat99(this.shortPassSpeed)},\
${limitStat99(this.longPassAccuracy)},\
${limitStat99(this.longPassSpeed)},\
${limitStat99(this.shotAccuracy)},\
${limitStat99(this.freeKickAccuracy)},\
${limitStat99(this.curling)},\
${limitStat99(this.technique)},\
${limitStat99(this.goalkeeping)},\
${limitStat99(this.response)},\
${limitStat99(this.explosivePower)},\
${limitStat99(this.dribbleSpeed)},\
${limitStat99(this.topSpeed)},\
${limitStat99(this.balance)},\
${limitStat99(this.stamina)},\
${limitStat99(this.shotPower)},\
${limitStat99(this.jump)},\
${limitStat99(this.tenacity)},\
${limitStat99(this.teamwork)},\
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
