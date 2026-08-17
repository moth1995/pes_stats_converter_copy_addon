"use strict";

const fs = require("fs");
const path = require("path");
const vm = require("vm");

const SRC_DIR = path.join(__dirname, "..", "src");

// Manifest content-script order for the converter/data files only (paths are
// relative to src/). We exclude the DOM scraper files
// (content/sources/sofifa.js, fminside.js, pesmaster.js) because they call
// document.* at load time and are not pure.
const DEFAULT_FILES = [
  "lib/enums.js",
  "data/source-labels.js",
  "lib/dom.js",
  "lib/logger.js",
  "lib/utils.js",
  "lib/positions.js",
  "lib/names.js",
  "lib/abilities.js",
  "lib/core.js",
  "converters/pes5.js",
  "converters/pes21.js",
  "converters/pes13.js",
  "data/nationalities.js",
  "data/pes21-stats-table.js",
  "lib/namespace.js",
];

// Classes and `const`/`let` declarations are lexical bindings in the VM, not
// global properties, so we must copy them out explicitly through a bridge
// snippet evaluated inside the context.
const DEFAULT_EXPORTS = [
  "PES5_POSITION",
  "PES13_POSITION",
  "PES21_POSITION",
  "FOOT",
  "FAVOURED_SIDE",
  "GRADE",
  "FORMAT",
  "COPY_MODE",
  "SOFIFA_ATTACKING",
  "SOFIFA_SKILL",
  "SOFIFA_MOVEMENT",
  "SOFIFA_POWER",
  "SOFIFA_MENTALITY",
  "SOFIFA_DEFENDING",
  "SOFIFA_GOALKEEPING",
  "FM_STAT",
  "FM_INFO",
  "PESMASTER_STAT",
  "PESMASTER_CHARACTERISTIC",
  "PESMASTER_INFO",
  "SOFIFA_PLAYSTYLE",
  "SOFIFA_TRAIT",
  "SOFIFA_SPECIALITY",
  "PESMASTER_SKILL",
  "ScrapeError",
  "requireEl",
  "requireText",
  "requireInt",
  "requireAttr",
  "textOf",
  "attrOf",
  "first",
  "all",
  "intOf",
  "debugLog",
  "debugWarn",
  "atLeast",
  "divideIntegers",
  "average",
  "getRandomInt",
  "limitStat99",
  "clamp",
  "fmToPesPositions",
  "fmPositionStringToArray",
  "getFavSide",
  "efootballToPesPosition",
  "fmToPes21Positions",
  "fifaToPes21Positions",
  "extractLastName",
  "shirtName",
  "formatPes5ShirtName",
  "hasSpecialAbility",
  "PESPlayer",
  "PES21Player",
  "PES13Player",
  "stringInArray",
  "efootballInjuryResistance",
  "efootballCondition",
  "efootballWeakFoot",
  "fmToPesStat99",
  "fmToPesStat1To8",
  "fmToPesStatAToC",
  "caPoints",
  "fmStatToPes21",
  "fmToPes21Stat1To3",
  "fmToPes21Stat1To8",
  "heightTo99Stat",
  "getMaxKeyFromObject",
  "getPlayingStyle",
  "pes21GetPlayingStyle",
  "pes21GetPositionWeight",
  "PES5_CSV_COLUMNS",
  "PES13_CSV_COLUMNS",
  "PES21_CSV_COLUMNS",
  "gkHeightTable",
  "playersHeightTable",
  "PES21_COUNTRY_MAP",
  "maxStatsTable",
  "minStatsTable",
  "pesIndieNationalities",
];

// Deterministic PRNG so conversion paths that use Math.random (FM -> PES5/13,
// via getRandomInt/fmToPesStat99) produce stable output for golden-master tests.
function seededRandom(seed) {
  let s = (seed == null ? 42 : seed) >>> 0;
  return function () {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

function silentConsole() {
  const noop = function () {};
  return { log: noop, warn: noop, error: noop, info: noop, debug: noop };
}

function makeMath(randomFn) {
  return {
    random: randomFn,
    round: Math.round,
    floor: Math.floor,
    ceil: Math.ceil,
    min: Math.min,
    max: Math.max,
    abs: Math.abs,
    pow: Math.pow,
    sqrt: Math.sqrt,
    PI: Math.PI,
  };
}

/**
 * Evaluate ordered source files in a fresh VM context.
 *
 * @param {string[]} files file names relative to jsDir
 * @param {object} [options]
 * @param {function} [options.random] custom Math.random
 * @param {number} [options.seed] seed for the default deterministic PRNG
 * @param {object} [options.console] console implementation (defaults to silent)
 * @param {object} [options.chrome] chrome.* stub (optional)
 * @param {string} [options.jsDir] directory containing the source files
 * @returns {{ sandbox: object }} the VM global object (functions/classes loaded)
 */
function load(files = DEFAULT_FILES, options = {}) {
  const randomFn = options.random || seededRandom(options.seed);

  const sandbox = {
    console: options.console || silentConsole(),
    Math: makeMath(randomFn),
    chrome: options.chrome || {},
  };
  // window/globalThis point back at the global object so top-level `function`
  // declarations and `var`s become visible as `window.*`, matching a browser.
  sandbox.window = sandbox;
  sandbox.globalThis = sandbox;

  vm.createContext(sandbox);

  const jsDir = options.jsDir || SRC_DIR;
  for (const file of files) {
    const code = fs.readFileSync(path.join(jsDir, file), "utf8");
    vm.runInContext(code, sandbox, { filename: file });
  }

  return { sandbox };
}

/**
 * Copy top-level lexical bindings (classes/consts) onto an `__exports` object
 * on the sandbox global and return it.
 */
function extractExports(sandbox, names = DEFAULT_EXPORTS) {
  const src =
    "window.__exports = { " +
    names.map((name) => name + ": " + name).join(", ") +
    " };";
  vm.runInContext(src, sandbox, { filename: "exports-bridge" });
  return sandbox.__exports;
}

function loadExports(files = DEFAULT_FILES, options = {}) {
  const { sandbox } = load(files, options);
  const exports = extractExports(sandbox, options.exports || DEFAULT_EXPORTS);
  return { sandbox, exports };
}

module.exports = {
  load,
  extractExports,
  loadExports,
  seededRandom,
  DEFAULT_FILES,
  DEFAULT_EXPORTS,
  SRC_DIR,
};
