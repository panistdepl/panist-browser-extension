(function() {
  'use strict';
  var LAST_REFRESH = 'panist-last-refresh';

  /**
   * nettoie Storage si la donnée la plus ancienne à plus d'un jour.
   * @returns null
   */
  if (!Storage.prototype.refreshIfNeeded) {
    Storage.prototype.refreshIfNeeded = function() {
      var
        DAY         = 86400000,
        lastRefresh = this.getLastRefresh(),
        refreshTime = DAY
      ;

      if (!lastRefresh || +lastRefresh + refreshTime < Date.now()) {
        this.refresh();
      }
    };
  }

  if (!Storage.prototype.getLastRefresh) {
    Storage.prototype.getLastRefresh = function() {
      return this.getItem(LAST_REFRESH);
    };
  }

  if (!Storage.prototype.setLastRefresh) {
    Storage.prototype.setLastRefresh = function() {
      return this.setItemOrClear(LAST_REFRESH, Date.now());
    };
  }

  if (!Storage.prototype.refresh) {
    Storage.prototype.refresh = function() {
      this.clear();
      this.setLastRefresh();
    };
  }


  if (!Storage.prototype.setItemOrCLear) {
    Storage.prototype.setItemOrClear = function(keyName, keyValue) {
      try {
        this.setItem(keyName, keyValue);
      } catch (e) {
        if (e instanceof DOMException && e.name === 'QuotaExceededError') {
          this.refresh();
        } else {
          throw e;
        }
      }
    };
  }

}());
