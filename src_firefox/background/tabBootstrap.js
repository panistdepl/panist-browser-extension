'use strict';
var whiteList = [
  'scholar.google.*',
  '*.wikipedia.org',
  'scholar.*.fr',
  '*' // Until we get better and/or configurable whitelist
],
  whiteListPatterns = whiteList.map(compileUrlPattern)
  ;


  browser.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    if (request.btnExist) {
      browser.tabs.query({ active: true, windowType: "normal", currentWindow: true }, function (d) {
        browser.browserAction.setBadgeBackgroundColor({ color: "green", tabId: d[0].id });
      })
    }
  });
  browser.runtime.onConnect.addListener(function (port) {

  port.onMessage.addListener(function (page) {

    if (!isContentTypeAllowed(page.contentType)
      || !isWhiteListed(port.sender.url)
    ) return;
    browser.tabs.executeScript(port.sender.tab.id, { file: '/vendors/jquery.min.js' });
    browser.tabs.executeScript(port.sender.tab.id, { file: '/vendors/lz-string.js' });
    browser.tabs.executeScript(port.sender.tab.id, { file: '/content_scripts/log.js' });
    browser.tabs.executeScript(port.sender.tab.id, { file: '/content_scripts/storage.js' });
    browser.tabs.executeScript(port.sender.tab.id, { file: '/content_scripts/main.js' });
  });
});





browser.browserAction.onClicked.addListener(function (tab) {
  var creating = browser.tabs.create({ url: browser.runtime.getURL('options/options.html') });
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

