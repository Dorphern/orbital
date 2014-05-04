
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
  Array: function(v) {
    return false;
  },
  Any: function(v) {
    return true;
  },

  
};

// Makes a typecheck accept null as well
var Nullable = function(type) {
  return function(value) {
    return TypeChecks.Null(value) || 
      module.exports.check(value, type);
  };
}

// Find typecheck method to execute
var findCheckFunc = function(type) {
  var checkFunc = null;
  var typeName = typeof(type) !== 'undefined' && type.name; 
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
  Undefined:    TypeChecks.Undefined,
  Null:         TypeChecks.Null,
  Any:          TypeChecks.Any,
  Nullable:     Nullable
};
