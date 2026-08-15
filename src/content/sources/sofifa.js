"use strict";

class SOFIFAPlayer {
  constructor(doc) {
    this.doc = doc;
    this.GetVersion();
    this.GetBasicInfo();
    this.GetStats();
  }

  GetVersion() {
    var selectElement = document.getElementsByName("version")[0];
    var selectedIndex = Array.from(selectElement.options).findIndex(
      (option) => option.selected,
    );
    var selectedOption = selectElement.options[selectedIndex];
    this.FIFAVersion = selectedOption.text;
  }

  GetBasicInfo() {
    this.name = this.doc.querySelector("h1.ellipsis").textContent;
    debugLog("sofifa", "name", this.name);

    const meta = this.doc
      .querySelector("div.profile.clearfix > p")
      .lastChild.textContent.trim();

    const ageRegex = /\d+/;
    const birthdayRegex = /\(.*?\)/;
    const heightRegex = /\d+cm/;
    const weightRegex = /\d+kg/;

    this.age = parseInt(meta.match(ageRegex)[0]);
    const birthday = meta.match(birthdayRegex)[0].slice(1, -1);
    const height = meta.match(heightRegex)[0];
    this.weight = parseInt(meta.match(weightRegex)[0]);

    this.birthdayDate = new Date(birthday);
    this.height = parseInt(height.match(/\d+/)[0]);

    debugLog("sofifa", {
      age: this.age,
      birthday: this.birthdayDate.toDateString(),
      height: this.height,
      weight: this.weight,
    });

    this.nationality = this.doc
      .querySelector("div.profile.clearfix > p > a > img")
      .getAttribute("title");
    debugLog("sofifa", "nationality", this.nationality);

    const spans = this.doc.querySelectorAll(
      "div.profile.clearfix > p > a > span",
    );
    this.posiciones = Array.from(spans).map((span) => span.textContent);
    this.posicionReg = this.posiciones[0];

    debugLog("sofifa", "positions", this.posicionReg, this.posiciones);
  }

  parseStatsItems(items) {
    const values = [];
    const tooltips = [];
    for (let i = 0; i < items.length; i++) {
      const value = parseInt(items[i].querySelector("em").textContent);
      values.push(value);
      const tooltip = items[i].querySelector("span[data-tippy-right-start]");
      const textContent =
        tooltip !== null
          ? tooltip.textContent
          : items[i].textContent.split(" ").pop();
      tooltips.push(textContent);
    }
    return Object.fromEntries(tooltips.map((_, i) => [tooltips[i], values[i]]));
  }

  GetStats() {
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
      this.playerSpecialties = Array.from(specialities, (li) =>
        li.querySelector("a").textContent.trim().replace("#", ""),
      );
    }

    this.traits = [];
    let traits_name = this.FIFAVersion.includes("FC") ? "PlayStyles" : "Traits";
    if (indexes.includes(traits_name)) {
      const spans =
        sofifa_stats[indexes.indexOf(traits_name)].querySelectorAll("span");
      if (spans) {
        this.traits = Array.from(spans, (span) => span.textContent);
      }
    }

    const profileLi =
      sofifa_stats[indexes.indexOf("Profile")].querySelectorAll("p");

    this.preferedFoot = profileLi[0]
      .querySelector("label")
      .nextSibling.textContent.trim();
    this.weakFoot = parseInt(
      profileLi[2].querySelector("svg").previousSibling.textContent,
    );
    this.skillMoves = parseInt(
      profileLi[1].querySelector("svg").previousSibling.textContent,
    );
    this.internationalReputation = parseInt(
      profileLi[3].querySelector("svg").previousSibling.textContent,
    );
    this.overall = parseInt(
      this.doc.querySelector("div.attribute > p:nth-child(2) > em").textContent,
    );

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

function sofifaVersion() {
  const selectElement = document.getElementsByName("version")[0];
  const selectedIndex = Array.from(selectElement.options).findIndex(
    (option) => option.selected,
  );
  return selectElement.options[selectedIndex].text;
}

function sofifaLanguage() {
  return document
    .querySelectorAll("details.dropdown.dropdown-br")[1]
    .querySelector("summary > img")
    .getAttribute("title");
}

window.PESConverter.registerSource({
  id: "sofifa",
  converterMethod: "FromFIFA17To23Player",
  supportedFormats: ["pes5", "pes13", "pes21"],
  isSupported: function () {
    return (
      supportedVersions.includes(sofifaVersion()) &&
      sofifaLanguage() === "United States"
    );
  },
  label: function () {
    if (sofifaLanguage() !== "United States") {
      return "Please Select English Language";
    }
    if (!supportedVersions.includes(sofifaVersion())) {
      return "FIFA VERSION NOT SUPPORTED";
    }
    return "PES Stats Copy";
  },
  build: function (doc) {
    return new SOFIFAPlayer(doc);
  },
});
