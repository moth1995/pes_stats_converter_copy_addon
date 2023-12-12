document.addEventListener("DOMContentLoaded", function () {
    // Obtiene el elemento select
    const select = document.getElementById("selectOptionFMInside");
    console.log("Elemento select encontrado:", select);
  
    // Obtiene la opción guardada en la variable global (si existe)
    chrome.storage.local.get(["selectOptionFMInside"], function (result) {
      // Si no se encuentra la opción guardada, se establece como predeterminada "pes5"
      const selectedOption = result.selectOptionFMInside || "pes5";
      
      // Establece la opción seleccionada en el select
      select.value = selectedOption;
    });
  
    // Maneja el evento de cambio del select
    select.addEventListener("change", function () {
      const selectedValue = select.value;  
      // Guarda la opción seleccionada en el almacenamiento local
      chrome.storage.local.set({ selectOptionFMInside: selectedValue }, function () {
        console.log("Valor guardado en el almacenamiento local");
      });
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
  
  