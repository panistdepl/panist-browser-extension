'use strict';
var port = browser.runtime.connect(),
    page = {
      contentType: window.document.contentType
    }
  ;

port.postMessage(page);
