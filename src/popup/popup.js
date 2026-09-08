"use strict";

document.addEventListener("DOMContentLoaded", function () {
  // Gets the select element
  const select = /** @type {HTMLSelectElement} */ (
    document.getElementById("select-option-fm-inside")
  );
  console.log("Select element found:", select);

  if (!select) {
    return;
  }

  // Gets the saved option from the global variable (if it exists)
  chrome.storage.local.get(
    ["selectOptionFMInside"],
    /** @param {PESStorageData} result */ function (result) {
      // Fall back to the default format when nothing has been saved yet.
      const selectedOption = result.selectOptionFMInside || FORMAT.PES5;

      // Sets the selected option in the select
      select.value = selectedOption;
    },
  );

  // Handles the select change event
  select.addEventListener("change", function () {
    let selectedValue = select.value;
    // Saves the selected option to local storage
    chrome.storage.local.set(
      { selectOptionFMInside: selectedValue },
      function () {
        console.log("Value saved to local storage, new value:" + selectedValue);
      },
    );
  });

  const sCopyMode = /** @type {HTMLSelectElement} */ (
    document.getElementById("select-copy-mode")
  );
  console.log("Select element found:", sCopyMode);

  if (!sCopyMode) {
    return;
  }

  sCopyMode.addEventListener("change", function () {
    let selectValue = sCopyMode.value;
    // Saves the selected option to local storage
    chrome.storage.local.set({ selectCopyMode: selectValue }, function () {
      console.log("Value saved to local storage, new value:" + selectValue);
    });
  });

  chrome.storage.local.get(
    ["selectCopyMode"],
    /** @param {PESStorageData} result */ function (result) {
      // Fall back to the default copy mode when nothing has been saved yet.
      const selectedOption = result.selectCopyMode || COPY_MODE.ONE;

      // Sets the selected option in the select
      sCopyMode.value = selectedOption;
    },
  );

  // Floating button position: persisted in storage, default "" (site's own
  // default layout, e.g. PESMaster's middle-right).
  const selectButtonPosition = /** @type {HTMLSelectElement} */ (
    document.getElementById("select-button-position")
  );

  if (selectButtonPosition) {
    chrome.storage.local.get(
      ["selectButtonPosition"],
      /** @param {PESStorageData} result */ function (result) {
        selectButtonPosition.value = result.selectButtonPosition || "";
      },
    );

    selectButtonPosition.addEventListener("change", function () {
      const selectedValue = selectButtonPosition.value;

      if (!selectedValue) {
        // "Auto" - fall back to the site's default position.
        chrome.storage.local.remove(["selectButtonPosition"]);
        return;
      }

      chrome.storage.local.set({ selectButtonPosition: selectedValue });
    });
  }

  // Debug logging toggle: persisted in storage, default false.
  const debugEnabledCheckbox = /** @type {HTMLInputElement} */ (
    document.getElementById("debug-enabled")
  );

  if (!debugEnabledCheckbox) {
    return;
  }

  chrome.storage.local.get(
    ["debugEnabled"],
    /** @param {PESStorageData} result */ function (result) {
      // Fall back to the default (false) when nothing has been saved yet.
      debugEnabledCheckbox.checked = result.debugEnabled === true;
    },
  );

  debugEnabledCheckbox.addEventListener("change", function () {
    const checked = debugEnabledCheckbox.checked;
    chrome.storage.local.set({ debugEnabled: checked }, function () {
      console.log("Value saved to local storage, new value:" + checked);
    });
  });
  // Delay between requests made by batch importers.
  //
  // The UI uses seconds for readability while storage uses milliseconds.
  const batchRequestDelayInput = /** @type {HTMLInputElement|null} */ (
    document.getElementById("batch-request-delay")
  );

  if (batchRequestDelayInput) {
    const defaultDelaySeconds = Number.parseFloat(
      batchRequestDelayInput.defaultValue,
    );

    const minDelaySeconds = Number.parseFloat(batchRequestDelayInput.min);

    const maxDelaySeconds = Number.parseFloat(batchRequestDelayInput.max);

    /**
     * Clamp a user-provided delay to the limits declared by the input.
     *
     * @param {number} seconds - Requested delay in seconds.
     * @returns {number} Normalized delay in seconds.
     */
    function normalizeBatchRequestDelay(seconds) {
      if (!Number.isFinite(seconds)) {
        return defaultDelaySeconds;
      }

      return Math.min(maxDelaySeconds, Math.max(minDelaySeconds, seconds));
    }

    chrome.storage.local.get(
      ["batchRequestDelayMs"],

      /** @param {PESStorageData} result */
      function (result) {
        const storedDelayMs = result.batchRequestDelayMs;

        const delaySeconds =
          typeof storedDelayMs === "number"
            ? storedDelayMs / 1000
            : defaultDelaySeconds;

        batchRequestDelayInput.value = String(
          normalizeBatchRequestDelay(delaySeconds),
        );
      },
    );

    batchRequestDelayInput.addEventListener("change", function () {
      const requestedSeconds = Number.parseFloat(batchRequestDelayInput.value);

      const delaySeconds = normalizeBatchRequestDelay(requestedSeconds);

      batchRequestDelayInput.value = String(delaySeconds);

      chrome.storage.local.set(
        {
          batchRequestDelayMs: Math.round(delaySeconds * 1000),
        },
        function () {
          console.log("Batch request delay saved:", delaySeconds, "seconds");
        },
      );
    });
  }
});

