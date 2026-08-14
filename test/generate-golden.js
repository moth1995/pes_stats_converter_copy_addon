"use strict";

const fs = require("fs");
const path = require("path");

const { loadExports } = require("./load");
const fixtures = require("./fixtures/players");

const GOLDEN_DIR = path.join(__dirname, "fixtures", "golden");
const GOLDEN_FILE = path.join(GOLDEN_DIR, "golden.json");

function convert(exports, converterName, methodName, fixture) {
  const player = new exports[converterName]();
  player[methodName](fixture);
  return {
    psd: player.PSDString(),
    csv: player.CSVString(),
  };
}

function buildAll(exports) {
  const golden = {};

  const cases = [
    // [converter, method, fixture, key]
    [
      "PESPlayer",
      "FromFIFA17To23Player",
      fixtures.sofifaField(),
      "sofifa-field",
    ],
    ["PESPlayer", "FromFIFA17To23Player", fixtures.sofifaGK(), "sofifa-gk"],
    ["PESPlayer", "FromFMPlayer", fixtures.fmField(), "fm-field"],
    ["PESPlayer", "FromFMPlayer", fixtures.fmGK(), "fm-gk"],
    [
      "PESPlayer",
      "FromPESMasterPlayer",
      fixtures.pesmasterField(),
      "pesmaster-field",
    ],

    [
      "PES13Player",
      "FromFIFA17To23Player",
      fixtures.sofifaField(),
      "sofifa-field",
    ],
    ["PES13Player", "FromFIFA17To23Player", fixtures.sofifaGK(), "sofifa-gk"],
    ["PES13Player", "FromFMPlayer", fixtures.fmField(), "fm-field"],
    ["PES13Player", "FromFMPlayer", fixtures.fmGK(), "fm-gk"],

    [
      "PES21Player",
      "FromFIFA17To23Player",
      fixtures.sofifaField(),
      "sofifa-field",
    ],
    ["PES21Player", "FromFIFA17To23Player", fixtures.sofifaGK(), "sofifa-gk"],
    ["PES21Player", "FromFMPlayer", fixtures.fmField(), "fm-field"],
    ["PES21Player", "FromFMPlayer", fixtures.fmGK(), "fm-gk"],
    [
      "PES21Player",
      "FromPESMasterPlayer",
      fixtures.pesmasterField(),
      "pesmaster-field",
    ],
  ];

  for (const [converter, method, fixture, key] of cases) {
    const id = `${converter}:${key}`;
    golden[id] = convert(exports, converter, method, fixture);
  }

  return golden;
}

if (require.main === module) {
  fs.mkdirSync(GOLDEN_DIR, { recursive: true });
  const { exports } = loadExports();
  const golden = buildAll(exports);
  fs.writeFileSync(GOLDEN_FILE, JSON.stringify(golden, null, 2) + "\n");
  console.log("Wrote", GOLDEN_FILE);
  console.log("Cases:", Object.keys(golden).length);
}

module.exports = { buildAll, convert };
