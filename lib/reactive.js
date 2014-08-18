var Reactive = function(value) {
  var listeners = [];

  this.get = function() {
    return value;
  };

  this.set = function(v) {
    if (v === value) return this;
    value = v;
    for (var i = 0; i < listeners.length; i++) {
      var method = listeners[i];
      method(v);
    }
    return this;
  };

  this.onchange = function(method) {
    if (typeof method !== 'function') {
      throw new Error('onchange() needs to be provided a function');
    }
    listeners.push(method);
    return this;
  };

  this.cleanup = function() {
    listeners = [];
    return this;
  };

  this.map = function(method) {
    return (Reactive.lift(method)(this));
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

