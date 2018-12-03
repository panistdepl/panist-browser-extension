'use strict';
var browser = chrome || browser;
function handleInstalled(details) {
  console.log(details.reason);
  if (details.reason === 'install') {
    browser.tabs.create({
      url: browser.runtime.getURL('/options/options.html')
    });
  }
}

browser.runtime.onInstalled.addListener(handleInstalled);