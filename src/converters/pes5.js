"use strict";

/**
 * Converter producing old-gen PES 5 output (PSD text or CSV) from scraped
 * FIFA, Football Manager, or eFootball player data.
 */
class PESPlayer {
  constructor() {
    this.expValue = 1.179;
    this.expIdValue = 1.405;
    this.specialAbilitiesString = "";
    this.positioningPositions = ["SS", "CF"];
    this.reactionPositions = ["SB", "WB", "SMF", "AMF", "WF", "SS", "CF"];
    this.playmakingPositions = ["DMF", "SMF", "AMF", "SS"];
    this.passingPositions = ["WB", "DMF", "SMF", "AMF", "WF", "SS"];
    this.scoringPositions = ["SS", "CF"];
    this.oneOnOneScoringPositions = ["WF", "SS", "CF"];
    this.postPlayerPositions = ["CF"];
    this.linesPositions = ["WF", "SS", "CF"];
    this.middleShootingPositions = ["DMF", "SMF", "AMF", "SS", "CF"];
    this.oneTouchPassPositions = ["AMF", "SS", "CF"];
    this.markingPositions = ["CBT", "CWP", "SB", "WB", "DMF"];
    this.slidingPositions = ["CBT", "CWP", "SB", "WB", "DMF"];
    this.coveringPositions = ["CBT", "CWP", "SB", "WB", "DMF"];
    this.dLineControlPositions = ["CBT", "CWP"];
    this.longThrowPositions = ["SB", "WB"];
    /** @type {string[]} */
    this.positions = [];
    this.positionsNumbers = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    this.height = 0;
    this.weight = 0;
    this.response = 0;
    this.agility = 0;
    this.dribbleSpeed = 0;
    this.shortPassSpeed = 0;
    this.longPassSpeed = 0;
    this.shotTechnique = 0;
    this.aggression = 0;
    this.mentality = 0;
    this.goalkeeping = 0;
    this.teamwork = 0;

    /** @type {number} */
    this.acceleration = 0;
    /** @type {number} */
    this.age = 0;
    /** @type {number} */
    this.attack = 0;
    /** @type {number} */
    this.balance = 0;
    /** @type {number} */
    this.centre = 0;
    /** @type {number} */
    this.condition = 0;
    /** @type {number} */
    this.consistency = 0;
    /** @type {number} */
    this.covering = 0;
    /** @type {number} */
    this.curling = 0;
    /** @type {number} */
    this.defence = 0;
    /** @type {number} */
    this.dLineControl = 0;
    /** @type {number} */
    this.dribbleAccuracy = 0;
    /** @type {number} */
    this.dribbling = 0;
    /** @type {string} */
    this.favouredSide = "";
    /** @type {string} */
    this.foot = "";
    /** @type {number} */
    this.freeKickAccuracy = 0;
    /** @type {number} */
    this.header = 0;
    /** @type {string} */
    this.injuryTolerance = "";
    /** @type {number} */
    this.jump = 0;
    /** @type {number} */
    this.lines = 0;
    /** @type {number} */
    this.longPassAccuracy = 0;
    /** @type {number} */
    this.longThrow = 0;
    /** @type {number} */
    this.marking = 0;
    /** @type {number} */
    this.middleShooting = 0;
    /** @type {string} */
    this.name = "";
    /** @type {string} */
    this.nation = "";
    /** @type {string} */
    this.nationality = "";
    /** @type {number} */
    this.oneOnOneScoring = 0;
    /** @type {number} */
    this.oneOnOneStopper = 0;
    /** @type {number} */
    this.oneTouchPass = 0;
    /** @type {number} */
    this.outside = 0;
    /** @type {number} */
    this.passing = 0;
    /** @type {number} */
    this.penalties = 0;
    /** @type {number} */
    this.penaltyStopper = 0;
    /** @type {number} */
    this.playmaking = 0;
    /** @type {number} */
    this.positioning = 0;
    /** @type {number} */
    this.postPlayer = 0;
    /** @type {number} */
    this.reaction = 0;
    /** @type {string} */
    this.registeredPosition = "";
    /** @type {number} */
    this.scoring = 0;
    /** @type {string} */
    this.shirtName = "";
    /** @type {number} */
    this.shortPassAccuracy = 0;
    /** @type {number} */
    this.shotAccuracy = 0;
    /** @type {number} */
    this.shotPower = 0;
    /** @type {number} */
    this.side = 0;
    /** @type {number} */
    this.sliding = 0;
    /** @type {number} */
    this.stamina = 0;
    /** @type {number} */
    this.tacticalDribble = 0;
    /** @type {number} */
    this.technique = 0;
    /** @type {number} */
    this.topSpeed = 0;
    /** @type {number} */
    this.weakFootAccuracy = 0;
    /** @type {number} */
    this.weakFootFrequency = 0;
  }

  /**
   * Map a FIFA/eFootball position code to its PES5 equivalent.
   * @param {string} position - Source position code.
   * @returns {string} The PES5 position code, or `position` when unmapped.
   */
  convertPosition(position) {
    switch (position) {
      case "GK":
        return "GK";
      case "CB":
        return "CBT";
      case "LB":
      case "RB":
        return "SB";
      case "CDM":
        return "DMF";
      case "LWB":
      case "RWB":
        return "WB";
      case "CM":
        return "CMF";
      case "LM":
      case "RM":
        return "SMF";
      case "CAM":
        return "AMF";
      case "LW":
      case "RW":
        return "WF";
      case "LF":
      case "RF":
      case "LS":
      case "RS":
      case "CF":
        return "SS";
      case "ST":
        return "CF";
      default:
        return position;
    }
  }

  /**
   * Map a PES5 position code to its editor slot number.
   * @param {string} position - PES5 position code.
   * @returns {number} The slot number, or 0 when unmapped.
   */
  pes5PosToNum(position) {
    switch (position) {
      case "GK":
        return 0;
      case "CWP":
        return 2;
      case "CBT":
        return 3;
      case "SB":
        return 4;
      case "DMF":
        return 5;
      case "WB":
        return 6;
      case "CMF":
        return 7;
      case "SMF":
        return 8;
      case "AMF":
        return 9;
      case "WF":
        return 10;
      case "SS":
        return 11;
      case "CF":
        return 12;
      default:
        return 0;
    }
  }

  /**
   * Set the position bit flags from `positions` and `registeredPosition`.
   * @returns {void}
   */
  pes5EnablePositions() {
    this.positions.forEach((position) => {
      let index = this.pes5PosToNum(position);
      if (index > 0) {
        index--;
      }
      this.positionsNumbers[index] = 1;
    });
    let regPosIndex = this.pes5PosToNum(this.registeredPosition);
    if (regPosIndex > 0) {
      regPosIndex--;
    }
    this.positionsNumbers[regPosIndex] = 1;
  }

  /**
   * Build the PES5 shirt name (flattened and space-padded).
   * @param {string} name - Full player name.
   * @returns {string} The formatted shirt name.
   */
  nameToShirtName(name) {
    // PES5/13 shirt names are flattened AND padded for the on-screen editor.
    return formatPes5ShirtName(shirtName(name));
  }

  /**
   * Map an average stat value to a PES5 consistency rating.
   * @param {number} average - The player's average stat value.
   * @returns {number} A consistency rating (3-8).
   */
  calculateConsistency(average) {
    if (average > 93) return 8;
    else if (average > 86) return 7;
    else if (average > 80) return 6;
    else if (average > 69) return 5;
    else if (average > 60) return 4;
    else return 3;
  }

  /**
   * Map an average stat value to a PES5 condition rating.
   * @param {number} average - The player's average stat value.
   * @returns {number} A condition rating (3-8).
   */
  calculateCondition(average) {
    if (average > 93) return 8;
    else if (average > 86) return 7;
    else if (average > 80) return 6;
    else if (average > 69) return 5;
    else if (average > 60) return 4;
    else return 3;
  }

