document.addEventListener("DOMContentLoaded", function () {
    // Obtiene el elemento select
    const select = document.getElementById("selectOptionFMInside");
    console.log("Elemento select encontrado:", select);
  
    // Obtiene la opción guardada en la variable global (si existe)
    chrome.storage.local.get(["selectOptionFMInside"], function (result) {
      // Si no se encuentra la opción guardada, se establece como predeterminada "pes5"
      let selectedOption = result.selectOptionFMInside || "pes5";
      
      // Establece la opción seleccionada en el select
      select.value = selectedOption;
    });
  
    // Maneja el evento de cambio del select
    select.addEventListener("change", function () {
      let selectedValue = select.value;  
      // Guarda la opción seleccionada en el almacenamiento local
      chrome.storage.local.set({ selectOptionFMInside: selectedValue }, function () {
        console.log("Valor guardado en el almacenamiento local, nuevo valor:" + selectedValue);
      });
    });

    const sCopyMode = document.getElementById("selectCopyMode");
    console.log("Elemento select encontrado:", sCopyMode);

    sCopyMode.addEventListener("change", function () {
      let selectValue = sCopyMode.value;
      const csvButtonsDiv = document.getElementById("csv-buttons");
      if (selectValue == "multiple"){
        csvButtonsDiv.classList.add("active");
      } else {
        csvButtonsDiv.classList.remove("active");
      }
      // Guarda la opción seleccionada en el almacenamiento local
      chrome.storage.local.set({ selectCopyMode: selectValue }, function () {
        console.log("Valor guardado en el almacenamiento local, nuevo valor:" + selectValue);
      });
    });

    chrome.storage.local.get(["selectCopyMode"], function (result) {
      // Si no se encuentra la opción guardada, se establece como predeterminada "pes5"
      let selectedOption = result.selectCopyMode || "one";
      const csvButtonsDiv = document.getElementById("csv-buttons");
      if (selectedOption == "multiple"){
        csvButtonsDiv.classList.add("active");
      } else {
        csvButtonsDiv.classList.remove("active");
      }

      // Establece la opción seleccionada en el select
      sCopyMode.value = selectedOption;
    });
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
    });
});
});

document.addEventListener('DOMContentLoaded', function() {
var redirectButton = document.getElementById('evoweb-button');
redirectButton.addEventListener('click', function() {
    if (typeof chrome.tabs !== 'undefined') {
    // Desktop browsers
    chrome.tabs.create({ url: 'https://evoweb.uk/threads/94290' });
    } else if (typeof chrome.tabs.create === 'undefined') {
    // Mobile browsers (e.g., Kiwi Browser, Yandex Browser)
    window.open('https://evoweb.uk/threads/94290', '_blank');
    }
});
});

document.addEventListener('DOMContentLoaded', function() {
  var redirectButton = document.getElementById('privacy-button');
  redirectButton.addEventListener('click', function() {
      if (typeof chrome.tabs !== 'undefined') {
      // Desktop browsers
      chrome.tabs.create({ url: 'policy_privacy.html' });
      } else if (typeof chrome.tabs.create === 'undefined') {
      // Mobile browsers (e.g., Kiwi Browser, Yandex Browser)
      window.open('policy_privacy.html', '_blank');
      }
  });
  });


document.addEventListener('DOMContentLoaded', function() {
    const downloadCSVButton = document.getElementById('download-csv');
    const clearPlayersButton = document.getElementById('clear-players');

    downloadCSVButton.addEventListener('click', function() {
        DownloadCSV();
    });
    clearPlayersButton.addEventListener('click', function() {
        ClearPlayers();
    });

});
      

function DownloadCSV(){
    chrome.storage.local.get(
      ['playersData', 'players21Data', 'selectOptionFMInside',], 
      function(result) {
        let playersData = result.playersData || [];
        let players21Data = result.players21Data || [];
        let selectOptionFMInside = result.selectOptionFMInside || "pes5";

        let csvString = "";
        if (selectOptionFMInside === "pes5"){
          csvString = playersData.join("\n");
        } else if (selectOptionFMInside === "pes21"){
          csvString = players21Data.join("\n");
        } else {
          alert("Unsupported option for " + selectOptionFMInside);
          return;
        }

        let csvContent = "data:text/csv;charset=utf-8," + csvString;
    
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "Players.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    
        console.log(csvString);
        
      }
    );
}

function ClearPlayers() {
    chrome.storage.local.get(
      ['playersData', 'players21Data', 'selectOptionFMInside',], 
      function(result) {
        let userConfirmation = window.confirm("Are you sure?")
        if (!userConfirmation) {
            return;
        }
        let selectOptionFMInside = result.selectOptionFMInside || "pes5";

        if (selectOptionFMInside === "pes5"){
          chrome.storage.local.remove(['playersData'], function() {
            console.log('Players5 deleted');
            alert("All players cleared!")
          });
        } else if (selectOptionFMInside === "pes21"){
          chrome.storage.local.remove(['players21Data'], function() {
            console.log('Players21 deleted');
            alert("All players cleared!")
          });
        } else {
          alert("Unsupported option for " + selectOptionFMInside);
          return;
        }
      }
    );
    
}
