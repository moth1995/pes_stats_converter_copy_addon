"use strict";

/**
 * Converter producing PES 21/20 output (PSD text or CSV) from scraped FIFA,
 * Football Manager, or eFootball player data.
 */
class PES21Player {
  constructor() {
    this.reputation = 3;
    this.playerSkills = "";
    this.COMPlayingStyles = "";
    this.playingStyle = "";
    this.positionsNumbers = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

    /** @type {number} */
    this.acceleration = 0;
    /** @type {number} */
    this.acrobaticClear = 0;
    /** @type {number} */
    this.acrobaticFinishing = 0;
    /** @type {number} */
    this.age = 0;
    /** @type {number} */
    this.aggression = 0;
    /** @type {number} */
    this.balance = 0;
    /** @type {number} */
    this.ballControl = 0;
    /** @type {number} */
    this.ballWinning = 0;
    /** @type {number} */
    this.captaincy = 0;
    /** @type {number} */
    this.chipShotControl = 0;
    /** @type {number} */
    this.condition = 0;
    /** @type {number} */
    this.crossOverTurn = 0;
    /** @type {number} */
    this.curl = 0;
    /** @type {number} */
    this.currentAbility = 0;
    /** @type {number} */
    this.cutBehindAndTurn = 0;
    /** @type {number} */
    this.defensiveAwareness = 0;
    /** @type {number} */
    this.dippingShot = 0;
    /** @type {number} */
    this.doubleTouch = 0;
    /** @type {number} */
    this.dribbling = 0;
    /** @type {number} */
    this.earlyCross = 0;
    /** @type {number} */
    this.fightingSpirit = 0;
    /** @type {number} */
    this.finishing = 0;
    /** @type {number} */
    this.firstTimeShot = 0;
    /** @type {number} */
    this.flipFlap = 0;
    /** @type {string} */
    this.foot = "";
    /** @type {number} */
    this.form = 0;
    /** @type {number} */
    this.gamesmanship = 0;
    /** @type {number} */
    this.gkAwareness = 0;
    /** @type {number} */
    this.gkCatching = 0;
    /** @type {number} */
    this.gkClearing = 0;
    /** @type {number} */
    this.gkHighPunt = 0;
    /** @type {number} */
    this.gkLongThrow = 0;
    /** @type {number} */
    this.gkLowPunt = 0;
    /** @type {number} */
    this.gkPenaltySaver = 0;
    /** @type {number} */
    this.gkReach = 0;
    /** @type {number} */
    this.gkReflexes = 0;
    /** @type {number} */
    this.heading = 0;
    /** @type {number} */
    this.headingPlayerSkill = 0;
    /** @type {number} */
    this.heelTrick = 0;
    /** @type {number} */
    this.height = 0;
    /** @type {number} */
    this.incisiveRun = 0;
    /** @type {number} */
    this.injuryTolerance = 0;
    /** @type {number} */
    this.interception = 0;
    /** @type {number} */
    this.jump = 0;
    /** @type {number} */
    this.kickingPower = 0;
    /** @type {number} */
    this.knuckleShots = 0;
    /** @type {number} */
    this.loftedPass = 0;
    /** @type {number} */
    this.longBallExpert = 0;
    /** @type {number} */
    this.longRangeDrive = 0;
    /** @type {number} */
    this.longRanger = 0;
    /** @type {number} */
    this.longRangeShooting = 0;
    /** @type {number} */
    this.longThrow = 0;
    /** @type {number} */
    this.lowLoftedPass = 0;
    /** @type {number} */
    this.lowPass = 0;
    /** @type {number} */
    this.manMarking = 0;
    /** @type {number} */
    this.marseilleTurn = 0;
    /** @type {number} */
    this.mazingRun = 0;
    /** @type {string} */
    this.name = "";
    /** @type {string} */
    this.nation = "";
    /** @type {string} */
    this.nationality = "";
    /** @type {number} */
    this.noLookPass = 0;
    /** @type {number} */
    this.offensiveAwareness = 0;
    /** @type {number} */
    this.oneTouchPass = 0;
    /** @type {number} */
    this.outsideCurler = 0;
    /** @type {number} */
    this.penaltySpecialist = 0;
    /** @type {number} */
    this.physicalContact = 0;
    /** @type {number} */
    this.pinpointCrossing = 0;
    /** @type {number} */
    this.placeKicking = 0;
    /** @type {string[]} */
    this.positions = [];
    /** @type {number} */
    this.rabona = 0;
    /** @type {string} */
    this.registeredPosition = "";
    /** @type {number} */
    this.risingShots = 0;
    /** @type {number} */
    this.scissorsFeint = 0;
    /** @type {number} */
    this.scotchMove = 0;
    /** @type {string} */
    this.shirtName = "";
    /** @type {number} */
    this.sombrero = 0;
    /** @type {number} */
    this.speed = 0;
    /** @type {number} */
    this.speedingBullet = 0;
    /** @type {number} */
    this.stamina = 0;
    /** @type {number} */
    this.stepOneBallControl = 0;
    /** @type {number} */
    this.superSub = 0;
    /** @type {number} */
    this.throughPassing = 0;
    /** @type {number} */
    this.tightPossession = 0;
    /** @type {number} */
    this.trackBack = 0;
    /** @type {number} */
    this.trickster = 0;
    /** @type {number} */
    this.weakFootAccuracy = 0;
    /** @type {number} */
    this.weakFootUsage = 0;
    /** @type {number} */
    this.weight = 0;
    /** @type {number} */
    this.weightedPass = 0;
  }

  /**
   * Build the PES21 shirt name (flattened, not padded).
   * @param {string} name - Full player name.
   * @returns {string} The formatted shirt name.
   */
  nameToShirtName(name) {
    // PES21 does not pad shirt names with spaces.
    return shirtName(name);
  }

  /**
   * Render the player as PSD clipboard text.
   * @returns {string} The PSD text block.
   */
  psdString() {
    return `Name: ${this.name}
Shirt Name: ${this.shirtName}
Nationality: ${this.nationality}
Age: ${this.age}
Foot: ${this.foot}
Registered Position: ${this.registeredPosition}
Positions: ${this.positions}
Reputation: ${this.reputation}

APPEARANCE:
Height: ${this.height} cm
Weight: ${this.weight} kg

STATS:
Offensive Awareness: ${this.offensiveAwareness}
Ball Control: ${this.ballControl}
Dribbling: ${this.dribbling}
Tight Possession: ${this.tightPossession}
Low Pass: ${this.lowPass}
Lofted Pass: ${this.loftedPass}
Finishing: ${this.finishing}
Heading: ${this.heading}
Place Kicking: ${this.placeKicking}
Curl: ${this.curl}
Speed: ${this.speed}
Acceleration: ${this.acceleration}
Kicking Power: ${this.kickingPower}
Jump: ${this.jump}
Physical Contact: ${this.physicalContact}
Balance: ${this.balance}
Stamina: ${this.stamina}
Defensive Awareness: ${this.defensiveAwareness}
Ball Winning: ${this.ballWinning}
Aggression: ${this.aggression}
GK Awareness: ${this.gkAwareness}
GK Catching: ${this.gkCatching}
GK Clearing: ${this.gkClearing}
GK Reflexes: ${this.gkReflexes}
GK Reach: ${this.gkReach}
Weak Foot Usage: ${this.weakFootUsage}
Weak Foot Accuracy: ${this.weakFootAccuracy}
Conditioning: ${this.form}
Injury Resistance: ${this.injuryTolerance}

CARD PLAYER SKILL:
${this.playerSkills}
CARD STYLE COM:
${this.COMPlayingStyles}
PLAYING STYLE:
${this.playingStyle}
`;
  }

  /**
   * Render the player as a single PES21 CSV row (semicolon-separated).
   * @returns {string} The semicolon-separated row.
   */
  csvString() {
    let foot = this.foot == "L" ? "True" : "False";

    this.positions.forEach((position) => {
      let positionNoStar = position.replace("*", "");
      let index = this.pes21PosToNum(positionNoStar);
      this.positionsNumbers[index] = 1;

      if (position.indexOf("*") > -1) {
        this.positionsNumbers[index] = 2;
      }
    });

    return `;\
${this.name};\
${this.name};\
${this.shirtName};\
${this.shirtName};\
-1;\
${this.pes21NationToNum(this.nationality)};\
0;\
${this.height};\
${this.weight};\
${this.age};\
${foot};\
${this.pes21PlayingStyleToNumber(this.playingStyle)};\
${this.pes21PosToNum(this.registeredPosition)};\
${this.positionsNumbers.join(";")};\
${this.offensiveAwareness};\
${this.ballControl};\
${this.dribbling};\
${this.tightPossession};\
${this.lowPass};\
${this.loftedPass};\
${this.finishing};\
${this.heading};\
${this.placeKicking};\
${this.curl};\
${this.speed};\
${this.acceleration};\
${this.kickingPower};\
${this.jump};\
${this.physicalContact};\
${this.balance};\
${this.stamina};\
${this.defensiveAwareness};\
${this.ballWinning};\
${this.aggression};\
${this.gkAwareness};\
${this.gkCatching};\
${this.gkClearing};\
${this.gkReflexes};\
${this.gkReach};\
${this.weakFootUsage};\
${this.weakFootAccuracy};\
${this.form};\
${this.injuryTolerance};\
${this.reputation};\
2;\
${this.csvSkillEvaluator(this.trickster)};\
${this.csvSkillEvaluator(this.mazingRun)};\
${this.csvSkillEvaluator(this.speedingBullet)};\
${this.csvSkillEvaluator(this.incisiveRun)};\
${this.csvSkillEvaluator(this.longBallExpert)};\
${this.csvSkillEvaluator(this.earlyCross)};\
${this.csvSkillEvaluator(this.longRanger)};\
${this.csvSkillEvaluator(this.scissorsFeint)};\
${this.csvSkillEvaluator(this.doubleTouch)};\
${this.csvSkillEvaluator(this.flipFlap)};\
${this.csvSkillEvaluator(this.marseilleTurn)};\
${this.csvSkillEvaluator(this.sombrero)};\
${this.csvSkillEvaluator(this.crossOverTurn)};\
${this.csvSkillEvaluator(this.cutBehindAndTurn)};\
${this.csvSkillEvaluator(this.scotchMove)};\
${this.csvSkillEvaluator(this.stepOneBallControl)};\
${this.csvSkillEvaluator(this.headingPlayerSkill)};\
${this.csvSkillEvaluator(this.longRangeDrive)};\
${this.csvSkillEvaluator(this.chipShotControl)};\
${this.csvSkillEvaluator(this.longRangeShooting)};\
${this.csvSkillEvaluator(this.knuckleShots)};\
${this.csvSkillEvaluator(this.dippingShot)};\
${this.csvSkillEvaluator(this.risingShots)};\
${this.csvSkillEvaluator(this.acrobaticFinishing)};\
${this.csvSkillEvaluator(this.heelTrick)};\
${this.csvSkillEvaluator(this.firstTimeShot)};\
${this.csvSkillEvaluator(this.oneTouchPass)};\
${this.csvSkillEvaluator(this.throughPassing)};\
${this.csvSkillEvaluator(this.weightedPass)};\
${this.csvSkillEvaluator(this.pinpointCrossing)};\
${this.csvSkillEvaluator(this.outsideCurler)};\
${this.csvSkillEvaluator(this.rabona)};\
${this.csvSkillEvaluator(this.noLookPass)};\
${this.csvSkillEvaluator(this.lowLoftedPass)};\
${this.csvSkillEvaluator(this.gkLowPunt)};\
${this.csvSkillEvaluator(this.gkHighPunt)};\
${this.csvSkillEvaluator(this.longThrow)};\
${this.csvSkillEvaluator(this.gkLongThrow)};\
${this.csvSkillEvaluator(this.penaltySpecialist)};\
${this.csvSkillEvaluator(this.gkPenaltySaver)};\
${this.csvSkillEvaluator(this.gamesmanship)};\
${this.csvSkillEvaluator(this.manMarking)};\
${this.csvSkillEvaluator(this.trackBack)};\
${this.csvSkillEvaluator(this.interception)};\
${this.csvSkillEvaluator(this.acrobaticClear)};\
${this.csvSkillEvaluator(this.captaincy)};\
${this.csvSkillEvaluator(this.superSub)};\
${this.csvSkillEvaluator(this.fightingSpirit)};\
0;\
0;\
1;\
1;\
1;\
1;\
1;\
1;\
1;\
1;\
0;\
0;\
01/01/0001 00:00:00;\
01/01/0001 00:00:00;\
0;\
0;\
False;\
${foot};\
False;\
False;\
False;\
False;\
False;\
False;\
False;\
False;\
False;\
False;\
False;\
False;\
False;\
False;\
False;\
False;\
False;\
0;\
False;\
-1;\
0;\
0;\
0;\
0;\
0;\
False;\
0;`;
  }

  /**
   * Render a 0/1 skill flag as the CSV's boolean text.
   * @param {number} skill - The skill flag (0 or 1).
   * @returns {"True"|"False"} The CSV representation.
   */
  csvSkillEvaluator(skill) {
    return skill > 0 ? "True" : "False";
  }

