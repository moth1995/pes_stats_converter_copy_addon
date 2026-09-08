# PES Stats Converter

A browser extension (Manifest V3, plain JavaScript, no build step) that adds a
floating button to player pages on SoFIFA, FMInside, and PESMaster. Clicking it
converts FIFA / Football Manager / eFootball stats into old-gen PES stats and
copies them to the clipboard (or appends them to a CSV list).

## Features

- **SoFIFA** — FIFA / FC player pages (versions FC 26 back to FIFA 17, English UI).
- **FMInside** — Football Manager player pages (PES 5, PES 13, PES 21, or raw).
- **PESMaster** — eFootball 2022 player pages (PES 5 or PES 21, English UI).
- **Copy modes** — single player as PSD text (clipboard), or accumulate multiple
  players and export a CSV.
- **Debug logging** — open the page console and set `window.PES_DEBUG = true` to
  see the scraped input, position weights, and conversion detail.

## Project structure

```
src/
  manifest.json
  policy_privacy.html
  icons/          extension icons
  popup/          popup.html/css/js (settings + CSV controls)
  content/
    bootstrap.js  single orchestrator: storage -> scrape -> convert -> render
    sources/      one scraper descriptor per site (sofifa/fminside/pesmaster)
  converters/     pes5.js, pes13.js, pes21.js (stat conversion formulas)
  lib/            shared pure helpers
    utils.js      math/random helpers
    positions.js  FM/FIFA/eFootball -> PES position maps
    names.js      shirt-name accent translation + padding
    abilities.js  special-ability position gating
    dom.js        null-safe DOM helpers
    logger.js     debugLog / debugWarn (gated by window.PES_DEBUG)
    core.js       clipboard, CSV storage, playing-style resolution
    namespace.js  window.PESConverter + source registry
  data/           nationalities, PES21 country map, PES21 stat tables
test/             Node test runner + golden-master fixtures/specs
```

The three content scraper files register a source descriptor via
`window.PESConverter.registerSource(...)`. `content/bootstrap.js` reads the
registry and drives the single shared convert + copy/CSV flow, so adding a new
site only requires a new source descriptor, not a copy of the button flow.

## Running the tests

No dependencies and no build step. Tests use Node's built-in runner and a small
VM sandbox that evaluates the extension's classic scripts with a browser-like
`window` and a deterministic PRNG (so the random-based FM conversion is stable).

```bash
npm test            # run the full suite
npm run test:golden # run just the golden-master conversion tests
```

The **golden-master** tests are the safety net: they snap the exact PSD and CSV
output of every converter against hand-built player fixtures. Refactors must
keep these byte-identical unless a change is an intentional bug fix.

## Manual installation

Load `src/` as an unpacked extension:

- **Chrome / Brave / Opera** — open `chrome://extensions` (or the equivalent),
  enable Developer mode, click "Load unpacked", and select the `src/` folder.
- **Firefox (temporary)** — open `about:debugging`, click "This Firefox", then
  "Load Temporary Add-on" and select `src/manifest.json`.
- **Firefox Developer Edition (permanent)** — set
  `xpinstall.signatures.required` to `false`, then use "Install Add-on From
  File…" and select `src/manifest.json`.

## Usage

1. Visit a supported player page.
2. Click the floating button.
3. The converted stats are copied to your clipboard (or appended to the CSV
   list, depending on the selected copy mode).
4. Export the CSV from the extension popup when you're done.

## License

Released under the [GNU General Public License v3.0](LICENSE).
