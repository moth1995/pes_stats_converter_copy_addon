"use strict";

/**
 * Copy a string to the system clipboard via the browser Clipboard API.
 *
 * @param {string} text - The text to copy.
 * @returns {void}
 */
function copyToClipboard(text) {
  navigator.clipboard
    .writeText(text)
    .then(() => {
      console.log("Text copied to clipboard");
    })
    .catch((error) => {
      console.error("Error copying text to clipboard:", error);
    });
}

/**
 * Case-insensitive check for `searchString` within `array`.
 *
 * @param {string[]} array - Array of strings to search.
 * @param {string} searchString - The value to look for (case-insensitive).
 * @returns {boolean} True if a case-insensitive match exists.
 */
function stringInArray(array, searchString) {
  return array.some(
    (item) => item.toLowerCase() === searchString.toLowerCase(),
  );
}

/**
 * Batch-request delay configuration.
 *
 * Stored values are milliseconds. The popup presents them as seconds.
 */
const DEFAULT_BATCH_REQUEST_DELAY_MS = 3000;
const MIN_BATCH_REQUEST_DELAY_MS = 1000;
const MAX_BATCH_REQUEST_DELAY_MS = 10000;

/**
 * Read the configured delay between requests performed by batch importers.
 *
 * The setting is read from chrome.storage.local and clamped so an invalid
 * or manually modified storage value cannot produce an unreasonable delay.
 *
 * @returns {Promise<number>} Delay in milliseconds.
 */
function getBatchRequestDelay() {
  return new Promise((resolve) => {
    chrome.storage.local.get(
      ["batchRequestDelayMs"],

      /** @param {PESStorageData} result */
      function (result) {
        const storedDelay = result.batchRequestDelayMs;

        if (typeof storedDelay !== "number" || !Number.isFinite(storedDelay)) {
          resolve(DEFAULT_BATCH_REQUEST_DELAY_MS);
          return;
        }

        resolve(
          clamp(
            MIN_BATCH_REQUEST_DELAY_MS,
            MAX_BATCH_REQUEST_DELAY_MS,
            Math.round(storedDelay),
          ),
        );
      },
    );
  });
}

/**
 * Fixed-position offset (px) from whichever screen edge(s) the button hugs.
 *
 * @type {number}
 */
const BUTTON_POSITION_OFFSET_PX = 20;

/**
 * The nine valid BUTTON_POSITION values, for validating untrusted input
 * (e.g. a manually-edited or stale chrome.storage value) at runtime -
 * JSDoc types give no such guarantee once storage is involved.
 *
 * @type {Set<string>}
 */
const VALID_BUTTON_POSITIONS = new Set(Object.values(BUTTON_POSITION));

/**
 * Apply one of the nine BUTTON_POSITION values to the floating button's
 * inline style. Every offset is reset first so switching positions never
 * leaves a stale offset behind from a previously applied one. An
 * unrecognized position is a no-op, leaving the button's current style
 * untouched rather than resetting it to an all-"auto" (effectively
 * unpositioned) layout.
 *
 * @param {CSSStyleDeclaration} style - The button's style object.
 * @param {ButtonPosition} position - One of the nine BUTTON_POSITION values.
 * @returns {void}
 */
function applyButtonPosition(style, position) {
  if (!VALID_BUTTON_POSITIONS.has(position)) {
    debugWarn("core:button-position", "unrecognized position", position);
    return;
  }

  const edge = `${BUTTON_POSITION_OFFSET_PX}px`;

  style.position = "fixed";
  style.top = "auto";
  style.bottom = "auto";
  style.left = "auto";
  style.right = "auto";
  style.transform = "none";

  switch (position) {
    case BUTTON_POSITION.TOP_LEFT:
      style.top = edge;
      style.left = edge;
      break;
    case BUTTON_POSITION.TOP_CENTER:
      style.top = edge;
      style.left = "50%";
      style.transform = "translateX(-50%)";
      break;
    case BUTTON_POSITION.TOP_RIGHT:
      style.top = edge;
      style.right = edge;
      break;
    case BUTTON_POSITION.MIDDLE_LEFT:
      style.top = "50%";
      style.left = edge;
      style.transform = "translateY(-50%)";
      break;
    case BUTTON_POSITION.MIDDLE_CENTER:
      style.top = "50%";
      style.left = "50%";
      style.transform = "translate(-50%, -50%)";
      break;
    case BUTTON_POSITION.MIDDLE_RIGHT:
      style.top = "50%";
      style.right = edge;
      style.transform = "translateY(-50%)";
      break;
    case BUTTON_POSITION.BOTTOM_LEFT:
      style.bottom = edge;
      style.left = edge;
      break;
    case BUTTON_POSITION.BOTTOM_CENTER:
      style.bottom = edge;
      style.left = "50%";
      style.transform = "translateX(-50%)";
      break;
    case BUTTON_POSITION.BOTTOM_RIGHT:
      style.bottom = edge;
      style.right = edge;
      break;
  }
}

/**
 * PES5 CSV column headers (populated as the first stored row).
 *
 * @type {string}
 */
