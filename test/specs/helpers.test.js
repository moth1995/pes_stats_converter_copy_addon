"use strict";

const test = require("node:test");
const assert = require("node:assert");

const { loadExports } = require("../load");

const { exports: api } = loadExports();

test("average returns the arithmetic mean", () => {
  assert.strictEqual(api.average([10, 20, 30]), 20);
  assert.strictEqual(api.average([7]), 7);
  assert.strictEqual(api.average([]), 0);
});

test("average handles decimal means", () => {
  assert.strictEqual(api.average([1, 2]), 1.5);
});

test("clamp bounds values", () => {
  assert.strictEqual(api.clamp(0, 10, 5), 5);
  assert.strictEqual(api.clamp(0, 10, -3), 0);
  assert.strictEqual(api.clamp(0, 10, 99), 10);
});

test("atLeast returns the max of value and compare", () => {
  assert.strictEqual(api.atLeast(10, 60), 60);
  assert.strictEqual(api.atLeast(80, 60), 80);
});

test("divideIntegers rounds the quotient", () => {
  assert.strictEqual(api.divideIntegers(10, 3), 3);
  assert.strictEqual(api.divideIntegers(9, 3), 3);
  assert.strictEqual(api.divideIntegers(11, 2), 6);
});

test("limitStat99 caps at 99 and rounds", () => {
  assert.strictEqual(api.limitStat99(150), 99);
  assert.strictEqual(api.limitStat99(87.6), 88);
  assert.strictEqual(api.limitStat99(40), 40);
});

test("stringInArray is case-insensitive", () => {
  assert.strictEqual(api.stringInArray(["Finesse Shot"], "finesse shot"), true);
  assert.strictEqual(api.stringInArray(["Finesse Shot"], "Power Shot"), false);
});

test("applyButtonPosition sets the four corner positions with no transform", () => {
  const cases = [
    [api.BUTTON_POSITION.TOP_LEFT, { top: "20px", left: "20px" }],
    [api.BUTTON_POSITION.TOP_RIGHT, { top: "20px", right: "20px" }],
    [api.BUTTON_POSITION.BOTTOM_LEFT, { bottom: "20px", left: "20px" }],
    [api.BUTTON_POSITION.BOTTOM_RIGHT, { bottom: "20px", right: "20px" }],
  ];

  for (const [position, expected] of cases) {
    /** @type {Record<string, string>} */
    const style = {};
    api.applyButtonPosition(style, position);

    assert.strictEqual(style.position, "fixed");
    assert.strictEqual(style.transform, "none");
    for (const [prop, value] of Object.entries(expected)) {
      assert.strictEqual(style[prop], value, `${position} -> ${prop}`);
    }
  }
});

test("applyButtonPosition centers with the correct single-axis transform", () => {
  /** @type {Record<string, string>} */
  const topCenter = {};
  api.applyButtonPosition(topCenter, api.BUTTON_POSITION.TOP_CENTER);
  assert.strictEqual(topCenter.top, "20px");
  assert.strictEqual(topCenter.left, "50%");
  assert.strictEqual(topCenter.transform, "translateX(-50%)");

  /** @type {Record<string, string>} */
  const middleLeft = {};
  api.applyButtonPosition(middleLeft, api.BUTTON_POSITION.MIDDLE_LEFT);
  assert.strictEqual(middleLeft.top, "50%");
  assert.strictEqual(middleLeft.left, "20px");
  assert.strictEqual(middleLeft.transform, "translateY(-50%)");
});

test("applyButtonPosition reproduces PESMaster's original middle-right layout", () => {
  /** @type {Record<string, string>} */
  const style = {};
  api.applyButtonPosition(style, api.BUTTON_POSITION.MIDDLE_RIGHT);
  assert.strictEqual(style.top, "50%");
  assert.strictEqual(style.bottom, "auto");
  assert.strictEqual(style.right, "20px");
  assert.strictEqual(style.transform, "translateY(-50%)");
});

test("applyButtonPosition centers on both axes for middle-center", () => {
  /** @type {Record<string, string>} */
  const style = {};
  api.applyButtonPosition(style, api.BUTTON_POSITION.MIDDLE_CENTER);
  assert.strictEqual(style.top, "50%");
  assert.strictEqual(style.left, "50%");
  assert.strictEqual(style.transform, "translate(-50%, -50%)");
});

