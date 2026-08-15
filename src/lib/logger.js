"use strict";

// Namespaced debug logger. All verbose output funnels through these helpers so
// it is silent by default and can be enabled on demand from the browser console
// by setting `window.PES_DEBUG = true`.

/**
 * Log a debug message under a tagged namespace. No-op unless `window.PES_DEBUG`
 * is truthy.
 *
 * @param {string} tag - Namespace label (e.g. "sofifa", "pes21:fm").
 * @param {...*} args - Values to log.
 */
function debugLog(tag, ...args) {
  if (window.PES_DEBUG) {
    console.log("[pes:" + tag + "]", ...args);
  }
}

/**
 * Log a warning under a tagged namespace. No-op unless `window.PES_DEBUG` is
 * truthy.
 *
 * @param {string} tag - Namespace label (e.g. "bootstrap").
 * @param {...*} args - Values to log.
 */
function debugWarn(tag, ...args) {
  if (window.PES_DEBUG) {
    console.warn("[pes:" + tag + "]", ...args);
  }
}
