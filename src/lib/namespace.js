"use strict";

// Single entry point for the extension's shared scope. Content scripts run as
// ordered classic scripts in one isolated world, so all top-level bindings are
// visible across files as bare identifiers. Grouping them here gives a single
// discoverable namespace (and a stable seam for the Phase 4 bootstrap) without
// requiring a build step or rewiring internal call sites.
window.PESConverter = {
  // DOM guards
  textOf,
  attrOf,
  first,
  all,
  intOf,

  // Debug logger
  debugLog,
  debugWarn,

  // Core helpers
  CopyToClipboard,
  stringInArray,
  AddPlayer,
  AddPlayer13,
  AddPlayer21,
  heightTo99Stat,
  GetMaxKeyFromObject,
  getPlayingStyle,
  PES21GetPlayingStyle,
  PES21GetPositionWeight,

  // Utility + name + ability helpers (see lib/utils.js, lib/names.js,
  // lib/abilities.js)
  MinorThan,
  DivideIntegers,
  Average,
  GetRandomInt,
  LimitStat99,
  clamp,
  hasSpecialAbility,
  ShirtName,
  FormatPES5ShirtName,

  // Stat conversion helpers
  FMToPESStat99,
  FMToPESStat1To8,
  FMToPESStatAToC,
  FMToPES21Stat1To3,
  FMToPES21Stat1To8,
  FMStatTOPES21,
  CAPoints,

  // Position mapping
  FMToPESPositions,
  FMToPES21Positions,
  FIFAToPES21Positions,
  EfootballToPESPosition,
  FMPositionStringToArray,
  GetFavSide,

  // Efootball/PESMaster mappings
  EfootballInjuryResistance,
  EfootballCondition,
  EfootballWeakFoot,

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
};
