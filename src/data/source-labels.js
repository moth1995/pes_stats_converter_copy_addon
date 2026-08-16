"use strict";

// Third-party site labels, in one place.
//
// The scrapers use each site's own stat names verbatim as dictionary keys, so
// when SoFIFA/FMInside/PESMaster rename a stat the fix is the single constant
// below rather than every reader. Each group also derives a key union, so a
// mistyped label is a type error instead of a silently `undefined` stat.
//
// The scrapers build these dictionaries from the DOM, so the checker cannot
// prove completeness: each scraper casts once at its boundary (see
// content/sources/*.js) and every read downstream is then checked.

/**
 * SoFIFA 'Attacking' stat block.
 */
const SOFIFA_ATTACKING = Object.freeze(
  /** @type {const} */ ({
    CROSSING: "Crossing",
    FINISHING: "Finishing",
    HEADING_ACCURACY: "Heading accuracy",
    SHORT_PASSING: "Short passing",
    VOLLEYS: "Volleys",
  }),
);

/** @typedef {typeof SOFIFA_ATTACKING[keyof typeof SOFIFA_ATTACKING]} SofifaAttackingLabel */
/** @typedef {Record<SofifaAttackingLabel, number>} SofifaAttackingMap */

/**
 * SoFIFA 'Skill' stat block.
 */
const SOFIFA_SKILL = Object.freeze(
  /** @type {const} */ ({
    BALL_CONTROL: "Ball control",
    CURVE: "Curve",
    DRIBBLING: "Dribbling",
    FK_ACCURACY: "FK Accuracy",
    LONG_PASSING: "Long passing",
  }),
);

/** @typedef {typeof SOFIFA_SKILL[keyof typeof SOFIFA_SKILL]} SofifaSkillLabel */
/** @typedef {Record<SofifaSkillLabel, number>} SofifaSkillMap */

/**
 * SoFIFA 'Movement' stat block.
 */
const SOFIFA_MOVEMENT = Object.freeze(
  /** @type {const} */ ({
    ACCELERATION: "Acceleration",
    AGILITY: "Agility",
    BALANCE: "Balance",
    REACTIONS: "Reactions",
    SPRINT_SPEED: "Sprint speed",
  }),
);

/** @typedef {typeof SOFIFA_MOVEMENT[keyof typeof SOFIFA_MOVEMENT]} SofifaMovementLabel */
/** @typedef {Record<SofifaMovementLabel, number>} SofifaMovementMap */

/**
 * SoFIFA 'Power' stat block.
 */
const SOFIFA_POWER = Object.freeze(
  /** @type {const} */ ({
    JUMPING: "Jumping",
    LONG_SHOTS: "Long shots",
    SHOT_POWER: "Shot power",
    STAMINA: "Stamina",
    STRENGTH: "Strength",
  }),
);

/** @typedef {typeof SOFIFA_POWER[keyof typeof SOFIFA_POWER]} SofifaPowerLabel */
/** @typedef {Record<SofifaPowerLabel, number>} SofifaPowerMap */

/**
 * SoFIFA 'Mentality' stat block.
 */
const SOFIFA_MENTALITY = Object.freeze(
  /** @type {const} */ ({
    AGGRESSION: "Aggression",
    ATTACK_POSITION: "Attack position",
    COMPOSURE: "Composure",
    INTERCEPTIONS: "Interceptions",
    PENALTIES: "Penalties",
    VISION: "Vision",
  }),
);

/** @typedef {typeof SOFIFA_MENTALITY[keyof typeof SOFIFA_MENTALITY]} SofifaMentalityLabel */
/** @typedef {Record<SofifaMentalityLabel, number>} SofifaMentalityMap */

/**
 * SoFIFA 'Defending' stat block.
 */
const SOFIFA_DEFENDING = Object.freeze(
  /** @type {const} */ ({
    DEFENSIVE_AWARENESS: "Defensive awareness",
    MARKING: "Marking",
    SLIDING_TACKLE: "Sliding tackle",
    STANDING_TACKLE: "Standing tackle",
  }),
);