test("applyButtonPosition resets stale offsets from a previous call", () => {
  /** @type {Record<string, string>} */
  const style = {};
  api.applyButtonPosition(style, api.BUTTON_POSITION.BOTTOM_RIGHT);
  api.applyButtonPosition(style, api.BUTTON_POSITION.TOP_LEFT);

  assert.strictEqual(style.bottom, "auto");
  assert.strictEqual(style.right, "auto");
  assert.strictEqual(style.top, "20px");
  assert.strictEqual(style.left, "20px");
});

test("applyButtonPosition is a no-op for an unrecognized position (e.g. corrupted storage)", () => {
  /** @type {Record<string, string>} */
  const style = { bottom: "20px", right: "20px", position: "fixed" };

  api.applyButtonPosition(style, "not-a-real-position");

  // Untouched, rather than reset to an all-"auto" (invisible) layout.
  assert.deepStrictEqual(style, {
    bottom: "20px",
    right: "20px",
    position: "fixed",
  });
});

test("fmPositionStringToArray splits and trims", () => {
  // Array.from bridges the VM-realm array to the host realm so deepStrictEqual
  // compares against a native Array with the host prototype.
  assert.deepStrictEqual(
    Array.from(api.fmPositionStringToArray("AML, AMR, ST")),
    ["AML", "AMR", "ST"],
  );
  assert.deepStrictEqual(
    Array.from(api.fmPositionStringToArray("AML,AMR,ST")),
    ["AML", "AMR", "ST"],
  );
});

test("fmToPesPositions maps primary positions", () => {
  assert.strictEqual(api.fmToPesPositions("GK"), "GK");
  assert.strictEqual(api.fmToPesPositions("DC"), "CBT");
  assert.strictEqual(api.fmToPesPositions("DM"), "DMF");
  assert.strictEqual(api.fmToPesPositions("AMC"), "AMF");
  assert.strictEqual(api.fmToPesPositions("ST"), "CF");
});

test("fifaToPes21Positions maps FIFA positions", () => {
  assert.strictEqual(api.fifaToPes21Positions("CB"), "CB");
  assert.strictEqual(api.fifaToPes21Positions("CDM"), "DMF");
  assert.strictEqual(api.fifaToPes21Positions("LW"), "LWF");
  assert.strictEqual(api.fifaToPes21Positions("ST"), "CF");
});

test("efootballToPesPosition maps eFootball positions", () => {
  assert.strictEqual(api.efootballToPesPosition("CB"), "CBT");
  assert.strictEqual(api.efootballToPesPosition("RB"), "SB");
  assert.strictEqual(api.efootballToPesPosition("RMF"), "SMF");
  assert.strictEqual(api.efootballToPesPosition("CF"), "CF");
});

test("getRandomInt is deterministic and within bounds", () => {
  // Uses the seeded Math.random from the loader.
  for (let i = 0; i < 100; i++) {
    const v = api.getRandomInt(40, 43);
    assert.ok(v >= 40 && v < 43, `expected in [40,43), got ${v}`);
  }
});

test("fmToPesStat99 always returns a value in the table range", () => {
  for (let stat = 1; stat <= 20; stat++) {
    const v = api.fmToPesStat99(stat);
    assert.ok(v >= 40 && v <= 100, `stat ${stat} -> ${v}`);
  }
});

test("middleOfRange picks the true middle, or the higher of two candidates", () => {
  assert.strictEqual(api.middleOfRange(40, 43), 41); // 3 candidates: 40,41,42
  assert.strictEqual(api.middleOfRange(40, 42), 41); // 2 candidates: 40,41 -> higher
});

test("fmToPesStat99 is deterministic by default (window.PES_FM_RANDOM_STATS unset)", () => {
  // Bucket for stat=1 is [40,43) -> candidates 40,41,42, middle = 41.
  assert.strictEqual(api.fmToPesStat99(1), 41);
  assert.strictEqual(api.fmToPesStat99(1), api.fmToPesStat99(1));
});

test("fmToPesStat99 restores random picks when window.PES_FM_RANDOM_STATS is set", () => {
  const { sandbox, exports: randomApi } = loadExports();
  sandbox.window.PES_FM_RANDOM_STATS = true;

  const seen = new Set();
  for (let i = 0; i < 20; i++) {
    const v = randomApi.fmToPesStat99(1);
    assert.ok(v >= 40 && v < 43, `expected in [40,43), got ${v}`);
    seen.add(v);
  }

  // A deterministic implementation would only ever produce one value here;
  // the seeded PRNG (see test/load.js) makes this assertion reproducible.
  assert.ok(
    seen.size > 1,
    `expected multiple distinct values from the 3-candidate bucket, got ${[...seen]}`,
  );
});