const PES5_CSV_COLUMNS =
  "ID,NAME,SHIRT_NAME,NATIONALITY,AGE,STRONG FOOT,INJURY TOLERANCE,REGISTERED POSITION,FAVOURED SIDE,GK  0,CWP  2,CBT  3,SB  4,DMF  5,WB  6,CMF  7,SMF  8,AMF  9,WF 10,SS  11,CF  12,ATTACK,DEFENSE,BALANCE,STAMINA,TOP SPEED,ACCELERATION,RESPONSE,AGILITY,DRIBBLE ACCURACY,DRIBBLE SPEED,SHORT PASS ACCURACY,SHORT PASS SPEED,LONG PASS ACCURACY,LONG PASS SPEED,SHOT ACCURACY,SHOT POWER,SHOT TECHNIQUE,FREE KICK ACCURACY,CURLING,HEADING,JUMP,TECHNIQUE,AGGRESSION,MENTALITY,GOAL KEEPING,TEAM WORK,CONSISTENCY,CONDITION / FITNESS,WEAK FOOT ACCURACY,WEAK FOOT FREQUENCY,DRIBBLING,TACTICAL DRIBBLE,POSITIONING,REACTION,PLAYMAKING,PASSING,SCORING,1-1 SCORING,POST PLAYER,LINES,MIDDLE SHOOTING,SIDE,CENTRE,PENALTIES,1-TOUCH PASS,OUTSIDE,MARKING,SLIDING,COVERING,D-LINE CONTROL,PENALTY STOPPER,1-ON-1 STOPPER,LONG THROW,HEIGHT,WEIGHT";
/**
 * PES13 CSV column headers (populated as the first stored row).
 *
 * @type {string}
 */
const PES13_CSV_COLUMNS =
  "INDEX,NAME,SHIRTNAME,JAPANESE PLAYER NAME,SPACING,COMMENTARY,AGE,NATIONALITY,FOOT,WEIGHT,HEIGHT,FORM,WEAK FOOT ACCURACY,WEAK FOOT FREQUENCY,INJURY TOLERANCE,GROWTH TYPE,MARKET PRICE,GK 0,SW 1,CB 2,LB 3,RB 4,DMF 5,CMF 6,LMF 7,RMF 8,AMF 9,LWF 10,RWF 11,SS 12,CF 13,POSITION,ATTACK,DEFENCE,HEADER ACCURACY,DRIBBLE ACCURACY,SHORT PASS ACCURACY,SHORT PASS SPEED,LONG PASS ACCURACY,LONG PASS SPEED,SHOT ACCURACY,PLACE KICKING,SWERVE,BALL CONTROLL,GOAL KEEPING SKILLS,RESPONSE,EXPLOSIVE POWER,DRIBBLE SPEED,TOP SPEED,BODY BALANCE,STAMINA,KICKING POWER,JUMP,TENACITY,TEAMWORK,S01 1-TOUCH PLAY,S02 OUTSIDE CURVE,S03 LONG THROW,S04 SUPER-SUB,S05 SPEED MERCHANT,S06 LONG RANGE DRIVE,S07 SHOULDER FEINT SKILLS,S08 TURNING SKILLS,S09 ROULETTE SKILLS,S10 FLIP FLAP SKILLS,S11 FLICKING SKILLS,S12 SCISSORS SKILLS,S13 STEP ON SKILLS,S14 DEFT TOUCH SKILLS,S15 KNUCKLE SHOT,S16 JUMPING VOLLEY,S17 SCISSOR KICK,S18 HEEL FLICK,S19 WEIGHTED PASS,S20 DOUBLE TOUCH,S21 RUN AROUND,S22 SOMBRERO,S23 180 DRAG,S24 LUNGING TACKLE,S25 DIVING HEADER,S26 GK LONG THROW,P01 CLASSIC NO.10,P02 ANCHOR MAN,P03 TRICKSTER,P04 DARTING RUN,P05 MAZING RUN,P06 PINPOINT PASS,P07 EARLY CROSS,P08 BOX TO BOX,P09 INCISIVE RUN,P10 LONG RANGER,P11 ENFORCER,P12 GOAL POACHER,P13 DUMMY RUNNER,P14 FREE ROAMING,P15 TALISMAN,P16 FOX IN THE BOX,P17 OFFENSIVE SIDEBACK,P18 TRACK BACK,ATTACK AWARENESS,DEFENCE AWARENESS,SKIN COLOR,SKIN TEXTURE,FACE MODE,LINKED FACE,FACE SLOT,LINKED HAIR,HAIR SLOT,BOOTS,UNTUCKED SHIRT,TIGHT KIT,GLOVES,DRIBBLE STYLE,FREE KICK STYLE,PENALTY KICK STYLE,DROP KICK STYLE,GOAL CELEBRATION STYLE #1,GOAL CELEBRATION STYLE #2,CLUB TEAM,NUMBER,NATIONAL TEAM";
/**
 * PES21 CSV column headers (populated as the first stored row).
 *
 * @type {string}
 */
