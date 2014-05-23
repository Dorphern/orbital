/*
var Match = {};



Match.check = function(value, type) {
  var checkFunc = findCheckFunc(type);
  return checkFunc !== null && checkFunc(value, type);
}
*/


var TypeChecks = {
  // Primitive type matching
  String: function(v) {
    return typeof(v) === 'string'; 
  },
  Number: function(v) {
    return typeof(v) === 'number';
  },
  Boolean: function(v) {
    return typeof(v) === 'boolean';
  },
  Function: function(v) {
    return typeof(v) === 'function';
  },
  Undefined: function(v) {
    return typeof(v) === 'undefined';
  },
  Null: function(v) {
    return v === null;
  },
  
  // Advanced non primitive types
  Object: function(v) {
  
  },
  Array: function(v, type) {
    if (type.length > 1) 
      throw new Error('You can\'t check for multiple types in arrays');
    if (!isArray(v)) return false;
    // if the length of either the type or value is 0 we don't need to check
    if (v.length === 0 || type.length === 0 || type === Array) return true;
    var innerType = type[0];
    for (var i = 0; i < v.length; i++) {
      if (!module.exports.check(v[i], innerType)) return false;
    }
    return true;
  },
  Any: function(v) {
    return true;
  },
  Tuple: function() {
    var types = arguments || [];

    return function(values) {
      if (types.length !== values.length || !isArray(values)) return false;
      for (var i = 0; i < types.length; i++) {
        if ( !module.exports.check(values[i], types[i]) ) return false;
      }
      return true;
    };
  },
};

var isArray = function(v) {
  return typeof(v) === 'object' && v.constructor.name === 'Array';
};

// Makes a typecheck accept null as well
var Nullable = function(type) {
  return function(value) {
    return TypeChecks.Null(value) || 
      module.exports.check(value, type);
  };
};

// Find typecheck method to execute
var findCheckFunc = function(type) {
  var checkFunc = null;
  var typeName = typeof(type) !== 'undefined' && type.name; 
  if (isArray(type)) typeName = 'Array';
  if (typeof type === 'undefined') 
    throw new Error('Type is undefined');
  if (TypeChecks[typeName]) {
    checkFunc = TypeChecks[typeName];
  } else if (typeof(type) === 'function') {
    checkFunc = type;
  }
  return checkFunc;
};

module.exports = {
  check: function(value, type) {
    var checkFunc = findCheckFunc(type);
    return checkFunc !== null && checkFunc(value, type);
  },
  // Shorthand for writing Match.check(values, Match.Tuple(types))
  checkTuple: function(values, types) {
    return module.exports.check(values, TypeChecks.Tuple(types));
  },
  Undefined:    TypeChecks.Undefined,
  Null:         TypeChecks.Null,
  Any:          TypeChecks.Any,
  Nullable:     Nullable,
  Tuple:        TypeChecks.Tuple
};
