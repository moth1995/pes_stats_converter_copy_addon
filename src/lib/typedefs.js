"use strict";

// Global JSDoc type definitions for the extension's shared global scope.
//
// The extension is loaded as classic scripts (see src/manifest.json), so every
// top-level binding lives in ONE global scope. jsconfig.json uses
// `"module": "preserve"` to model exactly that, which means these @typedef and
// @property shapes are visible to every src file by bare name - no `import`
// needed.
//
// This file has no runtime effect: it is intentionally NOT referenced in
// manifest.json or test/load.js. It exists only for the type checker.

/**
 * A per-position min/max stat bounds row from data/pes21-stats-table.js.
 *
 * @typedef {Object} PES21StatTableRow
 * @property {string} position - PES21 position code (e.g. "GK", "CB").
 * @property {number} offensiveAwareness - Stat bound for Offensive Awareness.
 * @property {number} ballControl - Stat bound for Ball Control.
 * @property {number} tightPossession - Stat bound for Tight Possession.
 * @property {number} dribbling - Stat bound for Dribbling.
 * @property {number} lowPass - Stat bound for Low Pass.
 * @property {number} loftedPass - Stat bound for Lofted Pass.
 * @property {number} finishing - Stat bound for Finishing.
 * @property {number} placeKicking - Stat bound for Place Kicking.
 * @property {number} curl - Stat bound for Curl.
 * @property {number} heading - Stat bound for Heading.
 * @property {number} defensiveAwareness - Stat bound for Defensive Awareness.
 * @property {number} ballWinning - Stat bound for Ball Winning.
 * @property {number} aggression - Stat bound for Aggression.
 * @property {number} kickingPower - Stat bound for Kicking Power.
 * @property {number} speed - Stat bound for Speed.
 * @property {number} acceleration - Stat bound for Acceleration.
 * @property {number} physicalContact - Stat bound for Physical Contact.
 * @property {number} balance - Stat bound for Balance.
 * @property {number} jump - Stat bound for Jump.
 * @property {number} stamina - Stat bound for Stamina.
 * @property {number} gkAwareness - Stat bound for GK Awareness.
 * @property {number} gkReach - Stat bound for GK Reach.
 * @property {number} gkCatching - Stat bound for GK Catching.
 * @property {number} gkClearing - Stat bound for GK Clearing.
 * @property {number} gkReflexes - Stat bound for GK Reflexes.
 */

