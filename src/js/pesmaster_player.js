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
      ".top-header span:not([class])"
    ).textContent;
    this.overall = parseInt(
      this.doc.querySelector(".top-header").querySelector("span").textContent
    );
    const rows = this.doc
      .querySelector(
        "body > div.main-wrapper > div > div.main-stats-cards-container.container-large.flex.flex-expand > div.player-main-column.player-info-column > table"
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

    console.log(this.name, this.info);
  }

  StatTableToObject(table, dictionary) {
    var rows = table.querySelectorAll("table tr");
    rows.forEach(function (row) {
      // Find the <acronym> element within the row
      var tds = row.querySelectorAll("td");

      // Extract the text value from the <acronym> title
      var value = parseInt(tds[0].textContent);

      // Extract the content of the second <td>
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

      // Here we convert from Efootball to PES21/20, Thanks to Mohamed2746, Evoweb user
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

      // Add the key-value pair to the dictionary
      dictionary[key] = value;
    });
  }

  CharacteristicsTableToObject(table, dictionary) {
    var rows = table.querySelectorAll("table tr");
    rows.forEach(function (row) {
      // Find the <acronym> element within the row
      var tds = row.querySelectorAll("td");

      // Extract the text value from the <acronym> title
      var key = tds[0].textContent.replace(/[\r\t\n]/gm, "").trim();

      // Extract the content of the second <td>
      var value = tds[1].textContent.replace(/[\r\t\n]/gm, "").trim();

      // Add the key-value pair to the dictionary
      dictionary[key] = value;
    });
  }

  GetStats() {
    const statsTables = this.doc
      .querySelector(
        "body > div.main-wrapper > div > div.main-stats-cards-container.container-large.flex.flex-expand > div.flex.flex-column > div.stats-container > div"
      )
      .querySelectorAll("table.player-stats-modern");
    this.stats = {};
    for (let index = 0; index < statsTables.length; index++) {
      this.StatTableToObject(statsTables[index], this.stats);
    }
    const characteristicsTable = this.doc
      .querySelector(
        "body > div.main-wrapper > div > div.main-stats-cards-container.container-large.flex.flex-expand > div.flex.flex-column > div.stats-container > div"
      )
      .querySelector("table.player-info");
    this.CharacteristicsTableToObject(characteristicsTable, this.stats);
    console.log(this.stats);
  }

  GetSpecialStats() {
    const lis = this.doc
      .querySelector(
        "body > div.main-wrapper > div > div.main-stats-cards-container.container-large.flex.flex-expand > div.flex.flex-column > div.cards-container.flex.flex-expand"
      )
      .querySelectorAll("li");
    var specialStats = [];
    lis.forEach(function (li) {
      let specialStat = li.textContent.replace(/[\r\t\n]/gm, "").trim();
      specialStats.push(specialStat);
    });
    this.specialStats = specialStats;
    console.log(this.specialStats);
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
    console.log(this.positions);
  }
}

// create button element
function AddButton() {
  const currentUrl = window.location.href;
  const language = document.querySelector("html").getAttribute("lang");
  var button = document.createElement("button");
  button.style.position = "fixed";
  //button.style.bottom = "20px";
  button.style.top = "50%";
  button.style.right = "20px";
  button.style.transform = "translateY(-50%)";

  if (language == "en-US") {
    button.innerHTML = "PES Stats Copy";
    // add event listener to button
    button.addEventListener("click", function () {
      console.log("Button clicked");
      // Send a message to the background script to get the string
      chrome.storage.local.get(
        ["selectOptionFMInside", "selectCopyMode"],
        function (result) {
          const selectedOptionFMInside = result.selectOptionFMInside || "pes5";
          const copyMode = result.selectCopyMode || "one";
          console.log(selectedOptionFMInside);
          console.log(copyMode);

          const parser = new DOMParser();
          const doc = parser.parseFromString(
            document.documentElement.outerHTML,
            "text/html"
          );
          var pesMasterPlayer = new PESMasterPlayer(doc);

          var pesPlayer = null;
          if (selectedOptionFMInside === "pes5") {
            pesPlayer = new PESPlayer();
          } else if (selectedOptionFMInside === "pes21") {
            pesPlayer = new PES21Player();
          } else {
            console.log("Invalid option for convertion");
            return;
          }

          pesPlayer.FromPESMasterPlayer(pesMasterPlayer);

          if (copyMode == "one") {
            var psdString = pesPlayer.PSDString();
            console.log("Received string from background:", psdString);
            CopyToClipboard(psdString);
          } else if (
            copyMode == "multiple" &&
            selectedOptionFMInside == "pes5"
          ) {
            let csvString = pesPlayer.CSVString();
            AddPlayer(csvString);
            return;
          } else if (
            copyMode == "multiple" &&
            selectedOptionFMInside == "pes21"
          ) {
            let csvString = pesPlayer.CSVString();
            AddPlayer21(csvString);
            return;
          } else {
            console.log("Invalid copy mode");
            return;
          }
        }
      );
    });
  } else {
    button.innerHTML = "Please Select English Language";
  }
  // append button to body
  document.body.appendChild(button);
}

AddButton();