/** @typedef {typeof SOFIFA_DEFENDING[keyof typeof SOFIFA_DEFENDING]} SofifaDefendingLabel */
/** @typedef {Record<SofifaDefendingLabel, number>} SofifaDefendingMap */

/**
 * SoFIFA 'Goalkeeping' stat block.
 */
const SOFIFA_GOALKEEPING = Object.freeze(
  /** @type {const} */ ({
    GK_DIVING: "GK Diving",
    GK_HANDLING: "GK Handling",
    GK_KICKING: "GK Kicking",
    GK_POSITIONING: "GK Positioning",
    GK_REFLEXES: "GK Reflexes",
  }),
);

/** @typedef {typeof SOFIFA_GOALKEEPING[keyof typeof SOFIFA_GOALKEEPING]} SofifaGoalkeepingLabel */
/** @typedef {Record<SofifaGoalkeepingLabel, number>} SofifaGoalkeepingMap */

/**
 * FMInside attribute labels (technical, mental, physical, and goalkeeping).
 */
const FM_STAT = Object.freeze(
  /** @type {const} */ ({
    ACCELERATION: "Acceleration",
    AERIAL_REACH: "Aerial Reach",
    AGGRESSION: "Aggression",
    AGILITY: "Agility",
    ANTICIPATION: "Anticipation",
    BALANCE: "Balance",
    BRAVERY: "Bravery",
    COMMAND_OF_AREA: "Command of Area",
    COMMUNICATION: "Communication",
    COMPOSURE: "Composure",
    CONCENTRATION: "Concentration",
    CORNERS: "Corners",
    CROSSING: "Crossing",
    DECISIONS: "Decisions",
    DETERMINATION: "Determination",
    DRIBBLING: "Dribbling",
    ECCENTRICITY: "Eccentricity",
    FINISHING: "Finishing",
    FIRST_TOUCH: "First Touch",
    FLAIR: "Flair",
    FREE_KICK_TAKING: "Free Kick Taking",
    HANDLING: "Handling",
    HEADING: "Heading",
    JUMPING_REACH: "Jumping Reach",
    KICKING: "Kicking",
    LEADERSHIP: "Leadership",
    LONG_SHOTS: "Long Shots",
    LONG_THROWS: "Long Throws",
    MARKING: "Marking",
    NATURAL_FITNESS: "Natural Fitness",
    OFF_THE_BALL: "Off the Ball",
    ONE_ON_ONES: "One on Ones",
    PACE: "Pace",
    PASSING: "Passing",
    PENALTY_TAKING: "Penalty Taking",
    POSITIONING: "Positioning",
    PUNCHING_TENDENCY: "Punching (Tendency)",
    REFLEXES: "Reflexes",
    RUSHING_OUT_TENDENCY: "Rushing Out (Tendency)",
    STAMINA: "Stamina",
    STRENGTH: "Strength",
    TACKLING: "Tackling",
    TEAMWORK: "Teamwork",
    TECHNIQUE: "Technique",
    THROWING: "Throwing",
    VISION: "Vision",
    WORK_RATE: "Work Rate",
  }),
);

/** @typedef {typeof FM_STAT[keyof typeof FM_STAT]} FmStatLabel */
/** @typedef {Record<FmStatLabel, number>} FmStatMap */

/**
 * FMInside identity-table row labels.
 */
const FM_INFO = Object.freeze(
  /** @type {const} */ ({
    AGE: "Age",
    FOOT: "Foot",
    HEIGHT: "Height",
    NAME: "Name",
    POSITIONS: "Positions",
    WEIGHT: "Weight",
  }),
);

/** @typedef {typeof FM_INFO[keyof typeof FM_INFO]} FmInfoLabel */
/** @typedef {Record<FmInfoLabel, string>} FmInfoMap */

/**
 * PESMaster numeric stat labels.
 */
