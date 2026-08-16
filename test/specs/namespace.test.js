"use strict";

const test = require("node:test");
const assert = require("node:assert");

const { load } = require("../load");

test("window.PESConverter namespace groups shared bindings", () => {
  const { sandbox } = load();

  const ns = sandbox.window.PESConverter;
  assert.ok(ns, "PESConverter namespace is defined on window");

  // Spot-check a representative binding from each category.
  assert.strictEqual(typeof ns.PESPlayer, "function");
  assert.strictEqual(typeof ns.PES21Player, "function");
  assert.strictEqual(typeof ns.PES13Player, "function");
  assert.strictEqual(typeof ns.clamp, "function");
  assert.strictEqual(typeof ns.average, "function");
  assert.strictEqual(typeof ns.textOf, "function");
  assert.strictEqual(typeof ns.fmToPesPositions, "function");

  // `const`/`let`/`class` bindings are lexical in a script's global scope and
  // are NOT `window` properties (same as a browser); assert their values
  // through the namespace instead.
  assert.strictEqual(ns.PES21_COUNTRY_MAP["Argentina"], 144);
  assert.strictEqual(ns.pesIndieNationalities["Argentina"], "Argentinian");
  assert.ok(ns.PES5_CSV_COLUMNS.startsWith("ID,NAME,SHIRT_NAME"));
});
