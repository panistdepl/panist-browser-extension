'use strict';
var whiteList = [
  'scholar.google.*',
  '*.wikipedia.org',
  'scholar.*.fr',
  '*' // Until we get better and/or configurable whitelist
],
  whiteListPatterns = whiteList.map(compileUrlPattern)
  ;


chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    if (request.btnExist) {
      chrome.tabs.query({ active: true, windowType: "normal", currentWindow: true }, function (d) {
        chrome.browserAction.setBadgeText({ text: " ", tabId: d[0].id });
        chrome.browserAction.setBadgeBackgroundColor({ color: "#28a745", tabId: d[0].id });
      })
    }
  });
chrome.runtime.onConnect.addListener(function (port) {

  port.onMessage.addListener(function (page) {
    
    if (!isContentTypeAllowed(page.contentType)
      || !isWhiteListed(port.sender.url)
    ) return;
    chrome.tabs.executeScript(port.sender.tab.id, { file: '/vendors/jquery.min.js' });
    chrome.tabs.executeScript(port.sender.tab.id, { file: '/vendors/lz-string.js' });
    chrome.tabs.executeScript(port.sender.tab.id, { file: '/content_scripts/log.js' });
    chrome.tabs.executeScript(port.sender.tab.id, { file: '/content_scripts/storage.js' });
    chrome.tabs.executeScript(port.sender.tab.id, { file: '/content_scripts/main.js' });
  });
});





chrome.browserAction.onClicked.addListener(function (tab) {
  chrome.tabs.create({ url: chrome.extension.getURL('options/options.html'), selected: true });
});



function isContentTypeAllowed(contentType) {
  var forbidenContentTypes = [
    'application/xml',
    'text/xml'
  ];

  return !~forbidenContentTypes.indexOf(contentType);
}

function isWhiteListed(url) {
  for (var i = 0; i < whiteListPatterns.length; ++i) {
    if (url.match(whiteListPatterns[i])) {
      return true;
    }
  }
  return false;
}

function escapeStringForRegex(str) {
  return str.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
}

function compileUrlPattern(url) {
  return new RegExp(
    escapeStringForRegex(url).replace('\\*', '.*'),
    'i'
  );
}

