"use strict";

/**
 * Scraper for FMInside player pages. Reads identity, ability/potential,
 * position types, attributes and roles from the page DOM.
 */
class FMInsidePlayer {
  /**
   * @param {Document} doc - Parsed FMInside player page document.
   */
  constructor(doc) {
    /** @type {Document} */
    this.doc = doc;
    /** @type {string} */
    this.name = "";
    /** @type {string} */
    this.nationality = "";
    /** @type {string|null} */
    this.ability = null;
    /** @type {string|null} */
    this.potential = null;
    /** @type {FmInfoMap} */
    this.info = /** @type {FmInfoMap} */ ({});
    /** @type {FmStatMap} */
    this.stats = /** @type {FmStatMap} */ ({});
    /** @type {Record<string, number>} */
    this.roles = {};
    /** @type {string[]} */
    this.positionType = [];

    this.getBasicInfo();
    this.getStats();
    this.getRoles();
  }

  /**
   * Scrape the player's identity fields (name, ability, potential,
   * nationality, info, position types) from the page DOM.
   *
   * @returns {void}
   */
  getBasicInfo() {
    const element = this.doc.querySelector("#player_info #player .title p");

    if (!element) {
      throw new Error("Player title element not found");
    }

    this.name = element.getAttribute("title") ?? "";
    const metaElement = this.doc.querySelector("#player_info .meta");
    const ratingSpans = metaElement
      ? metaElement.querySelectorAll(".card")
      : [];
    this.ability = ratingSpans[0] ? ratingSpans[0].textContent.trim() : null;
    this.potential = ratingSpans[1] ? ratingSpans[1].textContent.trim() : null;
    if (!this.potential) {
      // Special case for when potential is variable, we use the same as
      // ability as there's no way to calculate it.
      this.potential = this.ability;
    }

    const infoDiv = this.doc.querySelector("div#player_info");
    const columnDiv = infoDiv ? infoDiv.querySelector("div.column") : null;
    const lis = columnDiv ? columnDiv.querySelectorAll("li") : [];
    const nationalityElement = this.doc.querySelector(
      "span.value:nth-child(1) > a:nth-child(1)",
    );
    this.nationality = nationalityElement ? nationalityElement.textContent : "";

    /**
     * @type {Record<string, string>} info - Identity fields (Age, Foot, Positions, etc.).
     */
    var info = {};
    /** @type {string[]} */
    var positionType = [];
    /**
     * @param {Element} li - The info row element.
     * @returns {void}
     */
    lis.forEach(function (li) {
      var keyElement = li.querySelector("span.key");
      var key = keyElement
        ? keyElement.textContent.replace(":", "").trim()
        : "";
      var valueElement = li.querySelector("span.value");
      var value = "";
      const positionsEl = valueElement
        ? valueElement.querySelector("span.player_positions")
        : null;
      if (positionsEl) {
        value = positionsEl.textContent || "";
        for (const span of all(positionsEl, "span")) {
          positionType.push(span.getAttribute("title") ?? "");
        }
      } else if (valueElement) {
        value = valueElement.textContent;
      }
      info[key] = value;
    });
    this.positionType = positionType;

    // Best way to handle the new changes on the website.
    if ("Left foot" in info && "Right foot" in info && !("Foot" in info)) {
      if (parseInt(info["Left foot"]) > parseInt(info["Right foot"])) {
        info["Foot"] = "Left";
      } else {
        info["Foot"] = "Right";
      }
    }

    // Temporary fallback while the site omits weight.
    if (!("Weight" in info)) {
      info["Weight"] = "75 kg";
    }

    this.info = /** @type {FmInfoMap} */ (info);

    debugLog("fminside", {
      name: this.name,
      ability: this.ability,
      potential: this.potential,
      nationality: this.nationality,
      positionType: this.positionType,
      info: this.info,
    });
  }

  /**
   * Extract attribute values from the stats table into a label -> value map.
   *
   * @returns {StatCategory} Map of FM stat label to value.
   */
  statToObject() {
    /** @type {StatCategory} */
    var dictionary = {};
    var rows = this.doc.querySelectorAll("table tr");
    /**
     * @param {HTMLTableRowElement} row - The table row element.
     * @returns {void}
     */
    rows.forEach(function (row) {
      var acronymElement = row.querySelector("acronym");
      var tdElement = row.querySelector(".stat");

      // Some rows (headers, group labels) have no acronym or stat cell.
      if (!acronymElement || !tdElement) {
        return;
      }

      /** @type {number} */
      var value = 0;
      var key = acronymElement.textContent;
      for (let j = 0; j < tdElement.classList.length; j++) {
        const className = tdElement.classList[j];
        if (className.startsWith("value_")) {
          value = parseInt(className.split("_")[1], 10);
          break;
        }
      }
      if (isNaN(value) || value === null || value === undefined) {
        value = 1;
      }

      dictionary[key] = value;
    });
    return dictionary;
  }

