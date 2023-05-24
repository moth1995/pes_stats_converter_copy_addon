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
