document.addEventListener('DOMContentLoaded', function() {
    var redirectButton = document.getElementById('evoweb-button');
    redirectButton.addEventListener('click', function() {
      // Open a new tab
      chrome.tabs.create({ url: 'https://evoweb.uk/threads/pes-stats-copy-browser-extension-project-help-needed-from-stats-fans.94290' });
    });
  });
  