  /**
   * Scrape all attribute stats into `this.stats`.
   *
   * @returns {void}
   */
  getStats() {
    this.stats = /** @type {FmStatMap} */ (this.statToObject());
    debugLog("fminside", "stats", this.stats);
  }

  /**
   * Scrape best-suitable-role -> suitability into `this.roles`.
   *
   * @returns {void}
   */
  getRoles() {
    /** @type {Record<string, number>} */
    var roles = {};
    try {
      const rolesSection = this.doc.querySelector("#player > div:nth-child(4)");
      const rolesOl = rolesSection ? rolesSection.querySelector("ol") : null;
      const rolesLis = rolesOl ? rolesOl.querySelectorAll("li:not(.last)") : [];
      /**
       * @param {Element} li - The role list item element.
       * @returns {void}
       */
      rolesLis.forEach(function (li) {
        var keyElement = li.querySelector("span.key");
        var valueElement = li.querySelector("span.value");
        if (!keyElement || !valueElement) {
          return;
        }
        var key = keyElement.textContent;
        var value = valueElement.textContent;
        roles[key] = parseFloat(value);
      });
    } catch (err) {
      /**
       * @param {Error} err - The parsing error.
       */
      debugWarn("fminside", "no roles found", err);
    }
    this.roles = /** @type {Record<string, number>} */ (roles);
    debugLog("fminside", "roles", this.roles);
  }

  /**
   * No-op entry point for the raw FMInside format.
   *
   * @param {FMPlayer} _fmPlayer - The scraped FM player (ignored).
   * @returns {void}
   */
  fromFMPlayer(_fmPlayer) {
    // Method just added to prevent crash when raw option is selected.
  }

  /**
   * No-op.
   *
   * @returns {string}
   */
  csvString() {
    // Method just added to prevent crash when raw option is selected.
    debugWarn("fminside", "csvString() not supported for FMInside source");
    return "";
  }

