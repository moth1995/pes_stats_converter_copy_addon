"use strict";

const test = require("node:test");
const assert = require("node:assert");

const { loadExports } = require("../load");
const fixtures = require("../fixtures/players");

const { exports: api } = loadExports();

test("bug: PES21 'Attack position' typo now applies reactions adjustment", () => {
  // Attack position 80 < Reactions 81, so the fix must increment
  // offensiveAwareness by 1 (previously the misspelled "Attck position"
  // compared undefined and did nothing).
  const player = new api.PES21Player();
  player.fromFIFA17To23Player(fixtures.sofifaField());
  assert.strictEqual(player.offensiveAwareness, 81);
});

test("bug: PES13 sets p03Trickster instead of p01ClassicNo10", () => {
  const fixture = fixtures.sofifaField();
  fixture.traits.push("Trickster");

  const player = new api.PES13Player();
  player.fromFIFA17To23Player(fixture);

  assert.strictEqual(player.p03Trickster, 1);
  assert.strictEqual(player.p01ClassicNo10, 0);
});

test("bug: PES5 uses correct 'Gamesmanship' string for PESMaster", () => {
  const fixture = fixtures.pesmasterField();
  fixture.specialStats.push("Gamesmanship");

  const player = new api.PESPlayer();
  player.fromPesMasterPlayer(fixture);

  assert.strictEqual(player.tacticalDribble, 1);
});

test("bug: heightTo99Stat no longer leaks a global 'stat'", () => {
  // The else branches previously assigned an undeclared `stat` variable
  // (implicit global). The fixed function just returns the value.
  assert.strictEqual(api.heightTo99Stat(170, true), 95);
  assert.strictEqual(api.heightTo99Stat(210, true), 55);
  assert.strictEqual(api.heightTo99Stat(160, false), 95);
  assert.strictEqual(api.heightTo99Stat(210, false), 55);
});

test("dom helpers return safe fallbacks when selectors miss", () => {
  const missing = { querySelector: () => null, querySelectorAll: () => [] };
  assert.strictEqual(api.textOf(missing, "x"), "");
  assert.strictEqual(api.attrOf(missing, "x", "y"), "");
  assert.strictEqual(api.intOf(missing, "x", 5), 5);
  assert.strictEqual(api.first(missing, "x"), null);
  assert.deepStrictEqual(Array.from(api.all(missing, "x")), []);
});

test("dom helpers read values from present elements", () => {
  const el = { textContent: " 42 ", getAttribute: () => "L" };
  const root = { querySelector: () => el, querySelectorAll: () => [el] };
  assert.strictEqual(api.intOf(root, "x", 0), 42);
  assert.strictEqual(api.textOf(root, "x"), "42");
  assert.strictEqual(api.attrOf(root, "x", "t"), "L");
});
