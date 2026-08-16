# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Manifest V3 browser extension (Chrome/Firefox) that adds a floating button to player pages on **SoFIFA**, **FMInside**, and **PESMaster**, converts FIFA / Football Manager / eFootball stats into old-gen PES stats, and copies them to the clipboard or appends them to a CSV list.

**Plain JavaScript, no build step, no runtime dependencies.** `src/` is loaded directly as an unpacked extension. `devDependencies` exist only for the test harness and type checking.

## Commands

```bash
npm test                          # full Node test suite (node --test test/specs/)
npm run test:golden               # golden-master conversion tests only
node --test test/specs/bugs.test.js                      # single spec file
node --test --test-name-pattern "PES13" test/specs/      # single test by name

node test/generate-golden.js      # REGENERATE golden fixtures (see below)

npm run typecheck                 # type check src/ (checkJs, strict, noImplicitAny)
```

Type checking is **clean and must stay clean**: `npm run typecheck` reports **0 errors** with full `strict` plus `noImplicitAny`. Any non-zero count is a regression. `tsconfig.json` is just `{"extends": "./jsconfig.json"}` so that bare `tsc` and the VS Code language service use the same strict settings as the npm script — `jsconfig.json` holds the real config.

`noUncheckedIndexedAccess` is deliberately **off**: stat dictionaries are typed as total `Record`s (see below), so reads are `number`, not `number | undefined`.

Formatting is Prettier defaults with 2-space indent (`.vscode/settings.json`, enforced in CI by super-linter). `.gitattributes` forces CRLF on all text files.

## The Global-Scope Constraint

Content scripts are **ordered classic scripts sharing one isolated-world global scope**. There is no module system anywhere in `src/`:

- No `import`/`export`, no `require` — files call each other's top-level `function`s by bare identifier.
- Load order is declared in [src/manifest.json](src/manifest.json) and **must** be mirrored in `DEFAULT_FILES` in [test/load.js](test/load.js).
- `class`, `const`, and `let` at top level are _lexical_ bindings, not `window` properties (same as a real browser). Only `function` declarations and `var`s land on `window`. This is why the test harness needs an explicit exports bridge (`DEFAULT_EXPORTS`) and why `lib/namespace.js` exists.

[src/lib/namespace.js](src/lib/namespace.js) assembles every shared binding onto `window.PESConverter` — one discoverable surface without a bundler. It loads **last** in the shared bundle.

[src/lib/typedefs.js](src/lib/typedefs.js) holds all global `@typedef`s. It has **no runtime effect** and is deliberately absent from `manifest.json` and `test/load.js`; `jsconfig.json` uses `"module": "preserve"` so its types are visible by bare name across `src/`.

## Typing Rules

**Class fields are declared in the constructor, never with a class-level `@property` block.** TypeScript only honours `@property` on `@typedef {Object}` — on a class JSDoc comment it is silently inert, and a field documented that way but assigned only inside a method still infers as `T | undefined`. Every converter and scraper field is seeded in its constructor with an explicit `/** @type {T} */`. Do not reintroduce `@property` headers on classes.

**Closed vocabularies are enums, not `string`.** [src/lib/enums.js](src/lib/enums.js) holds the PES domain vocabulary (position codes per edition, `Foot`, `FavouredSide`, `Grade`, `Format`, `CopyMode`). [src/data/source-labels.js](src/data/source-labels.js) holds every third-party site label — SoFIFA stat blocks, PlayStyles vs legacy traits, FM attributes, PESMaster stats/characteristics/skills. Both use `Object.freeze(/** @type {const} */ ({...}))`, which keeps the literal union (so an unknown code is a compile error) *and* makes writes a compile error on top of the runtime freeze.

When a site renames a stat, edit the one constant in `source-labels.js` — the scrapers use page labels verbatim as dictionary keys, so every reader follows. Never reintroduce a bare `"Crossing"`-style literal at a call site.

`PESPlayer` and `PES13Player` must share one position type: the child stores PES13/21-style codes in the inherited `registeredPosition`/`positions`, so narrowing them to different unions makes the override illegal.

**Scraper boundaries cast once.** The DOM decides which keys exist, so the checker cannot prove a stat dictionary is total. Each scraper does exactly one documented cast per dictionary (e.g. `/** @type {FmStatMap} */ (…)`), and everything downstream is checked. Add casts at the boundary, not at read sites.

**Required vs optional DOM reads.** `requireEl`/`requireText`/`requireInt`/`requireAttr` throw `ScrapeError` and are for fields a converted player depends on — a site change must abort rather than emit wrong stats. `textOf`/`attrOf`/`first`/`all`/`intOf` return fallbacks and are for genuinely optional fields. `ScrapeError` is caught in exactly one place, the click handler in [src/content/bootstrap.js](src/content/bootstrap.js), which reports on the button and writes nothing. Do not add try/catch at call sites.