  /**
   * Map a FIFA weak-foot rating to a PES5 weak-foot rating.
   * @param {number} weakFoot - FIFA weak-foot rating (1-5).
   * @param {number} average - The player's average stat value.
   * @returns {number} A PES5 weak-foot rating (1-8).
   */
  getWeakFoot(weakFoot, average) {
    if (weakFoot == 5) return 8;
    else if (weakFoot == 4 && average >= 85) return 7;
    else if (weakFoot == 4) return 6;
    else if (weakFoot == 3) return 5;
    else if (weakFoot == 2 && average >= 65) return 4;
    else if (weakFoot == 2) return 3;
    else if (weakFoot == 1) return 2;
    else return 1;
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
Injury Tolerance: ${this.injuryTolerance}

APPEARANCE:
Height: ${clamp(148, 205, this.height)} cm
Weight: ${clamp(40, 123, this.weight)} kg

STATS:
Attack: ${limitStat99(this.attack)}
Defence: ${limitStat99(this.defence)}
Balance: ${limitStat99(this.balance)}
Stamina: ${limitStat99(this.stamina)}
Top Speed: ${limitStat99(this.topSpeed)}
Acceleration: ${limitStat99(this.acceleration)}
Response: ${limitStat99(this.response)}
Agility: ${limitStat99(this.agility)}
Dribble Accuracy: ${limitStat99(this.dribbleAccuracy)}
Dribble Speed: ${limitStat99(this.dribbleSpeed)}
Short Pass Accuracy: ${limitStat99(this.shortPassAccuracy)}
Short Pass Speed: ${limitStat99(this.shortPassSpeed)}
Long Pass Accuracy: ${limitStat99(this.longPassAccuracy)}
Long Pass Speed: ${limitStat99(this.longPassSpeed)}
Shot Accuracy: ${limitStat99(this.shotAccuracy)}
Shot Power: ${limitStat99(this.shotPower)}
Shot Technique: ${limitStat99(this.shotTechnique)}
Free Kick Accuracy: ${limitStat99(this.freeKickAccuracy)}
Curling: ${limitStat99(this.curling)}
Header: ${limitStat99(this.header)}
Jump: ${limitStat99(this.jump)}
Technique: ${limitStat99(this.technique)}
Aggression: ${limitStat99(this.aggression)}
Mentality: ${limitStat99(this.mentality)}
Keeper Skills: ${limitStat99(this.goalkeeping)}
Teamwork: ${limitStat99(this.teamwork)}
Consistency: ${this.consistency}
Condition/Fitness: ${this.condition}
Weak Foot Accuracy: ${this.weakFootAccuracy}
Weak Foot Frequency: ${this.weakFootFrequency}

SPECIAL ABILITIES:
${this.specialAbilitiesString}
`;
  }

  /**
   * Render the player as a single PES5 CSV row.
   * @returns {string} The comma-separated row.
   */
  csvString() {
    let regPos = this.pes5PosToNum(this.registeredPosition);
    this.pes5EnablePositions();
    let positions = this.positionsNumbers.join(",");
    return `,${this.name},\
${this.shirtName},\
${this.nation},\
${clamp(15, 46, this.age)},\
${this.foot},\
${this.injuryTolerance},\
${regPos},\
${this.favouredSide},\
${positions},\
${limitStat99(this.attack)},\
${limitStat99(this.defence)},\
${limitStat99(this.balance)},\
${limitStat99(this.stamina)},\
${limitStat99(this.topSpeed)},\
${limitStat99(this.acceleration)},\
${limitStat99(this.response)},\
${limitStat99(this.agility)},\
${limitStat99(this.dribbleAccuracy)},\
${limitStat99(this.dribbleSpeed)},\
${limitStat99(this.shortPassAccuracy)},\
${limitStat99(this.shortPassSpeed)},\
${limitStat99(this.longPassAccuracy)},\
${limitStat99(this.longPassSpeed)},\
${limitStat99(this.shotAccuracy)},\
${limitStat99(this.shotPower)},\
${limitStat99(this.shotTechnique)},\
${limitStat99(this.freeKickAccuracy)},\
${limitStat99(this.curling)},\
${limitStat99(this.header)},\
${limitStat99(this.jump)},\
${limitStat99(this.technique)},\
${limitStat99(this.aggression)},\
${limitStat99(this.mentality)},\
${limitStat99(this.goalkeeping)},\
${limitStat99(this.teamwork)},\
${this.consistency},\
${this.condition},\
${this.weakFootAccuracy},\
${this.weakFootFrequency},\
${this.dribbling},\
${this.tacticalDribble},\
${this.positioning},\
${this.reaction},\
${this.playmaking},\
${this.passing},\
${this.scoring},\
${this.oneOnOneScoring},\
${this.postPlayer},\
${this.lines},\
${this.middleShooting},\
${this.side},\
${this.centre},\
${this.penalties},\
${this.oneTouchPass},\
${this.outside},\
${this.marking},\
${this.sliding},\
${this.covering},\
${this.dLineControl},\
${this.penaltyStopper},\
${this.oneOnOneStopper},\
${this.longThrow},\
${clamp(148, 205, this.height)},\
${clamp(40, 123, this.weight)}`;
  }

  /**
   * Fill PES5 stats from a scraped SoFIFA player.
   * @param {FIFAPlayer} fifaPlayer
   * @returns {void}
   */
  fromFIFA17To23Player(fifaPlayer) {
    this.registeredPosition = this.convertPosition(
      fifaPlayer.registeredPosition,
    );
    this.positions = [];
    let sidePositions = ["RW", "LW", "RM", "LM", "RWB", "LWB", "RB", "LB"];
    let sideCounter = 0;
    for (let index = 0; index < fifaPlayer.positions.length; index++) {
      if (sidePositions.includes(fifaPlayer.positions[index])) sideCounter++;
      if (fifaPlayer.positions[index] != fifaPlayer.registeredPosition)
        this.positions.push(this.convertPosition(fifaPlayer.positions[index]));
    }
    this.name = fifaPlayer.name;
    this.shirtName = this.nameToShirtName(this.name);
    this.age = fifaPlayer.age;
    this.nation = fifaPlayer.nationality;
    this.nationality =
      fifaPlayer.nationality in pesIndieNationalities
        ? pesIndieNationalities[fifaPlayer.nationality]
        : "Free Nationality";
    this.foot = fifaPlayer.preferedFoot == "Right" ? "R" : "L";
    this.favouredSide = getFavSide(fifaPlayer.positions, false);

    this.height = fifaPlayer.height;
    this.weight = fifaPlayer.weight;

    this.injuryTolerance = "B";
    if (
      stringInArray(fifaPlayer.traits, SOFIFA_TRAIT.SOLID_PLAYER) ||
      stringInArray(fifaPlayer.traits, SOFIFA_TRAIT.INJURY_FREE)
    ) {
      this.injuryTolerance = "A";
    } else if (stringInArray(fifaPlayer.traits, SOFIFA_TRAIT.INJURY_PRONE)) {
      this.injuryTolerance = "C";
    }

    this.consistency = this.calculateConsistency(
      average([fifaPlayer.power[SOFIFA_POWER.STAMINA], fifaPlayer.overall]),
    );
    this.condition = this.calculateCondition(
      average([
        fifaPlayer.power[SOFIFA_POWER.STAMINA],
        fifaPlayer.mentality[SOFIFA_MENTALITY.COMPOSURE],
      ]),
    );

    this.weakFootFrequency = this.getWeakFoot(
      fifaPlayer.weakFoot,
      average([
        fifaPlayer.movement[SOFIFA_MOVEMENT.BALANCE],
        fifaPlayer.mentality[SOFIFA_MENTALITY.COMPOSURE],
      ]),
    );
    this.weakFootAccuracy = this.getWeakFoot(
      fifaPlayer.weakFoot,
      average([
        fifaPlayer.skill[SOFIFA_SKILL.DRIBBLING],
        fifaPlayer.skill[SOFIFA_SKILL.BALL_CONTROL],
        fifaPlayer.mentality[SOFIFA_MENTALITY.VISION],
      ]),
    );

    if (this.registeredPosition == "GK") {
      // conversion formula for GK
      let positioning = atLeast(
        fifaPlayer.mentality[SOFIFA_MENTALITY.ATTACK_POSITION],
        30,
      );
      let attackEXP = positioning;
      this.attack = 10 + divideIntegers(attackEXP, this.expIdValue);

      let gkPositioning = atLeast(
        fifaPlayer.goalkeeping[SOFIFA_GOALKEEPING.GK_POSITIONING],
        60,
      );
      let gkDiving = atLeast(
        fifaPlayer.goalkeeping[SOFIFA_GOALKEEPING.GK_DIVING],
        60,
      );
      let defenceEXP =
        average([gkPositioning, gkDiving]) + fifaPlayer.internationalReputation;
      this.defence = 25 + divideIntegers(defenceEXP, this.expIdValue);

      let strenght = atLeast(fifaPlayer.power[SOFIFA_POWER.STRENGTH], 60);
      let heightEXP = this.height - 100;
      let balanceEXP = strenght * 0.1 + gkPositioning * 0.3 + heightEXP * 0.6;
      this.balance = divideIntegers(balanceEXP, this.expValue);
      if (fifaPlayer.traits.includes(SOFIFA_TRAIT.COMES_FOR_CROSSES)) {
        this.balance = Math.round(this.balance + this.balance * 0.15);
      }

      let staminaEXP = atLeast(fifaPlayer.power[SOFIFA_POWER.STAMINA], 60);
      this.stamina = 15 + divideIntegers(staminaEXP, this.expValue);

      let topSpeedEXP = atLeast(
        fifaPlayer.movement[SOFIFA_MOVEMENT.SPRINT_SPEED],
        55,
      );
      this.topSpeed = 15 + divideIntegers(topSpeedEXP, this.expValue);

      let accelerationEXP = atLeast(
        fifaPlayer.movement[SOFIFA_MOVEMENT.ACCELERATION],
        55,
      );
      this.acceleration = 15 + divideIntegers(accelerationEXP, this.expValue);

      let responseEXP =
        fifaPlayer.goalkeeping[SOFIFA_GOALKEEPING.GK_REFLEXES] +
        fifaPlayer.internationalReputation;
      this.response = 25 + divideIntegers(responseEXP, this.expIdValue);

      let agility = atLeast(fifaPlayer.movement[SOFIFA_MOVEMENT.AGILITY], 45);
      let agilityEXP = average([
        agility,
        fifaPlayer.goalkeeping[SOFIFA_GOALKEEPING.GK_DIVING],
      ]);
      this.agility = 15 + divideIntegers(agilityEXP, this.expValue);

      let dribbling = atLeast(fifaPlayer.skill[SOFIFA_SKILL.DRIBBLING], 45);
      let ballControl = atLeast(
        fifaPlayer.skill[SOFIFA_SKILL.BALL_CONTROL],
        45,
      );
      let dribbleAccuracyEXP =
        average([dribbling, ballControl]) + fifaPlayer.internationalReputation;
      this.dribbleAccuracy =
        25 + divideIntegers(dribbleAccuracyEXP, this.expIdValue);

      let sprintSpeed = atLeast(
        fifaPlayer.movement[SOFIFA_MOVEMENT.SPRINT_SPEED],
        50,
      );
      let dribbleSpeedEXP = average([dribbling, sprintSpeed]);
      this.dribbleSpeed = 15 + divideIntegers(dribbleSpeedEXP, this.expValue);

      let shortPassing = atLeast(
        fifaPlayer.attacking[SOFIFA_ATTACKING.SHORT_PASSING],
        50,
      );
      let shortPassAccuracyEXP =
        shortPassing + fifaPlayer.internationalReputation;
      this.shortPassAccuracy =
        25 + divideIntegers(shortPassAccuracyEXP, this.expIdValue);

      let shotPower = atLeast(fifaPlayer.power[SOFIFA_POWER.SHOT_POWER], 60);
      let shortPassSpeedEXP = average([shortPassing, shotPower]);
      this.shortPassSpeed =
        15 + divideIntegers(shortPassSpeedEXP, this.expValue);

      let longPassing = atLeast(
        fifaPlayer.skill[SOFIFA_SKILL.LONG_PASSING],
        45,
      );
      let crossing = atLeast(
        fifaPlayer.attacking[SOFIFA_ATTACKING.CROSSING],
        45,
      );
      let longPassAccuracyEXP =
        average([
          longPassing,
          crossing,
          fifaPlayer.goalkeeping[SOFIFA_GOALKEEPING.GK_KICKING],
        ]) + fifaPlayer.internationalReputation;
      this.longPassAccuracy =
        25 + divideIntegers(longPassAccuracyEXP, this.expIdValue);

      let longPassSpeedEXP = average([
        crossing,
        shotPower,
        fifaPlayer.goalkeeping[SOFIFA_GOALKEEPING.GK_KICKING],
      ]);
      this.longPassSpeed = 15 + divideIntegers(longPassSpeedEXP, this.expValue);

      let finishing = atLeast(
        fifaPlayer.attacking[SOFIFA_ATTACKING.FINISHING],
        50,
      );
      let shotAccuracyEXP = finishing + fifaPlayer.internationalReputation;
      this.shotAccuracy = 25 + divideIntegers(shotAccuracyEXP, this.expIdValue);

      let shotPowerEXP = atLeast(
        fifaPlayer.goalkeeping[SOFIFA_GOALKEEPING.GK_KICKING],
        60,
      );
      this.shotPower = 15 + divideIntegers(shotPowerEXP, this.expValue);

      let volleys = atLeast(fifaPlayer.attacking[SOFIFA_ATTACKING.VOLLEYS], 30);
      let longShots = atLeast(fifaPlayer.power[SOFIFA_POWER.LONG_SHOTS], 35);
      let shotTechniqueEXP = average([volleys, longShots, ballControl]);
      this.shotTechnique = 15 + divideIntegers(shotTechniqueEXP, this.expValue);

      let fkAccuracy = atLeast(fifaPlayer.skill[SOFIFA_SKILL.FK_ACCURACY], 40);
      let freeKickAccuracyEXP = fkAccuracy + fifaPlayer.internationalReputation;
      this.freeKickAccuracy =
        25 + divideIntegers(freeKickAccuracyEXP, this.expIdValue);

      let curve = atLeast(fifaPlayer.skill[SOFIFA_SKILL.CURVE], 40);
      let curlingEXP = curve;
      this.curling = 15 + divideIntegers(curlingEXP, this.expValue);

      let headingAccuracy = atLeast(
        fifaPlayer.attacking[SOFIFA_ATTACKING.HEADING_ACCURACY],
        41,
      );
      let headerEXP = headingAccuracy + fifaPlayer.internationalReputation;
      this.header = 25 + divideIntegers(headerEXP, this.expIdValue);

      let jumping = atLeast(fifaPlayer.power[SOFIFA_POWER.JUMPING], 60);
      let jumpEXP = average([
        jumping,
        fifaPlayer.goalkeeping[SOFIFA_GOALKEEPING.GK_DIVING],
        fifaPlayer.goalkeeping[SOFIFA_GOALKEEPING.GK_DIVING],
      ]);
      this.jump = 15 + divideIntegers(jumpEXP, this.expValue);

      let techniqueEXP = ballControl + fifaPlayer.internationalReputation;
      this.technique = 25 + divideIntegers(techniqueEXP, this.expIdValue);

      let reactions = atLeast(
        fifaPlayer.movement[SOFIFA_MOVEMENT.REACTIONS],
        53,
      );
      let aggressionEXP = average([reactions, positioning]);
      this.aggression = 15 + divideIntegers(aggressionEXP, this.expIdValue);

      let composure = atLeast(
        fifaPlayer.mentality[SOFIFA_MENTALITY.COMPOSURE],
        50,
      );
      let mentalityEXP =
        average([reactions, composure]) + fifaPlayer.internationalReputation;
      this.mentality = 25 + divideIntegers(mentalityEXP, this.expIdValue);

      let gkHandling = atLeast(
        fifaPlayer.goalkeeping[SOFIFA_GOALKEEPING.GK_HANDLING],
        60,
      );
      let goalkeepingEXP =
        average([gkHandling, gkDiving]) + fifaPlayer.internationalReputation;
      this.goalkeeping = 25 + divideIntegers(goalkeepingEXP, this.expIdValue);

      let teamworkEXP =
        average([
          fifaPlayer.mentality[SOFIFA_MENTALITY.VISION],
          composure,
          reactions,
        ]) + fifaPlayer.internationalReputation;
      this.teamwork = 25 + divideIntegers(teamworkEXP, this.expIdValue);
    } else {
      // rest of players

      let positioning = fifaPlayer.mentality[SOFIFA_MENTALITY.ATTACK_POSITION];
      let attackExtraPoints = 25;
      if (this.registeredPosition == "CBT") {
        attackExtraPoints = 20;
        if (positioning < 30) {
          positioning = 30;
        } else if (positioning < 50) {
          positioning = 50;
        }
      }

      let attackEXP =
        divideIntegers(
          positioning +
            positioning +
            fifaPlayer.movement[SOFIFA_MOVEMENT.REACTIONS],
          3,
        ) + fifaPlayer.internationalReputation;
      this.attack =
        attackExtraPoints + divideIntegers(attackEXP, this.expIdValue);

      let defensiveAwarenessStat;
      if ("Defensive awareness" in fifaPlayer.defending) {
        defensiveAwarenessStat =
          fifaPlayer.defending[SOFIFA_DEFENDING.DEFENSIVE_AWARENESS];
      } else {
        defensiveAwarenessStat = fifaPlayer.defending[SOFIFA_DEFENDING.MARKING];
      }
      let defensiveAwareness = atLeast(defensiveAwarenessStat, 20);
      let standingTackle = atLeast(
        fifaPlayer.defending[SOFIFA_DEFENDING.STANDING_TACKLE],
        20,
      );
      let defenceEXP = divideIntegers(
        defensiveAwareness * 2 + standingTackle,
        3,
      );
      let tempDefence =
        25 +
        divideIntegers(defenceEXP, this.expIdValue) +
        fifaPlayer.internationalReputation;
      this.defence =
        this.registeredPosition == "CBT"
          ? tempDefence
          : 15 + divideIntegers(tempDefence, 1.238);

      let strenght = atLeast(fifaPlayer.power[SOFIFA_POWER.STRENGTH], 60);
      let balance = atLeast(fifaPlayer.movement[SOFIFA_MOVEMENT.BALANCE], 60);
      let balanceEXP =
        strenght > balance ? strenght : divideIntegers(strenght + balance, 2);
      this.balance = 15 + divideIntegers(balanceEXP, this.expValue);

      let stamina = atLeast(fifaPlayer.power[SOFIFA_POWER.STAMINA], 63);
      let staminaEXP = stamina + fifaPlayer.internationalReputation;
      this.stamina = 25 + divideIntegers(staminaEXP, this.expIdValue);

      let topSpeedEXP = fifaPlayer.movement[SOFIFA_MOVEMENT.SPRINT_SPEED];
      this.topSpeed = atLeast(
        15 + divideIntegers(topSpeedEXP, this.expValue),
        60,
      );

      let accelerationEXP = fifaPlayer.movement[SOFIFA_MOVEMENT.ACCELERATION];
      this.acceleration = atLeast(
        15 + divideIntegers(accelerationEXP, this.expValue),
        60,
      );

      let interceptions = atLeast(
        fifaPlayer.mentality[SOFIFA_MENTALITY.INTERCEPTIONS],
        53,
      );
      let reactions = atLeast(
        fifaPlayer.movement[SOFIFA_MOVEMENT.REACTIONS],
        53,
      );
      let responseEXP = reactions > interceptions ? reactions : interceptions;
      this.response =
        25 +
        divideIntegers(
          responseEXP + fifaPlayer.internationalReputation,
          this.expIdValue,
        );

      let agility = atLeast(fifaPlayer.movement[SOFIFA_MOVEMENT.AGILITY], 50);
      let acceleration = atLeast(
        fifaPlayer.movement[SOFIFA_MOVEMENT.ACCELERATION],
        60,
      );
      let agilityEXP = (agility + acceleration) / 2;
      this.agility = 15 + divideIntegers(agilityEXP, this.expValue);

      let dribbling = atLeast(fifaPlayer.skill[SOFIFA_SKILL.DRIBBLING], 55);
      let ballControl = atLeast(
        fifaPlayer.skill[SOFIFA_SKILL.BALL_CONTROL],
        55,
      );
      let dribbleAccuracyEXP =
        (dribbling + ballControl) / 2 + fifaPlayer.internationalReputation;
      this.dribbleAccuracy =
        25 + divideIntegers(dribbleAccuracyEXP, this.expIdValue);

      let sprintSpeed = atLeast(
        fifaPlayer.movement[SOFIFA_MOVEMENT.SPRINT_SPEED],
        50,
      );
      let dribbleSpeedEXP = (dribbling + sprintSpeed) / 2;
      this.dribbleSpeed = 15 + divideIntegers(dribbleSpeedEXP, this.expValue);

      let shortPassing = atLeast(
        fifaPlayer.attacking[SOFIFA_ATTACKING.SHORT_PASSING],
        50,
      );
      let shortPassAccuracyEXP =
        shortPassing + fifaPlayer.internationalReputation;
      this.shortPassAccuracy =
        25 + divideIntegers(shortPassAccuracyEXP, this.expIdValue);

      let shotPower = atLeast(fifaPlayer.power[SOFIFA_POWER.SHOT_POWER], 60);
      let shortPassSpeedEXP = (shortPassing + shotPower) / 2;
      this.shortPassSpeed =
        15 + divideIntegers(shortPassSpeedEXP, this.expValue);

      let longPassing = atLeast(
        fifaPlayer.skill[SOFIFA_SKILL.LONG_PASSING],
        45,
      );
      let crossing = atLeast(
        fifaPlayer.attacking[SOFIFA_ATTACKING.CROSSING],
        45,
      );
      let longPassAccuracyEXP =
        (longPassing + crossing) / 2 + fifaPlayer.internationalReputation;
      this.longPassAccuracy =
        25 + divideIntegers(longPassAccuracyEXP, this.expIdValue);

      let longPassSpeedEXP = (crossing + shotPower) / 2;
      this.longPassSpeed = 15 + divideIntegers(longPassSpeedEXP, this.expValue);

      let finishing = atLeast(
        fifaPlayer.attacking[SOFIFA_ATTACKING.FINISHING],
        50,
      );
      let shotAccuracyEXP = finishing + fifaPlayer.internationalReputation;
      this.shotAccuracy = 25 + divideIntegers(shotAccuracyEXP, this.expIdValue);

      let shotPowerEXP = shotPower;
      this.shotPower = 15 + divideIntegers(shotPowerEXP, this.expValue);

      let volleys = atLeast(fifaPlayer.attacking[SOFIFA_ATTACKING.VOLLEYS], 50);
      let longShots = atLeast(fifaPlayer.power[SOFIFA_POWER.LONG_SHOTS], 50);
      let shotTechniqueEXP = (volleys + longShots + ballControl) / 3;
      this.shotTechnique = 15 + divideIntegers(shotTechniqueEXP, this.expValue);

      let fkAccuracy = atLeast(fifaPlayer.skill[SOFIFA_SKILL.FK_ACCURACY], 50);
      let freeKickAccuracyEXP = fkAccuracy + fifaPlayer.internationalReputation;
      this.freeKickAccuracy =
        25 + divideIntegers(freeKickAccuracyEXP, this.expIdValue);

      let curve = atLeast(fifaPlayer.skill[SOFIFA_SKILL.CURVE], 55);
      let curlingEXP = curve;
      this.curling = 15 + divideIntegers(curlingEXP, this.expValue);

      let headingAccuracy = atLeast(
        fifaPlayer.attacking[SOFIFA_ATTACKING.HEADING_ACCURACY],
        50,
      );
      let headerEXP = headingAccuracy + fifaPlayer.internationalReputation;
      this.header = 25 + divideIntegers(headerEXP, this.expIdValue);

      let jumping = atLeast(fifaPlayer.power[SOFIFA_POWER.JUMPING], 60);
      let jumpEXP = jumping;
      this.jump = 15 + divideIntegers(jumpEXP, this.expValue);

      let techniqueEXP = ballControl + fifaPlayer.internationalReputation;
      this.technique = 25 + divideIntegers(techniqueEXP, this.expIdValue);

      let aggressionEXP = reactions + fifaPlayer.internationalReputation;
      this.aggression = 25 + divideIntegers(aggressionEXP, this.expIdValue);

      if (this.registeredPosition == "CBT") {
        aggressionEXP = (reactions + positioning) / 2;
        this.aggression = 15 + divideIntegers(aggressionEXP, this.expValue);
      }

      let aggression = atLeast(
        fifaPlayer.mentality[SOFIFA_MENTALITY.AGGRESSION],
        45,
      );

      let mentalityEXP =
        (aggression + stamina) / 2 + fifaPlayer.internationalReputation;
      this.mentality = 25 + divideIntegers(mentalityEXP, this.expIdValue);

      this.goalkeeping = 50;

      let teamworkEXP = divideIntegers(
        fifaPlayer.mentality[SOFIFA_MENTALITY.VISION] +
          positioning +
          aggression,
        3,
      );
      this.teamwork =
        25 +
        divideIntegers(
          teamworkEXP + fifaPlayer.internationalReputation,
          this.expIdValue,
        );

      if (
        this.registeredPosition == "CBT" ||
        this.registeredPosition == "DMF"
      ) {
        teamworkEXP = divideIntegers(
          fifaPlayer.mentality[SOFIFA_MENTALITY.COMPOSURE] + aggression,
          2,
        );
        this.teamwork =
          25 +
          divideIntegers(
            teamworkEXP + fifaPlayer.internationalReputation,
            this.expIdValue,
          );
      }
    }
    // Special abilities
    if (
      fifaPlayer.skillMoves > 3 ||
      fifaPlayer.traits.includes(SOFIFA_TRAIT.TECHNICAL_DRIBBLER_AI) ||
      fifaPlayer.traits.includes(SOFIFA_TRAIT.SPEED_DRIBBLER_AI)
    ) {
      this.dribbling = 1;
      this.specialAbilitiesString += "* Dribbling" + "\n";
    } else {
      this.dribbling = 0;
    }

    if (fifaPlayer.traits.includes(SOFIFA_TRAIT.FLAIR)) {
      this.tacticalDribble = 1;
      this.specialAbilitiesString += "* Tactical dribble" + "\n";
    } else {
      this.tacticalDribble = 0;
    }

    if (
      fifaPlayer.mentality[SOFIFA_MENTALITY.ATTACK_POSITION] > 85 &&
      hasSpecialAbility(
        this.positioningPositions,
        this.registeredPosition,
        this.positions,
      )
    ) {
      this.positioning = 1;
      this.specialAbilitiesString += "* Positioning" + "\n";
    } else {
      this.positioning = 0;
    }

    if (
      average([
        fifaPlayer.movement[SOFIFA_MOVEMENT.ACCELERATION],
        fifaPlayer.movement[SOFIFA_MOVEMENT.REACTIONS],
      ]) > 85 &&
      hasSpecialAbility(
        this.reactionPositions,
        this.registeredPosition,
        this.positions,
      )
    ) {
      this.reaction = 1;
      this.specialAbilitiesString += "* Reaction" + "\n";
    } else {
      this.reaction = 0;
    }

    if (
      fifaPlayer.traits.includes(SOFIFA_TRAIT.PLAYMAKER_AI) &&
      hasSpecialAbility(
        this.playmakingPositions,
        this.registeredPosition,
        this.positions,
      )
    ) {
      this.playmaking = 1;
      this.specialAbilitiesString += "* Playmaking" + "\n";
    } else {
      this.playmaking = 0;
    }

    if (
      average([
        fifaPlayer.attacking[SOFIFA_ATTACKING.SHORT_PASSING],
        fifaPlayer.mentality[SOFIFA_MENTALITY.VISION],
      ]) > 85 &&
      hasSpecialAbility(
        this.passingPositions,
        this.registeredPosition,
        this.positions,
      )
    ) {
      this.passing = 1;
      this.specialAbilitiesString += "* Passing" + "\n";
    } else {
      this.passing = 0;
    }

    if (
      average([
        fifaPlayer.movement[SOFIFA_MOVEMENT.REACTIONS],
        fifaPlayer.attacking[SOFIFA_ATTACKING.FINISHING],
      ]) > 85 &&
      hasSpecialAbility(
        this.scoringPositions,
        this.registeredPosition,
        this.positions,
      )
    ) {
      this.scoring = 1;
      this.specialAbilitiesString += "* Scoring" + "\n";
    } else {
      this.scoring = 0;
    }

    if (
      average([
        fifaPlayer.mentality[SOFIFA_MENTALITY.COMPOSURE],
        fifaPlayer.attacking[SOFIFA_ATTACKING.FINISHING],
      ]) > 85 &&
      hasSpecialAbility(
        this.oneOnOneScoringPositions,
        this.registeredPosition,
        this.positions,
      )
    ) {
      this.oneOnOneScoring = 1;
      this.specialAbilitiesString += "* 1-1 Scoring" + "\n";
    } else {
      this.oneOnOneScoring = 0;
    }

    if (
      fifaPlayer.traits.includes(SOFIFA_TRAIT.POWER_HEADER) &&
      fifaPlayer.power[SOFIFA_POWER.STRENGTH] > 85 &&
      hasSpecialAbility(
        this.postPlayerPositions,
        this.registeredPosition,
        this.positions,
      )
    ) {
      this.postPlayer = 1;
      this.specialAbilitiesString += "* Post player" + "\n";
    } else {
      this.postPlayer = 0;
    }

    if (
      (fifaPlayer.traits.includes(SOFIFA_TRAIT.BEAT_OFFSIDE_TRAP) ||
        fifaPlayer.playerSpecialties.includes(
          SOFIFA_SPECIALITY.COMPLETE_FORWARD,
        ) ||
        fifaPlayer.playerSpecialties.includes(
          SOFIFA_SPECIALITY.COMPLETE_DEFENDER,
        )) &&
      hasSpecialAbility(
        this.linesPositions,
        this.registeredPosition,
        this.positions,
      )
    ) {
      this.lines = 1;
      this.specialAbilitiesString += "* Lines" + "\n";
    } else {
      this.lines = 0;
    }

    if (
      (fifaPlayer.traits.includes(SOFIFA_TRAIT.LONG_SHOT_TAKER_AI) ||
        fifaPlayer.playerSpecialties.includes(
          SOFIFA_SPECIALITY.DISTANCE_SHOOTER,
        )) &&
      hasSpecialAbility(
        this.middleShootingPositions,
        this.registeredPosition,
        this.positions,
      )
    ) {
      this.middleShooting = 1;
      this.specialAbilitiesString += "* Middle shooting" + "\n";
    } else {
      this.middleShooting = 0;
    }

    if (
      (fifaPlayer.traits.includes(SOFIFA_TRAIT.TECHNICAL_DRIBBLER_AI) &&
        sideCounter > 2) ||
      fifaPlayer.traits.includes(SOFIFA_TRAIT.EARLY_CROSSER)
    ) {
      this.side = 1;
      this.specialAbilitiesString += "* Side" + "\n";
    } else {
      this.side = 0;
    }

    if (
      fifaPlayer.traits.includes(SOFIFA_TRAIT.PLAYMAKER_AI) &&
      fifaPlayer.mentality[SOFIFA_MENTALITY.VISION] > 80 &&
      fifaPlayer.mentality[SOFIFA_MENTALITY.ATTACK_POSITION] > 80
    ) {
      this.centre = 1;
      this.specialAbilitiesString += "* Centre" + "\n";
    } else {
      this.centre = 0;
    }

    if (
      average([
        fifaPlayer.mentality[SOFIFA_MENTALITY.COMPOSURE],
        fifaPlayer.mentality[SOFIFA_MENTALITY.PENALTIES],
      ]) > 80
    ) {
      this.penalties = 1;
      this.specialAbilitiesString += "* Penalties" + "\n";
    } else {
      this.penalties = 0;
    }

    if (
      fifaPlayer.skillMoves > 3 &&
      fifaPlayer.attacking[SOFIFA_ATTACKING.SHORT_PASSING] > 83 &&
      hasSpecialAbility(
        this.oneTouchPassPositions,
        this.registeredPosition,
        this.positions,
      )
    ) {
      this.oneTouchPass = 1;
      this.specialAbilitiesString += "* 1-Touch pass" + "\n";
    } else {
      this.oneTouchPass = 0;
    }

    if (
      fifaPlayer.traits.includes(SOFIFA_TRAIT.OUTSIDE_FOOT_SHOT) &&
      fifaPlayer.skill[SOFIFA_SKILL.BALL_CONTROL] * 0.3 +
        fifaPlayer.skill[SOFIFA_SKILL.CURVE] * 0.7 >=
        85
    ) {
      this.outside = 1;
      this.specialAbilitiesString += "* Outside" + "\n";
    } else {
      this.outside = 0;
    }

    let defensiveAwarenessStat;
    if ("Defensive awareness" in fifaPlayer.defending) {
      defensiveAwarenessStat =
        fifaPlayer.defending[SOFIFA_DEFENDING.DEFENSIVE_AWARENESS];
    } else {
      defensiveAwarenessStat = fifaPlayer.defending[SOFIFA_DEFENDING.MARKING];
    }

    if (
      average([
        defensiveAwarenessStat,
        fifaPlayer.mentality[SOFIFA_MENTALITY.AGGRESSION],
      ]) > 85 &&
      hasSpecialAbility(
        this.markingPositions,
        this.registeredPosition,
        this.positions,
      )
    ) {
      this.marking = 1;
      this.specialAbilitiesString += "* Marking" + "\n";
    } else {
      this.marking = 0;
    }

    if (
      average([
        fifaPlayer.mentality[SOFIFA_MENTALITY.COMPOSURE],
        fifaPlayer.defending[SOFIFA_DEFENDING.STANDING_TACKLE],
      ]) > 85 &&
      hasSpecialAbility(
        this.slidingPositions,
        this.registeredPosition,
        this.positions,
      )
    ) {
      this.sliding = 1;
      this.specialAbilitiesString += "* Sliding" + "\n";
    } else {
      this.sliding = 0;
    }

    if (
      average([
        fifaPlayer.mentality[SOFIFA_MENTALITY.INTERCEPTIONS],
        fifaPlayer.defending[SOFIFA_DEFENDING.STANDING_TACKLE],
      ]) > 85 &&
      hasSpecialAbility(
        this.coveringPositions,
        this.registeredPosition,
        this.positions,
      )
    ) {
      this.covering = 1;
      this.specialAbilitiesString += "* Covering" + "\n";
    } else {
      this.covering = 0;
    }

    if (
      fifaPlayer.traits.includes(SOFIFA_PLAYSTYLE.LEADERSHIP) &&
      hasSpecialAbility(
        this.dLineControlPositions,
        this.registeredPosition,
        this.positions,
      )
    ) {
      this.dLineControl = 1;
      this.specialAbilitiesString += "* D-Line control" + "\n";
    } else {
      this.dLineControl = 0;
    }

    if (
      average([
        fifaPlayer.goalkeeping[SOFIFA_GOALKEEPING.GK_HANDLING],
        fifaPlayer.goalkeeping[SOFIFA_GOALKEEPING.GK_REFLEXES],
      ]) > 80 &&
      this.registeredPosition == "GK"
    ) {
      this.penaltyStopper = 1;
      this.specialAbilitiesString += "* Penalty stopper" + "\n";
    } else {
      this.penaltyStopper = 0;
    }

    if (
      fifaPlayer.traits.includes(SOFIFA_TRAIT.SAVES_WITH_FEET) &&
      this.registeredPosition == "GK"
    ) {
      this.oneOnOneStopper = 1;
      this.specialAbilitiesString += "* 1-On-1 stopper" + "\n";
    } else {
      this.oneOnOneStopper = 0;
    }

    if (
      (fifaPlayer.traits.includes(SOFIFA_TRAIT.LONG_THROW_IN) ||
        fifaPlayer.traits.includes(SOFIFA_TRAIT.GIANT_THROW_IN)) &&
      hasSpecialAbility(
        this.longThrowPositions,
        this.registeredPosition,
        this.positions,
      )
    ) {
      this.longThrow = 1;
      this.specialAbilitiesString += "* Long throw" + "\n";
    } else {
      this.longThrow = 0;
    }

    //return this.psdString();
  }

  /**
   * Fill PES5 stats from a scraped FMInside player.
   * @param {FMPlayer} fmPlayer
   * @returns {void}
   */
  fromFMPlayer(fmPlayer) {
    let FMPositions = fmPositionStringToArray(fmPlayer.info[FM_INFO.POSITIONS]);
    debugLog("pes5:fm", "positions", FMPositions);
    this.registeredPosition =
      FMPositions.includes("AMC") && FMPositions.includes("ST")
        ? "SS"
        : fmToPesPositions(FMPositions[0]);
    this.positions = [];
    let sidePositions = ["DL", "DR", "WBL", "WBR", "ML", "MR", "AML", "AMR"];
    let centerPositions = ["DC", "MC", "DM", "AMC", "ST"];

    let sideCounter = 0;
    let centerCounter = 0;

    for (let index = 0; index < FMPositions.length; index++) {
      if (this.registeredPosition != fmToPesPositions(FMPositions[index])) {
        this.positions.push(fmToPesPositions(FMPositions[index]));
        if (sidePositions.includes(FMPositions[index])) sideCounter++;
        if (centerPositions.includes(FMPositions[index])) centerCounter++;
      }
    }
    this.name = fmPlayer.info[FM_INFO.NAME];
    this.shirtName = this.nameToShirtName(this.name);
    this.age = parseInt(fmPlayer.info[FM_INFO.AGE]);
    this.nation = fmPlayer.nationality;
    this.nationality =
      fmPlayer.nationality in pesIndieNationalities
        ? pesIndieNationalities[fmPlayer.nationality]
        : "Free Nationality";
    this.foot = fmPlayer.info[FM_INFO.FOOT] == "Left" ? "L" : "R";
    this.favouredSide = getFavSide(FMPositions, true);

    this.height = parseInt(fmPlayer.info[FM_INFO.HEIGHT]);
    this.weight = parseInt(fmPlayer.info[FM_INFO.WEIGHT]);

    this.injuryTolerance = fmToPesStatAToC(
      (fmPlayer.stats[FM_STAT.STAMINA] +
        fmPlayer.stats[FM_STAT.NATURAL_FITNESS]) /
        2,
    );

    if (this.registeredPosition == "GK") {
      this.attack = 30;
      this.defence = fmToPesStat99(
        (fmPlayer.stats[FM_STAT.POSITIONING] +
          fmPlayer.stats[FM_STAT.COMMAND_OF_AREA]) /
          2,
      );
      this.balance = fmToPesStat99(fmPlayer.stats[FM_STAT.STRENGTH]);
      this.stamina = Math.round(
        (fmToPesStat99(15) + fmToPesStat99(fmPlayer.stats[FM_STAT.STAMINA])) /
          2,
      );
      this.topSpeed = fmToPesStat99(fmPlayer.stats[FM_STAT.PACE]);
      this.acceleration = fmToPesStat99(fmPlayer.stats[FM_STAT.ACCELERATION]);
      this.response = fmToPesStat99(
        fmPlayer.stats[FM_STAT.REFLEXES] * 0.8 +
          fmPlayer.stats[FM_STAT.ANTICIPATION] * 0.2,
      );
      this.agility = fmToPesStat99(
        (fmPlayer.stats[FM_STAT.AGILITY] +
          fmPlayer.stats[FM_STAT.AERIAL_REACH]) /
          2,
      );
      this.dribbleAccuracy = fmToPesStat99(
        (fmPlayer.stats[FM_STAT.FLAIR] + fmPlayer.stats[FM_STAT.FIRST_TOUCH]) /
          2,
      );
      this.dribbleSpeed = fmToPesStat99(
        (fmPlayer.stats[FM_STAT.FLAIR] +
          fmPlayer.stats[FM_STAT.FIRST_TOUCH] +
          fmPlayer.stats[FM_STAT.PACE]) /
          3,
      );
      this.shortPassAccuracy = fmToPesStat99(fmPlayer.stats[FM_STAT.PASSING]);
      this.shortPassSpeed = fmToPesStat99(
        fmPlayer.stats[FM_STAT.PASSING] * 0.8 +
          fmPlayer.stats[FM_STAT.FIRST_TOUCH] * 0.2,
      );
      this.longPassAccuracy = fmToPesStat99(fmPlayer.stats[FM_STAT.KICKING]);
      this.longPassSpeed = fmToPesStat99(
        fmPlayer.stats[FM_STAT.KICKING] * 0.8 +
          fmPlayer.stats[FM_STAT.FIRST_TOUCH] * 0.2,
      );
      this.shotAccuracy = 45;
      this.shotPower = fmToPesStat99(fmPlayer.stats[FM_STAT.KICKING]);
      this.shotTechnique = 45;
      this.freeKickAccuracy = fmToPesStat99(
        fmPlayer.stats[FM_STAT.KICKING] * 0.4 +
          fmPlayer.stats[FM_STAT.FLAIR] * 0.6,
      );
      this.curling = 45;
      this.header = 55;
      this.jump =
        average([
          fmToPesStat99(
            (fmPlayer.stats[FM_STAT.JUMPING_REACH] +
              fmPlayer.stats[FM_STAT.AERIAL_REACH]) /
              2,
          ),
          heightTo99Stat(this.height, true),
        ]) + 3;
      this.technique = fmToPesStat99(fmPlayer.stats[FM_STAT.FLAIR]);
      this.aggression = fmToPesStat99(
        fmPlayer.stats[FM_STAT.POSITIONING] * 0.7 +
          fmPlayer.stats[FM_STAT.ANTICIPATION] * 0.3,
      );
      //this.mentality = fmToPesStat99((fmPlayer.stats[FM_STAT.RUSHING_OUT_TENDENCY] * 0.25 + fmPlayer.stats[FM_STAT.ONE_ON_ONES] * 0.5 + fmPlayer.stats[FM_STAT.COMPOSURE] * 0.25));
      this.mentality = fmToPesStat99(
        (fmPlayer.stats[FM_STAT.LEADERSHIP] +
          fmPlayer.stats[FM_STAT.DETERMINATION]) /
          2,
      );
      this.goalkeeping = fmToPesStat99(
        fmPlayer.stats[FM_STAT.HANDLING] * 0.4 +
          fmPlayer.stats[FM_STAT.AERIAL_REACH] * 0.4 +
          fmPlayer.stats[FM_STAT.COMMAND_OF_AREA] * 0.2,
      );
      this.teamwork = fmToPesStat99(fmPlayer.stats[FM_STAT.COMMUNICATION]);
      this.consistency = fmToPesStat1To8(fmPlayer.stats[FM_STAT.DETERMINATION]);
      this.condition = fmToPesStat1To8(fmPlayer.stats[FM_STAT.NATURAL_FITNESS]);
      this.weakFootAccuracy = fmToPesStat1To8(
        (2 + fmPlayer.stats[FM_STAT.KICKING]) / 2,
      );
      this.weakFootFrequency = fmToPesStat1To8(
        fmPlayer.stats[FM_STAT.DECISIONS],
      );
    } else {
      //field players
      this.attack = fmToPesStat99(
        fmPlayer.stats[FM_STAT.OFF_THE_BALL] * 0.7 +
          fmPlayer.stats[FM_STAT.ANTICIPATION] * 0.3,
      );
      if (
        this.registeredPosition == "CBT" ||
        this.registeredPosition == "CWP" ||
        this.registeredPosition == "DMF"
      ) {
        if (this.attack < 70 && this.attack > 0) {
          this.attack = this.attack - 10;
        } else if (this.attack < 86 && this.attack >= 70) {
          this.attack = this.attack - 15;
        } else if (this.attack < 100 && this.attack >= 86) {
          this.attack = this.attack - 20;
        }
      }
      this.defence = fmToPesStat99(
        fmPlayer.stats[FM_STAT.ANTICIPATION] * 0.1 +
          fmPlayer.stats[FM_STAT.MARKING] * 0.3 +
          fmPlayer.stats[FM_STAT.POSITIONING] * 0.5 +
          fmPlayer.stats[FM_STAT.TACKLING] * 0.1,
      );
      if (
        this.registeredPosition == "SMF" ||
        this.registeredPosition == "AMF" ||
        this.registeredPosition == "WF" ||
        this.registeredPosition == "SS" ||
        this.registeredPosition == "CF"
      ) {
        if (this.defence < 70 && this.defence > 0) {
          this.defence = this.defence - 10;
        } else if (this.defence < 86 && this.defence >= 70) {
          this.defence = this.defence - 15;
        } else if (this.defence < 100 && this.defence >= 86) {
          this.defence = this.defence - 20;
        }
      }
      this.balance = fmToPesStat99(fmPlayer.stats[FM_STAT.STRENGTH]);
      this.stamina = Math.round(
        (fmToPesStat99(15) + fmToPesStat99(fmPlayer.stats[FM_STAT.STAMINA])) /
          2,
      );
      this.topSpeed = fmToPesStat99(fmPlayer.stats[FM_STAT.PACE]);
      this.acceleration = fmToPesStat99(fmPlayer.stats[FM_STAT.ACCELERATION]);
      this.response = fmToPesStat99(fmPlayer.stats[FM_STAT.ANTICIPATION]);
      this.agility = fmToPesStat99(fmPlayer.stats[FM_STAT.AGILITY]);
      this.dribbleAccuracy = fmToPesStat99(
        (fmPlayer.stats[FM_STAT.DRIBBLING] +
          fmPlayer.stats[FM_STAT.FIRST_TOUCH]) /
          2,
      );
      this.dribbleSpeed = fmToPesStat99(
        fmPlayer.stats[FM_STAT.DRIBBLING] * 0.5 +
          fmPlayer.stats[FM_STAT.ACCELERATION] * 0.25 +
          fmPlayer.stats[FM_STAT.PACE] * 0.25,
      );
      this.shortPassAccuracy = fmToPesStat99(fmPlayer.stats[FM_STAT.PASSING]);
      this.shortPassSpeed = fmToPesStat99(
        (fmPlayer.stats[FM_STAT.PASSING] + fmPlayer.stats[FM_STAT.TECHNIQUE]) /
          2,
      );
      this.longPassAccuracy = fmToPesStat99(
        (fmPlayer.stats[FM_STAT.CROSSING] + fmPlayer.stats[FM_STAT.PASSING]) /
          2,
      );
      this.longPassSpeed = fmToPesStat99(
        (fmPlayer.stats[FM_STAT.CROSSING] +
          fmPlayer.stats[FM_STAT.PASSING] +
          fmPlayer.stats[FM_STAT.TECHNIQUE]) /
          3,
      );
      this.shotAccuracy = fmToPesStat99(
        (fmPlayer.stats[FM_STAT.FINISHING] +
          fmPlayer.stats[FM_STAT.COMPOSURE]) /
          2,
      );
      this.shotPower = fmToPesStat99(
        average([
          fmPlayer.stats[FM_STAT.STRENGTH],
          fmPlayer.stats[FM_STAT.LONG_SHOTS],
        ]),
      );
      this.shotTechnique = fmToPesStat99(
        (fmPlayer.stats[FM_STAT.FINISHING] +
          fmPlayer.stats[FM_STAT.FIRST_TOUCH] +
          fmPlayer.stats[FM_STAT.TECHNIQUE]) /
          3,
      );
      this.freeKickAccuracy = fmToPesStat99(
        fmPlayer.stats[FM_STAT.FREE_KICK_TAKING],
      );
      this.curling = fmToPesStat99(
        (fmPlayer.stats[FM_STAT.FREE_KICK_TAKING] +
          fmPlayer.stats[FM_STAT.CORNERS]) /
          2,
      );
      this.header = fmToPesStat99(fmPlayer.stats[FM_STAT.HEADING]);
      this.jump = average([
        fmToPesStat99(fmPlayer.stats[FM_STAT.JUMPING_REACH]),
        heightTo99Stat(this.height, false),
      ]);
      if (this.registeredPosition == "CBT") this.jump += 3;
      this.technique = fmToPesStat99(
        (fmPlayer.stats[FM_STAT.FLAIR] + fmPlayer.stats[FM_STAT.TECHNIQUE]) / 2,
      );
      this.aggression = fmToPesStat99(
        fmPlayer.stats[FM_STAT.VISION] * 0.5 +
          fmPlayer.stats[FM_STAT.OFF_THE_BALL] * 0.5,
      );
      //this.mentality = fmToPesStat99((fmPlayer.stats[FM_STAT.WORK_RATE] * 0.7) + (fmPlayer.stats[FM_STAT.BRAVERY] * 0.3));
      this.mentality = fmToPesStat99(
        (fmPlayer.stats[FM_STAT.LEADERSHIP] +
          fmPlayer.stats[FM_STAT.DETERMINATION]) /
          2,
      );
      this.goalkeeping = 50;
      this.teamwork = fmToPesStat99(fmPlayer.stats[FM_STAT.TEAMWORK]);
      this.consistency = fmToPesStat1To8(fmPlayer.stats[FM_STAT.DETERMINATION]);
      this.condition = fmToPesStat1To8(fmPlayer.stats[FM_STAT.NATURAL_FITNESS]);
      this.weakFootAccuracy = fmToPesStat1To8(
        ((fmPlayer.stats[FM_STAT.FINISHING] +
          fmPlayer.stats[FM_STAT.FIRST_TOUCH] +
          fmPlayer.stats[FM_STAT.TECHNIQUE]) /
          3 +
          fmPlayer.stats[FM_STAT.FINISHING]) /
          2,
      );
      this.weakFootFrequency = fmToPesStat1To8(
        fmPlayer.stats[FM_STAT.DECISIONS],
      );
    }
    // Special abilities
    if (fmPlayer.stats[FM_STAT.DRIBBLING] > 15) {
      this.dribbling = 1;
      this.specialAbilitiesString += "* Dribbling" + "\n";
    } else {
      this.dribbling = 0;
    }

    if (fmPlayer.stats[FM_STAT.BALANCE] > 15) {
      this.tacticalDribble = 1;
      this.specialAbilitiesString += "* Tactical dribble" + "\n";
    } else {
      this.tacticalDribble = 0;
    }

    if (
      (fmPlayer.stats[FM_STAT.VISION] + fmPlayer.stats[FM_STAT.OFF_THE_BALL]) /
        2 >
        15 &&
      hasSpecialAbility(
        this.positioningPositions,
        this.registeredPosition,
        this.positions,
      )
    ) {
      this.positioning = 1;
      this.specialAbilitiesString += "* Positioning" + "\n";
    } else {
      this.positioning = 0;
    }

    if (
      fmPlayer.stats[FM_STAT.OFF_THE_BALL] > 15 &&
      hasSpecialAbility(
        this.reactionPositions,
        this.registeredPosition,
        this.positions,
      )
    ) {
      this.reaction = 1;
      this.specialAbilitiesString += "* Reaction" + "\n";
    } else {
      this.reaction = 0;
    }

    if (
      fmPlayer.stats[FM_STAT.LEADERSHIP] > 15 &&
      hasSpecialAbility(
        this.playmakingPositions,
        this.registeredPosition,
        this.positions,
      )
    ) {
      this.playmaking = 1;
      this.specialAbilitiesString += "* Playmaking" + "\n";
    } else {
      this.playmaking = 0;
    }

    if (
      fmPlayer.stats[FM_STAT.CONCENTRATION] > 15 &&
      hasSpecialAbility(
        this.passingPositions,
        this.registeredPosition,
        this.positions,
      )
    ) {
      this.passing = 1;
      this.specialAbilitiesString += "* Passing" + "\n";
    } else {
      this.passing = 0;
    }

    if (
      fmPlayer.stats[FM_STAT.ANTICIPATION] > 15 &&
      hasSpecialAbility(
        this.scoringPositions,
        this.registeredPosition,
        this.positions,
      )
    ) {
      this.scoring = 1;
      this.specialAbilitiesString += "* Scoring" + "\n";
    } else {
      this.scoring = 0;
    }

    if (
      (fmPlayer.stats[FM_STAT.COMPOSURE] + fmPlayer.stats[FM_STAT.FINISHING]) /
        2 >
        15 &&
      hasSpecialAbility(
        this.oneOnOneScoringPositions,
        this.registeredPosition,
        this.positions,
      )
    ) {
      this.oneOnOneScoring = 1;
      this.specialAbilitiesString += "* 1-1 Scoring" + "\n";
    } else {
      this.oneOnOneScoring = 0;
    }

    if (
      (fmPlayer.stats[FM_STAT.STRENGTH] + fmPlayer.stats[FM_STAT.TEAMWORK]) /
        2 >
        15 &&
      hasSpecialAbility(
        this.postPlayerPositions,
        this.registeredPosition,
        this.positions,
      )
    ) {
      this.postPlayer = 1;
      this.specialAbilitiesString += "* Post player" + "\n";
    } else {
      this.postPlayer = 0;
    }

    if (
      fmPlayer.stats[FM_STAT.DECISIONS] > 15 &&
      hasSpecialAbility(
        this.linesPositions,
        this.registeredPosition,
        this.positions,
      )
    ) {
      this.lines = 1;
      this.specialAbilitiesString += "* Lines" + "\n";
    } else {
      this.lines = 0;
    }

    if (
      fmPlayer.stats[FM_STAT.LONG_SHOTS] > 15 &&
      hasSpecialAbility(
        this.middleShootingPositions,
        this.registeredPosition,
        this.positions,
      )
    ) {
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
    if (fmPlayer.stats[FM_STAT.PENALTY_TAKING] > 15) {
      this.penalties = 1;
      this.specialAbilitiesString += "* Penalties" + "\n";
    } else {
      this.penalties = 0;
    }

    if (
      (fmPlayer.stats[FM_STAT.TECHNIQUE] + fmPlayer.stats[FM_STAT.PASSING]) /
        2 >
        15 &&
      hasSpecialAbility(
        this.oneTouchPassPositions,
        this.registeredPosition,
        this.positions,
      )
    ) {
      this.oneTouchPass = 1;
      this.specialAbilitiesString += "* 1-Touch pass" + "\n";
    } else {
      this.oneTouchPass = 0;
    }

    if (fmPlayer.stats[FM_STAT.TECHNIQUE] > 15) {
      this.outside = 1;
      this.specialAbilitiesString += "* Outside" + "\n";
    } else {
      this.outside = 0;
    }

    if (
      fmPlayer.stats[FM_STAT.MARKING] > 15 &&
      hasSpecialAbility(
        this.markingPositions,
        this.registeredPosition,
        this.positions,
      )
    ) {
      this.marking = 1;
      this.specialAbilitiesString += "* Marking" + "\n";
    } else {
      this.marking = 0;
    }

    if (
      fmPlayer.stats[FM_STAT.TACKLING] > 15 &&
      hasSpecialAbility(
        this.slidingPositions,
        this.registeredPosition,
        this.positions,
      )
    ) {
      this.sliding = 1;
      this.specialAbilitiesString += "* Sliding" + "\n";
    } else {
      this.sliding = 0;
    }
    if (
      fmPlayer.stats[FM_STAT.POSITIONING] > 15 &&
      hasSpecialAbility(
        this.coveringPositions,
        this.registeredPosition,
        this.positions,
      )
    ) {
      this.covering = 1;
      this.specialAbilitiesString += "* Covering" + "\n";
    } else {
      this.covering = 0;
    }

    if (
      (fmPlayer.stats[FM_STAT.COMPOSURE] + fmPlayer.stats[FM_STAT.LEADERSHIP]) /
        2 >
        15 &&
      hasSpecialAbility(
        this.dLineControlPositions,
        this.registeredPosition,
        this.positions,
      )
    ) {
      this.dLineControl = 1;
      this.specialAbilitiesString += "* D-Line control" + "\n";
    } else {
      this.dLineControl = 0;
    }

    if (
      (fmPlayer.stats[FM_STAT.COMPOSURE] +
        fmPlayer.stats[FM_STAT.ONE_ON_ONES]) /
        2 >
        15 &&
      this.registeredPosition == "GK"
    ) {
      this.penaltyStopper = 1;
      this.specialAbilitiesString += "* Penalty stopper" + "\n";
    } else {
      this.penaltyStopper = 0;
    }

    if (
      fmPlayer.stats[FM_STAT.ONE_ON_ONES] > 15 &&
      this.registeredPosition == "GK"
    ) {
      this.oneOnOneStopper = 1;
      this.specialAbilitiesString += "* 1-On-1 stopper" + "\n";
    } else {
      this.oneOnOneStopper = 0;
    }

    if (
      fmPlayer.stats[FM_STAT.LONG_THROWS] > 15 &&
      hasSpecialAbility(
        this.longThrowPositions,
        this.registeredPosition,
        this.positions,
      )
    ) {
      this.longThrow = 1;
      this.specialAbilitiesString += "* Long throw" + "\n";
    } else {
      this.longThrow = 0;
    }
    //return this.psdString();
  }

  /**
   * Fill PES5 stats from a scraped PESMaster player.
   * @param {PESMasterPlayerShape} pesMasterPlayer
   * @returns {void}
   */
  fromPesMasterPlayer(pesMasterPlayer) {
    this.name = pesMasterPlayer.name;
    this.shirtName = this.nameToShirtName(this.name);
    this.age = parseInt(pesMasterPlayer.info[PESMASTER_INFO.AGE]);
    this.nation = pesMasterPlayer.info[PESMASTER_INFO.NATIONALITY];
    this.nationality =
      pesMasterPlayer.info[PESMASTER_INFO.NATIONALITY] in pesIndieNationalities
        ? pesIndieNationalities[
            pesMasterPlayer.info[PESMASTER_INFO.NATIONALITY]
          ]
        : "Free Nationality";
    this.foot =
      pesMasterPlayer.info[PESMASTER_INFO.STRONGER_FOOT] == "Left" ? "L" : "R";
    this.favouredSide = getFavSide(pesMasterPlayer.positions, false);

    this.height = parseInt(pesMasterPlayer.info[PESMASTER_INFO.HEIGHT_CM]);
    this.weight = parseInt(pesMasterPlayer.info[PESMASTER_INFO.WEIGHT]);

    this.registeredPosition = efootballToPesPosition(
      pesMasterPlayer.info[PESMASTER_INFO.POSITION],
    );
    this.positions = [];

    let sideCounter = 0;
    let centerCounter = 0;
    let sidePositions = ["RB", "LB", "RMF", "LMF", "RWF", "LWF"];
    let centerPositions = ["CB", "DMF", "AMF"];

    for (let index = 0; index < pesMasterPlayer.positions.length; index++) {
      if (
        this.registeredPosition !=
          efootballToPesPosition(pesMasterPlayer.positions[index]) &&
        !this.positions.includes(
          efootballToPesPosition(pesMasterPlayer.positions[index]),
        )
      ) {
        this.positions.push(
          efootballToPesPosition(pesMasterPlayer.positions[index]),
        );
        if (sidePositions.includes(pesMasterPlayer.positions[index]))
          sideCounter++;
        if (centerPositions.includes(pesMasterPlayer.positions[index]))
          centerCounter++;
      }
    }

    this.injuryTolerance = efootballInjuryResistance(
      pesMasterPlayer.characteristics[
        PESMASTER_CHARACTERISTIC.INJURY_RESISTANCE
      ],
    );

    this.attack = pesMasterPlayer.stats[PESMASTER_STAT.OFFENSIVE_AWARENESS];
    this.defence = pesMasterPlayer.stats[PESMASTER_STAT.DEFENSIVE_AWARENESS];
    this.balance = pesMasterPlayer.stats[PESMASTER_STAT.PHYSICAL_CONTACT];
    this.stamina = pesMasterPlayer.stats[PESMASTER_STAT.STAMINA];
    this.topSpeed = pesMasterPlayer.stats[PESMASTER_STAT.SPEED];
    this.acceleration = pesMasterPlayer.stats[PESMASTER_STAT.ACCELERATION];
    this.response = Math.round(
      average([
        pesMasterPlayer.stats[PESMASTER_STAT.ACCELERATION],
        pesMasterPlayer.stats[PESMASTER_STAT.OFFENSIVE_AWARENESS],
        pesMasterPlayer.stats[PESMASTER_STAT.TIGHT_POSSESSION],
      ]),
    );
    this.agility = Math.round(
      average([
        pesMasterPlayer.stats[PESMASTER_STAT.BALL_CONTROL],
        pesMasterPlayer.stats[PESMASTER_STAT.TIGHT_POSSESSION],
        pesMasterPlayer.stats[PESMASTER_STAT.BALANCE],
      ]),
    );
    this.dribbleAccuracy = pesMasterPlayer.stats[PESMASTER_STAT.DRIBBLING];
    this.dribbleSpeed = Math.round(
      average([
        pesMasterPlayer.stats[PESMASTER_STAT.DRIBBLING],
        pesMasterPlayer.stats[PESMASTER_STAT.SPEED],
      ]),
    );
    this.shortPassAccuracy = pesMasterPlayer.stats[PESMASTER_STAT.LOW_PASS];
    this.shortPassSpeed = Math.round(
      average([
        pesMasterPlayer.stats[PESMASTER_STAT.LOW_PASS],
        pesMasterPlayer.stats[PESMASTER_STAT.KICKING_POWER],
      ]),
    );
    this.longPassAccuracy = pesMasterPlayer.stats[PESMASTER_STAT.LOFTED_PASS];
    this.longPassSpeed = Math.round(
      average([
        pesMasterPlayer.stats[PESMASTER_STAT.LOFTED_PASS],
        pesMasterPlayer.stats[PESMASTER_STAT.KICKING_POWER],
      ]),
    );
    this.shotAccuracy = pesMasterPlayer.stats[PESMASTER_STAT.FINISHING];
    this.shotPower = pesMasterPlayer.stats[PESMASTER_STAT.KICKING_POWER];
    this.shotTechnique = Math.round(
      average([
        pesMasterPlayer.stats[PESMASTER_STAT.FINISHING],
        pesMasterPlayer.stats[PESMASTER_STAT.BALL_CONTROL],
      ]),
    );
    this.freeKickAccuracy =
      pesMasterPlayer.stats[PESMASTER_STAT.SET_PIECE_TAKING];
    this.curling = pesMasterPlayer.stats[PESMASTER_STAT.CURL];
    this.header = pesMasterPlayer.stats[PESMASTER_STAT.HEADING];
    this.jump = pesMasterPlayer.stats[PESMASTER_STAT.JUMPING];
    this.technique = pesMasterPlayer.stats[PESMASTER_STAT.BALL_CONTROL];
    this.goalkeeping = 50;
    this.aggression = Math.round(
      0.8 * pesMasterPlayer.stats[PESMASTER_STAT.OFFENSIVE_AWARENESS] +
        0.2 * pesMasterPlayer.stats[PESMASTER_STAT.AGGRESSION],
    );
    this.mentality = Math.round(
      average([
        pesMasterPlayer.stats[PESMASTER_STAT.OFFENSIVE_AWARENESS],
        pesMasterPlayer.stats[PESMASTER_STAT.TIGHT_POSSESSION],
        pesMasterPlayer.stats[PESMASTER_STAT.DEFENSIVE_AWARENESS],
        pesMasterPlayer.stats[PESMASTER_STAT.AGGRESSION],
      ]),
    );
    this.teamwork = Math.round(
      average([
        pesMasterPlayer.stats[PESMASTER_STAT.TIGHT_POSSESSION],
        pesMasterPlayer.stats[PESMASTER_STAT.LOW_PASS],
        pesMasterPlayer.stats[PESMASTER_STAT.LOFTED_PASS],
      ]),
    );
    this.consistency = this.calculateConsistency(
      average([
        pesMasterPlayer.stats[PESMASTER_STAT.STAMINA],
        pesMasterPlayer.overall,
      ]),
    );
    this.condition = efootballCondition(
      pesMasterPlayer.info[PESMASTER_INFO.CONDITION],
    );
    this.weakFootAccuracy = efootballWeakFoot(
      pesMasterPlayer.characteristics[PESMASTER_CHARACTERISTIC.WEAK_FOOT_ACC],
      pesMasterPlayer.stats[PESMASTER_STAT.BALL_CONTROL],
    );
    this.weakFootFrequency = efootballWeakFoot(
      pesMasterPlayer.characteristics[PESMASTER_CHARACTERISTIC.WEAK_FOOT_USAGE],
      pesMasterPlayer.stats[PESMASTER_STAT.BALL_CONTROL],
    );

    switch (this.registeredPosition) {
      case "GK":
        this.attack = 35;
        this.defence = Math.round(
          0.9 * pesMasterPlayer.stats[PESMASTER_STAT.GK_AWARENESS] +
            0.1 * pesMasterPlayer.stats[PESMASTER_STAT.DEFENSIVE_AWARENESS],
        );
        this.response = Math.round(
          0.8 * pesMasterPlayer.stats[PESMASTER_STAT.GK_AWARENESS] +
            0.2 * pesMasterPlayer.stats[PESMASTER_STAT.ACCELERATION],
        );
        this.agility = Math.round(
          0.3 * pesMasterPlayer.stats[PESMASTER_STAT.GK_REFLEXES] +
            0.7 * pesMasterPlayer.stats[PESMASTER_STAT.BALANCE],
        );
        this.aggression = Math.round(
          0.6 * pesMasterPlayer.stats[PESMASTER_STAT.AGGRESSION] +
            0.4 * pesMasterPlayer.stats[PESMASTER_STAT.GK_AWARENESS],
        );
        this.mentality = Math.round(
          0.7 * pesMasterPlayer.stats[PESMASTER_STAT.GK_AWARENESS] +
            0.3 * pesMasterPlayer.stats[PESMASTER_STAT.DEFENSIVE_AWARENESS],
        );
        this.goalkeeping = Math.round(
          average([
            pesMasterPlayer.stats[PESMASTER_STAT.GK_AWARENESS],
            pesMasterPlayer.stats[PESMASTER_STAT.GK_REACH],
          ]),
        );
        this.teamwork = Math.round(
          average([
            pesMasterPlayer.stats[PESMASTER_STAT.OFFENSIVE_AWARENESS],
            pesMasterPlayer.stats[PESMASTER_STAT.LOW_PASS],
            pesMasterPlayer.stats[PESMASTER_STAT.LOFTED_PASS],
          ]),
        );
        break;
      case "CBT":
      case "CWP":
      case "SB":
        this.response = Math.round(
          average([
            pesMasterPlayer.stats[PESMASTER_STAT.ACCELERATION],
            pesMasterPlayer.stats[PESMASTER_STAT.DEFENSIVE_ENGAGEMENT],
            pesMasterPlayer.stats[PESMASTER_STAT.DEFENSIVE_AWARENESS],
          ]),
        );
        this.teamwork = Math.round(
          average([
            pesMasterPlayer.stats[PESMASTER_STAT.OFFENSIVE_AWARENESS],
            pesMasterPlayer.stats[PESMASTER_STAT.LOW_PASS],
            pesMasterPlayer.stats[PESMASTER_STAT.LOFTED_PASS],
            pesMasterPlayer.stats[PESMASTER_STAT.DEFENSIVE_AWARENESS],
          ]),
        );
        break;
      case "DMF":
      case "WB":
      case "CMF":
      case "SMF":
      case "AMF":
        this.response = Math.round(
          average([
            pesMasterPlayer.stats[PESMASTER_STAT.ACCELERATION],
            pesMasterPlayer.stats[PESMASTER_STAT.DEFENSIVE_ENGAGEMENT],
            pesMasterPlayer.stats[PESMASTER_STAT.TIGHT_POSSESSION],
          ]),
        );
        break;
    }
    // Special abilities
    if (
      pesMasterPlayer.specialStats.includes(PESMASTER_SKILL.MAZING_RUN) ||
      pesMasterPlayer.specialStats.includes(
        PESMASTER_SKILL.STEP_ON_SKILL_CONTROL,
      ) ||
      pesMasterPlayer.specialStats.includes(PESMASTER_SKILL.MARSEILLE_TURN) ||
      pesMasterPlayer.specialStats.includes(PESMASTER_SKILL.TRICKSTER) ||
      pesMasterPlayer.specialStats.includes(PESMASTER_SKILL.FLIP_FLAP)
    ) {
      this.dribbling = 1;
      this.specialAbilitiesString += "* Dribbling" + "\n";
    } else {
      this.dribbling = 0;
    }

    if (
      pesMasterPlayer.specialStats.includes(PESMASTER_SKILL.GAMESMANSHIP) ||
      pesMasterPlayer.stats[PESMASTER_STAT.BALL_CONTROL] > 85
    ) {
      this.tacticalDribble = 1;
      this.specialAbilitiesString += "* Tactical dribble" + "\n";
    } else {
      this.tacticalDribble = 0;
    }

    if (
      (pesMasterPlayer.specialStats.includes(PESMASTER_SKILL.GOAL_POACHER) ||
        pesMasterPlayer.specialStats.includes(PESMASTER_SKILL.HOLE_PLAYER)) &&
      hasSpecialAbility(
        this.positioningPositions,
        this.registeredPosition,
        this.positions,
      )
    ) {
      this.positioning = 1;
      this.specialAbilitiesString += "* Positioning" + "\n";
    } else {
      this.positioning = 0;
    }

    if (
      this.response > 90 &&
      hasSpecialAbility(
        this.reactionPositions,
        this.registeredPosition,
        this.positions,
      )
    ) {
      this.reaction = 1;
      this.specialAbilitiesString += "* Reaction" + "\n";
    } else {
      this.reaction = 0;
    }

    if (
      pesMasterPlayer.specialStats.includes(PESMASTER_SKILL.CAPTAINCY) &&
      hasSpecialAbility(
        this.playmakingPositions,
        this.registeredPosition,
        this.positions,
      )
    ) {
      this.playmaking = 1;
      this.specialAbilitiesString += "* Playmaking" + "\n";
    } else {
      this.playmaking = 0;
    }

    if (
      ((pesMasterPlayer.specialStats.includes(PESMASTER_SKILL.NO_LOOK_PASS) &&
        pesMasterPlayer.specialStats.includes(
          PESMASTER_SKILL.THROUGH_PASSING,
        )) ||
        pesMasterPlayer.specialStats.includes(PESMASTER_SKILL.ORCHESTRATOR) ||
        pesMasterPlayer.stats[PESMASTER_STAT.LOW_PASS] > 90) &&
      hasSpecialAbility(
        this.passingPositions,
        this.registeredPosition,
        this.positions,
      )
    ) {
      this.passing = 1;
      this.specialAbilitiesString += "* Passing" + "\n";
    } else {
      this.passing = 0;
    }

    if (
      pesMasterPlayer.specialStats.includes(PESMASTER_SKILL.FOX_IN_THE_BOX) &&
      hasSpecialAbility(
        this.scoringPositions,
        this.registeredPosition,
        this.positions,
      )
    ) {
      this.scoring = 1;
      this.specialAbilitiesString += "* Scoring" + "\n";
    } else {
      this.scoring = 0;
    }

    if (
      (pesMasterPlayer.specialStats.includes(
        PESMASTER_SKILL.CHIP_SHOT_CONTROL,
      ) ||
        this.mentality > 90) &&
      hasSpecialAbility(
        this.oneOnOneScoringPositions,
        this.registeredPosition,
        this.positions,
      )
    ) {
      this.oneOnOneScoring = 1;
      this.specialAbilitiesString += "* 1-1 Scoring" + "\n";
    } else {
      this.oneOnOneScoring = 0;
    }

    if (
      pesMasterPlayer.specialStats.includes(PESMASTER_SKILL.TRACK_BACK) &&
      pesMasterPlayer.specialStats.includes(PESMASTER_SKILL.THE_DESTROYER) &&
      hasSpecialAbility(
        this.postPlayerPositions,
        this.registeredPosition,
        this.positions,
      )
    ) {
      this.postPlayer = 1;
      this.specialAbilitiesString += "* Post player" + "\n";
    } else {
      this.postPlayer = 0;
    }

    if (
      pesMasterPlayer.specialStats.includes(PESMASTER_SKILL.SPEEDING_BULLET) &&
      hasSpecialAbility(
        this.linesPositions,
        this.registeredPosition,
        this.positions,
      )
    ) {
      this.lines = 1;
      this.specialAbilitiesString += "* Lines" + "\n";
    } else {
      this.lines = 0;
    }

    if (
      (pesMasterPlayer.specialStats.includes(PESMASTER_SKILL.LONG_RANGER) ||
        pesMasterPlayer.specialStats.includes(
          PESMASTER_SKILL.LONG_RANGE_SHOOTING,
        )) &&
      hasSpecialAbility(
        this.middleShootingPositions,
        this.registeredPosition,
        this.positions,
      )
    ) {
      this.middleShooting = 1;
      this.specialAbilitiesString += "* Middle shooting" + "\n";
    } else {
      this.middleShooting = 0;
    }
    if (
      (pesMasterPlayer.specialStats.includes(PESMASTER_SKILL.PROLIFIC_WINGER) ||
        pesMasterPlayer.specialStats.includes(
          PESMASTER_SKILL.OFFENSIVE_FULL_BACK,
        ) ||
        pesMasterPlayer.specialStats.includes(
          PESMASTER_SKILL.DEFENSIVE_FULL_BACK,
        ) ||
        pesMasterPlayer.specialStats.includes(
          PESMASTER_SKILL.FULL_BACK_FINISHER,
        ) ||
        pesMasterPlayer.specialStats.includes(PESMASTER_SKILL.ROAMING_FLANK)) &&
      sideCounter > 2
    ) {
      this.side = 1;
      this.specialAbilitiesString += "* Side" + "\n";
    } else {
      this.side = 0;
    }

    if (
      (pesMasterPlayer.specialStats.includes(PESMASTER_SKILL.BUILD_UP) ||
        pesMasterPlayer.specialStats.includes(
          PESMASTER_SKILL.DEEP_LYING_FORWARD,
        ) ||
        pesMasterPlayer.specialStats.includes(PESMASTER_SKILL.BOX_TO_BOX)) &&
      centerCounter > 2
    ) {
      this.centre = 1;
      this.specialAbilitiesString += "* Centre" + "\n";
    } else {
      this.centre = 0;
    }
    if (
      pesMasterPlayer.specialStats.includes(PESMASTER_SKILL.PENALTY_SPECIALIST)
    ) {
      this.penalties = 1;
      this.specialAbilitiesString += "* Penalties" + "\n";
    } else {
      this.penalties = 0;
    }

    if (
      pesMasterPlayer.specialStats.includes(PESMASTER_SKILL.ONE_TOUCH_PASS) &&
      hasSpecialAbility(
        this.oneTouchPassPositions,
        this.registeredPosition,
        this.positions,
      )
    ) {
      this.oneTouchPass = 1;
      this.specialAbilitiesString += "* 1-Touch pass" + "\n";
    } else {
      this.oneTouchPass = 0;
    }

    if (pesMasterPlayer.specialStats.includes(PESMASTER_SKILL.KNUCKLE_SHOT)) {
      this.outside = 1;
      this.specialAbilitiesString += "* Outside" + "\n";
    } else {
      this.outside = 0;
    }

    if (
      this.defence > 90 &&
      hasSpecialAbility(
        this.markingPositions,
        this.registeredPosition,
        this.positions,
      )
    ) {
      this.marking = 1;
      this.specialAbilitiesString += "* Marking" + "\n";
    } else {
      this.marking = 0;
    }

    if (
      pesMasterPlayer.specialStats.includes(PESMASTER_SKILL.INTERCEPTION) &&
      pesMasterPlayer.specialStats.includes(PESMASTER_SKILL.THE_DESTROYER) &&
      hasSpecialAbility(
        this.slidingPositions,
        this.registeredPosition,
        this.positions,
      )
    ) {
      this.sliding = 1;
      this.specialAbilitiesString += "* Sliding" + "\n";
    } else {
      this.sliding = 0;
    }
    if (
      pesMasterPlayer.specialStats.includes(PESMASTER_SKILL.MAN_MARKING) &&
      hasSpecialAbility(
        this.coveringPositions,
        this.registeredPosition,
        this.positions,
      )
    ) {
      this.covering = 1;
      this.specialAbilitiesString += "* Covering" + "\n";
    } else {
      this.covering = 0;
    }

    if (
      pesMasterPlayer.specialStats.includes(PESMASTER_SKILL.CAPTAINCY) &&
      this.defence > 90 &&
      hasSpecialAbility(
        this.dLineControlPositions,
        this.registeredPosition,
        this.positions,
      )
    ) {
      this.dLineControl = 1;
      this.specialAbilitiesString += "* D-Line control" + "\n";
    } else {
      this.dLineControl = 0;
    }

    if (
      pesMasterPlayer.specialStats.includes(PESMASTER_SKILL.GK_PENALTY_SAVER) &&
      this.registeredPosition == "GK"
    ) {
      this.penaltyStopper = 1;
      this.specialAbilitiesString += "* Penalty stopper" + "\n";
    } else {
      this.penaltyStopper = 0;
    }

    if (
      pesMasterPlayer.specialStats.includes(
        PESMASTER_SKILL.DEFENSIVE_GOALKEEPER,
      ) &&
      this.registeredPosition == "GK"
    ) {
      this.oneOnOneStopper = 1;
      this.specialAbilitiesString += "* 1-On-1 stopper" + "\n";
    } else {
      this.oneOnOneStopper = 0;
    }

    if (
      pesMasterPlayer.specialStats.includes(PESMASTER_SKILL.LONG_THROW) &&
      hasSpecialAbility(
        this.longThrowPositions,
        this.registeredPosition,
        this.positions,
      )
    ) {
      this.longThrow = 1;
      this.specialAbilitiesString += "* Long throw" + "\n";
    } else {
      this.longThrow = 0;
    }
    //return this.psdString();
  }
}
