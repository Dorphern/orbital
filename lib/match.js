
var Match = {};

Match.check = function(value, type) {
  var checkMethod = findCheckMethod(type);
  return checkMethod !== null && checkMethod(value, type);
}

/* Type Checks
 *==================================================*/
Match.String = function(v) {
  return typeof(v) === 'string'; 
}; 

Match.Number = function(v) {
  return typeof(v) === 'number';
};

Match.Boolean = function(v) {
  return typeof(v) === 'boolean';
};

Match.Function = function(v) {
  return typeof(v) === 'function';
};

Match.Undefined = function(v) {
  return typeof(v) === 'undefined';
};

Match.Null = function(v) {
  return v === null;
};

Match.Any = function() {
  return true;
};

Match.Object = function(v) {
  return false;
};

Match.Array = function(v, type) {
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
};

Match.Tuple = function() {
  var types = arguments || [];

  return function(values) {
    if (types.length !== values.length || !isArray(values)) return false;
    for (var i = 0; i < types.length; i++) {
      if ( !module.exports.check(values[i], types[i]) ) return false;
    }
    return true;
  };
}

// Makes a typecheck accept null as an alternative
Match.Nullable = function(type) {
  return function(value) {
    return typeIndex.Null(value) || 
      module.exports.check(value, type);
  };
};


/* Helper Checking Methods
 * ===============================================*/
var isArray = function(v) {
  return typeof(v) === 'object' && v.constructor.name === 'Array';
};

/* Type Index
 * ===============================================*/
var typeIndex = {
  String: Match.String,
  Number: Match.Number,
  Boolean: Match.Boolean,
  Function: Match.Function,
  Undefined: Match.Undefined,
  Null: Match.Null,
  Object: Match.Object,
  Array: Match.Array,
  Any: Match.Any,
  Tuple: Match.Tuple
};

var findCheckMethod = function(type) {
  var checkMethod = null;
  var typeName = typeof(type) !== 'undefined' && type.name; 
  if (isArray(type)) typeName = 'Array';
  if (typeof type === 'undefined') 
    throw new Error('Type is undefined');
  if (typeIndex[typeName]) {
    checkMethod = typeIndex[typeName];
  } else if (typeof(type) === 'function') {
    checkMethod = type;
  }
  return checkMethod;
};



module.exports = Match;