const PESMASTER_STAT = Object.freeze(
  /** @type {const} */ ({
    ACCELERATION: "Acceleration",
    AGGRESSION: "Aggression",
    BALANCE: "Balance",
    BALL_CONTROL: "Ball Control",
    CURL: "Curl",
    DEFENSIVE_AWARENESS: "Defensive Awareness",
    DEFENSIVE_ENGAGEMENT: "Defensive Engagement",
    DRIBBLING: "Dribbling",
    FINISHING: "Finishing",
    GK_AWARENESS: "GK Awareness",
    GK_CATCHING: "GK Catching",
    GK_PARRYING: "GK Parrying",
    GK_REACH: "GK Reach",
    GK_REFLEXES: "GK Reflexes",
    HEADING: "Heading",
    JUMPING: "Jumping",
    KICKING_POWER: "Kicking Power",
    LOFTED_PASS: "Lofted Pass",
    LOW_PASS: "Low Pass",
    OFFENSIVE_AWARENESS: "Offensive Awareness",
    PHYSICAL_CONTACT: "Physical Contact",
    SET_PIECE_TAKING: "Set Piece Taking",
    SPEED: "Speed",
    STAMINA: "Stamina",
    TACKLING: "Tackling",
    TIGHT_POSSESSION: "Tight Possession",
  }),
);

/** @typedef {typeof PESMASTER_STAT[keyof typeof PESMASTER_STAT]} PesmasterStatLabel */
/** @typedef {Record<PesmasterStatLabel, number>} PesmasterStatMap */

/**
 * PESMaster string-valued characteristic labels. These live in the same `stats` dictionary as the numeric labels above, which is why that dictionary is an intersection type.
 */
const PESMASTER_CHARACTERISTIC = Object.freeze(
  /** @type {const} */ ({
    INJURY_RESISTANCE: "Injury Resistance",
    WEAK_FOOT_ACC: "Weak Foot Acc.",
    WEAK_FOOT_USAGE: "Weak Foot Usage",
  }),
);

/** @typedef {typeof PESMASTER_CHARACTERISTIC[keyof typeof PESMASTER_CHARACTERISTIC]} PesmasterCharacteristicLabel */
/** @typedef {Record<PesmasterCharacteristicLabel, string>} PesmasterCharacteristicMap */

/**
 * PESMaster identity-table row labels.
 */
const PESMASTER_INFO = Object.freeze(
  /** @type {const} */ ({
    AGE: "Age",
    CONDITION: "Condition",
    HEIGHT_CM: "Height (cm)",
    NATIONALITY: "Nationality",
    POSITION: "Position",
    STRONGER_FOOT: "Stronger Foot",
    WEIGHT: "Weight",
  }),
);

/** @typedef {typeof PESMASTER_INFO[keyof typeof PESMASTER_INFO]} PesmasterInfoLabel */
/** @typedef {Record<PesmasterInfoLabel, string>} PesmasterInfoMap */

/**
 * SoFIFA FC-era PlayStyle labels. Each has a plain and a '+' (PlayStyle+) variant, both of which appear in the same `traits` array as the legacy trait labels below.
 */
