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