/**
 * The extension's shared global namespace object, assembled in lib/namespace.js
 * and installed on `window.PESConverter`.
 *
 * @typedef {Object} PESConverterNamespace
 *
 * // Closed vocabularies (see lib/enums.js)
 * @property {typeof PES5_POSITION} PES5_POSITION - PES5 position codes.
 * @property {typeof PES13_POSITION} PES13_POSITION - PES13 position codes.
 * @property {typeof PES21_POSITION} PES21_POSITION - PES21 position codes.
 * @property {typeof FOOT} FOOT - Strong-foot codes ("L"/"R").
 * @property {typeof FAVOURED_SIDE} FAVOURED_SIDE - Favoured-side codes ("B"/"L"/"R").
 * @property {typeof GRADE} GRADE - Letter grades ("A"/"B"/"C").
 * @property {typeof FORMAT} FORMAT - Output format identifiers.
 * @property {typeof COPY_MODE} COPY_MODE - Copy-mode identifiers.
 *
 * // Third-party site labels (see data/source-labels.js)
 * @property {typeof SOFIFA_ATTACKING} SOFIFA_ATTACKING - SoFIFA "Attacking" stat labels.
 * @property {typeof SOFIFA_SKILL} SOFIFA_SKILL - SoFIFA "Skill" stat labels.
 * @property {typeof SOFIFA_MOVEMENT} SOFIFA_MOVEMENT - SoFIFA "Movement" stat labels.
 * @property {typeof SOFIFA_POWER} SOFIFA_POWER - SoFIFA "Power" stat labels.
 * @property {typeof SOFIFA_MENTALITY} SOFIFA_MENTALITY - SoFIFA "Mentality" stat labels.
 * @property {typeof SOFIFA_DEFENDING} SOFIFA_DEFENDING - SoFIFA "Defending" stat labels.
 * @property {typeof SOFIFA_GOALKEEPING} SOFIFA_GOALKEEPING - SoFIFA "Goalkeeping" stat labels.
 * @property {typeof FM_STAT} FM_STAT - FMInside attribute labels.
 * @property {typeof FM_INFO} FM_INFO - FMInside identity-table labels.
 * @property {typeof PESMASTER_STAT} PESMASTER_STAT - PESMaster numeric stat labels.
 * @property {typeof PESMASTER_CHARACTERISTIC} PESMASTER_CHARACTERISTIC - PESMaster string-valued characteristic labels.
 * @property {typeof PESMASTER_INFO} PESMASTER_INFO - PESMaster identity-table labels.
 * @property {typeof SOFIFA_PLAYSTYLE} SOFIFA_PLAYSTYLE - SoFIFA FC-era PlayStyle labels.
 * @property {typeof SOFIFA_TRAIT} SOFIFA_TRAIT - SoFIFA FIFA-era trait labels.
 * @property {typeof SOFIFA_SPECIALITY} SOFIFA_SPECIALITY - SoFIFA player-speciality labels.
 * @property {typeof PESMASTER_SKILL} PESMASTER_SKILL - PESMaster special-skill labels.
 *
 * // DOM guards (see lib/dom.js)
 * @property {typeof ScrapeError} ScrapeError - Error thrown when a required node/value is missing.
 * @property {(root: Document|Element, selector: string, context: string) => Element} requireEl - First match, or throws.
 * @property {(root: Document|Element, selector: string, context: string) => string} requireText - Trimmed text, or throws.
 * @property {(root: Document|Element, selector: string, context: string) => number} requireInt - Parsed int, or throws.
 * @property {(el: Element|null, attribute: string, context: string) => string} requireAttr - Attribute value, or throws.
 * @property {(root: Document|Element, selector: string) => string} textOf - Trimmed text of the first match, or "".
 * @property {(root: Document|Element, selector: string, attribute: string) => string} attrOf - Attribute value of the first match, or "".
 * @property {(root: Document|Element, selector: string) => Element|null} first - First matching element, or null.
 * @property {(root: Document|Element, selector: string) => Element[]} all - All matching elements as an array.
 * @property {(root: Document|Element, selector: string, fallback: number) => number} intOf - Parsed int of the first match, or `fallback`.
 *
 * // Debug logger (see lib/logger.js)
 * @property {(tag: string, ...args: *) => void} debugLog - Log a tagged debug message (no-op unless `PES_DEBUG`).
 * @property {(tag: string, ...args: *) => void} debugWarn - Log a tagged warning (always shown, unlike debugLog).
 *
 * // Core helpers (see lib/core.js)
 * @property {(text: string) => void} copyToClipboard - Copy text to the system clipboard.
 * @property {(array: string[], searchString: string) => boolean} stringInArray - Case-insensitive membership check.
 * @property {(playerData: string) => void} addPlayer - Append a PES5 CSV row to chrome.storage (seeds header first).
 * @property {(player13Data: string) => void} addPlayer13 - Append a PES13 CSV row to chrome.storage (seeds header first).
 * @property {(player21Data: string) => void} addPlayer21 - Append a PES21 CSV row to chrome.storage (seeds header first).
 * @property {(height: number, isGK: boolean) => number} heightTo99Stat - Map a height (cm) to a PES stat using the GK/outfield table.
 * @property {(data: Record<string, number>) => string} getMaxKeyFromObject - Key with the highest numeric value ("" if empty).
 * @property {(role: string, position: string) => string} getPlayingStyle - Match an FM role string to a PES21 playing style.
 * @property {(FMBestSuitableRoles: Record<string, number>, pesPosition: string) => string} pes21GetPlayingStyle - Playing style from FM's best-suitable-roles map.
 * @property {(position: string, fmPlayer: FMPlayer) => number} pes21GetPositionWeight - Position-suitability weight ("*CF"-prefixed code), or -1.
 *
 * // Utility + name + ability helpers (see lib/utils.js, lib/names.js, lib/abilities.js)
 * @property {(value: number, compare: number) => number} atLeast - Clamp to a lower bound.
 * @property {(int1: number, int2: number) => number} divideIntegers - Integer division with rounding to nearest.
 * @property {(numbers: number[]) => number} average - Arithmetic mean (0 for an empty array).
 * @property {(min: number, max: number) => number} getRandomInt - Random integer in [min, max).
 * @property {(stat: number) => number} limitStat99 - Cap a stat at 99 (no lower bound), rounding.
 * @property {(min: number, max: number, num: number) => number} clamp - Clamp `num` to the inclusive range [min, max].
 * @property {(abilityPositions: string[], registeredPosition: string, positions: string[]) => boolean} hasSpecialAbility - Position-gated special-ability check.
 * @property {(name: string) => string} shirtName - Flattened, uppercased last name.
 * @property {(lastName: string) => string} formatPes5ShirtName - Space-padded shirt name for the PES5/13 editor.
 *
 * // Stat conversion helpers (see lib/core.js)
 * @property {(stat: number) => number} fmToPesStat99 - FM 1-20 -> PES 40-100 stat.
 * @property {(stat: number) => number} fmToPesStat1To8 - FM 1-20 -> PES 1-8 rating.
 * @property {(stat: number) => Grade} fmToPesStatAToC - FM 1-20 -> "C"/"B"/"A" grade.
 * @property {(stat: number) => number} fmToPes21Stat1To3 - FM 1-20 -> PES21 1-3 rating.
 * @property {(stat: number) => number} fmToPes21Stat1To8 - FM 1-20 -> PES21 2-8 rating.
 * @property {(statFromFormula: number, max: number, min: number, ca: number) => number} fmStatToPes21 - Clamped PES21 formula stat (40-99).
 * @property {(ca: number) => number} caPoints - FM Current Ability -> adjustment points (-10..1).
 *
 * // Position mapping (see lib/positions.js)
 * @property {(position: string) => string} fmToPesPositions - FM code -> old-gen PES (5/13) code.
 * @property {(position: string) => string} fmToPes21Positions - FM code -> PES21 code.
 * @property {(position: string) => string} fifaToPes21Positions - FIFA code -> PES21 code.
 * @property {(position: string) => string} efootballToPesPosition - eFootball code -> old-gen PES code.
 * @property {(positions: string) => string[]} fmPositionStringToArray - Split a comma-separated position string.
 * @property {(positions: string[], useLastChar: boolean) => FavouredSide} getFavSide - "B", "L", or "R" favoured side.
 *
 * // Efootball/PESMaster mappings (see lib/core.js)
 * @property {(injury: string) => Grade} efootballInjuryResistance - Injury label -> "C"/"B"/"A".
 * @property {(condition: string) => number} efootballCondition - Form letter -> PES 4-8 rating.
 * @property {(weakFoot: string, ballControl: number) => number} efootballWeakFoot - Weak-foot label -> PES 1-8 rating.
 *
 * // Converters (see src/converters/*.js)
 * @property {typeof PESPlayer} PESPlayer - Old-gen PES5 converter class.
 * @property {typeof PES21Player} PES21Player - PES21/20 converter class.
 * @property {typeof PES13Player} PES13Player - PES13 converter class (extends PESPlayer).
 *
 * // Lookup data
 * @property {Record<number, number>} gkHeightTable - Height (cm) -> PES GK keeper-skills map.
 * @property {Record<number, number>} playersHeightTable - Height (cm) -> PES outfield jump map.
 * @property {Record<string, number>} PES21_COUNTRY_MAP - PES21 nation name -> numeric country id.
 * @property {Record<string, string>} pesIndieNationalities - Source nation name -> PES nationality label.
 * @property {PES21StatTableRow[]} maxStatsTable - Per-position maximum PES21 stat bounds.
 * @property {PES21StatTableRow[]} minStatsTable - Per-position minimum PES21 stat bounds.
 *
 * // CSV column headers
 * @property {string} PES5_CSV_COLUMNS - PES5 CSV header row.
 * @property {string} PES13_CSV_COLUMNS - PES13 CSV header row.
 * @property {string} PES21_CSV_COLUMNS - PES21 CSV header row.
 *
 * // Source registry (populated by content/sources/*.js, consumed by content/bootstrap.js)
 * @property {SourceDescriptor[]} _sources - Registered content sources.
 * @property {(source: SourceDescriptor) => void} registerSource - Register a content source at load time.
 * @property {(converter: ConverterPlayer) => ConverterResult} converterResult - Wrap a converter to render PSD and CSV.
 */