const PES21_CSV_COLUMNS =
  "Id;Name;JapName;Shirt;ShirtNational;Commentary;Country;Country2;Height;Weight;Age;Foot;PlayingStyle;POS;GK;CB;LB;RB;DMF;CMF;LMF;RMF;AMF;LWF;RWF;SS;CF;OffensiveAwareness;BallControl;Dribbling;TightPossession;LowPass;LoftedPass;Finishing;Heading;PlaceKicking;Curl;Speed;Acceleration;KickingPower;Jump;PhysicalContact;Balance;Stamina;DefensiveAwareness;BallWinning;Aggression;GKAwareness;GKCatching;GKClearing;GKReflexes;GKReach;WeakFootUsage;WeakFootAcc;Form;InjuryResistance;Reputation;PlayingAttitude;Trickster;MazingRun;SpeedingBullet;IncisiveRun;LongBallExpert;EarlyCross;LongRanger;ScissorsFeint;DoubleTouch;FlipFlap;MarseilleTurn;Sombrero;CrossOverTurn;CutBehindAndTurn;ScotchMove;StepOnSkillcontrol;HeadingSpecial;LongRangeDrive;Chipshotcontrol;LongRangeShot;KnuckleShot;DippingShots;RisingShots;AcrobaticFinishing;HeelTrick;FirstTimeShot;OneTouchPass;ThroughPassing;WeightedPass;PinpointCrossing;OutsideCurler;Rabona;NoLookPass;LowLoftedPass;GKLowPunt;GKHighPunt;LongThrow;GKLongThrow;PenaltySpecialist;GKPenaltySaver;Gamesmanship;ManMarking;TrackBack;Interception;AcrobaticClear;Captaincy;SuperSub;FightingSpirit;Celebration1;Celebration2;DribblingHunching;DribblingArmMove.;RunningHunching;RunningArmMovement;CornerKicks;FreeKicks;PenaltyKick;DribbleMotion;YouthClub;OwnerClub;ContractUntil;LoanUntil;MarketValue;NationalCaps;Legend;Hand;WinnerGoldenBall;EditName;EditBasics;EditPosition;EditPositions;EditAbilities;EditPlayerSkills;EditPlayingStyle;EditCOMPlayingStyles;EditMovements;Edit1;Edit2;Edit3;Edit4;Edit5;Edit6;Edit7;Value1;Value2;Value3;Value2020_1;Value2020_2;Appearance;ListBoots;ListGloves;InEditFile;OverallStats";

/**
 * Append a PES5 CSV row to chrome.storage, seeding the header row first.
 *
 * @param {string} playerData - The PES5 CSV row to store.
 * @returns {void}
 */
function addPlayer(playerData) {
  chrome.storage.local.get(
    ["playersData"],
    /** @param {PESStorageData} result */ function (result) {
      const playersData = result.playersData || [];

      if (playersData.length == 0) {
        playersData.push(PES5_CSV_COLUMNS);
      }

      playersData.push(playerData);
      chrome.storage.local.set({ playersData: playersData }, function () {
        console.log("Player PES5 added to array5");
      });
    },
  );
}

/**
 * Append a PES13 CSV row to chrome.storage, seeding the header row first.
 *
 * @param {string} player13Data - The PES13 CSV row to store.
 * @returns {void}
 */
function addPlayer13(player13Data) {
  debugLog("core:storage", "adding player13", player13Data);
  chrome.storage.local.get(
    ["players13Data"],
    /** @param {PESStorageData} result */ function (result) {
      const players13Data = result.players13Data || [];

      if (players13Data.length == 0) {
        players13Data.push(PES13_CSV_COLUMNS);
      }

      players13Data.push(player13Data);
      debugLog("core:storage", "players13Data", players13Data);
      chrome.storage.local.set({ players13Data: players13Data }, function () {
        console.log("Player PES13 added to array13");
      });
    },
  );
}

/**
 * Append a PES21 CSV row to chrome.storage, seeding the header row first.
 *
 * @param {string} player21Data - The PES21 CSV row to store.
 * @returns {void}
 */
function addPlayer21(player21Data) {
  chrome.storage.local.get(
    ["players21Data"],
    /** @param {PESStorageData} result */ function (result) {
      const players21Data = result.players21Data || [];

      if (players21Data.length == 0) {
        players21Data.push(PES21_CSV_COLUMNS);
      }

      players21Data.push(player21Data);
      chrome.storage.local.set({ players21Data: players21Data }, function () {
        console.log("Player PES21 added to array21");
      });
    },
  );
}

/**
 * Append multiple CSV player rows using a single storage transaction.
 *
 * This is intended for team imports. Unlike repeatedly calling addPlayer(),
 * it performs one read and one write, avoiding overlapping read/modify/write
 * operations when many players are added at once.
 *
 * @param {string[]} playerRows - CSV rows to append.
 * @param {Format} format - PES output format.
 * @returns {Promise<void>}
 */
