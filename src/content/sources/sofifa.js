"use strict";

/**
 * Scraper for SoFIFA player pages. Reads version, identity, attributes, traits
 * and specialties from the page DOM.
 */
class SOFIFAPlayer {
  /**
   * @param {Document} doc - Parsed SoFIFA player page document.
   */
  constructor(doc) {
    /** @type {Document} */
    this.doc = doc;
    /** @type {string} */
    this.fifaVersion = "";
    /** @type {string[]} */
    this.playerSpecialties = [];
    /** @type {string[]} */
    this.traits = [];
    this.getVersion();
    this.getBasicInfo();
    this.getStats();
  }

  /**
   * Read the selected FIFA version from the page's version dropdown.
   *
   * @returns {void}
   */
  getVersion() {
    const rawSelect = document.querySelector('select[name="version"]');
    if (!rawSelect) {
      this.fifaVersion = "";
      return;
    }
    const selectElement = /** @type {HTMLSelectElement} */ (rawSelect);
    var selectedIndex = Array.from(selectElement.options).findIndex(
      (option) => option.selected,
    );
    var selectedOption = selectElement.options[selectedIndex];
    this.fifaVersion = selectedOption ? selectedOption.text : "";
  }

  /**
   * Scrape the player's identity fields (name, age, height, weight,
   * nationality, positions) from the page DOM.
   *
   * @returns {void}
   */
  getBasicInfo() {
    const nameElement = this.doc.querySelector("h1.ellipsis");
    this.name = nameElement ? nameElement.textContent : "";
    debugLog("sofifa", "name", this.name);

    const metaElement = this.doc.querySelector("div.profile.clearfix > p");
    const lastChild = metaElement ? metaElement.lastChild : null;
    const meta =
      lastChild && lastChild.textContent ? lastChild.textContent.trim() : "";

    const ageRegex = /\d+/;
    const birthdayRegex = /\(.*?\)/;
    const heightRegex = /\d+cm/;
    const weightRegex = /\d+kg/;

    const ageMatch = meta.match(ageRegex);
    this.age = ageMatch ? parseInt(ageMatch[0]) : 0;
    const birthdayMatch = meta.match(birthdayRegex);
    const birthday = birthdayMatch ? birthdayMatch[0].slice(1, -1) : "";
    const heightMatch = meta.match(heightRegex);
    const height = heightMatch ? heightMatch[0] : "";
    const weightMatch = meta.match(weightRegex);
    this.weight = weightMatch ? parseInt(weightMatch[0]) : 0;

    this.birthdayDate = new Date(birthday);
    const heightNumberMatch = height.match(/\d+/);
    this.height = heightNumberMatch ? parseInt(heightNumberMatch[0]) : 0;

    debugLog("sofifa", {
      age: this.age,
      birthday: this.birthdayDate.toDateString(),
      height: this.height,
      weight: this.weight,
    });

    const nationalityImg = this.doc.querySelector(
      "div.profile.clearfix > p > a > img",
    );
    this.nationality = nationalityImg
      ? (nationalityImg.getAttribute("title") ?? "")
      : "";
    debugLog("sofifa", "nationality", this.nationality);

    const spans = this.doc.querySelectorAll(
      "div.profile.clearfix > p > a > span",
    );
    this.positions = Array.from(spans).map((span) => span.textContent);
    this.registeredPosition = this.positions[0];

    debugLog("sofifa", "positions", this.registeredPosition, this.positions);
  }

  /**
   * Parse a group of stat rows into a label -> value map.
   *
   * @param {NodeListOf<Element>} items - The `<p>` stat-row elements.
   * @returns {StatCategory} Map of stat label to value.
   */
  parseStatsItems(items) {
    /** @type {number[]} */
    const values = [];
    /** @type {string[]} */
    const tooltips = [];
    for (let i = 0; i < items.length; i++) {
      const emElement = items[i].querySelector("em");
      const value = emElement ? parseInt(emElement.textContent) : Number.NaN;
      values.push(value);
      const tooltip = items[i].querySelector("span[data-tippy-right-start]");
      // `.pop()` is undefined only for an empty split, which cannot happen —
      // String.split always yields at least one element.
      const textContent =
        tooltip !== null
          ? tooltip.textContent
          : (items[i].textContent.split(" ").pop() ?? "");
      tooltips.push(textContent);
    }
    return Object.fromEntries(tooltips.map((_, i) => [tooltips[i], values[i]]));
  }

