var _ = require('lodash');

var ActionStore = function() {
  this.store = {};
};

ActionStore.prototype = {
  _getByKey: function(list, requestBody) {
    for (var i = 0; i < list.length; i++) {
      if (_.isEqual(list[i].requestBody, requestBody)) {
        return list[i];
      }
    }
    return null;
  },
  _containsKey: function(list, requestBody) {
    for (var i = 0; i < list.length; i++) {
      if (_.isEqual(list[i].requestBody, requestBody)) {
        return true;
      }
    }
    return false;
  },
  _overwriteKey: function(list, requestBody, action) {
    //returns true if found
    for (var i = 0; i < list.length; i++) {
      if (_.isEqual(list[i].requestBody, requestBody)) {
        list[i] = action;
        return true;
      }
    }
    return false;
  },
  _insertOnKey: function(list, requestBody, action) {
    if (!this._overwriteKey(list, requestBody, action)) {
      list.push(action);
    }
  },
  _put: function(path, method, action) {
    if (!this.store[path]) {
      this.store[path] = {};
    }
    if (action.requestBody !== undefined) {
      if (!this.store[path][method]) {
        this.store[path][method] = [];
      }
      if (!(this.store[path][method] instanceof Array)) {
        console.warn("Overwriting " + path + " had:", this.store[path][method]);
        this.store[path][method] = [];
      }
      this._insertOnKey(this.store[path][method], action.requestBody, action);
    } else {
      if (this.store[path][method] instanceof Array) {
        console.warn("Overwriting " + path + " had:", this.store[path][method]);
      }
      this.store[path][method] = action;
    }
  },
  addTestData: function(stubRequest) {
    if (!stubRequest) {
      throw "no stubRequest";
    }
    if (!stubRequest.path) {
      throw "missing stubRequest.path";
    }
    if (!stubRequest.method) {
      throw "missing stubRequest.method";
    }
    this._put(stubRequest.path, stubRequest.method, stubRequest);
  },
  getAction: function(path, method, body) {
    if (!this.store[path]) {
      return null;
    }
    if (!this.store[path][method]) {
      return null;
    }

    if (this.store[path][method] instanceof Array) {
      return this._getByKey(this.store[path][method], body);
    } else {
      return this.store[path][method];
    }
  }
};

module.exports = ActionStore;