/**
 * The extension's shared namespace, assembled in lib/namespace.js and consumed
 * by content scripts and the popup by bare name (`window.PESConverter`).
 *
 * @type {PESConverterNamespace}
 */
var PESConverter;

/**
 * Debug flag on the window object. Enabled by the user from the browser console
 * (`window.PES_DEBUG = true`) to surface verbose log output.
 *
 * @type {boolean}
 */
var PES_DEBUG;

/**
 * The extension's `chrome.storage.local` schema.
 *
 * Every key is optional: nothing is seeded at install time, so each key is
 * absent until the popup writes a setting or a converted player is appended.
 * `@types/chrome` wraps its `get` type parameter in `NoInfer`, so the callback
 * parameter must be annotated with this typedef or every read is `unknown`.
 *
 * @typedef {Object} PESStorageData
 * @property {string[]} [playersData] - Accumulated PES5 CSV rows (header row first).
 * @property {string[]} [players13Data] - Accumulated PES13 CSV rows (header row first).
 * @property {string[]} [players21Data] - Accumulated PES21 CSV rows (header row first).
 * @property {Format} [selectOptionFMInside] - Selected output format.
 * @property {CopyMode} [selectCopyMode] - Selected copy mode.
 * @property {boolean} [debugEnabled] - Whether verbose debug logging is enabled (gates window.PES_DEBUG).
 */

