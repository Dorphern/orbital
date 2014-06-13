var Match = require('./match');

var Reactive = function(value) {
  var listeners = [];

  this.get = function() {
    return value;
  };

  this.set = function(v) {
    value = v;
    for (var i = 0; i < listeners.length; i++) {
      var method = listeners[i];
      method(v);
    }
    return this;
  };

  this.onchange = function(method) {
    if (Match.check(method, Function) === false) return false;
    listeners.push(method);
    return true;
  };

  this.cleanup = function() {
    listeners = [];
  };

  this.map = function(method) {
    var v = new Reactive();
    
    this.onchange(function(t) { v.set(method(t)); });
    v.set(method(this.get()));

    return v;
  };
};



/** Static methods
 ============================================================== */

Reactive.lift = function(method) {
  return function() {
    var bound = [];
    var v = new Reactive();

    var calculateValue = function() {
      var args = [];
      for (var i = 0; i < bound.length; i++) args.push(bound[i].get());
      v.set(method.apply(null, args));
    };

    for (var i = 0; i < arguments.length; i++) {
      if (arguments[i] instanceof Reactive === false)
        throw new Error('You can only provide your lifted'
                        + 'method with reactive variables');
      bound.push(arguments[i]);
      arguments[i].onchange(calculateValue);
    }
    calculateValue();

    return v;
  }
};



module.exports = Reactive;

