"use strict";

// Global JSDoc type definitions for the extension's shared global scope.
//
// The extension is loaded as classic scripts (see src/manifest.json), so every
// top-level binding lives in ONE global scope. jsconfig.json uses
// `"module": "none"` to model exactly that, which means these @typedef shapes
// are visible to every src file by bare name - no `import` needed.
//
// This file has no runtime effect: it is intentionally NOT referenced in
// manifest.json or test/load.js. It exists only for the type checker.

/**
 * Chrome extension API surface (chrome.storage, chrome.tabs, etc.). Declared
 * here so every classic script can reference it by bare name; the real object
 * is provided by the browser at runtime.
 *
 * @type {Object}
 */
var chrome;

/**
 * A content source registered by content/sources/*.js and consumed by
 * content/bootstrap.js.
 *
 * @typedef {Object} SourceDescriptor
 * @property {string} id - Unique source id (e.g. "sofifa").
 * @property {string} converterMethod - Converter entry point to invoke.
 * @property {string[]} supportedFormats - Allowed output formats.
 * @property {function(): boolean} isSupported - Whether the current page is supported.
 * @property {function(): string} label - Floating button label.
 * @property {function(Object): void} [buttonStyle] - Optional button position override.
 * @property {function(Object): Object} build - Build the scraped player from a parsed document.
 */

/**
 * Normalized output of a converter (or a raw scraped object in "raw" mode).
 *
 * @typedef {Object} ConverterResult
 * @property {function(): string} psd - Renders the clipboard/PSD text.
 * @property {(function(): string)|null} csv - Renders the CSV row (null in raw mode).
 */
