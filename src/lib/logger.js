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
 * @returns {void}
 */
function debugLog(tag, ...args) {
  if (window.PES_DEBUG) {
    console.log("[pes:" + tag + "]", ...args);
  }
}

/**
 * Log a warning under a tagged namespace. Unlike `debugLog` this is NOT gated
 * by `window.PES_DEBUG`: warnings always reach the console.
 *
 * @param {string} tag - Namespace label (e.g. "bootstrap").
 * @param {...*} args - Values to log.
 * @returns {void}
 */
function debugWarn(tag, ...args) {
  console.warn("[pes:" + tag + "]", ...args);
}