  /**
   * Map a PES21 playing-style name to its editor id.
   * @param {string} playingStyle - The playing-style name ('' for none).
   * @returns {number} The playing-style id.
   */
  pes21PlayingStyleToNumber(playingStyle) {
    switch (playingStyle) {
      case "":
        return 0;
      case "Goal Poacher":
        return 1;
      case "Dummy Runner":
        return 2;
      case "Fox in the Box":
        return 3;
      case "Prolific Winger":
        return 4;
      case "Classic No. 10":
        return 5;
      case "Hole Player":
        return 6;
      case "Box-to-Box":
        return 7;
      case "Anchor Man":
        return 8;
      case "The Destroyer":
        return 9;
      case "Extra Frontman":
        return 10;
      case "Offensive Full-back":
        return 11;
      case "Defensive Full-back":
        return 12;
      case "Target Man":
        return 13;
      case "Creative Playmaker":
        return 14;
      case "Build Up":
        return 15;
      case "Offensive Goalkeeper":
        return 16;
      case "Defensive Goalkeeper":
        return 17;
      case "Roaming Flank":
        return 18;
      case "Cross Specialist":
        return 19;
      case "Orchestrator":
        return 20;
      case "Full-back Finisher":
        return 21;
      default:
        return 0;
    }
  }