document.addEventListener("DOMContentLoaded", function () {
  const tabs = document.querySelectorAll(".tab");
  const tabButtons = document.querySelectorAll(".tab-button");
  tabButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      const targetTab = button.getAttribute("data-tab");
      console.log(targetTab);
      tabs.forEach(function (tab) {
        console.log(tab.id);
        if (tab.id === targetTab) {
          tab.classList.add("active");
        } else {
          tab.classList.remove("active");
        }
      });
      tabButtons.forEach(function (otherButton) {
        otherButton.classList.toggle("active", otherButton === button);
      });
    });
  });
});

/**
 * Maps a page URL's hostname to the site key used for popup theming.
 *
 * @param {string|undefined} url
 * @returns {"sofifa"|"fminside"|"pesmaster"|null}
 */
function detectSiteFromUrl(url) {
  if (!url) {
    return null;
  }

  let hostname;
  try {
    hostname = new URL(url).hostname;
  } catch {
    return null;
  }

  if (hostname === "sofifa.com" || hostname.endsWith(".sofifa.com")) {
    return "sofifa";
  }
  if (hostname === "fminside.net" || hostname.endsWith(".fminside.net")) {
    return "fminside";
  }
  if (hostname === "pesmaster.com" || hostname.endsWith(".pesmaster.com")) {
    return "pesmaster";
  }

  return null;
}

/**
 * Applies the popup theme matching the detected site, so the popup echoes
 * the look of whichever supported site the active tab is on.
 *
 * @param {"sofifa"|"fminside"|"pesmaster"|null} site
 */
function applySiteTheme(site) {
  if (site) {
    document.documentElement.setAttribute("data-site", site);
  } else {
    document.documentElement.removeAttribute("data-site");
  }
}

document.addEventListener("DOMContentLoaded", function () {
  if (typeof chrome !== "undefined" && chrome.tabs && chrome.tabs.query) {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const activeTab = tabs[0];
      applySiteTheme(detectSiteFromUrl(activeTab && activeTab.url));
    });
  } else {
    applySiteTheme(null);
  }
});

document.addEventListener("DOMContentLoaded", function () {
  /** @type {HTMLElement|null} */
  var redirectButton = document.getElementById("evoweb-button");
  if (redirectButton) {
    redirectButton.addEventListener("click", function () {
      if (typeof chrome !== "undefined" && chrome.tabs && chrome.tabs.create) {
        // Desktop browsers
        chrome.tabs.create({ url: "https://evoweb.uk/threads/94290" });
      } else {
        // Mobile browsers (e.g., Kiwi Browser, Yandex Browser)
        window.open("https://evoweb.uk/threads/94290", "_blank");
      }
    });
  }
});

document.addEventListener("DOMContentLoaded", function () {
  /** @type {HTMLElement|null} */
  var redirectButton = document.getElementById("privacy-button");
  if (redirectButton) {
    redirectButton.addEventListener("click", function () {
      if (typeof chrome !== "undefined" && chrome.tabs && chrome.tabs.create) {
        // Desktop browsers
        chrome.tabs.create({ url: "policy_privacy.html" });
      } else {
        // Mobile browsers (e.g., Kiwi Browser, Yandex Browser)
        window.open("policy_privacy.html", "_blank");
      }
    });
  }
});

document.addEventListener("DOMContentLoaded", function () {
  /** @type {HTMLElement|null} */
  const downloadCSVButton = document.getElementById("download-csv");
  /** @type {HTMLElement|null} */
  const clearPlayersButton = document.getElementById("clear-players");
  /** @type {HTMLElement|null} */
  const removeLastPlayerButton = document.getElementById("remove-last-player");

  if (downloadCSVButton) {
    downloadCSVButton.addEventListener("click", function () {
      downloadCsv();
    });
  }
  if (clearPlayersButton) {
    clearPlayersButton.addEventListener("click", function () {
      clearPlayers();
    });
  }
  if (removeLastPlayerButton) {
    removeLastPlayerButton.addEventListener("click", function () {
      removeLastPlayer();
    });
  }
});

