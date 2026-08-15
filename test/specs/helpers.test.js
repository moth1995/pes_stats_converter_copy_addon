"use strict";

const test = require("node:test");
const assert = require("node:assert");

const { loadExports } = require("../load");

const { exports: api } = loadExports();

test("Average returns the arithmetic mean", () => {
  assert.strictEqual(api.Average([10, 20, 30]), 20);
  assert.strictEqual(api.Average([7]), 7);
  assert.strictEqual(api.Average([]), 0);
});

test("Average handles decimal means", () => {
  assert.strictEqual(api.Average([1, 2]), 1.5);
});

test("clamp bounds values", () => {
  assert.strictEqual(api.clamp(0, 10, 5), 5);
  assert.strictEqual(api.clamp(0, 10, -3), 0);
  assert.strictEqual(api.clamp(0, 10, 99), 10);
});

test("AtLeast returns the max of value and compare", () => {
  assert.strictEqual(api.AtLeast(10, 60), 60);
  assert.strictEqual(api.AtLeast(80, 60), 80);
});

test("DivideIntegers rounds the quotient", () => {
  assert.strictEqual(api.DivideIntegers(10, 3), 3);
  assert.strictEqual(api.DivideIntegers(9, 3), 3);
  assert.strictEqual(api.DivideIntegers(11, 2), 6);
});

test("LimitStat99 caps at 99 and rounds", () => {
  assert.strictEqual(api.LimitStat99(150), 99);
  assert.strictEqual(api.LimitStat99(87.6), 88);
  assert.strictEqual(api.LimitStat99(40), 40);
});

test("stringInArray is case-insensitive", () => {
  assert.strictEqual(api.stringInArray(["Finesse Shot"], "finesse shot"), true);
  assert.strictEqual(api.stringInArray(["Finesse Shot"], "Power Shot"), false);
});

test("FMPositionStringToArray splits and trims", () => {
  // Array.from bridges the VM-realm array to the host realm so deepStrictEqual
  // compares against a native Array with the host prototype.
  assert.deepStrictEqual(
    Array.from(api.FMPositionStringToArray("AML, AMR, ST")),
    ["AML", "AMR", "ST"],
  );
  assert.deepStrictEqual(
    Array.from(api.FMPositionStringToArray("AML,AMR,ST")),
    ["AML", "AMR", "ST"],
  );
});

test("FMToPESPositions maps primary positions", () => {
  assert.strictEqual(api.FMToPESPositions("GK"), "GK");
  assert.strictEqual(api.FMToPESPositions("DC"), "CBT");
  assert.strictEqual(api.FMToPESPositions("DM"), "DMF");
  assert.strictEqual(api.FMToPESPositions("AMC"), "AMF");
  assert.strictEqual(api.FMToPESPositions("ST"), "CF");
});

test("FIFAToPES21Positions maps FIFA positions", () => {
  assert.strictEqual(api.FIFAToPES21Positions("CB"), "CB");
  assert.strictEqual(api.FIFAToPES21Positions("CDM"), "DMF");
  assert.strictEqual(api.FIFAToPES21Positions("LW"), "LWF");
  assert.strictEqual(api.FIFAToPES21Positions("ST"), "CF");
});

test("EfootballToPESPosition maps eFootball positions", () => {
  assert.strictEqual(api.EfootballToPESPosition("CB"), "CBT");
  assert.strictEqual(api.EfootballToPESPosition("RB"), "SB");
  assert.strictEqual(api.EfootballToPESPosition("RMF"), "SMF");
  assert.strictEqual(api.EfootballToPESPosition("CF"), "CF");
});

test("GetRandomInt is deterministic and within bounds", () => {
  // Uses the seeded Math.random from the loader.
  for (let i = 0; i < 100; i++) {
    const v = api.GetRandomInt(40, 43);
    assert.ok(v >= 40 && v < 43, `expected in [40,43), got ${v}`);
  }
});

test("FMToPESStat99 always returns a value in the table range", () => {
  for (let stat = 1; stat <= 20; stat++) {
    const v = api.FMToPESStat99(stat);
    assert.ok(v >= 40 && v <= 100, `stat ${stat} -> ${v}`);
  }
});

test("FMToPESStat1To8 maps the documented range", () => {
  assert.strictEqual(api.FMToPESStat1To8(1), 1);
  assert.strictEqual(api.FMToPESStat1To8(20), 8);
});

test("FMToPESStatAToC maps the documented range", () => {
  assert.strictEqual(api.FMToPESStatAToC(1), "C");
  assert.strictEqual(api.FMToPESStatAToC(20), "A");
});

test("GetFavSide detects sided positions", () => {
  assert.strictEqual(api.GetFavSide(["AML", "AMR"], true), "B");
  assert.strictEqual(api.GetFavSide(["AML", "AML"], true), "L");
  assert.strictEqual(api.GetFavSide(["AMR"], true), "R");
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