  /**
   * Render the raw scraped player as PSD text.
   *
   * @returns {string} The PSD-formatted player dump.
   */
  psdString() {
    let defaultValue = 1;
    return `Name: ${this.info[FM_INFO.NAME]}
Nationality: ${
      this.nationality && this.nationality in pesIndieNationalities
        ? pesIndieNationalities[this.nationality]
        : "Free Nationality"
    }
Age: ${parseInt(this.info[FM_INFO.AGE])}
Current Ability: ${this.ability}
Potential: ${this.potential}
Position: ${fmPositionStringToArray(this.info[FM_INFO.POSITIONS])}
Foot: ${this.info[FM_INFO.FOOT] == "Left" ? "L" : "R"}

APPEARANCE:
Height: ${parseInt(this.info[FM_INFO.HEIGHT])} cm
Weight: ${parseInt(this.info[FM_INFO.WEIGHT])} kg

Technical Attributes
Corners ${
      typeof this.stats[FM_STAT.CORNERS] !== "undefined"
        ? this.stats[FM_STAT.CORNERS]
        : defaultValue
    }
Crossing ${
      typeof this.stats[FM_STAT.CROSSING] !== "undefined"
        ? this.stats[FM_STAT.CROSSING]
        : defaultValue
    }
Dribbling ${
      typeof this.stats[FM_STAT.DRIBBLING] !== "undefined"
        ? this.stats[FM_STAT.DRIBBLING]
        : defaultValue
    }
Finishing ${
      typeof this.stats[FM_STAT.FINISHING] !== "undefined"
        ? this.stats[FM_STAT.FINISHING]
        : defaultValue
    }
First Touch ${this.stats[FM_STAT.FIRST_TOUCH]}
Free Kick Taking ${this.stats[FM_STAT.FREE_KICK_TAKING]}
Heading ${
      typeof this.stats[FM_STAT.HEADING] !== "undefined"
        ? this.stats[FM_STAT.HEADING]
        : defaultValue
    }
Long Shots ${
      typeof this.stats[FM_STAT.LONG_SHOTS] !== "undefined"
        ? this.stats[FM_STAT.LONG_SHOTS]
        : defaultValue
    }
Long Throws ${
      typeof this.stats[FM_STAT.LONG_THROWS] !== "undefined"
        ? this.stats[FM_STAT.LONG_THROWS]
        : defaultValue
    }
Marking ${
      typeof this.stats[FM_STAT.MARKING] !== "undefined"
        ? this.stats[FM_STAT.MARKING]
        : defaultValue
    }
Passing ${this.stats[FM_STAT.PASSING]}
Penalty Taking ${this.stats[FM_STAT.PENALTY_TAKING]}
Tackling ${
      typeof this.stats[FM_STAT.TACKLING] !== "undefined"
        ? this.stats[FM_STAT.TACKLING]
        : defaultValue
    }
Technique ${this.stats[FM_STAT.TECHNIQUE]}

Mental Attributes
Aggression ${this.stats[FM_STAT.AGGRESSION]}
Anticipation ${this.stats[FM_STAT.ANTICIPATION]}
Bravery ${this.stats[FM_STAT.BRAVERY]}
Composure ${this.stats[FM_STAT.COMPOSURE]}
Concentration ${this.stats[FM_STAT.CONCENTRATION]}
Decisions ${this.stats[FM_STAT.DECISIONS]}
Determination ${this.stats[FM_STAT.DETERMINATION]}
Flair ${this.stats[FM_STAT.FLAIR]}
Leadership ${this.stats[FM_STAT.LEADERSHIP]}
Off the Ball ${this.stats[FM_STAT.OFF_THE_BALL]}
Positioning ${this.stats[FM_STAT.POSITIONING]}
Teamwork ${this.stats[FM_STAT.TEAMWORK]}
Vision ${this.stats[FM_STAT.VISION]}
Work Rate ${this.stats[FM_STAT.WORK_RATE]}

Physical Attributes
Acceleration ${this.stats[FM_STAT.ACCELERATION]}
Agility ${this.stats[FM_STAT.AGILITY]}
Balance ${this.stats[FM_STAT.BALANCE]}
Jumping Reach ${this.stats[FM_STAT.JUMPING_REACH]}
Natural Fitness ${this.stats[FM_STAT.NATURAL_FITNESS]}
Pace ${this.stats[FM_STAT.PACE]}
Stamina ${this.stats[FM_STAT.STAMINA]}
Strength ${this.stats[FM_STAT.STRENGTH]}

Goalkeeping Attributes
Aerial Reach ${
      typeof this.stats[FM_STAT.AERIAL_REACH] !== "undefined"
        ? this.stats[FM_STAT.AERIAL_REACH]
        : defaultValue
    }
Command of Area ${
      typeof this.stats[FM_STAT.COMMAND_OF_AREA] !== "undefined"
        ? this.stats[FM_STAT.COMMAND_OF_AREA]
        : defaultValue
    }
Communication ${
      typeof this.stats[FM_STAT.COMMUNICATION] !== "undefined"
        ? this.stats[FM_STAT.COMMUNICATION]
        : defaultValue
    }
Eccentricity ${
      typeof this.stats[FM_STAT.ECCENTRICITY] !== "undefined"
        ? this.stats[FM_STAT.ECCENTRICITY]
        : defaultValue
    }
Handling ${
      typeof this.stats[FM_STAT.HANDLING] !== "undefined"
        ? this.stats[FM_STAT.HANDLING]
        : defaultValue
    }
Kicking ${
      typeof this.stats[FM_STAT.KICKING] !== "undefined"
        ? this.stats[FM_STAT.KICKING]
        : defaultValue
    }
One on Ones ${
      typeof this.stats[FM_STAT.ONE_ON_ONES] !== "undefined"
        ? this.stats[FM_STAT.ONE_ON_ONES]
        : defaultValue
    }
Punching (Tendency) ${
      typeof this.stats[FM_STAT.PUNCHING_TENDENCY] !== "undefined"
        ? this.stats[FM_STAT.PUNCHING_TENDENCY]
        : defaultValue
    }
Reflexes ${
      typeof this.stats[FM_STAT.REFLEXES] !== "undefined"
        ? this.stats[FM_STAT.REFLEXES]
        : defaultValue
    }
Rushing Out (Tendency) ${
      typeof this.stats[FM_STAT.RUSHING_OUT_TENDENCY] !== "undefined"
        ? this.stats[FM_STAT.RUSHING_OUT_TENDENCY]
        : defaultValue
    }
Throwing ${
      typeof this.stats[FM_STAT.THROWING] !== "undefined"
        ? this.stats[FM_STAT.THROWING]
        : defaultValue
    }
`;
  }
}

window.PESConverter.registerSource({
  id: "fminside",
  converterMethod: "fromFMPlayer",
  supportedFormats: ["pes5", "pes13", "pes21", "raw"],
  isSupported: function () {
    /**
     * @returns {boolean} True if inside a player page.
     */
    return /^\/players\/\d+-[^/]+\/\d+-[^/]+\/?$/.test(
      window.location.pathname,
    );
  },
  label: function () {
    /**
     * @returns {string} The floating button label.
     */
    return "PES Stats Copy";
  },
  build: function (doc) {
    /**
     * @param {Document} doc - Parsed FMInside page document.
     * @returns {FMInsidePlayer} The scraped player.
     */
    return new FMInsidePlayer(doc);
  },
});
