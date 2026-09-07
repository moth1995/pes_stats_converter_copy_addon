"use strict";

// Single entry point for the extension's shared scope. Content scripts run as
// ordered classic scripts in one isolated world, so all top-level bindings are
// visible across files as bare identifiers. Grouping them here gives a single
// discoverable namespace (and a stable seam for the Phase 4 bootstrap) without
// requiring a build step or rewiring internal call sites.

/**
 * The extension's shared global namespace object.
 *
 * @type {PESConverterNamespace}
 */
window.PESConverter = {
  // Closed vocabularies (see lib/enums.js)
  PES5_POSITION,
  PES13_POSITION,
  PES21_POSITION,
  FOOT,
  FAVOURED_SIDE,
  GRADE,
  FORMAT,
  COPY_MODE,
  BUTTON_POSITION,

  // Third-party site labels (see data/source-labels.js)
  SOFIFA_ATTACKING,
  SOFIFA_SKILL,
  SOFIFA_MOVEMENT,
  SOFIFA_POWER,
  SOFIFA_MENTALITY,
  SOFIFA_DEFENDING,
  SOFIFA_GOALKEEPING,
  FM_STAT,
  FM_INFO,
  PESMASTER_STAT,
  PESMASTER_CHARACTERISTIC,
  PESMASTER_INFO,
  SOFIFA_PLAYSTYLE,
  SOFIFA_TRAIT,
  SOFIFA_SPECIALITY,
  PESMASTER_SKILL,

  // DOM guards — lenient (fallback) and strict (throwing)
  ScrapeError,
  requireEl,
  requireText,
  requireInt,
  requireAttr,
  textOf,
  attrOf,
  first,
  all,
  intOf,

  // Debug logger
  debugLog,
  debugWarn,

  // Core helpers
  copyToClipboard,
  stringInArray,
  applyButtonPosition,
  addPlayer,
  addPlayer13,
  addPlayer21,
  addPlayers,
  getBatchRequestDelay,
  heightTo99Stat,
  getMaxKeyFromObject,
  getPlayingStyle,
  pes21GetPlayingStyle,
  pes21GetPositionWeight,

  // Utility + name + ability helpers (see lib/utils.js, lib/names.js,
  // lib/abilities.js)
  atLeast,
  divideIntegers,
  average,
  getRandomInt,
  limitStat99,
  clamp,
  hasSpecialAbility,
  shirtName,
  formatPes5ShirtName,
  extractLastName,

  // Stat conversion helpers
  fmToPesStat99,
  fmToPesStat1To8,
  fmToPesStatAToC,
  fmToPes21Stat1To3,
  fmToPes21Stat1To8,
  fmStatToPes21,
  caPoints,

  // Position mapping
  fmToPesPositions,
  fmToPes21Positions,
  fifaToPes21Positions,
  efootballToPesPosition,
  fmPositionStringToArray,
  getFavSide,

  // Efootball/PESMaster mappings
  efootballInjuryResistance,
  efootballCondition,
  efootballWeakFoot,

  // Converters
  PESPlayer,
  PES21Player,
  PES13Player,

  // Lookup data
  gkHeightTable,
  playersHeightTable,
  PES21_COUNTRY_MAP,
  pesIndieNationalities,
  maxStatsTable,
  minStatsTable,

  // CSV column headers
  PES5_CSV_COLUMNS,
  PES13_CSV_COLUMNS,
  PES21_CSV_COLUMNS,

  // Source registry, populated by content/sources/*.js and consumed by
  // content/bootstrap.js. Isolated here (in the shared bundle) so scrapers can
  // register regardless of script load order.
  _sources: [],

  /**
   * Register a content source. Called once per scraper file at load time.
   *
   * @param {SourceDescriptor} source - The source descriptor to register.
   * @returns {void}
   */
  registerSource(source) {
    window.PESConverter._sources.push(source);
  },

  /**
   * Wrap a converter so the bootstrap flow can render both PSD and CSV without
   * knowing the concrete class. Raw sources expose psdString only.
   *
   * @param {ConverterPlayer} converter - The converter/scraper instance.
   * @returns {ConverterResult} The normalized render result.
   */
  converterResult(converter) {
    return {
      psd: function () {
        return converter.psdString();
      },
      csv: function () {
        return converter.csvString();
      },
    };
  },
};