test("fmToPesStat1To8 maps the documented range", () => {
  assert.strictEqual(api.fmToPesStat1To8(1), 1);
  assert.strictEqual(api.fmToPesStat1To8(20), 8);
});

test("fmToPesStatAToC maps the documented range", () => {
  assert.strictEqual(api.fmToPesStatAToC(1), "C");
  assert.strictEqual(api.fmToPesStatAToC(20), "A");
});

test("getFavSide detects sided positions", () => {
  assert.strictEqual(api.getFavSide(["AML", "AMR"], true), "B");
  assert.strictEqual(api.getFavSide(["AML", "AML"], true), "L");
  assert.strictEqual(api.getFavSide(["AMR"], true), "R");
});

test("heightTo99Stat uses tables for known heights", () => {
  assert.strictEqual(api.heightTo99Stat(195, false), 65);
  assert.strictEqual(api.heightTo99Stat(175, true), 95);
  assert.strictEqual(api.heightTo99Stat(180, false), 80);
});

test("PES21_COUNTRY_MAP is loaded", () => {
  assert.strictEqual(api.PES21_COUNTRY_MAP["Argentina"], 144);
  assert.strictEqual(api.PES21_COUNTRY_MAP["None"], 0);
});

test("pesIndieNationalities maps countries to adjectives", () => {
  assert.strictEqual(api.pesIndieNationalities["Argentina"], "Argentinian");
});

test("extractLastName returns the last whitespace-separated word, uppercased", () => {
  assert.strictEqual(api.extractLastName("Cristiano Ronaldo"), "RONALDO");
  assert.strictEqual(api.extractLastName("Ronaldo"), "RONALDO");
  assert.strictEqual(api.extractLastName("  Ronaldo  "), "RONALDO");
  assert.strictEqual(api.extractLastName("First   Last"), "LAST");
  // Not accent-flattened - that's shirtName's/formatPes5ShirtName's job.
  assert.strictEqual(api.extractLastName("Martin Ødegaard"), "ØDEGAARD");
});

test("shirtName extracts and uppercases last name", () => {
  assert.strictEqual(api.shirtName("Cristiano Ronaldo"), "RONALDO");
  assert.strictEqual(api.shirtName("Luis Alberto"), "ALBERTO");
  assert.strictEqual(api.shirtName("Pelé"), "PELE");
});

test("shirtName handles single names", () => {
  assert.strictEqual(api.shirtName("Ronaldo"), "RONALDO");
  assert.strictEqual(api.shirtName("Pelé"), "PELE");
});

test("shirtName flattens Romance accents (French, Spanish, Italian, Portuguese)", () => {
  assert.strictEqual(api.shirtName("José"), "JOSE");
  assert.strictEqual(api.shirtName("François"), "FRANCOIS");
  assert.strictEqual(api.shirtName("Müller"), "MULLER");
  assert.strictEqual(api.shirtName("Ångström"), "ANGSTROM");
  assert.strictEqual(api.shirtName("Peña"), "PENA");
  assert.strictEqual(api.shirtName("Zoë"), "ZOE");
  assert.strictEqual(api.shirtName("Thiago Alcântara"), "ALCANTARA");
});

test("shirtName flattens Polish accents", () => {
  assert.strictEqual(api.shirtName("Lewandowski"), "LEWANDOWSKI");
  assert.strictEqual(api.shirtName("Żurawski"), "ZURAWSKI");
  assert.strictEqual(api.shirtName("Ślęzak"), "SLEZAK");
  assert.strictEqual(api.shirtName("Zieliński"), "ZIELINSKI");
  assert.strictEqual(api.shirtName("Mądrych"), "MADRYCH");
  assert.strictEqual(api.shirtName("Ęsak"), "ESAK");
});

test("shirtName flattens Slavic accents (Czech, Slovak, Serbian, Croatian)", () => {
  assert.strictEqual(api.shirtName("Čech"), "CECH");
  assert.strictEqual(api.shirtName("Šuker"), "SUKER");
  assert.strictEqual(api.shirtName("Živković"), "ZIVKOVIC");
  assert.strictEqual(api.shirtName("Perisic"), "PERISIC");
  assert.strictEqual(api.shirtName("Đoković"), "DOKOVIC");
  assert.strictEqual(api.shirtName("Ř Dvorak"), "DVORAK");
});

