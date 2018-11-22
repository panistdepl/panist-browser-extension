'use strict';

// if mode is not 0, we are in installation and mode gives the number of tabs opened with plugin install, 
// otherwise mode is 0 and nothing shall be closed automatically to avoid an PANIST totalitarian behaviour
var mode = 0;
var optionsTabId;
var panistLibraryId = "2733342842941555958"; //2733342842941555958;

document.addEventListener('click', (e) => {

  if (e.target.classList.contains('accept')) {
    console.log('Accepter');

    mode = 2;

    chrome.tabs.query({ currentWindow: true, active: true }, function (optionTab) {
      optionsTabId = optionTab[0].id;

      $.ajax({
        url: "https://scholar.google.fr/scholar_setprefs?instq=istex",
        dataType: 'html'
      }).done(function (data) {
        var parser = new DOMParser(),
          doc = parser.parseFromString(data, "text/html");
        panistLibraryId = doc.getElementsByName('inst')[0].value;
        console.log(panistLibraryId);

        chrome.tabs.create({
          //url: "https://scholar.google.fr/scholar_setprefs?sciifh=1&inststart=0&num=10&scis=no&scisf=4&instq=panist&inst=3094930661629783031&context=panist&save=#2"
          url: "https://scholar.google.fr/scholar_setprefs?instq=istex&inst=" + panistLibraryId + "&ctxt=istex&save=#2"
        });

        chrome.tabs.create({
          //url: "https://scholar.google.fr/scholar_setprefs?sciifh=1&inststart=0&num=10&scis=no&scisf=4&instq=panist&inst=3094930661629783031&context=panist&save=#2"
          url: "https://scholar.google.com/scholar_setprefs?instq=istex&inst=" + panistLibraryId + "&ctxt=istex&save=#2"
        });


      });
    });
  };
  if (e.target.classList.contains('chooseEtab')) {
    var value = $(".etabList").val();
    chrome.browserAction.setBadgeText({ text: value });
    chrome.browserAction.setBadgeBackgroundColor({ color: "#6c757d" });
    chrome.storage.sync.set({ idc: value }, function () {
    });
    alert("Votre établissement est :\n" + $(".etabList").select2('data')[0].text);
    $('#warningMsg').hide();

  };
  if (e.target.classList.contains('skip')) {
    console.log('Passer');
    chrome.tabs.query({ currentWindow: true, active: true }, function (tab) {
      chrome.tabs.remove(tab[0].id);
    });
  };
});

var filter = {
  url: [{
    hostContains: "scholar.google"
  }]
};

var scholarTabsIds = [];

var listener = function (details) {
  // First time, we save
  if (scholarTabsIds.indexOf(details.tabId) === -1) {
    console.log('Complete ' + details.tabId);
    chrome.tabs.executeScript(details.tabId, {
      code: 'document.getElementsByName("save")[0].click();'
    }, function (result) {
      console.log('Script OK');
      scholarTabsIds.push(details.tabId);
    });
  } else {
    // Second time, we close
    console.log('AfterSave ' + details.tabId);
    chrome.tabs.remove(details.tabId);
    mode--;
    if (mode === 0) {
      chrome.webNavigation.onCompleted.removeListener(listener);
      chrome.tabs.remove(optionsTabId);
    }
  }
};
$(document).ready(function () {
  var idc;
  chrome.storage.sync.get(['idc'], function (result) {
    idc = result.idc;
    console.log("l'idc est : " + result.idc);
    if (idc != undefined) {
      chrome.browserAction.setBadgeText({ text: idc });
      chrome.browserAction.setBadgeBackgroundColor({ color: "#6c757d" });
      $('#warningMsg').hide();
    }
  });

  var xhr = new XMLHttpRequest();
  xhr.open("GET", "https://panistdepl.github.io/panist-browser-extension/19.11.18_listeInstitutions.json?date=" + Date.now(), true);
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      var data = JSON.parse(xhr.responseText)
      $('.etabList').select2({
        data: data,
        language: "fr",
        placeholder: "Sélectionner le nom de votre établissement"
      });
      if (idc != undefined) {
        $('.etabList').val(idc).trigger('change');

      }
    }
  }
  xhr.send();

});


chrome.webNavigation.onCompleted.addListener(listener, filter);