function addPlayers(playerRows, format) {
  if (playerRows.length === 0) {
    return Promise.resolve();
  }

  /** @type {"playersData"|"players13Data"|"players21Data"} */
  let storageKey = "playersData";

  let header = PES5_CSV_COLUMNS;

  if (format === FORMAT.PES13) {
    storageKey = "players13Data";
    header = PES13_CSV_COLUMNS;
  } else if (format === FORMAT.PES21) {
    storageKey = "players21Data";
    header = PES21_CSV_COLUMNS;
  } else if (format !== FORMAT.PES5) {
    return Promise.reject(new Error(`Unsupported batch CSV format: ${format}`));
  }

  return new Promise((resolve, reject) => {
    chrome.storage.local.get(
      [storageKey],

      /** @param {PESStorageData} result */
      function (result) {
        const storedRows = result[storageKey] || [];

        // Work on a new array rather than mutating the value returned
        // directly from chrome.storage.
        const rows = [...storedRows];

        if (rows.length === 0) {
          rows.push(header);
        }

        rows.push(...playerRows);

        chrome.storage.local.set(
          {
            [storageKey]: rows,
          },
          function () {
            if (chrome.runtime.lastError) {
              reject(new Error(chrome.runtime.lastError.message));
              return;
            }

            resolve();
          },
        );
      },
    );
  });
}

// Low-level math/random helpers moved to lib/utils.js (kept as global
// functions for the converters' bare-identifier call sites).

/**
 * Map an FM 1-20 attribute to a PES 40-100 stat using a random bucket.
 *
 * @param {number} stat - The FM attribute (1-20), rounded.
 * @returns {number} A PES stat in the 40-100 range.
 */
function fmToPesStat99(stat) {
  stat = Math.round(stat);
  let minArray = [
    40, 43, 46, 49, 52, 55, 58, 61, 64, 67, 70, 73, 76, 79, 82, 85, 88, 91, 94,
    97,
  ];
  let maxArray = [
    43, 46, 49, 52, 55, 58, 61, 64, 67, 70, 73, 76, 79, 82, 85, 88, 91, 94, 97,
    100,
  ];
  let PESStat = getRandomInt(minArray[stat - 1], maxArray[stat - 1]);
  return PESStat;
}

/**
 * Map an FM 1-20 attribute to a PES 1-8 rating.
 *
 * @param {number} stat - The FM attribute (1-20), rounded.
 * @returns {number} A PES rating in the 1-8 range.
 */
function fmToPesStat1To8(stat) {
  stat = Math.round(stat);
  let valuesArray = [
    1, 2, 3, 3, 3, 4, 4, 4, 5, 5, 5, 6, 6, 6, 7, 7, 7, 8, 8, 8,
  ];
  return valuesArray[stat - 1];
}

/**
 * Map an FM 1-20 attribute to a letter grade ("C", "B", or "A").
 *
 * @param {number} stat - The FM attribute (1-20), rounded.
 * @returns {Grade} "C", "B", or "A".
 */
function fmToPesStatAToC(stat) {
  stat = Math.round(stat);
  /** @type {Grade[]} */
  let valuesArray = [
    "C",
    "C",
    "C",
    "C",
    "C",
    "B",
    "B",
    "B",
    "B",
    "B",
    "B",
    "B",
    "B",
    "B",
    "A",
    "A",
    "A",
    "A",
    "A",
    "A",
  ];
  return valuesArray[stat - 1];
}

// Position parsing/mapping helpers moved to lib/positions.js (kept as global
// functions for the converters' bare-identifier call sites).

/**
 * Map an eFootball injury-resistance label to a PES letter grade.
 *
 * @param {string} injury - "Low", "Medium", or "High".
 * @returns {Grade} "C", "B", or "A" ("B" for unrecognised input).
 */
function efootballInjuryResistance(injury) {
  switch (injury) {
    case "Low":
      return "C";
    case "Medium":
      return "B";
    case "High":
      return "A";
    default:
      return "B";
  }
}

/**
 * Map an eFootball form letter to a PES 4-8 rating.
 *
 * @param {string} condition - "A", "B", "C", "D", or "E".
 * @returns {number} A PES rating (8, 7, 6, 5, or 4).
 */
