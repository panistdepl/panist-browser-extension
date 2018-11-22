'use strict';

function handleInstalled(details) {
  console.log(details.reason);
  if (details.reason === 'install') {
    browser.storage.sync.set({ idc: null }, function () {
    });
    browser.tabs.create({
      url: browser.runtime.getURL('/options/options.html')
    });
  }
}

browser.runtime.onInstalled.addListener(handleInstalled);