const SOFIFA_PLAYSTYLE = Object.freeze(
  /** @type {const} */ ({
    ACROBATIC: "Acrobatic",
    ACROBATIC_PLUS: "Acrobatic +",
    BLOCK: "Block",
    BLOCK_PLUS: "Block +",
    CHIP_SHOT: "Chip Shot",
    CHIP_SHOT_PLUS: "Chip Shot +",
    FAR_THROW: "Far Throw",
    FAR_THROW_PLUS: "Far Throw +",
    FINESSE_SHOT: "Finesse Shot",
    FINESSE_SHOT_PLUS: "Finesse Shot +",
    FIRST_TOUCH: "First Touch",
    FIRST_TOUCH_PLUS: "First Touch +",
    INCISIVE_PASS: "Incisive Pass",
    INCISIVE_PASS_PLUS: "Incisive Pass +",
    INTERCEPT: "Intercept",
    INTERCEPT_PLUS: "Intercept +",
    LEADERSHIP: "Leadership",
    LEADERSHIP_PLUS: "Leadership +",
    LONG_BALL_PASS: "Long Ball Pass",
    LONG_BALL_PASS_PLUS: "Long Ball Pass +",
    LONG_THROW: "Long Throw",
    LONG_THROW_PLUS: "Long Throw +",
    PINGED_PASS: "Pinged Pass",
    PINGED_PASS_PLUS: "Pinged Pass +",
    POWER_HEADER: "Power Header",
    POWER_HEADER_PLUS: "Power Header +",
    POWER_SHOT: "Power Shot",
    POWER_SHOT_PLUS: "Power Shot +",
    RAPID: "Rapid",
    RAPID_PLUS: "Rapid +",
    RELENTLESS: "Relentless",
    RELENTLESS_PLUS: "Relentless +",
    SLIDE_TACKLE: "Slide Tackle",
    SLIDE_TACKLE_PLUS: "Slide Tackle +",
    TECHNICAL: "Technical",
    TECHNICAL_PLUS: "Technical +",
    TIKI_TAKA: "Tiki Taka",
    TIKI_TAKA_PLUS: "Tiki Taka +",
    TRICKSTER: "Trickster",
    TRICKSTER_PLUS: "Trickster +",
    TRIVELA: "Trivela",
    TRIVELA_PLUS: "Trivela +",
    WHIPPED_CROSS: "Whipped Cross",
    WHIPPED_CROSS_PLUS: "Whipped Cross +",
  }),
);

/** @typedef {typeof SOFIFA_PLAYSTYLE[keyof typeof SOFIFA_PLAYSTYLE]} SofifaPlaystyleLabel */

/**
 * SoFIFA FIFA-era trait labels. Older FIFA editions (17-23) use these instead of PlayStyles; both land in the same `traits` array, which is why they are separate constants rather than one.
 */
const SOFIFA_TRAIT = Object.freeze(
  /** @type {const} */ ({
    BEAT_OFFSIDE_TRAP: "Beat offside trap",
    COMES_FOR_CROSSES: "Comes for crosses",
    EARLY_CROSSER: "Early crosser",
    FLAIR: "Flair",
    GIANT_THROW_IN: "Giant throw-in",
    INJURY_FREE: "Injury free",
    INJURY_PRONE: "Injury prone",
    LONG_SHOT_TAKER_AI: "Long shot taker (AI)",
    LONG_THROW_IN: "Long throw-in",
    OUTSIDE_FOOT_SHOT: "Outside foot shot",
    PLAYMAKER_AI: "Playmaker (AI)",
    POWER_HEADER: "Power header",
    SAVES_WITH_FEET: "Saves with feet",
    SPEED_DRIBBLER_AI: "Speed dribbler (AI)",
    TECHNICAL_DRIBBLER_AI: "Technical dribbler (AI)",
    SOLID_PLAYER: "solid player",
  }),
);

/** @typedef {typeof SOFIFA_TRAIT[keyof typeof SOFIFA_TRAIT]} SofifaTraitLabel */

/**
 * SoFIFA player-speciality labels.
 */
const SOFIFA_SPECIALITY = Object.freeze(
  /** @type {const} */ ({
    COMPLETE_DEFENDER: "Complete defender",
    COMPLETE_FORWARD: "Complete forward",
    CROSSER: "Crosser",
    DISTANCE_SHOOTER: "Distance shooter",
    DRIBBLER: "Dribbler",
    ENGINE: "Engine",
    PLAYMAKER: "Playmaker",
    POACHER: "Poacher",
    SPEEDSTER: "Speedster",
  }),
);

/** @typedef {typeof SOFIFA_SPECIALITY[keyof typeof SOFIFA_SPECIALITY]} SofifaSpecialityLabel */

/**
 * PESMaster special-skill and playing-style labels, as listed on the player page.
 */