test("shirtName flattens Turkish accents", () => {
  assert.strictEqual(api.shirtName("Güneş"), "GUNES");
  assert.strictEqual(api.shirtName("Şahin"), "SAHIN");
  assert.strictEqual(api.shirtName("Arda İlhan"), "ILHAN");
});

test("shirtName flattens Romanian accents", () => {
  assert.strictEqual(api.shirtName("Păun"), "PAUN");
  assert.strictEqual(api.shirtName("Șumudică"), "SUMUDICA");
  assert.strictEqual(api.shirtName("Țiclea"), "TICLEA");
});

test("shirtName flattens Nordic accents", () => {
  assert.strictEqual(api.shirtName("Ødegaard"), "ODEGAARD");
  assert.strictEqual(api.shirtName("Ærlig"), "AERLIG");
  assert.strictEqual(api.shirtName("Símon Kjaer"), "KJAER");
  assert.strictEqual(api.shirtName("Þórsson"), "THORSSON");
});

test("shirtName flattens Hungarian accents", () => {
  assert.strictEqual(api.shirtName("Szalai Attila"), "ATTILA");
  assert.strictEqual(api.shirtName("Bödős"), "BODOS");
  assert.strictEqual(api.shirtName("Gulácsi"), "GULACSI");
});

test("shirtName flattens Baltic accents (Lithuanian, Latvian, Estonian)", () => {
  assert.strictEqual(api.shirtName("Stuparevičius"), "STUPAREVICIUS");
  assert.strictEqual(api.shirtName("Vaitkus"), "VAITKUS");
  assert.strictEqual(api.shirtName("Miškinis"), "MISKINIS");
});

test("shirtName handles multiple accented characters in one name", () => {
  assert.strictEqual(api.shirtName("Perišić"), "PERISIC");
  assert.strictEqual(api.shirtName("Müller Österreich"), "OSTERREICH");
  assert.strictEqual(api.shirtName("José María García"), "GARCIA");
});

test("shirtName preserves ASCII-only names", () => {
  assert.strictEqual(api.shirtName("Smith"), "SMITH");
  assert.strictEqual(api.shirtName("John Brown"), "BROWN");
  assert.strictEqual(api.shirtName("ALREADY UPPER"), "UPPER");
});

test("shirtName handles whitespace-padded names", () => {
  assert.strictEqual(api.shirtName("  Ronaldo  "), "RONALDO");
  assert.strictEqual(api.shirtName("First   Last"), "LAST");
});

// formatPes5ShirtName extracts the last name and flattens accents itself
// (see converters/pes5.js: PESPlayer.nameToShirtName calls it directly with
// the full raw name). Passing an already-single-word, already-uppercase
// string is equivalent to passing a full name — extractLastName is a no-op
// on it — so plain-ASCII single-word inputs below still exercise the same
// spacing logic as production.

test("formatPes5ShirtName applies double spacing for < 5 chars", () => {
  assert.strictEqual(api.formatPes5ShirtName("JOHN"), "J  O  H  N");
  assert.strictEqual(api.formatPes5ShirtName("ART"), "A  R  T");
  assert.strictEqual(api.formatPes5ShirtName("JO"), "J  O");
  assert.strictEqual(api.formatPes5ShirtName("A"), "A");
});

test("formatPes5ShirtName applies single spacing for 5-8 chars", () => {
  assert.strictEqual(api.formatPes5ShirtName("SMITH"), "S M I T H");
  assert.strictEqual(api.formatPes5ShirtName("RONALDO"), "R O N A L D O");
  assert.strictEqual(api.formatPes5ShirtName("ALBERTO"), "A L B E R T O");
});

test("formatPes5ShirtName applies no spacing for >= 9 chars", () => {
  assert.strictEqual(api.formatPes5ShirtName("CRISTIANINHO"), "CRISTIANINHO");
  assert.strictEqual(api.formatPes5ShirtName("MANCHESTER"), "MANCHESTER");
});

test("formatPes5ShirtName truncates names over 16 chars to 15", () => {
  const long = "THISISMUCHLONGERNAME";
  const result = api.formatPes5ShirtName(long);
  assert.strictEqual(result.length, 15);
  assert.strictEqual(result, "THISISMUCHLONGE");
});

test("formatPes5ShirtName truncates a 16-char name to 15", () => {
  // No-spacing branch checks `> 15`, so 16 chars gets sliced to 15.
  const sixteen = "ABCDEFGHIJKLMNOP";
  const result = api.formatPes5ShirtName(sixteen);
  assert.strictEqual(result, "ABCDEFGHIJKLMNO");
  assert.strictEqual(result.length, 15);
});

