"use strict";

const FMINSIDE_TEAM_ROW_SELECTOR =
  "#club-squad tr[data-club-squad-row]:not([hidden])";

const FMINSIDE_TEAM_PLAYER_LINK_SELECTOR =
  'a.club-squad-player[href*="/players/"]';

/**
 * Fatal error used when FMInside explicitly refuses further requests.
 */
class FMInsideTeamBlockedError extends Error {
  /**
   * @param {number} status - HTTP status code.
   * @param {string} url - URL that failed.
   */
  constructor(status, url) {
    super(`FMInside returned HTTP ${status} for ${url}`);
    this.name = "FMInsideTeamBlockedError";
  }
}

/**
 * Parser for a FMInside club page.
 *
 * Its only responsibility is finding the player URLs currently visible
 * in the squad table.
 *
 * FMInside itself controls visibility using the `hidden` attribute,
 * so this parser deliberately ignores hidden rows and therefore respects
 * the current filters selected by the user.
 */
class FMInsideTeam {
  /**
   * @param {Document} doc - Parsed FMInside club page.
   */
  constructor(doc) {
    /** @type {Document} */
    this.doc = doc;

    /** @type {string[]} */
    this.playerUrls = this.getPlayerUrls();
  }

  /**
   * Find all currently visible squad player URLs.
   *
   * @returns {string[]} Unique absolute player URLs.
   */
  getPlayerUrls() {
    const context = "fminside-team:players";

    const squad = requireEl(this.doc, "#club-squad", context);

    const rows = all(squad, FMINSIDE_TEAM_ROW_SELECTOR);

    if (rows.length === 0) {
      throw new ScrapeError(FMINSIDE_TEAM_ROW_SELECTOR, context);
    }

    /** @type {string[]} */
    const playerUrls = [];

    for (const row of rows) {
      const anchor = row.querySelector(FMINSIDE_TEAM_PLAYER_LINK_SELECTOR);

      if (!anchor) {
        debugWarn(
          "fminside-team",
          "Visible squad row without player link",
          row,
        );

        continue;
      }

      const href = anchor.getAttribute("href");

      if (!href) {
        continue;
      }

      const url = new URL(href, window.location.origin);

      // Content-script fetches should stay on the same FMInside origin.
      if (url.origin !== window.location.origin) {
        debugWarn(
          "fminside-team",
          "Skipping cross-origin player URL",
          url.href,
        );

        continue;
      }

      playerUrls.push(url.href);
    }

    const uniqueUrls = [...new Set(playerUrls)];

    if (uniqueUrls.length === 0) {
      throw new ScrapeError(FMINSIDE_TEAM_PLAYER_LINK_SELECTOR, context);
    }

    debugLog("fminside-team", "visible player URLs", uniqueUrls);

    return uniqueUrls;
  }
}

/**
 * Async delay between FMInside player requests.
 *
 * @param {number} milliseconds - Delay duration.
 * @returns {Promise<void>}
 */
function fmInsideTeamSleep(milliseconds) {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });
}

/**
 * Download and parse every currently visible player from a FMInside club.
 *
 * Requests are intentionally sequential and reuse the configured batch
 * request delay.
 *
 * Individual player failures are recorded and skipped. HTTP 403 and 429
 * are considered fatal because continuing would only generate additional
 * refused requests.
 *
 * @param {Document} doc - Parsed FMInside club page.
 * @param {(current: number, total: number) => void} onProgress
 *   Progress callback.
 * @returns {Promise<BatchBuildResult>}
 */
async function fmInsideBuildTeamPlayers(doc, onProgress) {
  const team = new FMInsideTeam(doc);

  /** @type {Object[]} */
  const players = [];

  /** @type {string[]} */
  const failures = [];

  const parser = new DOMParser();

  const total = team.playerUrls.length;

  const requestDelayMs = await getBatchRequestDelay();

  debugLog("fminside-team", "batch request delay", requestDelayMs);

  onProgress(0, total);

  for (let i = 0; i < total; i++) {
    const url = team.playerUrls[i];

    try {
      debugLog("fminside-team", `fetching player ${i + 1}/${total}`, url);

      const response = await fetch(url, {
        credentials: "same-origin",
      });

      if (response.status === 403 || response.status === 429) {
        throw new FMInsideTeamBlockedError(response.status, url);
      }

      if (!response.ok) {
        throw new Error(`HTTP ${response.status} ${response.statusText}`);
      }

      const html = await response.text();

      const playerDocument = parser.parseFromString(html, "text/html");

      // Reuse the exact same scraper used by normal FMInside player pages.
      const player = new FMInsidePlayer(playerDocument);

      players.push(player);
    } catch (error) {
      // Stop immediately if FMInside starts blocking/rate-limiting us.
      if (error instanceof FMInsideTeamBlockedError) {
        throw error;
      }

      failures.push(url);

      debugWarn("fminside-team", `failed player ${i + 1}/${total}`, url, error);
    }

    onProgress(i + 1, total);

    // Do not delay after the final player.
    if (i < total - 1) {
      await fmInsideTeamSleep(requestDelayMs);
    }
  }

  return {
    items: players,
    failures: failures,
  };
}

window.PESConverter.registerSource({
  id: "fminside-team",

  converterMethod: "fromFMPlayer",

  supportedFormats: [FORMAT.PES5, FORMAT.PES13, FORMAT.PES21],

  isSupported: function () {
    return /^\/clubs\/\d+-[^/]+\/\d+-[^/]+\/?$/.test(window.location.pathname);
  },

  label: function () {
    return "Add Team to CSV";
  },

  buildMany: function (doc, onProgress) {
    return fmInsideBuildTeamPlayers(doc, onProgress);
  },
});
