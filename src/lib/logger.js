"use strict";

// Namespaced debug logger. All verbose output funnels through these helpers so
// it is silent by default and can be enabled on demand from the browser console
// by setting `window.PES_DEBUG = true`.

function debugLog(tag, ...args) {
  if (window.PES_DEBUG) {
    console.log("[pes:" + tag + "]", ...args);
  }
}

function debugWarn(tag, ...args) {
  if (window.PES_DEBUG) {
    console.warn("[pes:" + tag + "]", ...args);
  }
}
