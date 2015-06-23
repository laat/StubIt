var _ = require('lodash');

var ActionStore = function() {
  this.store = {};
};

ActionStore.prototype = {
  _getByKey: function(list, key) {
    for (var i = 0; i < list.length; i++) {
      if (_.isEqual(list[i].key, key)) {
        return list[i];
      }
    }
    return null;
  },
  _containsKey: function(list, key) {
    for (var i = 0; i < list.length; i++) {
      if (_.isEqual(list[i].key, key)) {
        return true;
      }
    }
    return false;
  },
  _overwriteKey: function(list, key, action) {
    //returns true if found
    for (var i = 0; i < list.length; i++) {
      if (_.isEqual(list[i].key, key)) {
        list[i] = action;
        return true;
      }
    }
    return false;
  },
  _insertOnKey: function(list, key, action) {
    if (!this._overwriteKey(list, key, action)) {
      list.push(action);
    }
  },
  _put: function(path, method, action) {
    if (!this.store[path]) {
      this.store[path] = {};
    }
    if (action.key !== undefined) {
      if (!this.store[path][method]) {
        this.store[path][method] = [];
      }
      if (!(this.store[path][method] instanceof Array)) {
        console.warn("Overskriver " + path + " hadde:", this.store[path][method]);
        this.store[path][method] = [];
      }
      this._insertOnKey(this.store[path][method], action.key, action);
    } else {
      if (this.store[path][method] instanceof Array) {
        console.warn("Overskriver " + path + " hadde:", this.store[path][method]);
      }
      this.store[path][method] = action;
    }
  },
  leggTilTestdata: function(action) {
    if (!action) {
      throw "ingen action";
    }
    if (!action.path) {
      throw "mangler action.path";
    }
    if (!action.method) {
      throw "mangler action.method";
    }
    if (!action.value) {
      throw "mangler action.value";
    }
    this._put(action.path, action.method, action);
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