function downloadCsv() {
  chrome.storage.local.get(
    ["playersData", "players13Data", "players21Data", "selectOptionFMInside"],
    /** @param {PESStorageData} result */ function (result) {
      let playersData = result.playersData || [];
      let players13Data = result.players13Data || [];
      let players21Data = result.players21Data || [];
      let selectOptionFMInside = result.selectOptionFMInside || FORMAT.PES5;

      let encoding = "utf-8";
      let csvString = "";
      if (selectOptionFMInside === FORMAT.PES5) {
        csvString = playersData.join("\n");
      } else if (selectOptionFMInside === FORMAT.PES13) {
        csvString = players13Data.join("\n");
        encoding = "windows-1252";
      } else if (selectOptionFMInside === FORMAT.PES21) {
        csvString = players21Data.join("\n");
      } else {
        alert("Unsupported option for " + selectOptionFMInside);
        return;
      }

      let blob;
      if (encoding === "windows-1252") {
        // Encode the characters (Latin-1 compatible) to bytes so the declared
        // windows-1252 charset matches the actual bytes. The previous data-URI +
        // encodeURI approach emitted UTF-8 bytes while claiming windows-1252,
        // garbling accented letters like ñ/Á. Characters above 0xFF are lossy.
        const bytes = new Uint8Array(csvString.length);
        for (let i = 0; i < csvString.length; i++) {
          const code = csvString.charCodeAt(i);
          bytes[i] = code <= 0xff ? code : 0x3f;
        }
        blob = new Blob([bytes], { type: "text/csv;charset=windows-1252" });
      } else {
        blob = new Blob([csvString], { type: "text/csv;charset=utf-8" });
      }

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", "Players.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      console.log(csvString);
    },
  );
}

function clearPlayers() {
  chrome.storage.local.get(
    ["playersData", "players13Data", "players21Data", "selectOptionFMInside"],
    /** @param {PESStorageData} result */ function (result) {
      let userConfirmation = window.confirm("Are you sure?");
      if (!userConfirmation) {
        return;
      }
      let selectOptionFMInside = result.selectOptionFMInside || FORMAT.PES5;

      if (selectOptionFMInside === FORMAT.PES5) {
        chrome.storage.local.remove(["playersData"], function () {
          console.log("Players5 deleted");
          alert("All players cleared!");
        });
      } else if (selectOptionFMInside === FORMAT.PES13) {
        chrome.storage.local.remove(["players13Data"], function () {
          console.log("Players13 deleted");
          alert("All players cleared!");
        });
      } else if (selectOptionFMInside === FORMAT.PES21) {
        chrome.storage.local.remove(["players21Data"], function () {
          console.log("Players21 deleted");
          alert("All players cleared!");
        });
      } else {
        alert("Unsupported option for " + selectOptionFMInside);
        return;
      }
    },
  );
}

function removeLastPlayer() {
  chrome.storage.local.get(
    ["playersData", "players13Data", "players21Data", "selectOptionFMInside"],
    /** @param {PESStorageData} result */ function (result) {
      let userConfirmation = window.confirm("Are you sure?");
      if (!userConfirmation) {
        return;
      }
      let selectOptionFMInside = result.selectOptionFMInside || FORMAT.PES5;
      let playersData = result.playersData || [];
      let players13Data = result.players13Data || [];
      let players21Data = result.players21Data || [];
      if (selectOptionFMInside === FORMAT.PES5 && playersData.length > 0) {
        let playerPopped = playersData.pop();
        console.log("Player removed" + playerPopped);
        chrome.storage.local.set({ playersData: playersData }, function () {
          alert("Last player from PES5 removed!");
        });
      } else if (
        selectOptionFMInside === FORMAT.PES13 &&
        players13Data.length > 0
      ) {
        let playerPopped = players13Data.pop();
        console.log("Player removed" + playerPopped);
        chrome.storage.local.set({ players13Data: players13Data }, function () {
          alert("Last player from PES13 removed!");
        });
      } else if (
        selectOptionFMInside === FORMAT.PES21 &&
        players21Data.length > 0
      ) {
        let playerPopped = players21Data.pop();
        console.log("Player removed" + playerPopped);
        chrome.storage.local.set({ players21Data: players21Data }, function () {
          alert("Last player from PES21 removed!");
        });
      } else {
        alert("Unsupported option for " + selectOptionFMInside);
      }
    },
  );
}
