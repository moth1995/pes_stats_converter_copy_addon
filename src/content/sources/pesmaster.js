"use strict";

/**
 * Scraper for PESMaster eFootball player pages. Reads identity, stats,
 * special skills and positions from the page DOM.
 */
class PESMasterPlayer {
  constructor(doc) {
    this.doc = doc;
    this.GetBasicInfo();
    this.GetStats();
    this.GetSpecialStats();
    this.GetPositions();
  }

  GetBasicInfo() {
    this.name = this.doc.querySelector(
      ".top-header span:not([class])",
    ).textContent;
    this.overall = parseInt(
      this.doc.querySelector(".top-header").querySelector("span").textContent,
    );
    const rows = this.doc
      .querySelector(
        "body > div.main-wrapper > div > div.main-stats-cards-container.container-large.flex.flex-expand > div.player-main-column.player-info-column > table",
      )
      .querySelectorAll("tr");
    var info = {};
    rows.forEach(function (row) {
      let tds = row.querySelectorAll("td");
      var key = tds[0].textContent;
      var value = tds[1].textContent.replace(/[\r\t\n]/gm, "").trim();
      if (key == "Position")
        value = tds[1]
          .querySelector("span")
          .textContent.replace(/[\r\t\n]/gm, "")
          .trim();
      info[key] = value;
    });

    this.info = info;

    debugLog("pesmaster", { name: this.name, info: this.info });
  }

  StatTableToObject(table, dictionary) {
    var rows = table.querySelectorAll("table tr");
    rows.forEach(function (row) {
      var tds = row.querySelectorAll("td");

      // tds[0] is the value, tds[1] is the stat label.
      var value = parseInt(tds[0].textContent);
      var key = tds[1].textContent.replace(/[\r\t\n]/gm, "").trim();

      let attacking = ["Offensive Awareness", "Finishing", "Kicking Power"];
      let dribbling = [
        "Ball Control",
        "Dribbling",
        "Tight Possession",
        "Balance",
      ];
      let defending = [
        "Heading",
        "Jumping",
        "Defensive Awareness",
        "Tackling",
        "Defensive Engagement",
        "Aggression",
      ];
      let passing = ["Low Pass", "Lofted Pass", "Set Piece Taking"];
      let physicality = [
        "Speed",
        "Acceleration",
        "Physical Contact",
        "Stamina",
      ];
      let goalkeeping = [
        "GK Awareness",
        "GK Catching",
        "GK Parrying",
        "GK Reflexes",
        "GK Reach",
      ];

      // Convert from EFootball to PES21/20. Thanks to Mohamed2746, Evoweb user.
      if (attacking.includes(key)) {
        value = LimitStat99(value + value * 0.075);
      } else if (dribbling.includes(key)) {
        value = LimitStat99(value + value * 0.0625);
      } else if (defending.includes(key)) {
        value = LimitStat99(value + value * 0.03);
      } else if (passing.includes(key)) {
        value = LimitStat99(value + value * 0.105);
      } else if (physicality.includes(key)) {
        value = LimitStat99(value + value * 0.065);
      } else if (goalkeeping.includes(key)) {
        value = LimitStat99(value + value * 0.165);
      }

      dictionary[key] = value;
    });
  }

  CharacteristicsTableToObject(table, dictionary) {
    var rows = table.querySelectorAll("table tr");
    rows.forEach(function (row) {
      var tds = row.querySelectorAll("td");
      var key = tds[0].textContent.replace(/[\r\t\n]/gm, "").trim();
      var value = tds[1].textContent.replace(/[\r\t\n]/gm, "").trim();
      dictionary[key] = value;
    });
  }

  GetStats() {
    const statsTables = this.doc
      .querySelector(
        "body > div.main-wrapper > div > div.main-stats-cards-container.container-large.flex.flex-expand > div.flex.flex-column > div.stats-container > div",
      )
      .querySelectorAll("table.player-stats-modern");
    this.stats = {};
    for (let index = 0; index < statsTables.length; index++) {
      this.StatTableToObject(statsTables[index], this.stats);
    }
    const characteristicsTable = this.doc
      .querySelector(
        "body > div.main-wrapper > div > div.main-stats-cards-container.container-large.flex.flex-expand > div.flex.flex-column > div.stats-container > div",
      )
      .querySelector("table.player-info");
    this.CharacteristicsTableToObject(characteristicsTable, this.stats);
    debugLog("pesmaster", "stats", this.stats);
  }

  GetSpecialStats() {
    const lis = this.doc
      .querySelector(
        "body > div.main-wrapper > div > div.main-stats-cards-container.container-large.flex.flex-expand > div.flex.flex-column > div.cards-container.flex.flex-expand",
      )
      .querySelectorAll("li");
    var specialStats = [];
    lis.forEach(function (li) {
      let specialStat = li.textContent.replace(/[\r\t\n]/gm, "").trim();
      specialStats.push(specialStat);
    });
    this.specialStats = specialStats;
    debugLog("pesmaster", "specialStats", this.specialStats);
  }

  GetPositions() {
    var positions = [];
    const rows = this.doc.querySelectorAll("div.player-positions-row");
    rows.forEach(function (row) {
      let positionsElements = row.querySelectorAll("span.pos");
      positionsElements.forEach(function (position) {
        let positionName = position.textContent
          .replace(/[\r\t\n]/gm, "")
          .trim();
        if (parseInt(position.parentElement.getAttribute("class").slice(-1))) {
          positions.push(positionName);
        }
      });
    });
    this.positions = positions;
    debugLog("pesmaster", "positions", this.positions);
  }
}

window.PESConverter.registerSource({
  id: "pesmaster",
  converterMethod: "FromPESMasterPlayer",
  supportedFormats: ["pes5", "pes21"],
  isSupported: function () {
    return document.querySelector("html").getAttribute("lang") === "en-US";
  },
  label: function () {
    if (document.querySelector("html").getAttribute("lang") !== "en-US") {
      return "Please Select English Language";
    }
    return "PES Stats Copy";
  },
  buttonStyle: function (style) {
    // PESMaster is vertically centered rather than bottom-anchored.
    style.top = "50%";
    style.bottom = "auto";
    style.transform = "translateY(-50%)";
  },
  build: function (doc) {
    return new PESMasterPlayer(doc);
  },
});