## Architecture

```
manifest content_scripts
  ├─ shared bundle (all sites): lib/* → converters/* → data/* → lib/namespace.js
  └─ per-site: content/sources/<site>.js → content/bootstrap.js
```

**Source registry → bootstrap.** Each scraper in `src/content/sources/` calls `window.PESConverter.registerSource({...})` at load time with a `SourceDescriptor`: `id`, `converterMethod` (which converter entry point to call), `supportedFormats`, `isSupported()`, `label()`, optional `buttonStyle(style)`, and `build(doc)`.

[src/content/bootstrap.js](src/content/bootstrap.js) is the **single orchestrator** for all three sites: it picks the first source whose `isSupported()` passes, mounts the floating button, then on click reads settings from `chrome.storage.local`, re-parses the page through `DOMParser`, scrapes, converts, and renders to clipboard (`copyMode === "one"`) or CSV storage. Adding a site means adding a descriptor — never copying the button flow.

**Converters** (`src/converters/pes5.js`, `pes13.js`, `pes21.js`) are the conversion formulas. `PES13Player` extends `PESPlayer`. Each exposes source-specific entry points (`fromFIFA17To23Player`, `fromFMPlayer`, `fromPesMasterPlayer`) plus `psdString()` (clipboard text) and `csvString()` (one CSV row). `window.PESConverter.converterResult()` normalizes both into `{psd(), csv()}` so bootstrap never sees the concrete class. FMInside additionally supports `"raw"` format, where the _scraped_ object's own `psdString()` is the output.

**CSV accumulation** lives in `chrome.storage.local` under three separate keys — `playersData` (PES5), `players13Data` (PES13), `players21Data` (PES21) — each seeded with its `*_CSV_COLUMNS` header row on first append. [src/popup/popup.js](src/popup/popup.js) reads those keys to download / clear / pop-last.

**Formats differ in CSV delimiter**: PES5 and PES13 use `,`; PES21 uses `;`.

## Testing

[test/load.js](test/load.js) evaluates the extension's classic scripts inside a Node `vm` context with a browser-like global (`sandbox.window === sandbox`), a silent console, a `chrome` stub, and a **seeded LCG replacing `Math.random`** — the FM→PES5/PES13 paths draw random stat buckets, so determinism comes from the harness, not the code.

The DOM scraper files are excluded from `DEFAULT_FILES`: they touch `document.*` at load time and are not pure. Scrapers are therefore **untested** — only converters, lib helpers, and the namespace are covered.

**Golden-master tests are the safety net.** [test/specs/golden.test.js](test/specs/golden.test.js) compares byte-exact `psdString()` and `csvString()` output for 14 converter × fixture cases against [test/fixtures/golden/golden.json](test/fixtures/golden/golden.json). Refactors must keep this byte-identical. Only run `node test/generate-golden.js` when output changed **intentionally** (a real bug fix), and review the resulting fixture diff as part of the change — never regenerate to make a red suite go green.

`test/specs/bugs.test.js` pins previously-fixed legacy bugs (e.g. the `"Attck position"` typo, PES13 trickster flag). Treat these as regression locks.

## Adding Things

**A new site source** — write `src/content/sources/<site>.js` ending in a `registerSource({...})` call, then add two `content_scripts` entries to `manifest.json` (host match for the shared bundle, and one for `[<site>.js, content/bootstrap.js]`) plus `host_permissions`.

**A new shared helper** — add the `function` to the right `src/lib/` file, then update **all four** of: `lib/namespace.js` (the `PESConverter` object), `lib/typedefs.js` (`PESConverterNamespace` `@property`), `test/load.js` `DEFAULT_EXPORTS`, and `manifest.json` `js` array _if_ it's a new file. Nothing enforces these staying in sync; a missed one fails at runtime in the VM, not at type-check time.

Note the popup is a **separate runtime scope** — `popup.js` is loaded only from `popup.html` and does not see `PESConverter`. `popup.html` loads `lib/enums.js` itself so the popup and the content scripts share one vocabulary; anything else it needs must be added there too.

## Release

Tagging `v*` triggers [.github/workflows/make_release.yml](.github/workflows/make_release.yml), which **fails the build unless `src/manifest.json`'s `version` matches the tag** (minus the `v` prefix and any `-rc`/`-beta` suffix), then zips `src/` and publishes a GitHub Release with a SHA256 checksum. `package.json`'s version is only the test harness's and is not checked — `src/manifest.json` is the source of truth.

Pushes to branches (not tags) run super-linter over JS/HTML/CSS/JSON/YAML.

## Debugging

Set `window.PES_DEBUG = true` in the page console to enable `debugLog` / `debugWarn` (`src/lib/logger.js`), which surface the scraped input, position weights, playing-style resolution, and conversion detail. They are no-ops otherwise.
