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

function AddButton() {
  const button = document.createElement("button");
  button.style.position = "fixed";
  button.style.bottom = "20px";
  button.style.right = "20px";

  const selectElement = document.getElementsByName("version")[0];
  const selectedIndex = Array.from(selectElement.options).findIndex(
    (option) => option.selected,
  );
  const selectedOption = selectElement.options[selectedIndex];
  const version = selectedOption.text;

  const language = document
    .querySelectorAll("details.dropdown.dropdown-br")[1]
    .querySelector("summary > img")
    .getAttribute("title");

  debugLog("sofifa", "version", version, "language", language);

  if (supportedVersions.includes(version) && language == "United States") {
    button.innerHTML = "PES Stats Copy";
    button.addEventListener("click", function () {
      debugLog("sofifa", "button clicked");

      chrome.storage.local.get(
        ["selectOptionFMInside", "selectCopyMode"],
        function (result) {
          const selectedOptionFMInside = result.selectOptionFMInside || "pes5";
          const copyMode = result.selectCopyMode || "one";

          debugLog("sofifa", "settings", {
            format: selectedOptionFMInside,
            copyMode,
          });

          const parser = new DOMParser();
          const doc = parser.parseFromString(
            document.documentElement.outerHTML,
            "text/html",
          );
          var sofifaPlayer = new SOFIFAPlayer(doc);

          var pesPlayer = null;
          if (selectedOptionFMInside === "pes5") {
            pesPlayer = new PESPlayer();
          } else if (selectedOptionFMInside === "pes21") {
            pesPlayer = new PES21Player();
          } else if (selectedOptionFMInside === "pes13") {
            pesPlayer = new PES13Player();
          } else {
            debugWarn("sofifa", "invalid option", selectedOptionFMInside);
            return;
          }

          pesPlayer.FromFIFA17To23Player(sofifaPlayer);

          if (copyMode == "one") {
            var psdString = pesPlayer.PSDString();
            debugLog("sofifa", "psd", psdString);
            CopyToClipboard(psdString);
          } else if (
            copyMode == "multiple" &&
            selectedOptionFMInside == "pes5"
          ) {
            AddPlayer(pesPlayer.CSVString());
            return;
          } else if (
            copyMode == "multiple" &&
            selectedOptionFMInside == "pes13"
          ) {
            AddPlayer13(pesPlayer.CSVString());
            return;
          } else if (
            copyMode == "multiple" &&
            selectedOptionFMInside == "pes21"
          ) {
            AddPlayer21(pesPlayer.CSVString());
            return;
          } else {
            debugWarn("sofifa", "invalid copy mode", copyMode);
            return;
          }
        },
      );
    });
  } else if (language != "United States") {
    button.innerHTML = "Please Select English Language";
  } else {
    button.innerHTML = "FIFA VERSION NOT SUPPORTED";
  }

  document.body.appendChild(button);
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

AddButton();
