"use strict";

const SOFIFA_TEAM_PLAYER_LINK_SELECTOR = 'a[href*="/player/"]';

/**
 * Fatal error used when SoFIFA explicitly refuses further requests.
 */
class SOFIFATeamBlockedError extends Error {
  /**
   * @param {number} status - HTTP status code.
   * @param {string} url - URL that failed.
   */
  constructor(status, url) {
    super(`SoFIFA returned HTTP ${status} for ${url}`);
    this.name = "SOFIFATeamBlockedError";
  }
}

/**
 * Parser for a SoFIFA team page.
 *
 * Its only responsibility is finding player URLs belonging to the
 * main "Squad" table. The separate "On loan" table is deliberately
 * ignored.
 */
class SOFIFATeam {
  /**
   * @param {Document} doc - Parsed SoFIFA team page.
   */
  constructor(doc) {
    /** @type {Document} */
    this.doc = doc;

    /** @type {string[]} */
    this.playerUrls = this.getPlayerUrls();
  }

  /**
   * Find the table immediately associated with the "Squad" heading.
   *
   * @returns {Element} Squad table.
   */
  getSquadTable() {
    const context = "sofifa-team:squad-table";

    const headings = all(this.doc, "article > h5");

    const squadHeading = headings.find(
      (heading) => (heading.textContent || "").trim() === "Squad",
    );

    if (!squadHeading) {
      throw new ScrapeError('h5 with text "Squad"', context);
    }

    const table = squadHeading.nextElementSibling;

    if (!table || table.tagName.toLowerCase() !== "table") {
      throw new ScrapeError('table following "Squad"', context);
    }

    return table;
  }

  /**
   * Find all player URLs inside the main Squad table.
   *
   * The separate "On loan" table is never inspected.
   *
   * @returns {string[]} Unique absolute player URLs.
   */
  getPlayerUrls() {
    const context = "sofifa-team:players";

    const squadTable = this.getSquadTable();

    const anchors = all(squadTable, SOFIFA_TEAM_PLAYER_LINK_SELECTOR);

    /** @type {string[]} */
    const playerUrls = [];

    for (const anchor of anchors) {
      const href = anchor.getAttribute("href");

      if (!href) {
        continue;
      }

      const url = new URL(href, window.location.origin);

      if (url.origin !== window.location.origin) {
        debugWarn("sofifa-team", "Skipping cross-origin player URL", url.href);

        continue;
      }

      playerUrls.push(url.href);
    }

    const uniqueUrls = [...new Set(playerUrls)];

    if (uniqueUrls.length === 0) {
      throw new ScrapeError(SOFIFA_TEAM_PLAYER_LINK_SELECTOR, context);
    }

    debugLog("sofifa-team", "Squad player URLs", uniqueUrls);

    return uniqueUrls;
  }
}

/**
 * Async delay between SoFIFA player requests.
 *
 * @param {number} milliseconds - Delay duration.
 * @returns {Promise<void>}
 */
function sofifaTeamSleep(milliseconds) {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });
}

/**
 * Download and parse every player belonging to the main SoFIFA Squad table.
 *
 * Requests are sequential and reuse the configured batch request delay.
 *
 * Individual player failures are recorded and skipped. HTTP 403 and 429
 * are considered fatal because continuing would only generate additional
 * refused requests.
 *
 * @param {Document} doc - Parsed team page.
 * @param {(current: number, total: number) => void} onProgress
 *   Progress callback.
 * @returns {Promise<BatchBuildResult>}
 */
async function sofifaBuildTeamPlayers(doc, onProgress) {
  const team = new SOFIFATeam(doc);

  /** @type {Object[]} */
  const players = [];

  /** @type {string[]} */
  const failures = [];

  const parser = new DOMParser();

  const total = team.playerUrls.length;

  const requestDelayMs = await getBatchRequestDelay();

  debugLog("sofifa-team", "batch request delay", requestDelayMs);

  onProgress(0, total);

  for (let i = 0; i < total; i++) {
    const url = team.playerUrls[i];

    try {
      debugLog("sofifa-team", `fetching player ${i + 1}/${total}`, url);

      const response = await fetch(url, {
        credentials: "same-origin",
      });

      if (response.status === 403 || response.status === 429) {
        throw new SOFIFATeamBlockedError(response.status, url);
      }

      if (!response.ok) {
        throw new Error(`HTTP ${response.status} ${response.statusText}`);
      }

      const html = await response.text();

      const playerDocument = parser.parseFromString(html, "text/html");

      // Reuse the exact same scraper used on normal SoFIFA player pages.
      const player = new SOFIFAPlayer(playerDocument);

      players.push(player);
    } catch (error) {
      if (error instanceof SOFIFATeamBlockedError) {
        throw error;
      }

      failures.push(url);

      debugWarn("sofifa-team", `failed player ${i + 1}/${total}`, url, error);
    }

    onProgress(i + 1, total);

    if (i < total - 1) {
      await sofifaTeamSleep(requestDelayMs);
    }
  }

  return {
    items: players,
    failures: failures,
  };
}

window.PESConverter.registerSource({
  id: "sofifa-team",

  converterMethod: "fromFIFA17To23Player",

  supportedFormats: [FORMAT.PES5, FORMAT.PES13, FORMAT.PES21],

  isSupported: function () {
    const isTeamPage = /^\/team\/\d+\/(?:[^/]+\/)?\d+\/?$/.test(
      window.location.pathname,
    );

    return (
      isTeamPage &&
      supportedVersions.includes(sofifaVersion()) &&
      isValidLanguage()
    );
  },

  label: function () {
    if (!isValidLanguage()) {
      return "Please Select English Language";
    }

    if (!supportedVersions.includes(sofifaVersion())) {
      return "FIFA VERSION NOT SUPPORTED";
    }

    return "Add Team to CSV";
  },

  buildMany: function (doc, onProgress) {
    return sofifaBuildTeamPlayers(doc, onProgress);
  },
});