/**
 * A content source registered by content/sources/*.js and consumed by
 * content/bootstrap.js.
 *
 * @typedef {Object} SourceDescriptor
 * @property {string} id - Unique source id (e.g. "sofifa").
 * @property {string} converterMethod - Converter entry point to invoke.
 * @property {Format[]} supportedFormats - Allowed output formats.
 * @property {() => boolean} isSupported - Whether the current page is supported.
 * @property {() => string} label - Floating button label.
 * @property {(style: CSSStyleDeclaration) => void} [buttonStyle] - Optional button position override.
 * @property {(doc: Document) => Object} build - Build the scraped player from a parsed document.
 */

/**
 * Normalized output of a converter (or a raw scraped object in "raw" mode).
 *
 * @typedef {Object} ConverterResult
 * @property {() => string} psd - Renders the clipboard/PSD text.
 * @property {() => string} csv - Renders the CSV row (null in raw mode).
 */

/**
 * A stat category map from a scraper (e.g. SoFIFA "Attacking" or "Skill").
 * Maps stat labels (with internal spaces/capitalization) to 0-99 values.
 *
 * @typedef {Record<string, number>} StatCategory
 */

/**
 * A Football Manager player scraped from an FMInside page.
 *
 * @typedef {Object} FMPlayer
 * @property {string} name - Full player name.
 * @property {string} nationality - Nationality name.
 * @property {string|null} ability - Current ability rating text.
 * @property {string|null} potential - Potential ability rating text.
 * @property {string[]} positionType - Natural position type labels.
 * @property {FmInfoMap} info - Identity fields (Age, Foot, Height, etc.).
 * @property {FmStatMap} stats - Attribute values keyed by FM stat name.
 * @property {Record<string, number>} roles - Best-suitable-role -> suitability map.
 */

/**
 * A SoFIFA (FIFA) player scraped from the page DOM.
 *
 * @typedef {Object} FIFAPlayer
 * @property {string} name - Full player name.
 * @property {number} age - Player age.
 * @property {Date} birthdayDate - Parsed birthday.
 * @property {number} height - Height in cm.
 * @property {number} weight - Weight in kg.
 * @property {string} nationality - Nationality name.
 * @property {string[]} positions - All positions including the registered one.
 * @property {string} registeredPosition - Registered (primary) position.
 * @property {SofifaAttackingMap} attacking - Attacking stat group.
 * @property {SofifaSkillMap} skill - Skill stat group.
 * @property {SofifaMovementMap} movement - Movement stat group.
 * @property {SofifaPowerMap} power - Power stat group.
 * @property {SofifaMentalityMap} mentality - Mentality stat group.
 * @property {SofifaDefendingMap} defending - Defending stat group.
 * @property {SofifaGoalkeepingMap} goalkeeping - Goalkeeping stat group.
 * @property {string[]} playerSpecialties - Speciality labels.
 * @property {string[]} traits - Trait/PlayStyle labels.
 * @property {string} preferedFoot - Preferred foot text.
 * @property {number} weakFoot - Weak-foot rating (1-5).
 * @property {number} skillMoves - Skill-move rating (1-5).
 * @property {number} internationalReputation - Reputation rating (1-5).
 * @property {number} overall - Overall rating (0-99).
 */

/**
 * An eFootball player scraped from a PESMaster page.
 *
 * @typedef {Object} PESMasterPlayerShape
 * @property {string} name - Full player name.
 * @property {number} overall - Overall rating.
 * @property {PesmasterInfoMap} info - Identity fields (Age, Position, etc.).
 * @property {PesmasterStatMap} stats - Numeric stat values keyed by eFootball label.
 * @property {PesmasterCharacteristicMap} characteristics - String-valued characteristics.
 * @property {string[]} positions - Available position codes.
 * @property {PesmasterSkillLabel[]} specialStats - Special-skill labels.
 */

/**
 * A converted player instance exposing the shared converter surface.
 *
 * @typedef {Object} ConverterPlayer
 * @property {string} name - Player name.
 * @property {string} shirtName - Flattened shirt name.
 * @property {string} nationality - Nationality label.
 * @property {number} age - Player age.
 * @property {string} foot - "L" or "R".
 * @property {string} registeredPosition - Registered PES position code.
 * @property {string[]} positions - Additional PES position codes.
 * @property {() => string} psdString - Render the PSD text.
 * @property {() => string} csvString - Render the CSV row (null when unsupported).
 */