  /**
   * Scrape all attribute groups (attacking, skill, movement, etc.) and the
   * profile block (foot, weak foot, skill moves, reputation) from the DOM.
   *
   * @returns {void}
   */
  getStats() {
    const sofifa_stats = this.doc.querySelectorAll("div.col");
    const indexes = new Array(sofifa_stats.length).fill("");
    for (let i = 0; i < sofifa_stats.length; i++) {
      const h5Tags = sofifa_stats[i].querySelectorAll("h5");
      for (let j = 0; j < h5Tags.length; j++) {
        indexes[i] = h5Tags[j].textContent;
      }
    }

    const attackingItems =
      sofifa_stats[indexes.indexOf("Attacking")].querySelectorAll("p");
    this.attacking = this.parseStatsItems(attackingItems);

    const skillItems =
      sofifa_stats[indexes.indexOf("Skill")].querySelectorAll("p");
    this.skill = this.parseStatsItems(skillItems);

    const movementItems =
      sofifa_stats[indexes.indexOf("Movement")].querySelectorAll("p");
    this.movement = this.parseStatsItems(movementItems);

    const powerItems =
      sofifa_stats[indexes.indexOf("Power")].querySelectorAll("p");
    this.power = this.parseStatsItems(powerItems);

    const mentalityItems =
      sofifa_stats[indexes.indexOf("Mentality")].querySelectorAll("p");
    this.mentality = this.parseStatsItems(mentalityItems);

    const defendingItems =
      sofifa_stats[indexes.indexOf("Defending")].querySelectorAll("p");
    this.defending = this.parseStatsItems(defendingItems);

    const goalkeeperItems =
      sofifa_stats[indexes.indexOf("Goalkeeping")].querySelectorAll("p");
    this.goalkeeping = this.parseStatsItems(goalkeeperItems);

    const specialities =
      sofifa_stats[indexes.indexOf("Player specialities")].querySelectorAll(
        "p",
      );
    this.playerSpecialties = [];

    if (specialities && specialities.length !== 0) {
      this.playerSpecialties = Array.from(specialities, (li) => {
        const link = li.querySelector("a");
        return link ? link.textContent.trim().replace("#", "") : "";
      });
    }

    this.traits = [];
    let traits_name = this.fifaVersion.includes("FC") ? "PlayStyles" : "Traits";
    if (indexes.includes(traits_name)) {
      const spans =
        sofifa_stats[indexes.indexOf(traits_name)].querySelectorAll("span");
      if (spans) {
        this.traits = Array.from(spans, (span) => span.textContent);
      }
    }

    const profileDiv = sofifa_stats[indexes.indexOf("Profile")];
    const profileLi = profileDiv ? profileDiv.querySelectorAll("p") : [];

    const footLabel = profileLi[0] ? profileLi[0].querySelector("label") : null;
    const footSibling = footLabel ? footLabel.nextSibling : null;
    this.preferedFoot =
      footSibling && footSibling.textContent
        ? footSibling.textContent.trim()
        : "";
    const weakFootSvg = profileLi[2] ? profileLi[2].querySelector("svg") : null;
    const weakFootSibling = weakFootSvg ? weakFootSvg.previousSibling : null;
    this.weakFoot = weakFootSibling
      ? parseInt(weakFootSibling.textContent || "0")
      : 0;
    const skillMovesSvg = profileLi[1]
      ? profileLi[1].querySelector("svg")
      : null;
    const skillMovesSibling = skillMovesSvg
      ? skillMovesSvg.previousSibling
      : null;
    this.skillMoves = skillMovesSibling
      ? parseInt(skillMovesSibling.textContent || "0")
      : 0;
    const reputationSvg = profileLi[3]
      ? profileLi[3].querySelector("svg")
      : null;
    const reputationSibling = reputationSvg
      ? reputationSvg.previousSibling
      : null;
    this.internationalReputation = reputationSibling
      ? parseInt(reputationSibling.textContent || "0")
      : 0;
    const overallElement = this.doc.querySelector(
      "div.attribute > p:nth-child(2) > em",
    );
    this.overall = overallElement ? parseInt(overallElement.textContent) : 0;

    debugLog("sofifa", {
      attacking: this.attacking,
      skill: this.skill,
      movement: this.movement,
      power: this.power,
      mentality: this.mentality,
      defending: this.defending,
      goalkeeping: this.goalkeeping,
      playerSpecialties: this.playerSpecialties,
      traits: this.traits,
      preferedFoot: this.preferedFoot,
      weakFoot: this.weakFoot,
      skillMoves: this.skillMoves,
      internationalReputation: this.internationalReputation,
      overall: this.overall,
    });
  }
}

/**
 * FIFA versions supported by the scraper.
 *
 * @type {string[]}
 */
const supportedVersions = [
  "FC 26",
  "FC 25",
  "FC 24",
  "FIFA 23",
  "FIFA 22",
  "FIFA 21",
  "FIFA 20",
  "FIFA 19",
  "FIFA 18",
  "FIFA 17",
];

/**
 * Read the currently selected FIFA version label from the page.
 *
 * @returns {string} The selected version text.
 */
function sofifaVersion() {
  const rawSelect = document.querySelector('select[name="version"]');
  if (!rawSelect) {
    return "";
  }
  const selectElement = /** @type {HTMLSelectElement} */ (rawSelect);
  const selectedIndex = Array.from(selectElement.options).findIndex(
    (option) => option.selected,
  );
  const selectedOption = selectElement.options[selectedIndex];
  return selectedOption ? selectedOption.text : "";
}

/**
 * Read the current site language from the language dropdown.
 *
 * @returns {string} The selected language title.
 */
function sofifaLanguage() {
  const dropdown = document.querySelectorAll("details.dropdown.dropdown-br")[1];
  const image = dropdown ? dropdown.querySelector("summary > img") : null;
  return image ? (image.getAttribute("title") ?? "") : "";
}

/**
 *
 * @returns {boolean} True if the current language is valid.
 */
function isValidLanguage() {
  return sofifaLanguage() === "United States";
}

window.PESConverter.registerSource({
  id: "sofifa",
  converterMethod: "fromFIFA17To23Player",
  supportedFormats: ["pes5", "pes13", "pes21"],
  isSupported: function () {
    /**
     * @returns {boolean} True when the page is an English, supported FIFA page.
     */
    return supportedVersions.includes(sofifaVersion()) && isValidLanguage();
  },
  label: function () {
    /**
     * @returns {string} The floating button label.
     */
    if (!isValidLanguage()) {
      return "Please Select English Language";
    }
    if (!supportedVersions.includes(sofifaVersion())) {
      return "FIFA VERSION NOT SUPPORTED";
    }
    return "PES Stats Copy";
  },
  build: function (doc) {
    /**
     * @param {Document} doc - Parsed SoFIFA page document.
     * @returns {SOFIFAPlayer} The scraped player.
     */
    return new SOFIFAPlayer(doc);
  },
});