test("formatPes5ShirtName handles boundary at exactly 5 chars (no double spacing)", () => {
  const result = api.formatPes5ShirtName("SMITH");
  assert.strictEqual(result, "S M I T H");
  assert(!result.includes("  "), "should not have double spacing at exactly 5");
});

test("formatPes5ShirtName handles boundary at exactly 9 chars (no spacing)", () => {
  const result = api.formatPes5ShirtName("MANCHESTER");
  assert.strictEqual(result, "MANCHESTER");
  assert(!result.includes(" "), "should not have any spacing at >= 9 chars");
});

test("formatPes5ShirtName matches production usage for accented full names", () => {
  // This is the real call: PESPlayer.nameToShirtName (converters/pes5.js)
  // passes the full raw name straight in. Raw Æ/Þ reach the function intact,
  // so the multi-char glyph mapping (Æ->"AE") is grouped as one spacing unit
  // instead of the two separate letters shirtName() would have produced.
  assert.strictEqual(
    api.formatPes5ShirtName("Erling Ærlig"),
    "AE R L I G", // "ÆRLIG" -> glyphs ["AE","R","L","I","G"], charCount 6 -> single spacing
  );
  assert.strictEqual(
    api.formatPes5ShirtName("Martin Ødegaard"),
    "O D E G A A R D", // "ØDEGAARD" -> Ø is 1:1 -> "ODEGAARD", 8 chars -> single spacing
  );
  assert.strictEqual(
    api.formatPes5ShirtName("Cristiano Ronaldo"),
    "R O N A L D O", // "RONALDO", 7 chars -> single spacing
  );
  assert.strictEqual(
    api.formatPes5ShirtName("Pelé"),
    "P  E  L  E", // "PELÉ" -> "PELE", 4 chars -> double spacing
  );
});

test("formatPes5ShirtName treats multi-char glyphs (Æ→AE, Þ→TH) as one unit for spacing", () => {
  // charCount = 4 (2x "AE"), < 5 -> double spacing fits in 15
  assert.strictEqual(api.formatPes5ShirtName("ÆÆ"), "AE  AE");
  // charCount = 3 ("AE" + "X"), < 5 -> double spacing fits in 15
  assert.strictEqual(api.formatPes5ShirtName("ÆX"), "AE  X");
  // plain ASCII, 6 chars -> single spacing
  assert.strictEqual(api.formatPes5ShirtName("ORSTED"), "O R S T E D");
});

test("formatPes5ShirtName tries single spacing when double spacing would overflow", () => {
  // charCount = 6 (3x "AE"), not < 5 -> try single spacing, fits in 15
  assert.strictEqual(api.formatPes5ShirtName("ÆÆÆ"), "AE AE AE");
  // charCount = 5 ("AE"+R+X+Y), not < 5 -> single spacing
  assert.strictEqual(api.formatPes5ShirtName("ÆRXY"), "AE R X Y");
  // charCount = 4 ("TH"+A+B), < 5 -> double spacing fits
  assert.strictEqual(api.formatPes5ShirtName("ÞAB"), "TH  A  B");
});

test("formatPes5ShirtName falls back to no spacing when even single spacing overflows", () => {
  // charCount = 13 ("AE" + 11 G's), not < 12 -> no spacing tried, fits unspaced
  assert.strictEqual(api.formatPes5ShirtName("ÆGGGGGGGGGGG"), "AEGGGGGGGGGGG");
  // charCount = 9 (4x "AE" + X), < 12 -> single spacing fits (13 chars)
  assert.strictEqual(api.formatPes5ShirtName("ÆÆÆÆX"), "AE AE AE AE X");
  // charCount = 12 (6x "AE"), not < 12 -> no spacing, fits unspaced
  assert.strictEqual(api.formatPes5ShirtName("ÆÆÆÆÆÆ"), "AEAEAEAEAEAE");
});

test("formatPes5ShirtName handles real Nordic names landing exactly at 15 chars", () => {
  assert.strictEqual(
    api.formatPes5ShirtName("ØDEGAARDHOLMSEN"),
    "ODEGAARDHOLMSEN",
  );
  assert.strictEqual(
    api.formatPes5ShirtName("ÆGAARDSONSHOLM"),
    "AEGAARDSONSHOLM",
  );
});