const PESMASTER_SKILL = Object.freeze(
  /** @type {const} */ ({
    ACROBATIC_CLEARANCE: "Acrobatic Clearance",
    ACROBATIC_FINISHING: "Acrobatic Finishing",
    ANCHOR_MAN: "Anchor Man",
    BOX_TO_BOX: "Box-to-Box",
    BUILD_UP: "Build Up",
    CAPTAINCY: "Captaincy",
    CHIP_SHOT_CONTROL: "Chip Shot Control",
    CHOP_TURN: "Chop Turn",
    CLASSIC_NO_10: "Classic No. 10",
    CREATIVE_PLAYMAKER: "Creative Playmaker",
    CROSS_SPECIALIST: "Cross Specialist",
    CUT_BEHIND_TURN: "Cut Behind & Turn",
    DEEP_LYING_FORWARD: "Deep-Lying Forward",
    DEFENSIVE_FULL_BACK: "Defensive Full-back",
    DEFENSIVE_GOALKEEPER: "Defensive Goalkeeper",
    DIPPING_SHOT: "Dipping Shot",
    DOUBLE_TOUCH: "Double Touch",
    DUMMY_RUNNER: "Dummy Runner",
    EARLY_CROSSER: "Early Crosser",
    EXTRA_FRONTMAN: "Extra Frontman",
    FIGHTING_SPIRIT: "Fighting Spirit",
    FIRST_TIME_SHOT: "First-time Shot",
    FLIP_FLAP: "Flip Flap",
    FOX_IN_THE_BOX: "Fox in the Box",
    FULL_BACK_FINISHER: "Full-back Finisher",
    GK_HIGH_PUNT: "GK High Punt",
    GK_LONG_THROW: "GK Long Throw",
    GK_LOW_PUNT: "GK Low Punt",
    GK_PENALTY_SAVER: "GK Penalty Saver",
    GAMESMANSHIP: "Gamesmanship",
    GOAL_POACHER: "Goal Poacher",
    HEADING: "Heading",
    HEEL_TRICK: "Heel Trick",
    HOLE_PLAYER: "Hole Player",
    INCISIVE_RUN: "Incisive Run",
    INTERCEPTION: "Interception",
    KNUCKLE_SHOT: "Knuckle Shot",
    LONG_BALL_EXPERT: "Long Ball Expert",
    LONG_RANGER: "Long Ranger",
    LONG_THROW: "Long Throw",
    LONG_RANGE_CURLER: "Long-Range Curler",
    LONG_RANGE_SHOOTING: "Long-Range Shooting",
    LOW_LOFTED_PASS: "Low Lofted Pass",
    MAN_MARKING: "Man Marking",
    MARSEILLE_TURN: "Marseille Turn",
    MAZING_RUN: "Mazing Run",
    NO_LOOK_PASS: "No Look Pass",
    OFFENSIVE_FULL_BACK: "Offensive Full-back",
    OFFENSIVE_GOALKEEPER: "Offensive Goalkeeper",
    ONE_TOUCH_PASS: "One-touch Pass",
    ORCHESTRATOR: "Orchestrator",
    OUTSIDE_CURLER: "Outside Curler",
    PENALTY_SPECIALIST: "Penalty Specialist",
    PINPOINT_CROSSING: "Pinpoint Crossing",
    PROLIFIC_WINGER: "Prolific Winger",
    RABONA: "Rabona",
    RISING_SHOT: "Rising Shot",
    ROAMING_FLANK: "Roaming Flank",
    SCISSORS_FEINT: "Scissors Feint",
    SCOTCH_MOVE: "Scotch Move",
    SOLE_CONTROL: "Sole Control",
    SOMBRERO: "Sombrero",
    SPEEDING_BULLET: "Speeding Bullet",
    STEP_ON_SKILL_CONTROL: "Step On Skill Control",
    SUPER_SUB: "Super-sub",
    TARGET_MAN: "Target Man",
    THE_DESTROYER: "The Destroyer",
    THROUGH_PASSING: "Through Passing",
    TRACK_BACK: "Track Back",
    TRICKSTER: "Trickster",
    WEIGHTED_PASS: "Weighted Pass",
  }),
);

/** @typedef {typeof PESMASTER_SKILL[keyof typeof PESMASTER_SKILL]} PesmasterSkillLabel */