function efootballCondition(condition) {
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
 * Map an eFootball weak-foot label to a PES 1-8 rating, gated by ball control.
 *
 * @param {string} weakFoot - eFootball weak-foot usage label.
 * @param {number} ballControl - The player's ball-control stat (0-99).
 * @returns {number} A PES weak-foot rating in the 1-8 range.
 */
function efootballWeakFoot(weakFoot, ballControl) {
  switch (weakFoot) {
    case "Slightly Low":
    case "Almost Never":
      return ballControl < 75 ? 1 : 2;
    case "Medium":
    case "Rarely":
      return ballControl < 75 ? 3 : 4;
    case "High":
    case "Occasionally":
      return ballControl < 75 ? 5 : 6;
    case "Very High":
    case "Regularly":
      return ballControl < 75 ? 7 : 8;
    default:
      return ballControl < 75 ? 3 : 4;
  }
}

/**
 * Height -> PES GK keeper-skills map.
 *
 * @type {Record<number, number>}
 */
const gkHeightTable = {
  175: 95,
  176: 94,
  177: 93,
  178: 92,
  179: 91,
  180: 90,
  181: 89,
  182: 88,
  183: 87,
  184: 86,
  185: 85,
  186: 84,
  187: 83,
  188: 82,
  189: 81,
  190: 80,
  191: 79,
  192: 78,
  193: 77,
  194: 76,
  195: 75,
  196: 74,
  197: 73,
  198: 72,
  199: 71,
  200: 70,
  201: 69,
  202: 68,
  203: 67,
  204: 66,
  205: 65,
};
/**
 * Height -> PES outfield jump map.
 *
 * @type {Record<number, number>}
 */
const playersHeightTable = {
  165: 95,
  166: 94,
  167: 93,
  168: 92,
  169: 91,
  170: 90,
  171: 89,
  172: 88,
  173: 87,
  174: 86,
  175: 85,
  176: 84,
  177: 83,
  178: 82,
  179: 81,
  180: 80,
  181: 79,
  182: 78,
  183: 77,
  184: 76,
  185: 75,
  186: 74,
  187: 73,
  188: 72,
  189: 71,
  190: 70,
  191: 69,
  192: 68,
  193: 67,
  194: 66,
  195: 65,
  196: 64,
  197: 63,
  198: 62,
  199: 61,
  200: 60,
  201: 59,
  202: 58,
  203: 57,
  204: 56,
  205: 55,
};

/**
 * Map a height (cm) to a PES stat using the GK or outfield table.
 *
 * @param {number} height - The player's height in cm.
 * @param {boolean} isGK - True to use the goalkeeper table.
 * @returns {number} The PES stat (55-95) for the given height.
 */
function heightTo99Stat(height, isGK) {
  if (isGK) {
    if (height in gkHeightTable) {
      return gkHeightTable[height];
    }
    return height < 175 ? 95 : 55;
  }

  if (height in playersHeightTable) {
    return playersHeightTable[height];
  }
  return height < 165 ? 95 : 55;
}

// `hasSpecialAbility` and the PES21 position maps moved to lib/abilities.js
// and lib/positions.js respectively (kept as global functions).

/**
 * Map an FM Current Ability (CA) to PES stat adjustment points.
 *
 * @param {number} ca - The FM current ability (1-200).
 * @returns {number} The adjustment in the -10..1 range.
 */
function caPoints(ca) {
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

/**
 * Convert an FM-derived formula stat to a PES21 40-99 stat.
 *
 * @param {number} statFromFormula - The raw formula output.
 * @param {number} max - The stat's maximum FM value.
 * @param {number} min - The stat's minimum FM value.
 * @param {number} ca - The player's FM current ability.
 * @returns {number} The clamped PES21 stat (40-99).
 */
function fmStatToPes21(statFromFormula, max, min, ca) {
  let caPointsValue = caPoints(ca);
  return Math.round(
    clamp(40, 99, ((max - min) / 20) * statFromFormula + min + caPointsValue),
  );
}

/**
 * Map an FM 1-20 attribute to a PES21 1-3 rating.
 *
 * @param {number} stat - The FM attribute (1-20), rounded.
 * @returns {number} A PES21 rating (1, 2, or 3).
 */
function fmToPes21Stat1To3(stat) {
  stat = Math.round(stat);
  if (stat < 8) return 1;
  else if (stat < 15) return 2;
  else return 3;
}

/**
 * Map an FM 1-20 attribute to a PES21 2-8 rating.
 *
 * @param {number} stat - The FM attribute (1-20), rounded.
 * @returns {number} A PES21 rating in the 2-8 range.
 */
function fmToPes21Stat1To8(stat) {
  stat = Math.round(stat);
  if (stat < 4) return 2;
  else if (stat < 7) return 3;
  else if (stat < 10) return 4;
  else if (stat < 13) return 5;
  else if (stat < 16) return 6;
  else if (stat < 19) return 7;
  else return 8;
}

/**
 * Return the key with the highest numeric value in `data`.
 *
 * @param {Record<string, number>} data - Object mapping keys to numeric values.
 * @returns {string} The key with the maximum value ("" for empty objects).
 */
function getMaxKeyFromObject(data) {
  let maxKey = "";
  let maxValue = -Infinity;

  for (const key in data) {
    const value = data[key];
    if (value > maxValue) {
      maxValue = value;
      maxKey = key;
    }
  }
  debugLog("core:playing-style", "maxKey", maxKey, "maxValue", maxValue);
  return maxKey;
}

/**
 * Match an FM role string to a PES21 playing style, gated by PES position.
 *
 * @param {string} role - Lowercased FM role (e.g. "advanced playmaker").
 * @param {string} position - PES position code (e.g. "AMF").
 * @returns {string} The matching PES21 playing style, or "" if none.
 */
function getPlayingStyle(role, position) {
  /** @type {Record<string, string[]>} */
  const styleRules = {
    "Goalkeeper Defensive": ["goalkeeper defensive"],
    "Goalkeeper Offensive": ["sweeper keeper"],
    "The Destroyer": [
      "libero",
      "centre-back",
      "central defender",
      "ball-winning midfielder",
    ],
    "Build Up": ["ball playing defender"],
    "Extra Frontman": ["no-nonsense centreback", "wide centre-back"],
    "Full Back Finisher": ["complete wing-back", "inverted wing-back"],
    "Offensive Full Back": ["full-back", "fing-back"],
    "Defensive Full Back": ["no-nonsense full-back"],
    Orchestrator: [
      "roaming playmaker",
      "deep-lying playmaker",
      "regista",
      "half-back",
    ],
    "Box To Box": [
      "segundo volante",
      "defensive midfielder",
      "box to box midfielder",
      "central midfielder",
      "carrilero",
      "defensive winger",
    ],
    "Anchor Man": ["anchor man"],
    "Hole Player": [
      "mezzala",
      "advanced playmaker",
      "wide playmaker",
      "wide midfielder",
      "second striker",
    ],
    "Classic N.10": ["roaming playmaker", "trequartista"],
    "Cross Specialist": ["winger", "wide target man"],
    "Roaming Flank": ["inverted winger", "inside forward"],
    "Creative Playmaker": [
      "advanced playmaker",
      "attacking midfielder",
      "raumdeuter",
      "trequartista",
    ],
    "Dummy Runner": [
      "enganche",
      "deep lying forward",
      "false nine",
      "trequartista",
    ],
    "Prolific Winger": ["winger"],
    "Goal Poacher": [
      "complete forward",
      "poacher",
      "target man",
      "pressing forward",
    ],
    "Fox In The Box": ["advanced forward", "complete forward"],
    "Target Man": ["deep lying forward", "target man"],
  };
  /** @type {Record<string, string[]>} */
  const styleRulesByPosition = {
    GK: ["Goalkeeper Defensive", "Goalkeeper Offensive"],
    CB: ["The Destroyer", "Build Up", "Extra Frontman"],
    RB: ["Full Back Finisher", "Offensive Full Back", "Defensive Full Back"],
    LB: ["Full Back Finisher", "Offensive Full Back", "Defensive Full Back"],
    DMF: ["Orchestrator", "Box To Box", "The Destroyer", "Anchor Man"],
    CMF: [
      "Hole Player",
      "Classic N.10",
      "Orchestrator",
      "Box To Box",
      "The Destroyer",
    ],
    RMF: ["Cross Specialist", "Roaming Flank", "Hole Player", "Box To Box"],
    LMF: ["Cross Specialist", "Roaming Flank", "Hole Player", "Box To Box"],
    AMF: ["Hole Player", "Creative Playmaker", "Dummy Runner", "Classic N.10"],
    RWF: [
      "Roaming Flank",
      "Creative Playmaker",
      "Prolific Winger",
      "Cross Specialist",
    ],
    LWF: [
      "Roaming Flank",
      "Creative Playmaker",
      "Prolific Winger",
      "Cross Specialist",
    ],
    SS: [
      "Creative Playmaker",
      "Goal Poacher",
      "Dummy Runner",
      "Hole Player",
      "Classic N.10",
    ],
    CF: ["Fox In The Box", "Target Man", "Goal Poacher", "Dummy Runner"],
  };
  let positionStyles = styleRulesByPosition[position];
  for (const style of positionStyles) {
    debugLog("core:playing-style", "checking style", style);
    if (styleRules[style].includes(role)) {
      return style;
    }
  }
  return "";
}

/**
 * Determine the PES21 playing style from FM's best-suitable-roles map.
 *
 * @param {Record<string, number>} FMBestSuitableRoles - Role -> suitability map.
 * @param {string} pesPosition - PES21 position code (e.g. "AMF").
 * @returns {string} The matching playing style, or "" if none.
 */
function pes21GetPlayingStyle(FMBestSuitableRoles, pesPosition) {
  let role = getMaxKeyFromObject(FMBestSuitableRoles).toLowerCase();
  debugLog("core:playing-style", "role before replace", role);
  role = role.replace(/(\s+\(\w+\))/, "");
  debugLog("core:playing-style", "role after replace", role);
  let playingStyle = getPlayingStyle(role, pesPosition);

  return playingStyle;
}

/**
 * Compute a position-suitability weight for an FM player.
 *
 * @param {string} position - PES21 position code prefixed with "*" (e.g. "*CF").
 * @param {FMPlayer} fmPlayer - The scraped FM player.
 * @returns {number} The weighted suitability score, or -1 for unknown positions.
 */
function pes21GetPositionWeight(position, fmPlayer) {
  switch (position) {
    case "*GK":
      return (
        fmPlayer.stats[FM_STAT.DECISIONS] * 0.1 +
        fmPlayer.stats[FM_STAT.AGILITY] * 0.09 +
        fmPlayer.stats[FM_STAT.HANDLING] * 0.12 +
        fmPlayer.stats[FM_STAT.REFLEXES] * 0.12
      );
    case "*CB":
      return (
        fmPlayer.stats[FM_STAT.MARKING] * 0.1 +
        fmPlayer.stats[FM_STAT.DECISIONS] * 0.13 +
        fmPlayer.stats[FM_STAT.POSITIONING] * 0.1 +
        fmPlayer.stats[FM_STAT.ACCELERATION] * 0.09 +
        fmPlayer.stats[FM_STAT.JUMPING_REACH] * 0.08 +
        fmPlayer.stats[FM_STAT.PACE] * 0.08 +
        fmPlayer.stats[FM_STAT.STRENGTH] * 0.08
      );
    case "*RB":
    case "*LB":
      return (
        fmPlayer.stats[FM_STAT.TACKLING] * 0.07 +
        fmPlayer.stats[FM_STAT.CONCENTRATION] * 0.07 +
        fmPlayer.stats[FM_STAT.DECISIONS] * 0.13 +
        fmPlayer.stats[FM_STAT.POSITIONING] * 0.14 +
        fmPlayer.stats[FM_STAT.ACCELERATION] * 0.15 +
        fmPlayer.stats[FM_STAT.AGILITY] * 0.07 +
        fmPlayer.stats[FM_STAT.PACE] * 0.14
      );
    case "*DMF":
      return (
        fmPlayer.stats[FM_STAT.TACKLING] * 0.1 +
        fmPlayer.stats[FM_STAT.DECISIONS] * 0.11 +
        fmPlayer.stats[FM_STAT.ACCELERATION] * 0.12 +
        fmPlayer.stats[FM_STAT.AGILITY] * 0.07 +
        fmPlayer.stats[FM_STAT.PACE] * 0.08 +
        fmPlayer.stats[FM_STAT.STRENGTH] * 0.07
      );
    case "*RMF":
    case "*LMF":
      return (
        fmPlayer.stats[FM_STAT.ACCELERATION] * 0.26 +
        fmPlayer.stats[FM_STAT.AGILITY] * 0.07 +
        fmPlayer.stats[FM_STAT.PACE] * 0.2 +
        fmPlayer.stats[FM_STAT.STAMINA] * 0.05
      );
    case "*CMF":
      return (
        fmPlayer.stats[FM_STAT.PASSING] * 0.1 +
        fmPlayer.stats[FM_STAT.DECISIONS] * 0.07 +
        fmPlayer.stats[FM_STAT.VISION] * 0.11 +
        fmPlayer.stats[FM_STAT.ACCELERATION] * 0.12 +
        fmPlayer.stats[FM_STAT.AGILITY] * 0.07 +
        fmPlayer.stats[FM_STAT.PACE] * 0.1
      );
    case "*RWF":
    case "*LWF":
      return (
        fmPlayer.stats[FM_STAT.DRIBBLING] * 0.07 +
        fmPlayer.stats[FM_STAT.ACCELERATION] * 0.28 +
        fmPlayer.stats[FM_STAT.AGILITY] * 0.05 +
        fmPlayer.stats[FM_STAT.PACE] * 0.28
      );
    case "*AMF":
      return (
        fmPlayer.stats[FM_STAT.PASSING] * 0.06 +
        fmPlayer.stats[FM_STAT.VISION] * 0.09 +
        fmPlayer.stats[FM_STAT.ACCELERATION] * 0.23 +
        fmPlayer.stats[FM_STAT.PACE] * 0.13
      );
    case "*SS":
      return (
        fmPlayer.stats[FM_STAT.FINISHING] * 0.08 +
        fmPlayer.stats[FM_STAT.ACCELERATION] * 0.24 +
        fmPlayer.stats[FM_STAT.PACE] * 0.17 +
        fmPlayer.stats[FM_STAT.STRENGTH] * 0.06
      );
    case "*CF":
      return (
        fmPlayer.stats[FM_STAT.HEADING] * 0.13 +
        fmPlayer.stats[FM_STAT.ACCELERATION] * 0.17 +
        fmPlayer.stats[FM_STAT.JUMPING_REACH] * 0.12 +
        fmPlayer.stats[FM_STAT.PACE] * 0.1
      );
    default:
      return -1;
  }
}

/**
 * PES21 nation name -> numeric country id map.
 *
 * @type {Record<string, number>}
 */
const PES21_COUNTRY_MAP = {
  None: 0,
  Afghanistan: 1,
  Bahrain: 2,
  Bangladesh: 3,
  Bhutan: 4,
  Brunei: 5,
  Cambodia: 6,
  China: 7,
  "Hong Kong": 8,
  India: 9,
  Indonesia: 10,
  Iran: 11,
  Iraq: 12,
  Japan: 13,
  Jordan: 14,
  "North Korea": 15,
  "South Korea": 16,
  Kuwait: 17,
  Laos: 18,
  Lebanon: 19,
  Macao: 20,
  Malaysia: 21,
  Maldives: 22,
  Mongolia: 23,
  Myanmar: 24,
  Nepal: 25,
  Oman: 26,
  Pakistan: 27,
  Palestine: 28,
  Philippines: 29,
  Qatar: 30,
  "Saudi Arabia": 31,
  Singapore: 32,
  "Sri Lanka": 33,
  Syria: 34,
  Thailand: 36,
  Uae: 37,
  Vietnam: 38,
  Yemen: 39,
  "Kyrgyz Republic": 40,
  Tajikistan: 41,
  Turkmenistan: 42,
  "East Timor": 43,
  Algeria: 44,
  Angola: 45,
  Benin: 46,
  Botswana: 47,
  "Burkina Faso": 48,
  Burundi: 49,
  Cameroon: 50,
  "Cape Verde": 51,
  "Central African Rep.": 52,
  Chad: 53,
  "The Comoros": 54,
  "Congo Dr": 55,
  "Côte d'Ivoire": 56,
  Djibouti: 57,
  Egypt: 58,
  "Equatorial Guinea": 59,
  Eritrea: 60,
  Ethiopia: 61,
  Gabon: 62,
  "Republic of the Gambia": 63,
  Ghana: 64,
  Guinea: 65,
  "Guinea-Bissau": 66,
  Kenya: 67,
  Lesotho: 68,
  Liberia: 69,
  Libya: 70,
  Madagascar: 71,
  Malawi: 72,
  Mali: 73,
  Mauritania: 74,
  Mauritius: 75,
  Morocco: 76,
  Mozambique: 77,
  Namibia: 78,
  Niger: 79,
  Nigeria: 80,
  Rwanda: 81,
  "Sao Tomé and Principe": 82,
  Senegal: 83,
  Seychelles: 84,
  "Sierra Leone": 85,
  Somalia: 86,
  "South Africa": 87,
  Sudan: 88,
  Swaziland: 89,
  Tanzania: 90,
  Togo: 91,
  Tunisia: 92,
  Uganda: 93,
  Zambia: 94,
  Zimbabwe: 95,
  Congo: 98,
  Réunion: 100,
  Anguilla: 103,
  "Antiqua and Barbuda": 104,
  Aruba: 105,
  "The Bahamas": 106,
  Barbados: 107,
  Belize: 108,
  Bermuda: 109,
  Canada: 110,
  "Cayman Islands": 111,
  "Costa Rica": 112,
  Cuba: 113,
  Dominica: 114,
  "Dominican Republic": 115,
  "El Salvador": 116,
  Grenada: 117,
  Guadeloupe: 118,
  Guatemala: 119,
  Haiti: 120,
  Honduras: 121,
  Jamaica: 122,
  Martinique: 123,
  Mexico: 124,
  Montserrat: 125,
  "Netherlands Antilles": 126,
  Nicaragua: 127,
  Panama: 128,
  "Puerto Rico": 129,
  "Saint Kitts and Nevis": 130,
  "Saint Lucia": 131,
  "St Vincent and Grenadines": 132,
  "Trinidad and Tobago": 133,
  "Turks and Caicos Is.": 134,
  "United States": 135,
  "British Virgin Islands": 136,
  "U.S. Virgin Islands": 137,
  "French Guiana": 138,
  Suriname: 139,
  Curaçao: 140,
  Argentina: 144,
  Bolivia: 145,
  Brazil: 146,
  Chile: 147,
  Colombia: 148,
  Ecuador: 149,
  Paraguay: 150,
  Peru: 151,
  Uruguay: 152,
  Venezuela: 153,
  Gyuana: 159,
  "American Samoa": 161,
  Australia: 162,
  "Cook Islands": 163,
  Fiji: 164,
  "New Caledonia": 165,
  "New Zealand": 166,
  "Papua New Guinea": 167,
  Samoa: 168,
  "Solomon Islands": 169,
  Tahiti: 170,
  Tonga: 171,
  Vanuatu: 172,
  Guam: 176,
  Palau: 184,
  Israel: 189,
  Turkey: 190,
  Albania: 191,
  Andorra: 192,
  Armenia: 193,
  Austria: 194,
  Azerbaijan: 195,
  Belarus: 196,
  Belgium: 197,
  "Bosnia and Herzegovina": 198,
  Bulgaria: 199,
  Croatia: 200,
  Cyprus: 201,
  "Czech Republic": 202,
  Denmark: 203,
  England: 204,
  Estonia: 205,
  "Faroe Islands": 206,
  Finland: 207,
  France: 208,
  Georgia: 209,
  Germany: 210,
  Greece: 211,
  Hungary: 212,
  Iceland: 213,
  "Republic of Ireland": 214,
  Italy: 215,
  Kazakhstan: 216,
  Latvia: 217,
  Liechtenstein: 218,
  Lithuania: 219,
  Luxembourg: 220,
  Macedonia: 221,
  Malta: 222,
  Moldova: 223,
  Netherlands: 224,
  "Northern Ireland": 225,
  Norway: 226,
  Poland: 227,
  Portugal: 228,
  Romania: 229,
  Russia: 230,
  "San Marino": 231,
  Scotland: 232,
  Slovakia: 234,
  Slovenia: 235,
  Spain: 236,
  Sweden: 237,
  Switzerland: 238,
  Ukraine: 239,
  Uzbekistan: 240,
  Wales: 241,
  Gibraltar: 245,
  Monaco: 250,
  Others: 260,
  Taiwan: 298,
  Serbia: 303,
  Montenegro: 304,
  "Sint Maarten": 310,
  Kosovo: 311,
  "South Sudan": 312,
};