  /**
   * Map a PES21 position code to its editor slot number.
   * @param {string} position - PES21 position code.
   * @returns {number} The slot number, or 0 when unmapped.
   */
  pes21PosToNum(position) {
    switch (position) {
      case "GK":
        return 0;
      case "CB":
        return 1;
      case "LB":
        return 2;
      case "RB":
        return 3;
      case "DMF":
        return 4;
      case "CMF":
        return 5;
      case "LMF":
        return 6;
      case "RMF":
        return 7;
      case "AMF":
        return 8;
      case "LWF":
        return 9;
      case "RWF":
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
   * Map a nation name to its PES21 country id.
   * @param {string} nation - The nation name.
   * @returns {number} The country id, or 0 when unknown.
   */
  pes21NationToNum(nation) {
    return PES21_COUNTRY_MAP[nation] !== undefined
      ? PES21_COUNTRY_MAP[nation]
      : 0;
  }

  /**
   * Map a FIFA stat to a PES21 form rating.
   * @param {number} fifaStat - The FIFA stat value.
   * @returns {number} A form rating (1-8).
   */
  convertFifaStatToPes21Form(fifaStat) {
    fifaStat = this.convertFifaStatToPes21(fifaStat);

    let form = 4;

    if (40 <= fifaStat && fifaStat < 61) {
      form = 1;
    } else if (61 <= fifaStat && fifaStat < 66) {
      form = 2;
    } else if (66 <= fifaStat && fifaStat < 71) {
      form = 3;
    } else if (71 <= fifaStat && fifaStat < 76) {
      form = 4;
    } else if (76 <= fifaStat && fifaStat < 81) {
      form = 5;
    } else if (81 <= fifaStat && fifaStat < 86) {
      form = 6;
    } else if (86 <= fifaStat && fifaStat < 94) {
      form = 7;
    } else if (94 <= fifaStat) {
      form = 8;
    }

    return form;
  }

  /**
   * Rescale a FIFA 0-99 stat onto the PES21 stat curve.
   * @param {number} fifaStat - The FIFA stat value.
   * @returns {number} The PES21 stat value.
   */
  convertFifaStatToPes21(fifaStat) {
    fifaStat = Math.round(fifaStat);
    const mapping = [
      { fifa: [99, 99], pes: 99 },
      { fifa: [98, 98], pes: 98 },
      { fifa: [97, 97], pes: 97 },
      { fifa: [96, 96], pes: 96 },
      { fifa: [95, 95], pes: 95 },
      { fifa: [94, 94], pes: 94 },
      { fifa: [93, 93], pes: 93 },
      { fifa: [92, 92], pes: 92 },
      { fifa: [91, 91], pes: 91 },
      { fifa: [90, 90], pes: 90 },
      { fifa: [89, 89], pes: 89 },
      { fifa: [88, 88], pes: 88 },
      { fifa: [87, 87], pes: 87 },
      { fifa: [86, 86], pes: 86 },
      { fifa: [85, 85], pes: 85 },
      { fifa: [84, 84], pes: 84 },
      { fifa: [83, 83], pes: 83 },
      { fifa: [82, 82], pes: 82 },
      { fifa: [81, 81], pes: 81 },
      { fifa: [80, 80], pes: 80 },
      { fifa: [79, 78], pes: 79 },
      { fifa: [77, 76], pes: 78 },
      { fifa: [75, 74], pes: 77 },
      { fifa: [73, 72], pes: 76 },
      { fifa: [71, 70], pes: 75 },
      { fifa: [69, 68], pes: 74 },
      { fifa: [67, 66], pes: 73 },
      { fifa: [65, 64], pes: 72 },
      { fifa: [63, 62], pes: 71 },
      { fifa: [61, 60], pes: 70 },
      { fifa: [59, 58], pes: 69 },
      { fifa: [57, 56], pes: 68 },
      { fifa: [55, 54], pes: 67 },
      { fifa: [53, 52], pes: 66 },
      { fifa: [51, 50], pes: 65 },
      { fifa: [49, 48], pes: 64 },
      { fifa: [47, 46], pes: 63 },
      { fifa: [45, 44], pes: 62 },
      { fifa: [43, 42], pes: 61 },
      { fifa: [41, 40], pes: 60 },
      { fifa: [39, 38], pes: 59 },
      { fifa: [37, 36], pes: 58 },
      { fifa: [35, 34], pes: 57 },
      { fifa: [33, 32], pes: 56 },
      { fifa: [31, 30], pes: 55 },
      { fifa: [29, 28], pes: 54 },
      { fifa: [27, 26], pes: 53 },
      { fifa: [25, 24], pes: 52 },
      { fifa: [23, 22], pes: 51 },
      { fifa: [21, 20], pes: 50 },
      { fifa: [19, 18], pes: 49 },
      { fifa: [17, 16], pes: 48 },
      { fifa: [15, 14], pes: 47 },
      { fifa: [13, 12], pes: 46 },
      { fifa: [11, 10], pes: 45 },
      { fifa: [9, 8], pes: 44 },
      { fifa: [7, 6], pes: 43 },
      { fifa: [5, 4], pes: 42 },
      { fifa: [3, 2], pes: 41 },
      { fifa: [1, 0], pes: 40 },
    ];

    for (const entry of mapping) {
      const [max, min] = entry.fifa;
      if (min <= fifaStat && fifaStat <= max) {
        return clamp(40, 99, entry.pes);
      }
    }

    return 40;
  }

  /**
   * Fill PES21 stats from a scraped SoFIFA player.
   * @param {FIFAPlayer} fifaPlayer
   * @returns {void}
   */
  fromFIFA17To23Player(fifaPlayer) {
    this.name = fifaPlayer.name;
    this.shirtName = this.nameToShirtName(this.name);
    this.age = fifaPlayer.age;
    this.nationality = fifaPlayer.nationality;
    this.foot = fifaPlayer.preferedFoot == "Left" ? "L" : "R";

    this.registeredPosition = fifaToPes21Positions(
      fifaPlayer.registeredPosition,
    );

    this.positions = [];

    for (let index = 0; index < fifaPlayer.positions.length; index++) {
      let pos = fifaToPes21Positions(fifaPlayer.positions[index]);

      if (this.positions.includes(pos)) continue;

      if (this.registeredPosition === pos) {
        this.positions.push("*" + pos);
      } else {
        this.positions.push(pos);
      }
    }

    this.height = fifaPlayer.height;
    this.weight = fifaPlayer.weight;

    this.reputation =
      Math.round(
        (((fifaPlayer.internationalReputation - 1) / 4) * 7 + 1) * -1,
      ) * -1;

    this.injuryTolerance = 2;
    if (
      stringInArray(fifaPlayer.traits, SOFIFA_TRAIT.SOLID_PLAYER) ||
      stringInArray(fifaPlayer.traits, SOFIFA_TRAIT.INJURY_FREE)
    ) {
      this.injuryTolerance = 3;
    } else if (stringInArray(fifaPlayer.traits, SOFIFA_TRAIT.INJURY_PRONE)) {
      this.injuryTolerance = 1;
    }

    this.form = this.convertFifaStatToPes21Form(
      this.registeredPosition === "GK"
        ? fifaPlayer.movement[SOFIFA_MOVEMENT.REACTIONS]
        : fifaPlayer.power[SOFIFA_POWER.STAMINA],
    );

    this.weakFootAccuracy =
      fifaPlayer.weakFoot > 1 ? fifaPlayer.weakFoot - 1 : fifaPlayer.weakFoot;
    this.weakFootUsage =
      this.weakFootAccuracy > 1
        ? this.weakFootAccuracy - 1
        : this.weakFootAccuracy;

    //field players
    this.offensiveAwareness = this.convertFifaStatToPes21(
      fifaPlayer.mentality[SOFIFA_MENTALITY.ATTACK_POSITION],
    );
    if (
      fifaPlayer.mentality[SOFIFA_MENTALITY.ATTACK_POSITION] <
      fifaPlayer.movement[SOFIFA_MOVEMENT.REACTIONS]
    ) {
      this.offensiveAwareness++;
    } else if (
      fifaPlayer.mentality[SOFIFA_MENTALITY.ATTACK_POSITION] >
      fifaPlayer.movement[SOFIFA_MOVEMENT.REACTIONS]
    ) {
      this.offensiveAwareness--;
    }
    this.ballControl = this.convertFifaStatToPes21(
      fifaPlayer.skill[SOFIFA_SKILL.BALL_CONTROL],
    );
    this.dribbling = this.convertFifaStatToPes21(
      fifaPlayer.skill[SOFIFA_SKILL.DRIBBLING],
    );
    this.tightPossession = this.convertFifaStatToPes21(
      average([
        fifaPlayer.skill[SOFIFA_SKILL.BALL_CONTROL],
        fifaPlayer.mentality[SOFIFA_MENTALITY.COMPOSURE],
      ]),
    );
    this.lowPass = this.convertFifaStatToPes21(
      fifaPlayer.attacking[SOFIFA_ATTACKING.SHORT_PASSING],
    );
    if (
      fifaPlayer.attacking[SOFIFA_ATTACKING.SHORT_PASSING] <
      fifaPlayer.mentality[SOFIFA_MENTALITY.VISION]
    ) {
      this.lowPass++;
    } else if (
      fifaPlayer.attacking[SOFIFA_ATTACKING.SHORT_PASSING] >
      fifaPlayer.mentality[SOFIFA_MENTALITY.VISION]
    ) {
      this.lowPass--;
    }
    this.loftedPass = this.convertFifaStatToPes21(
      fifaPlayer.skill[SOFIFA_SKILL.LONG_PASSING] >
        fifaPlayer.attacking[SOFIFA_ATTACKING.CROSSING]
        ? fifaPlayer.skill[SOFIFA_SKILL.LONG_PASSING]
        : fifaPlayer.attacking[SOFIFA_ATTACKING.CROSSING],
    );
    if (
      fifaPlayer.attacking[SOFIFA_ATTACKING.SHORT_PASSING] <
      fifaPlayer.mentality[SOFIFA_MENTALITY.VISION]
    ) {
      this.loftedPass++;
    } else if (
      fifaPlayer.attacking[SOFIFA_ATTACKING.SHORT_PASSING] >
      fifaPlayer.mentality[SOFIFA_MENTALITY.VISION]
    ) {
      this.loftedPass--;
    }
    this.finishing = this.convertFifaStatToPes21(
      fifaPlayer.attacking[SOFIFA_ATTACKING.FINISHING],
    );
    if (
      fifaPlayer.attacking[SOFIFA_ATTACKING.FINISHING] <
      fifaPlayer.attacking[SOFIFA_ATTACKING.VOLLEYS]
    ) {
      this.finishing++;
    } else if (
      fifaPlayer.attacking[SOFIFA_ATTACKING.FINISHING] >
      fifaPlayer.attacking[SOFIFA_ATTACKING.VOLLEYS]
    ) {
      this.finishing--;
    }
    if (
      this.finishing <
      this.convertFifaStatToPes21(fifaPlayer.power[SOFIFA_POWER.LONG_SHOTS])
    ) {
      this.finishing++;
    } else if (
      this.finishing >
      this.convertFifaStatToPes21(fifaPlayer.power[SOFIFA_POWER.LONG_SHOTS])
    ) {
      this.finishing--;
    }
    this.heading = this.convertFifaStatToPes21(
      fifaPlayer.attacking[SOFIFA_ATTACKING.HEADING_ACCURACY],
    );
    this.placeKicking = this.convertFifaStatToPes21(
      fifaPlayer.mentality[SOFIFA_MENTALITY.PENALTIES] * 0.3 +
        fifaPlayer.skill[SOFIFA_SKILL.FK_ACCURACY] * 0.7,
    );

    if (this.placeKicking < 60) {
      this.placeKicking = this.convertFifaStatToPes21(
        fifaPlayer.mentality[SOFIFA_MENTALITY.PENALTIES],
      );
    }

    this.curl = this.convertFifaStatToPes21(
      fifaPlayer.skill[SOFIFA_SKILL.CURVE],
    );
    this.speed = this.convertFifaStatToPes21(
      fifaPlayer.movement[SOFIFA_MOVEMENT.SPRINT_SPEED],
    );
    this.acceleration = this.convertFifaStatToPes21(
      fifaPlayer.movement[SOFIFA_MOVEMENT.ACCELERATION],
    );
    this.kickingPower = this.convertFifaStatToPes21(
      fifaPlayer.power[SOFIFA_POWER.SHOT_POWER] < 70
        ? average([
            fifaPlayer.power[SOFIFA_POWER.SHOT_POWER],
            fifaPlayer.power[SOFIFA_POWER.STRENGTH],
          ])
        : fifaPlayer.power[SOFIFA_POWER.SHOT_POWER],
    );
    this.jump = this.convertFifaStatToPes21(
      fifaPlayer.power[SOFIFA_POWER.JUMPING],
    );
    this.physicalContact = this.convertFifaStatToPes21(
      fifaPlayer.power[SOFIFA_POWER.STRENGTH],
    );
    this.balance = this.convertFifaStatToPes21(
      average([
        fifaPlayer.movement[SOFIFA_MOVEMENT.AGILITY],
        fifaPlayer.movement[SOFIFA_MOVEMENT.BALANCE],
      ]),
    );
    if (this.balance > fifaPlayer.movement[SOFIFA_MOVEMENT.REACTIONS]) {
      this.balance++;
    } else if (this.balance < fifaPlayer.movement[SOFIFA_MOVEMENT.REACTIONS]) {
      this.balance--;
    }
    this.stamina = this.convertFifaStatToPes21(
      atLeast(fifaPlayer.power[SOFIFA_POWER.STAMINA], 60),
    );

    let defensiveAwarenessStat;
    if ("Defensive awareness" in fifaPlayer.defending) {
      defensiveAwarenessStat =
        fifaPlayer.defending[SOFIFA_DEFENDING.DEFENSIVE_AWARENESS];
    } else {
      defensiveAwarenessStat = fifaPlayer.defending[SOFIFA_DEFENDING.MARKING];
    }

    this.defensiveAwareness = this.convertFifaStatToPes21(
      defensiveAwarenessStat,
    );
    if (
      defensiveAwarenessStat <
      fifaPlayer.mentality[SOFIFA_MENTALITY.INTERCEPTIONS]
    ) {
      this.defensiveAwareness++;
    } else if (
      defensiveAwarenessStat >
      fifaPlayer.mentality[SOFIFA_MENTALITY.INTERCEPTIONS]
    ) {
      this.defensiveAwareness--;
    }
    this.ballWinning = this.convertFifaStatToPes21(
      fifaPlayer.defending[SOFIFA_DEFENDING.STANDING_TACKLE] >
        fifaPlayer.defending[SOFIFA_DEFENDING.SLIDING_TACKLE]
        ? fifaPlayer.defending[SOFIFA_DEFENDING.STANDING_TACKLE]
        : fifaPlayer.defending[SOFIFA_DEFENDING.SLIDING_TACKLE],
    );
    this.aggression = this.convertFifaStatToPes21(
      fifaPlayer.mentality[SOFIFA_MENTALITY.AGGRESSION],
    );
    this.gkAwareness = 40;
    this.gkCatching = 40;
    this.gkClearing = 40;
    this.gkReflexes = 40;
    this.gkReach = 40;

    if (this.registeredPosition == "GK") {
      this.offensiveAwareness = clamp(40, 99, this.offensiveAwareness + 15);
      this.ballControl = clamp(40, 99, this.ballControl + 10);
      this.dribbling = clamp(40, 99, this.dribbling + 15);
      this.lowPass = clamp(40, 99, this.lowPass + 5);
      this.loftedPass = clamp(40, 99, this.loftedPass + 5);
      this.finishing = clamp(40, 99, this.finishing + 10);
      this.heading = clamp(40, 99, this.heading + 20);
      this.curl = clamp(40, 99, this.curl + 10);
      this.kickingPower = this.convertFifaStatToPes21(
        fifaPlayer.goalkeeping[SOFIFA_GOALKEEPING.GK_KICKING],
      );
      this.jump = clamp(40, 99, this.jump + 10);
      this.physicalContact = clamp(40, 99, this.physicalContact + 15);
      this.stamina = clamp(40, 99, this.stamina + 20);
      this.defensiveAwareness = clamp(40, 99, this.defensiveAwareness + 5);
      this.ballWinning = clamp(40, 99, this.ballWinning + 5);
      this.gkAwareness = this.convertFifaStatToPes21(
        average([
          fifaPlayer.goalkeeping[SOFIFA_GOALKEEPING.GK_DIVING],
          fifaPlayer.goalkeeping[SOFIFA_GOALKEEPING.GK_HANDLING],
          fifaPlayer.goalkeeping[SOFIFA_GOALKEEPING.GK_POSITIONING],
          fifaPlayer.goalkeeping[SOFIFA_GOALKEEPING.GK_REFLEXES],
        ]) + 5,
      );
      this.gkCatching = this.convertFifaStatToPes21(
        fifaPlayer.goalkeeping[SOFIFA_GOALKEEPING.GK_HANDLING] + 5,
      );
      this.gkClearing = this.convertFifaStatToPes21(
        average([
          fifaPlayer.goalkeeping[SOFIFA_GOALKEEPING.GK_DIVING],
          fifaPlayer.goalkeeping[SOFIFA_GOALKEEPING.GK_HANDLING],
        ]) + 5,
      );
      this.gkReflexes = this.convertFifaStatToPes21(
        fifaPlayer.goalkeeping[SOFIFA_GOALKEEPING.GK_REFLEXES] + 5,
      );
      this.gkReach = this.convertFifaStatToPes21(
        fifaPlayer.goalkeeping[SOFIFA_GOALKEEPING.GK_POSITIONING] + 5,
      );
    }

    // //CARD PLAYER SKILL

    if (
      (this.registeredPosition == "SMF" ||
        this.registeredPosition == "AMF" ||
        this.registeredPosition == "SS" ||
        this.registeredPosition == "RWF" ||
        this.registeredPosition == "LWF" ||
        this.registeredPosition == "CF") &&
      (stringInArray(fifaPlayer.traits, SOFIFA_PLAYSTYLE.ACROBATIC) ||
        stringInArray(fifaPlayer.traits, SOFIFA_PLAYSTYLE.ACROBATIC_PLUS))
    ) {
      this.acrobaticFinishing = 1;
      this.playerSkills += "*Acrobatic Finishing" + "\n";
    } else {
      this.acrobaticFinishing = 0;
    }

    if (
      stringInArray(fifaPlayer.traits, SOFIFA_PLAYSTYLE.LEADERSHIP) ||
      stringInArray(fifaPlayer.traits, SOFIFA_PLAYSTYLE.LEADERSHIP_PLUS)
    ) {
      this.captaincy = 1;
      this.playerSkills += "*Captaincy" + "\n";
    } else {
      this.captaincy = 0;
    }

    if (
      stringInArray(fifaPlayer.traits, SOFIFA_PLAYSTYLE.CHIP_SHOT) ||
      stringInArray(fifaPlayer.traits, SOFIFA_PLAYSTYLE.CHIP_SHOT_PLUS)
    ) {
      this.chipShotControl = 1;
      this.playerSkills += "*Chip Shot Control" + "\n";
    } else {
      this.chipShotControl = 0;
    }

    // if (this.dribbling >= 83 && this.ballControl >= 85) {
    //   this.crossOverTurn = 1;
    //   this.playerSkills += "*Cross Over Turn" + "\n";
    // } else {
    //   this.crossOverTurn = 0;
    // }

    // if (this.dribbling >= 82 && this.ballControl >= 84) {
    //   this.cutBehindAndTurn = 1;
    //   this.playerSkills += "*Cut Behind & Turn" + "\n";
    // } else {
    //   this.cutBehindAndTurn = 0;
    // }

    // if (this.finishing >= 85 && this.kickingPower >= 80) {
    //   this.dippingShot = 1;
    //   this.playerSkill += "*Dipping Shot" + "\n";
    // } else {
    //   this.dippingShots = 0;
    // }

    // if (this.dribbling >= 79 && this.ballControl >= 84) {
    //   this.doubleTouch = 1;
    //   this.playerSkills += "*Double Touch" + "\n";
    // } else {
    //   this.doubleTouch = 0;
    // }

    if (
      stringInArray(fifaPlayer.traits, SOFIFA_PLAYSTYLE.RELENTLESS) ||
      stringInArray(fifaPlayer.traits, SOFIFA_PLAYSTYLE.RELENTLESS_PLUS)
    ) {
      this.fightingSpirit = 1;
      this.playerSkills += "*Fighting Spirit" + "\n";
    } else {
      this.fightingSpirit = 0;
    }

    // if (this.offensiveAwareness >= 83 && this.finishing >= 82) {
    //   this.firstTimeShot = 1;
    //   this.playerSkills += "*First-time Shot" + "\n";
    // } else {
    //   this.firstTimeShot = 0;
    // }

    // if (this.ballControl >= 76 && this.dribbling >= 79) {
    //   this.flipFlap = 1;
    //   this.playerSkills += "*Flip Flap" + "\n";
    // } else {
    //   this.flipFlap = 0;
    // }

    // if (this.acceleration >= 80 && this.balance >= 82 && this.dribbling >= 81) {
    //   this.gamesmanship = 1;
    //   this.playerSkills += "*Gamesmanship" + "\n";
    // } else {
    //   this.gamesmanship = 0;
    // }

    // if (fmPlayer.stats[FM_STAT.KICKING] >= 14 && fmPlayer.stats[FM_STAT.STRENGTH] >= 14) {
    //   this.gkHighPunt = 1;
    //   this.playerSkills += "*GK High Punt" + "\n";
    // } else {
    //   this.gkHighPunt = 0;
    // }

    if (
      stringInArray(fifaPlayer.traits, SOFIFA_PLAYSTYLE.FAR_THROW) ||
      stringInArray(fifaPlayer.traits, SOFIFA_PLAYSTYLE.FAR_THROW_PLUS)
    ) {
      this.gkLongThrow = 1;
      this.playerSkills += "*GK Long Throw" + "\n";
    } else {
      this.gkLongThrow = 0;
    }

    // if (fmPlayer.stats[FM_STAT.THROWING] >= 14) {
    //   this.gkLowPunt = 1;
    //   this.playerSkills += "*GK Low Punt" + "\n";
    // } else {
    //   this.gkLowPunt = 0;
    // }

    // if (fmPlayer.stats[FM_STAT.DECISIONS] >= 14 && fmPlayer.stats[FM_STAT.REFLEXES] >= 14) {
    //   this.gkPenaltySaver = 1;
    //   this.playerSkills += "*GK Penalty Saver" + "\n";
    // } else {
    //   this.gkPenaltySaver = 0;
    // }

    if (
      stringInArray(fifaPlayer.traits, SOFIFA_PLAYSTYLE.POWER_HEADER) ||
      stringInArray(fifaPlayer.traits, SOFIFA_PLAYSTYLE.POWER_HEADER_PLUS)
    ) {
      this.headingPlayerSkill = 1;
      this.playerSkills += "*Heading" + "\n";
    } else {
      this.headingPlayerSkill = 0;
    }

    // if (this.acrobaticFinishing >= 1 && this.finishing >= 85) {
    //   this.heelTrick = 1;
    //   this.playerSkills += "*Heel Trick" + "\n";
    // } else {
    //   this.heelTrick = 0;
    // }

    if (
      stringInArray(fifaPlayer.traits, SOFIFA_PLAYSTYLE.INTERCEPT) ||
      stringInArray(fifaPlayer.traits, SOFIFA_PLAYSTYLE.INTERCEPT_PLUS)
    ) {
      this.interception = 1;
      this.playerSkills += "*Interception" + "\n";
    } else {
      this.interception = 0;
    }

    // if (this.finishing >= 85 && this.placeKicking >= 75) {
    //   this.knuckleShots = 1;
    //   this.playerSkills += "*Knuckle Shot" + "\n";
    // } else {
    //   this.knuckleShots = 0;
    // }

    if (
      stringInArray(fifaPlayer.traits, SOFIFA_PLAYSTYLE.FINESSE_SHOT) ||
      stringInArray(fifaPlayer.traits, SOFIFA_PLAYSTYLE.FINESSE_SHOT_PLUS)
    ) {
      this.longRangeDrive = 1;
      this.playerSkills += "*Long Range Drive" + "\n";
    } else {
      this.longRangeDrive = 0;
    }

    if (
      stringInArray(fifaPlayer.traits, SOFIFA_PLAYSTYLE.LONG_THROW) ||
      stringInArray(fifaPlayer.traits, SOFIFA_PLAYSTYLE.LONG_THROW_PLUS)
    ) {
      this.longThrow = 1;
      this.playerSkills += "*Long Throw" + "\n";
    } else {
      this.longThrow = 0;
    }

    if (
      stringInArray(fifaPlayer.traits, SOFIFA_PLAYSTYLE.PINGED_PASS) ||
      stringInArray(fifaPlayer.traits, SOFIFA_PLAYSTYLE.PINGED_PASS_PLUS)
    ) {
      this.lowLoftedPass = 1;
      this.playerSkills += "*Low Lofted Pass" + "\n";
    } else {
      this.lowLoftedPass = 0;
    }

    if (
      stringInArray(fifaPlayer.traits, SOFIFA_PLAYSTYLE.BLOCK) ||
      stringInArray(fifaPlayer.traits, SOFIFA_PLAYSTYLE.BLOCK_PLUS)
    ) {
      this.manMarking = 1;
      this.playerSkills += "*Man Marking" + "\n";
    } else {
      this.manMarking = 0;
    }

    // if (this.ballControl >= 77 && this.dribbling >= 78) {
    //   this.marseilleTurn = 1;
    //   this.playerSkills += "*Marseille Turn" + "\n";
    // } else {
    //   this.marseilleTurn = 0;
    // }

    if (
      stringInArray(fifaPlayer.traits, SOFIFA_PLAYSTYLE.POWER_SHOT) ||
      stringInArray(fifaPlayer.traits, SOFIFA_PLAYSTYLE.POWER_SHOT_PLUS)
    ) {
      this.longRangeShooting = 1;
      this.playerSkills += "*Long Range Shooting" + "\n";
    } else {
      this.longRangeShooting = 0;
    }

    if (
      stringInArray(fifaPlayer.traits, SOFIFA_PLAYSTYLE.TIKI_TAKA) ||
      stringInArray(fifaPlayer.traits, SOFIFA_PLAYSTYLE.TIKI_TAKA_PLUS)
    ) {
      this.oneTouchPass = 1;
      this.playerSkills += "*One-touch Pass" + "\n";
    } else {
      this.oneTouchPass = 0;
    }

    // if (this.oneTouchPass >= 1 && this.offensiveAwareness >= 80) {
    //   this.noLookPass = 1;
    //   this.playerSkills += "*No Look Pass" + "\n";
    // } else {
    //   this.noLookPass = 0;
    // }

    if (
      stringInArray(fifaPlayer.traits, SOFIFA_PLAYSTYLE.TRIVELA) ||
      stringInArray(fifaPlayer.traits, SOFIFA_PLAYSTYLE.TRIVELA_PLUS)
    ) {
      this.outsideCurler = 1;
      this.playerSkills += "*Outside Curler" + "\n";
    } else {
      this.outsideCurler = 0;
    }

    // if (fmPlayer.stats[FM_STAT.PENALTY_TAKING] >= 14) {
    //   this.penaltySpecialist = 1;
    //   this.playerSkills += "*Penalty Specialist" + "\n";
    // } else {
    //   this.penaltySpecialist = 0;
    // }

    if (
      stringInArray(fifaPlayer.traits, SOFIFA_PLAYSTYLE.WHIPPED_CROSS) ||
      stringInArray(fifaPlayer.traits, SOFIFA_PLAYSTYLE.WHIPPED_CROSS_PLUS)
    ) {
      this.pinpointCrossing = 1;
      this.playerSkills += "*Pinpoint Crossing" + "\n";
    } else {
      this.pinpointCrossing = 0;
    }

    // if (this.lowPass >= 75 && this.loftedPass >= 75 && this.finishing >= 75) {
    //   this.rabona = 1;
    //   this.playerSkills += "*Rabona" + "\n";
    // } else {
    //   this.rabona = 0;
    // }

    // if (this.finishing >= 85 && this.ballControl >= 80) {
    //   this.risingShots = 1;
    //   this.playerSkills += "*Rising Shots" + "\n";
    // } else {
    //   this.risingShots = 0;
    // }

    // if (this.ballControl >= 75 && this.dribbling >= 82) {
    //   this.scissorsFeint = 1;
    //   this.playerSkills += "*Scissors Feint" + "\n";
    // } else {
    //   this.scissorsFeint = 0;
    // }

    // if (this.dribbling >= 75 && this.ballControl >= 80) {
    //   this.scotchMove = 1;
    //   this.playerSkills += "*Scotch Move" + "\n";
    // } else {
    //   this.scotchMove = 0;
    // }

    // if (fmPlayer.stats[FM_STAT.FLAIR] >= 14 && fmPlayer.stats[FM_STAT.TECHNIQUE] >= 14) {
    //   this.sombrero = 1;
    //   this.playerSkills += "*Sombrero" + "\n";
    // } else {
    //   this.sombrero = 0;
    // }

    // if (this.ballControl >= 84) {
    //   this.stepOneBallControl = 1;
    //   this.playerSkills += "*Step On Ball Control" + "\n";
    // } else {
    //   this.stepOneBallControl = 0;
    // }

    // if (this.finishing >= 80 && this.acceleration >= 80 && this.stamina >= 65) {
    //   this.superSub = 1;
    //   this.playerSkills += "*Super-sub" + "\n";
    // } else {
    //   this.superSub = 0;
    // }

    if (
      stringInArray(fifaPlayer.traits, SOFIFA_PLAYSTYLE.INCISIVE_PASS) ||
      stringInArray(fifaPlayer.traits, SOFIFA_PLAYSTYLE.INCISIVE_PASS_PLUS)
    ) {
      this.throughPassing = 1;
      this.playerSkills += "*Through Passing" + "\n";
    } else {
      this.throughPassing = 0;
    }

    // if (this.ballWinning >= 85 && this.stamina >= 85) {
    //   this.trackBack = 1;
    //   this.playerSkills += "*Track Back" + "\n";
    // } else {
    //   this.trackBack = 0;
    // }

    if (
      stringInArray(fifaPlayer.traits, SOFIFA_PLAYSTYLE.LONG_BALL_PASS) ||
      stringInArray(fifaPlayer.traits, SOFIFA_PLAYSTYLE.LONG_BALL_PASS_PLUS)
    ) {
      this.weightedPass = 1;
      this.playerSkills += "*Weighted Pass" + "\n";
    } else {
      this.weightedPass = 0;
    }

    if (
      (this.registeredPosition == "GK" ||
        this.registeredPosition == "CB" ||
        this.registeredPosition == "SB" ||
        this.registeredPosition == "DMF" ||
        this.registeredPosition == "CMF") &&
      (stringInArray(fifaPlayer.traits, SOFIFA_PLAYSTYLE.ACROBATIC) ||
        stringInArray(fifaPlayer.traits, SOFIFA_PLAYSTYLE.ACROBATIC_PLUS))
    ) {
      this.acrobaticClear = 1;
      this.playerSkills += "*Acrobatic Clear" + "\n";
    } else {
      this.acrobaticClear = 0;
    }

    // // CARD STYLE COM

    if (this.loftedPass + this.curl >= 165) {
      this.earlyCross = 1;
      this.COMPlayingStyles += "*Early Cross" + "\n";
    } else {
      this.earlyCross = 0;
    }

    // if (this.registeredPosition === "RWF" || this.registeredPosition === "LWF") {
    //   this.incisiveRun = 1;
    //   this.COMPlayingStyles += "*Incisive Run" + "\n";
    // } else {
    //   this.incisiveRun = 0;
    // }

    if (this.loftedPass >= 85) {
      this.longBallExpert = 1;
      this.COMPlayingStyles += "*Long Ball Expert" + "\n";
    } else {
      this.longBallExpert = 0;
    }

    if (
      stringInArray(fifaPlayer.traits, SOFIFA_PLAYSTYLE.POWER_SHOT) ||
      stringInArray(fifaPlayer.traits, SOFIFA_PLAYSTYLE.POWER_SHOT_PLUS)
    ) {
      this.longRanger = 1;
      this.COMPlayingStyles += "*Long Ranger" + "\n";
    } else {
      this.longRanger = 0;
    }

    if (this.dribbling + this.acceleration >= 170) {
      this.mazingRun = 1;
      this.COMPlayingStyles += "*Mazing Run" + "\n";
    } else {
      this.mazingRun = 0;
    }

    if (
      stringInArray(fifaPlayer.traits, SOFIFA_PLAYSTYLE.RAPID) ||
      stringInArray(fifaPlayer.traits, SOFIFA_PLAYSTYLE.RAPID_PLUS)
    ) {
      this.speedingBullet = 1;
      this.COMPlayingStyles += "*Speeding Bullet" + "\n";
    } else {
      this.speedingBullet = 0;
    }

    if (
      stringInArray(fifaPlayer.traits, SOFIFA_PLAYSTYLE.TRICKSTER) ||
      stringInArray(fifaPlayer.traits, SOFIFA_PLAYSTYLE.TRICKSTER_PLUS)
    ) {
      this.trickster = 1;
      this.COMPlayingStyles += "*Trickster" + "\n";
    } else {
      this.trickster = 0;
    }
  }

  /**
   * Fill PES21 stats from a scraped FMInside player.
   * @param {FMPlayer} fmPlayer
   * @returns {void}
   */
  fromFMPlayer(fmPlayer) {
    let FMPositions = fmPositionStringToArray(fmPlayer.info[FM_INFO.POSITIONS]);
    debugLog("pes21:fm", "positions", FMPositions);
    //this.registeredPosition = FMPositions.includes("AMC") &&FMPositions.includes("ST") ? "SS" : fmToPes21Positions(FMPositions[0]);
    let isSS = FMPositions.includes("AMC") && FMPositions.includes("ST");
    this.positions = [];
    for (let index = 0; index < FMPositions.length; index++) {
      /*
      if (this.registeredPosition != fmToPes21Positions(FMPositions[index])){
        this.positions.push(fmToPes21Positions(FMPositions[index]));
      }
      */
      let position =
        (fmPlayer.positionType[index] === "Natural" ? "*" : "") +
        fmToPes21Positions(FMPositions[index]);
      this.positions.push(position);
    }
    if (isSS) {
      if (
        fmPlayer.positionType[FMPositions.indexOf("AMC")] === "Natural" &&
        fmPlayer.positionType[FMPositions.indexOf("ST")] === "Natural"
      )
        this.positions.push("*SS");
      else {
        this.positions.push("SS");
      }
    }
    /** @type {Record<string, number>} */
    let positionWeight = {};
    this.positions.forEach((position) => {
      if (position.includes("*")) {
        let weight = pes21GetPositionWeight(position, fmPlayer);
        positionWeight[position] = weight;
      }
    });
    debugLog("pes21:fm", "positionWeight", positionWeight);
    this.registeredPosition = Object.keys(positionWeight)
      .reduce((a, b) => (positionWeight[a] > positionWeight[b] ? a : b))
      .replace("*", "");
    debugLog("pes21:fm", "registeredPosition", this.registeredPosition);
    this.currentAbility = parseInt(fmPlayer.ability ?? "");
    const maxRow = maxStatsTable.find(
      (row) => row.position === this.registeredPosition,
    );
    const minRow = minStatsTable.find(
      (row) => row.position === this.registeredPosition,
    );
    // All PES21 positions have a stat-table row; bail defensively if a new
    // position code ever slips through so we don't dereference undefined.
    if (!maxRow || !minRow) {
      return;
    }
    this.name = fmPlayer.info[FM_INFO.NAME];
    this.shirtName = this.nameToShirtName(this.name);
    this.age = parseInt(fmPlayer.info[FM_INFO.AGE]);
    this.nationality = fmPlayer.nationality;
    this.foot = fmPlayer.info[FM_INFO.FOOT] == "Left" ? "L" : "R";

    this.height = parseInt(fmPlayer.info[FM_INFO.HEIGHT]);
    this.weight = parseInt(fmPlayer.info[FM_INFO.WEIGHT]);

    this.injuryTolerance = fmToPes21Stat1To3(
      fmPlayer.stats[FM_STAT.NATURAL_FITNESS],
    );
    this.form = fmToPes21Stat1To8(fmPlayer.stats[FM_STAT.NATURAL_FITNESS]);

    switch (fmPlayer.info[FM_INFO.FOOT]) {
      case "Only":
        this.weakFootUsage = 2;
        this.weakFootAccuracy = 2;
        break;
      case "Right":
      case "Left":
        this.weakFootUsage = 3;
        this.weakFootAccuracy = 3;
        break;
      case "Both":
        this.weakFootUsage = 4;
        this.weakFootAccuracy = 4;
        break;
    }

    if (this.registeredPosition == "GK") {
      this.offensiveAwareness = fmStatToPes21(
        average([
          fmPlayer.stats[FM_STAT.ANTICIPATION],
          fmPlayer.stats[FM_STAT.TECHNIQUE],
          fmPlayer.stats[FM_STAT.OFF_THE_BALL],
          fmPlayer.stats[FM_STAT.OFF_THE_BALL],
        ]),
        maxRow.offensiveAwareness,
        minRow.offensiveAwareness,
        this.currentAbility,
      );
      this.ballControl = fmStatToPes21(
        average([
          fmPlayer.stats[FM_STAT.FLAIR],
          fmPlayer.stats[FM_STAT.FLAIR],
          fmPlayer.stats[FM_STAT.TECHNIQUE],
          fmPlayer.stats[FM_STAT.TECHNIQUE],
        ]),
        maxRow.ballControl,
        minRow.ballControl,
        this.currentAbility,
      );
      this.dribbling = fmStatToPes21(
        average([
          fmPlayer.stats[FM_STAT.FIRST_TOUCH],
          fmPlayer.stats[FM_STAT.FIRST_TOUCH],
          fmPlayer.stats[FM_STAT.FLAIR],
          fmPlayer.stats[FM_STAT.FLAIR],
        ]),
        maxRow.dribbling,
        minRow.dribbling,
        this.currentAbility,
      );
      this.tightPossession = fmStatToPes21(
        average([
          fmPlayer.stats[FM_STAT.ECCENTRICITY],
          fmPlayer.stats[FM_STAT.ECCENTRICITY],
          fmPlayer.stats[FM_STAT.TECHNIQUE],
          fmPlayer.stats[FM_STAT.TECHNIQUE],
          fmPlayer.stats[FM_STAT.STRENGTH],
          fmPlayer.stats[FM_STAT.AGILITY],
          fmPlayer.stats[FM_STAT.BALANCE],
        ]),
        maxRow.tightPossession,
        minRow.tightPossession,
        this.currentAbility,
      );
      this.lowPass = fmStatToPes21(
        average([
          fmPlayer.stats[FM_STAT.PASSING],
          fmPlayer.stats[FM_STAT.PASSING],
          fmPlayer.stats[FM_STAT.PASSING],
          fmPlayer.stats[FM_STAT.TECHNIQUE],
          fmPlayer.stats[FM_STAT.COMPOSURE],
        ]),
        maxRow.lowPass,
        minRow.lowPass,
        this.currentAbility,
      );
      this.loftedPass = fmStatToPes21(
        average([
          fmPlayer.stats[FM_STAT.THROWING],
          fmPlayer.stats[FM_STAT.THROWING],
          fmPlayer.stats[FM_STAT.PASSING],
          fmPlayer.stats[FM_STAT.PASSING],
          fmPlayer.stats[FM_STAT.TECHNIQUE],
        ]),
        maxRow.loftedPass,
        minRow.loftedPass,
        this.currentAbility,
      );
      this.finishing = fmStatToPes21(
        average([
          fmPlayer.stats[FM_STAT.TECHNIQUE],
          fmPlayer.stats[FM_STAT.TECHNIQUE],
          fmPlayer.stats[FM_STAT.TECHNIQUE],
          fmPlayer.stats[FM_STAT.COMPOSURE],
          fmPlayer.stats[FM_STAT.COMPOSURE],
        ]),
        maxRow.finishing,
        minRow.finishing,
        this.currentAbility,
      );
      this.heading = fmStatToPes21(
        average([
          fmPlayer.stats[FM_STAT.TECHNIQUE],
          fmPlayer.stats[FM_STAT.TECHNIQUE],
          fmPlayer.stats[FM_STAT.TECHNIQUE],
          fmPlayer.stats[FM_STAT.JUMPING_REACH],
        ]),
        maxRow.heading,
        minRow.heading,
        this.currentAbility,
      );
      this.placeKicking = fmStatToPes21(
        average([
          fmPlayer.stats[FM_STAT.TECHNIQUE],
          fmPlayer.stats[FM_STAT.TECHNIQUE],
          fmPlayer.stats[FM_STAT.VISION],
        ]),
        maxRow.placeKicking,
        minRow.placeKicking,
        this.currentAbility,
      );
      this.curl = fmStatToPes21(
        average([
          fmPlayer.stats[FM_STAT.TECHNIQUE],
          fmPlayer.stats[FM_STAT.TECHNIQUE],
          fmPlayer.stats[FM_STAT.FLAIR],
          fmPlayer.stats[FM_STAT.FLAIR],
        ]),
        maxRow.curl,
        minRow.curl,
        this.currentAbility,
      );
      this.speed = fmStatToPes21(
        average([
          fmPlayer.stats[FM_STAT.PACE],
          fmPlayer.stats[FM_STAT.PACE],
          fmPlayer.stats[FM_STAT.PACE],
          fmPlayer.stats[FM_STAT.ACCELERATION],
        ]),
        maxRow.speed,
        minRow.speed,
        this.currentAbility,
      );
      this.acceleration = fmStatToPes21(
        average([
          fmPlayer.stats[FM_STAT.ACCELERATION],
          fmPlayer.stats[FM_STAT.ACCELERATION],
          fmPlayer.stats[FM_STAT.ACCELERATION],
          fmPlayer.stats[FM_STAT.AGILITY],
          fmPlayer.stats[FM_STAT.PACE],
        ]),
        maxRow.acceleration,
        minRow.acceleration,
        this.currentAbility,
      );
      this.kickingPower = fmStatToPes21(
        average([
          fmPlayer.stats[FM_STAT.THROWING],
          fmPlayer.stats[FM_STAT.THROWING],
          fmPlayer.stats[FM_STAT.STRENGTH],
          fmPlayer.stats[FM_STAT.STRENGTH],
        ]),
        maxRow.kickingPower,
        minRow.kickingPower,
        this.currentAbility,
      );
      this.jump = fmStatToPes21(
        average([
          fmPlayer.stats[FM_STAT.JUMPING_REACH],
          fmPlayer.stats[FM_STAT.JUMPING_REACH],
          fmPlayer.stats[FM_STAT.JUMPING_REACH],
          fmPlayer.stats[FM_STAT.STRENGTH],
          fmPlayer.stats[FM_STAT.AGILITY],
        ]),
        maxRow.jump,
        minRow.jump,
        this.currentAbility,
      );
      this.physicalContact = fmStatToPes21(
        average([
          fmPlayer.stats[FM_STAT.STRENGTH],
          fmPlayer.stats[FM_STAT.STRENGTH],
          fmPlayer.stats[FM_STAT.STRENGTH],
          fmPlayer.stats[FM_STAT.STRENGTH],
          fmPlayer.stats[FM_STAT.BALANCE],
        ]),
        maxRow.physicalContact,
        minRow.physicalContact,
        this.currentAbility,
      );
      this.balance = fmStatToPes21(
        average([
          fmPlayer.stats[FM_STAT.BALANCE],
          fmPlayer.stats[FM_STAT.BALANCE],
          fmPlayer.stats[FM_STAT.BALANCE],
          fmPlayer.stats[FM_STAT.AGILITY],
          fmPlayer.stats[FM_STAT.AGILITY],
        ]),
        maxRow.balance,
        minRow.balance,
        this.currentAbility,
      );
      this.stamina = fmStatToPes21(
        average([
          fmPlayer.stats[FM_STAT.STAMINA],
          fmPlayer.stats[FM_STAT.STAMINA],
          fmPlayer.stats[FM_STAT.STAMINA],
          fmPlayer.stats[FM_STAT.NATURAL_FITNESS],
          fmPlayer.stats[FM_STAT.WORK_RATE],
        ]),
        maxRow.stamina,
        minRow.stamina,
        this.currentAbility,
      );
      this.defensiveAwareness = fmStatToPes21(
        average([
          fmPlayer.stats[FM_STAT.POSITIONING],
          fmPlayer.stats[FM_STAT.POSITIONING],
          fmPlayer.stats[FM_STAT.RUSHING_OUT_TENDENCY],
          fmPlayer.stats[FM_STAT.BRAVERY],
        ]),
        maxRow.defensiveAwareness,
        minRow.defensiveAwareness,
        this.currentAbility,
      );
      this.ballWinning = fmStatToPes21(
        average([
          fmPlayer.stats[FM_STAT.ECCENTRICITY],
          fmPlayer.stats[FM_STAT.ECCENTRICITY],
          fmPlayer.stats[FM_STAT.AGGRESSION],
          fmPlayer.stats[FM_STAT.AGGRESSION],
          fmPlayer.stats[FM_STAT.BRAVERY],
          fmPlayer.stats[FM_STAT.BRAVERY],
        ]),
        maxRow.ballWinning,
        minRow.ballWinning,
        this.currentAbility,
      );
      this.aggression = fmStatToPes21(
        average([
          fmPlayer.stats[FM_STAT.AGGRESSION],
          fmPlayer.stats[FM_STAT.AGGRESSION],
          fmPlayer.stats[FM_STAT.AGGRESSION],
          fmPlayer.stats[FM_STAT.DETERMINATION],
          fmPlayer.stats[FM_STAT.WORK_RATE],
          fmPlayer.stats[FM_STAT.WORK_RATE],
        ]),
        maxRow.aggression,
        minRow.aggression,
        this.currentAbility,
      );
      this.gkAwareness = fmStatToPes21(
        average([
          fmPlayer.stats[FM_STAT.POSITIONING],
          fmPlayer.stats[FM_STAT.POSITIONING],
          fmPlayer.stats[FM_STAT.RUSHING_OUT_TENDENCY],
          fmPlayer.stats[FM_STAT.ONE_ON_ONES],
          fmPlayer.stats[FM_STAT.COMMAND_OF_AREA],
        ]),
        maxRow.gkAwareness,
        minRow.gkAwareness,
        this.currentAbility,
      );
      this.gkCatching = fmStatToPes21(
        average([
          fmPlayer.stats[FM_STAT.HANDLING],
          fmPlayer.stats[FM_STAT.HANDLING],
          fmPlayer.stats[FM_STAT.HANDLING],
          fmPlayer.stats[FM_STAT.AERIAL_REACH],
          fmPlayer.stats[FM_STAT.AERIAL_REACH],
        ]),
        maxRow.gkCatching,
        minRow.gkCatching,
        this.currentAbility,
      );
      this.gkClearing = fmStatToPes21(
        average([
          fmPlayer.stats[FM_STAT.KICKING],
          fmPlayer.stats[FM_STAT.KICKING],
          fmPlayer.stats[FM_STAT.KICKING],
          fmPlayer.stats[FM_STAT.KICKING],
          fmPlayer.stats[FM_STAT.FIRST_TOUCH],
        ]),
        maxRow.gkClearing,
        minRow.gkClearing,
        this.currentAbility,
      );
      this.gkReflexes = fmStatToPes21(
        average([
          fmPlayer.stats[FM_STAT.REFLEXES],
          fmPlayer.stats[FM_STAT.REFLEXES],
          fmPlayer.stats[FM_STAT.REFLEXES],
          fmPlayer.stats[FM_STAT.AGILITY],
          fmPlayer.stats[FM_STAT.NATURAL_FITNESS],
        ]),
        maxRow.gkReflexes,
        minRow.gkReflexes,
        this.currentAbility,
      );
      this.gkReach = fmStatToPes21(
        average([
          fmPlayer.stats[FM_STAT.AERIAL_REACH],
          fmPlayer.stats[FM_STAT.AERIAL_REACH],
          fmPlayer.stats[FM_STAT.AGILITY],
          fmPlayer.stats[FM_STAT.AGILITY],
          fmPlayer.stats[FM_STAT.JUMPING_REACH],
        ]),
        maxRow.gkReach,
        minRow.gkReach,
        this.currentAbility,
      );
    } else {
      //field players
      this.offensiveAwareness = fmStatToPes21(
        average([
          fmPlayer.stats[FM_STAT.ANTICIPATION],
          fmPlayer.stats[FM_STAT.FINISHING],
          fmPlayer.stats[FM_STAT.OFF_THE_BALL],
          fmPlayer.stats[FM_STAT.OFF_THE_BALL],
        ]),
        maxRow.offensiveAwareness,
        minRow.offensiveAwareness,
        this.currentAbility,
      );
      this.ballControl = fmStatToPes21(
        average([
          fmPlayer.stats[FM_STAT.FIRST_TOUCH],
          fmPlayer.stats[FM_STAT.FIRST_TOUCH],
          fmPlayer.stats[FM_STAT.DRIBBLING],
          fmPlayer.stats[FM_STAT.TECHNIQUE],
        ]),
        maxRow.ballControl,
        minRow.ballControl,
        this.currentAbility,
      );
      this.dribbling = fmStatToPes21(
        average([
          fmPlayer.stats[FM_STAT.DRIBBLING],
          fmPlayer.stats[FM_STAT.DRIBBLING],
          fmPlayer.stats[FM_STAT.DRIBBLING],
          fmPlayer.stats[FM_STAT.FLAIR],
        ]),
        maxRow.dribbling,
        minRow.dribbling,
        this.currentAbility,
      );
      this.tightPossession = fmStatToPes21(
        average([
          fmPlayer.stats[FM_STAT.DRIBBLING],
          fmPlayer.stats[FM_STAT.DRIBBLING],
          fmPlayer.stats[FM_STAT.DRIBBLING],
          fmPlayer.stats[FM_STAT.TECHNIQUE],
          fmPlayer.stats[FM_STAT.STRENGTH],
          fmPlayer.stats[FM_STAT.AGILITY],
          fmPlayer.stats[FM_STAT.BALANCE],
        ]),
        maxRow.tightPossession,
        minRow.tightPossession,
        this.currentAbility,
      );
      this.lowPass = fmStatToPes21(
        average([
          fmPlayer.stats[FM_STAT.PASSING],
          fmPlayer.stats[FM_STAT.PASSING],
          fmPlayer.stats[FM_STAT.PASSING],
          fmPlayer.stats[FM_STAT.TECHNIQUE],
          fmPlayer.stats[FM_STAT.COMPOSURE],
        ]),
        maxRow.lowPass,
        minRow.lowPass,
        this.currentAbility,
      );
      this.loftedPass = fmStatToPes21(
        average([
          fmPlayer.stats[FM_STAT.CROSSING],
          fmPlayer.stats[FM_STAT.CROSSING],
          fmPlayer.stats[FM_STAT.PASSING],
          fmPlayer.stats[FM_STAT.PASSING],
          fmPlayer.stats[FM_STAT.TECHNIQUE],
        ]),
        maxRow.loftedPass,
        minRow.loftedPass,
        this.currentAbility,
      );
      this.finishing = fmStatToPes21(
        average([
          fmPlayer.stats[FM_STAT.FINISHING],
          fmPlayer.stats[FM_STAT.FINISHING],
          fmPlayer.stats[FM_STAT.FINISHING],
          fmPlayer.stats[FM_STAT.COMPOSURE],
          fmPlayer.stats[FM_STAT.TECHNIQUE],
        ]),
        maxRow.finishing,
        minRow.finishing,
        this.currentAbility,
      );
      this.heading = fmStatToPes21(
        average([
          fmPlayer.stats[FM_STAT.HEADING],
          fmPlayer.stats[FM_STAT.HEADING],
          fmPlayer.stats[FM_STAT.FINISHING],
          fmPlayer.stats[FM_STAT.JUMPING_REACH],
        ]),
        maxRow.heading,
        minRow.heading,
        this.currentAbility,
      );
      this.placeKicking = fmStatToPes21(
        average([
          fmPlayer.stats[FM_STAT.FREE_KICK_TAKING],
          fmPlayer.stats[FM_STAT.FREE_KICK_TAKING],
          fmPlayer.stats[FM_STAT.CORNERS],
          fmPlayer.stats[FM_STAT.PENALTY_TAKING],
        ]),
        maxRow.placeKicking,
        minRow.placeKicking,
        this.currentAbility,
      );
      this.curl = fmStatToPes21(
        average([
          fmPlayer.stats[FM_STAT.TECHNIQUE],
          fmPlayer.stats[FM_STAT.TECHNIQUE],
          fmPlayer.stats[FM_STAT.FLAIR],
          fmPlayer.stats[FM_STAT.FLAIR],
        ]),
        maxRow.curl,
        minRow.curl,
        this.currentAbility,
      );
      this.speed = fmStatToPes21(
        average([
          fmPlayer.stats[FM_STAT.PACE],
          fmPlayer.stats[FM_STAT.PACE],
          fmPlayer.stats[FM_STAT.PACE],
          fmPlayer.stats[FM_STAT.ACCELERATION],
        ]),
        maxRow.speed,
        minRow.speed,
        this.currentAbility,
      );
      this.acceleration = fmStatToPes21(
        average([
          fmPlayer.stats[FM_STAT.ACCELERATION],
          fmPlayer.stats[FM_STAT.ACCELERATION],
          fmPlayer.stats[FM_STAT.ACCELERATION],
          fmPlayer.stats[FM_STAT.AGILITY],
          fmPlayer.stats[FM_STAT.PACE],
        ]),
        maxRow.acceleration,
        minRow.acceleration,
        this.currentAbility,
      );
      this.kickingPower = fmStatToPes21(
        average([
          fmPlayer.stats[FM_STAT.LONG_SHOTS],
          fmPlayer.stats[FM_STAT.LONG_SHOTS],
          fmPlayer.stats[FM_STAT.STRENGTH],
          fmPlayer.stats[FM_STAT.STRENGTH],
        ]),
        maxRow.kickingPower,
        minRow.kickingPower,
        this.currentAbility,
      );
      this.jump = fmStatToPes21(
        average([
          fmPlayer.stats[FM_STAT.JUMPING_REACH],
          fmPlayer.stats[FM_STAT.JUMPING_REACH],
          fmPlayer.stats[FM_STAT.JUMPING_REACH],
          fmPlayer.stats[FM_STAT.HEADING],
          fmPlayer.stats[FM_STAT.AGILITY],
        ]),
        maxRow.jump,
        minRow.jump,
        this.currentAbility,
      );
      this.physicalContact = fmStatToPes21(
        average([
          fmPlayer.stats[FM_STAT.STRENGTH],
          fmPlayer.stats[FM_STAT.STRENGTH],
          fmPlayer.stats[FM_STAT.STRENGTH],
          fmPlayer.stats[FM_STAT.STRENGTH],
          fmPlayer.stats[FM_STAT.BALANCE],
        ]),
        maxRow.physicalContact,
        minRow.physicalContact,
        this.currentAbility,
      );
      this.balance = fmStatToPes21(
        average([
          fmPlayer.stats[FM_STAT.BALANCE],
          fmPlayer.stats[FM_STAT.BALANCE],
          fmPlayer.stats[FM_STAT.BALANCE],
          fmPlayer.stats[FM_STAT.AGILITY],
          fmPlayer.stats[FM_STAT.AGILITY],
        ]),
        maxRow.balance,
        minRow.balance,
        this.currentAbility,
      );
      this.stamina = fmStatToPes21(
        average([
          fmPlayer.stats[FM_STAT.STAMINA],
          fmPlayer.stats[FM_STAT.STAMINA],
          fmPlayer.stats[FM_STAT.STAMINA],
          fmPlayer.stats[FM_STAT.NATURAL_FITNESS],
          fmPlayer.stats[FM_STAT.WORK_RATE],
        ]),
        maxRow.stamina,
        minRow.stamina,
        this.currentAbility,
      );
      this.defensiveAwareness = fmStatToPes21(
        average([
          fmPlayer.stats[FM_STAT.POSITIONING],
          fmPlayer.stats[FM_STAT.POSITIONING],
          fmPlayer.stats[FM_STAT.MARKING],
          fmPlayer.stats[FM_STAT.TACKLING],
        ]),
        maxRow.defensiveAwareness,
        minRow.defensiveAwareness,
        this.currentAbility,
      );
      this.ballWinning = fmStatToPes21(
        average([
          fmPlayer.stats[FM_STAT.TACKLING],
          fmPlayer.stats[FM_STAT.TACKLING],
          fmPlayer.stats[FM_STAT.TACKLING],
          fmPlayer.stats[FM_STAT.AGGRESSION],
          fmPlayer.stats[FM_STAT.MARKING],
          fmPlayer.stats[FM_STAT.BRAVERY],
        ]),
        maxRow.ballWinning,
        minRow.ballWinning,
        this.currentAbility,
      );
      this.aggression = fmStatToPes21(
        average([
          fmPlayer.stats[FM_STAT.AGGRESSION],
          fmPlayer.stats[FM_STAT.AGGRESSION],
          fmPlayer.stats[FM_STAT.AGGRESSION],
          fmPlayer.stats[FM_STAT.DETERMINATION],
          fmPlayer.stats[FM_STAT.WORK_RATE],
          fmPlayer.stats[FM_STAT.BRAVERY],
        ]),
        maxRow.aggression,
        minRow.aggression,
        this.currentAbility,
      );
      this.gkAwareness = 40;
      this.gkCatching = 40;
      this.gkClearing = 40;
      this.gkReflexes = 40;
      this.gkReach = 40;
    }

    //CARD PLAYER SKILL

    if (this.finishing >= 86 && this.balance >= 80) {
      this.acrobaticFinishing = 1;
      this.playerSkills += "*Acrobatic Finishing" + "\n";
    } else {
      this.acrobaticFinishing = 0;
    }
    if (fmPlayer.stats[FM_STAT.LEADERSHIP] >= 13) {
      this.captaincy = 1;
      this.playerSkills += "*Captaincy" + "\n";
    } else {
      this.captaincy = 0;
    }
    if (this.finishing >= 86 && this.ballControl >= 83) {
      this.chipShotControl = 1;
      this.playerSkills += "*Chip Shot Control" + "\n";
    } else {
      this.chipShotControl = 0;
    }
    if (this.dribbling >= 83 && this.ballControl >= 85) {
      this.crossOverTurn = 1;
      this.playerSkills += "*Cross Over Turn" + "\n";
    } else {
      this.crossOverTurn = 0;
    }
    if (this.dribbling >= 82 && this.ballControl >= 84) {
      this.cutBehindAndTurn = 1;
      this.playerSkills += "*Cut Behind & Turn" + "\n";
    } else {
      this.cutBehindAndTurn = 0;
    }
    if (this.finishing >= 85 && this.kickingPower >= 80) {
      this.dippingShot = 1;
      this.playerSkills += "*Dipping Shot" + "\n";
    } else {
      this.dippingShot = 0;
    }
    if (this.dribbling >= 79 && this.ballControl >= 84) {
      this.doubleTouch = 1;
      this.playerSkills += "*Double Touch" + "\n";
    } else {
      this.doubleTouch = 0;
    }

    if (
      fmPlayer.stats[FM_STAT.AGGRESSION] >= 14 &&
      fmPlayer.stats[FM_STAT.TEAMWORK] >= 14 &&
      fmPlayer.stats[FM_STAT.WORK_RATE] >= 14 &&
      fmPlayer.stats[FM_STAT.BRAVERY] >= 14
    ) {
      this.fightingSpirit = 1;
      this.playerSkills += "*Fighting Spirit" + "\n";
    } else {
      this.fightingSpirit = 0;
    }

    if (this.offensiveAwareness >= 83 && this.finishing >= 82) {
      this.firstTimeShot = 1;
      this.playerSkills += "*First-time Shot" + "\n";
    } else {
      this.firstTimeShot = 0;
    }

    if (this.ballControl >= 76 && this.dribbling >= 79) {
      this.flipFlap = 1;
      this.playerSkills += "*Flip Flap" + "\n";
    } else {
      this.flipFlap = 0;
    }

    if (this.acceleration >= 80 && this.balance >= 82 && this.dribbling >= 81) {
      this.gamesmanship = 1;
      this.playerSkills += "*Gamesmanship" + "\n";
    } else {
      this.gamesmanship = 0;
    }

    if (
      fmPlayer.stats[FM_STAT.KICKING] >= 14 &&
      fmPlayer.stats[FM_STAT.STRENGTH] >= 14
    ) {
      this.gkHighPunt = 1;
      this.playerSkills += "*GK High Punt" + "\n";
    } else {
      this.gkHighPunt = 0;
    }

    if (fmPlayer.stats[FM_STAT.KICKING] >= 14) {
      this.gkLongThrow = 1;
      this.playerSkills += "*GK Long Throw" + "\n";
    } else {
      this.gkLongThrow = 0;
    }

    if (fmPlayer.stats[FM_STAT.THROWING] >= 14) {
      this.gkLowPunt = 1;
      this.playerSkills += "*GK Low Punt" + "\n";
    } else {
      this.gkLowPunt = 0;
    }

    if (
      fmPlayer.stats[FM_STAT.DECISIONS] >= 14 &&
      fmPlayer.stats[FM_STAT.REFLEXES] >= 14
    ) {
      this.gkPenaltySaver = 1;
      this.playerSkills += "*GK Penalty Saver" + "\n";
    } else {
      this.gkPenaltySaver = 0;
    }

    if (
      fmPlayer.stats[FM_STAT.JUMPING_REACH] >= 14 &&
      fmPlayer.stats[FM_STAT.HEADING] >= 14
    ) {
      this.headingPlayerSkill = 1;
      this.playerSkills += "*Heading" + "\n";
    } else {
      this.headingPlayerSkill = 0;
    }

    if (this.acrobaticFinishing >= 1 && this.finishing >= 85) {
      this.heelTrick = 1;
      this.playerSkills += "*Heel Trick" + "\n";
    } else {
      this.heelTrick = 0;
    }

    if (this.defensiveAwareness >= 85 && this.ballWinning >= 85) {
      this.interception = 1;
      this.playerSkills += "*Interception" + "\n";
    } else {
      this.interception = 0;
    }

    if (this.finishing >= 85 && this.placeKicking >= 75) {
      this.knuckleShots = 1;
      this.playerSkills += "*Knuckle Shot" + "\n";
    } else {
      this.knuckleShots = 0;
    }

    if (
      fmPlayer.stats[FM_STAT.FLAIR] >= 14 &&
      fmPlayer.stats[FM_STAT.TECHNIQUE] >= 14 &&
      fmPlayer.stats[FM_STAT.LONG_SHOTS] >= 10
    ) {
      this.longRangeDrive = 1;
      this.playerSkills += "*Long Range Drive" + "\n";
    } else {
      this.longRangeDrive = 0;
    }

    if (fmPlayer.stats[FM_STAT.LONG_THROWS] >= 14) {
      this.longThrow = 1;
      this.playerSkills += "*Long Throw" + "\n";
    } else {
      this.longThrow = 0;
    }

    if (this.loftedPass >= 86) {
      this.lowLoftedPass = 1;
      this.playerSkills += "*Low Lofted Pass" + "\n";
    } else {
      this.lowLoftedPass = 0;
    }

    if (fmPlayer.stats[FM_STAT.MARKING] >= 15) {
      this.manMarking = 1;
      this.playerSkills += "*Man Marking" + "\n";
    } else {
      this.manMarking = 0;
    }

    if (this.ballControl >= 77 && this.dribbling >= 78) {
      this.marseilleTurn = 1;
      this.playerSkills += "*Marseille Turn" + "\n";
    } else {
      this.marseilleTurn = 0;
    }

    if (fmPlayer.stats[FM_STAT.LONG_SHOTS] >= 13) {
      this.longRangeShooting = 1;
      this.playerSkills += "*Long Range Shooting" + "\n";
    } else {
      this.longRangeShooting = 0;
    }

    if (this.lowPass >= 85 && this.ballControl >= 80) {
      this.oneTouchPass = 1;
      this.playerSkills += "*One-touch Pass" + "\n";
    } else {
      this.oneTouchPass = 0;
    }

    if (this.oneTouchPass >= 1 && this.offensiveAwareness >= 80) {
      this.noLookPass = 1;
      this.playerSkills += "*No Look Pass" + "\n";
    } else {
      this.noLookPass = 0;
    }

    if (this.loftedPass >= 80 && this.finishing >= 80) {
      this.outsideCurler = 1;
      this.playerSkills += "*Outside Curler" + "\n";
    } else {
      this.outsideCurler = 0;
    }

    if (fmPlayer.stats[FM_STAT.PENALTY_TAKING] >= 14) {
      this.penaltySpecialist = 1;
      this.playerSkills += "*Penalty Specialist" + "\n";
    } else {
      this.penaltySpecialist = 0;
    }

    if (this.offensiveAwareness >= 80 && this.loftedPass >= 85) {
      this.pinpointCrossing = 1;
      this.playerSkills += "*Pinpoint Crossing" + "\n";
    } else {
      this.pinpointCrossing = 0;
    }

    if (this.lowPass >= 75 && this.loftedPass >= 75 && this.finishing >= 75) {
      this.rabona = 1;
      this.playerSkills += "*Rabona" + "\n";
    } else {
      this.rabona = 0;
    }

    if (this.finishing >= 85 && this.ballControl >= 80) {
      this.risingShots = 1;
      this.playerSkills += "*Rising Shots" + "\n";
    } else {
      this.risingShots = 0;
    }

    if (this.ballControl >= 75 && this.dribbling >= 82) {
      this.scissorsFeint = 1;
      this.playerSkills += "*Scissors Feint" + "\n";
    } else {
      this.scissorsFeint = 0;
    }

    if (this.dribbling >= 75 && this.ballControl >= 80) {
      this.scotchMove = 1;
      this.playerSkills += "*Scotch Move" + "\n";
    } else {
      this.scotchMove = 0;
    }

    if (
      fmPlayer.stats[FM_STAT.FLAIR] >= 14 &&
      fmPlayer.stats[FM_STAT.TECHNIQUE] >= 14
    ) {
      this.sombrero = 1;
      this.playerSkills += "*Sombrero" + "\n";
    } else {
      this.sombrero = 0;
    }

    if (this.ballControl >= 84) {
      this.stepOneBallControl = 1;
      this.playerSkills += "*Step On Ball Control" + "\n";
    } else {
      this.stepOneBallControl = 0;
    }

    if (this.finishing >= 80 && this.acceleration >= 80 && this.stamina >= 65) {
      this.superSub = 1;
      this.playerSkills += "*Super-sub" + "\n";
    } else {
      this.superSub = 0;
    }

    if (this.lowPass >= 83 && this.loftedPass >= 83 && this.curl >= 75) {
      this.throughPassing = 1;
      this.playerSkills += "*Through Passing" + "\n";
    } else {
      this.throughPassing = 0;
    }

    if (this.ballWinning >= 85 && this.stamina >= 85) {
      this.trackBack = 1;
      this.playerSkills += "*Track Back" + "\n";
    } else {
      this.trackBack = 0;
    }

    if (this.loftedPass >= 85 && this.curl >= 75) {
      this.weightedPass = 1;
      this.playerSkills += "*Weighted Pass" + "\n";
    } else {
      this.weightedPass = 0;
    }

    if (this.defensiveAwareness >= 85 && this.jump >= 85) {
      this.acrobaticClear = 1;
      this.playerSkills += "*Acrobatic Clear" + "\n";
    } else {
      this.acrobaticClear = 0;
    }

    // CARD STYLE COM

    if (
      (this.registeredPosition === "LB" ||
        this.registeredPosition === "RB" ||
        this.registeredPosition === "RMF" ||
        this.registeredPosition === "LMF" ||
        this.registeredPosition === "AMF") &&
      fmPlayer.stats[FM_STAT.CROSSING] >= 14
    ) {
      this.earlyCross = 1;
      this.COMPlayingStyles += "*Early Cross" + "\n";
    } else {
      this.earlyCross = 0;
    }

    if (
      this.registeredPosition === "RWF" ||
      this.registeredPosition === "LWF"
    ) {
      this.incisiveRun = 1;
      this.COMPlayingStyles += "*Incisive Run" + "\n";
    } else {
      this.incisiveRun = 0;
    }

    if (this.loftedPass >= 88) {
      this.longBallExpert = 1;
      this.COMPlayingStyles += "*Long Ball Expert" + "\n";
    } else {
      this.longBallExpert = 0;
    }

    if (fmPlayer.stats[FM_STAT.LONG_SHOTS] >= 13) {
      this.longRanger = 1;
      this.COMPlayingStyles += "*Long Ranger" + "\n";
    } else {
      this.longRanger = 0;
    }

    if (this.dribbling >= 85) {
      this.mazingRun = 1;
      this.COMPlayingStyles += "*Mazing Run" + "\n";
    } else {
      this.mazingRun = 0;
    }

    if (
      fmPlayer.stats[FM_STAT.PACE] >= 14 &&
      fmPlayer.stats[FM_STAT.ACCELERATION] >= 14
    ) {
      this.speedingBullet = 1;
      this.COMPlayingStyles += "*Speeding Bullet" + "\n";
    } else {
      this.speedingBullet = 0;
    }

    if (this.dribbling >= 84 && this.speed >= 84) {
      this.trickster = 1;
      this.COMPlayingStyles += "*Trickster" + "\n";
    } else {
      this.trickster = 0;
    }

    // PLAYING STYLES

    this.playingStyle = pes21GetPlayingStyle(
      fmPlayer.roles,
      this.registeredPosition,
    );

    //return this.psdString();
  }

  /**
   * Map an eFootball injury-resistance label to the PES21 numeric rating.
   * @param {string} injury - The eFootball label.
   * @returns {number} The PES21 rating.
   */
  efootballInjuryResistance(injury) {
    switch (injury) {
      case "Low":
        return 1;
      case "Medium":
        return 2;
      case "High":
        return 3;
      default:
        return 2;
    }
  }

  /**
   * Map an eFootball form letter to the PES21 numeric rating.
   * @param {string} condition - The eFootball form letter.
   * @returns {number} The PES21 rating.
   */
  efootballCondition(condition) {
    switch (condition) {
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
      default:
        return 6;
    }
  }

  /**
   * Map an eFootball weak-foot label to the PES21 numeric rating.
   * @param {string} weakFoot - The eFootball label.
   * @returns {number} The PES21 rating.
   */
  efootball2021WeakFoot(weakFoot) {
    switch (weakFoot) {
      case "Slightly Low":
        return 1;
      case "Almost Never":
        return 1;
      case "Medium":
        return 2;
      case "Rarely":
        return 2;
      case "High":
        return 3;
      case "Occasionally":
        return 3;
      case "Very High":
        return 4;
      case "Regularly":
        return 4;
      default:
        return 3;
    }
  }

  /**
   * Fill PES21 stats from a scraped PESMaster player.
   * @param {PESMasterPlayerShape} pesMasterPlayer
   * @returns {void}
   */
  fromPesMasterPlayer(pesMasterPlayer) {
    debugLog("pes21:pesmaster", "specialStats", pesMasterPlayer.specialStats);
    this.name = pesMasterPlayer.name;
    this.shirtName = this.nameToShirtName(this.name);
    this.age = parseInt(pesMasterPlayer.info[PESMASTER_INFO.AGE]);
    this.nation = pesMasterPlayer.info[PESMASTER_INFO.NATIONALITY];
    this.nationality = pesMasterPlayer.info[PESMASTER_INFO.NATIONALITY];
    this.height = parseInt(pesMasterPlayer.info[PESMASTER_INFO.HEIGHT_CM]);
    this.weight = parseInt(pesMasterPlayer.info[PESMASTER_INFO.WEIGHT]);
    this.positions = pesMasterPlayer.positions;
    this.foot =
      pesMasterPlayer.info[PESMASTER_INFO.STRONGER_FOOT] == "Left" ? "L" : "R";
    this.registeredPosition = pesMasterPlayer.info[PESMASTER_INFO.POSITION];
    this.offensiveAwareness =
      pesMasterPlayer.stats[PESMASTER_STAT.OFFENSIVE_AWARENESS];
    this.ballControl = pesMasterPlayer.stats[PESMASTER_STAT.BALL_CONTROL];
    this.tightPossession =
      pesMasterPlayer.stats[PESMASTER_STAT.TIGHT_POSSESSION];
    this.dribbling = pesMasterPlayer.stats[PESMASTER_STAT.DRIBBLING];
    this.lowPass = pesMasterPlayer.stats[PESMASTER_STAT.LOW_PASS];
    this.loftedPass = pesMasterPlayer.stats[PESMASTER_STAT.LOFTED_PASS];
    this.finishing = pesMasterPlayer.stats[PESMASTER_STAT.FINISHING];
    this.placeKicking = pesMasterPlayer.stats[PESMASTER_STAT.SET_PIECE_TAKING];
    this.curl = pesMasterPlayer.stats[PESMASTER_STAT.CURL];
    this.heading = pesMasterPlayer.stats[PESMASTER_STAT.HEADING];
    this.defensiveAwareness =
      pesMasterPlayer.stats[PESMASTER_STAT.DEFENSIVE_AWARENESS];
    this.ballWinning = pesMasterPlayer.stats[PESMASTER_STAT.TACKLING];
    this.aggression = pesMasterPlayer.stats[PESMASTER_STAT.AGGRESSION];
    this.kickingPower = pesMasterPlayer.stats[PESMASTER_STAT.KICKING_POWER];
    this.speed = pesMasterPlayer.stats[PESMASTER_STAT.SPEED];
    this.acceleration = pesMasterPlayer.stats[PESMASTER_STAT.ACCELERATION];
    this.physicalContact =
      pesMasterPlayer.stats[PESMASTER_STAT.PHYSICAL_CONTACT];
    this.balance = pesMasterPlayer.stats[PESMASTER_STAT.BALANCE];
    this.jump = pesMasterPlayer.stats[PESMASTER_STAT.JUMPING];
    this.stamina = pesMasterPlayer.stats[PESMASTER_STAT.STAMINA];
    this.gkAwareness = pesMasterPlayer.stats[PESMASTER_STAT.GK_AWARENESS];
    this.gkReach = pesMasterPlayer.stats[PESMASTER_STAT.GK_REACH];
    this.gkCatching = pesMasterPlayer.stats[PESMASTER_STAT.GK_CATCHING];
    this.gkClearing = pesMasterPlayer.stats[PESMASTER_STAT.GK_PARRYING];
    this.gkReflexes = pesMasterPlayer.stats[PESMASTER_STAT.GK_REFLEXES];
    this.injuryTolerance = this.efootballInjuryResistance(
      pesMasterPlayer.characteristics[
        PESMASTER_CHARACTERISTIC.INJURY_RESISTANCE
      ],
    );
    this.weakFootAccuracy = this.efootball2021WeakFoot(
      pesMasterPlayer.characteristics[PESMASTER_CHARACTERISTIC.WEAK_FOOT_ACC],
    );
    this.weakFootUsage = this.efootball2021WeakFoot(
      pesMasterPlayer.characteristics[PESMASTER_CHARACTERISTIC.WEAK_FOOT_USAGE],
    );
    this.condition = this.efootballCondition(
      pesMasterPlayer.info[PESMASTER_INFO.CONDITION],
    );
    this.form = this.efootballCondition(
      pesMasterPlayer.info[PESMASTER_INFO.CONDITION],
    );

    if (
      pesMasterPlayer?.specialStats?.includes(PESMASTER_SKILL.SCISSORS_FEINT)
    ) {
      this.scissorsFeint = 1;
      this.playerSkills += "*Scissors Feint" + "\n";
    } else {
      this.scissorsFeint = 0;
    }
    if (pesMasterPlayer?.specialStats?.includes(PESMASTER_SKILL.DOUBLE_TOUCH)) {
      this.doubleTouch = 1;
      this.playerSkills += "*Double Touch" + "\n";
    } else {
      this.doubleTouch = 0;
    }
    if (pesMasterPlayer?.specialStats?.includes(PESMASTER_SKILL.FLIP_FLAP)) {
      this.flipFlap = 1;
      this.playerSkills += "*Flip Flap" + "\n";
    } else {
      this.flipFlap = 0;
    }
    if (
      pesMasterPlayer?.specialStats?.includes(PESMASTER_SKILL.MARSEILLE_TURN)
    ) {
      this.marseilleTurn = 1;
      this.playerSkills += "*Marseille Turn" + "\n";
    } else {
      this.marseilleTurn = 0;
    }
    if (pesMasterPlayer?.specialStats?.includes(PESMASTER_SKILL.SOMBRERO)) {
      this.sombrero = 1;
      this.playerSkills += "*Sombrero" + "\n";
    } else {
      this.sombrero = 0;
    }

    if (pesMasterPlayer?.specialStats?.includes(PESMASTER_SKILL.CHOP_TURN)) {
      this.crossOverTurn = 1;
      this.playerSkills += "*Cross Over Turn" + "\n";
    } else {
      this.crossOverTurn = 0;
    }
    if (
      pesMasterPlayer?.specialStats?.includes(PESMASTER_SKILL.CUT_BEHIND_TURN)
    ) {
      this.cutBehindAndTurn = 1;
      this.playerSkills += "*Cut Behind & Turn" + "\n";
    } else {
      this.cutBehindAndTurn = 0;
    }
    if (pesMasterPlayer?.specialStats?.includes(PESMASTER_SKILL.SCOTCH_MOVE)) {
      this.scotchMove = 1;
      this.playerSkills += "*Scotch Move" + "\n";
    } else {
      this.scotchMove = 0;
    }

    if (pesMasterPlayer?.specialStats?.includes(PESMASTER_SKILL.SOLE_CONTROL)) {
      this.stepOneBallControl = 1;
      this.playerSkills += "*Step On Ball Control" + "\n";
    } else {
      this.stepOneBallControl = 0;
    }
    if (pesMasterPlayer?.specialStats?.includes(PESMASTER_SKILL.HEADING)) {
      this.headingPlayerSkill = 1;
      this.playerSkills += "*Heading" + "\n";
    } else {
      this.headingPlayerSkill = 0;
    }
    if (
      pesMasterPlayer?.specialStats?.includes(PESMASTER_SKILL.LONG_RANGE_CURLER)
    ) {
      this.longRangeDrive = 1;
      this.playerSkills += "*Long Range Drive" + "\n";
    } else {
      this.longRangeDrive = 0;
    }

    if (
      pesMasterPlayer?.specialStats?.includes(PESMASTER_SKILL.CHIP_SHOT_CONTROL)
    ) {
      this.chipShotControl = 1;
      this.playerSkills += "*Chip Shot Control" + "\n";
    } else {
      this.chipShotControl = 0;
    }
    if (
      pesMasterPlayer?.specialStats?.includes(
        PESMASTER_SKILL.LONG_RANGE_SHOOTING,
      )
    ) {
      this.longRangeShooting = 1;
      this.playerSkills += "*Long Range Shooting" + "\n";
    } else {
      this.longRangeShooting = 0;
    }
    if (pesMasterPlayer?.specialStats?.includes(PESMASTER_SKILL.KNUCKLE_SHOT)) {
      this.knuckleShots = 1;
      this.playerSkills += "*Knuckle Shot" + "\n";
    } else {
      this.knuckleShots = 0;
    }

    if (pesMasterPlayer?.specialStats?.includes(PESMASTER_SKILL.DIPPING_SHOT)) {
      this.dippingShot = 1;
      this.playerSkills += "*Dipping Shot" + "\n";
    } else {
      this.dippingShot = 0;
    }
    if (pesMasterPlayer?.specialStats?.includes(PESMASTER_SKILL.RISING_SHOT)) {
      this.risingShots = 1;
      this.playerSkills += "*Rising Shots" + "\n";
    } else {
      this.risingShots = 0;
    }
    if (
      pesMasterPlayer?.specialStats?.includes(
        PESMASTER_SKILL.ACROBATIC_FINISHING,
      )
    ) {
      this.acrobaticFinishing = 1;
      this.playerSkills += "*Acrobatic Finishing" + "\n";
    } else {
      this.acrobaticFinishing = 0;
    }

    if (pesMasterPlayer?.specialStats?.includes(PESMASTER_SKILL.HEEL_TRICK)) {
      this.heelTrick = 1;
      this.playerSkills += "*Heel Trick" + "\n";
    } else {
      this.heelTrick = 0;
    }
    if (
      pesMasterPlayer?.specialStats?.includes(PESMASTER_SKILL.FIRST_TIME_SHOT)
    ) {
      this.firstTimeShot = 1;
      this.playerSkills += "*First-time Shot" + "\n";
    } else {
      this.firstTimeShot = 0;
    }
    if (
      pesMasterPlayer?.specialStats?.includes(PESMASTER_SKILL.ONE_TOUCH_PASS)
    ) {
      this.oneTouchPass = 1;
      this.playerSkills += "*One-touch Pass" + "\n";
    } else {
      this.oneTouchPass = 0;
    }

    if (
      pesMasterPlayer?.specialStats?.includes(PESMASTER_SKILL.THROUGH_PASSING)
    ) {
      this.throughPassing = 1;
      this.playerSkills += "*Through Passing" + "\n";
    } else {
      this.throughPassing = 0;
    }
    if (
      pesMasterPlayer?.specialStats?.includes(PESMASTER_SKILL.WEIGHTED_PASS)
    ) {
      this.weightedPass = 1;
      this.playerSkills += "*Weighted Pass" + "\n";
    } else {
      this.weightedPass = 0;
    }
    if (
      pesMasterPlayer?.specialStats?.includes(PESMASTER_SKILL.PINPOINT_CROSSING)
    ) {
      this.pinpointCrossing = 1;
      this.playerSkills += "*Pinpoint Crossing" + "\n";
    } else {
      this.pinpointCrossing = 0;
    }

    if (
      pesMasterPlayer?.specialStats?.includes(PESMASTER_SKILL.OUTSIDE_CURLER)
    ) {
      this.outsideCurler = 1;
      this.playerSkills += "*Outside Curler" + "\n";
    } else {
      this.outsideCurler = 0;
    }
    if (pesMasterPlayer?.specialStats?.includes(PESMASTER_SKILL.RABONA)) {
      this.rabona = 1;
      this.playerSkills += "*Rabona" + "\n";
    } else {
      this.rabona = 0;
    }
    if (pesMasterPlayer?.specialStats?.includes(PESMASTER_SKILL.NO_LOOK_PASS)) {
      this.noLookPass = 1;
      this.playerSkills += "*No Look Pass" + "\n";
    } else {
      this.noLookPass = 0;
    }

    if (
      pesMasterPlayer?.specialStats?.includes(PESMASTER_SKILL.LOW_LOFTED_PASS)
    ) {
      this.lowLoftedPass = 1;
      this.playerSkills += "*Low Lofted Pass" + "\n";
    } else {
      this.lowLoftedPass = 0;
    }
    if (pesMasterPlayer?.specialStats?.includes(PESMASTER_SKILL.GK_LOW_PUNT)) {
      this.gkLowPunt = 1;
      this.playerSkills += "*GK Low Punt" + "\n";
    } else {
      this.gkLowPunt = 0;
    }
    if (pesMasterPlayer?.specialStats?.includes(PESMASTER_SKILL.GK_HIGH_PUNT)) {
      this.gkHighPunt = 1;
      this.playerSkills += "*GK High Punt" + "\n";
    } else {
      this.gkHighPunt = 0;
    }

    if (pesMasterPlayer?.specialStats?.includes(PESMASTER_SKILL.LONG_THROW)) {
      this.longThrow = 1;
      this.playerSkills += "*Long Throw" + "\n";
    } else {
      this.longThrow = 0;
    }
    if (
      pesMasterPlayer?.specialStats?.includes(PESMASTER_SKILL.GK_LONG_THROW)
    ) {
      this.gkLongThrow = 1;
      this.playerSkills += "*GK Long Throw" + "\n";
    } else {
      this.gkLongThrow = 0;
    }
    if (
      pesMasterPlayer?.specialStats?.includes(
        PESMASTER_SKILL.PENALTY_SPECIALIST,
      )
    ) {
      this.penaltySpecialist = 1;
      this.playerSkills += "*Penalty Specialist" + "\n";
    } else {
      this.penaltySpecialist = 0;
    }

    if (
      pesMasterPlayer?.specialStats?.includes(PESMASTER_SKILL.GK_PENALTY_SAVER)
    ) {
      this.gkPenaltySaver = 1;
      this.playerSkills += "*GK Penalty Saver" + "\n";
    } else {
      this.gkPenaltySaver = 0;
    }
    if (pesMasterPlayer?.specialStats?.includes(PESMASTER_SKILL.GAMESMANSHIP)) {
      this.gamesmanship = 1;
      this.playerSkills += "*Gamesmanship" + "\n";
    } else {
      this.gamesmanship = 0;
    }
    if (pesMasterPlayer?.specialStats?.includes(PESMASTER_SKILL.MAN_MARKING)) {
      this.manMarking = 1;
      this.playerSkills += "*Man Marking" + "\n";
    } else {
      this.manMarking = 0;
    }

    if (pesMasterPlayer?.specialStats?.includes(PESMASTER_SKILL.TRACK_BACK)) {
      this.trackBack = 1;
      this.playerSkills += "*Track Back" + "\n";
    } else {
      this.trackBack = 0;
    }
    if (pesMasterPlayer?.specialStats?.includes(PESMASTER_SKILL.INTERCEPTION)) {
      this.interception = 1;
      this.playerSkills += "*Interception" + "\n";
    } else {
      this.interception = 0;
    }

    if (
      pesMasterPlayer?.specialStats?.includes(
        PESMASTER_SKILL.ACROBATIC_CLEARANCE,
      )
    ) {
      this.acrobaticClear = 1;
      this.playerSkills += "*Acrobatic Clear" + "\n";
    } else {
      this.acrobaticClear = 0;
    }
    if (pesMasterPlayer?.specialStats?.includes(PESMASTER_SKILL.CAPTAINCY)) {
      this.captaincy = 1;
      this.playerSkills += "*Captaincy" + "\n";
    } else {
      this.captaincy = 0;
    }
    if (pesMasterPlayer?.specialStats?.includes(PESMASTER_SKILL.SUPER_SUB)) {
      this.superSub = 1;
      this.playerSkills += "*Super-sub" + "\n";
    } else {
      this.superSub = 0;
    }

    if (
      pesMasterPlayer?.specialStats?.includes(PESMASTER_SKILL.FIGHTING_SPIRIT)
    ) {
      this.fightingSpirit = 1;
      this.playerSkills += "*Fighting Spirit" + "\n";
    } else {
      this.fightingSpirit = 0;
    }
    if (pesMasterPlayer?.specialStats?.includes(PESMASTER_SKILL.TRICKSTER)) {
      this.trickster = 1;
      this.COMPlayingStyles += "*Trickster" + "\n";
    } else {
      this.trickster = 0;
    }

    if (pesMasterPlayer?.specialStats?.includes(PESMASTER_SKILL.MAZING_RUN)) {
      this.mazingRun = 1;
      this.COMPlayingStyles += "*Mazing Run" + "\n";
    } else {
      this.mazingRun = 0;
    }
    if (
      pesMasterPlayer?.specialStats?.includes(PESMASTER_SKILL.SPEEDING_BULLET)
    ) {
      this.speedingBullet = 1;
      this.COMPlayingStyles += "*Speeding Bullet" + "\n";
    } else {
      this.speedingBullet = 0;
    }
    if (pesMasterPlayer?.specialStats?.includes(PESMASTER_SKILL.INCISIVE_RUN)) {
      this.incisiveRun = 1;
      this.COMPlayingStyles += "*Incisive Run" + "\n";
    } else {
      this.incisiveRun = 0;
    }

    if (
      pesMasterPlayer?.specialStats?.includes(PESMASTER_SKILL.LONG_BALL_EXPERT)
    ) {
      this.longBallExpert = 1;
      this.COMPlayingStyles += "*Long Ball Expert" + "\n";
    } else {
      this.longBallExpert = 0;
    }
    if (
      pesMasterPlayer?.specialStats?.includes(PESMASTER_SKILL.EARLY_CROSSER)
    ) {
      this.earlyCross = 1;
      this.COMPlayingStyles += "*Early Cross" + "\n";
    } else {
      this.earlyCross = 0;
    }
    if (pesMasterPlayer?.specialStats?.includes(PESMASTER_SKILL.LONG_RANGER)) {
      this.longRanger = 1;
      this.playerSkills += "*Long Ranger" + "\n";
    } else {
      this.longRanger = 0;
    }
    if (pesMasterPlayer.specialStats.includes(PESMASTER_SKILL.GOAL_POACHER)) {
      this.playingStyle = "Goal Poacher";
    }
    if (pesMasterPlayer.specialStats.includes(PESMASTER_SKILL.DUMMY_RUNNER)) {
      this.playingStyle = "Dummy Runner";
    }
    if (pesMasterPlayer.specialStats.includes(PESMASTER_SKILL.FOX_IN_THE_BOX)) {
      this.playingStyle = "Fox in the Box";
    }
    if (pesMasterPlayer.specialStats.includes(PESMASTER_SKILL.CLASSIC_NO_10)) {
      this.playingStyle = "Classic No. 10";
    }
    if (pesMasterPlayer.specialStats.includes(PESMASTER_SKILL.HOLE_PLAYER)) {
      this.playingStyle = "Hole Player";
    }
    if (pesMasterPlayer.specialStats.includes(PESMASTER_SKILL.BOX_TO_BOX)) {
      this.playingStyle = "Box-to-Box";
    }
    if (pesMasterPlayer.specialStats.includes(PESMASTER_SKILL.ANCHOR_MAN)) {
      this.playingStyle = "Anchor Man";
    }
    if (pesMasterPlayer.specialStats.includes(PESMASTER_SKILL.THE_DESTROYER)) {
      this.playingStyle = "The Destroyer";
    }
    if (pesMasterPlayer.specialStats.includes(PESMASTER_SKILL.EXTRA_FRONTMAN)) {
      this.playingStyle = "Extra Frontman";
    }
    if (
      pesMasterPlayer.specialStats.includes(PESMASTER_SKILL.OFFENSIVE_FULL_BACK)
    ) {
      this.playingStyle = "Offensive Full-back";
    }
    if (
      pesMasterPlayer.specialStats.includes(PESMASTER_SKILL.DEFENSIVE_FULL_BACK)
    ) {
      this.playingStyle = "Defensive Full-back";
    }
    if (pesMasterPlayer.specialStats?.includes(PESMASTER_SKILL.TARGET_MAN)) {
      this.playingStyle = "Target Man";
    }
    if (
      pesMasterPlayer.specialStats.includes(PESMASTER_SKILL.CREATIVE_PLAYMAKER)
    ) {
      this.playingStyle = "Creative Playmaker";
    }
    if (pesMasterPlayer.specialStats.includes(PESMASTER_SKILL.BUILD_UP)) {
      this.playingStyle = "Build Up";
    }
    if (
      pesMasterPlayer.specialStats.includes(
        PESMASTER_SKILL.OFFENSIVE_GOALKEEPER,
      )
    ) {
      this.playingStyle = "Offensive Goalkeeper";
    }
    if (
      pesMasterPlayer.specialStats.includes(
        PESMASTER_SKILL.DEFENSIVE_GOALKEEPER,
      )
    ) {
      this.playingStyle = "Defensive Goalkeeper";
    }
    if (pesMasterPlayer.specialStats.includes(PESMASTER_SKILL.ROAMING_FLANK)) {
      this.playingStyle = "Roaming Flank";
    }
    if (
      pesMasterPlayer.specialStats.includes(PESMASTER_SKILL.CROSS_SPECIALIST)
    ) {
      this.playingStyle = "Cross Specialist";
    }
    if (pesMasterPlayer.specialStats.includes(PESMASTER_SKILL.ORCHESTRATOR)) {
      this.playingStyle = "Orchestrator";
    }
    if (
      pesMasterPlayer.specialStats.includes(PESMASTER_SKILL.FULL_BACK_FINISHER)
    ) {
      this.playingStyle = "Full-back Finisher";
    }
    if (
      pesMasterPlayer.specialStats.includes(PESMASTER_SKILL.PROLIFIC_WINGER)
    ) {
      this.playingStyle = "Prolific Winger";
    }
  }
}
