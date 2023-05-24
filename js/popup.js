document.addEventListener('DOMContentLoaded', function() {
    var redirectButton = document.getElementById('evoweb-button');
    redirectButton.addEventListener('click', function() {
      // Open a new tab
      chrome.tabs.create({ url: 'https://evoweb.uk/threads/94290' });
    });
  });
  