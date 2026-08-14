"use strict";

const test = require("node:test");
const assert = require("node:assert");
const fs = require("fs");
const path = require("path");

const { loadExports } = require("../load");
const { buildAll } = require("../generate-golden");

const GOLDEN_FILE = path.join(
  __dirname,
  "..",
  "fixtures",
  "golden",
  "golden.json",
);

// Build once; buildAll creates fresh converter instances per case, so no state
// leaks between cases.
const { exports: api } = loadExports();
const actual = buildAll(api);
const expected = JSON.parse(fs.readFileSync(GOLDEN_FILE, "utf8"));

test("golden-master has the expected case list", () => {
  assert.deepStrictEqual(Object.keys(actual), Object.keys(expected));
});

for (const key of Object.keys(expected)) {
  test(`golden: ${key}`, () => {
    assert.strictEqual(actual[key].psd, expected[key].psd, "PSD mismatch");
    assert.strictEqual(actual[key].csv, expected[key].csv, "CSV mismatch");
  });
}
